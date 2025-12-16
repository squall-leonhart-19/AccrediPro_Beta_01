import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { minAdd = 4, maxAdd = 19 } = body;

    // Get all posts
    const posts = await prisma.communityPost.findMany({
      select: {
        id: true,
        reactions: true,
        likeCount: true,
      },
    });

    const EMOJIS = ["❤️", "🔥", "👏", "💯", "🎉", "💪", "⭐", "🙌"];
    let updatedCount = 0;

    for (const post of posts) {
      // Get current reactions or empty object
      const currentReactions = (post.reactions as Record<string, number>) || {};

      // Add random amount (between minAdd and maxAdd) to each emoji
      const updatedReactions: Record<string, number> = {};

      for (const emoji of EMOJIS) {
        const randomAdd = Math.floor(Math.random() * (maxAdd - minAdd + 1)) + minAdd;
        updatedReactions[emoji] = (currentReactions[emoji] || 0) + randomAdd;
      }

      // Calculate new total
      const totalLikes = Object.values(updatedReactions).reduce(
        (sum, count) => sum + (count || 0), 0
      );

      await prisma.communityPost.update({
        where: { id: post.id },
        data: {
          reactions: updatedReactions,
          likeCount: totalLikes,
        },
      });

      updatedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Added ${minAdd}-${maxAdd} reactions to all ${updatedCount} posts`,
      updatedCount,
    });
  } catch (error) {
    console.error("Error bulk adding reactions:", error);
    return NextResponse.json(
      { error: "Failed to bulk add reactions" },
      { status: 500 }
    );
  }
}
