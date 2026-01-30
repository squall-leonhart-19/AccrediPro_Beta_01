import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail, emailWrapper } from "@/lib/email";
import { notifyNewMessage } from "@/lib/push-notifications";
import { apiRateLimiter } from "@/lib/redis";

// Track last email sent per conversation (in-memory, reset on server restart)
// With TTL cleanup to prevent memory leak
const lastEmailSent: Map<string, number> = new Map();
const EMAIL_RATE_LIMIT_MS = 15 * 60 * 1000; // 15 minutes
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // Cleanup every hour
const MAX_MAP_SIZE = 10000; // Safety limit

// Cleanup old entries periodically
function cleanupRateLimitMap() {
  const now = Date.now();
  const cutoff = now - EMAIL_RATE_LIMIT_MS * 2; // Remove entries older than 2x rate limit

  for (const [key, timestamp] of lastEmailSent.entries()) {
    if (timestamp < cutoff) {
      lastEmailSent.delete(key);
    }
  }

  // Safety: if still too large, clear oldest half
  if (lastEmailSent.size > MAX_MAP_SIZE) {
    const entries = Array.from(lastEmailSent.entries())
      .sort((a, b) => a[1] - b[1])
      .slice(0, Math.floor(MAX_MAP_SIZE / 2));
    for (const [key] of entries) {
      lastEmailSent.delete(key);
    }
  }
}

// Run cleanup on module load and set interval
cleanupRateLimitMap();
setInterval(cleanupRateLimitMap, CLEANUP_INTERVAL_MS);

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

    // Rate limiting using Upstash Redis (distributed, works across serverless instances)
    try {
      const { success: rateLimitOk } = await apiRateLimiter.limit(session.user.id);
      if (!rateLimitOk) {
        return NextResponse.json(
          { success: false, error: "Too many requests. Please slow down." },
          { status: 429 }
        );
      }
    } catch (rateLimitError) {
      // If Redis is down, continue without rate limiting (fail open)
      console.warn("Rate limiter unavailable:", rateLimitError);
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

// DELETE - Delete a message (admin/mentor only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin/mentor
    const allowedRoles = ["ADMIN", "INSTRUCTOR", "MENTOR"];
    if (!allowedRoles.includes(session.user.role as string)) {
      return NextResponse.json(
        { success: false, error: "Only admins and mentors can delete messages" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("messageId");

    if (!messageId) {
      return NextResponse.json(
        { success: false, error: "Message ID required" },
        { status: 400 }
      );
    }

    // Delete any reactions first (due to foreign key constraint)
    await prisma.messageReaction.deleteMany({
      where: { messageId },
    });

    // Delete replies to this message (update replyToId to null)
    await prisma.message.updateMany({
      where: { replyToId: messageId },
      data: { replyToId: null },
    });

    // Delete the message
    const deletedMessage = await prisma.message.delete({
      where: { id: messageId },
    });

    console.log(`[MESSAGES] Message ${messageId} deleted by ${session.user.email}`);

    return NextResponse.json({ success: true, data: deletedMessage });
  } catch (error) {
    console.error("Delete message error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete message" },
      { status: 500 }
    );
  }
}
