import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  sendWHReminderDay1Email,
  sendWHReminderDay2Email,
  sendWHReminderDay3Email,
  sendWHReminderDay5Email,
  sendWHReminderDay6Email,
  sendWHExpiredEmail,
} from "@/lib/email";

/**
 * CRON: Send Women's Health Mini Diploma reminder emails
 *
 * Runs daily via Vercel Cron (recommended: 10 AM EST / 3 PM UTC)
 *
 * Email Sequence (7-day access):
 * - Day 0: Welcome email (sent on optin, not here)
 * - Day 1: "Lesson 1 is waiting" (if 0 lessons done)
 * - Day 2: Soft nudge / "Great start!" (based on progress)
 * - Day 3: Progress update + encouragement
 * - Day 5: Urgency - "Only 2 days left!"
 * - Day 6: FINAL - "Last chance - expires tomorrow"
 * - Day 7+: Access expired email (offer to restart or upgrade)
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
      day2Sent: 0,
      day3Sent: 0,
      day5Sent: 0,
      day6Sent: 0,
      expiredSent: 0,
      skipped: 0,
      errors: 0,
      details: [] as string[],
    };

    // ============================================
    // PART 1: Active users (access not expired)
    // ============================================
    const activeUsers = await prisma.user.findMany({
      where: {
        miniDiplomaCategory: "womens-health",
        userType: "LEAD",
        isActive: true,
        miniDiplomaOptinAt: { not: null },
        miniDiplomaCompletedAt: null, // Not completed
        accessExpiresAt: { gt: now }, // Access still valid
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
      take: 100,
    });

    console.log(`[CRON-WH-REMINDER] Found ${activeUsers.length} active WH leads`);

    for (const user of activeUsers) {
      results.processed++;

      if (!user.miniDiplomaOptinAt) continue;

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
      const sentReminders = user.tags
        .filter((t) => t.tag.startsWith("wh-reminder-sent:"))
        .map((t) => t.tag);

      const firstName = user.firstName || "there";

      try {
        // Day 6 reminder (final day) - HIGHEST PRIORITY
        if (daysSinceOptin >= 6 && !sentReminders.includes("wh-reminder-sent:day6")) {
          await sendWHReminderDay6Email(user.email, firstName, completedLessons);
          await prisma.userTag.create({
            data: { userId: user.id, tag: "wh-reminder-sent:day6", value: now.toISOString() },
          });
          results.day6Sent++;
          results.details.push(`${user.email}: Sent Day 6 (final day)`);
          continue;
        }

        // Day 5 reminder (urgency)
        if (daysSinceOptin >= 5 && !sentReminders.includes("wh-reminder-sent:day5")) {
          await sendWHReminderDay5Email(user.email, firstName, completedLessons);
          await prisma.userTag.create({
            data: { userId: user.id, tag: "wh-reminder-sent:day5", value: now.toISOString() },
          });
          results.day5Sent++;
          results.details.push(`${user.email}: Sent Day 5 (urgency)`);
          continue;
        }

        // Day 3 reminder (progress update)
        if (daysSinceOptin >= 3 && !sentReminders.includes("wh-reminder-sent:day3")) {
          await sendWHReminderDay3Email(user.email, firstName, completedLessons);
          await prisma.userTag.create({
            data: { userId: user.id, tag: "wh-reminder-sent:day3", value: now.toISOString() },
          });
          results.day3Sent++;
          results.details.push(`${user.email}: Sent Day 3 (progress)`);
          continue;
        }

        // Day 2 reminder (soft nudge)
        if (daysSinceOptin >= 2 && !sentReminders.includes("wh-reminder-sent:day2")) {
          await sendWHReminderDay2Email(user.email, firstName, completedLessons);
          await prisma.userTag.create({
            data: { userId: user.id, tag: "wh-reminder-sent:day2", value: now.toISOString() },
          });
          results.day2Sent++;
          results.details.push(`${user.email}: Sent Day 2 (soft nudge)`);
          continue;
        }

        // Day 1 reminder (haven't started)
        if (daysSinceOptin >= 1 && completedLessons === 0 && !sentReminders.includes("wh-reminder-sent:day1")) {
          await sendWHReminderDay1Email(user.email, firstName);
          await prisma.userTag.create({
            data: { userId: user.id, tag: "wh-reminder-sent:day1", value: now.toISOString() },
          });
          results.day1Sent++;
          results.details.push(`${user.email}: Sent Day 1 (not started)`);
          continue;
        }

        results.skipped++;
      } catch (error) {
        results.errors++;
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        results.details.push(`${user.email}: Error - ${errMsg}`);
        console.error(`[CRON-WH-REMINDER] Error for ${user.email}:`, error);
      }
    }

    // ============================================
    // PART 2: Expired users (access ended, not completed)
    // ============================================
    const expiredUsers = await prisma.user.findMany({
      where: {
        miniDiplomaCategory: "womens-health",
        userType: "LEAD",
        isActive: true,
        miniDiplomaOptinAt: { not: null },
        miniDiplomaCompletedAt: null, // Not completed
        accessExpiresAt: { lt: now }, // Access expired
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        accessExpiresAt: true,
        tags: {
          select: { tag: true, value: true },
        },
      },
      take: 50,
    });

    console.log(`[CRON-WH-REMINDER] Found ${expiredUsers.length} expired WH leads`);

    for (const user of expiredUsers) {
      results.processed++;

      // Check if expired email already sent
      const alreadySentExpired = user.tags.some((t) => t.tag === "wh-reminder-sent:expired");
      if (alreadySentExpired) {
        results.skipped++;
        continue;
      }

      // Only send expired email within 3 days of expiry (not too late)
      const daysSinceExpiry = user.accessExpiresAt
        ? Math.floor((now.getTime() - user.accessExpiresAt.getTime()) / (24 * 60 * 60 * 1000))
        : 0;

      if (daysSinceExpiry > 3) {
        results.skipped++;
        results.details.push(`${user.email}: Expired too long ago (${daysSinceExpiry} days)`);
        continue;
      }

      const completedLessons = user.tags.filter((t) =>
        t.tag.startsWith("wh-lesson-complete:")
      ).length;

      const firstName = user.firstName || "there";

      try {
        await sendWHExpiredEmail(user.email, firstName, completedLessons);
        await prisma.userTag.create({
          data: { userId: user.id, tag: "wh-reminder-sent:expired", value: now.toISOString() },
        });
        results.expiredSent++;
        results.details.push(`${user.email}: Sent expired email (${completedLessons}/9 lessons)`);
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
      day2Sent: results.day2Sent,
      day3Sent: results.day3Sent,
      day5Sent: results.day5Sent,
      day6Sent: results.day6Sent,
      expiredSent: results.expiredSent,
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
