import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, emailWrapper, wasRecentlyEmailed } from "@/lib/email";

// Sarah signature in italic/cursive like a real handwritten signature
const SARAH_SIGNATURE = `
<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
    <p style="margin: 0; font-family: 'Georgia', 'Times New Roman', serif; font-style: italic; color: #722F37; font-size: 20px;">– Sarah</p>
    <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">Your Coach at AccrediPro Academy</p>
</div>`;

// Email nudge templates for each onboarding step (Branded HTML)
const NUDGE_TEMPLATES = {
    profile: {
        delay: 24 * 60 * 60 * 1000, // 24 hours
        subject: "Quick thing, {{firstName}}...",
        preheader: "Complete your profile in 30 seconds – I'd love to see who I'm working with!",
        content: (firstName: string, profileLink: string) => `
            <h2 style="color: #722F37; margin: 0 0 20px 0; font-size: 22px;">Hey ${firstName},</h2>
            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">I noticed you haven't finished setting up your profile yet.</p>
            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">Adding a photo and a short bio helps me understand your goals better – and makes our community feel more connected.</p>
            <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">Takes 30 seconds:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${profileLink}" style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); color: #D4AF37; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Complete Your Profile →</a>
            </div>
            <p style="margin: 20px 0 0 0; font-size: 14px; color: #666; font-style: italic;">P.S. I love seeing who I'm working with! 📸</p>
            ${SARAH_SIGNATURE}
        `,
    },
    message: {
        delay: 48 * 60 * 60 * 1000, // 48 hours
        subject: "I'm right here if you need me",
        preheader: "Whether you have questions or just want to chat – I'm here for you.",
        content: (firstName: string, messageLink: string) => `
            <h2 style="color: #722F37; margin: 0 0 20px 0; font-size: 22px;">Hey ${firstName},</h2>
            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">Just wanted to remind you – you can message me anytime.</p>
            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">Whether you have questions about the curriculum, need help with a concept, or just want to chat about your goals... I'm here.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${messageLink}" style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); color: #D4AF37; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Send Me a Message →</a>
            </div>
            <p style="margin: 20px 0 0 0; font-size: 14px; color: #666; font-style: italic;">P.S. No question is too small! 💬</p>
            ${SARAH_SIGNATURE}
        `,
    },
    lesson: {
        delay: 72 * 60 * 60 * 1000, // 72 hours
        subject: "Your first lesson takes 5 mins",
        preheader: "Just 5 minutes to start your certification journey. Ready?",
        content: (firstName: string, lessonLink: string) => `
            <h2 style="color: #722F37; margin: 0 0 20px 0; font-size: 22px;">Hey ${firstName},</h2>
            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">I've been checking in and noticed you haven't started your first lesson yet.</p>
            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">I get it – life is busy. But here's the thing: <strong>your first lesson literally takes 5 minutes</strong> and sets the foundation for everything.</p>
            <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">Ready to start?</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${lessonLink}" style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); color: #D4AF37; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Start Your First Lesson →</a>
            </div>
            <p style="margin: 20px 0 0 0; font-size: 14px; color: #666; font-style: italic;">P.S. You've got this! 🌟</p>
            ${SARAH_SIGNATURE}
        `,
    },
    community: {
        delay: 5 * 24 * 60 * 60 * 1000, // 5 days
        subject: "The community is waiting for you",
        preheader: "Introduce yourself – everyone's super welcoming!",
        content: (firstName: string, communityLink: string) => `
            <h2 style="color: #722F37; margin: 0 0 20px 0; font-size: 22px;">Hey ${firstName},</h2>
            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">Quick one – have you introduced yourself in the community yet?</p>
            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">It's a simple post and a great way to connect with others on the same path. Plus, the accountability and support are game-changers.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${communityLink}" style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); color: #D4AF37; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Introduce Yourself →</a>
            </div>
            <p style="margin: 20px 0 0 0; font-size: 14px; color: #666; font-style: italic;">P.S. Everyone's super welcoming. No pressure, just support! 🤝</p>
            ${SARAH_SIGNATURE}
        `,
    },
};

