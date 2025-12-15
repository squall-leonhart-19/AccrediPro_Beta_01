import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Sarah comment templates for random selection
const SARAH_COMMENTS = [
  "Amazing progress, {name}! This is exactly what we love to see in our community. Keep up the incredible work!",
  "{name}, you're absolutely crushing it! Your dedication is inspiring to everyone here.",
  "So proud of you, {name}! This is what transformation looks like. Can't wait to see what's next!",
  "This is beautiful, {name}! Your journey is going to inspire so many others in our community.",
  "Wow {name}, look at you go! This is exactly why I love being part of this community.",
  "{name}, this made my day! You're proof that the work pays off. Keep shining!",
  "Incredible milestone, {name}! Your hard work and commitment are truly showing.",
  "YES {name}! This is what it's all about. So honored to be part of your journey!",
  "{name}, you're an absolute rockstar! Thank you for sharing this with us.",
  "This is amazing, {name}! Your transformation story is going to help so many people.",
];

// Member comment templates
const MEMBER_COMMENTS = [
  "This is so inspiring! Congratulations!",
  "Amazing work! You're such an inspiration to all of us!",
  "So happy for you! Keep crushing it!",
  "This made my day! Congratulations on your success!",
  "Wow, incredible progress! You deserve all this success!",
  "This is exactly what I needed to see today. Thank you for sharing!",
  "Congratulations! Your story is so motivating!",
  "Love seeing posts like this! You're doing amazing!",
  "So proud of you! This is beautiful!",
  "Amazing! You're an inspiration to the whole community!",
  "You're absolutely killing it! So inspiring!",
  "This is incredible! Thank you for sharing your journey!",
  "Wow, just wow! So happy for your success!",
  "This gives me so much hope! Congratulations!",
  "You're proof that hard work pays off! Amazing!",
];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      authorId,
      category,
      title,
      content,
      createdAt,
      viewCount = 100,
      likeCount = 20,
      addSarahComment = true,
      sarahComment,
      commentsToGenerate = 3,
    } = body;

    // Validate required fields
    if (!authorId || !category || !title || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get author info for personalized comments
    const author = await prisma.user.findUnique({
      where: { id: authorId },
      select: { firstName: true, lastName: true },
    });

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    // Create the post
    const post = await prisma.communityPost.create({
      data: {
        title,
        content,
        categoryId: category,
        authorId,
        viewCount,
        likeCount,
        createdAt: createdAt ? new Date(createdAt) : new Date(),
      },
    });

    // Get Sarah's user ID
    let sarahId: string | null = null;
    if (addSarahComment) {
      const sarah = await prisma.user.findFirst({
        where: { email: "sarah@accredipro-certificate.com" },
        select: { id: true },
      });
      sarahId = sarah?.id || null;
    }

    // Add Sarah's comment if requested
    if (addSarahComment && sarahId) {
      const commentText = sarahComment ||
        SARAH_COMMENTS[Math.floor(Math.random() * SARAH_COMMENTS.length)]
          .replace("{name}", author.firstName || "there");

      const commentCreatedAt = new Date(post.createdAt);
      commentCreatedAt.setHours(commentCreatedAt.getHours() + Math.floor(Math.random() * 24) + 1);

      await prisma.postComment.create({
        data: {
          content: commentText,
          postId: post.id,
          authorId: sarahId,
          createdAt: commentCreatedAt,
        },
      });
    }

    // Generate random member comments if requested
    if (commentsToGenerate > 0) {
      // Get random fake profiles for comments
      const fakeProfiles = await prisma.user.findMany({
        where: {
          isFakeProfile: true,
          id: { not: authorId }, // Don't comment on own post
        },
        select: { id: true },
        take: 50,
      });

      const shuffled = fakeProfiles.sort(() => Math.random() - 0.5);
      const commenters = shuffled.slice(0, Math.min(commentsToGenerate, fakeProfiles.length));

      for (let i = 0; i < commenters.length; i++) {
        const commentText = MEMBER_COMMENTS[Math.floor(Math.random() * MEMBER_COMMENTS.length)];

        const commentCreatedAt = new Date(post.createdAt);
        commentCreatedAt.setHours(commentCreatedAt.getHours() + Math.floor(Math.random() * 72) + 2);

        await prisma.postComment.create({
          data: {
            content: commentText,
            postId: post.id,
            authorId: commenters[i].id,
            createdAt: commentCreatedAt,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      postId: post.id,
      message: "Post created successfully",
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
