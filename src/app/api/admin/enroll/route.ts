import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId, courseId } = await request.json();

    if (!userId || !courseId) {
      return NextResponse.json(
        { success: false, error: "User ID and Course ID are required" },
        { status: 400 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { success: false, error: "User is already enrolled in this course" },
        { status: 400 }
      );
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: "ACTIVE",
        progress: 0,
      },
      include: {
        user: true,
        course: true,
      },
    });

    // Update course analytics
    await prisma.courseAnalytics.upsert({
      where: { courseId },
      update: { totalEnrolled: { increment: 1 } },
      create: {
        courseId,
        totalEnrolled: 1,
      },
    });

    // Send welcome email
    if (enrollment.user.email) {
      try {
        await sendWelcomeEmail({
          to: enrollment.user.email,
          firstName: enrollment.user.firstName || "Student",
          courseName: enrollment.course.title,
          courseSlug: enrollment.course.slug,
        });
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        type: "SYSTEM",
        title: "Welcome to Your New Course!",
        message: `You've been enrolled in ${enrollment.course.title}. Start learning today!`,
      },
    });

    return NextResponse.json({ success: true, data: enrollment });
  } catch (error) {
    console.error("Admin enroll error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to enroll user" },
      { status: 500 }
    );
  }
}
