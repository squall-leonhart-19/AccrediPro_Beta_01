import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, personalEmailWrapper } from "@/lib/email";
import { MINI_DIPLOMA_EMAILS } from "@/app/api/test-email/route";
import { NURTURE_EMAILS } from "@/lib/nurture-emails";
import { MINI_DIPLOMA_REGISTRY, ALL_MINI_DIPLOMA_SLUGS } from "@/lib/mini-diploma-registry";

/**
 * Lead Engagement Cron Job v3 (Registry Enabled)
 * 
 * Scalable nurture system that handles ANY registered Mini Diploma.
 * 
 * Call with: /api/cron/lead-engagement?secret=YOUR_CRON_SECRET
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Nudge templates (Generic fallbacks)
const NUDGES = {
    day1_start: `Hey {{firstName}}! 👋\n\nReady to dive in? Lesson 1 is only 6 minutes - perfect with your morning coffee ☕\n\nI know you signed up for a reason. That curiosity is worth following!\n\nTap the button below to start your first lesson. I'll be cheering you on!\n\n- Sarah 🌸`,
    day2_momentum: `Hey {{firstName}}! 💕\n\nI noticed you haven't started your lessons yet - is everything okay?\n\nIf you're feeling overwhelmed, just know: 2 lessons = 12 minutes total. That's it!\n\nYou signed up because you wanted to learn. That curiosity matters. Let's not let it fade.\n\nJust start with Lesson 1. I promise it's worth it!\n\n- Sarah`,
    day4_urgency: `{{firstName}}, quick heads up! 💕\n\nYour access to the Mini Diploma expires in just 3 days!\n\nYou've got {{lessonsRemaining}} lessons left. Each one is only about 6 minutes - you can totally finish this!\n\nDon't miss out on your certificate. Start now and I'll be here cheering you on!\n\n- Sarah 🌸`,
    day5_48h: `{{firstName}}!! ⏰\n\nYour access expires in just 48 HOURS!\n\nYou've still got {{lessonsRemaining}} lessons to go. Each one is only 6 min.\n\nI really don't want you to miss getting your certificate. You came SO far just to stop now?\n\nFinish tonight? I believe in you! 💪\n\n- Sarah`,
    day6_final: `{{firstName}}, this is it. LAST DAY. 🔥\n\nYour access expires tomorrow and your certificate is SO close.\n\nJust {{lessonsRemaining}} more lessons. You can do this TODAY.\n\nI'm rooting for you!\n\n- Sarah 💚`,
};

async function sendLeadDM(userId: string, message: string) {
    try {
        // Use Sarah (mini diploma) account for lead DMs
        const coachUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: "sarah_womenhealth@accredipro-certificate.com" },
                    { role: "MENTOR" }, // Fallback
                ],
            },
            select: { id: true },
        });

        if (!coachUser) {
            console.log("[LEAD-ENGAGEMENT] No coach found, skipping DM");
            return false;
        }

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
    const stats: any = { checked: 0, nudgesSent: 0, completionsSent: 0, dmsSent: 0, nurtureSent: 0 };

    try {
        // 1. Get ALL leads for ANY registered diploma (60 day window)
        const leads = await prisma.enrollment.findMany({
            where: {
                course: { slug: { in: ALL_MINI_DIPLOMA_SLUGS } },
                enrolledAt: {
                    gte: new Date(Date.now() - 61 * 24 * 60 * 60 * 1000),
                },
            },
            include: { user: { select: { id: true, firstName: true, email: true } }, course: { select: { slug: true } } },
        });

        // Batch-fetch ALL user tags upfront to avoid N+1 queries
        const userIds = [...new Set(leads.map(l => l.user.id))];
        const allTags = userIds.length > 0
            ? await prisma.userTag.findMany({ where: { userId: { in: userIds } } })
            : [];
        const tagsByUser = new Map<string, typeof allTags>();
        for (const tag of allTags) {
            const existing = tagsByUser.get(tag.userId) || [];
            existing.push(tag);
            tagsByUser.set(tag.userId, existing);
        }

        for (const lead of leads) {
            stats.checked++;
            const { user, course } = lead;

            // Get configuration for this specific diploma
            const config = MINI_DIPLOMA_REGISTRY[course.slug];
            if (!config) continue;

            const daysSinceEnroll = Math.floor((now.getTime() - lead.enrolledAt.getTime()) / (1000 * 60 * 60 * 24));

            // Get tags from pre-fetched map (eliminates N+1)
            const tags = tagsByUser.get(user.id) || [];
            const tagSet = new Set(tags.map(t => t.tag));

            // Check completion status
            const completedLessons = tags.filter(t => t.tag.startsWith(`${config.slug.replace("-mini-diploma", "")}-lesson:`)).length; // Approximate lesson count based on lesson tags if we had them, OR rely on explicit completion tag
            const isCompleted = tagSet.has(config.completionTag); // "wh-mini-diploma:completed"

            // ===================
            // 1. NUDGES (Day 0-6, Non-Completers)
            // ===================
            if (!isCompleted && daysSinceEnroll <= 6) {
                const nudgeTag = `${config.nudgePrefix}:day${daysSinceEnroll}`;

                if (!tagSet.has(nudgeTag)) {
                    let nudgeText = null;
                    let emailKey = null;

                    if (daysSinceEnroll === 1) { nudgeText = NUDGES.day1_start; emailKey = "day1_start"; }
                    else if (daysSinceEnroll === 2) { nudgeText = NUDGES.day2_momentum; emailKey = "day2_momentum"; }
                    else if (daysSinceEnroll === 4) { nudgeText = NUDGES.day4_urgency; emailKey = "day4_urgency"; }
                    else if (daysSinceEnroll === 5) { nudgeText = NUDGES.day5_48h; emailKey = "day5_48h"; }
                    else if (daysSinceEnroll === 6) { nudgeText = NUDGES.day6_final; emailKey = "day6_final"; }

                    if (nudgeText) {
                        const finalMsg = nudgeText.replace(/\{\{firstName\}\}/g, user.firstName || "there")
                            .replace(/\{\{lessonsRemaining\}\}/g, String(9 - completedLessons)); // Assuming 9 lessons default

                        await sendLeadDM(user.id, finalMsg);
                        await prisma.userTag.create({ data: { userId: user.id, tag: nudgeTag } });
                        stats.nudgesSent++;
                    }
                }
            }

            // ===================
            // 2. COMPLETION EMAIL (One-time)
            // ===================
            const completeEmailTag = `completion-email:${config.slug}`;
            if (isCompleted && !tagSet.has(completeEmailTag)) {
                if (MINI_DIPLOMA_EMAILS.all_complete && user.email) {
                    sendEmail({
                        to: user.email,
                        subject: MINI_DIPLOMA_EMAILS.all_complete.subject(user.firstName || "there"),
                        html: personalEmailWrapper(MINI_DIPLOMA_EMAILS.all_complete.content(user.firstName || "there").replace(/\n/g, '<br>')),
                        type: "transactional",
                    }).catch(console.error);
                }
                await prisma.userTag.create({ data: { userId: user.id, tag: completeEmailTag } });
                stats.completionsSent++;
            }

            // ===================
            // 3. NURTURE EMAILS & DMs (From Registry)
            // ===================

            // A. DMs
            if (daysSinceEnroll >= 0 && daysSinceEnroll <= 60 && config.dmSequence) {
                const dmTag = `${config.nurturePrefix}-dm:day${daysSinceEnroll}`;
                const dm = config.dmSequence.find(d => d.day === daysSinceEnroll);

                if (dm && !tagSet.has(dmTag)) {
                    await sendLeadDM(user.id, dm.text.replace(/\{\{firstName\}\}/g, user.firstName || "there"));
                    await prisma.userTag.create({ data: { userId: user.id, tag: dmTag } });
                    stats.dmsSent++;
                }
            }

            // B. Emails
            if (daysSinceEnroll >= 0 && daysSinceEnroll <= 60 && config.nurtureSequence) {
                const emailTag = `${config.nurturePrefix}:day${daysSinceEnroll}`;
                const emailContent = config.nurtureSequence.find((e: any) => e.day === daysSinceEnroll);

                if (emailContent && !tagSet.has(emailTag) && user.email) {
                    await sendEmail({
                        to: user.email,
                        subject: emailContent.subject.replace(/\{\{firstName\}\}/g, user.firstName || "there"),
                        html: personalEmailWrapper(emailContent.content.replace(/\{\{firstName\}\}/g, user.firstName || "there").replace(/\n/g, '<br>')),
                        type: "transactional"
                    }).catch(console.error);

                    await prisma.userTag.create({ data: { userId: user.id, tag: emailTag } });
                    stats.nurtureSent++;
                }
            }
        }

        return NextResponse.json({ success: true, stats, timestamp: now.toISOString() });

    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
