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

    const { title, content, communityId } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Verify user has access to this community (enrolled in a course in that category)
    if (communityId) {
      const isAdmin = session.user.role === "ADMIN" || session.user.role === "MENTOR";

      if (!isAdmin) {
        const community = await prisma.categoryCommunity.findUnique({
          where: { id: communityId },
          include: { category: true },
        });

        if (!community) {
          return NextResponse.json(
            { success: false, error: "Community not found" },
            { status: 404 }
          );
        }

        // Check if user is enrolled in any course in this category
        const enrollment = await prisma.enrollment.findFirst({
          where: {
            userId: session.user.id,
            course: { categoryId: community.categoryId },
          },
        });

        if (!enrollment) {
          return NextResponse.json(
            { success: false, error: "You must be enrolled in a course to post in this community" },
            { status: 403 }
          );
        }
      }
    }

    const post = await prisma.communityPost.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        communityId: communityId || null,
      },
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create post" },
      { status: 500 }
    );
  }
}
