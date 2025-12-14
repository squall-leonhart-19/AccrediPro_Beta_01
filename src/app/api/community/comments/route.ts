import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Banned keywords for auto-moderation (server-side check)
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

function containsBannedContent(text: string): boolean {
  const lowerText = text.toLowerCase();
  return BANNED_KEYWORDS.some(keyword => lowerText.includes(keyword));
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
    if (containsBannedContent(content)) {
      return NextResponse.json(
        { success: false, error: "Your comment contains content that violates community guidelines. Please review and try again." },
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
