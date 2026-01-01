import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/mini-diploma/reset-progress
 *
 * TEST ONLY: Resets all mini diploma progress for testing.
 * Only works for test user at.seed019@gmail.com
 *
 * Body: { course: "womens-health" | "fm" }
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
    const body = await request.json().catch(() => ({}));
    const course = body.course || "womens-health";

    // Handle Women's Health Mini Diploma reset
    if (course === "womens-health") {
      // Delete all lesson completion tags
      await prisma.userTag.deleteMany({
        where: {
          userId,
          tag: { startsWith: "wh-lesson-complete:" },
        },
      });

      // Reset user completion data
      await prisma.user.update({
        where: { id: userId },
        data: {
          miniDiplomaCompletedAt: null,
          miniDiplomaCategory: null,
        },
      });

      console.log(`[TEST] Women's Health progress reset for test user`);

      return NextResponse.json({
        success: true,
        message: "Women's Health progress reset",
      });
    }

    // Handle FM Mini Diploma reset
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

    // Delete all lesson progress
    const lessonIds = enrollment.course.modules.flatMap((m) => m.lessons.map((l) => l.id));
    await prisma.lessonProgress.deleteMany({
      where: {
        userId,
        lessonId: { in: lessonIds },
      },
    });

    // Delete all module progress
    const moduleIds = enrollment.course.modules.map((m) => m.id);
    await prisma.moduleProgress.deleteMany({
      where: {
        userId,
        moduleId: { in: moduleIds },
      },
    });

    // Reset enrollment
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: 0,
        status: "ACTIVE",
        completedAt: null,
      },
    });

    // Reset user completion data
    await prisma.user.update({
      where: { id: userId },
      data: {
        miniDiplomaCompletedAt: null,
      },
    });

    // Remove FM completion tag
    await prisma.userTag.deleteMany({
      where: {
        userId,
        tag: "fm_mini_diploma_completed",
      },
    });

    console.log(`[TEST] FM Mini Diploma progress reset for test user`);

    return NextResponse.json({
      success: true,
      message: "FM Mini Diploma progress reset",
    });

  } catch (error) {
    console.error("Reset progress error:", error);
    return NextResponse.json(
      { error: "Failed to reset progress" },
      { status: 500 }
    );
  }
}
