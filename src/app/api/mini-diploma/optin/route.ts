import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendWomensHealthWelcomeEmail, sendFreebieWelcomeEmail } from "@/lib/email";

// Universal password for all mini diploma leads
const LEAD_PASSWORD = "coach2026";

// Course slugs by mini diploma type
const COURSE_SLUGS: Record<string, string> = {
    "womens-health": "womens-health-mini-diploma",
    "functional-medicine": "functional-medicine-mini-diploma",
    "gut-health": "gut-health-mini-diploma",
    "hormone-health": "hormone-health-mini-diploma",
    "holistic-nutrition": "holistic-nutrition-mini-diploma",
    "nurse-coach": "nurse-coach-mini-diploma",
    "health-coach": "health-coach-mini-diploma",
};

// Coach emails by mini diploma type
const COACH_EMAILS: Record<string, string> = {
    "womens-health": "sarah_womenhealth@accredipro-certificate.com",
    "functional-medicine": "sarah_womenhealth@accredipro-certificate.com",
    "gut-health": "sarah_womenhealth@accredipro-certificate.com",
    "hormone-health": "sarah_womenhealth@accredipro-certificate.com",
    "holistic-nutrition": "sarah_womenhealth@accredipro-certificate.com",
    "nurse-coach": "sarah_womenhealth@accredipro-certificate.com",
    "health-coach": "sarah_womenhealth@accredipro-certificate.com",
};

