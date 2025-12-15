import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Cache course resources for 5 minutes (resources rarely change)
export const revalidate = 300;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await context.params;

    // Check if user is enrolled in this course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "You must be enrolled in this course to access resources" },
        { status: 403 }
      );
    }

    // Get all resources for this course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          where: { isPublished: true },
          orderBy: { order: "asc" },
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { order: "asc" },
              include: {
                resources: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Flatten resources with lesson and module context
    const resources = course.modules.flatMap((module) =>
      module.lessons.flatMap((lesson) =>
        lesson.resources.map((resource) => ({
          id: resource.id,
          title: resource.title,
          type: resource.type,
          url: resource.url,
          size: resource.size,
          lessonTitle: lesson.title,
          moduleTitle: module.title,
        }))
      )
    );

    const response = NextResponse.json({ resources });
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return response;
  } catch (error) {
    console.error("Get course resources error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}