// Cron endpoint to send onboarding nudges
export async function GET(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || "https://learn.accredipro.academy";
    const results = {
        checked: 0,
        nudgesSent: 0,
        skipped: 0,
        errors: 0,
        details: [] as string[],
    };

    try {
        const now = new Date();

        // Find STUDENT users created in last 7 days who haven't completed all onboarding
        // and don't have a completedAt date
        const recentBuyers = await prisma.user.findMany({
            where: {
                userType: "STUDENT",
                isFakeProfile: false,
                createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                // Exclude internal emails
                email: { not: { contains: "@accredipro" } },
                // Exclude users in ANY recovery sequence (any status — avoid stacking)
                sequenceEnrollments: {
                    none: {
                        sequence: {
                            slug: {
                                in: [
                                    "recovery-never-logged-in",
                                    "recovery-never-started",
                                    "recovery-abandoned-learning",
                                ],
                            },
                        },
                    },
                },
            },
            include: {
                onboardingProgress: true,
            },
            take: 100, // Process max 100 per run
        });

        results.checked = recentBuyers.length;

        for (const user of recentBuyers) {
            const progress = user.onboardingProgress;
            const firstName = user.firstName || "there";
            const email = user.email!;
            const createdAt = user.createdAt.getTime();
            const timeSinceSignup = now.getTime() - createdAt;

            // Skip if all complete
            if (progress?.completedAt) continue;

            // Global guard: skip if user was emailed by ANY system in the last 4 hours
            const recentlyEmailed = await wasRecentlyEmailed(email, 4);
            if (recentlyEmailed) {
                results.skipped++;
                results.details.push(`${email}: Skipped - recently emailed (cross-system guard)`);
                continue;
            }

            // Create progress record if doesn't exist
            let progressRecord = progress;
            if (!progressRecord) {
                progressRecord = await prisma.onboardingProgress.create({
                    data: { userId: user.id },
                });
            }

            // Check each step and send nudge if needed

            // 1. Profile nudge (24h)
            if (!progressRecord.profileComplete &&
                !progressRecord.profileNudgeSentAt &&
                timeSinceSignup >= NUDGE_TEMPLATES.profile.delay) {
                try {
                    const content = NUDGE_TEMPLATES.profile.content(firstName, `${baseUrl}/dashboard`);

                    await sendEmail({
                        to: email,
                        subject: NUDGE_TEMPLATES.profile.subject.replace("{{firstName}}", firstName),
                        html: emailWrapper(content, NUDGE_TEMPLATES.profile.preheader),
                        replyTo: "sarah@accredipro-certificate.com",
                        type: "transactional",
                    });

                    await prisma.onboardingProgress.update({
                        where: { id: progressRecord.id },
                        data: { profileNudgeSentAt: now },
                    });

                    results.nudgesSent++;
                    results.details.push(`Profile nudge → ${email}`);
                } catch (e) {
                    results.errors++;
                }
            }

            // 2. Message nudge (48h)
            if (!progressRecord.firstMessageSent &&
                !progressRecord.messageNudgeSentAt &&
                timeSinceSignup >= NUDGE_TEMPLATES.message.delay) {
                try {
                    const content = NUDGE_TEMPLATES.message.content(firstName, `${baseUrl}/messages`);

                    await sendEmail({
                        to: email,
                        subject: NUDGE_TEMPLATES.message.subject,
                        html: emailWrapper(content, NUDGE_TEMPLATES.message.preheader),
                        replyTo: "sarah@accredipro-certificate.com",
                        type: "transactional",
                    });

                    await prisma.onboardingProgress.update({
                        where: { id: progressRecord.id },
                        data: { messageNudgeSentAt: now },
                    });

                    results.nudgesSent++;
                    results.details.push(`Message nudge → ${email}`);
                } catch (e) {
                    results.errors++;
                }
            }

            // 3. Lesson nudge (72h)
            if (!progressRecord.firstLessonComplete &&
                !progressRecord.lessonNudgeSentAt &&
                timeSinceSignup >= NUDGE_TEMPLATES.lesson.delay) {
                try {
                    const content = NUDGE_TEMPLATES.lesson.content(firstName, `${baseUrl}/my-courses`);

                    await sendEmail({
                        to: email,
                        subject: NUDGE_TEMPLATES.lesson.subject,
                        html: emailWrapper(content, NUDGE_TEMPLATES.lesson.preheader),
                        replyTo: "sarah@accredipro-certificate.com",
                        type: "transactional",
                    });

                    await prisma.onboardingProgress.update({
                        where: { id: progressRecord.id },
                        data: { lessonNudgeSentAt: now },
                    });

                    results.nudgesSent++;
                    results.details.push(`Lesson nudge → ${email}`);
                } catch (e) {
                    results.errors++;
                }
            }

            // 4. Community nudge (5 days)
            if (!progressRecord.communityIntro &&
                !progressRecord.communityNudgeSentAt &&
                timeSinceSignup >= NUDGE_TEMPLATES.community.delay) {
                try {
                    const content = NUDGE_TEMPLATES.community.content(firstName, `${baseUrl}/community/cmkvj0klb0000bim95cl2peji`);

                    await sendEmail({
                        to: email,
                        subject: NUDGE_TEMPLATES.community.subject,
                        html: emailWrapper(content, NUDGE_TEMPLATES.community.preheader),
                        replyTo: "sarah@accredipro-certificate.com",
                        type: "transactional",
                    });

                    await prisma.onboardingProgress.update({
                        where: { id: progressRecord.id },
                        data: { communityNudgeSentAt: now },
                    });

                    results.nudgesSent++;
                    results.details.push(`Community nudge → ${email}`);
                } catch (e) {
                    results.errors++;
                }
            }
        }

        console.log(`[Onboarding Nudges] Checked: ${results.checked}, Sent: ${results.nudgesSent}, Errors: ${results.errors}`);

        return NextResponse.json({
            success: true,
            ...results,
        });
    } catch (error) {
        console.error("[Onboarding Nudges] Error:", error);
        return NextResponse.json({ error: "Failed to process nudges" }, { status: 500 });
    }
}
