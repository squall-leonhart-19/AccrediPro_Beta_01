import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// SMS sending function - implement with your SMS provider (Twilio, etc.)
async function sendSMS(phone: string, message: string): Promise<boolean> {
    // TODO: Implement with Twilio or your SMS provider
    console.log(`[SMS] To: ${phone}, Message: ${message}`);
    return true;
}

interface NudgeResult {
    userId: string;
    channel: "email" | "sms";
    success: boolean;
    nudgeType: string;
}

// Helper to extract qualification data from tags
function getQualificationData(tags: { tag: string }[]) {
    const tagSet = tags.map(t => t.tag);

    // Extract motivation (time-with-family, help-others, financial-freedom, career-change, personal-growth)
    const motivation = tagSet.find(t => t.startsWith("motivation:"))?.replace("motivation:", "") || null;

    // Extract time commitment (few-hours-flexible, part-time-10-20, full-time-30-plus)
    const timeCommitment = tagSet.find(t => t.startsWith("time_commitment:"))?.replace("time_commitment:", "") || null;

    // Extract income goal (side-income-500-1k, replace-income-3-5k, build-business-10k-plus)
    const incomeGoal = tagSet.find(t => t.startsWith("income_goal:"))?.replace("income_goal:", "") || null;

    return { motivation, timeCommitment, incomeGoal };
}

// Generate personalized hook based on qualification data
function getPersonalizedHook(qual: ReturnType<typeof getQualificationData>, firstName: string): string {
    // Motivation-based hooks
    if (qual.motivation === "time-with-family") {
        return `${firstName}, imagine working from home on YOUR schedule, while the kids are at school. That's what this certification can unlock.`;
    }
    if (qual.motivation === "help-others") {
        return `${firstName}, there are people in your community who need exactly what you'll learn here. Let's help them together.`;
    }
    if (qual.motivation === "financial-freedom") {
        return `${firstName}, financial freedom is just a few lessons away. Our graduates earn $3,000-10,000/month. Your turn!`;
    }
    if (qual.motivation === "career-change") {
        return `${firstName}, ready for that career change? This is your first step toward a fulfilling new path.`;
    }

    // Income-based hooks (fallback)
    if (qual.incomeGoal === "side-income-500-1k") {
        return `${firstName}, even just 2-3 clients a month can add $500-1,000 to your income. Let's start building that today.`;
    }
    if (qual.incomeGoal === "replace-income-3-5k") {
        return `${firstName}, replacing your income is totally achievable. Our grads average $4,200/month. Let's get you there!`;
    }
    if (qual.incomeGoal === "build-business-10k-plus") {
        return `${firstName}, building a $10k+/month business starts with mastering these fundamentals. You've got what it takes!`;
    }

    // Time-based hooks (fallback)
    if (qual.timeCommitment === "few-hours-flexible") {
        return `${firstName}, just a few flexible hours can change everything. Lesson 1 is only 7 minutes!`;
    }

    // Default hook
    return `${firstName}, you're so close to starting something amazing. Lesson 1 takes just 7 minutes!`;
}

