import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { commentId } = await request.json();

    if (!commentId) {
      return NextResponse.json(
        { success: false, error: "Comment ID is required" },
        { status: 400 }
      );
    }

    // Check if already liked
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId: session.user.id,
        },
      },
    });

    if (existingLike) {
      // Unlike - remove the like
      await prisma.$transaction([
        prisma.commentLike.delete({
          where: { id: existingLike.id },
        }),
        prisma.postComment.update({
          where: { id: commentId },
          data: { likeCount: { decrement: 1 } },
        }),
      ]);

      const updatedComment = await prisma.postComment.findUnique({
        where: { id: commentId },
        select: { likeCount: true },
      });

      return NextResponse.json({
        success: true,
        liked: false,
        likeCount: updatedComment?.likeCount || 0,
        message: "Comment unliked",
      });
    } else {
      // Like - add the like
      await prisma.$transaction([
        prisma.commentLike.create({
          data: {
            commentId,
            userId: session.user.id,
          },
        }),
        prisma.postComment.update({
          where: { id: commentId },
          data: { likeCount: { increment: 1 } },
        }),
      ]);

      const updatedComment = await prisma.postComment.findUnique({
        where: { id: commentId },
        select: { likeCount: true },
      });

      return NextResponse.json({
        success: true,
        liked: true,
        likeCount: updatedComment?.likeCount || 0,
        message: "Comment liked",
      });
    }
  } catch (error) {
    console.error("Comment like error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle like" },
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

    const like = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId: session.user.id,
        },
      },
    });

    const comment = await prisma.postComment.findUnique({
      where: { id: commentId },
      select: { likeCount: true },
    });

    return NextResponse.json({
      success: true,
      liked: !!like,
      likeCount: comment?.likeCount || 0,
    });
  } catch (error) {
    console.error("Get comment like status error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get like status" },
      { status: 500 }
    );
  }
}
