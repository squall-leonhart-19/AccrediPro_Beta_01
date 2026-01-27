import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/vsl/chat
 * Fetch zombie chat messages for a specific video time range
 * Query params: from (start seconds), to (end seconds)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const from = parseInt(searchParams.get("from") || "0");
        const to = parseInt(searchParams.get("to") || "0");

        if (to <= from) {
            return NextResponse.json({ messages: [] });
        }

        const messages = await prisma.zombieChatMessage.findMany({
            where: {
                videoTime: {
                    gte: from,
                    lt: to,
                },
                isActive: true,
            },
            include: {
                profile: {
                    select: {
                        name: true,
                        avatar: true,
                        location: true,
                    },
                },
            },
            orderBy: {
                videoTime: "asc",
            },
        });

        return NextResponse.json({ messages });
    } catch (error) {
        console.error("Error fetching VSL chat messages:", error);
        return NextResponse.json(
            { error: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}
