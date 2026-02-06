import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, wasRecentlyEmailed } from "@/lib/email";
import { MINI_DIPLOMA_REGISTRY, MiniDiplomaConfig } from "@/lib/mini-diploma-registry";

// TODO: Implement SMS with Twilio or GHL when ready
// async function sendSMS(phone: string, message: string): Promise<boolean> { ... }

interface NudgeResult {
    userId: string;
    email: string;
    niche: string;
    channel: "email";
    success: boolean;
    nudgeType: string;
}

// Helper to extract qualification data from tags
function getQualificationData(tags: { tag: string }[]) {
    const tagSet = tags.map(t => t.tag);
    const motivation = tagSet.find(t => t.startsWith("motivation:"))?.replace("motivation:", "") || null;
    const timeCommitment = tagSet.find(t => t.startsWith("time_commitment:"))?.replace("time_commitment:", "") || null;
    const incomeGoal = tagSet.find(t => t.startsWith("income_goal:"))?.replace("income_goal:", "") || null;
    return { motivation, timeCommitment, incomeGoal };
}

// Generate personalized email hook based on qualification data
function getPersonalizedHook(qual: ReturnType<typeof getQualificationData>, firstName: string): string {
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
    if (qual.timeCommitment === "few-hours-flexible") {
        return `${firstName}, just a few flexible hours can change everything. Lesson 1 is only 7 minutes!`;
    }
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

// Resolve the lead tag to the matching niche config
function getConfigForLeadTag(leadTag: string): MiniDiplomaConfig | undefined {
    // Tag format: "lead:{slug}" where slug = "functional-medicine-mini-diploma" etc.
    const slug = leadTag.replace("lead:", "");
    return MINI_DIPLOMA_REGISTRY[slug];
}

// Get the portal dashboard link for a niche
function getPortalLink(config: MiniDiplomaConfig): string {
    return `https://learn.accredipro.academy/portal/${config.portalSlug}`;
}

// Build all possible lead tags from the registry
function getAllLeadTags(): string[] {
    return Object.keys(MINI_DIPLOMA_REGISTRY).map(slug => `lead:${slug}`);
}

// Build all possible lesson-complete tag prefixes from the registry
function getAllLessonTagPrefixes(): string[] {
    return Object.values(MINI_DIPLOMA_REGISTRY).map(c => c.lessonTagPrefix);
}

// ============================================================
// EMAIL TEMPLATES — Dynamic for all niches
// All use: {{firstName}}, {{displayName}}, {{portalLink}}, {{personalizedHook}}, {{incomeMessage}}
// Curriculum: 3 lessons (~25 min) + 5-question exam
// ============================================================

function emailHour3(firstName: string, config: MiniDiplomaConfig, portalLink: string, personalizedHook: string): { subject: string; html: string } {
    return {
        subject: `${firstName}, 847 women started this week`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <p>Hey ${firstName}!</p>
                <p>I noticed you signed up but haven't started yet. No worries — life happens!</p>
                <p style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #16a34a;">
                    <strong>847 women started their ${config.displayName} certification this week.</strong><br/>
                    89% complete it in one sitting. You can too!
                </p>
                <p style="background: #f8f4f0; padding: 15px; border-radius: 8px; border-left: 4px solid #722F37;">
                    ${personalizedHook}
                </p>
                <p><strong>Here's what's waiting for you:</strong></p>
                <ul style="color: #444;">
                    <li>3 focused lessons (~25 minutes total)</li>
                    <li>Quick 5-question exam</li>
                    <li>Your ${config.displayName} Certificate — instantly</li>
                </ul>
                <p style="margin: 30px 0;">
                    <a href="${portalLink}" style="background: #722F37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Start Lesson 1 (7 min) →
                    </a>
                </p>
                <p>Your 48-hour access is ticking. Make today count!</p>
                <p>— Coach Sarah</p>
            </div>
        `,
    };
}

function emailHour12(firstName: string, config: MiniDiplomaConfig, portalLink: string): { subject: string; html: string } {
    return {
        subject: `36 hours left — here's your game plan, ${firstName}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <p>Hey ${firstName}!</p>
                <p style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                    <strong>You have 36 hours left</strong> to complete your ${config.displayName} certification.
                </p>
                <p><strong>Here's your simple game plan:</strong></p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="background: #f8f4f0;">
                        <td style="padding: 12px; border: 1px solid #ddd;"><strong>Step 1</strong></td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Complete 3 lessons (~25 min)</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd;"><strong>Step 2</strong></td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Pass the 5-question exam (5 min)</td>
                    </tr>
                    <tr style="background: #f0fdf4;">
                        <td style="padding: 12px; border: 1px solid #ddd;"><strong>Done!</strong></td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><strong>Your ${config.displayName} Certificate!</strong></td>
                    </tr>
                </table>
                <p><strong>Total time: ~30 minutes.</strong> That's it.</p>
                <p style="margin: 30px 0;">
                    <a href="${portalLink}" style="background: #722F37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Start Now — Lesson 1 →
                    </a>
                </p>
                <p>You've got this!</p>
                <p>— Coach Sarah</p>
            </div>
        `,
    };
}

function emailHour24(firstName: string, config: MiniDiplomaConfig, portalLink: string, personalizedHook: string, incomeMessage: string): { subject: string; html: string } {
    return {
        subject: "24 Hours Left — Don't Let This Slip Away",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <p>Hey ${firstName}!</p>
                <p style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626;">
                    <strong>You have exactly 24 hours left</strong> to complete your ${config.displayName} certification.
                </p>
                <p style="background: #f8f4f0; padding: 15px; border-radius: 8px; border-left: 4px solid #722F37;">
                    ${personalizedHook}
                </p>
                <p><strong>What you'll miss if you don't complete:</strong></p>
                <ul style="color: #666;">
                    <li>Your ${config.displayName} Certificate</li>
                    <li>Access to the scholarship application ($2,000 off)</li>
                    <li>Joining ${incomeMessage}</li>
                </ul>
                <p><strong>What you'll gain if you complete (just 30 min!):</strong></p>
                <ul style="color: #16a34a;">
                    <li>Official ${config.displayName} certification to add to your resume</li>
                    <li>Qualify for the $2,000 scholarship</li>
                    <li>Foundation knowledge to start your practice</li>
                </ul>
                <p style="margin: 30px 0;">
                    <a href="${portalLink}" style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Complete Now — 24h Left →
                    </a>
                </p>
                <p>Don't let this opportunity expire. I believe in you!</p>
                <p>— Coach Sarah</p>
            </div>
        `,
    };
}

function emailHour36(firstName: string, config: MiniDiplomaConfig, portalLink: string, personalizedHook: string): { subject: string; html: string } {
    return {
        subject: "12 Hours Left — This Is Your Final Chance",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <p>Hey ${firstName}!</p>
                <p style="background: #fef2f2; padding: 20px; border-radius: 8px; border: 2px solid #dc2626; text-align: center;">
                    <strong style="font-size: 18px;">ONLY 12 HOURS LEFT</strong><br/>
                    <span style="color: #666;">Your access expires tonight at midnight</span>
                </p>
                <p>${firstName}, I'm sending this because I don't want you to miss out.</p>
                <p style="background: #f8f4f0; padding: 15px; border-radius: 8px;">
                    ${personalizedHook}
                </p>
                <p><strong>You can still make it:</strong></p>
                <ul>
                    <li>3 lessons (~25 minutes total)</li>
                    <li>Quick 5-question exam</li>
                    <li>Your certificate downloads instantly</li>
                </ul>
                <p>That's it. <strong>30 minutes from now, you could be certified.</strong></p>
                <p style="margin: 30px 0; text-align: center;">
                    <a href="${portalLink}" style="background: #dc2626; color: white; padding: 18px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                        GET CERTIFIED NOW →
                    </a>
                </p>
                <p>This is your moment. Take it.</p>
                <p>— Coach Sarah</p>
            </div>
        `,
    };
}

function emailHour48(firstName: string, config: MiniDiplomaConfig, portalLink: string, personalizedHook: string, incomeMessage: string): { subject: string; html: string } {
    return {
        subject: "Your access expired — but I'm giving you 24 more hours",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <p>Hey ${firstName}!</p>
                <p>Your 48-hour access to the ${config.displayName} certification just expired.</p>
                <p style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #16a34a;">
                    <strong>Good news: I've extended your access by 24 hours.</strong>
                </p>
                <p>I know life gets busy. No judgment here — but I really don't want you to miss this opportunity.</p>
                <p style="background: #f8f4f0; padding: 15px; border-radius: 8px; border-left: 4px solid #722F37;">
                    ${personalizedHook}
                </p>
                <p>This is your <strong>FINAL chance</strong> to:</p>
                <ul>
                    <li>Complete your 30-minute certification</li>
                    <li>Get your ${config.displayName} Certificate</li>
                    <li>Qualify for the $2,000 scholarship</li>
                    <li>Join ${incomeMessage}</li>
                </ul>
                <p><strong>After 24 hours, your spot will be released to the waitlist.</strong></p>
                <p style="margin: 30px 0;">
                    <a href="${portalLink}" style="background: #16a34a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Use My 24h Extension →
                    </a>
                </p>
                <p>You've got this. Make these 24 hours count!</p>
                <p>— Coach Sarah</p>
            </div>
        `,
    };
}

function emailHour72(firstName: string, config: MiniDiplomaConfig): { subject: string; html: string } {
    return {
        subject: "Final goodbye (unless you want back in)",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <p>Hey ${firstName},</p>
                <p>Your extension has expired, and I've had to release your spot to the next person on the waitlist.</p>
                <p>I know life gets crazy. No judgment here at all.</p>
                <p>If you ever want to come back and complete your ${config.displayName} certification, just <strong>reply to this email</strong> and I'll see what I can do.</p>
                <p>Wishing you all the best on your journey!</p>
                <p>— Coach Sarah</p>
                <p style="font-size: 12px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    P.S. Many of our most successful practitioners started exactly where you are. When you're ready, we'll be here. Just reply to this email.
                </p>
            </div>
        `,
    };
}

// ============================================================
// CRON HANDLER — Runs every hour via Vercel Cron
// Queries ALL niches dynamically from MINI_DIPLOMA_REGISTRY
// Email-only sequence: Hours 3, 12, 24, 36, 48, 72
// ============================================================

export async function GET(request: NextRequest) {
    try {
        console.log("[CRON mini-diploma-nudges] Starting at", new Date().toISOString());

        // Verify cron secret
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (authHeader !== `Bearer ${cronSecret}`) {
            console.log("[CRON mini-diploma-nudges] Unauthorized - auth mismatch");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const now = new Date();
        const results: NudgeResult[] = [];

        // Build dynamic tag lists from the full registry
        const allLeadTags = getAllLeadTags();
        const allLessonPrefixes = getAllLessonTagPrefixes();

        console.log(`[CRON mini-diploma-nudges] Tracking ${allLeadTags.length} niches: ${allLeadTags.map(t => t.replace("lead:", "")).join(", ")}`);

        // Find ALL mini diploma leads across ALL niches who haven't started any lesson
        const leads = await prisma.user.findMany({
            where: {
                tags: {
                    some: {
                        OR: allLeadTags.map(tag => ({ tag }))
                    }
                },
                // Exclude those who have completed any lesson in any niche
                NOT: {
                    tags: {
                        some: {
                            OR: allLessonPrefixes.map(prefix => ({ tag: { startsWith: `${prefix}:` } }))
                        }
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
                            { tag: { startsWith: "lead:" } },
                            { tag: { startsWith: "motivation:" } },
                            { tag: { startsWith: "time_commitment:" } },
                            { tag: { startsWith: "income_goal:" } },
                        ]
                    },
                    select: { tag: true }
                }
            }
        });

        console.log(`[CRON mini-diploma-nudges] Found ${leads.length} leads to process`);

        for (const lead of leads) {
            if (!lead.email) continue;

            const leadEmail = lead.email;
            const hoursSinceSignup = (now.getTime() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60);

            // Stop processing leads older than 73 hours (sequence complete)
            if (hoursSinceSignup > 73) continue;

            const sentNudges = new Set(lead.tags.map(t => t.tag));
            const firstName = lead.firstName || "there";

            // Resolve which niche this lead belongs to
            const leadTag = lead.tags.find(t => t.tag.startsWith("lead:") && t.tag.endsWith("-mini-diploma"));
            if (!leadTag) continue;

            const config = getConfigForLeadTag(leadTag.tag);
            if (!config) {
                console.log(`[CRON mini-diploma-nudges] No registry config for tag: ${leadTag.tag}, skipping`);
                continue;
            }

            const portalLink = getPortalLink(config);
            const nicheName = config.displayName;

            console.log(`[CRON mini-diploma-nudges] Processing ${leadEmail} (${nicheName}): ${hoursSinceSignup.toFixed(1)}h since signup`);

            // Global guard: skip if user was emailed by ANY system in the last 2 hours
            const recentlyEmailed = await wasRecentlyEmailed(leadEmail, 2);
            if (recentlyEmailed) {
                console.log(`[CRON mini-diploma-nudges] Skipping ${leadEmail} - recently emailed`);
                continue;
            }

            // Get personalized content
            const qualData = getQualificationData(lead.tags);
            const personalizedHook = getPersonalizedHook(qualData, firstName);
            const incomeMessage = getIncomeMessage(qualData.incomeGoal);

            // ============================================================
            // 48-HOUR EMAIL SEQUENCE (6 emails, no SMS)
            // Timeline: 3h → 12h → 24h → 36h → 48h (recovery) → 72h (final)
            // ============================================================

            // Hour 3: Social proof + what's inside
            if (hoursSinceSignup >= 3 && hoursSinceSignup < 4 && !sentNudges.has("nudge:hour-3-email")) {
                try {
                    const { subject, html } = emailHour3(firstName, config, portalLink, personalizedHook);
                    await sendEmail({ to: leadEmail, subject, html, type: "transactional", userId: lead.id, emailType: "mini-diploma-nudge" });
                    await prisma.userTag.create({ data: { userId: lead.id, tag: "nudge:hour-3-email" } });
                    results.push({ userId: lead.id, email: leadEmail, niche: nicheName, channel: "email", success: true, nudgeType: "hour-3" });
                } catch (err) {
                    console.error(`Failed hour-3 email to ${leadEmail}:`, err);
                }
            }

            // Hour 12: Game plan + urgency building
            if (hoursSinceSignup >= 12 && hoursSinceSignup < 13 && !sentNudges.has("nudge:hour-12-email")) {
                try {
                    const { subject, html } = emailHour12(firstName, config, portalLink);
                    await sendEmail({ to: leadEmail, subject, html, type: "transactional", userId: lead.id, emailType: "mini-diploma-nudge" });
                    await prisma.userTag.create({ data: { userId: lead.id, tag: "nudge:hour-12-email" } });
                    results.push({ userId: lead.id, email: leadEmail, niche: nicheName, channel: "email", success: true, nudgeType: "hour-12" });
                } catch (err) {
                    console.error(`Failed hour-12 email to ${leadEmail}:`, err);
                }
            }

            // Hour 24: 24 hours left — major urgency
            if (hoursSinceSignup >= 24 && hoursSinceSignup < 25 && !sentNudges.has("nudge:hour-24-email")) {
                try {
                    const { subject, html } = emailHour24(firstName, config, portalLink, personalizedHook, incomeMessage);
                    await sendEmail({ to: leadEmail, subject, html, type: "transactional", userId: lead.id, emailType: "mini-diploma-nudge" });
                    await prisma.userTag.create({ data: { userId: lead.id, tag: "nudge:hour-24-email" } });
                    results.push({ userId: lead.id, email: leadEmail, niche: nicheName, channel: "email", success: true, nudgeType: "hour-24" });
                } catch (err) {
                    console.error(`Failed hour-24 email to ${leadEmail}:`, err);
                }
            }

            // Hour 36: 12 hours left — final warning
            if (hoursSinceSignup >= 36 && hoursSinceSignup < 37 && !sentNudges.has("nudge:hour-36-email")) {
                try {
                    const { subject, html } = emailHour36(firstName, config, portalLink, personalizedHook);
                    await sendEmail({ to: leadEmail, subject, html, type: "transactional", userId: lead.id, emailType: "mini-diploma-nudge" });
                    await prisma.userTag.create({ data: { userId: lead.id, tag: "nudge:hour-36-email" } });
                    results.push({ userId: lead.id, email: leadEmail, niche: nicheName, channel: "email", success: true, nudgeType: "hour-36" });
                } catch (err) {
                    console.error(`Failed hour-36 email to ${leadEmail}:`, err);
                }
            }

            // Hour 48: Access expired — 24h extension offer
            if (hoursSinceSignup >= 48 && hoursSinceSignup < 49 && !sentNudges.has("nudge:hour-48-email")) {
                try {
                    const { subject, html } = emailHour48(firstName, config, portalLink, personalizedHook, incomeMessage);
                    await sendEmail({ to: leadEmail, subject, html, type: "transactional", userId: lead.id, emailType: "mini-diploma-nudge" });
                    await prisma.userTag.create({ data: { userId: lead.id, tag: "nudge:hour-48-email" } });
                    results.push({ userId: lead.id, email: leadEmail, niche: nicheName, channel: "email", success: true, nudgeType: "hour-48" });
                } catch (err) {
                    console.error(`Failed hour-48 email to ${leadEmail}:`, err);
                }
            }

            // Hour 72: Final goodbye — reply to come back
            if (hoursSinceSignup >= 72 && hoursSinceSignup < 73 && !sentNudges.has("nudge:hour-72-email")) {
                try {
                    const { subject, html } = emailHour72(firstName, config);
                    await sendEmail({ to: leadEmail, subject, html, type: "transactional", userId: lead.id, emailType: "mini-diploma-nudge" });
                    await prisma.userTag.create({ data: { userId: lead.id, tag: "nudge:hour-72-email" } });
                    results.push({ userId: lead.id, email: leadEmail, niche: nicheName, channel: "email", success: true, nudgeType: "hour-72" });
                } catch (err) {
                    console.error(`Failed hour-72 email to ${leadEmail}:`, err);
                }
            }
        }

        console.log(`[CRON mini-diploma-nudges] Done. ${results.length} nudges sent across ${new Set(results.map(r => r.niche)).size} niches`);

        return NextResponse.json({
            success: true,
            timestamp: now.toISOString(),
            leadsProcessed: leads.length,
            nudgesSent: results.length,
            nichesCovered: [...new Set(results.map(r => r.niche))],
            results
        });
    } catch (error) {
        console.error("[CRON mini-diploma-nudges] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
