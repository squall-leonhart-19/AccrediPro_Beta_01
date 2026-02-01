import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, brandedEmailWrapper, wasRecentlyEmailed } from "@/lib/email";

/**
 * CRON: Send sequence emails (nurture + recovery)
 *
 * Runs every 15 minutes via Vercel Cron
 *
 * Logic:
 * - Day 0 emails: Send immediately (nextSendAt set to enrollment time)
 * - Day 1+ emails: Send at 7 PM EST (19:00)
 *
 * This finds all enrollments where nextSendAt <= NOW and sends the email
 */

// 7 PM EST in UTC (EST = UTC-5, so 7 PM EST = 00:00 UTC next day, or 19+5=24=00)
// During daylight saving (EDT = UTC-4), 7 PM EDT = 23:00 UTC
const SEND_HOUR_UTC = 0; // Midnight UTC = 7 PM EST / 8 PM EDT

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn("[CRON-EMAIL] Unauthorized cron request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[CRON-EMAIL] Starting sequence email processing...");

    const now = new Date();
    const results = {
      processed: 0,
      sent: 0,
      skipped: 0,
      errors: 0,
      completed: 0,
      details: [] as string[],
    };

    // Find all enrollments ready to send (exclude users with bounced/suppressed tags and internal emails)
    const enrollments = await prisma.sequenceEnrollment.findMany({
      where: {
        status: "ACTIVE",
        nextSendAt: { lte: now },
        // Exclude users with bounced/suppressed marketing tags
        user: {
          marketingTags: {
            none: {
              tag: {
                slug: { in: ["suppress_bounced", "suppress_complained", "suppress_unsubscribed", "suppress_do_not_contact"] },
              },
            },
          },
          // Exclude internal team emails (@accredipro domains)
          email: {
            not: { contains: "@accredipro" },
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        sequence: {
          include: {
            emails: {
              where: { isActive: true },
              orderBy: { order: "asc" },
            },
          },
        },
      },
      take: 50, // Process max 50 per run to avoid timeouts
    });
    console.log(`[CRON-EMAIL] Found ${enrollments.length} enrollments ready to send`);

    for (const enrollment of enrollments) {
      results.processed++;

      const { user, sequence } = enrollment;
      const currentIndex = enrollment.currentEmailIndex;

      // Skip users without email
      if (!user.email) {
        results.skipped++;
        continue;
      }
      const userEmail = user.email;

      // Check if we have an email at this index
      if (currentIndex >= sequence.emails.length) {
        // Sequence complete
        await prisma.sequenceEnrollment.update({
          where: { id: enrollment.id },
          data: {
            status: "COMPLETED",
            completedAt: now,
            nextSendAt: null,
          },
        });

        await prisma.sequence.update({
          where: { id: sequence.id },
          data: { totalCompleted: { increment: 1 } },
        });

        results.completed++;
        results.details.push(`${userEmail}: Sequence completed`);
        continue;
      }

      const emailToSend = sequence.emails[currentIndex];

      if (!emailToSend) {
        results.skipped++;
        results.details.push(`${userEmail}: No email at index ${currentIndex}`);
        continue;
      }

      // Global guard: skip if user was emailed by ANY system in the last 2 hours
      const recentlyEmailed = await wasRecentlyEmailed(userEmail, 2);
      if (recentlyEmailed) {
        results.skipped++;
        results.details.push(`${userEmail}: Skipped - recently emailed (cross-system guard)`);
        continue;
      }

      try {
        // Replace placeholders
        const firstName = user.firstName || "there";
        const lastName = user.lastName || "";
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || firstName;
        const baseUrl = process.env.NEXTAUTH_URL || "https://learn.accredipro.academy";

        let htmlContent = (emailToSend.customContent || "")
          .replace(/\{\{firstName\}\}/g, firstName)
          .replace(/\{\{lastName\}\}/g, lastName)
          .replace(/\{\{email\}\}/g, userEmail)
          .replace(/\{\{fullName\}\}/g, fullName)
          // URL replacements
          .replace(/\{\{MINI_DIPLOMA_URL\}\}/g, `${baseUrl}/login`)
          .replace(/\{\{GRADUATE_TRAINING_URL\}\}/g, `${baseUrl}/training`)
          .replace(/\{\{CERTIFICATION_URL\}\}/g, `${baseUrl}/courses/functional-medicine-certification`)
          .replace(/\{\{DASHBOARD_URL\}\}/g, `${baseUrl}/dashboard`)
          .replace(/\{\{ROADMAP_URL\}\}/g, `${baseUrl}/my-personal-roadmap-by-coach-sarah`)
          .replace(/\{\{LOGIN_URL\}\}/g, `${baseUrl}/login`)
          // Convert markdown bold/italic to HTML
          .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
          .replace(/\*([^*]+)\*/g, "<em>$1</em>")
          // Convert line breaks
          .replace(/\n\n/g, "</p><p>")
          .replace(/\n/g, "<br>");

        const subject = (emailToSend.customSubject || "Your Mini Diploma Journey")
          .replace(/\{\{firstName\}\}/g, firstName);

        // CRITICAL: Advance the enrollment index BEFORE sending to prevent
        // re-sending the same email if the DB update fails after a successful send.
        // Missing one email (if send fails) is far better than spamming repeatedly.
        const nextIndex = currentIndex + 1;
        let nextSendAt: Date | null = null;

        if (nextIndex < sequence.emails.length) {
          const nextEmail = sequence.emails[nextIndex];
          nextSendAt = calculateNextSendTime(now, nextEmail.delayDays, nextEmail.delayHours);
        }

        await prisma.sequenceEnrollment.update({
          where: { id: enrollment.id },
          data: {
            currentEmailIndex: nextIndex,
            emailsReceived: { increment: 1 },
            nextSendAt,
          },
        });

        // Now send the email (enrollment is already advanced, safe from re-send loops)
        const result = await sendEmail({
          to: userEmail,
          subject,
          html: brandedEmailWrapper(htmlContent),
          type: "transactional",
        });

        if (result.success) {
          // Link the EmailSend record (created by sendEmail) to the sequence email
          // sendEmail already creates an EmailSend record — update it with sequenceEmailId
          const resendId = (result.data as { id?: string })?.id;
          if (resendId) {
            await prisma.emailSend.updateMany({
              where: { resendId },
              data: { sequenceEmailId: emailToSend.id },
            });
          }

          // Update email stats
          await prisma.sequenceEmail.update({
            where: { id: emailToSend.id },
            data: { sentCount: { increment: 1 } },
          });

          results.sent++;
          results.details.push(`${userEmail}: Sent email ${currentIndex + 1}/${sequence.emails.length} - "${subject}"`);
          console.log(`[CRON-EMAIL] Sent to ${userEmail}: ${subject}`);
        } else {
          // Email failed but index already advanced — log the failure.
          // This prevents spam loops. The user misses this email but won't be re-spammed.
          results.errors++;
          results.details.push(`${userEmail}: Failed to send (index advanced to prevent re-send) - ${result.error}`);
          console.error(`[CRON-EMAIL] Failed to send to ${userEmail} (index advanced):`, result.error);
        }
      } catch (error) {
        results.errors++;
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        results.details.push(`${userEmail}: Error - ${errMsg}`);
        console.error(`[CRON-EMAIL] Error for ${userEmail}:`, error);
      }
    }

    console.log(`[CRON-EMAIL] Complete:`, {
      processed: results.processed,
      sent: results.sent,
      skipped: results.skipped,
      errors: results.errors,
      completed: results.completed,
    });

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("[CRON-EMAIL] Error:", error);
    return NextResponse.json(
      { error: "Failed to process sequence emails" },
      { status: 500 }
    );
  }
}

