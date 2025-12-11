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

    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Check if already liked
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: session.user.id,
        },
      },
    });

    if (existingLike) {
      // Unlike - remove the like
      await prisma.$transaction([
        prisma.postLike.delete({
          where: { id: existingLike.id },
        }),
        prisma.communityPost.update({
          where: { id: postId },
          data: { likeCount: { decrement: 1 } },
        }),
      ]);

      return NextResponse.json({
        success: true,
        liked: false,
        message: "Post unliked",
      });
    } else {
      // Like - add the like
      await prisma.$transaction([
        prisma.postLike.create({
          data: {
            postId,
            userId: session.user.id,
          },
        }),
        prisma.communityPost.update({
          where: { id: postId },
          data: { likeCount: { increment: 1 } },
        }),
      ]);

      return NextResponse.json({
        success: true,
        liked: true,
        message: "Post liked",
      });
    }
  } catch (error) {
    console.error("Like error:", error);
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
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 }
      );
    }

    const like = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      liked: !!like,
    });
  } catch (error) {
    console.error("Get like status error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get like status" },
      { status: 500 }
    );
  }
}
