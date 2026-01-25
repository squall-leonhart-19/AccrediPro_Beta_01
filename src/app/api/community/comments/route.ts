import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Banned keywords for auto-moderation (server-side check)
// Using word boundaries to avoid false positives
const BANNED_KEYWORDS = [
  "refund",
  "scam",
  "fraud",
  "lawsuit",
  "sue",
  "money back",
  "rip off",
  "ripoff",
  "waste of money",
  "pyramid scheme",
  "mlm",
];

function containsBannedContent(text: string): { banned: boolean; keyword?: string } {
  const lowerText = text.toLowerCase();
  for (const keyword of BANNED_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'i');
    if (regex.test(lowerText)) {
      console.log(`[MODERATION] Blocked comment containing: "${keyword}"`);
      return { banned: true, keyword };
    }
  }
  return { banned: false };
}

// The introduction post ID for "Share Your Story" XP tracking
const INTRO_POST_ID = "cmktszaw30000fqm97xx6xrck";

// GET - Load more comments with pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const cursor = searchParams.get("cursor"); // Last comment ID for cursor pagination
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!postId) {
      return NextResponse.json({ success: false, error: "Post ID is required" }, { status: 400 });
    }

    const comments = await prisma.postComment.findMany({
      where: {
        postId,
        parentId: null, // Only top-level comments
        ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {})
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true,
          },
        },
        likes: {
          where: { userId: session.user.id },
          select: { id: true },
        },
        reactions: {
          select: { emoji: true, userId: true },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                role: true,
              },
            },
            likes: {
              where: { userId: session.user.id },
              select: { id: true },
            },
            reactions: {
              select: { emoji: true, userId: true },
            },
          },
          orderBy: { createdAt: "asc" },
          take: 3, // Limit replies per comment
        },
        _count: {
          select: { replies: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1, // Take one extra to check if more exist
    });

    const hasMore = comments.length > limit;
    const data = hasMore ? comments.slice(0, -1) : comments;

    return NextResponse.json({
      success: true,
      data: data.map(comment => ({
        ...comment,
        isLiked: comment.likes.length > 0,
        reactions: comment.reactions.reduce((acc, r) => {
          acc[r.emoji] = (acc[r.emoji] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        userReactions: comment.reactions.filter(r => r.userId === session.user.id).map(r => r.emoji),
        replies: comment.replies.map(reply => ({
          ...reply,
          isLiked: reply.likes.length > 0,
          reactions: reply.reactions.reduce((acc, r) => {
            acc[r.emoji] = (acc[r.emoji] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          userReactions: reply.reactions.filter(r => r.userId === session.user.id).map(r => r.emoji),
          replies: [],
        })),
        totalReplies: comment._count.replies,
      })),
      hasMore,
      nextCursor: data.length > 0 ? data[data.length - 1].createdAt.toISOString() : null,
    });
  } catch (error) {
    console.error("Load comments error:", error);
    return NextResponse.json({ success: false, error: "Failed to load comments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { postId, content, parentId } = await request.json();

    if (!postId || !content) {
      return NextResponse.json(
        { success: false, error: "Post ID and content are required" },
        { status: 400 }
      );
    }

    // Server-side moderation check
    const contentCheck = containsBannedContent(content);
    if (contentCheck.banned) {
      return NextResponse.json(
        { success: false, error: `Your comment contains content that violates community guidelines (detected: "${contentCheck.keyword}"). Please review and try again.` },
        { status: 400 }
      );
    }

    // Verify post exists
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    if (post.isLocked) {
      return NextResponse.json(
        { success: false, error: "This discussion is locked" },
        { status: 403 }
      );
    }

    const comment = await prisma.postComment.create({
      data: {
        content,
        postId,
        authorId: session.user.id,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: comment });
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

// DELETE a comment (Admin/Mentor only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only admins and mentors can delete comments
    if (session.user.role !== "ADMIN" && session.user.role !== "MENTOR") {
      return NextResponse.json(
        { success: false, error: "Only admins and mentors can delete comments" },
        { status: 403 }
      );
    }

    const { commentId } = await request.json();

    if (!commentId) {
      return NextResponse.json(
        { success: false, error: "Comment ID is required" },
        { status: 400 }
      );
    }

    // Check if comment exists
    const comment = await prisma.postComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    // Delete all related data first (replies, likes, reactions)
    await prisma.$transaction([
      // Delete reactions on replies
      prisma.commentReaction.deleteMany({
        where: { comment: { parentId: commentId } },
      }),
      // Delete likes on replies
      prisma.commentLike.deleteMany({
        where: { comment: { parentId: commentId } },
      }),
      // Delete replies
      prisma.postComment.deleteMany({
        where: { parentId: commentId },
      }),
      // Delete reactions on the comment
      prisma.commentReaction.deleteMany({
        where: { commentId },
      }),
      // Delete likes on the comment
      prisma.commentLike.deleteMany({
        where: { commentId },
      }),
      // Delete the comment
      prisma.postComment.delete({
        where: { id: commentId },
      }),
    ]);

    return NextResponse.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
