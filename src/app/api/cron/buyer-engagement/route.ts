import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, personalEmailWrapper } from "@/lib/email";
import { FM_BUYER_SPRINT_SEQUENCE } from "@/lib/fm-buyer-sprint-sequence";
import { FM_PROGRESS_MILESTONES, FM_ENGAGEMENT_REMINDERS } from "@/lib/fm-buyer-milestones";
import { differenceInDays, differenceInHours } from "date-fns";

/**
 * BUYER ENGAGEMENT CRON JOB
 * 
 * Runs daily (or hourly for sprint emails)
 * 
 * 1. Send sprint sequence emails (0-48h after purchase)
 * 2. Send progress milestone emails (module completions)
 * 3. Send engagement reminders (stalled buyers)
 * 
 * Call with: /api/cron/buyer-engagement
 * Vercel Cron or external cron service
 */

// Verify cron secret to prevent abuse
function verifyCronSecret(request: Request): boolean {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Allow if no secret configured (dev mode)
    if (!cronSecret) return true;

    return authHeader === `Bearer ${cronSecret}`;
}

// Replace template variables
function replaceTemplateVars(content: string, vars: Record<string, string>): string {
    let result = content;
    for (const [key, value] of Object.entries(vars)) {
        result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }
    return result;
}

// Send email with proper formatting
async function sendBuyerEmail(
    to: string,
    subject: string,
    content: string,
    vars: Record<string, string>
): Promise<boolean> {
    try {
        const finalContent = replaceTemplateVars(content, vars);
        const finalSubject = replaceTemplateVars(subject, vars);

        await sendEmail({
            to,
            subject: finalSubject,
            html: personalEmailWrapper(finalContent),
            type: 'transactional',
        });

        return true;
    } catch (error) {
        console.error(`[buyer-engagement] Email failed to ${to}:`, error);
        return false;
    }
}

