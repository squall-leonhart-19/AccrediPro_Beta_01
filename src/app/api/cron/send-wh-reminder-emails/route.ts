import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  sendWHReminderDay1Email,
  sendWHReminderDay3Email,
  sendWHReminderDay5Email,
  sendWHReminderDay6Email,
} from "@/lib/email";

/**
 * CRON: Send Women's Health Mini Diploma reminder emails
 *
 * Runs daily via Vercel Cron (recommended: 10 AM EST / 3 PM UTC)
 *
 * Logic:
 * - Day 1: User opted in 24+ hours ago, hasn't started any lessons
 * - Day 3: User opted in 3+ days ago, hasn't completed all lessons
 * - Day 5: User opted in 5+ days ago, hasn't completed all lessons (urgency)
 * - Day 6: User opted in 6+ days ago, hasn't completed all lessons (final day)
 *
 * Uses UserTag to track which reminders have been sent to avoid duplicates.
 */

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn("[CRON-WH-REMINDER] Unauthorized cron request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[CRON-WH-REMINDER] Starting Women's Health reminder emails...");

    const now = new Date();
    const results = {
      processed: 0,
      day1Sent: 0,
      day3Sent: 0,
      day5Sent: 0,
      day6Sent: 0,
      skipped: 0,
      errors: 0,
      details: [] as string[],
    };

    // Find all users who opted into Women's Health mini diploma
    // Filter: LEAD users with miniDiplomaCategory = "womens-health"
    const users = await prisma.user.findMany({
      where: {
        miniDiplomaCategory: "womens-health",
        userType: "LEAD",
        isActive: true,
        miniDiplomaOptinAt: { not: null },
        // Don't send to users who already completed
        miniDiplomaCompletedAt: null,
        // Only users whose access hasn't expired yet
        accessExpiresAt: { gt: now },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        miniDiplomaOptinAt: true,
        tags: {
          select: { tag: true, value: true },
        },
      },
      take: 100, // Process max 100 per run
    });

    console.log(`[CRON-WH-REMINDER] Found ${users.length} active WH leads to check`);

    for (const user of users) {
      results.processed++;

      if (!user.miniDiplomaOptinAt) continue;

      // Calculate days since optin
      const daysSinceOptin = Math.floor(
        (now.getTime() - user.miniDiplomaOptinAt.getTime()) / (24 * 60 * 60 * 1000)
      );

      // Get completed lessons count from tags
      const completedLessons = user.tags.filter((t) =>
        t.tag.startsWith("wh-lesson-complete:")
      ).length;

      // Skip if already completed all 9 lessons
      if (completedLessons >= 9) {
        results.skipped++;
        results.details.push(`${user.email}: Already completed all lessons`);
        continue;
      }

      // Check which reminders have been sent
      const reminderTags = user.tags.filter((t) =>
        t.tag.startsWith("wh-reminder-sent:")
      );
      const sentReminders = reminderTags.map((t) => t.tag);

      const firstName = user.firstName || "there";

      try {
        // Day 6 reminder (final day)
        if (
          daysSinceOptin >= 6 &&
          !sentReminders.includes("wh-reminder-sent:day6")
        ) {
          await sendWHReminderDay6Email(user.email, firstName, completedLessons);
          await prisma.userTag.create({
            data: {
              userId: user.id,
              tag: "wh-reminder-sent:day6",
              value: now.toISOString(),
            },
          });
          results.day6Sent++;
          results.details.push(`${user.email}: Sent Day 6 reminder (final day)`);
          console.log(`[CRON-WH-REMINDER] Day 6 sent to ${user.email}`);
          continue; // Only send one reminder per run
        }

        // Day 5 reminder (urgency)
        if (
          daysSinceOptin >= 5 &&
          !sentReminders.includes("wh-reminder-sent:day5")
        ) {
          await sendWHReminderDay5Email(user.email, firstName, completedLessons);
          await prisma.userTag.create({
            data: {
              userId: user.id,
              tag: "wh-reminder-sent:day5",
              value: now.toISOString(),
            },
          });
          results.day5Sent++;
          results.details.push(`${user.email}: Sent Day 5 reminder (urgency)`);
          console.log(`[CRON-WH-REMINDER] Day 5 sent to ${user.email}`);
          continue;
        }

        // Day 3 reminder (in progress)
        if (
          daysSinceOptin >= 3 &&
          !sentReminders.includes("wh-reminder-sent:day3")
        ) {
          await sendWHReminderDay3Email(user.email, firstName, completedLessons);
          await prisma.userTag.create({
            data: {
              userId: user.id,
              tag: "wh-reminder-sent:day3",
              value: now.toISOString(),
            },
          });
          results.day3Sent++;
          results.details.push(`${user.email}: Sent Day 3 reminder`);
          console.log(`[CRON-WH-REMINDER] Day 3 sent to ${user.email}`);
          continue;
        }

        // Day 1 reminder (haven't started)
        if (
          daysSinceOptin >= 1 &&
          completedLessons === 0 &&
          !sentReminders.includes("wh-reminder-sent:day1")
        ) {
          await sendWHReminderDay1Email(user.email, firstName);
          await prisma.userTag.create({
            data: {
              userId: user.id,
              tag: "wh-reminder-sent:day1",
              value: now.toISOString(),
            },
          });
          results.day1Sent++;
          results.details.push(`${user.email}: Sent Day 1 reminder (not started)`);
          console.log(`[CRON-WH-REMINDER] Day 1 sent to ${user.email}`);
          continue;
        }

        // No reminder to send
        results.skipped++;
      } catch (error) {
        results.errors++;
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        results.details.push(`${user.email}: Error - ${errMsg}`);
        console.error(`[CRON-WH-REMINDER] Error for ${user.email}:`, error);
      }
    }

    console.log(`[CRON-WH-REMINDER] Complete:`, {
      processed: results.processed,
      day1Sent: results.day1Sent,
      day3Sent: results.day3Sent,
      day5Sent: results.day5Sent,
      day6Sent: results.day6Sent,
      skipped: results.skipped,
      errors: results.errors,
    });

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("[CRON-WH-REMINDER] Error:", error);
    return NextResponse.json(
      { error: "Failed to process WH reminder emails" },
      { status: 500 }
    );
  }
}

// Also allow POST for manual testing
export async function POST(request: NextRequest) {
  return GET(request);
}
