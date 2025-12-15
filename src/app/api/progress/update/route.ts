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

    const {
      lessonId,
      courseId,
      watchTime,
      lastPosition,
      timeSpent,      // New: total time spent on lesson
      scrollDepth,    // New: max scroll percentage (for text lessons)
      incrementVisit  // New: whether to increment visit count
    } = await request.json();

    // Get existing progress to calculate increments
    const existingProgress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
    });

    // Update or create progress with analytics
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: {
        watchTime: watchTime ?? existingProgress?.watchTime ?? 0,
        lastPosition: lastPosition ?? existingProgress?.lastPosition ?? 0,
        // Accumulate time spent
        timeSpent: timeSpent
          ? (existingProgress?.timeSpent ?? 0) + timeSpent
          : existingProgress?.timeSpent ?? 0,
        // Track max scroll depth (only update if higher)
        scrollDepth: scrollDepth !== undefined
          ? Math.max(scrollDepth, existingProgress?.scrollDepth ?? 0)
          : existingProgress?.scrollDepth ?? 0,
        // Increment visit count if flagged
        visitCount: incrementVisit
          ? (existingProgress?.visitCount ?? 0) + 1
          : existingProgress?.visitCount ?? 0,
        lastVisitedAt: new Date(),
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        lessonId,
        watchTime: watchTime ?? 0,
        lastPosition: lastPosition ?? 0,
        timeSpent: timeSpent ?? 0,
        scrollDepth: scrollDepth ?? 0,
        visitCount: incrementVisit ? 1 : 0,
        lastVisitedAt: new Date(),
      },
    });

    // Update enrollment last accessed
    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
      data: {
        lastAccessedAt: new Date(),
      },
    });

    // Update user streak (if they haven't logged activity today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userStreak = await prisma.userStreak.findUnique({
      where: { userId: session.user.id },
    });

    if (userStreak) {
      const lastActive = new Date(userStreak.lastActiveAt);
      lastActive.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        // Consecutive day - increment streak
        await prisma.userStreak.update({
          where: { userId: session.user.id },
          data: {
            currentStreak: userStreak.currentStreak + 1,
            longestStreak: Math.max(
              userStreak.longestStreak,
              userStreak.currentStreak + 1
            ),
            lastActiveAt: new Date(),
          },
        });
      } else if (diffDays > 1) {
        // Streak broken - reset to 1
        await prisma.userStreak.update({
          where: { userId: session.user.id },
          data: {
            currentStreak: 1,
            lastActiveAt: new Date(),
          },
        });
      } else if (diffDays === 0) {
        // Same day - just update timestamp
        await prisma.userStreak.update({
          where: { userId: session.user.id },
          data: { lastActiveAt: new Date() },
        });
      }
    } else {
      // Create new streak record using upsert to avoid race condition
      await prisma.userStreak.upsert({
        where: { userId: session.user.id },
        update: {
          lastActiveAt: new Date(),
        },
        create: {
          userId: session.user.id,
          currentStreak: 1,
          longestStreak: 1,
          lastActiveAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
