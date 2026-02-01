import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import {
    SPRINT_SEQUENCE,
    RECOVERY_SEQUENCE,
    STALLED_SEQUENCE,
    MILESTONE_EMAILS,
    REENGAGEMENT_EMAILS,
    fillTemplateVariables,
    wrapInBrandedTemplate,
} from "@/lib/buyer-retention-system";
import { differenceInDays, differenceInHours } from "date-fns";


/**
 * UNIVERSAL BUYER ENGAGEMENT CRON JOB
 * 
 * Works for ALL course purchases, not just FM.
 * 
 * Sequences:
 * 1. SPRINT - Push to start (0-5 days)
 * 2. RECOVERY - Never logged in (3-30 days)
 * 3. STALLED - Logged in but no progress (3-14 days)
 * 4. MILESTONE - Celebrate achievements
 * 5. RE-ENGAGEMENT - Welcome back after absence
 * 
 * Runs hourly via Vercel Cron
 */

function verifyCronSecret(request: Request): boolean {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) return true;
    return authHeader === `Bearer ${cronSecret}`;
}

async function sendBuyerEmail(
    to: string,
    subject: string,
    content: string,
    vars: Record<string, string>
): Promise<boolean> {
    try {
        const finalContent = fillTemplateVariables(content, vars);
        const finalSubject = fillTemplateVariables(subject, vars);

        // Use branded HTML template with subtle footer
        const htmlEmail = wrapInBrandedTemplate(finalContent, {
            firstName: vars.firstName || 'there',
            dashboardUrl: vars.dashboardUrl || 'https://learn.accredipro.academy/dashboard',
        });

        await sendEmail({
            to,
            subject: finalSubject,
            html: htmlEmail,
            text: finalContent, // Plain text fallback
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
        recoveryEmailsSent: 0,
        stalledEmailsSent: 0,
        milestoneEmailsSent: 0,
        reengagementEmailsSent: 0,
        errors: 0,
    };

    const now = new Date();
    const dashboardUrl = "https://learn.accredipro.academy/dashboard";

    try {
        // ============================================
        // Get all STUDENTS who purchased courses
        // (userType = STUDENT means they bought something)
        // ============================================

        const students = await prisma.user.findMany({
            where: {
                userType: "STUDENT",
                isFakeProfile: false,
                email: { not: null },
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                createdAt: true,
                firstLoginAt: true,
                lastLoginAt: true,
                tags: { select: { tag: true, createdAt: true } },
                enrollments: {
                    where: { status: "ACTIVE" },
                    select: {
                        courseId: true,
                        progress: true,
                        enrolledAt: true,
                    }
                },
            }
        });

        for (const user of students) {
            if (!user.email) continue;

            const tagSet = new Set(user.tags.map(t => t.tag));
            const daysSinceCreated = differenceInDays(now, user.createdAt);
            const hoursSinceCreated = differenceInHours(now, user.createdAt);
            const hasLoggedIn = !!user.firstLoginAt;
            const hasProgress = user.enrollments.some(e => e.progress > 0);

            const vars = {
                firstName: user.firstName || "there",
                dashboardUrl,
            };

            // ============================================
            // 1. SPRINT SEQUENCE (Days 0-5, everyone)
            // Stop if they complete module 1
            // ============================================

            if (daysSinceCreated <= 6 && !tagSet.has("module_1_completed")) {
                for (const email of SPRINT_SEQUENCE) {
                    const sendTag = `sprint_${email.id}_sent`;
                    if (tagSet.has(sendTag)) continue;

                    // Check if within send window
                    if (hoursSinceCreated >= email.delayHours && hoursSinceCreated < email.delayHours + 24) {
                        const sent = await sendBuyerEmail(user.email, email.subject, email.content, vars);
                        if (sent) {
                            await prisma.userTag.create({ data: { userId: user.id, tag: sendTag } });
                            results.sprintEmailsSent++;
                        } else {
                            results.errors++;
                        }
                    }
                }
            }

            // ============================================
            // 2. RECOVERY SEQUENCE (Never logged in)
            // ============================================

            if (!hasLoggedIn && daysSinceCreated >= 3) {
                for (const email of RECOVERY_SEQUENCE) {
                    if (email.preventTag && tagSet.has(email.preventTag)) continue;

                    const requiredDays = email.delayHours / 24;
                    if (daysSinceCreated >= requiredDays && daysSinceCreated < requiredDays + 1) {
                        const sent = await sendBuyerEmail(user.email, email.subject, email.content, vars);
                        if (sent && email.preventTag) {
                            await prisma.userTag.create({ data: { userId: user.id, tag: email.preventTag } });
                            results.recoveryEmailsSent++;
                        } else if (!sent) {
                            results.errors++;
                        }
                    }
                }
            }

            // ============================================
            // 3. STALLED SEQUENCE (Logged in, no progress)
            // ============================================

            if (hasLoggedIn && !hasProgress && daysSinceCreated >= 3) {
                for (const email of STALLED_SEQUENCE) {
                    if (email.preventTag && tagSet.has(email.preventTag)) continue;

                    const requiredDays = email.delayHours / 24;
                    if (daysSinceCreated >= requiredDays && daysSinceCreated < requiredDays + 1) {
                        const sent = await sendBuyerEmail(user.email, email.subject, email.content, vars);
                        if (sent && email.preventTag) {
                            await prisma.userTag.create({ data: { userId: user.id, tag: email.preventTag } });
                            results.stalledEmailsSent++;
                        } else if (!sent) {
                            results.errors++;
                        }
                    }
                }
            }

            // ============================================
            // 4. MILESTONE EMAILS (Celebrate progress)
            // ============================================

            // Module 1 complete
            if (tagSet.has("module_1_completed") && !tagSet.has("milestone_module1_sent")) {
                const sent = await sendBuyerEmail(user.email, MILESTONE_EMAILS.module_1_complete.subject, MILESTONE_EMAILS.module_1_complete.content, vars);
                if (sent) {
                    await prisma.userTag.create({ data: { userId: user.id, tag: "milestone_module1_sent" } });
                    results.milestoneEmailsSent++;
                }
            }

            // Check progress milestones
            const maxProgress = Math.max(0, ...user.enrollments.map(e => e.progress || 0));

            if (maxProgress >= 25 && !tagSet.has("milestone_25_sent")) {
                const sent = await sendBuyerEmail(user.email, MILESTONE_EMAILS.progress_25.subject, MILESTONE_EMAILS.progress_25.content, vars);
                if (sent) await prisma.userTag.create({ data: { userId: user.id, tag: "milestone_25_sent" } });
                results.milestoneEmailsSent++;
            }

            if (maxProgress >= 50 && !tagSet.has("milestone_50_sent")) {
                const sent = await sendBuyerEmail(user.email, MILESTONE_EMAILS.progress_50.subject, MILESTONE_EMAILS.progress_50.content, vars);
                if (sent) await prisma.userTag.create({ data: { userId: user.id, tag: "milestone_50_sent" } });
                results.milestoneEmailsSent++;
            }

            if (maxProgress >= 90 && !tagSet.has("milestone_90_sent")) {
                const sent = await sendBuyerEmail(user.email, MILESTONE_EMAILS.progress_90.subject, MILESTONE_EMAILS.progress_90.content, vars);
                if (sent) await prisma.userTag.create({ data: { userId: user.id, tag: "milestone_90_sent" } });
                results.milestoneEmailsSent++;
            }

            // Course complete
            if (tagSet.has("course_completed") && !tagSet.has("milestone_complete_sent")) {
                const sent = await sendBuyerEmail(user.email, MILESTONE_EMAILS.completion.subject, MILESTONE_EMAILS.completion.content, vars);
                if (sent) await prisma.userTag.create({ data: { userId: user.id, tag: "milestone_complete_sent" } });
                results.milestoneEmailsSent++;
            }

            // ============================================
            // 5. RE-ENGAGEMENT (Welcome back)
            // ============================================

            if (user.lastLoginAt && !tagSet.has("reengagement_7d_sent")) {
                const lastLoginDaysAgo = differenceInDays(now, user.lastLoginAt);
                const todayLogin = differenceInDays(now, user.lastLoginAt) === 0;

                // If they logged in today but hadn't for 7+ days before
                if (todayLogin && lastLoginDaysAgo >= 7) {
                    const sent = await sendBuyerEmail(user.email, REENGAGEMENT_EMAILS.return_after_7d.subject, REENGAGEMENT_EMAILS.return_after_7d.content, vars);
                    if (sent) await prisma.userTag.create({ data: { userId: user.id, tag: "reengagement_7d_sent" } });
                    results.reengagementEmailsSent++;
                }
            }
        }

        return NextResponse.json({
            success: true,
            timestamp: now.toISOString(),
            studentsProcessed: students.length,
            results,
        });

    } catch (error) {
        console.error("[buyer-engagement] Cron error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
