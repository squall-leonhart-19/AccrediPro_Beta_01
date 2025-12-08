import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { onLessonCompleted, onCourseCompleted } from "@/lib/webhooks";
import { sendCertificateEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { lessonId, courseId, moduleId } = await request.json();

    // Get lesson details
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                coach: {
                  select: { id: true, firstName: true, lastName: true },
                },
              },
            },
            lessons: { where: { isPublished: true } },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 }
      );
    }

    const actualCourseId = courseId || lesson.module.course.id;
    const actualModuleId = moduleId || lesson.module.id;

    // Mark lesson as complete
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        lessonId,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    // Update streak and points
    await updateStreak(session.user.id);
    await awardPoints(session.user.id, 10, "lesson_complete");

    // Check module completion
    const moduleLessonIds = lesson.module.lessons.map((l) => l.id);
    const completedModuleLessons = await prisma.lessonProgress.count({
      where: {
        userId: session.user.id,
        lessonId: { in: moduleLessonIds },
        isCompleted: true,
      },
    });

    const isModuleComplete = completedModuleLessons >= moduleLessonIds.length;
    let moduleJustCompleted = false;

    if (isModuleComplete) {
      // Check if module was just completed
      const existingModuleProgress = await prisma.moduleProgress.findUnique({
        where: {
          userId_moduleId: {
            userId: session.user.id,
            moduleId: actualModuleId,
          },
        },
      });

      if (!existingModuleProgress?.isCompleted) {
        moduleJustCompleted = true;

        // Mark module as complete
        await prisma.moduleProgress.upsert({
          where: {
            userId_moduleId: {
              userId: session.user.id,
              moduleId: actualModuleId,
            },
          },
          update: {
            isCompleted: true,
            completedAt: new Date(),
          },
          create: {
            userId: session.user.id,
            moduleId: actualModuleId,
            isCompleted: true,
            completedAt: new Date(),
          },
        });

        // Award module completion badge/points
        await awardPoints(session.user.id, 50, "module_complete");
        await checkAndAwardBadge(session.user.id, "module_master");
      }
    }

    // Calculate and update course progress
    const course = await prisma.course.findUnique({
      where: { id: actualCourseId },
      include: {
        modules: {
          where: { isPublished: true },
          include: {
            lessons: { where: { isPublished: true } },
          },
        },
      },
    });

    let courseJustCompleted = false;
    let newProgress = 0;

    if (course) {
      const totalLessons = course.modules.reduce(
        (acc, m) => acc + m.lessons.length,
        0
      );
      const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));

      const completedLessons = await prisma.lessonProgress.count({
        where: {
          userId: session.user.id,
          lessonId: { in: lessonIds },
          isCompleted: true,
        },
      });

      newProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      // Get current enrollment status
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: course.id,
          },
        },
      });

      // Check if course just completed
      if (newProgress >= 100 && enrollment?.status !== "COMPLETED") {
        courseJustCompleted = true;

        await prisma.enrollment.update({
          where: {
            userId_courseId: {
              userId: session.user.id,
              courseId: course.id,
            },
          },
          data: {
            progress: 100,
            status: "COMPLETED",
            completedAt: new Date(),
            lastAccessedAt: new Date(),
          },
        });

        // Award course completion points and badge
        await awardPoints(session.user.id, 200, "course_complete");
        await checkAndAwardBadge(session.user.id, "course_graduate");

        // Update analytics
        await prisma.courseAnalytics.upsert({
          where: { courseId: course.id },
          update: { totalCompleted: { increment: 1 } },
          create: {
            courseId: course.id,
            totalCompleted: 1,
          },
        });

        // Trigger course completion webhook
        await onCourseCompleted(session.user.id, course.id);

        // Create notification
        await prisma.notification.create({
          data: {
            userId: session.user.id,
            type: "COURSE_COMPLETE",
            title: "Course Completed!",
            message: `Congratulations! You've completed ${course.title}. Your certificate is being prepared.`,
          },
        });
      } else {
        await prisma.enrollment.update({
          where: {
            userId_courseId: {
              userId: session.user.id,
              courseId: course.id,
            },
          },
          data: {
            progress: newProgress,
            lastAccessedAt: new Date(),
          },
        });
      }

      // Trigger lesson completion webhook
      await onLessonCompleted(
        session.user.id,
        lessonId,
        course.id,
        actualModuleId
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        progress: newProgress,
        moduleCompleted: moduleJustCompleted,
        courseCompleted: courseJustCompleted,
      },
    });
  } catch (error) {
    console.error("Lesson completion error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to mark lesson complete" },
      { status: 500 }
    );
  }
}

// Helper: Update user's streak
async function updateStreak(userId: string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const streak = await prisma.userStreak.findUnique({
    where: { userId },
  });

  if (!streak) {
    await prisma.userStreak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveAt: today,
      },
    });
    return;
  }

  const lastActive = new Date(streak.lastActiveAt);
  const lastActiveDay = new Date(
    lastActive.getFullYear(),
    lastActive.getMonth(),
    lastActive.getDate()
  );

  const diffDays = Math.floor(
    (today.getTime() - lastActiveDay.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    // Same day, no streak update needed
    return;
  } else if (diffDays === 1) {
    // Consecutive day, increment streak
    const newStreak = streak.currentStreak + 1;
    await prisma.userStreak.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streak.longestStreak),
        lastActiveAt: today,
      },
    });

    // Check streak badges
    if (newStreak === 7) {
      await checkAndAwardBadge(userId, "week_warrior");
    } else if (newStreak === 30) {
      await checkAndAwardBadge(userId, "monthly_master");
    }
  } else {
    // Streak broken, reset
    await prisma.userStreak.update({
      where: { userId },
      data: {
        currentStreak: 1,
        lastActiveAt: today,
      },
    });
  }
}

// Helper: Award points
async function awardPoints(userId: string, points: number, reason: string) {
  await prisma.userStreak.upsert({
    where: { userId },
    update: {
      totalPoints: { increment: points },
    },
    create: {
      userId,
      currentStreak: 0,
      longestStreak: 0,
      totalPoints: points,
    },
  });

  // Log activity
  await prisma.userActivity.create({
    data: {
      userId,
      action: "points_earned",
      metadata: { points, reason },
    },
  });
}

// Helper: Check and award badge
async function checkAndAwardBadge(userId: string, badgeSlug: string) {
  const badge = await prisma.badge.findUnique({
    where: { slug: badgeSlug },
  });

  if (!badge) return;

  // Check if already has badge
  const existing = await prisma.userBadge.findUnique({
    where: {
      userId_badgeId: {
        userId,
        badgeId: badge.id,
      },
    },
  });

  if (existing) return;

  // Award badge
  await prisma.userBadge.create({
    data: {
      userId,
      badgeId: badge.id,
    },
  });

  // Create notification
  await prisma.notification.create({
    data: {
      userId,
      type: "SYSTEM",
      title: "New Badge Earned!",
      message: `You've earned the "${badge.name}" badge! ${badge.description}`,
    },
  });

  // Award badge points
  if (badge.points > 0) {
    await awardPoints(userId, badge.points, `badge_${badgeSlug}`);
  }
}
