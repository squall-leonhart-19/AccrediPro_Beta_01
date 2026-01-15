import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail, emailWrapper } from "@/lib/email";
import { notifyNewMessage } from "@/lib/push-notifications";

// Track last email sent per conversation (in-memory, reset on server restart)
const lastEmailSent: Map<string, number> = new Map();
const EMAIL_RATE_LIMIT_MS = 15 * 60 * 1000; // 15 minutes

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
    const cursor = searchParams.get("cursor"); // For pagination - load older messages
    const limit = parseInt(searchParams.get("limit") || "50");

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
        ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
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
      orderBy: { createdAt: "desc" }, // Get most recent first
      take: limit + 1, // Take one extra to check if more exist
    });

    // Check if there are more older messages
    const hasMore = messages.length > limit;
    const messagesList = hasMore ? messages.slice(0, -1) : messages;

    // Reverse to show oldest first in the chat
    messagesList.reverse();

    // Mark received messages as read (only on initial load, not on "load more")
    if (!cursor) {
      await prisma.message.updateMany({
        where: {
          senderId: userId,
          receiverId: session.user.id,
          isRead: false,
        },
        data: { isRead: true },
      });
    }

    return NextResponse.json({
      success: true,
      data: messagesList,
      hasMore,
      nextCursor: hasMore && messagesList.length > 0 ? messagesList[0].createdAt : null,
    });
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

    // ===== SEND PUSH NOTIFICATION =====
    try {
      const senderName = session.user.firstName || "Someone";
      const messagePreview = content
        ? content
        : attachmentType === "voice" ? "Sent you a voice message"
          : attachmentType === "image" ? "Sent you an image"
            : "Sent you a message";

      await notifyNewMessage(
        receiverId,
        senderName,
        messagePreview,
        `/messages?user=${session.user.id}`
      );
    } catch (pushError) {
      console.error("[DM] Push notification error:", pushError);
      // Don't fail the request if push fails
    }

    // ===== SEND EMAIL NOTIFICATION (with rate limiting) =====
    const conversationKey = [session.user.id, receiverId].sort().join("-");
    const lastSent = lastEmailSent.get(conversationKey) || 0;
    const now = Date.now();

    if (now - lastSent > EMAIL_RATE_LIMIT_MS) {
      // Get receiver's email
      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
        select: { email: true, firstName: true },
      });

      if (receiver?.email) {
        const senderName = session.user.firstName || "Your coach";
        const messagePreview = content
          ? (content.length > 150 ? content.substring(0, 150) + "..." : content)
          : attachmentType === "voice" ? "🎤 Voice message"
            : attachmentType === "image" ? "📷 Image"
              : "New message";

        const emailContent = `
          <h2 style="color: #722F37; margin-bottom: 20px;">New message from ${senderName}</h2>
          <div style="background: #f8f4f4; padding: 20px; border-radius: 8px; border-left: 4px solid #722F37; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333;">
              "${messagePreview}"
            </p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://learn.accredipro.academy/messages" 
               style="background: #722F37; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              View Message
            </a>
          </div>
          <p style="color: #999; font-size: 13px; margin-top: 30px;">
            You can also reply directly from your AccrediPro portal.
          </p>
        `;

        try {
          await sendEmail({
            to: receiver.email,
            subject: `💬 New message from ${senderName}`,
            html: emailWrapper(emailContent, `${senderName} sent you a message`),
          });
          lastEmailSent.set(conversationKey, now);
          console.log(`[DM] Email notification sent to ${receiver.email}`);
        } catch (emailError) {
          console.error(`[DM] Failed to send email notification:`, emailError);
          // Don't fail the whole request if email fails
        }
      }
    } else {
      console.log(`[DM] Email rate limited for conversation ${conversationKey}`);
    }

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}
