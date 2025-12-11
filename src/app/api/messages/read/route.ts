import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST: Mark messages as read
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { senderId } = await req.json();

        if (!senderId) {
            return NextResponse.json({ error: "Missing senderId" }, { status: 400 });
        }

        // Mark all unread messages from this sender as read
        const result = await prisma.message.updateMany({
            where: {
                senderId,
                receiverId: session.user.id,
                isRead: false,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            markedCount: result.count,
        });
    } catch (error) {
        console.error("Mark as read error:", error);
        return NextResponse.json({ error: "Failed to mark messages as read" }, { status: 500 });
    }
}
