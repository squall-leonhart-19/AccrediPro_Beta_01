import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: Search messages
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");
        const userId = searchParams.get("userId"); // Optional: limit to specific conversation

        if (!query || query.length < 2) {
            return NextResponse.json({ error: "Query must be at least 2 characters" }, { status: 400 });
        }

        // Build where clause
        const whereClause: Record<string, unknown> = {
            content: {
                contains: query,
                mode: "insensitive",
            },
            OR: [
                { senderId: session.user.id },
                { receiverId: session.user.id },
            ],
        };

        // If userId is provided, limit to that conversation
        if (userId) {
            whereClause.AND = [
                {
                    OR: [
                        { senderId: session.user.id, receiverId: userId },
                        { senderId: userId, receiverId: session.user.id },
                    ],
                },
            ];
            delete whereClause.OR;
        }

        // Search messages
        const messages = await prisma.message.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            take: 50,
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: messages,
            total: messages.length,
        });
    } catch (error) {
        console.error("Search messages error:", error);
        return NextResponse.json({ error: "Failed to search messages" }, { status: 500 });
    }
}
