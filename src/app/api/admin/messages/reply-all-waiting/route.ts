import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail, emailWrapper } from "@/lib/email";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * GET /api/admin/messages/reply-all-waiting
 * Get all conversations waiting for coach's reply
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !["ADMIN", "INSTRUCTOR", "MENTOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coachId = session.user.id;

    // Get all conversations where coach is involved
    const [sentTo, receivedFrom] = await Promise.all([
      prisma.message.findMany({
        where: { senderId: coachId },
        select: { receiverId: true },
        distinct: ["receiverId"],
      }),
      prisma.message.findMany({
        where: { receiverId: coachId },
        select: { senderId: true },
        distinct: ["senderId"],
      }),
    ]);

    const userIds = Array.from(new Set([
      ...sentTo.map(m => m.receiverId),
      ...receivedFrom.map(m => m.senderId),
    ]));

    if (userIds.length === 0) {
      return NextResponse.json({ conversations: [], count: 0 });
    }

    // Get last message for each conversation
    const waitingConversations = [];

    for (const userId of userIds) {
      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: coachId, receiverId: userId },
            { senderId: userId, receiverId: coachId },
          ],
        },
        orderBy: { createdAt: "desc" },
        include: {
          sender: {
            select: { id: true, firstName: true, lastName: true, email: true, avatar: true }
          },
          receiver: {
            select: { id: true, firstName: true, lastName: true, email: true, avatar: true }
          }
        }
      });

      // Only include if last message was FROM the user (waiting for coach reply)
      if (lastMessage && lastMessage.senderId === userId) {
        // Get last 5 messages for context
        const recentMessages = await prisma.message.findMany({
          where: {
            OR: [
              { senderId: coachId, receiverId: userId },
              { senderId: userId, receiverId: coachId },
            ],
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        });

        waitingConversations.push({
          userId,
          user: lastMessage.sender,
          lastMessage: lastMessage.content,
          lastMessageAt: lastMessage.createdAt,
          recentMessages: recentMessages.reverse().map(m => ({
            role: m.senderId === coachId ? "coach" : "student",
            content: m.content,
          })),
        });
      }
    }

    // Sort by oldest first (longest waiting)
    waitingConversations.sort((a, b) =>
      new Date(a.lastMessageAt).getTime() - new Date(b.lastMessageAt).getTime()
    );

    return NextResponse.json({
      conversations: waitingConversations,
      count: waitingConversations.length,
    });

  } catch (error) {
    console.error("Get waiting conversations error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

/**
 * POST /api/admin/messages/reply-all-waiting
 * Send AI-generated replies to all waiting conversations
 *
 * Body: { useAI: boolean, customMessage?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !["ADMIN", "INSTRUCTOR", "MENTOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { useAI = true, customMessage } = await request.json();
    const coachId = session.user.id;
    const coachName = session.user.firstName || "Sarah";

    // Get waiting conversations
    const getResponse = await fetch(new URL("/api/admin/messages/reply-all-waiting", request.url).toString(), {
      headers: { cookie: request.headers.get("cookie") || "" }
    });
    const { conversations } = await getResponse.json();

    if (!conversations || conversations.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No conversations waiting for reply",
        replied: 0,
      });
    }

    const results = [];

    for (const conv of conversations) {
      try {
        let replyMessage: string;

        if (customMessage) {
          // Use custom message (can include {name} placeholder)
          replyMessage = customMessage.replace(/{name}/g, conv.user.firstName || "there");
        } else if (useAI) {
          // Generate AI reply based on context
          const contextMessages = conv.recentMessages.map((m: { role: string; content: string }) =>
            `${m.role === "coach" ? "Coach" : "Student"}: ${m.content}`
          ).join("\n");

          const aiResponse = await anthropic.messages.create({
            model: "claude-3-5-haiku-20241022",
            max_tokens: 300,
            messages: [{
              role: "user",
              content: `You are Sarah, a warm and supportive health coaching mentor at AccrediPro Academy.

A student is waiting for your reply. Generate a brief, personalized response (2-3 sentences max).

Student's name: ${conv.user.firstName || "there"}
Recent conversation:
${contextMessages}

Reply naturally and warmly. Be helpful but concise. Don't use emojis excessively. Sign off as Sarah if appropriate.`
            }],
          });

          replyMessage = (aiResponse.content[0] as { text: string }).text;
        } else {
          // Default message
          replyMessage = `Hi ${conv.user.firstName || "there"}! Thanks for your message. I'll get back to you with a detailed response soon. In the meantime, feel free to continue with your coursework!`;
        }

        // Create the message
        const message = await prisma.message.create({
          data: {
            senderId: coachId,
            receiverId: conv.userId,
            content: replyMessage,
            messageType: "DIRECT",
          },
        });

        // Create notification
        await prisma.notification.create({
          data: {
            userId: conv.userId,
            type: "NEW_MESSAGE",
            title: "New Message",
            message: `${coachName} sent you a message`,
            data: { messageId: message.id, senderId: coachId },
          },
        });

        // Send email notification
        if (conv.user.email) {
          const emailContent = `
            <h2 style="color: #722F37; margin-bottom: 20px;">New message from ${coachName}</h2>
            <div style="background: #f8f4f4; padding: 20px; border-radius: 8px; border-left: 4px solid #722F37; margin: 20px 0;">
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333;">
                "${replyMessage.length > 200 ? replyMessage.substring(0, 200) + "..." : replyMessage}"
              </p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://learn.accredipro.academy/messages"
                 style="background: #722F37; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                View & Reply
              </a>
            </div>
          `;

          await sendEmail({
            to: conv.user.email,
            subject: `💬 ${coachName} replied to your message`,
            html: emailWrapper(emailContent, `${coachName} sent you a message`),
          }).catch(err => console.error(`Failed to email ${conv.user.email}:`, err));
        }

        results.push({
          userId: conv.userId,
          name: `${conv.user.firstName} ${conv.user.lastName}`,
          success: true,
          message: replyMessage.substring(0, 100) + (replyMessage.length > 100 ? "..." : ""),
        });

        console.log(`[BULK-REPLY] Sent reply to ${conv.user.firstName} ${conv.user.lastName}`);

      } catch (convError) {
        console.error(`Failed to reply to ${conv.userId}:`, convError);
        results.push({
          userId: conv.userId,
          name: `${conv.user.firstName} ${conv.user.lastName}`,
          success: false,
          error: String(convError),
        });
      }
    }

    const successCount = results.filter(r => r.success).length;

    return NextResponse.json({
      success: true,
      message: `Replied to ${successCount}/${conversations.length} conversations`,
      replied: successCount,
      total: conversations.length,
      results,
    });

  } catch (error) {
    console.error("Reply all waiting error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