// This cron runs hourly to send nudges to non-starters
export async function GET(request: NextRequest) {
    try {
        // Verify cron secret
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const now = new Date();
        const results: NudgeResult[] = [];

        // Find all FM mini diploma leads who haven't started
        const leads = await prisma.user.findMany({
            where: {
                tags: {
                    some: { tag: "lead:functional-medicine" }
                },
                // Exclude those who have completed lesson 1
                NOT: {
                    tags: {
                        some: { tag: { startsWith: "functional-medicine-lesson-complete:" } }
                    }
                }
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                phone: true,
                createdAt: true,
                tags: {
                    where: {
                        OR: [
                            { tag: { startsWith: "nudge:" } },
                            { tag: { startsWith: "motivation:" } },
                            { tag: { startsWith: "time_commitment:" } },
                            { tag: { startsWith: "income_goal:" } },
                        ]
                    },
                    select: { tag: true, createdAt: true }
                }
            }
        });

        for (const lead of leads) {
            const hoursSinceSignup = (now.getTime() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60);
            const sentNudges = new Set(lead.tags.map(t => t.tag));
            const firstName = lead.firstName || "there";
            const dashboardLink = `https://learn.accredipro.academy/functional-medicine-diploma`;

            // Get personalized hook based on qualification answers
            const qualData = getQualificationData(lead.tags);
            const personalizedHook = getPersonalizedHook(qualData, firstName);

            // Hour 1 SMS nudge
            if (hoursSinceSignup >= 1 && hoursSinceSignup < 2 && !sentNudges.has("nudge:hour-1-sms")) {
                if (lead.phone) {
                    const success = await sendSMS(
                        lead.phone,
                        `Hey ${firstName}! Sarah here 👋 I noticed you haven't started yet. Lesson 1 is just 7 min. ${dashboardLink}`
                    );
                    if (success) {
                        await prisma.userTag.create({
                            data: { userId: lead.id, tag: "nudge:hour-1-sms" }
                        });
                        results.push({ userId: lead.id, channel: "sms", success: true, nudgeType: "hour-1" });
                    }
                }
            }

            // Hour 4 Email nudge
            if (hoursSinceSignup >= 4 && hoursSinceSignup < 5 && !sentNudges.has("nudge:hour-4-email")) {
                try {
                    await resend.emails.send({
                        from: "Sarah M. <sarah@accredipro-certificate.com>",
                        to: lead.email,
                        subject: "Quick reminder: Your 7-day access has started 🔥",
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                <p>Hey ${firstName}! 👋</p>
                                <p>Just a quick reminder — your 7-day access to the ASI Functional Medicine Foundation started a few hours ago.</p>
                                <p><strong>847 students started today.</strong> Don't fall behind!</p>
                                <p style="margin: 30px 0;">
                                    <a href="${dashboardLink}" style="background: #722F37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                        Start Lesson 1 Now →
                                    </a>
                                </p>
                                <p>Lesson 1 takes just 7 minutes. You've got this! 💪</p>
                                <p>— Coach Sarah</p>
                            </div>
                        `
                    });
                    await prisma.userTag.create({
                        data: { userId: lead.id, tag: "nudge:hour-4-email" }
                    });
                    results.push({ userId: lead.id, channel: "email", success: true, nudgeType: "hour-4" });
                } catch (err) {
                    console.error(`Failed to send hour-4 email to ${lead.email}:`, err);
                }
            }

            // Hour 12 SMS nudge - PERSONALIZED
            if (hoursSinceSignup >= 12 && hoursSinceSignup < 13 && !sentNudges.has("nudge:hour-12-sms")) {
                if (lead.phone) {
                    // Short personalized SMS based on motivation
                    let smsMessage = `Last check-in for today! ${firstName}, most students finish Lesson 1 in under 10 min. Ready? ${dashboardLink}`;
                    if (qualData.motivation === "time-with-family") {
                        smsMessage = `${firstName}, 10 min now = more time with family later. Your first step to freedom is waiting: ${dashboardLink}`;
                    } else if (qualData.motivation === "financial-freedom") {
                        smsMessage = `${firstName}, your path to $3k-10k/month starts with 10 min. Let's go! ${dashboardLink}`;
                    } else if (qualData.motivation === "help-others") {
                        smsMessage = `${firstName}, there's someone out there who needs your help. Start learning how: ${dashboardLink}`;
                    }

                    const success = await sendSMS(
                        lead.phone,
                        smsMessage
                    );
                    if (success) {
                        await prisma.userTag.create({
                            data: { userId: lead.id, tag: "nudge:hour-12-sms" }
                        });
                        results.push({ userId: lead.id, channel: "sms", success: true, nudgeType: "hour-12" });
                    }
                }
            }

            // Day 2 Email nudge - PERSONALIZED based on qualification
            if (hoursSinceSignup >= 48 && hoursSinceSignup < 49 && !sentNudges.has("nudge:day-2-email")) {
                try {
                    // Generate income message based on their goal
                    let incomeMessage = "How to command $150-300/hour with this knowledge";
                    if (qualData.incomeGoal === "side-income-500-1k") {
                        incomeMessage = "How to earn an extra $500-1,000/month on the side";
                    } else if (qualData.incomeGoal === "replace-income-3-5k") {
                        incomeMessage = "How practitioners replace their income ($3,000-5,000/month)";
                    } else if (qualData.incomeGoal === "build-business-10k-plus") {
                        incomeMessage = "How top practitioners build $10k+/month businesses";
                    }

                    await resend.emails.send({
                        from: "Sarah M. <sarah@accredipro-certificate.com>",
                        to: lead.email,
                        subject: "Day 2: Still waiting for you! 👀",
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                <p>Hey ${firstName}!</p>
                                <p style="background: #f8f4f0; padding: 15px; border-radius: 8px; border-left: 4px solid #722F37;">
                                    ${personalizedHook}
                                </p>
                                <p>It's Day 2 and I'm still waiting for you in Lesson 1. 😊</p>
                                <p>Here's what you'll learn:</p>
                                <ul>
                                    <li>✅ Why root cause medicine is the future</li>
                                    <li>✅ The 5 hidden dysfunctions most practitioners miss</li>
                                    <li>✅ ${incomeMessage}</li>
                                </ul>
                                <p style="margin: 30px 0;">
                                    <a href="${dashboardLink}" style="background: #722F37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                        Start Now (7 min) →
                                    </a>
                                </p>
                                <p>Your access expires in 5 days. Don't miss out!</p>
                                <p>— Coach Sarah</p>
                            </div>
                        `
                    });
                    await prisma.userTag.create({
                        data: { userId: lead.id, tag: "nudge:day-2-email" }
                    });
                    results.push({ userId: lead.id, channel: "email", success: true, nudgeType: "day-2" });
                } catch (err) {
                    console.error(`Failed to send day-2 email to ${lead.email}:`, err);
                }
            }

            // Day 3 SMS nudge
            if (hoursSinceSignup >= 72 && hoursSinceSignup < 73 && !sentNudges.has("nudge:day-3-sms")) {
                if (lead.phone) {
                    const success = await sendSMS(
                        lead.phone,
                        `3 days in, ${firstName}. Your access expires in 4 days. That's okay - everyone moves at their pace. Start now? ${dashboardLink}`
                    );
                    if (success) {
                        await prisma.userTag.create({
                            data: { userId: lead.id, tag: "nudge:day-3-sms" }
                        });
                        results.push({ userId: lead.id, channel: "sms", success: true, nudgeType: "day-3" });
                    }
                }
            }

            // Day 5 Email nudge (URGENT)
            if (hoursSinceSignup >= 120 && hoursSinceSignup < 121 && !sentNudges.has("nudge:day-5-email")) {
                try {
                    await resend.emails.send({
                        from: "Sarah M. <sarah@accredipro-certificate.com>",
                        to: lead.email,
                        subject: "⚠️ Only 2 days left! Your certificate is waiting...",
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                <p>Hey ${firstName}!</p>
                                <p><strong>⚠️ Your 7-day access expires in just 2 days.</strong></p>
                                <p>You can still complete the entire course and claim your ASI Foundation Certificate. The 9 lessons average just 7 minutes each.</p>
                                <p>That's less than an hour of learning for a <strong>credential that can change your career.</strong></p>
                                <p style="margin: 30px 0;">
                                    <a href="${dashboardLink}" style="background: #722F37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                        Start Before Time Runs Out →
                                    </a>
                                </p>
                                <p>I believe in you! 💪</p>
                                <p>— Coach Sarah</p>
                            </div>
                        `
                    });
                    await prisma.userTag.create({
                        data: { userId: lead.id, tag: "nudge:day-5-email" }
                    });
                    results.push({ userId: lead.id, channel: "email", success: true, nudgeType: "day-5" });
                } catch (err) {
                    console.error(`Failed to send day-5 email to ${lead.email}:`, err);
                }
            }

            // Day 7 Email nudge (EXPIRED - with 48h extension)
            if (hoursSinceSignup >= 168 && hoursSinceSignup < 169 && !sentNudges.has("nudge:day-7-email")) {
                try {
                    await resend.emails.send({
                        from: "Sarah M. <sarah@accredipro-certificate.com>",
                        to: lead.email,
                        subject: "Your access expired — but I extended it 48h for you 🎁",
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                <p>Hey ${firstName}!</p>
                                <p>Your 7-day access to the ASI Functional Medicine Foundation expired today.</p>
                                <p>But I don't want you to miss out, so <strong>I've extended your access by 48 hours.</strong></p>
                                <p>This is your <strong>last chance</strong> to complete the course and claim your certificate. After 48 hours, your spot will be released to the next cohort.</p>
                                <p style="margin: 30px 0;">
                                    <a href="${dashboardLink}" style="background: #722F37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                        Use My 48h Extension →
                                    </a>
                                </p>
                                <p>You've got this. I know life gets busy, but this is worth it.</p>
                                <p>— Coach Sarah</p>
                            </div>
                        `
                    });
                    await prisma.userTag.create({
                        data: { userId: lead.id, tag: "nudge:day-7-email" }
                    });
                    results.push({ userId: lead.id, channel: "email", success: true, nudgeType: "day-7" });
                } catch (err) {
                    console.error(`Failed to send day-7 email to ${lead.email}:`, err);
                }
            }
        }

        return NextResponse.json({
            success: true,
            timestamp: now.toISOString(),
            leadsProcessed: leads.length,
            nudgesSent: results.length,
            results
        });
    } catch (error) {
        console.error("[CRON mini-diploma-nudges] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
