import { prisma } from "@/lib/prisma";

/**
 * Mini-diploma course slugs — these are FREE lead magnets, not paid courses.
 * Enrolling in one of these does NOT trigger an upgrade.
 */
const MINI_DIPLOMA_SLUGS = [
  "womens-health-mini-diploma",
  "womens-hormone-health-mini-diploma",
  "functional-medicine-mini-diploma",
  "gut-health-mini-diploma",
  "hormone-health-mini-diploma",
  "holistic-nutrition-mini-diploma",
  "nurse-coach-mini-diploma",
  "health-coach-mini-diploma",
  "spiritual-healing-mini-diploma",
  "energy-healing-mini-diploma",
  "christian-coaching-mini-diploma",
  "reiki-healing-mini-diploma",
  "adhd-coaching-mini-diploma",
  "pet-nutrition-mini-diploma",
  "integrative-health-functional-medicine-mini-diploma",
];

/**
 * Check if a course slug is a paid course (not a mini-diploma)
 */
export function isPaidCourseSlug(slug: string): boolean {
  return !MINI_DIPLOMA_SLUGS.includes(slug);
}

/**
 * Upgrade a LEAD user to a full STUDENT.
 *
 * This is the shared core logic used by:
 * 1. ClickFunnels purchase webhook (automatic on purchase)
 * 2. Tag handler (automatic when certification tag is applied)
 * 3. Admin manual upgrade endpoint
 *
 * What it does:
 * - Changes userType from LEAD to STUDENT
 * - Clears accessExpiresAt (removes 48h/30d access limit)
 * - Optionally enrolls in a course
 * - Adds "upgraded_to_student" tracking tag
 */
export async function upgradeLeadToStudent(
  userId: string,
  options?: {
    courseSlug?: string;
    source?: string; // "webhook" | "tag" | "admin"
  }
): Promise<{
  upgraded: boolean;
  alreadyStudent: boolean;
  enrolled: boolean;
  courseName?: string;
  error?: string;
}> {
  try {
    // Fetch current user state
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        userType: true,
        accessExpiresAt: true,
      },
    });

    if (!user) {
      return { upgraded: false, alreadyStudent: false, enrolled: false, error: "User not found" };
    }

    // Check if already a STUDENT
    if (user.userType === "STUDENT") {
      console.log(`[Upgrade] User ${user.email} is already a STUDENT, skipping userType upgrade`);

      // Still enroll in course if provided (existing students can buy additional courses)
      let enrolled = false;
      let courseName: string | undefined;

      if (options?.courseSlug && isPaidCourseSlug(options.courseSlug)) {
        const enrollResult = await enrollInCourse(userId, options.courseSlug);
        enrolled = enrollResult.enrolled;
        courseName = enrollResult.courseName;
      }

      return { upgraded: false, alreadyStudent: true, enrolled, courseName };
    }

    // --- UPGRADE LEAD → STUDENT ---

    // 1. Update user: flip userType + clear access expiry
    await prisma.user.update({
      where: { id: userId },
      data: {
        userType: "STUDENT",
        accessExpiresAt: null, // Remove time limit — full access
      },
    });

    console.log(`[Upgrade] ✅ ${user.email} upgraded from LEAD to STUDENT (source: ${options?.source || "unknown"})`);

    // 2. Add tracking tag
    const now = new Date();
    await prisma.userTag.upsert({
      where: { userId_tag: { userId, tag: "upgraded_to_student" } },
      update: {
        metadata: {
          upgradedAt: now.toISOString(),
          source: options?.source || "unknown",
          courseSlug: options?.courseSlug || null,
        },
      },
      create: {
        userId,
        tag: "upgraded_to_student",
        value: options?.source || "unknown",
        metadata: {
          upgradedAt: now.toISOString(),
          source: options?.source || "unknown",
          courseSlug: options?.courseSlug || null,
        },
      },
    });

    // 3. Enroll in course if provided
    let enrolled = false;
    let courseName: string | undefined;

    if (options?.courseSlug && isPaidCourseSlug(options.courseSlug)) {
      const enrollResult = await enrollInCourse(userId, options.courseSlug);
      enrolled = enrollResult.enrolled;
      courseName = enrollResult.courseName;
    }

    return { upgraded: true, alreadyStudent: false, enrolled, courseName };
  } catch (error) {
    console.error(`[Upgrade] ❌ Failed to upgrade user ${userId}:`, error);
    return {
      upgraded: false,
      alreadyStudent: false,
      enrolled: false,
      error: String(error),
    };
  }
}

/**
 * Enroll user in a course (if not already enrolled)
 */
async function enrollInCourse(
  userId: string,
  courseSlug: string
): Promise<{ enrolled: boolean; courseName?: string }> {
  try {
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { id: true, title: true },
    });

    if (!course) {
      console.error(`[Upgrade] Course not found: ${courseSlug}`);
      return { enrolled: false };
    }

    // Check existing enrollment
    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: course.id } },
    });

    if (existing) {
      console.log(`[Upgrade] User already enrolled in ${courseSlug}`);
      return { enrolled: false, courseName: course.title };
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

    // Update course analytics
    await prisma.courseAnalytics.upsert({
      where: { courseId: course.id },
      update: { totalEnrolled: { increment: 1 } },
      create: { courseId: course.id, totalEnrolled: 1 },
    });

    // Add enrollment tracking tag
    await prisma.userTag.upsert({
      where: { userId_tag: { userId, tag: `enrolled_${courseSlug}` } },
      update: {},
      create: { userId, tag: `enrolled_${courseSlug}` },
    });

    console.log(`[Upgrade] ✅ Enrolled in ${course.title} (${courseSlug})`);
    return { enrolled: true, courseName: course.title };
  } catch (error) {
    console.error(`[Upgrade] Failed to enroll in ${courseSlug}:`, error);
    return { enrolled: false };
  }
}
