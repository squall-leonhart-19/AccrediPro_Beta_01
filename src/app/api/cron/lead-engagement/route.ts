import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, personalEmailWrapper } from "@/lib/email";
import { MINI_DIPLOMA_EMAILS } from "@/app/api/test-email/route";
import { NURTURE_EMAILS } from "@/lib/nurture-emails";
import { WH_NURTURE_60_DAY_V3 } from "@/lib/wh-nurture-60-day-v3";
import { TIME_BASED_DMS, LESSON_COMPLETION_DMS, BEHAVIORAL_DMS, getDMContent } from "@/lib/wh-sarah-dms";

/**
 * Lead Engagement Cron Job v2
 * 
 * Unified nurture system:
 * - Day 0-6: Mini diploma nudges (DM + Email) for non-completers
 * - Day 0-30: Nurture emails for EVERYONE
 * - Completion detection: Skip nudges if completed, send certificate email once
 * 
 * Tags used:
 * - wh-mini-diploma:completed → User finished all 9 lessons
 * - lead-nudge:dayX → Nudge already sent for that day
 * - nurture:dayX → Nurture email already sent for that day
 * - nurture:completion-email → Certificate email sent
 * 
 * Call with: /api/cron/lead-engagement?secret=YOUR_CRON_SECRET
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Nudge templates (for non-completers only)
const NUDGES = {
    day1_start: `Hey {{firstName}}! 👋

Ready to dive in? Lesson 1 is only 6 minutes - perfect with your morning coffee ☕

I know you signed up for a reason. That curiosity about women's health is worth following!

Tap the button below to start your first lesson. I'll be cheering you on!

- Sarah 🌸`,
    day2_momentum: `Hey {{firstName}}! 💕

I noticed you haven't started your lessons yet - is everything okay?

If you're feeling overwhelmed, just know: 2 lessons = 12 minutes total. That's it!

You signed up because you wanted to learn about women's health. That curiosity matters. Let's not let it fade.

Just start with Lesson 1. I promise it's worth it!

- Sarah`,
    day4_urgency: `{{firstName}}, quick heads up! 💕

Your access to the Women's Health Mini Diploma expires in just 3 days!

You've got {{lessonsRemaining}} lessons left. Each one is only about 6 minutes - you can totally finish this!

Don't miss out on your certificate. Start now and I'll be here cheering you on!

- Sarah 🌸`,
    day5_48h: `{{firstName}}!! ⏰

Your access expires in just 48 HOURS!

You've still got {{lessonsRemaining}} lessons to go. Each one is only 6 min.

I really don't want you to miss getting your certificate. You came SO far just to stop now?

Finish tonight? I believe in you! 💪

- Sarah`,
    day6_final: `{{firstName}}, this is it. LAST DAY. 🔥

Your access expires tomorrow and your certificate is SO close.

Just {{lessonsRemaining}} more lessons. You can do this TODAY.

I'm rooting for you!

- Sarah 💚`,
};

// FM Nurture email schedule - DISABLED FOR WH LEADS
// These emails are FM-specific ($997 certification price, 21 modules, etc)
// WH leads get their own sequence via send-wh-reminder-emails cron
// TODO: Create WH-specific nurture sequence later
const NURTURE_SCHEDULE: Record<number, number> = {
    // TEMPORARILY DISABLED - FM nurture was going to WH leads
    // 0: 1,   // Day 0: Welcome + Mini Diploma
    // 1: 2,   // Day 1: Sarah's Story  
    // ... etc
};

// Helper to check if this is an FM lead (not WH)
const FM_SLUGS = ["fm-mini-diploma"];

async function sendLeadDM(userId: string, message: string) {
    try {
        const coachUser = await prisma.user.findFirst({
            where: { role: "MENTOR" },
            select: { id: true },
        });

        if (!coachUser) {
            console.log("[LEAD-ENGAGEMENT] No mentor found, skipping DM");
            return false;
        }

        // Send as direct message
        await prisma.message.create({
            data: {
                senderId: coachUser.id,
                receiverId: userId,
                content: message,
                messageType: "DIRECT",
            },
        });

        return true;
    } catch (error) {
        console.error(`[LEAD-ENGAGEMENT] Failed to send DM to ${userId}:`, error);
        return false;
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    if (secret !== process.env.CRON_SECRET && process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const stats = {
        checked: 0,
        nudgesSent: 0,
        nurtureEmailsSent: 0,
        whDmsSent: 0,
        completionEmailsSent: 0,
        skippedCompleted: 0,
        errors: 0,
    };

    try {
        // Get all leads within 30-day nurture window
        // Get all leads within 60-day nurture window
        const leads = await prisma.enrollment.findMany({
            where: {
                course: {
                    slug: { in: ["womens-health-mini-diploma", "fm-mini-diploma"] }
                },
                enrolledAt: {
                    gte: new Date(Date.now() - 61 * 24 * 60 * 60 * 1000), // Within 61 days for 60-day nurture
                },
            },
            select: {
                id: true,
                enrolledAt: true,
                status: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        email: true,
                    },
                },
            },
        });

        const userIds = leads.map(l => l.user.id);

        // Get all relevant tags in one query
        const allTags = await prisma.userTag.findMany({
            where: {
                userId: { in: userIds },
                tag: {
                    in: [
                        // Completion tags
                        "wh-mini-diploma:completed",
                        "fm-mini-diploma:completed",
                        // We'll also check for nudge and nurture tags
                    ]
                }
            },
            select: { userId: true, tag: true },
        });

        // Also get all lead-nudge and nurture tags
        const trackingTags = await prisma.userTag.findMany({
            where: {
                userId: { in: userIds },
                OR: [
                    { tag: { startsWith: "lead-nudge:" } },
                    { tag: { startsWith: "nurture:" } },
                    { tag: { startsWith: "wh-nurture:" } },
                    { tag: { startsWith: "wh-dm:" } },
                ]
            },
            select: { userId: true, tag: true },
        });

        // Build tag maps
        const completedUsers = new Set<string>();
        allTags.forEach(t => {
            if (t.tag.includes("completed")) {
                completedUsers.add(t.userId);
            }
        });

        const userTagsMap = new Map<string, Set<string>>();
        trackingTags.forEach(t => {
            if (!userTagsMap.has(t.userId)) {
                userTagsMap.set(t.userId, new Set());
            }
            userTagsMap.get(t.userId)!.add(t.tag);
        });

        // Get lesson completions for nudge logic
        const lessonTags = await prisma.userTag.findMany({
            where: {
                userId: { in: userIds },
                tag: { startsWith: "wh-lesson-complete:" },
            },
            select: { userId: true },
        });

        const lessonCountMap = new Map<string, number>();
        lessonTags.forEach(t => {
            lessonCountMap.set(t.userId, (lessonCountMap.get(t.userId) || 0) + 1);
        });

        for (const lead of leads) {
            stats.checked++;

            const userId = lead.user.id;
            const firstName = lead.user.firstName || "there";
            const email = lead.user.email;
            const daysSinceEnroll = Math.floor((now.getTime() - lead.enrolledAt.getTime()) / (1000 * 60 * 60 * 24));
            const lessonsCompleted = lessonCountMap.get(userId) || 0;
            const isCompleted = completedUsers.has(userId) || lessonsCompleted >= 9;
            const userTags = userTagsMap.get(userId) || new Set();

            // ===================
            // 1. NUDGES (Day 0-6, non-completers only)
            // ===================
            if (!isCompleted && daysSinceEnroll <= 6) {
                let nudgeText: string | null = null;
                let nudgeKey: string | null = null;

                if (daysSinceEnroll === 1 && lessonsCompleted === 0 && !userTags.has("lead-nudge:day1")) {
                    nudgeText = NUDGES.day1_start;
                    nudgeKey = "day1";
                } else if (daysSinceEnroll === 2 && lessonsCompleted === 0 && !userTags.has("lead-nudge:day2")) {
                    nudgeText = NUDGES.day2_momentum;
                    nudgeKey = "day2";
                } else if (daysSinceEnroll === 4 && !userTags.has("lead-nudge:day4")) {
                    nudgeText = NUDGES.day4_urgency.replace("{{lessonsRemaining}}", String(9 - lessonsCompleted));
                    nudgeKey = "day4";
                } else if (daysSinceEnroll === 5 && !userTags.has("lead-nudge:day5")) {
                    nudgeText = NUDGES.day5_48h.replace("{{lessonsRemaining}}", String(9 - lessonsCompleted));
                    nudgeKey = "day5";
                } else if (daysSinceEnroll === 6 && !userTags.has("lead-nudge:day6")) {
                    nudgeText = NUDGES.day6_final.replace("{{lessonsRemaining}}", String(9 - lessonsCompleted));
                    nudgeKey = "day6";
                }

                if (nudgeText && nudgeKey) {
                    const personalizedNudge = nudgeText.replace(/\{\{firstName\}\}/g, firstName);

                    // Send DM
                    await sendLeadDM(userId, personalizedNudge);

                    // Send email parallel
                    const emailKey = nudgeKey === "day1" ? "day1_start"
                        : nudgeKey === "day2" ? "day2_momentum"
                            : nudgeKey === "day4" ? "day4_urgency"
                                : nudgeKey === "day5" ? "day5_48h"
                                    : nudgeKey === "day6" ? "day6_final"
                                        : null;

                    if (emailKey && MINI_DIPLOMA_EMAILS[emailKey as keyof typeof MINI_DIPLOMA_EMAILS] && email) {
                        const template = MINI_DIPLOMA_EMAILS[emailKey as keyof typeof MINI_DIPLOMA_EMAILS];
                        let content = template.content(firstName);
                        content = content.replace(/\{\{lessonsRemaining\}\}/g, String(9 - lessonsCompleted));

                        sendEmail({
                            to: email,
                            subject: template.subject(firstName),
                            html: personalEmailWrapper(content.replace(/\n/g, '<br>')),
                            type: "marketing",
                        }).catch(err => console.error(`[LEAD-ENGAGEMENT] Nudge email failed:`, err));
                    }

                    // Record sent
                    await prisma.userTag.create({
                        data: { userId, tag: `lead-nudge:${nudgeKey}` },
                    });

                    stats.nudgesSent++;
                }
            } else if (isCompleted) {
                stats.skippedCompleted++;
            }

            // ===================
            // 2. NURTURE EMAILS (Day 0-30, EVERYONE)
            // ===================
            const nurtureVariantId = NURTURE_SCHEDULE[daysSinceEnroll];
            const nurtureTag = `nurture:day${daysSinceEnroll}`;

            if (nurtureVariantId && !userTags.has(nurtureTag) && email) {
                // Find the nurture email by order (variantId - 1 = order)
                const nurtureEmail = NURTURE_EMAILS.find(e => e.order === nurtureVariantId - 1);

                if (nurtureEmail) {
                    // Personalize content
                    const personalizedContent = nurtureEmail.content
                        .replace(/\{\{firstName\}\}/g, firstName)
                        // Strip HTML tags for plain text look
                        .replace(/<strong>/g, '')
                        .replace(/<\/strong>/g, '');

                    const personalizedSubject = nurtureEmail.subject.replace(/\{\{firstName\}\}/g, firstName);

                    // Send the nurture email
                    sendEmail({
                        to: email,
                        subject: personalizedSubject,
                        html: personalEmailWrapper(personalizedContent.replace(/\n/g, '<br>')),
                        type: "marketing",
                    }).catch(err => console.error(`[LEAD-ENGAGEMENT] Nurture email Day ${daysSinceEnroll} failed:`, err));

                    console.log(`[NURTURE] Day ${daysSinceEnroll}: Sent "${nurtureEmail.subject}" to ${email}`);
                }

                // Record that we've sent this nurture
                await prisma.userTag.create({
                    data: { userId, tag: nurtureTag },
                });

                stats.nurtureEmailsSent++;
            }

            // ===================
            // 3. COMPLETION EMAIL (one-time)
            // ===================
            if (isCompleted && !userTags.has("nurture:completion-email") && email) {
                // Send certificate/completion email
                const completionTemplate = MINI_DIPLOMA_EMAILS.all_complete;
                if (completionTemplate) {
                    sendEmail({
                        to: email,
                        subject: completionTemplate.subject(firstName),
                        html: personalEmailWrapper(completionTemplate.content(firstName).replace(/\n/g, '<br>')),
                        type: "marketing",
                    }).catch(err => console.error(`[LEAD-ENGAGEMENT] Completion email failed:`, err));
                }

                await prisma.userTag.create({
                    data: { userId, tag: "nurture:completion-email" },
                });

                stats.completionEmailsSent++;
            }

            // ===================
            // 4. WH V3 60-DAY NURTURE EMAILS (Day 0-60, WH leads only)
            // ===================
            // Check if this is a WH lead (enrolled in WH mini diploma)
            const isWHLead = lead.status === "ACTIVE"; // All mini diploma leads are WH for now

            if (isWHLead && daysSinceEnroll <= 60 && email) {
                // Find the v3 email for this day
                const whEmail = WH_NURTURE_60_DAY_V3.find(e => e.day === daysSinceEnroll);
                const whNurtureTag = `wh-nurture:day${daysSinceEnroll}`;

                if (whEmail && !userTags.has(whNurtureTag)) {
                    // Personalize content
                    const personalizedContent = whEmail.content
                        .replace(/\{\{firstName\}\}/g, firstName)
                        .replace(/\{\{name\}\}/g, firstName);

                    const personalizedSubject = whEmail.subject
                        .replace(/\{\{firstName\}\}/g, firstName)
                        .replace(/\{\{name\}\}/g, firstName);

                    // Send the WH v3 nurture email
                    sendEmail({
                        to: email,
                        subject: personalizedSubject,
                        html: personalEmailWrapper(personalizedContent.replace(/\n/g, '<br>')),
                        type: "marketing",
                    }).catch(err => console.error(`[WH-NURTURE-V3] Email Day ${daysSinceEnroll} failed:`, err));

                    // Record sent
                    await prisma.userTag.create({
                        data: { userId, tag: whNurtureTag },
                    });

                    console.log(`[WH-NURTURE-V3] Day ${daysSinceEnroll}: Sent "${whEmail.subject}" to ${email}`);
                    stats.nurtureEmailsSent++;
                }
            }

            // ===================
            // 5. WH SARAH DMs (Day 1-60, WH leads only)
            // Note: Day 0 is handled by enrollment trigger with voice
            // ===================
            if (isWHLead && daysSinceEnroll >= 1 && daysSinceEnroll <= 60) {
                // Find the DM for this day
                const dmForDay = TIME_BASED_DMS.find(dm => dm.day === daysSinceEnroll);
                const whDmTag = `wh-dm:day${daysSinceEnroll}`;

                if (dmForDay && !userTags.has(whDmTag)) {
                    // Personalize DM content
                    const personalizedDM = dmForDay.text
                        .replace(/\{\{firstName\}\}/g, firstName);

                    // Send the DM
                    const dmSent = await sendLeadDM(userId, personalizedDM);

                    if (dmSent) {
                        // Record sent
                        await prisma.userTag.create({
                            data: { userId, tag: whDmTag },
                        });

                        console.log(`[WH-DM] Day ${daysSinceEnroll}: Sent DM to ${firstName} (${userId})`);
                        stats.whDmsSent++;
                    }
                }
            }
        }

        console.log("[LEAD-ENGAGEMENT] Completed:", stats);

        return NextResponse.json({
            success: true,
            stats,
            timestamp: now.toISOString(),
        });

    } catch (error) {
        console.error("[LEAD-ENGAGEMENT] Fatal error:", error);
        return NextResponse.json(
            { error: "Lead engagement cron failed", details: String(error) },
            { status: 500 }
        );
    }
}
