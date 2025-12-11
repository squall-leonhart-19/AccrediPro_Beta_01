import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: List scheduled messages
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const messages = await prisma.message.findMany({
            where: {
                senderId: session.user.id,
                isScheduled: true,
                scheduledAt: {
                    gte: new Date(),
                },
            },
            orderBy: { scheduledAt: "asc" },
            include: {
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
        });
    } catch (error) {
        console.error("Get scheduled messages error:", error);
        return NextResponse.json({ error: "Failed to get scheduled messages" }, { status: 500 });
    }
}

// POST: Create a scheduled message
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { receiverId, content, scheduledAt } = await req.json();

        if (!receiverId || !content || !scheduledAt) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const scheduledDate = new Date(scheduledAt);
        if (scheduledDate <= new Date()) {
            return NextResponse.json({ error: "Scheduled time must be in the future" }, { status: 400 });
        }

        const message = await prisma.message.create({
            data: {
                senderId: session.user.id,
                receiverId,
                content,
                isScheduled: true,
                scheduledAt: scheduledDate,
            },
            include: {
                receiver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: message,
        });
    } catch (error) {
        console.error("Create scheduled message error:", error);
        return NextResponse.json({ error: "Failed to schedule message" }, { status: 500 });
    }
}

// DELETE: Cancel a scheduled message
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const messageId = searchParams.get("id");

        if (!messageId) {
            return NextResponse.json({ error: "Missing message ID" }, { status: 400 });
        }

        // Only allow deleting own scheduled messages
        const deleted = await prisma.message.deleteMany({
            where: {
                id: messageId,
                senderId: session.user.id,
                isScheduled: true,
            },
        });

        if (deleted.count === 0) {
            return NextResponse.json({ error: "Scheduled message not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Cancel scheduled message error:", error);
        return NextResponse.json({ error: "Failed to cancel scheduled message" }, { status: 500 });
    }
}
