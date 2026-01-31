import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/messages/unanswered - Get most recent unread message from a coach/mentor
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // Find the most recent unread message from any COACH/MENTOR/ADMIN
        const unreadMessage = await prisma.message.findFirst({
            where: {
                receiverId: session.user.id,
                isRead: false,
                sender: {
                    role: { in: ["ADMIN", "MENTOR", "INSTRUCTOR"] },
                },
            },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                content: true,
                createdAt: true,
                sender: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
        });

        if (!unreadMessage) {
            return NextResponse.json({ success: true, message: null });
        }

        return NextResponse.json({
            success: true,
            message: {
                id: unreadMessage.id,
                content: unreadMessage.content || "",
                senderName: unreadMessage.sender.firstName || "Sarah",
                senderAvatar: unreadMessage.sender.avatar,
                createdAt: unreadMessage.createdAt.toISOString(),
            },
        });
    } catch (error) {
        console.error("[Unanswered Messages API]", error);
        return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
    }
}
