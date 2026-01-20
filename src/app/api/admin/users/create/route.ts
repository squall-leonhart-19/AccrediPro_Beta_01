import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail, sendCourseEnrollmentEmail } from "@/lib/email";
import { verifyEmail } from "@/lib/neverbounce";

const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(["STUDENT", "MENTOR", "INSTRUCTOR", "ADMIN", "SUPERUSER", "SUPPORT"]).default("STUDENT"),
  tags: z.array(z.string()).optional(),
  sendWelcomeEmail: z.boolean().optional().default(true),
});

// Tag to Course slug mapping for enrollment
const TAG_TO_COURSE_ENROLLMENT: Record<string, string | string[]> = {
  // FM Main Certification
  functional_medicine_complete_certification_purchased: "functional-medicine-complete-certification",
  fm_certification_purchased: "functional-medicine-complete-certification",

  // FM Pro Pack (all 3 courses)
  fm_pro_accelerator_purchased: [
    "fm-pro-advanced-clinical",
    "fm-pro-master-depth",
    "fm-pro-practice-path"
  ],
  fm_pro_advanced_clinical_purchased: "fm-pro-advanced-clinical",
  fm_pro_master_depth_purchased: "fm-pro-master-depth",
  fm_pro_practice_path_purchased: "fm-pro-practice-path",

  // HN Certification
  holistic_nutrition_coach_certification_purchased: "holistic-nutrition-coach-certification",
  hn_pro_accelerator_purchased: [
    "hn-pro-advanced-clinical",
    "hn-pro-master-depth",
    "hn-pro-practice-path"
  ],

  // NARC
  narc_recovery_coach_certification_purchased: "narc-recovery-coach-certification",
};

// Helper: Enroll user in a course
async function enrollInCourse(userId: string, courseSlug: string): Promise<{ success: boolean; courseName?: string }> {
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
  });

  if (!course) {
    console.log(`[Admin Create] Course not found: ${courseSlug}`);
    return { success: false };
  }

  // Check if already enrolled
  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: course.id } },
  });

  if (existing) {
    return { success: true, courseName: course.title };
  }

  // Create enrollment
  await prisma.enrollment.create({
    data: {
      userId,
      courseId: course.id,
      status: "ACTIVE",
      progress: 0,
    },
  });

  console.log(`[Admin Create] ✅ Enrolled in: ${course.title}`);
  return { success: true, courseName: course.title };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins/superusers can create users - SUPPORT cannot modify
    if (!session?.user?.id || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = createUserSchema.parse(body);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash: hashedPassword,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        role: data.role,
        isActive: true,
        hasCompletedProfile: false,
        hasCompletedOnboarding: false,
        leadSource: "admin-created",
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    const enrolledCourses: string[] = [];

    // Create tags and process enrollments if provided
    if (data.tags && data.tags.length > 0) {
      await prisma.userTag.createMany({
        data: data.tags.map((tag) => ({
          userId: user.id,
          tag: tag,
        })),
      });

      // Auto-enroll based on purchase tags
      for (const tag of data.tags) {
        const courseMapping = TAG_TO_COURSE_ENROLLMENT[tag];
        if (courseMapping) {
          const slugs = Array.isArray(courseMapping) ? courseMapping : [courseMapping];
          for (const slug of slugs) {
            const result = await enrollInCourse(user.id, slug);
            if (result.success && result.courseName) {
              enrolledCourses.push(result.courseName);
            }
          }
        }
      }
    }

    // =====================================================
    // SEND EMAILS (Like ClickFunnels Flow)
    // =====================================================

    let welcomeEmailSent = false;
    let enrollmentEmailSent = false;

    // Use the normalized email we know is valid
    const normalizedEmail = data.email.toLowerCase();
    const userName = user.firstName || "Student";

    if (data.sendWelcomeEmail !== false) {
      try {
        // Verify email with NeverBounce before sending
        const emailVerification = await verifyEmail(normalizedEmail);

        if (emailVerification.isValid) {
          // Send welcome email
          const welcomeResult = await sendWelcomeEmail(
            normalizedEmail,
            userName
          );

          if (welcomeResult.success) {
            welcomeEmailSent = true;
            // Mark welcome email sent
            await prisma.userTag.create({
              data: {
                userId: user.id,
                tag: "welcome_email_sent",
                value: new Date().toISOString()
              },
            });
            console.log(`[Admin Create] ✅ Welcome email sent to ${normalizedEmail}`);
          }

          // Send enrollment emails for each enrolled course
          for (const courseName of enrolledCourses) {
            try {
              await sendCourseEnrollmentEmail(
                normalizedEmail,
                userName,
                courseName,
                ""
              );
              enrollmentEmailSent = true;
              console.log(`[Admin Create] ✅ Enrollment email sent for ${courseName}`);
            } catch (enrollEmailError) {
              console.error(`[Admin Create] Failed enrollment email for ${courseName}:`, enrollEmailError);
            }
          }
        } else {
          console.log(`[Admin Create] ⏭️ Skipping email to ${normalizedEmail} - NeverBounce: ${emailVerification.result}`);
        }
      } catch (emailError) {
        console.error("[Admin Create] Email error:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `User created successfully${welcomeEmailSent ? " + welcome email sent" : ""}${enrolledCourses.length > 0 ? ` + enrolled in ${enrolledCourses.length} course(s)` : ""}`,
      user,
      enrolledCourses,
      welcomeEmailSent,
      enrollmentEmailSent,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
