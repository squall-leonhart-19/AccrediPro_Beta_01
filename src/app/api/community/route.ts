import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// DELETE a post (Admin/Mentor only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only admins and mentors can delete posts
    if (session.user.role !== "ADMIN" && session.user.role !== "MENTOR") {
      return NextResponse.json(
        { success: false, error: "Only admins and mentors can delete posts" },
        { status: 403 }
      );
    }

    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // Delete all related data first (comments, likes, reactions)
    await prisma.$transaction([
      // Delete comment reactions
      prisma.commentReaction.deleteMany({
        where: { comment: { postId } },
      }),
      // Delete comment likes
      prisma.commentLike.deleteMany({
        where: { comment: { postId } },
      }),
      // Delete replies (comments with parentId)
      prisma.postComment.deleteMany({
        where: { postId, parentId: { not: null } },
      }),
      // Delete top-level comments
      prisma.postComment.deleteMany({
        where: { postId },
      }),
      // Delete post likes
      prisma.postLike.deleteMany({
        where: { postId },
      }),
      // Delete the post
      prisma.communityPost.delete({
        where: { id: postId },
      }),
    ]);

    return NextResponse.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

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

    const { title, content, communityId, category } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Server-side moderation check
    if (containsBannedContent(title) || containsBannedContent(content)) {
      return NextResponse.json(
        { success: false, error: "Your post contains content that violates community guidelines. Please review and try again." },
        { status: 400 }
      );
    }

    // Check if trying to post to admin-only category (introductions)
    if (category === "introductions" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Only admins can create posts in Introduce Yourself. Please comment on the existing post instead!" },
        { status: 403 }
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

    // Sanitize content for students (only Allow HTML for Admins/Mentors)
    const isAdminOrMentor = session.user.role === "ADMIN" || session.user.role === "MENTOR";
    const sanitizedContent = isAdminOrMentor
      ? content
      : content.replace(/<[^>]*>/g, ""); // Strip all HTML tags for students

    const post = await prisma.communityPost.create({
      data: {
        title,
        content: sanitizedContent,
        authorId: session.user.id,
        communityId: communityId || null,
        categoryId: category || null,
      },
      // ...
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
