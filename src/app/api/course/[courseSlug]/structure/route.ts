import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Cache course structure for 5 minutes at CDN edge
export const revalidate = 300;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseSlug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseSlug } = await params;

    const course = await prisma.course.findFirst({
      where: { slug: courseSlug },
      select: {
        id: true,
        title: true,
        slug: true,
        modules: {
          where: { isPublished: true },
          orderBy: { order: "asc" },
          select: {
            id: true,
            title: true,
            order: true,
            lessons: {
              where: { isPublished: true },
              orderBy: { order: "asc" },
              select: {
                id: true,
                title: true,
                order: true,
                videoDuration: true,
                lessonType: true,
                isFreePreview: true,
              },
            },
            quiz: {
              select: { id: true },
            },
          },
        },
        coach: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: session.user.id, courseId: course.id },
      select: { id: true },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
    }

    // Add cache headers for edge
    const response = NextResponse.json({ success: true, data: course });
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );

    return response;
  } catch (error) {
    console.error("Error fetching course structure:", error);
    return NextResponse.json(
      { error: "Failed to fetch course structure" },
      { status: 500 }
    );
  }
}