/**
 * Calculate the next send time
 *
 * Day 0 (delayDays=0, delayHours=0): Send in 5 minutes
 * Day 1+: Send at 7 PM EST (00:00 UTC) after the delay
 *
 * The key invariant: the returned date must always be in the future
 * AND at least delayDays ahead of fromDate (to respect the intended spacing).
 */
function calculateNextSendTime(fromDate: Date, delayDays: number, delayHours: number): Date {
  // If immediate (Day 0), send in 5 minutes
  if (delayDays === 0 && delayHours === 0) {
    return new Date(fromDate.getTime() + 5 * 60 * 1000);
  }

  // Start from fromDate + delayDays + delayHours
  const targetDate = new Date(fromDate);
  targetDate.setUTCDate(targetDate.getUTCDate() + delayDays);
  targetDate.setUTCHours(targetDate.getUTCHours() + delayHours);

  // Set to the send hour (00:00 UTC = 7 PM EST) on the target day
  const sendDate = new Date(targetDate);
  sendDate.setUTCHours(SEND_HOUR_UTC, 0, 0, 0);

  // Ensure the send date is strictly in the future.
  // If truncating to SEND_HOUR_UTC pushed the date before now (e.g., cron runs
  // at 00:05 UTC and sendDate lands at 00:00 UTC same day), move to next day.
  // But also ensure we don't shorten the intended delay — the send date must be
  // at least (delayDays - 1) full days after fromDate to respect spacing.
  const minimumSendTime = new Date(fromDate.getTime() + Math.max(0, delayDays - 1) * 24 * 60 * 60 * 1000);
  while (sendDate <= fromDate || sendDate < minimumSendTime) {
    sendDate.setUTCDate(sendDate.getUTCDate() + 1);
  }

  return sendDate;
}

// Also allow POST for manual testing
export async function POST(request: NextRequest) {
  return GET(request);
}
