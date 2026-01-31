import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, personalEmailWrapper } from "@/lib/email";

// Email nudge templates for each onboarding step
const NUDGE_TEMPLATES = {
    profile: {
        delay: 24 * 60 * 60 * 1000, // 24 hours
        subject: "Quick thing, {{firstName}}...",
        content: (firstName: string) => `
Hey ${firstName},

I noticed you haven't finished setting up your profile yet.

Adding a photo and a short bio helps me understand your goals better – and makes our community feel more connected.

Takes 30 seconds: {{PROFILE_LINK}}

– Sarah

P.S. I love seeing who I'm working with! 📸
        `.trim(),
    },
    message: {
        delay: 48 * 60 * 60 * 1000, // 48 hours
        subject: "I'm right here if you need me",
        content: (firstName: string) => `
Hey ${firstName},

Just wanted to remind you – you can message me anytime.

Whether you have questions about the curriculum, need help with a concept, or just want to chat about your goals... I'm here.

{{MESSAGE_LINK}}

Talk soon,
Sarah

P.S. No question is too small! 💬
        `.trim(),
    },
    lesson: {
        delay: 72 * 60 * 60 * 1000, // 72 hours
        subject: "Your first lesson takes 5 mins",
        content: (firstName: string) => `
Hey ${firstName},

I've been checking in and noticed you haven't started your first lesson yet.

I get it – life is busy. But here's the thing: your first lesson literally takes 5 minutes and sets the foundation for everything.

Ready to start? {{LESSON_LINK}}

Rooting for you,
Sarah

P.S. You've got this! 🌟
        `.trim(),
    },
    community: {
        delay: 5 * 24 * 60 * 60 * 1000, // 5 days
        subject: "The community is waiting for you",
        content: (firstName: string) => `
Hey ${firstName},

Quick one – have you introduced yourself in the community yet?

It's a simple post and a great way to connect with others on the same path. Plus, the accountability and support are game-changers.

{{COMMUNITY_LINK}}

See you in there?
Sarah

P.S. Everyone's super welcoming. No pressure, just support! 🤝
        `.trim(),
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
                email: { not: null },
                isFakeProfile: false,
                createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                // Exclude internal emails
                email: { not: { contains: "@accredipro" } },
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
                    const content = NUDGE_TEMPLATES.profile.content(firstName)
                        .replace("{{PROFILE_LINK}}", `<a href="${baseUrl}/settings" style="color: #8B1538; font-weight: bold;">Complete Your Profile →</a>`);

                    await sendEmail({
                        to: email,
                        subject: NUDGE_TEMPLATES.profile.subject.replace("{{firstName}}", firstName),
                        html: personalEmailWrapper(content.replace(/\n/g, "<br>")),
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
                    const content = NUDGE_TEMPLATES.message.content(firstName)
                        .replace("{{MESSAGE_LINK}}", `<a href="${baseUrl}/messages" style="color: #8B1538; font-weight: bold;">Send Me a Message →</a>`);

                    await sendEmail({
                        to: email,
                        subject: NUDGE_TEMPLATES.message.subject,
                        html: personalEmailWrapper(content.replace(/\n/g, "<br>")),
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
                    const content = NUDGE_TEMPLATES.lesson.content(firstName)
                        .replace("{{LESSON_LINK}}", `<a href="${baseUrl}/courses" style="color: #8B1538; font-weight: bold;">Start Your First Lesson →</a>`);

                    await sendEmail({
                        to: email,
                        subject: NUDGE_TEMPLATES.lesson.subject,
                        html: personalEmailWrapper(content.replace(/\n/g, "<br>")),
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
                    const content = NUDGE_TEMPLATES.community.content(firstName)
                        .replace("{{COMMUNITY_LINK}}", `<a href="${baseUrl}/community" style="color: #8B1538; font-weight: bold;">Introduce Yourself →</a>`);

                    await sendEmail({
                        to: email,
                        subject: NUDGE_TEMPLATES.community.subject,
                        html: personalEmailWrapper(content.replace(/\n/g, "<br>")),
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
