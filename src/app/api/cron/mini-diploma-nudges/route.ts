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
    // Supports both old (side-income-500-1k) and new (starter-3-5k) income goal formats
    if (qual.incomeGoal === "side-income-500-1k") {
        return `${firstName}, even just 2-3 clients a month can add $500-1,000 to your income. Let's start building that today.`;
    }
    if (qual.incomeGoal === "starter-3-5k" || qual.incomeGoal === "replace-income-3-5k") {
        return `${firstName}, $3-5K/month is totally achievable. Our grads average $4,200/month. Let's get you there!`;
    }
    if (qual.incomeGoal === "replace-job-5-10k") {
        return `${firstName}, replacing your income at $5-10K/month? Absolutely doable. Our top grads are doing exactly that!`;
    }
    if (qual.incomeGoal === "scale-business-10k-plus" || qual.incomeGoal === "build-business-10k-plus") {
        return `${firstName}, building a $10k+/month practice starts with mastering these fundamentals. You've got what it takes!`;
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
        // Tag format from optin: lead:{course}-mini-diploma (e.g., lead:functional-medicine-mini-diploma)
        const leads = await prisma.user.findMany({
            where: {
                tags: {
                    some: { tag: "lead:functional-medicine-mini-diploma" }
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
                        subject: "Quick reminder: Your 48-hour access is running ⏰",
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                <p>Hey ${firstName}! 👋</p>
                                <p>Just a quick reminder — your <strong>48-hour access</strong> to the ASI Functional Medicine Foundation started a few hours ago.</p>
                                <p><strong>89% of students complete it in one sitting.</strong> Don't fall behind!</p>
                                <p style="margin: 30px 0;">
                                    <a href="${dashboardLink}" style="background: #722F37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                        Start Lesson 1 Now →
                                    </a>
                                </p>
                                <p>The whole course takes just 1 hour. You've got this! 💪</p>
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

            // Hour 24 Email nudge - URGENT (24 hours left!)
            if (hoursSinceSignup >= 24 && hoursSinceSignup < 25 && !sentNudges.has("nudge:hour-24-email")) {
                try {
                    await resend.emails.send({
                        from: "Sarah M. <sarah@accredipro-certificate.com>",
                        to: lead.email,
                        subject: "⚠️ 24 Hours Left! Your certification access expires tomorrow",
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                <p>Hey ${firstName}! 👋</p>
                                <p style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
                                    ⚠️ <strong>You have exactly 24 hours left</strong> to complete your ASI Functional Medicine Foundation certification.
                                </p>
                                <p style="background: #f8f4f0; padding: 15px; border-radius: 8px; border-left: 4px solid #722F37;">
                                    ${personalizedHook}
                                </p>
                                <p>Here's the good news: <strong>The entire certification takes just 1 hour.</strong></p>
                                <p>9 lessons × 7 minutes each = Your certificate by tonight!</p>
                                <p style="margin: 30px 0;">
                                    <a href="${dashboardLink}" style="background: #722F37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                        Start Now - Get Certified Today →
                                    </a>
                                </p>
                                <p>Don't let this opportunity expire. I believe in you! 💪</p>
                                <p>— Coach Sarah</p>
                            </div>
                        `
                    });
                    await prisma.userTag.create({
                        data: { userId: lead.id, tag: "nudge:hour-24-email" }
                    });
                    results.push({ userId: lead.id, channel: "email", success: true, nudgeType: "hour-24" });
                } catch (err) {
                    console.error(`Failed to send hour-24 email to ${lead.email}:`, err);
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

            // Hour 36 SMS nudge - FINAL WARNING (12 hours left!)
            if (hoursSinceSignup >= 36 && hoursSinceSignup < 37 && !sentNudges.has("nudge:hour-36-sms")) {
                if (lead.phone) {
                    let smsMessage = `🚨 ${firstName}, only 12 HOURS left! Your certification expires tonight. 1 hour to complete, certificate for life. Go now: ${dashboardLink}`;
                    if (qualData.motivation === "time-with-family") {
                        smsMessage = `🚨 ${firstName}, 12 hours left! This certification = more time with family. Don't miss out: ${dashboardLink}`;
                    } else if (qualData.motivation === "financial-freedom") {
                        smsMessage = `🚨 ${firstName}, 12 hours to change your income! Complete your certification now: ${dashboardLink}`;
                    }

                    const success = await sendSMS(lead.phone, smsMessage);
                    if (success) {
                        await prisma.userTag.create({
                            data: { userId: lead.id, tag: "nudge:hour-36-sms" }
                        });
                        results.push({ userId: lead.id, channel: "sms", success: true, nudgeType: "hour-36" });
                    }
                }
            }

            // Hour 48 Email nudge (EXPIRED - with 24h extension offer)
            if (hoursSinceSignup >= 48 && hoursSinceSignup < 49 && !sentNudges.has("nudge:hour-48-email")) {
                try {
                    // Generate income message based on their goal
                    let incomeMessage = "practitioners earning $150-300/hour";
                    if (qualData.incomeGoal === "starter-3-5k" || qualData.incomeGoal === "side-income-500-1k") {
                        incomeMessage = "practitioners starting at $3,000-5,000/month";
                    } else if (qualData.incomeGoal === "replace-job-5-10k" || qualData.incomeGoal === "replace-income-3-5k") {
                        incomeMessage = "practitioners replacing their income at $5,000-10,000/month";
                    } else if (qualData.incomeGoal === "scale-business-10k-plus" || qualData.incomeGoal === "build-business-10k-plus") {
                        incomeMessage = "top practitioners building $10k+/month practices";
                    }

                    await resend.emails.send({
                        from: "Sarah M. <sarah@accredipro-certificate.com>",
                        to: lead.email,
                        subject: "Your access expired — but I'm giving you 24 more hours 🎁",
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                <p>Hey ${firstName}!</p>
                                <p>Your 48-hour access to the ASI Functional Medicine Foundation just expired.</p>
                                <p>But I don't want you to miss out, so <strong>I've extended your access by 24 hours.</strong></p>
                                <p style="background: #f8f4f0; padding: 15px; border-radius: 8px; border-left: 4px solid #722F37;">
                                    ${personalizedHook}
                                </p>
                                <p>This is your <strong>FINAL chance</strong> to:</p>
                                <ul>
                                    <li>✅ Complete your 1-hour certification</li>
                                    <li>✅ Get your ASI Foundation Certificate</li>
                                    <li>✅ Join ${incomeMessage}</li>
                                </ul>
                                <p>After 24 hours, your spot will be released to the next cohort.</p>
                                <p style="margin: 30px 0;">
                                    <a href="${dashboardLink}" style="background: #722F37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                        Use My 24h Extension →
                                    </a>
                                </p>
                                <p>You've got this. I know life gets busy, but this is worth it.</p>
                                <p>— Coach Sarah</p>
                            </div>
                        `
                    });
                    await prisma.userTag.create({
                        data: { userId: lead.id, tag: "nudge:hour-48-email" }
                    });
                    results.push({ userId: lead.id, channel: "email", success: true, nudgeType: "hour-48" });
                } catch (err) {
                    console.error(`Failed to send hour-48 email to ${lead.email}:`, err);
                }
            }

            // Hour 72 Email nudge (FINAL - 24h extension expired)
            if (hoursSinceSignup >= 72 && hoursSinceSignup < 73 && !sentNudges.has("nudge:hour-72-email")) {
                try {
                    await resend.emails.send({
                        from: "Sarah M. <sarah@accredipro-certificate.com>",
                        to: lead.email,
                        subject: "Final goodbye (unless you want back in) 👋",
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                <p>Hey ${firstName},</p>
                                <p>Your extension has expired, and I've had to release your spot.</p>
                                <p>I know life gets crazy. No judgment here at all.</p>
                                <p>If you ever want to come back and complete your Functional Medicine certification, just reply to this email and I'll see what I can do.</p>
                                <p>Wishing you all the best on your journey! 💕</p>
                                <p>— Coach Sarah</p>
                                <p style="font-size: 12px; color: #666; margin-top: 30px;">
                                    P.S. Many of our most successful practitioners started exactly where you are. When you're ready, we'll be here.
                                </p>
                            </div>
                        `
                    });
                    await prisma.userTag.create({
                        data: { userId: lead.id, tag: "nudge:hour-72-email" }
                    });
                    results.push({ userId: lead.id, channel: "email", success: true, nudgeType: "hour-72" });
                } catch (err) {
                    console.error(`Failed to send hour-72 email to ${lead.email}:`, err);
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
