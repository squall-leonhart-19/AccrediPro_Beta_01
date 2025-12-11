import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Add/toggle reaction
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messageId, emoji } = await req.json();

    if (!messageId || !emoji) {
      return NextResponse.json({ error: "Missing messageId or emoji" }, { status: 400 });
    }

    // Check if reaction already exists
    const existingReaction = await prisma.messageReaction.findUnique({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId: session.user.id,
          emoji,
        },
      },
    });

    if (existingReaction) {
      // Remove reaction (toggle off)
      await prisma.messageReaction.delete({
        where: { id: existingReaction.id },
      });

      return NextResponse.json({
        success: true,
        action: "removed",
        messageId,
        emoji,
      });
    }

    // Add reaction
    const reaction = await prisma.messageReaction.create({
      data: {
        messageId,
        userId: session.user.id,
        emoji,
      },
    });

    return NextResponse.json({
      success: true,
      action: "added",
      reaction,
    });
  } catch (error) {
    console.error("Reaction error:", error);
    return NextResponse.json(
      { error: "Failed to update reaction" },
      { status: 500 }
    );
  }
}

// Get reactions for a message
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get("messageId");

    if (!messageId) {
      return NextResponse.json({ error: "Missing messageId" }, { status: 400 });
    }

    const reactions = await prisma.messageReaction.findMany({
      where: { messageId },
    });

    // Group reactions by emoji
    const grouped = reactions.reduce((acc, r) => {
      if (!acc[r.emoji]) {
        acc[r.emoji] = { count: 0, users: [], hasReacted: false };
      }
      acc[r.emoji].count++;
      acc[r.emoji].users.push(r.userId);
      if (r.userId === session.user.id) {
        acc[r.emoji].hasReacted = true;
      }
      return acc;
    }, {} as Record<string, { count: number; users: string[]; hasReacted: boolean }>);

    return NextResponse.json({
      success: true,
      reactions: grouped,
    });
  } catch (error) {
    console.error("Get reactions error:", error);
    return NextResponse.json(
      { error: "Failed to get reactions" },
      { status: 500 }
    );
  }
}
