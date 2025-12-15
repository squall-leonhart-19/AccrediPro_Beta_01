import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Cache lesson content at edge for 5 minutes
export const revalidate = 300;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseSlug: string; lessonId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseSlug, lessonId } = await params;

    // Get course to verify enrollment
    const course = await prisma.course.findFirst({
      where: { slug: courseSlug },
      select: { id: true },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Verify enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: session.user.id, courseId: course.id },
      select: { id: true },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
    }

    // Get lesson with module info
    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId },
      include: {
        resources: true,
        module: {
          select: {
            id: true,
            title: true,
            order: true,
            courseId: true,
            quiz: {
              include: {
                questions: {
                  orderBy: { order: "asc" },
                  include: {
                    answers: { orderBy: { order: "asc" } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Verify lesson belongs to the course
    if (lesson.module.courseId !== course.id) {
      return NextResponse.json({ error: "Lesson not in course" }, { status: 403 });
    }

    const response = NextResponse.json({
      success: true,
      data: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        content: lesson.content,
        lessonType: lesson.lessonType,
        videoId: lesson.videoId,
        videoDuration: lesson.videoDuration,
        resources: lesson.resources,
        module: {
          id: lesson.module.id,
          title: lesson.module.title,
          order: lesson.module.order,
          hasQuiz: !!lesson.module.quiz,
        },
      },
    });

    // Add edge cache headers - lesson content is static
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );

    return response;
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson" },
      { status: 500 }
    );
  }
}
