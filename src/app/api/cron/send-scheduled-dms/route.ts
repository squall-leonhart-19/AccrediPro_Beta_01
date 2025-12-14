import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { triggerAutoMessage } from "@/lib/auto-messages";

/**
 * CRON: Send scheduled DMs based on sequence enrollment days
 *
 * This should be called daily (e.g., via Vercel Cron, GitHub Actions, or external cron)
 *
 * It checks all active sequence enrollments and sends DMs for:
 * - Day 5: Graduate Training nudge
 * - Day 10: Progress check-in
 * - Day 20: Investment talk
 * - Day 27: Last days urgency
 * - Day 30: Final call
 */

// Map of days to triggers
const DAY_TO_TRIGGER: Record<number, string> = {
  5: "sequence_day_5",
  10: "sequence_day_10",
  20: "sequence_day_20",
  27: "sequence_day_27",
  30: "sequence_day_30",
};

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (optional but recommended)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn("[CRON-DM] Unauthorized cron request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[CRON-DM] Starting scheduled DM processing...");

    const now = new Date();
    const results = {
      processed: 0,
      sent: 0,
      skipped: 0,
      errors: 0,
    };

    // Get all active sequence enrollments
    const enrollments = await prisma.sequenceEnrollment.findMany({
      where: {
        status: "ACTIVE",
        completedAt: null,
        exitedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            email: true,
          },
        },
        sequence: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    console.log(`[CRON-DM] Found ${enrollments.length} active enrollments`);

    for (const enrollment of enrollments) {
      results.processed++;

      // Calculate days since enrollment
      const enrolledAt = new Date(enrollment.enrolledAt);
      const daysSinceEnrollment = Math.floor(
        (now.getTime() - enrolledAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Check if this day has a scheduled DM
      const trigger = DAY_TO_TRIGGER[daysSinceEnrollment];

      if (!trigger) {
        results.skipped++;
        continue;
      }

      console.log(
        `[CRON-DM] Day ${daysSinceEnrollment} for ${enrollment.user.email} - trigger: ${trigger}`
      );

      try {
        await triggerAutoMessage({
          userId: enrollment.user.id,
          trigger: trigger as any,
        });
        results.sent++;
        console.log(`[CRON-DM] Sent ${trigger} DM to ${enrollment.user.email}`);
      } catch (error) {
        results.errors++;
        console.error(
          `[CRON-DM] Error sending ${trigger} DM to ${enrollment.user.email}:`,
          error
        );
      }
    }

    console.log(`[CRON-DM] Complete:`, results);

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("[CRON-DM] Error:", error);
    return NextResponse.json(
      { error: "Failed to process scheduled DMs" },
      { status: 500 }
    );
  }
}

// Also allow POST for testing
export async function POST(request: NextRequest) {
  return GET(request);
}
