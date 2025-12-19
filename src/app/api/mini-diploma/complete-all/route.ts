import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/mini-diploma/complete-all
 *
 * TEST ONLY: Marks all mini diploma lessons as completed.
 * Only works for test user at.seed019@gmail.com
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow for test user
    if (session.user.email !== "at.seed019@gmail.com") {
      return NextResponse.json({ error: "Not authorized for this action" }, { status: 403 });
    }

    const userId = session.user.id;

    // Get the mini diploma enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        course: { slug: "fm-mini-diploma" },
      },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "No mini diploma enrollment found" }, { status: 404 });
    }

    // Get all lesson IDs
    const allLessons = enrollment.course.modules.flatMap((m) => m.lessons);
    const now = new Date();

    // Mark all lessons as completed
    for (const lesson of allLessons) {
      await prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId: lesson.id } },
        update: { isCompleted: true, completedAt: now },
        create: { userId, lessonId: lesson.id, isCompleted: true, completedAt: now },
      });
    }

    // Mark all modules as completed
    for (const module of enrollment.course.modules) {
      await prisma.moduleProgress.upsert({
        where: { userId_moduleId: { userId, moduleId: module.id } },
        update: { isCompleted: true, completedAt: now },
        create: { userId, moduleId: module.id, isCompleted: true, completedAt: now },
      });
    }

    // Update enrollment to 100% complete
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: 100,
        status: "COMPLETED",
        completedAt: now,
        lastAccessedAt: now,
      },
    });

    // Update user completion timestamp
    await prisma.user.update({
      where: { id: userId },
      data: {
        miniDiplomaCompletedAt: now,
        hasCertificateBadge: true,
      },
    });

    // Add fm_mini_diploma_completed tag
    await prisma.userTag.upsert({
      where: { userId_tag: { userId, tag: "fm_mini_diploma_completed" } },
      update: {},
      create: { userId, tag: "fm_mini_diploma_completed" },
    });

    console.log(`[TEST] All ${allLessons.length} lessons marked complete for test user`);

    return NextResponse.json({
      success: true,
      lessonsCompleted: allLessons.length,
      message: "All lessons marked as completed",
      redirect: "/masterclass",
    });

  } catch (error) {
    console.error("Complete all error:", error);
    return NextResponse.json(
      { error: "Failed to complete lessons" },
      { status: 500 }
    );
  }
}
