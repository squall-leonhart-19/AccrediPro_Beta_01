import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Sarah comment templates
const SARAH_COMMENTS = [
  "Amazing progress, {name}! This is exactly what we love to see in our community. Keep up the incredible work!",
  "{name}, you're absolutely crushing it! Your dedication is inspiring to everyone here.",
  "So proud of you, {name}! This is what transformation looks like. Can't wait to see what's next!",
  "This is beautiful, {name}! Your journey is going to inspire so many others in our community.",
  "Wow {name}, look at you go! This is exactly why I love being part of this community.",
];

// Member comment templates
const MEMBER_COMMENTS = [
  "This is so inspiring! Congratulations!",
  "Amazing work! You're such an inspiration to all of us!",
  "So happy for you! Keep crushing it!",
  "This made my day! Congratulations on your success!",
  "Wow, incredible progress! You deserve all this success!",
];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      postId,
      addComment = false,
      commentType = "sarah",
      commentContent,
      likesToAdd = 0,
      setExactLikeCount, // If provided, set likes to this exact number
      setReactions, // If provided, set reactions to this exact JSON object
    } = body;

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Get post info
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: {
        id: true,
        createdAt: true,
        likeCount: true,
        author: {
          select: { firstName: true },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const results: { comment?: boolean; likes?: number } = {};

    // Add comment if requested
    if (addComment && commentContent) {
      let authorId: string;

      if (commentType === "sarah") {
        // Get Sarah's ID
        const sarah = await prisma.user.findFirst({
          where: { email: "sarah@accredipro-certificate.com" },
          select: { id: true },
        });

        if (!sarah) {
          return NextResponse.json(
            { error: "Sarah profile not found" },
            { status: 404 }
          );
        }
        authorId = sarah.id;
      } else {
        // Get a random fake profile
        const fakeProfiles = await prisma.user.findMany({
          where: { isFakeProfile: true },
          select: { id: true },
          take: 10,
        });

        if (fakeProfiles.length === 0) {
          return NextResponse.json(
            { error: "No fake profiles found" },
            { status: 404 }
          );
        }
        authorId = fakeProfiles[Math.floor(Math.random() * fakeProfiles.length)].id;
      }

      // Replace {name} placeholder if present
      const finalContent = commentContent.replace(
        "{name}",
        post.author.firstName || "there"
      );

      await prisma.postComment.create({
        data: {
          content: finalContent,
          postId: post.id,
          authorId,
          createdAt: new Date(),
        },
      });

      results.comment = true;
    }

    // Set reactions JSON if provided (syncs to all views)
    if (setReactions && typeof setReactions === "object") {
      // Calculate total likes from all reactions
      const totalLikes = Object.values(setReactions as Record<string, number>).reduce(
        (sum: number, count: number) => sum + (count || 0), 0
      );

      await prisma.communityPost.update({
        where: { id: postId },
        data: {
          reactions: setReactions,
          likeCount: totalLikes,
        },
      });

      results.likes = totalLikes;
    }
    // Set exact like count if provided (legacy)
    else if (typeof setExactLikeCount === "number" && setExactLikeCount >= 0) {
      await prisma.communityPost.update({
        where: { id: postId },
        data: {
          likeCount: setExactLikeCount,
        },
      });

      results.likes = setExactLikeCount;
    }
    // Otherwise add likes incrementally if requested (legacy)
    else if (likesToAdd > 0) {
      await prisma.communityPost.update({
        where: { id: postId },
        data: {
          likeCount: { increment: likesToAdd },
        },
      });

      results.likes = likesToAdd;
    }

    return NextResponse.json({
      success: true,
      results,
      message: "Interactions added successfully",
    });
  } catch (error) {
    console.error("Error adding interactions:", error);
    return NextResponse.json(
      { error: "Failed to add interactions" },
      { status: 500 }
    );
  }
}
