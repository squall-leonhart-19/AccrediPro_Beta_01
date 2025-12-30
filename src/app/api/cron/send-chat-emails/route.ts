import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, brandedEmailWrapper } from "@/lib/email";
import { CHAT_CONVERSION_EMAILS } from "@/lib/chat-conversion-emails";

/**
 * CRON: Send chat conversion emails directly to ChatOptin records
 * 
 * This does NOT require User accounts - sends directly to email+firstName pairs.
 * Runs every hour via Vercel Cron.
 * 
 * Logic:
 * - Day 0: Send 2 hours after optin
 * - Day 1+: Send at scheduled delay
 * 
 * Tracks email progress via ChatOptin.emailsSent field
 */

export async function GET(request: NextRequest) {
    try {
        // Verify cron secret
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            console.warn("[CRON-CHAT-EMAIL] Unauthorized cron request");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("[CRON-CHAT-EMAIL] Starting chat conversion email processing...");

        const now = new Date();
        const results = {
            processed: 0,
            sent: 0,
            skipped: 0,
            errors: 0,
            completed: 0,
            alreadyCustomer: 0,
            details: [] as string[],
        };

        // Get all chat optins with emails that haven't completed the sequence
        const optins = await prisma.chatOptin.findMany({
            where: {
                email: { not: null },
                // emailsSent is less than total emails in sequence (or null = 0)
            },
            orderBy: { createdAt: "asc" },
            take: 50, // Process max 50 per run
        });

        console.log(`[CRON-CHAT-EMAIL] Found ${optins.length} optins to check`);

        for (const optin of optins) {
            if (!optin.email) continue;
            results.processed++;

            try {
                // Check if already a customer (has User with paid enrollment)
                const existingUser = await prisma.user.findUnique({
                    where: { email: optin.email.toLowerCase() },
                });

                if (existingUser) {
                    const hasCompletedEnrollment = await prisma.enrollment.findFirst({
                        where: { userId: existingUser.id, status: "COMPLETED" }
                    });
                    if (hasCompletedEnrollment) {
                        results.alreadyCustomer++;
                        results.details.push(`${optin.email}: Already customer, skipped`);
                        continue;
                    }
                }

                // Determine which email to send (0-indexed)
                const emailsSent = optin.emailsSent || 0;

                // Check if sequence is complete
                if (emailsSent >= CHAT_CONVERSION_EMAILS.length) {
                    results.completed++;
                    continue;
                }

                const emailToSend = CHAT_CONVERSION_EMAILS[emailsSent];
                if (!emailToSend) {
                    results.skipped++;
                    continue;
                }

                // Check if it's time to send
                const optinTime = optin.createdAt;
                const hoursDelay = emailToSend.delayDays * 24 + (emailToSend.delayHours || 0);
                const sendAfter = new Date(optinTime.getTime() + hoursDelay * 60 * 60 * 1000);

                if (now < sendAfter) {
                    // Not time yet
                    results.skipped++;
                    continue;
                }

                // Check if already sent recently (prevent double-send)
                const lastSentAt = optin.lastEmailSentAt;
                if (lastSentAt) {
                    const hoursSinceLastSend = (now.getTime() - lastSentAt.getTime()) / (1000 * 60 * 60);
                    // Don't send more than once per hour
                    if (hoursSinceLastSend < 1) {
                        results.skipped++;
                        continue;
                    }
                }

                // Prepare email content
                const firstName = optin.name || "Friend";
                let htmlContent = emailToSend.content
                    .replace(/\{\{firstName\}\}/g, firstName)
                    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
                    .replace(/\n\n/g, "</p><p>")
                    .replace(/\n/g, "<br>");

                const subject = emailToSend.subject
                    .replace(/\{\{firstName\}\}/g, firstName);

                // Send the email
                const result = await sendEmail({
                    to: optin.email,
                    subject,
                    html: brandedEmailWrapper(htmlContent),
                    type: "marketing",
                });

                if (result.success) {
                    // Update optin record
                    await prisma.chatOptin.update({
                        where: { id: optin.id },
                        data: {
                            emailsSent: emailsSent + 1,
                            lastEmailSentAt: now,
                        }
                    });

                    results.sent++;
                    results.details.push(`${optin.email}: Sent email ${emailsSent + 1}/${CHAT_CONVERSION_EMAILS.length} - "${subject}"`);
                    console.log(`[CRON-CHAT-EMAIL] ✅ Sent to ${optin.email}: ${subject}`);
                } else {
                    results.errors++;
                    results.details.push(`${optin.email}: Failed - ${result.error}`);
                    console.error(`[CRON-CHAT-EMAIL] ❌ Failed to send to ${optin.email}:`, result.error);
                }

            } catch (error) {
                results.errors++;
                const errMsg = error instanceof Error ? error.message : String(error);
                results.details.push(`${optin.email}: Error - ${errMsg}`);
                console.error(`[CRON-CHAT-EMAIL] Error for ${optin.email}:`, error);
            }
        }

        console.log("[CRON-CHAT-EMAIL] Complete:", {
            processed: results.processed,
            sent: results.sent,
            skipped: results.skipped,
            errors: results.errors,
        });

        return NextResponse.json({
            success: true,
            ...results,
            timestamp: now.toISOString(),
        });

    } catch (error) {
        console.error("[CRON-CHAT-EMAIL] Error:", error);
        return NextResponse.json(
            { error: "Failed to process chat emails" },
            { status: 500 }
        );
    }
}

// POST for manual testing
export async function POST(request: NextRequest) {
    return GET(request);
}
