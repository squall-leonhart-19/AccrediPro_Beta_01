import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/pod/message - Load user's messages from database
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get all messages for this user from the database
        const messages = await prisma.podUserMessage.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "asc" },
            select: {
                id: true,
                content: true,
                aiResponderName: true,
                aiResponse: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ success: true, messages });
    } catch (error) {
        console.error("[Pod Message GET] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/pod/message - Save user message to database
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { content, daysSinceEnrollment, aiResponderName, aiResponse } = body;

        if (!content || typeof daysSinceEnrollment !== "number") {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Save message to database
        const message = await prisma.podUserMessage.create({
            data: {
                userId: session.user.id,
                content: content.substring(0, 5000), // Limit content length
                daysSinceEnrollment,
                aiResponderName: aiResponderName || null,
                aiResponse: aiResponse?.substring(0, 5000) || null,
            },
        });

        return NextResponse.json({ success: true, id: message.id });
    } catch (error) {
        console.error("[Pod Message] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PATCH /api/pod/message - Update message with AI response
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { messageId, aiResponderName, aiResponse } = body;

        if (!messageId || !aiResponderName || !aiResponse) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Verify the message belongs to this user
        const existing = await prisma.podUserMessage.findFirst({
            where: { id: messageId, userId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json({ error: "Message not found" }, { status: 404 });
        }

        // Update with AI response
        await prisma.podUserMessage.update({
            where: { id: messageId },
            data: {
                aiResponderName,
                aiResponse: aiResponse.substring(0, 5000),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[Pod Message PATCH] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
