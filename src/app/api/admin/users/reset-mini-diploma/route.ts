import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/admin/users/reset-mini-diploma
 *
 * Resets a user's Mini Diploma progress (admin only).
 * - Clears all lesson progress for fm-mini-diploma course
 * - Clears module progress
 * - Resets enrollment to ACTIVE with 0% progress
 * - Removes completion tags
 * - Clears miniDiplomaCompletedAt
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if admin
    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (admin?.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Get the Mini Diploma course
    const course = await prisma.course.findFirst({
      where: { slug: "fm-mini-diploma" },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Mini Diploma course not found" }, { status: 404 });
    }

    // Get all lesson and module IDs
    const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
    const moduleIds = course.modules.map((m) => m.id);

    // Delete lesson progress
    const deletedLessons = await prisma.lessonProgress.deleteMany({
      where: {
        userId,
        lessonId: { in: lessonIds },
      },
    });

    // Delete module progress
    const deletedModules = await prisma.moduleProgress.deleteMany({
      where: {
        userId,
        moduleId: { in: moduleIds },
      },
    });

    // Reset enrollment
    await prisma.enrollment.updateMany({
      where: {
        userId,
        courseId: course.id,
      },
      data: {
        progress: 0,
        status: "ACTIVE",
        completedAt: null,
        lastAccessedAt: new Date(),
      },
    });

    // Clear user completion data
    await prisma.user.update({
      where: { id: userId },
      data: {
        miniDiplomaCompletedAt: null,
        hasCertificateBadge: false,
      },
    });

    // Remove completion tag
    await prisma.userTag.deleteMany({
      where: {
        userId,
        tag: "fm_mini_diploma_completed",
      },
    });

    console.log(`[ADMIN] Reset Mini Diploma progress for user ${userId}: ${deletedLessons.count} lessons, ${deletedModules.count} modules`);

    return NextResponse.json({
      success: true,
      message: "Mini Diploma progress reset successfully",
      deleted: {
        lessons: deletedLessons.count,
        modules: deletedModules.count,
      },
    });

  } catch (error) {
    console.error("Reset Mini Diploma error:", error);
    return NextResponse.json(
      { error: "Failed to reset progress" },
      { status: 500 }
    );
  }
}
