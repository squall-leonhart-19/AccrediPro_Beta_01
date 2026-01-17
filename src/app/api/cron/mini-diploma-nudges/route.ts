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

// Generate personalized SMS based on qualification data - SHORT for SMS
function getPersonalizedSMS(qual: ReturnType<typeof getQualificationData>, firstName: string, hoursLeft: number): string {
    const urgency = hoursLeft <= 6 ? "🚨" : hoursLeft <= 12 ? "⏰" : "👋";
    const timeMsg = hoursLeft <= 6 ? `Only ${hoursLeft}h left!` : hoursLeft <= 12 ? `${hoursLeft}h remaining` : "";

    // Motivation-based SMS
    if (qual.motivation === "time-with-family") {
        return `${urgency} ${firstName}, 10 min now = freedom to work from home with family. ${timeMsg} Start: learn.accredipro.academy/functional-medicine-diploma`;
    }
    if (qual.motivation === "help-others") {
        return `${urgency} ${firstName}, someone needs your help. Learn how in 10 min. ${timeMsg} Go: learn.accredipro.academy/functional-medicine-diploma`;
    }
    if (qual.motivation === "financial-freedom") {
        return `${urgency} ${firstName}, $3k-10k/month starts with 10 min today. ${timeMsg} Start: learn.accredipro.academy/functional-medicine-diploma`;
    }
    if (qual.motivation === "career-change") {
        return `${urgency} ${firstName}, your new career starts with Lesson 1. ${timeMsg} Begin: learn.accredipro.academy/functional-medicine-diploma`;
    }

    // Income-based SMS (fallback)
    if (qual.incomeGoal === "starter-3-5k" || qual.incomeGoal === "replace-income-3-5k") {
        return `${urgency} ${firstName}, our grads avg $4,200/mo. Your turn! ${timeMsg} Start: learn.accredipro.academy/functional-medicine-diploma`;
    }
    if (qual.incomeGoal === "replace-job-5-10k" || qual.incomeGoal === "scale-business-10k-plus" || qual.incomeGoal === "build-business-10k-plus") {
        return `${urgency} ${firstName}, $5k-10k+/mo is possible. Start in 10 min. ${timeMsg} Go: learn.accredipro.academy/functional-medicine-diploma`;
    }

    // Default
    return `${urgency} ${firstName}, Lesson 1 is only 7 min. Get certified today! ${timeMsg} Start: learn.accredipro.academy/functional-medicine-diploma`;
}

// Generate personalized email hook based on qualification data
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

// Get income message based on goal
function getIncomeMessage(incomeGoal: string | null): string {
    if (incomeGoal === "starter-3-5k" || incomeGoal === "side-income-500-1k") {
        return "practitioners starting at $3,000-5,000/month";
    }
    if (incomeGoal === "replace-job-5-10k" || incomeGoal === "replace-income-3-5k") {
        return "practitioners replacing their income at $5,000-10,000/month";
    }
    if (incomeGoal === "scale-business-10k-plus" || incomeGoal === "build-business-10k-plus") {
        return "top practitioners building $10k+/month practices";
    }
    return "practitioners earning $150-300/hour";
}

