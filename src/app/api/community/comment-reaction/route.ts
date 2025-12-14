import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const ALLOWED_EMOJIS = ["❤️", "🔥", "👏", "💯", "🎉", "💪", "⭐", "🙌"];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { commentId, emoji } = await request.json();

    if (!commentId || !emoji) {
      return NextResponse.json(
        { success: false, error: "Comment ID and emoji are required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_EMOJIS.includes(emoji)) {
      return NextResponse.json(
        { success: false, error: "Invalid emoji" },
        { status: 400 }
      );
    }

    // Check if user already has this reaction
    const existingReaction = await prisma.commentReaction.findUnique({
      where: {
        commentId_userId_emoji: {
          commentId,
          userId: session.user.id,
          emoji,
        },
      },
    });

    if (existingReaction) {
      // Remove the reaction
      await prisma.commentReaction.delete({
        where: { id: existingReaction.id },
      });

      // Get updated reactions
      const reactions = await getReactionCounts(commentId);

      return NextResponse.json({
        success: true,
        action: "removed",
        emoji,
        reactions,
        message: "Reaction removed",
      });
    } else {
      // Add the reaction
      await prisma.commentReaction.create({
        data: {
          commentId,
          userId: session.user.id,
          emoji,
        },
      });

      // Get updated reactions
      const reactions = await getReactionCounts(commentId);

      return NextResponse.json({
        success: true,
        action: "added",
        emoji,
        reactions,
        message: "Reaction added",
      });
    }
  } catch (error) {
    console.error("Comment reaction error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle reaction" },
      { status: 500 }
    );
  }
}

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
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { success: false, error: "Comment ID is required" },
        { status: 400 }
      );
    }

    const reactions = await getReactionCounts(commentId);
    const userReactions = await prisma.commentReaction.findMany({
      where: {
        commentId,
        userId: session.user.id,
      },
      select: { emoji: true },
    });

    return NextResponse.json({
      success: true,
      reactions,
      userReactions: userReactions.map((r) => r.emoji),
    });
  } catch (error) {
    console.error("Get comment reactions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get reactions" },
      { status: 500 }
    );
  }
}

async function getReactionCounts(commentId: string) {
  const reactions = await prisma.commentReaction.groupBy({
    by: ["emoji"],
    where: { commentId },
    _count: { emoji: true },
  });

  return reactions.reduce(
    (acc, r) => {
      acc[r.emoji] = r._count.emoji;
      return acc;
    },
    {} as Record<string, number>
  );
}
