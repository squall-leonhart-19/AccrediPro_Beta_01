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

    const { lessonId, courseId } = await request.json();

    // Mark lesson as incomplete
    await prisma.lessonProgress.update({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      data: {
        isCompleted: false,
        completedAt: null,
      },
    });

    // Recalculate course progress
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          where: { isPublished: true },
          include: {
            lessons: { where: { isPublished: true } },
          },
        },
      },
    });

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

      const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      await prisma.enrollment.update({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: course.id,
          },
        },
        data: {
          progress,
          status: progress < 100 ? "ACTIVE" : "COMPLETED",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Uncomplete error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
