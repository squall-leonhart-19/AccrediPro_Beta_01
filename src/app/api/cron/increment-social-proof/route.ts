import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * CRON: Increment Social Proof Numbers Daily
 *
 * Runs once per day via Vercel Cron
 *
 * Logic:
 * - For each course with socialProofEnabled = true
 * - Increment displayReviews by random 1-9
 * - Increment displayEnrollments by random 1-9
 * - This keeps the numbers fresh and growing
 */

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn("[CRON-SOCIAL-PROOF] Unauthorized cron request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[CRON-SOCIAL-PROOF] Starting daily social proof increment...");

    // Find all courses with social proof enabled
    const courses = await prisma.course.findMany({
      where: {
        socialProofEnabled: true,
        isPublished: true, // Only published courses
      },
      select: {
        id: true,
        title: true,
        displayReviews: true,
        displayEnrollments: true,
      },
    });

    console.log(`[CRON-SOCIAL-PROOF] Found ${courses.length} courses to update`);

    const results = {
      updated: 0,
      errors: 0,
      details: [] as { courseId: string; title: string; reviewsAdded: number; enrollmentsAdded: number }[],
    };

    // Update each course
    for (const course of courses) {
      try {
        // Random increment between 1-9
        const reviewsIncrement = Math.floor(Math.random() * 9) + 1;
        const enrollmentsIncrement = Math.floor(Math.random() * 9) + 1;

        await prisma.course.update({
          where: { id: course.id },
          data: {
            displayReviews: course.displayReviews + reviewsIncrement,
            displayEnrollments: course.displayEnrollments + enrollmentsIncrement,
          },
        });

        results.updated++;
        results.details.push({
          courseId: course.id,
          title: course.title,
          reviewsAdded: reviewsIncrement,
          enrollmentsAdded: enrollmentsIncrement,
        });

        console.log(
          `[CRON-SOCIAL-PROOF] Updated "${course.title}": +${reviewsIncrement} reviews, +${enrollmentsIncrement} enrollments`
        );
      } catch (error) {
        console.error(`[CRON-SOCIAL-PROOF] Error updating course ${course.id}:`, error);
        results.errors++;
      }
    }

    console.log(`[CRON-SOCIAL-PROOF] Completed. Updated: ${results.updated}, Errors: ${results.errors}`);

    return NextResponse.json({
      success: true,
      message: `Updated ${results.updated} courses`,
      results,
    });
  } catch (error) {
    console.error("[CRON-SOCIAL-PROOF] Fatal error:", error);
    return NextResponse.json(
      { error: "Failed to increment social proof", details: String(error) },
      { status: 500 }
    );
  }
}

// Also allow POST for manual triggers from admin
export async function POST(request: NextRequest) {
  return GET(request);
}
