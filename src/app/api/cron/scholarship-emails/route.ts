import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
    sendScholarshipReminder1hrEmail,
    sendScholarshipFinalWarningEmail,
} from "@/lib/scholarship-emails";

/**
 * GET /api/cron/scholarship-emails
 * 
 * Cron job to send cart abandonment emails:
 * - Email #3: 1 hour after approval, no purchase
 * - Email #4: 23 hours after approval, no purchase
 * 
 * Run every 15 minutes via Vercel cron.
 */
export async function GET() {
    try {
        const now = new Date();
        let sent1hr = 0;
        let sent23hr = 0;

        // Find all users with scholarship_approved_at tag but NOT scholarship_purchased
        const approvedUsers = await prisma.userTag.findMany({
            where: {
                tag: "scholarship_approved_at",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                    },
                },
            },
        });

        for (const approvalTag of approvedUsers) {
            const user = approvalTag.user;
            if (!user?.email || !user?.firstName) continue;

            const approvedAt = new Date(approvalTag.value);
            const hoursSinceApproval = (now.getTime() - approvedAt.getTime()) / (1000 * 60 * 60);

            // Check if already purchased
            const purchasedTag = await prisma.userTag.findUnique({
                where: {
                    userId_tag: {
                        userId: user.id,
                        tag: "scholarship_purchased",
                    },
                },
            });
            if (purchasedTag?.value === "true") continue;

            // Check what emails have been sent
            const email1hrSent = await prisma.userTag.findUnique({
                where: {
                    userId_tag: {
                        userId: user.id,
                        tag: "scholarship_email_1hr_sent",
                    },
                },
            });

            const email23hrSent = await prisma.userTag.findUnique({
                where: {
                    userId_tag: {
                        userId: user.id,
                        tag: "scholarship_email_23hr_sent",
                    },
                },
            });

            // Get scholarship details
            const finalAmountTag = await prisma.userTag.findUnique({
                where: { userId_tag: { userId: user.id, tag: "scholarship_final_amount" } },
            });
            const couponTag = await prisma.userTag.findUnique({
                where: { userId_tag: { userId: user.id, tag: "scholarship_coupon_code" } },
            });

            const finalAmount = finalAmountTag?.value ? parseInt(finalAmountTag.value) : null;
            const couponCode = couponTag?.value || null;

            if (!finalAmount || !couponCode) continue;

            // Email #3: 1 hour reminder (send between 1-2 hours)
            if (hoursSinceApproval >= 1 && hoursSinceApproval < 2 && !email1hrSent) {
                await sendScholarshipReminder1hrEmail({
                    to: user.email,
                    firstName: user.firstName,
                    finalAmount,
                    couponCode,
                });

                await prisma.userTag.create({
                    data: {
                        userId: user.id,
                        tag: "scholarship_email_1hr_sent",
                        value: now.toISOString(),
                    },
                });

                sent1hr++;
                console.log(`[Scholarship Cron] Sent 1hr reminder to ${user.email}`);
            }

            // Email #4: 23 hour final warning (send between 23-24 hours)
            if (hoursSinceApproval >= 23 && hoursSinceApproval < 24 && !email23hrSent) {
                await sendScholarshipFinalWarningEmail({
                    to: user.email,
                    firstName: user.firstName,
                    finalAmount,
                    couponCode,
                });

                await prisma.userTag.create({
                    data: {
                        userId: user.id,
                        tag: "scholarship_email_23hr_sent",
                        value: now.toISOString(),
                    },
                });

                sent23hr++;
                console.log(`[Scholarship Cron] Sent 23hr warning to ${user.email}`);
            }
        }

        return NextResponse.json({
            success: true,
            processed: approvedUsers.length,
            sent1hrReminder: sent1hr,
            sent23hrWarning: sent23hr,
            timestamp: now.toISOString(),
        });
    } catch (error) {
        console.error("[Scholarship Cron] Error:", error);
        return NextResponse.json(
            { error: "Cron job failed" },
            { status: 500 }
        );
    }
}
