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
    "fm-healthcare": "functional-medicine-mini-diploma", // Healthcare workers variant (same course, separate tracking)
    "gut-health": "gut-health-mini-diploma",
    "hormone-health": "hormone-health-mini-diploma",
    "holistic-nutrition": "holistic-nutrition-mini-diploma",
    "nurse-coach": "nurse-coach-mini-diploma",
    "health-coach": "health-coach-mini-diploma",
    "christian-coaching": "christian-coaching-mini-diploma",
};

// Coach emails by mini diploma type
const COACH_EMAILS: Record<string, string> = {
    "womens-health": "sarah_womenhealth@accredipro-certificate.com",
    "functional-medicine": "sarah_womenhealth@accredipro-certificate.com",
    "fm-healthcare": "sarah_womenhealth@accredipro-certificate.com", // Healthcare workers variant
    "gut-health": "sarah_womenhealth@accredipro-certificate.com",
    "hormone-health": "sarah_womenhealth@accredipro-certificate.com",
    "holistic-nutrition": "sarah_womenhealth@accredipro-certificate.com",
    "nurse-coach": "sarah_womenhealth@accredipro-certificate.com",
    "health-coach": "sarah_womenhealth@accredipro-certificate.com",
    "christian-coaching": "sarah_womenhealth@accredipro-certificate.com",
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
    // fm-healthcare uses the same welcome message as functional-medicine
    "fm-healthcare": {
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
    "christian-coaching": {
        text: (firstName: string) => `Hey ${firstName}! 💕

I'm Sarah, your coach for this entire journey - and I just saw your name come through!

Welcome to your Christian Life Coaching Mini Diploma! This is the start of something special, and I'm SO excited you're here!

Inside your dashboard you'll find:

✨ Your 9 faith-based coaching lessons ready to start
✨ Your Roadmap showing where you're headed
✨ Direct access to message me anytime

I know God led you here for a reason. Something inside you said YES to this calling. Let's discover together how you can turn your faith into a practice that transforms lives!

Hit reply anytime - tell me a little about yourself! What's your testimony? What's calling you to coach?

I'm here for you every step of the way!

Blessings,
Sarah ✨`,
        voiceScript: (firstName: string) => `Hey ${firstName}! It's Sarah. I just saw you signed up for the Christian Life Coaching Mini Diploma and wanted to personally welcome you. I'm so excited you're here! God has a plan for you, and I believe coaching is part of it. Check your dashboard to get started, and message me anytime if you have questions. Talk soon ${firstName}!`,
    },
};

// ============================================================
// RETELL AI INTEGRATION HELPERS
// ============================================================

/**
 * Format phone to E.164 format for Retell
 * Input: "5551234567" or "555-123-4567"
 * Output: "+15551234567"
 */
function formatPhoneE164(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    // If already has country code (11 digits starting with 1), just add +
    if (digits.length === 11 && digits.startsWith('1')) {
        return `+${digits}`;
    }
    // US number (10 digits), add +1
    if (digits.length === 10) {
        return `+1${digits}`;
    }
    // Fallback: return with +1 anyway
    return `+1${digits}`;
}

/**
 * Get display name for certification (used in Retell prompt personalization)
 */
function getCertificationDisplayName(course: string): string {
    const names: Record<string, string> = {
        "womens-health": "Women's Health & Hormones",
        "functional-medicine": "Functional Medicine",
        "fm-healthcare": "Functional Medicine",
        "gut-health": "Gut Health",
        "hormone-health": "Hormone Health",
        "holistic-nutrition": "Holistic Nutrition",
        "nurse-coach": "Nurse Life Coach",
        "health-coach": "Health Coach",
        "christian-coaching": "Christian Life Coaching",
    };
    return names[course] || "Health Certification";
}

/**
 * Calculate lead score for sales prioritization (0-100)
 * Higher score = more ready to buy
 */
function calculateLeadScore(investmentLevel?: string, readiness?: string): number {
    let score = 50; // Base score

    // Investment level scoring
    switch (investmentLevel) {
        case "5k-plus": score += 35; break;
        case "3k-5k": score += 25; break;
        case "1k-3k": score += 15; break;
        case "under-1k": score += 5; break;
    }

    // Readiness scoring
    switch (readiness) {
        case "yes-ready": score += 15; break;
        case "need-time": score += 5; break;
        case "talk-partner": score += 0; break;
    }

    return Math.min(score, 100);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            firstName, lastName, email, phone, course,
            lifeStage, motivation, investment, investmentLevel, readiness, segment,
            // UTM params for attribution (optional)
            utm_source, utm_medium, utm_campaign, utm_content, utm_term
        } = body;

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
            // Use Prisma ORM instead of raw SQL for security (prevents SQL injection)
            const courseData = await prisma.course.findUnique({
                where: { slug: courseSlug },
                select: { id: true },
            });

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
                    // 48-hour access window for urgency (was 7 days)
                    ...(existingUser.userType === "LEAD" && {
                        accessExpiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
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

        // Find the course - use Prisma ORM instead of raw SQL for security
        const newUserCourseData = await prisma.course.findUnique({
            where: { slug: courseSlug },
            select: { id: true },
        });

        if (!newUserCourseData) {
            return NextResponse.json(
                { error: "Course not found. Please try again later." },
                { status: 500 }
            );
        }

        // Calculate 48-hour access expiry (was 7 days)
        const accessExpiresAt = new Date();
        accessExpiresAt.setDate(accessExpiresAt.getDate() + 2);

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
                        courseId: newUserCourseData.id,
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
            // Qualification Data (Q1-Q3)
            `income_goal:${investment}`,
            `time_commitment:${lifeStage}`,
            `motivation:${motivation}`,
            // Q4: Investment Level (budget for program)
            ...(investmentLevel ? [`investment_level:${investmentLevel}`] : []),
            // Q5: Readiness to Start
            ...(readiness ? [`readiness:${readiness}`] : []),
            // Segment tag for different landing page variants (e.g., healthcare-workers, general)
            // Used for GHL workflow routing
            ...(segment ? [`segment:${segment}`] : [])
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
                "christian-coaching": "Christian Life Coaching",
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

        // ============================================================
        // GOHIGHLEVEL + RETELL AI INTEGRATION
        // Enhanced payload with all fields needed for Retell outbound calls
        // ============================================================
        const ghlWebhookUrl = process.env.GHL_WEBHOOK_URL;
        if (ghlWebhookUrl) {
            try {
                // Format phone for Retell (E.164 format: +15551234567)
                const phoneE164 = formatPhoneE164(cleanPhone);

                const ghlPayload = {
                    // === ALWAYS SEND (CORE - used by Retell) ===
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                    email: email.toLowerCase(),
                    phone: phoneE164, // E.164 format for Retell

                    // === CERTIFICATION (for Retell personalization) ===
                    certification: getCertificationDisplayName(course),
                    certification_slug: course,

                    // === SOURCE TRACKING ===
                    source: "mini-diploma",
                    lead_source: course,
                    lead_source_detail: `${course}-mini-diploma`,
                    segment: segment || "general",

                    // === QUALIFICATION DATA (passed to Retell as dynamic vars) ===
                    // These are the 5 questions from the form
                    income_goal: investment || "",           // Q1: What's your income goal?
                    time_commitment: lifeStage || "",        // Q2: How much time can you dedicate?
                    motivation: motivation || "",            // Q3: What's driving you?
                    budget: investmentLevel || "",           // Q4: Investment level (also as "investment_level")
                    investment_level: investmentLevel || "", // Alias for budget
                    readiness: readiness || "",              // Q5: Ready to start?

                    // === LEAD SCORING (for sales prioritization) ===
                    lead_score: calculateLeadScore(investmentLevel, readiness),

                    // === VERCEL TRACKING ===
                    vercel_lead_id: user.id,                 // For Retell function callbacks

                    // === UTM ATTRIBUTION ===
                    utm_source: utm_source || "",
                    utm_medium: utm_medium || "",
                    utm_campaign: utm_campaign || "",
                    utm_content: utm_content || "",
                    utm_term: utm_term || "",

                    // === METADATA ===
                    signup_date: new Date().toISOString(),
                    platform: "accredipro-lms",

                    // === RETELL DEDUPE FLAGS (GHL will populate these) ===
                    // These are set by GHL workflow, not by us:
                    // retell_call_started: false (default)
                    // retell_last_call_at: null (default)
                };

                const ghlResponse = await fetch(ghlWebhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(ghlPayload),
                });

                if (ghlResponse.ok) {
                    console.log(`[OPTIN] ✅ GHL webhook sent for ${email} (phone: ${phoneE164}, score: ${ghlPayload.lead_score})`);
                } else {
                    console.error(`[OPTIN] ⚠️ GHL webhook returned ${ghlResponse.status} for ${email}`);
                }
            } catch (ghlError) {
                console.error("[OPTIN] ❌ GHL webhook failed:", ghlError);
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
