import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

// Webhook endpoint for external form opt-ins (e.g., ThriveCart, ConvertKit, etc.)
// URL: /api/webhook/enroll
// Method: POST
// Headers: x-webhook-secret: YOUR_SECRET (set in .env as WEBHOOK_SECRET)

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const webhookSecret = request.headers.get("x-webhook-secret");
    if (webhookSecret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json(
        { success: false, error: "Invalid webhook secret" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Support multiple webhook formats
    // Format 1: Direct { email, firstName, lastName, courseSlug }
    // Format 2: ThriveCart-style { customer: { email, name }, product: { id } }
    // Format 3: ConvertKit-style { subscriber: { email_address, first_name } }

    let email: string;
    let firstName: string;
    let lastName: string;
    let courseSlug: string;

    if (body.customer) {
      // ThriveCart format
      email = body.customer.email;
      const nameParts = (body.customer.name || "").split(" ");
      firstName = nameParts[0] || "";
      lastName = nameParts.slice(1).join(" ") || "";
      courseSlug = body.product?.id || body.courseSlug;
    } else if (body.subscriber) {
      // ConvertKit format
      email = body.subscriber.email_address;
      firstName = body.subscriber.first_name || "";
      lastName = body.subscriber.last_name || "";
      courseSlug = body.courseSlug || body.tag_name; // Can map tags to courses
    } else {
      // Direct format
      email = body.email;
      firstName = body.firstName || "";
      lastName = body.lastName || "";
      courseSlug = body.courseSlug;
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Generate a random password for new users
      const tempPassword = Math.random().toString(36).slice(-12);
      const passwordHash = await bcrypt.hash(tempPassword, 12);

      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          firstName,
          lastName,
          passwordHash,
          role: "STUDENT",
          isActive: true,
        },
      });
    }

    // Find course by slug or ID
    let course = null;
    if (courseSlug) {
      course = await prisma.course.findFirst({
        where: {
          OR: [
            { slug: courseSlug },
            { id: courseSlug },
          ],
          isPublished: true,
        },
      });
    }

    // If no specific course, enroll in default course (first published one)
    if (!course) {
      course = await prisma.course.findFirst({
        where: { isPublished: true },
        orderBy: { createdAt: "asc" },
      });
    }

    if (!course) {
      return NextResponse.json(
        { success: false, error: "No course found" },
        { status: 404 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
    });

    if (existingEnrollment) {
      return NextResponse.json({
        success: true,
        message: "User already enrolled",
        data: { userId: user.id, courseId: course.id },
      });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
        status: "ACTIVE",
        progress: 0,
      },
    });

    // Update course analytics
    await prisma.courseAnalytics.upsert({
      where: { courseId: course.id },
      update: { totalEnrolled: { increment: 1 } },
      create: {
        courseId: course.id,
        totalEnrolled: 1,
      },
    });

    // Initialize user streak for gamification
    await prisma.userStreak.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        currentStreak: 0,
        longestStreak: 0,
        totalPoints: 0,
      },
    });

    // Send welcome email
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

    // Log webhook event
    await prisma.webhookEvent.create({
      data: {
        eventType: "enrollment.created",
        payload: {
          email,
          courseSlug: course.slug,
          source: body.source || "webhook",
        },
        status: "sent",
        processedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        enrollmentId: enrollment.id,
        courseId: course.id,
        courseName: course.title,
      },
    });
  } catch (error) {
    console.error("Enrollment webhook error:", error);

    // Log failed webhook
    try {
      await prisma.webhookEvent.create({
        data: {
          eventType: "enrollment.failed",
          payload: { error: String(error) },
          status: "failed",
          attempts: 1,
          lastError: String(error),
        },
      });
    } catch (logError) {
      console.error("Failed to log webhook error:", logError);
    }

    return NextResponse.json(
      { success: false, error: "Failed to process enrollment" },
      { status: 500 }
    );
  }
}

// GET endpoint to test webhook is working
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Enrollment webhook is active",
    usage: {
      method: "POST",
      headers: { "x-webhook-secret": "YOUR_WEBHOOK_SECRET" },
      body: {
        email: "student@example.com",
        firstName: "Jane",
        lastName: "Doe",
        courseSlug: "functional-medicine-certification",
      },
    },
  });
}
