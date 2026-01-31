import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Cron job to retry failed emails
// Called every 5 minutes by Vercel Cron
export async function GET(req: Request) {
    try {
        // Verify cron secret
        const authHeader = req.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            // Allow access in development
            if (process.env.NODE_ENV === "production") {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        // Find emails due for retry
        const emailsToRetry = await prisma.emailSend.findMany({
            where: {
                status: "FAILED",
                retryAfter: { lte: new Date() },
                attemptCount: { lt: 5 }, // Max 5 attempts
            },
            take: 50, // Process max 50 per run
            orderBy: { retryAfter: "asc" },
        });

        console.log(`[Email Retry] Found ${emailsToRetry.length} emails to retry`);

        let retried = 0;
        let succeeded = 0;
        let permanentlyFailed = 0;

        for (const email of emailsToRetry) {
            try {
                // Increment attempt count
                const newAttemptCount = email.attemptCount + 1;

                // Try to resend
                // Note: We don't have the HTML content stored, so we can only retry
                // emails that were previously sent successfully (have resendId)
                // For a full retry system, we'd need to store the email content

                if (!email.resendId) {
                    // Can't retry without original content - mark as permanently failed
                    await prisma.emailSend.update({
                        where: { id: email.id },
                        data: {
                            attemptCount: newAttemptCount,
                            status: newAttemptCount >= 5 ? "FAILED" : "FAILED",
                            lastError: "Cannot retry: no resendId (original content not available)",
                            retryAfter: null, // Stop retrying
                        }
                    });
                    permanentlyFailed++;
                    continue;
                }

                // For now, just update the record - actual retry would need stored content
                // This cron is more for monitoring and will be enhanced with Postmark fallback

                // Calculate next retry time with exponential backoff
                const backoffMinutes = Math.pow(2, newAttemptCount) * 5; // 5, 10, 20, 40, 80 mins
                const nextRetry = new Date(Date.now() + backoffMinutes * 60 * 1000);

                await prisma.emailSend.update({
                    where: { id: email.id },
                    data: {
                        attemptCount: newAttemptCount,
                        retryAfter: newAttemptCount >= 5 ? null : nextRetry,
                        lastError: newAttemptCount >= 5
                            ? `Max attempts reached (${newAttemptCount})`
                            : email.lastError,
                    }
                });

                if (newAttemptCount >= 5) {
                    permanentlyFailed++;
                } else {
                    retried++;
                }
            } catch (error) {
                console.error(`[Email Retry] Error processing ${email.id}:`, error);
            }
        }

        return NextResponse.json({
            success: true,
            processed: emailsToRetry.length,
            retried,
            succeeded,
            permanentlyFailed,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("[Email Retry Cron] Error:", error);
        return NextResponse.json({ error: "Failed to process retry queue" }, { status: 500 });
    }
}
