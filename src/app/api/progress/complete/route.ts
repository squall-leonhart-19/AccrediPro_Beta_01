import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { onLessonCompleted, onCourseCompleted } from "@/lib/webhooks";
import { createCertificateOnCompletion } from "@/lib/certificate-service";
import { triggerAutoMessage } from "@/lib/auto-messages";

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
    const userId = session.user.id;

    // OPTIMIZED: Parallel queries to get all needed data at once
    const [lesson, existingProgress, streak] = await Promise.all([
      prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          module: {
            include: {
              course: true,
              lessons: { where: { isPublished: true }, select: { id: true } },
            },
          },
        },
      }),
      prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId } },
      }),
      prisma.userStreak.findUnique({ where: { userId } }),
    ]);

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 }
      );
    }

    // If already completed, return early (fast path)
    if (existingProgress?.isCompleted) {
      return NextResponse.json({
        success: true,
        data: { progress: 0, moduleCompleted: false, courseCompleted: false, alreadyCompleted: true },
      });
    }

    const actualCourseId = courseId || lesson.module.course.id;
    const actualModuleId = moduleId || lesson.module.id;

    // BATCHED TRANSACTION: All critical writes in a single transaction
    const result = await prisma.$transaction(async (tx) => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // 1. Mark lesson complete
      await tx.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        update: { isCompleted: true, completedAt: now },
        create: { userId, lessonId, isCompleted: true, completedAt: now },
      });

      // 2. Update streak + award points in one operation
      if (!streak) {
        await tx.userStreak.create({
          data: { userId, currentStreak: 1, longestStreak: 1, lastActiveAt: today, totalPoints: 10 },
        });
      } else {
        const lastActive = new Date(streak.lastActiveAt);
        const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
        const diffDays = Math.floor((today.getTime() - lastActiveDay.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          const newStreak = streak.currentStreak + 1;
          await tx.userStreak.update({
            where: { userId },
            data: {
              currentStreak: newStreak,
              longestStreak: Math.max(newStreak, streak.longestStreak),
              lastActiveAt: today,
              totalPoints: { increment: 10 },
            },
          });
        } else if (diffDays > 1) {
          await tx.userStreak.update({
            where: { userId },
            data: { currentStreak: 1, lastActiveAt: today, totalPoints: { increment: 10 } },
          });
        } else {
          await tx.userStreak.update({
            where: { userId },
            data: { totalPoints: { increment: 10 } },
          });
        }
      }

      // 3. Log activity
      await tx.userActivity.create({
        data: { userId, action: "points_earned", metadata: { points: 10, reason: "lesson_complete" } },
      });

      // 4. Check module completion
      const moduleLessonIds = lesson.module.lessons.map((l) => l.id);
      const completedModuleLessons = await tx.lessonProgress.count({
        where: { userId, lessonId: { in: moduleLessonIds }, isCompleted: true },
      });

      const isModuleComplete = completedModuleLessons >= moduleLessonIds.length;
      let moduleJustCompleted = false;

      if (isModuleComplete) {
        const existingModuleProgress = await tx.moduleProgress.findUnique({
          where: { userId_moduleId: { userId, moduleId: actualModuleId } },
        });

        if (!existingModuleProgress?.isCompleted) {
          moduleJustCompleted = true;
          await tx.moduleProgress.upsert({
            where: { userId_moduleId: { userId, moduleId: actualModuleId } },
            update: { isCompleted: true, completedAt: now },
            create: { userId, moduleId: actualModuleId, isCompleted: true, completedAt: now },
          });
          await tx.userStreak.update({
            where: { userId },
            data: { totalPoints: { increment: 50 } },
          });
        }
      }

      // 5. Calculate course progress
      const course = await tx.course.findUnique({
        where: { id: actualCourseId },
        include: {
          modules: {
            where: { isPublished: true },
            include: { lessons: { where: { isPublished: true }, select: { id: true } } },
          },
        },
      });

      let courseJustCompleted = false;
      let newProgress = 0;

      if (course) {
        const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
        const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
        const completedLessons = await tx.lessonProgress.count({
          where: { userId, lessonId: { in: lessonIds }, isCompleted: true },
        });
        // Fix 0% Bug: Ensure we don't divide by zero and handle unpublished lesson testing
        // If totalLessons is 0 (e.g. unpublished course), use completedLessons as total to show 100% or just 1
        const effectiveTotalLessons = totalLessons > 0 ? totalLessons : (completedLessons > 0 ? completedLessons : 1);

        newProgress = (completedLessons / effectiveTotalLessons) * 100;
        if (newProgress > 100) newProgress = 100; // Cap at 100%

        const enrollment = await tx.enrollment.findUnique({
          where: { userId_courseId: { userId, courseId: course.id } },
        });

        if (newProgress >= 100 && enrollment?.status !== "COMPLETED") {
          courseJustCompleted = true;
          await tx.enrollment.update({
            where: { userId_courseId: { userId, courseId: course.id } },
            data: { progress: 100, status: "COMPLETED", completedAt: now, lastAccessedAt: now },
          });
          await tx.userStreak.update({
            where: { userId },
            data: { totalPoints: { increment: 200 } },
          });
          await tx.courseAnalytics.upsert({
            where: { courseId: course.id },
            update: { totalCompleted: { increment: 1 } },
            create: { courseId: course.id, totalCompleted: 1 },
          });
          await tx.notification.create({
            data: {
              userId,
              type: "COURSE_COMPLETE",
              title: "Course Completed!",
              message: `Congratulations! You've completed ${course.title}. Your certificate is being prepared.`,
            },
          });
        } else if (enrollment) {
          await tx.enrollment.update({
            where: { userId_courseId: { userId, courseId: course.id } },
            data: { progress: newProgress, lastAccessedAt: now },
          });
        }
      }

      // Get module order for auto-message
      const moduleOrder = lesson.module.order;

      return { newProgress, moduleJustCompleted, courseJustCompleted, actualCourseId, moduleOrder };
    });

    // ASYNC: Fire-and-forget webhooks/certificates/auto-messages (don't block response)
    setImmediate(async () => {
      try {
        await onLessonCompleted(userId, lessonId, result.actualCourseId, actualModuleId);
        if (result.courseJustCompleted) {
          await onCourseCompleted(userId, result.actualCourseId);
          await createCertificateOnCompletion(userId, result.actualCourseId);
        }
        // Send private DM from Coach when module is completed
        if (result.moduleJustCompleted) {
          await triggerAutoMessage({
            userId,
            trigger: "module_complete",
            triggerValue: String(result.moduleOrder),
          });
        }
      } catch (error) {
        console.error("Background webhook error:", error);
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        progress: result.newProgress,
        moduleCompleted: result.moduleJustCompleted,
        courseCompleted: result.courseJustCompleted,
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