// This cron runs hourly to send nudges to non-starters
export async function GET(request: NextRequest) {
    try {
        console.log("[CRON mini-diploma-nudges] Starting at", new Date().toISOString());

        // Verify cron secret
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        console.log("[CRON mini-diploma-nudges] Auth check:", {
            hasAuthHeader: !!authHeader,
            hasCronSecret: !!cronSecret,
            matches: authHeader === `Bearer ${cronSecret}`
        });

        if (authHeader !== `Bearer ${cronSecret}`) {
            console.log("[CRON mini-diploma-nudges] Unauthorized - auth mismatch");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const now = new Date();
        const results: NudgeResult[] = [];

        // Find all FM mini diploma leads who haven't started
        // Tag format from optin: lead:{course}-mini-diploma
        // Includes both functional-medicine and fm-healthcare variants
        const leads = await prisma.user.findMany({
            where: {
                tags: {
                    some: {
                        OR: [
                            { tag: "lead:functional-medicine-mini-diploma" },
                            { tag: "lead:fm-healthcare-mini-diploma" }
                        ]
                    }
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

        console.log(`[CRON mini-diploma-nudges] Found ${leads.length} leads to process`);

        for (const lead of leads) {
            const hoursSinceSignup = (now.getTime() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60);
            const sentNudges = new Set(lead.tags.map(t => t.tag));
            const firstName = lead.firstName || "there";
            const dashboardLink = `https://learn.accredipro.academy/functional-medicine-diploma`;

            console.log(`[CRON mini-diploma-nudges] Processing ${lead.email}: ${hoursSinceSignup.toFixed(1)}h since signup, sent nudges:`, Array.from(sentNudges).filter(t => t.startsWith("nudge:")));

            // Get personalized hook based on qualification answers
            const qualData = getQualificationData(lead.tags);
            const personalizedHook = getPersonalizedHook(qualData, firstName);

            // ============================================================
            // 48-HOUR COMPLETION SEQUENCE (Optimized for 2-day window)
            // ============================================================
            // Timeline: Optin → 48h access → Complete lessons → Exam → Certificate
            // Goal: Drive completion within 48 hours with strategic nudges
            // ============================================================

            // ----------------------
            // PHASE 1: FIRST 6 HOURS (Critical engagement window)
            // ----------------------

            // Hour 1 SMS: Friendly check-in
            if (hoursSinceSignup >= 1 && hoursSinceSignup < 2 && !sentNudges.has("nudge:hour-1-sms")) {
                if (lead.phone) {
                    const success = await sendSMS(
                        lead.phone,
                        `Hey ${firstName}! 👋 Sarah here. Lesson 1 takes just 7 min - perfect for a coffee break! Start now: ${dashboardLink}`
                    );
                    if (success) {
                        await prisma.userTag.create({ data: { userId: lead.id, tag: "nudge:hour-1-sms" } });
                        results.push({ userId: lead.id, channel: "sms", success: true, nudgeType: "hour-1" });
                    }
                }
            }

            // Hour 3 Email: Welcome + social proof (if they haven't started)
            if (hoursSinceSignup >= 3 && hoursSinceSignup < 4 && !sentNudges.has("nudge:hour-3-email")) {
                try {
                    await resend.emails.send({
                        from: "Sarah M. <sarah@accredipro-certificate.com>",
                        to: lead.email,
                        subject: `${firstName}, 847 women started this week 🎉`,
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                <p>Hey ${firstName}! 👋</p>
                                <p>I noticed you signed up but haven't started yet. No worries — life happens!</p>
                                <p style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #16a34a;">
                                    <strong>847 women started the ASI Foundation this week.</strong><br/>
                                    89% complete it in one sitting. You can too!
                                </p>
                                <p style="background: #f8f4f0; padding: 15px; border-radius: 8px; border-left: 4px solid #722F37;">
                                    ${personalizedHook}
                                </p>
                                <p><strong>Here's what you'll learn in the next hour:</strong></p>
                                <ul style="color: #444;">
                                    <li>✅ Root cause vs symptom treatment</li>
                                    <li>✅ The 5 pillars of functional medicine</li>
                                    <li>✅ How to charge $150-300/hour for consultations</li>
                                </ul>
                                <p style="margin: 30px 0;">
                                    <a href="${dashboardLink}" style="background: #722F37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                        Start Lesson 1 (7 min) →
                                    </a>
                                </p>
                                <p>Your 48-hour access is ticking. Make today count! 💪</p>
                                <p>— Coach Sarah</p>
                            </div>
                        `
                    });
                    await prisma.userTag.create({ data: { userId: lead.id, tag: "nudge:hour-3-email" } });
                    results.push({ userId: lead.id, channel: "email", success: true, nudgeType: "hour-3" });
                } catch (err) {
                    console.error(`Failed to send hour-3 email to ${lead.email}:`, err);
                }
            }

            // Hour 6 SMS: Quick personalized nudge
            if (hoursSinceSignup >= 6 && hoursSinceSignup < 7 && !sentNudges.has("nudge:hour-6-sms")) {
                if (lead.phone) {
                    const sms = getPersonalizedSMS(qualData, firstName, 42);
                    const success = await sendSMS(lead.phone, sms);
                    if (success) {
                        await prisma.userTag.create({ data: { userId: lead.id, tag: "nudge:hour-6-sms" } });
                        results.push({ userId: lead.id, channel: "sms", success: true, nudgeType: "hour-6" });
                    }
                }
            }

            // ----------------------
            // PHASE 2: HOURS 12-24 (Build momentum)
            // ----------------------

            // Hour 12 Email: Halfway point - urgency building
            if (hoursSinceSignup >= 12 && hoursSinceSignup < 13 && !sentNudges.has("nudge:hour-12-email")) {
                try {
                    await resend.emails.send({
                        from: "Sarah M. <sarah@accredipro-certificate.com>",
                        to: lead.email,
                        subject: "⏰ 36 hours left — here's your game plan",
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                <p>Hey ${firstName}!</p>
                                <p style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                                    ⏰ <strong>You have 36 hours left</strong> to complete your ASI Foundation certification.
                                </p>
                                <p><strong>Here's your simple game plan:</strong></p>
                                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                                    <tr style="background: #f8f4f0;">
                                        <td style="padding: 12px; border: 1px solid #ddd;"><strong>Tonight</strong></td>
                                        <td style="padding: 12px; border: 1px solid #ddd;">Complete Lessons 1-3 (21 min)</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px; border: 1px solid #ddd;"><strong>Tomorrow AM</strong></td>
                                        <td style="padding: 12px; border: 1px solid #ddd;">Complete Lessons 4-6 (21 min)</td>
                                    </tr>
                                    <tr style="background: #f8f4f0;">
                                        <td style="padding: 12px; border: 1px solid #ddd;"><strong>Tomorrow PM</strong></td>
                                        <td style="padding: 12px; border: 1px solid #ddd;">Lessons 7-9 + Exam (25 min)</td>
                                    </tr>
                                    <tr style="background: #f0fdf4;">
                                        <td style="padding: 12px; border: 1px solid #ddd;">🎓 <strong>Result</strong></td>
                                        <td style="padding: 12px; border: 1px solid #ddd;"><strong>Your ASI Certificate!</strong></td>
                                    </tr>
                                </table>
                                <p><strong>Total time: ~1 hour</strong> split however you like.</p>
                                <p style="margin: 30px 0;">
                                    <a href="${dashboardLink}" style="background: #722F37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                        Start Now - Lesson 1 →
                                    </a>
                                </p>
                                <p>You've got this! 💪</p>
                                <p>— Coach Sarah</p>
                            </div>
                        `
                    });
                    await prisma.userTag.create({ data: { userId: lead.id, tag: "nudge:hour-12-email" } });
                    results.push({ userId: lead.id, channel: "email", success: true, nudgeType: "hour-12" });
                } catch (err) {
                    console.error(`Failed to send hour-12 email to ${lead.email}:`, err);
                }
            }

            // Hour 18 SMS: Evening check-in
            if (hoursSinceSignup >= 18 && hoursSinceSignup < 19 && !sentNudges.has("nudge:hour-18-sms")) {
                if (lead.phone) {
                    const sms = getPersonalizedSMS(qualData, firstName, 30);
                    const success = await sendSMS(lead.phone, sms);
                    if (success) {
                        await prisma.userTag.create({ data: { userId: lead.id, tag: "nudge:hour-18-sms" } });
                        results.push({ userId: lead.id, channel: "sms", success: true, nudgeType: "hour-18" });
                    }
                }
            }

            // ----------------------
            // PHASE 3: HOURS 24-36 (URGENT - Last day)
            // ----------------------

            // Hour 24 Email: 24 HOURS LEFT - Major urgency
            if (hoursSinceSignup >= 24 && hoursSinceSignup < 25 && !sentNudges.has("nudge:hour-24-email")) {
                try {
                    const incomeMessage = getIncomeMessage(qualData.incomeGoal);
                    await resend.emails.send({
                        from: "Sarah M. <sarah@accredipro-certificate.com>",
                        to: lead.email,
                        subject: "⚠️ 24 Hours Left — Don't Let This Slip Away",
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                <p>Hey ${firstName}!</p>
                                <p style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626;">
                                    ⚠️ <strong>You have exactly 24 hours left</strong> to complete your ASI Functional Medicine Foundation certification.
                                </p>
                                <p style="background: #f8f4f0; padding: 15px; border-radius: 8px; border-left: 4px solid #722F37;">
                                    ${personalizedHook}
                                </p>
                                <p><strong>What you'll miss if you don't complete:</strong></p>
                                <ul style="color: #666;">
                                    <li>❌ Your ASI Foundation Certificate</li>
                                    <li>❌ Access to the scholarship application ($2,000 off)</li>
                                    <li>❌ Joining ${incomeMessage}</li>
                                </ul>
                                <p><strong>What you'll gain if you complete (just 1 hour!):</strong></p>
                                <ul style="color: #16a34a;">
                                    <li>✅ Official ASI certification to add to your resume</li>
                                    <li>✅ Qualify for the $2,000 scholarship</li>
                                    <li>✅ Foundation knowledge to start your practice</li>
                                </ul>
                                <p style="margin: 30px 0;">
                                    <a href="${dashboardLink}" style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                        Complete Now — 24h Left →
                                    </a>
                                </p>
                                <p>Don't let this opportunity expire. I believe in you! 💪</p>
                                <p>— Coach Sarah</p>
                            </div>
                        `
                    });
                    await prisma.userTag.create({ data: { userId: lead.id, tag: "nudge:hour-24-email" } });
                    results.push({ userId: lead.id, channel: "email", success: true, nudgeType: "hour-24" });
                } catch (err) {
                    console.error(`Failed to send hour-24 email to ${lead.email}:`, err);
                }
            }

            // Hour 30 SMS: 18 hours left - personalized urgency
            if (hoursSinceSignup >= 30 && hoursSinceSignup < 31 && !sentNudges.has("nudge:hour-30-sms")) {
                if (lead.phone) {
                    const sms = getPersonalizedSMS(qualData, firstName, 18);
                    const success = await sendSMS(lead.phone, sms);
                    if (success) {
                        await prisma.userTag.create({ data: { userId: lead.id, tag: "nudge:hour-30-sms" } });
                        results.push({ userId: lead.id, channel: "sms", success: true, nudgeType: "hour-30" });
                    }
                }
            }

            // ----------------------
            // PHASE 4: HOURS 36-48 (FINAL - Last push)
            // ----------------------

            // Hour 36 Email: 12 HOURS LEFT - Final warning
            if (hoursSinceSignup >= 36 && hoursSinceSignup < 37 && !sentNudges.has("nudge:hour-36-email")) {
                try {
                    await resend.emails.send({
                        from: "Sarah M. <sarah@accredipro-certificate.com>",
                        to: lead.email,
                        subject: "🚨 12 Hours Left — This Is Your Final Chance",
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                <p>Hey ${firstName}!</p>
                                <p style="background: #fef2f2; padding: 20px; border-radius: 8px; border: 2px solid #dc2626; text-align: center;">
                                    🚨 <strong style="font-size: 18px;">ONLY 12 HOURS LEFT</strong> 🚨<br/>
                                    <span style="color: #666;">Your access expires tonight at midnight</span>
                                </p>
                                <p>${firstName}, I'm sending this because I don't want you to miss out.</p>
                                <p style="background: #f8f4f0; padding: 15px; border-radius: 8px;">
                                    ${personalizedHook}
                                </p>
                                <p><strong>You can still make it:</strong></p>
                                <ul>
                                    <li>⏱️ 9 lessons × 7 min = 63 minutes total</li>
                                    <li>📝 Quick 10-question exam at the end</li>
                                    <li>🎓 Your certificate downloads instantly</li>
                                </ul>
                                <p>That's it. <strong>One hour from now, you could be certified.</strong></p>
                                <p style="margin: 30px 0; text-align: center;">
                                    <a href="${dashboardLink}" style="background: #dc2626; color: white; padding: 18px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                                        🎓 GET CERTIFIED NOW →
                                    </a>
                                </p>
                                <p>This is your moment. Take it.</p>
                                <p>— Coach Sarah</p>
                            </div>
                        `
                    });
                    await prisma.userTag.create({ data: { userId: lead.id, tag: "nudge:hour-36-email" } });
                    results.push({ userId: lead.id, channel: "email", success: true, nudgeType: "hour-36" });
                } catch (err) {
                    console.error(`Failed to send hour-36 email to ${lead.email}:`, err);
                }
            }

            // Hour 42 SMS: 6 hours left - URGENT
            if (hoursSinceSignup >= 42 && hoursSinceSignup < 43 && !sentNudges.has("nudge:hour-42-sms")) {
                if (lead.phone) {
                    const success = await sendSMS(
                        lead.phone,
                        `🚨 ${firstName}, ONLY 6 HOURS LEFT! Your certification expires TONIGHT. 1 hour to complete = certificate for life. GO NOW: ${dashboardLink}`
                    );
                    if (success) {
                        await prisma.userTag.create({ data: { userId: lead.id, tag: "nudge:hour-42-sms" } });
                        results.push({ userId: lead.id, channel: "sms", success: true, nudgeType: "hour-42" });
                    }
                }
            }

            // Hour 47 SMS: FINAL 1 HOUR WARNING
            if (hoursSinceSignup >= 47 && hoursSinceSignup < 48 && !sentNudges.has("nudge:hour-47-sms")) {
                if (lead.phone) {
                    const success = await sendSMS(
                        lead.phone,
                        `⏰ ${firstName}, 1 HOUR LEFT! This is your LAST chance. Start now, finish before midnight: ${dashboardLink}`
                    );
                    if (success) {
                        await prisma.userTag.create({ data: { userId: lead.id, tag: "nudge:hour-47-sms" } });
                        results.push({ userId: lead.id, channel: "sms", success: true, nudgeType: "hour-47" });
                    }
                }
            }

            // ----------------------
            // PHASE 5: POST-EXPIRY (Recovery)
            // ----------------------

            // Hour 48 Email: EXPIRED - 24h extension offer
            if (hoursSinceSignup >= 48 && hoursSinceSignup < 49 && !sentNudges.has("nudge:hour-48-email")) {
                try {
                    const incomeMessage = getIncomeMessage(qualData.incomeGoal);
                    await resend.emails.send({
                        from: "Sarah M. <sarah@accredipro-certificate.com>",
                        to: lead.email,
                        subject: "Your access expired — but I'm giving you 24 more hours 🎁",
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                <p>Hey ${firstName}!</p>
                                <p>Your 48-hour access to the ASI Functional Medicine Foundation just expired.</p>
                                <p style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #16a34a;">
                                    🎁 <strong>Good news: I've extended your access by 24 hours.</strong>
                                </p>
                                <p>I know life gets busy. No judgment here — but I really don't want you to miss this opportunity.</p>
                                <p style="background: #f8f4f0; padding: 15px; border-radius: 8px; border-left: 4px solid #722F37;">
                                    ${personalizedHook}
                                </p>
                                <p>This is your <strong>FINAL chance</strong> to:</p>
                                <ul>
                                    <li>✅ Complete your 1-hour certification</li>
                                    <li>✅ Get your ASI Foundation Certificate</li>
                                    <li>✅ Qualify for the $2,000 scholarship</li>
                                    <li>✅ Join ${incomeMessage}</li>
                                </ul>
                                <p><strong>After 24 hours, your spot will be released to the waitlist.</strong></p>
                                <p style="margin: 30px 0;">
                                    <a href="${dashboardLink}" style="background: #16a34a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                        Use My 24h Extension →
                                    </a>
                                </p>
                                <p>You've got this. Make these 24 hours count!</p>
                                <p>— Coach Sarah</p>
                            </div>
                        `
                    });
                    await prisma.userTag.create({ data: { userId: lead.id, tag: "nudge:hour-48-email" } });
                    results.push({ userId: lead.id, channel: "email", success: true, nudgeType: "hour-48" });
                } catch (err) {
                    console.error(`Failed to send hour-48 email to ${lead.email}:`, err);
                }
            }

            // Hour 60 SMS: 12 hours left on extension
            if (hoursSinceSignup >= 60 && hoursSinceSignup < 61 && !sentNudges.has("nudge:hour-60-sms")) {
                if (lead.phone) {
                    const success = await sendSMS(
                        lead.phone,
                        `⏰ ${firstName}, 12h left on your extension! This is really it. Complete your certification: ${dashboardLink}`
                    );
                    if (success) {
                        await prisma.userTag.create({ data: { userId: lead.id, tag: "nudge:hour-60-sms" } });
                        results.push({ userId: lead.id, channel: "sms", success: true, nudgeType: "hour-60" });
                    }
                }
            }

            // Hour 72 Email: FINAL - Extension expired
            if (hoursSinceSignup >= 72 && hoursSinceSignup < 73 && !sentNudges.has("nudge:hour-72-email")) {
                try {
                    await resend.emails.send({
                        from: "Sarah M. <sarah@accredipro-certificate.com>",
                        to: lead.email,
                        subject: "Final goodbye (unless you want back in) 👋",
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                <p>Hey ${firstName},</p>
                                <p>Your extension has expired, and I've had to release your spot to the next person on the waitlist.</p>
                                <p>I know life gets crazy. No judgment here at all.</p>
                                <p>If you ever want to come back and complete your Functional Medicine certification, just <strong>reply to this email</strong> and I'll see what I can do.</p>
                                <p>Wishing you all the best on your journey! 💕</p>
                                <p>— Coach Sarah</p>
                                <p style="font-size: 12px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                                    P.S. Many of our most successful practitioners started exactly where you are. When you're ready, we'll be here. Just reply to this email.
                                </p>
                            </div>
                        `
                    });
                    await prisma.userTag.create({ data: { userId: lead.id, tag: "nudge:hour-72-email" } });
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
