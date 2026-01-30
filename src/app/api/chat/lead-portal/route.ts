import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Sarah's coach user ID - will be looked up dynamically
const SARAH_EMAIL = "sarah@accredipro.academy";

// GET /api/chat/lead-portal - Fetch messages for the current user with Sarah
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Get Sarah's user ID
        const sarah = await prisma.user.findFirst({
            where: { email: SARAH_EMAIL },
            select: { id: true },
        });

        if (!sarah) {
            // Return empty if Sarah doesn't exist yet
            return NextResponse.json({ messages: [] });
        }

        // Fetch messages between user and Sarah (both directions)
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: sarah.id },
                    { senderId: sarah.id, receiverId: userId },
                ],
            },
            orderBy: { createdAt: "asc" },
            select: {
                id: true,
                content: true,
                senderId: true,
                createdAt: true,
                isRead: true,
            },
        });

        // Format messages for the chat
        const formattedMessages = messages.map((msg) => ({
            id: msg.id,
            content: msg.content,
            isUser: msg.senderId === userId,
            timestamp: msg.createdAt.toISOString(),
            isRead: msg.isRead,
        }));

        return NextResponse.json({ messages: formattedMessages });
    } catch (error) {
        console.error("[lead-portal-chat] GET error:", error);
        return NextResponse.json(
            { error: "Failed to fetch messages", messages: [] },
            { status: 500 }
        );
    }
}

// POST /api/chat/lead-portal - Send a message to Sarah
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await request.json();
        const { message, niche } = body;

        if (!message || typeof message !== "string" || message.trim().length === 0) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // Get or create Sarah's user
        let sarah = await prisma.user.findFirst({
            where: { email: SARAH_EMAIL },
            select: { id: true },
        });

        if (!sarah) {
            // Create Sarah as a system user if doesn't exist
            sarah = await prisma.user.create({
                data: {
                    email: SARAH_EMAIL,
                    firstName: "Sarah",
                    lastName: "Coach",
                    role: "ADMIN",
                },
                select: { id: true },
            });
        }

        // Create the message
        const newMessage = await prisma.message.create({
            data: {
                content: message.trim(),
                senderId: userId,
                receiverId: sarah.id,
                messageType: "DIRECT",
            },
            select: {
                id: true,
                content: true,
                senderId: true,
                createdAt: true,
            },
        });

        // Tag the user for chat engagement tracking
        if (niche) {
            await prisma.userTag.upsert({
                where: {
                    userId_tag: {
                        userId,
                        tag: `chat:${niche}`,
                    },
                },
                create: {
                    userId,
                    tag: `chat:${niche}`,
                },
                update: {
                    createdAt: new Date(),
                },
            });
        }

        return NextResponse.json({
            success: true,
            message: {
                id: newMessage.id,
                content: newMessage.content,
                isUser: true,
                timestamp: newMessage.createdAt.toISOString(),
            },
        });
    } catch (error) {
        console.error("[lead-portal-chat] POST error:", error);
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        );
    }
}
