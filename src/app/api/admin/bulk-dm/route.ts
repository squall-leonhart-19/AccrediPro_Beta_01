import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin/mentor access
    if (session.user.role !== "ADMIN" && session.user.role !== "MENTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userIds, message } = await request.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "No users specified" }, { status: 400 });
    }

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Get or create coach user (Sarah) for sending DMs
    let coachUser = await prisma.user.findFirst({
      where: { role: "MENTOR" },
      select: { id: true },
    });

    if (!coachUser) {
      // Fallback to admin sender
      coachUser = { id: session.user.id };
    }

    // Create DM conversations and messages for each user
    let sentCount = 0;
    const errors: string[] = [];

    for (const userId of userIds) {
      try {
        // Find or create conversation between coach and user
        let conversation = await prisma.conversation.findFirst({
          where: {
            participants: {
              every: {
                userId: { in: [coachUser.id, userId] }
              }
            }
          },
          select: { id: true },
        });

        if (!conversation) {
          // Create new conversation
          conversation = await prisma.conversation.create({
            data: {
              participants: {
                create: [
                  { userId: coachUser.id },
                  { userId: userId },
                ],
              },
            },
            select: { id: true },
          });
        }

        // Create the message
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderId: coachUser.id,
            content: message.trim(),
          },
        });

        // Update conversation timestamp
        await prisma.conversation.update({
          where: { id: conversation.id },
          data: { updatedAt: new Date() },
        });

        sentCount++;
      } catch (err) {
        console.error(`Failed to send DM to user ${userId}:`, err);
        errors.push(userId);
      }
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error) {
    console.error("Bulk DM error:", error);
    return NextResponse.json(
      { error: "Failed to send messages" },
      { status: 500 }
    );
  }
}
