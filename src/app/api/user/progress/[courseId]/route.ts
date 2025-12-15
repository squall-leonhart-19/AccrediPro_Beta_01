import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// User progress is dynamic, no edge caching
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await params;
    const userId = session.user.id;

    // Get all data in parallel
    const [course, enrollment, userStreak, quizAttempts] = await Promise.all([
      prisma.course.findUnique({
        where: { id: courseId },
        select: {
          id: true,
          modules: {
            where: { isPublished: true },
            select: {
              id: true,
              lessons: {
                where: { isPublished: true },
                select: { id: true },
              },
              quiz: {
                select: { id: true },
              },
            },
          },
        },
      }),
      prisma.enrollment.findFirst({
        where: { userId, courseId },
        select: { progress: true, status: true },
      }),
      prisma.userStreak.findUnique({
        where: { userId },
        select: { currentStreak: true, longestStreak: true, totalPoints: true },
      }),
      prisma.quizAttempt.findMany({
        where: {
          userId,
          quiz: {
            module: { courseId },
          },
        },
        select: {
          quizId: true,
          passed: true,
          score: true,
        },
      }),
    ]);

    if (!course || !enrollment) {
      return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
    }

    // Get all lesson IDs
    const allLessonIds = course.modules.flatMap((m) =>
      m.lessons.map((l) => l.id)
    );

    // Get lesson progress
    const lessonProgress = await prisma.lessonProgress.findMany({
      where: {
        userId,
        lessonId: { in: allLessonIds },
      },
      select: {
        lessonId: true,
        isCompleted: true,
        watchTime: true,
        lastPosition: true,
      },
    });

    // Build progress map
    const progressMap: Record<
      string,
      { isCompleted: boolean; watchTime?: number; lastPosition?: number }
    > = {};
    lessonProgress.forEach((p) => {
      progressMap[p.lessonId] = {
        isCompleted: p.isCompleted,
        watchTime: p.watchTime || undefined,
        lastPosition: p.lastPosition || undefined,
      };
    });

    // Build quiz pass map
    const quizPassMap: Record<string, boolean> = {};
    quizAttempts.forEach((a) => {
      if (a.passed) {
        quizPassMap[a.quizId] = true;
      }
    });

    const response = NextResponse.json({
      success: true,
      data: {
        enrollment: {
          progress: enrollment.progress,
          status: enrollment.status,
        },
        lessonProgress: progressMap,
        quizProgress: quizPassMap,
        userStreak,
        stats: {
          totalLessons: allLessonIds.length,
          completedLessons: Object.values(progressMap).filter(
            (p) => p.isCompleted
          ).length,
        },
      },
    });

    // No edge cache for user progress, but allow browser cache for 30 sec
    response.headers.set("Cache-Control", "private, max-age=30");

    return response;
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