// Welcome messages by mini diploma type
const WELCOME_MESSAGES: Record<string, { text: (firstName: string) => string; voiceScript: (firstName: string) => string }> = {
    "womens-health": {
        text: (firstName: string) => `Hey ${firstName}! 💕

Welcome to your Women's Health Mini Diploma! I'm Sarah, and I'll be guiding you through this journey.

I'm SO excited you're here to learn about women's hormones and health! This is going to change how you understand your body.

Here's what's waiting for you:

✨ 9 interactive lessons (about 60 minutes total)
✨ Everything from hormones to nutrition to life stages
✨ A certificate when you complete!

The lessons are designed like a chat with me - you'll get to respond and engage as we go. It makes learning so much more fun!

I've helped hundreds of women understand their bodies better, and I can't wait to share this knowledge with you.

Ready to start? Head to Lesson 1 and let's dive in!

Talk soon,
Sarah 🌸`,
        voiceScript: (firstName: string) => `Hey ${firstName}! It's Sarah! Welcome to your Women's Health Mini Diploma! I'm so excited you're here. Over the next 9 lessons, I'm going to teach you everything about women's hormones and health. Head to Lesson 1 when you're ready and let's get started! Talk soon!`,
    },
    "functional-medicine": {
        text: (firstName: string) => `Hey ${firstName}! 💕

I'm Sarah, your coach for this entire journey - and I just saw your name come through!

Welcome! This is the start of something special, and I'm SO excited you're here!

Inside your dashboard you'll find:

✨ Your certification ready to start
✨ Your Roadmap showing where you're headed
✨ Direct access to message me anytime

I know you might be wondering if this is really for you... maybe feeling a mix of excited and nervous? I felt the exact same way when I started!

But here's what I know: you signed up for a reason. Something inside you said YES to this. Let's find out what that is together.

Hit reply anytime - tell me a little about yourself! What brought you here? What's your "why"?

I'm here for you every step of the way!

Talk soon,
Sarah ✨`,
        voiceScript: (firstName: string) => `Hey ${firstName}! It's Sarah. I just saw you signed up and wanted to personally welcome you. I'm so excited you're here! Check your dashboard to get started, and message me anytime if you have questions - - Talk soon ${firstName}!.`,
    },
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, phone, course, lifeStage, motivation, investment } = body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !course) {
            return NextResponse.json(
                { error: "All fields including phone are required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Please enter a valid email address" },
                { status: 400 }
            );
        }

        // Validate phone format (Basic +1 check)
        // We strip non-digits and check length
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
            return NextResponse.json(
                { error: "Please enter a valid US phone number" },
                { status: 400 }
            );
        }

        // Get course slug
        const courseSlug = COURSE_SLUGS[course];
        if (!courseSlug) {
            return NextResponse.json(
                { error: "Invalid course selection" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: { id: true, userType: true, email: true }
        });

        if (existingUser) {
            // Check if already enrolled in this course
            const existingEnrollment = await prisma.enrollment.findFirst({
                where: {
                    userId: existingUser.id,
                    course: { slug: courseSlug },
                },
            });

            if (existingEnrollment) {
                return NextResponse.json(
                    { error: "You're already enrolled in this mini diploma. Please log in to continue." },
                    { status: 400 }
                );
            }

            // User exists but not enrolled - enroll them
            const courseResults = await prisma.$queryRaw<any[]>`
                SELECT id FROM "Course" WHERE slug = ${courseSlug} LIMIT 1
            `;
            const courseData = courseResults[0];

            if (!courseData) {
                return NextResponse.json(
                    { error: "Course not found. Please try again later." },
                    { status: 500 }
                );
            }

            // Create enrollment
            await prisma.enrollment.create({
                data: {
                    userId: existingUser.id,
                    courseId: courseData.id,
                    status: "ACTIVE",
                },
            });

            await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    miniDiplomaCategory: course,
                    miniDiplomaOptinAt: new Date(),
                    // Don't override accessExpiresAt if they're already a paid user
                    ...(existingUser.userType === "LEAD" && {
                        accessExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    }),
                },
            });

            return NextResponse.json({
                success: true,
                message: "Enrolled successfully",
                isExistingUser: true,
            });
        }

        // Create new user
        const passwordHash = await bcrypt.hash(LEAD_PASSWORD, 10);

        // Find the course
        const courseResults = await prisma.$queryRaw<any[]>`
            SELECT id FROM "Course" WHERE slug = ${courseSlug} LIMIT 1
        `;
        const courseData = courseResults[0];

        if (!courseData) {
            return NextResponse.json(
                { error: "Course not found. Please try again later." },
                { status: 500 }
            );
        }

        // Calculate 7-day access expiry
        const accessExpiresAt = new Date();
        accessExpiresAt.setDate(accessExpiresAt.getDate() + 7);

        // Find the appropriate coach for this mini diploma
        const coachEmail = COACH_EMAILS[course];
        const coach = coachEmail ? await prisma.user.findUnique({
            where: { email: coachEmail },
            select: { id: true },
        }) : null;

        // Create user and enrollment in transaction
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                passwordHash,
                phone: cleanPhone, // Normalized: digits only
                role: "STUDENT",
                userType: "LEAD",
                isActive: true,
                leadSource: "mini-diploma",
                leadSourceDetail: course,
                miniDiplomaCategory: course,
                miniDiplomaOptinAt: new Date(),
                accessExpiresAt,
                assignedCoachId: coach?.id || null,
                enrollments: {
                    create: {
                        courseId: courseData.id,
                        status: "ACTIVE",
                    },
                },
            },
            select: { id: true },
        });

        // Add UserTags for mini diploma tracking
        // Format: mini_diploma_{category} (e.g., mini_diploma_womens_health, mini_diploma_gut_health)
        const categorySlug = course.replace(/-/g, "_"); // womens-health -> womens_health
        const userTags = [
            "mini_diploma_started",
            `mini_diploma_${categorySlug}`, // e.g., mini_diploma_womens_health
            `mini_diploma_category:${course}`,
            `lead:${course}-mini-diploma`, // Specific to mini diploma (not purchases)
            "source:mini-diploma",
            `source:${course}`,
            // Qualification Data (Questions: income_goal, time_commitment, motivation)
            `income_goal:${investment}`,
            `time_commitment:${lifeStage}`,
            `motivation:${motivation}`
        ];
        for (const tag of userTags) {
            await prisma.userTag.create({
                data: { userId: user.id, tag },
            });
        }
        console.log(`🏷️ Created mini diploma UserTags for ${user.id}: ${userTags.join(", ")}`);

        // Send welcome message from the appropriate Sarah coach
        if (coach) {
            const welcomeContent = WELCOME_MESSAGES[course];
            if (welcomeContent) {
                try {
                    // Create text welcome message
                    await prisma.message.create({
                        data: {
                            senderId: coach.id,
                            receiverId: user.id,
                            content: welcomeContent.text(firstName.trim()),
                            messageType: "DIRECT",
                        },
                    });

                    // Create voice message with static audio file (instant - no cron needed)
                    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://learn.accredipro.academy";
                    const staticAudioUrl = `${BASE_URL}/audio/welcome-mini-diploma.mp3`;

                    await prisma.message.create({
                        data: {
                            senderId: coach.id,
                            receiverId: user.id,
                            content: `🎤 Voice message from Sarah`,
                            attachmentUrl: staticAudioUrl,
                            attachmentType: "voice",
                            attachmentName: "Welcome from Sarah",
                            voiceDuration: 15,
                            messageType: "DIRECT",
                        },
                    });

                    // Create notification
                    await prisma.notification.create({
                        data: {
                            userId: user.id,
                            type: "NEW_MESSAGE",
                            title: "Welcome message from Sarah! 🎤",
                            message: "Sarah has sent you a personal welcome message",
                            data: { senderId: coach.id },
                        },
                    });
                } catch (msgError) {
                    console.error("Failed to send welcome message:", msgError);
                    // Don't fail the registration if messaging fails
                }
            }
        }

        // Send welcome email with login details - niche-specific
        try {
            const nicheNames: Record<string, string> = {
                "womens-health": "Women's Health & Hormones",
                "functional-medicine": "Functional Medicine",
                "gut-health": "Gut Health",
                "hormone-health": "Hormone Health",
                "holistic-nutrition": "Holistic Nutrition",
                "nurse-coach": "Nurse Life Coach",
                "health-coach": "Health Coach",
            };
            const nicheName = nicheNames[course] || course;

            if (course === "womens-health") {
                await sendWomensHealthWelcomeEmail({
                    to: email.toLowerCase(),
                    firstName: firstName.trim(),
                    isExistingUser: false,
                    password: LEAD_PASSWORD,
                });
            } else {
                // Send generic niche welcome email - customize per niche
                await sendFreebieWelcomeEmail({
                    to: email.toLowerCase(),
                    firstName: firstName.trim(),
                    isExistingUser: false,
                    nicheName,
                    password: LEAD_PASSWORD,
                    diplomaSlug: courseSlug,
                });
            }
            console.log(`[OPTIN] Welcome email sent to ${email} for ${nicheName}`);
        } catch (emailError) {
            console.error("[OPTIN] Failed to send welcome email:", emailError);
            // Don't fail registration if email fails
        }

        // GoHighLevel Webhook Integration
        // Send lead data to GHL for SMS follow-ups
        const ghlWebhookUrl = process.env.GHL_WEBHOOK_URL;
        if (ghlWebhookUrl) {
            try {
                const ghlPayload = {
                    // Contact Info
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.toLowerCase(),
                    phone: cleanPhone, // Normalized: digits only
                    // Source Tracking
                    source: "mini-diploma",
                    lead_source: course, // e.g., "functional-medicine"
                    lead_source_detail: `${course}-mini-diploma`,
                    // Qualification Answers
                    life_stage: lifeStage || "",
                    motivation: motivation || "",
                    investment: investment || "",
                    // Metadata
                    signup_date: new Date().toISOString(),
                    platform: "accredipro-lms",
                };

                await fetch(ghlWebhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(ghlPayload),
                });
                console.log(`[OPTIN] GHL webhook sent for ${email}`);
            } catch (ghlError) {
                console.error("[OPTIN] GHL webhook failed:", ghlError);
                // Don't fail registration if GHL fails
            }
        }

        // TODO: Track in analytics/Facebook CAPI
        // await trackOptIn(email, course);

        return NextResponse.json({
            success: true,
            message: "Account created successfully",
            userId: user.id,
        });
    } catch (error: any) {
        console.error("Mini diploma optin error:", error);

        // Handle unique constraint violation (email already exists)
        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "This email is already registered. Please log in instead." },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