export async function GET(request: Request) {
    if (!verifyCronSecret(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = {
        sprintEmailsSent: 0,
        milestoneEmailsSent: 0,
        reminderEmailsSent: 0,
        errors: 0,
    };

    const now = new Date();

    try {
        // ============================================
        // 1. SPRINT SEQUENCE EMAILS (0-48h buyers)
        // ============================================

        // Find buyers with fm_certification_purchased tag in last 3 days
        // who haven't completed module 1
        const recentBuyers = await prisma.userTag.findMany({
            where: {
                tag: "functional_medicine_complete_certification_purchased",
                createdAt: { gte: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
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

        for (const buyerTag of recentBuyers) {
            const user = buyerTag.user;
            if (!user.email) continue;

            const hoursSincePurchase = differenceInHours(now, buyerTag.createdAt);

            // Check which sprint email to send
            for (const email of FM_BUYER_SPRINT_SEQUENCE) {
                const emailHours = email.day * 24 + email.delayHours;
                const sendTag = `sprint_email_${email.id}_sent`;

                // Check if eligible (within 1 hour window of scheduled time)
                if (hoursSincePurchase >= emailHours && hoursSincePurchase < emailHours + 24) {
                    // Check if already sent
                    const alreadySent = await prisma.userTag.findUnique({
                        where: { userId_tag: { userId: user.id, tag: sendTag } },
                    });

                    if (alreadySent) continue;

                    // Check if module 1 completed (stop sprint)
                    const module1Complete = await prisma.userTag.findFirst({
                        where: { userId: user.id, tag: { contains: "module_1_completed" } },
                    });

                    if (module1Complete) continue;

                    // Send email
                    const sent = await sendBuyerEmail(
                        user.email,
                        email.subject,
                        email.content,
                        {
                            firstName: user.firstName || "there",
                            email: user.email,
                        }
                    );

                    if (sent) {
                        await prisma.userTag.create({
                            data: { userId: user.id, tag: sendTag },
                        });
                        results.sprintEmailsSent++;
                        console.log(`[buyer-engagement] Sprint email ${email.id} sent to ${user.email}`);
                    } else {
                        results.errors++;
                    }
                }
            }
        }

        // ============================================
        // 2. PROGRESS MILESTONE EMAILS
        // ============================================

        // Check for users with milestone tags but no email sent
        const milestoneChecks = [
            { tag: "module_1_completed", milestone: FM_PROGRESS_MILESTONES.module_1_complete },
            { tag: "module_3_completed", milestone: FM_PROGRESS_MILESTONES.module_3_complete },
            { tag: "course_completed", milestone: FM_PROGRESS_MILESTONES.course_complete },
            { tag: "certificate_claimed", milestone: FM_PROGRESS_MILESTONES.certificate_claimed },
        ];

        for (const check of milestoneChecks) {
            // Find users with milestone tag who haven't received email
            const usersWithMilestone = await prisma.userTag.findMany({
                where: { tag: check.tag },
                include: {
                    user: {
                        include: {
                            tags: {
                                where: { tag: `${check.milestone.id}_email_sent` },
                            },
                        },
                    },
                },
            });

            for (const milestoneTag of usersWithMilestone) {
                const user = milestoneTag.user;

                // Skip if email already sent
                if (user.tags.length > 0) continue;
                if (!user.email) continue;

                // Send milestone email
                const sent = await sendBuyerEmail(
                    user.email,
                    check.milestone.subject,
                    check.milestone.content,
                    { firstName: user.firstName || "there" }
                );

                if (sent) {
                    await prisma.userTag.create({
                        data: { userId: user.id, tag: `${check.milestone.id}_email_sent` },
                    });
                    results.milestoneEmailsSent++;
                    console.log(`[buyer-engagement] Milestone ${check.milestone.id} email sent to ${user.email}`);
                } else {
                    results.errors++;
                }
            }
        }

        // ============================================
        // 3. ENGAGEMENT REMINDERS (Stalled Buyers)
        // ============================================

        const reminderChecks = [
            { days: 7, reminder: FM_ENGAGEMENT_REMINDERS.no_login_7d },
            { days: 14, reminder: FM_ENGAGEMENT_REMINDERS.no_progress_14d },
            { days: 30, reminder: FM_ENGAGEMENT_REMINDERS.stalled_30d },
            { days: 45, reminder: FM_ENGAGEMENT_REMINDERS.dormant_45d },
        ];

        for (const check of reminderChecks) {
            // Find buyers who purchased X+ days ago
            const cutoffDate = new Date(now.getTime() - check.days * 24 * 60 * 60 * 1000);

            const stalledBuyers = await prisma.userTag.findMany({
                where: {
                    tag: "functional_medicine_complete_certification_purchased",
                    createdAt: { lte: cutoffDate },
                },
                include: {
                    user: {
                        include: {
                            tags: true,
                        },
                    },
                },
            });

            for (const buyerTag of stalledBuyers) {
                const user = buyerTag.user;
                if (!user.email) continue;

                // Skip if reminder already sent
                const alreadySent = user.tags.some(t => t.tag === check.reminder.preventTag);
                if (alreadySent) continue;

                // Skip if course completed
                const courseComplete = user.tags.some(t => t.tag === "course_completed");
                if (courseComplete) continue;

                // Skip if logged in recently (check lastLoginAt)
                // This would need lastLoginAt field which we don't have, so use recent progress instead
                const recentProgress = user.tags.some(t =>
                    t.tag.includes("module_") &&
                    t.createdAt > new Date(now.getTime() - check.days * 24 * 60 * 60 * 1000)
                );
                if (recentProgress) continue;

                // Calculate deadline for 45d email
                const deadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                });

                // Send reminder email
                const sent = await sendBuyerEmail(
                    user.email,
                    check.reminder.subject,
                    check.reminder.content,
                    { firstName: user.firstName || "there", deadline }
                );

                if (sent) {
                    await prisma.userTag.create({
                        data: { userId: user.id, tag: check.reminder.preventTag },
                    });
                    results.reminderEmailsSent++;
                    console.log(`[buyer-engagement] Reminder ${check.reminder.id} sent to ${user.email}`);
                } else {
                    results.errors++;
                }
            }
        }

        return NextResponse.json({
            success: true,
            timestamp: now.toISOString(),
            results,
        });

    } catch (error) {
        console.error("[buyer-engagement] Cron error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
