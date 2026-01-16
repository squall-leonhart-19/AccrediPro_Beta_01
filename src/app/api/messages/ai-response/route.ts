import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * API route to save AI-generated responses as messages
 * This allows Sarah's AI responses to be persisted in the message history
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { senderId, receiverId, content } = await request.json();

        if (!senderId || !receiverId || !content) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Verify the receiver is the current user (security check)
        if (receiverId !== session.user.id) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 403 }
            );
        }

        // Create the AI response message
        const message = await prisma.message.create({
            data: {
                senderId,
                receiverId,
                content,
                messageType: "DIRECT",
                isRead: true, // Mark as read since user just saw it
            },
        });

        return NextResponse.json({ success: true, data: message });
    } catch (error) {
        console.error("Save AI response error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to save AI response" },
            { status: 500 }
        );
    }
}
