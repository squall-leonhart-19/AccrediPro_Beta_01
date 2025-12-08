import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { triggerWebhook } from "@/lib/webhooks";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Check if course exists and is published
    const course = await prisma.course.findUnique({
      where: { id: courseId, isPublished: true },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { success: false, error: "Already enrolled in this course" },
        { status: 400 }
      );
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId,
        status: "ACTIVE",
        progress: 0,
      },
    });

    // Trigger webhook
    await triggerWebhook("enrollment.created", {
      userId: session.user.id,
      userEmail: session.user.email,
      userName: `${session.user.firstName || ""} ${session.user.lastName || ""}`.trim(),
      courseId,
      courseTitle: course.title,
      enrolledAt: new Date().toISOString(),
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: "SYSTEM",
        title: "Enrollment Successful",
        message: `You've enrolled in "${course.title}". Start learning now!`,
        data: { courseId },
      },
    });

    return NextResponse.json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to enroll" },
      { status: 500 }
    );
  }
}
