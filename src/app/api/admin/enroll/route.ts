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
      select: { id: true },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { success: false, error: "User is already enrolled in this course" },
        { status: 400 }
      );
    }

    // Fetch user and course separately to avoid P2022 errors with nested includes
    const [user, course] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, firstName: true, lastName: true },
      }),
      prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true, title: true, slug: true },
      }),
    ]);

    if (!user || !course) {
      return NextResponse.json(
        { success: false, error: "User or Course not found" },
        { status: 404 }
      );
    }

    // Create enrollment without nested includes
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: "ACTIVE",
        progress: 0,
      },
      select: {
        id: true,
        userId: true,
        courseId: true,
        status: true,
        progress: true,
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
    if (user.email) {
      try {
        await sendWelcomeEmail({
          to: user.email,
          firstName: user.firstName || "Student",
          courseName: course.title,
          courseSlug: course.slug,
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
        message: `You've been enrolled in ${course.title}. Start learning today!`,
      },
    });

    return NextResponse.json({ success: true, data: { ...enrollment, user, course } });
  } catch (error) {
    console.error("Admin enroll error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to enroll user" },
      { status: 500 }
    );
  }
}
