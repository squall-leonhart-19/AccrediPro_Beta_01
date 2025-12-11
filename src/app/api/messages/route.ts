import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch messages with a specific user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID required" },
        { status: 400 }
      );
    }

    // Get messages between current user and specified user (with reactions and replies)
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: userId },
          { senderId: userId, receiverId: session.user.id },
        ],
      },
      include: {
        reactions: true,
        replyTo: {
          select: {
            id: true,
            content: true,
            senderId: true,
            attachmentType: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    // Mark received messages as read
    await prisma.message.updateMany({
      where: {
        senderId: userId,
        receiverId: session.user.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST - Send a new message
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      receiverId,
      content,
      attachmentUrl,
      attachmentType,
      attachmentName,
      voiceDuration,
      replyToId,
      isAiVoice,
      transcription,
    } = await request.json();

    if (!receiverId || (!content && !attachmentUrl)) {
      return NextResponse.json(
        { success: false, error: "Receiver ID and content or attachment required" },
        { status: 400 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        content: content || "",
        messageType: "DIRECT",
        attachmentUrl,
        attachmentType,
        attachmentName,
        voiceDuration,
        replyToId,
        isAiVoice: isAiVoice || false,
        transcription,
      },
      include: {
        reactions: true,
        replyTo: {
          select: {
            id: true,
            content: true,
            senderId: true,
            attachmentType: true,
          },
        },
      },
    });

    // Create notification for receiver
    let notificationMessage = `${session.user.firstName || "Someone"} sent you a message`;
    if (attachmentType === "voice") {
      notificationMessage = `${session.user.firstName || "Someone"} sent you a voice message`;
    } else if (attachmentType === "image") {
      notificationMessage = `${session.user.firstName || "Someone"} sent you an image`;
    }

    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: "NEW_MESSAGE",
        title: "New Message",
        message: notificationMessage,
        data: { messageId: message.id, senderId: session.user.id },
      },
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}
