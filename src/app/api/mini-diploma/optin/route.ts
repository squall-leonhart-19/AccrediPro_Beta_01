import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendWomensHealthWelcomeEmail, sendFreebieWelcomeEmail } from "@/lib/email";
import { leadRateLimiter } from "@/lib/redis";
import { verifyEmail } from "@/lib/neverbounce";
import { createMasterclassPod } from "@/lib/masterclass-pod";

// Universal password for all mini diploma leads
const LEAD_PASSWORD = "coach2026";

// Course slugs by mini diploma type
const COURSE_SLUGS: Record<string, string> = {
    "womens-health": "womens-health-mini-diploma",
    "womens-hormone-health": "womens-hormone-health-mini-diploma",
    "functional-medicine": "functional-medicine-mini-diploma",
    "fm-healthcare": "functional-medicine-mini-diploma", // Healthcare workers variant (same course, separate tracking)
    "gut-health": "gut-health-mini-diploma",
    "hormone-health": "hormone-health-mini-diploma",
    "holistic-nutrition": "holistic-nutrition-mini-diploma",
    "nurse-coach": "nurse-coach-mini-diploma",
    "health-coach": "health-coach-mini-diploma",
    "energy-healing": "energy-healing-mini-diploma",
    "christian-coaching": "christian-coaching-mini-diploma",
    "reiki-healing": "reiki-healing-mini-diploma",
    "adhd-coaching": "adhd-coaching-mini-diploma",
    "pet-nutrition": "pet-nutrition-mini-diploma",
    "spiritual-healing": "spiritual-healing-mini-diploma",
    "integrative-health": "integrative-health-mini-diploma",
    "life-coaching": "life-coaching-mini-diploma",
};

// Coach emails by mini diploma type
const COACH_EMAILS: Record<string, string> = {
    "womens-health": "sarah@accredipro-certificate.com",
    "womens-hormone-health": "sarah@accredipro-certificate.com",
    "functional-medicine": "sarah@accredipro-certificate.com",
    "fm-healthcare": "sarah@accredipro-certificate.com", // Healthcare workers variant
    "gut-health": "sarah@accredipro-certificate.com",
    "hormone-health": "sarah@accredipro-certificate.com",
    "holistic-nutrition": "sarah@accredipro-certificate.com",
    "nurse-coach": "sarah@accredipro-certificate.com",
    "health-coach": "sarah@accredipro-certificate.com",
    "energy-healing": "sarah@accredipro-certificate.com",
    "christian-coaching": "sarah@accredipro-certificate.com",
    "reiki-healing": "sarah@accredipro-certificate.com",
    "adhd-coaching": "sarah@accredipro-certificate.com",
    "pet-nutrition": "sarah@accredipro-certificate.com",
    "spiritual-healing": "sarah@accredipro-certificate.com",
    "integrative-health": "sarah@accredipro-certificate.com",
    "life-coaching": "sarah@accredipro-certificate.com",
};

// Welcome messages by mini diploma type
const WELCOME_MESSAGES: Record<string, { text: (firstName: string) => string; voiceScript: (firstName: string) => string }> = {
    "womens-health": {
        text: (firstName: string) => `Hey ${firstName}! 💕

Welcome to your Women's Health Mini Diploma! I'm Sarah, and I'll be guiding you through this journey.

I'm SO excited you're here to learn about women's hormones and health! This is going to change how you understand your body.

Here's what's waiting for you:

✨ 3 focused lessons (~25 minutes total)
✨ Everything from hormones to nutrition to life stages
✨ A certificate when you complete!

The lessons are designed like a chat with me - you'll get to respond and engage as we go. It makes learning so much more fun!

I've helped hundreds of women understand their bodies better, and I can't wait to share this knowledge with you.

Ready to start? Head to Lesson 1 and let's dive in!

Talk soon,
Sarah 🌸`,
        voiceScript: (firstName: string) => `Hey ${firstName}! It's Sarah! Welcome to your Women's Health Mini Diploma! I'm so excited you're here. Over the next 3 lessons, I'm going to teach you everything about women's hormones and health. Head to Lesson 1 when you're ready and let's get started! Talk soon!`,
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

✨ Your 3 faith-based coaching lessons ready to start
✨ Your Roadmap showing where you're headed
✨ Direct access to message me anytime

I know God led you here for a reason. Something inside you said YES to this calling. Let's discover together how you can turn your faith into a practice that transforms lives!

Hit reply anytime - tell me a little about yourself! What's your testimony? What's calling you to coach?

I'm here for you every step of the way!

Blessings,
Sarah ✨`,
        voiceScript: (firstName: string) => `Hey ${firstName}! It's Sarah. I just saw you signed up for the Christian Life Coaching Mini Diploma and wanted to personally welcome you. I'm so excited you're here! God has a plan for you, and I believe coaching is part of it. Check your dashboard to get started, and message me anytime if you have questions. Talk soon ${firstName}!`,
    },
    "energy-healing": {
        text: (firstName: string) => `Hey ${firstName}! 💕

I'm Sarah, your coach for this entire journey - and I just saw your name come through!

Welcome to your Energy Healing Mini Diploma! This is the start of something truly transformative, and I'm SO excited you're here!

Inside your dashboard you'll find:

✨ Your 3 powerful lessons on energy healing ready to start
✨ Your Roadmap showing where you're headed
✨ Direct access to message me anytime

I know something called you here for a reason. You've felt the pull toward working with energy and helping others heal. Let's discover together how you can channel that gift into a meaningful practice!

Hit reply anytime - tell me a little about yourself! What drew you to energy healing? What's calling you to this work?

I'm here for you every step of the way!

With light,
Sarah ✨`,
        voiceScript: (firstName: string) => `Hey ${firstName}! It's Sarah. I just saw you signed up for the Energy Healing Mini Diploma and wanted to personally welcome you. I'm so excited you're here! You have a gift for healing, and I can't wait to help you develop it. Check your dashboard to get started, and message me anytime if you have questions. Talk soon ${firstName}!`,
    },
    "reiki-healing": {
        text: (firstName: string) => `Hey ${firstName}! 💕

I'm Sarah, your coach for this entire journey - and I just saw your name come through!

Welcome to your Reiki Healing Mini Diploma! This is the start of something truly beautiful, and I'm SO excited you're here!

Inside your dashboard you'll find:

✨ Your 3 transformative lessons on Reiki healing ready to start
✨ Your Roadmap showing where you're headed
✨ Direct access to message me anytime

I know something called you here for a reason. You've felt the pull toward channeling healing energy. Let's discover together how you can develop that gift into a meaningful practice!

Hit reply anytime - tell me a little about yourself! What drew you to Reiki? Have you experienced it before?

I'm here for you every step of the way!

With light,
Sarah ✨`,
        voiceScript: (firstName: string) => `Hey ${firstName}! It's Sarah. I just saw you signed up for the Reiki Healing Mini Diploma and wanted to personally welcome you. I'm so excited you're here! Reiki is such a beautiful healing art, and I can't wait to help you learn to channel it. Check your dashboard to get started, and message me anytime if you have questions. Talk soon ${firstName}!`,
    },
    "adhd-coaching": {
        text: (firstName: string) => `Hey ${firstName}! 💕

I'm Sarah, your coach for this entire journey - and I just saw your name come through!

Welcome to your ADHD Coaching Mini Diploma! This is the start of something truly meaningful, and I'm SO excited you're here!

Inside your dashboard you'll find:

✨ Your 3 transformative lessons on ADHD coaching ready to start
✨ Your Roadmap showing where you're headed
✨ Direct access to message me anytime

I know the ADHD brain is beautiful and complex - and you're here because you want to help others thrive with it. Whether you have ADHD yourself or love someone who does, this work matters!

Hit reply anytime - tell me a little about yourself! What's your connection to ADHD? What's calling you to coach?

I'm here for you every step of the way!

With focus and care,
Sarah ✨`,
        voiceScript: (firstName: string) => `Hey ${firstName}! It's Sarah. I just saw you signed up for the ADHD Coaching Mini Diploma and wanted to personally welcome you. I'm so excited you're here! Understanding the ADHD brain is such powerful work, and I can't wait to help you learn to coach others. Check your dashboard to get started, and message me anytime if you have questions. Talk soon ${firstName}!`,
    },
    "pet-nutrition": {
        text: (firstName: string) => `Hey ${firstName}! 💕

I'm Sarah, your coach for this entire journey - and I just saw your name come through!

Welcome to your Pet Nutrition & Wellness Mini Diploma! This is the start of something truly special, and I'm SO excited you're here!

Inside your dashboard you'll find:

✨ Your 3 comprehensive lessons on pet nutrition ready to start
✨ Your Roadmap showing where you're headed
✨ Direct access to message me anytime

I know how much you love your fur babies - and you're here because you want to help them (and other pets!) thrive through proper nutrition. That passion is exactly what makes great pet nutrition specialists!

Hit reply anytime - tell me a little about yourself! What pets do you have? What's calling you to learn about pet nutrition?

I'm here for you every step of the way!

With tail wags,
Sarah ✨`,
        voiceScript: (firstName: string) => `Hey ${firstName}! It's Sarah. I just saw you signed up for the Pet Nutrition & Wellness Mini Diploma and wanted to personally welcome you. I'm so excited you're here! Helping pets thrive through nutrition is such rewarding work, and I can't wait to help you learn these skills. Check your dashboard to get started, and message me anytime if you have questions. Talk soon ${firstName}!`,
    },
    "spiritual-healing": {
        text: (firstName: string) => `Hey ${firstName}! 💕

I'm Sarah, your coach for this entire journey - and I just saw your name come through!

Welcome to your Spiritual Healing Mini Diploma! This is the start of something beautiful, and I'm SO excited you're here!

Inside your dashboard you'll find:

✨ Your 3 transformative lessons on spiritual healing ready to start
✨ Your Roadmap showing where you're headed
✨ Direct access to message me anytime

I know something called you here for a reason. You felt the pull toward healing work. Let's discover together how you can channel that gift into a practice that transforms lives!

Hit reply anytime - tell me a little about yourself! What's your spiritual journey been like? What's calling you to this work?

I'm here for you every step of the way!

With light,
Sarah ✨`,
        voiceScript: (firstName: string) => `Hey ${firstName}! It's Sarah. I just saw you signed up for the Spiritual Healing Mini Diploma and wanted to personally welcome you. I'm so excited you're here! You have a gift for healing, and I can't wait to help you develop it. Check your dashboard to get started, and message me anytime if you have questions. Talk soon ${firstName}!`,
    },
    "integrative-health": {
        text: (firstName: string) => `Hey ${firstName}! \ud83d\udc95

I'm Sarah, your coach for this entire journey - and I just saw your name come through!

Welcome to your Integrative Health Mini Diploma! This is the start of something truly special, and I'm SO excited you're here!

Inside your dashboard you'll find:

\u2728 Your 3 transformative lessons on integrative health ready to start
\u2728 Your Roadmap showing where you're headed
\u2728 Direct access to message me anytime

You're joining a growing movement of practitioners who bridge conventional and holistic approaches. The world needs more integrative health professionals, and I know you're going to be amazing!

Hit reply anytime - tell me a little about yourself! What drew you to integrative health?

I'm here for you every step of the way!

With warmth,
Sarah \u2728`,
        voiceScript: (firstName: string) => `Hey ${firstName}! It's Sarah. I just saw you signed up for the Integrative Health Mini Diploma and wanted to personally welcome you. I'm so excited you're here! Bridging conventional and holistic health is such important work, and I can't wait to help you master it. Check your dashboard to get started, and message me anytime if you have questions. Talk soon ${firstName}!`,
    },
    "life-coaching": {
        text: (firstName: string) => `Hey ${firstName}! \ud83d\udc95

I'm Sarah, your coach for this entire journey - and I just saw your name come through!

Welcome to your Life Coaching Mini Diploma! This is the start of something incredible, and I'm SO excited you're here!

Inside your dashboard you'll find:

\u2728 Your 3 transformative lessons on life coaching ready to start
\u2728 Your Roadmap showing where you're headed
\u2728 Direct access to message me anytime

Life coaching is one of the most fulfilling careers you can choose. You get to help people transform their lives every day, and I can't wait to show you exactly how!

Hit reply anytime - tell me a little about yourself! What inspired you to explore life coaching?

I'm here for you every step of the way!

With excitement,
Sarah \u2728`,
        voiceScript: (firstName: string) => `Hey ${firstName}! It's Sarah. I just saw you signed up for the Life Coaching Mini Diploma and wanted to personally welcome you. I'm so excited you're here! Life coaching is such rewarding work, and I can't wait to help you develop your skills. Check your dashboard to get started, and message me anytime if you have questions. Talk soon ${firstName}!`,
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
        "womens-hormone-health": "Women's Hormone Health",
        "functional-medicine": "Functional Medicine",
        "fm-healthcare": "Functional Medicine",
        "gut-health": "Gut Health",
        "hormone-health": "Hormone Health",
        "holistic-nutrition": "Holistic Nutrition",
        "nurse-coach": "Nurse Life Coach",
        "health-coach": "Health Coach",
        "energy-healing": "Energy Healing",
        "christian-coaching": "Christian Coaching",
        "reiki-healing": "Reiki Healing",
        "adhd-coaching": "ADHD Coaching",
        "pet-nutrition": "Pet Nutrition & Wellness",
        "spiritual-healing": "Spiritual Healing",
        "integrative-health": "Integrative Health",
        "life-coaching": "Life Coaching",
    };
    return names[course] || "Health Certification";
}

/**
 * Calculate lead score for sales prioritization (0-185)
 * Higher score = more ready to buy
 * Based on 8-question qualification form
 */
function calculateLeadScore(data: {
    background?: string;
    motivation?: string;
    workCost?: string;
    holdingBack?: string;
    successGoal?: string;
    timeAvailable?: string;
    investmentRange?: string;
    readiness?: string;
}): number {
    let score = 0;

    // Q1: Background (healthcare = best fit)
    switch (data.background) {
        case "healthcare": score += 30; break;
        case "wellness": score += 25; break;
        case "educator": score += 20; break;
        case "transition": score += 15; break;
        case "other": score += 10; break;
    }

    // Q2: Motivation (help-heal/own-journey = strongest intent)
    switch (data.motivation) {
        case "help-heal": score += 20; break;
        case "own-journey": score += 20; break;
        case "burnout": score += 15; break;
        case "flexibility": score += 15; break;
        case "new-chapter": score += 15; break;
    }

    // Q3: Work Cost (any selection = emotional pain, all worth 10)
    if (data.workCost) score += 10;

    // Q4: Holding Back (ready = no objections = hot)
    switch (data.holdingBack) {
        case "ready": score += 25; break;
        case "investment-concern": score += 15; break;
        case "self-doubt": score += 10; break;
        case "tried-before": score += 10; break;
        case "unsure-where": score += 10; break;
    }

    // Q5: Success Goal (ambition level)
    switch (data.successGoal) {
        case "full-practice": score += 25; break;
        case "replace-income": score += 20; break;
        case "side-income": score += 15; break;
    }

    // Q6: Time Available
    switch (data.timeAvailable) {
        case "priority": score += 20; break;
        case "part-time": score += 15; break;
        case "few-hours": score += 10; break;
    }

    // Q7: Investment Range (💰 MONEY SIGNAL - biggest weight)
    switch (data.investmentRange) {
        case "5k-plus": score += 30; break;
        case "3k-5k": score += 25; break;
        case "1k-3k": score += 15; break;
    }

    // Q8: Readiness (closing signal)
    switch (data.readiness) {
        case "ready": score += 25; break;
        case "need-time": score += 10; break;
        case "talk-partner": score += 5; break;
    }

    return score; // Max: 185
}

/**
 * Get lead tier based on score
 */
function getLeadTier(score: number): "hot" | "warm" | "cold" {
    if (score >= 130) return "hot";
    if (score >= 80) return "warm";
    return "cold";
}

export async function POST(request: NextRequest) {
    try {
        // Rate limit: 3 submissions per hour per IP
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        const { success: rateLimitOk } = await leadRateLimiter.limit(ip);
        if (!rateLimitOk) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        const body = await request.json();
        const {
            firstName, lastName, email, phone, course,
            // 8-Question Qualification Form Fields
            background,        // Q1: Background (healthcare, wellness, educator, transition, other)
            motivation,        // Q2: Why Functional Medicine (help-heal, own-journey, burnout, flexibility, new-chapter)
            workCost,          // Q3: What it's costing you (missing-family, exhausted, working-holidays, etc.)
            holdingBack,       // Q4: What's been in the way (unsure-where, tried-before, self-doubt, investment-concern, ready)
            successGoal,       // Q5: Success goal (side-income, replace-income, full-practice)
            timeAvailable,     // Q6: Time available (few-hours, part-time, priority)
            investmentRange,   // Q7: Investment range (1k-3k, 3k-5k, 5k-plus)
            readiness,         // Q8: Readiness (ready, need-time, talk-partner)
            // Legacy field aliases (for backward compatibility)
            lifeStage,         // Old name for timeAvailable
            investment,        // Old name for successGoal
            investmentLevel,   // Old name for investmentRange
            segment,
            formVariant,       // A/B testing variant
            leadScore: providedLeadScore, // Optional pre-calculated score from frontend
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

        // Verify email with NeverBounce (rejects invalid/disposable, allows valid/catchall/unknown)
        const emailVerification = await verifyEmail(email);
        if (!emailVerification.isValid) {
            console.log(`[OPTIN] ❌ NeverBounce rejected ${email}: ${emailVerification.result}`);
            return NextResponse.json(
                {
                    error: emailVerification.reason || "Please enter a valid email address.",
                    suggestedEmail: emailVerification.suggestedEmail,
                },
                { status: 400 }
            );
        }
        console.log(`[OPTIN] ✅ NeverBounce: ${email} → ${emailVerification.result}`);

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
                formVariant: formVariant || "A", // A/B testing variant
                enrollments: {
                    create: {
                        courseId: newUserCourseData.id,
                        status: "ACTIVE",
                    },
                },
            },
            select: { id: true },
        });

        // ============================================================
        // LEAD SCORING + QUALIFICATION TAGS
        // ============================================================

        // Normalize field names (handle both old and new form versions)
        const qualData = {
            background: background || "",
            motivation: motivation || "",
            workCost: workCost || "",
            holdingBack: holdingBack || "",
            successGoal: successGoal || investment || "",         // Fallback to legacy field
            timeAvailable: timeAvailable || lifeStage || "",     // Fallback to legacy field
            investmentRange: investmentRange || investmentLevel || "", // Fallback to legacy field
            readiness: readiness || "",
        };

        // Calculate lead score
        const leadScore = calculateLeadScore(qualData);
        const leadTier = getLeadTier(leadScore);

        // Build qualification tags
        const categorySlug = course.replace(/-/g, "_"); // womens-health -> womens_health
        const userTags: string[] = [
            // Core tracking tags
            "mini_diploma_started",
            `mini_diploma_${categorySlug}`,
            `mini_diploma_category:${course}`,
            `lead:${course}-mini-diploma`,
            "source:mini-diploma",
            `source:${course}`,

            // Lead scoring tags
            `lead_score:${leadScore}`,
            `lead_tier:${leadTier}`,

            // Q1: Background (qualification:background:healthcare, etc.)
            ...(qualData.background ? [`qualification:background:${qualData.background}`] : []),

            // Q2: Motivation
            ...(qualData.motivation ? [`qualification:motivation:${qualData.motivation}`] : []),

            // Q3: Work Cost (emotional pain point)
            ...(qualData.workCost ? [`qualification:work-cost:${qualData.workCost}`] : []),

            // Q4: Holding Back
            ...(qualData.holdingBack ? [`qualification:holding-back:${qualData.holdingBack}`] : []),

            // Q5: Success Goal
            ...(qualData.successGoal ? [`qualification:success-goal:${qualData.successGoal}`] : []),

            // Q6: Time Available
            ...(qualData.timeAvailable ? [`qualification:time:${qualData.timeAvailable}`] : []),

            // Q7: Investment Range (💰 key sales signal)
            ...(qualData.investmentRange ? [`qualification:investment:${qualData.investmentRange}`] : []),

            // Q8: Readiness
            ...(qualData.readiness ? [`qualification:readiness:${qualData.readiness}`] : []),

            // Segment tag for different landing page variants
            ...(segment ? [`segment:${segment}`] : [])
        ];

        // Create all tags
        for (const tag of userTags) {
            await prisma.userTag.create({
                data: { userId: user.id, tag },
            });
        }
        console.log(`🏷️ Lead Score: ${leadScore} (${leadTier}) | Tags created for ${user.id}: ${userTags.length} tags`);

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
                "womens-hormone-health": "Women's Hormone Health",
                "functional-medicine": "Functional Medicine",
                "gut-health": "Gut Health",
                "hormone-health": "Hormone Health",
                "holistic-nutrition": "Holistic Nutrition",
                "nurse-coach": "Nurse Life Coach",
                "health-coach": "Health Coach",
                "energy-healing": "Energy Healing",
                "christian-coaching": "Christian Coaching",
                "reiki-healing": "Reiki Healing",
                "adhd-coaching": "ADHD Coaching",
                "pet-nutrition": "Pet Nutrition & Wellness",
                "spiritual-healing": "Spiritual Healing",
                "integrative-health": "Integrative Health",
                "life-coaching": "Life Coaching",
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
                    // All 8 questions from the form
                    background: qualData.background,           // Q1: Background
                    motivation: qualData.motivation,           // Q2: Motivation
                    work_cost: qualData.workCost,              // Q3: Work cost
                    holding_back: qualData.holdingBack,        // Q4: Holding back
                    success_goal: qualData.successGoal,        // Q5: Success goal
                    time_commitment: qualData.timeAvailable,   // Q6: Time available
                    budget: qualData.investmentRange,          // Q7: Investment range
                    investment_level: qualData.investmentRange, // Alias for budget
                    readiness: qualData.readiness,             // Q8: Ready to start?

                    // === LEAD SCORING (for sales prioritization) ===
                    lead_score: leadScore,
                    lead_tier: leadTier,

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

        // Create Masterclass Pod for 30-day nurture sequence
        // Pod starts immediately with Day 1 messages
        try {
            const podResult = await createMasterclassPod(user.id, course);
            if (podResult.success) {
                console.log(`[OPTIN] ✅ Created masterclass pod ${podResult.podId} for ${email}`);
            } else {
                console.log(`[OPTIN] ⚠️ Masterclass pod not created: ${podResult.error}`);
            }
        } catch (podError) {
            console.error("[OPTIN] ❌ Masterclass pod creation failed:", podError);
            // Don't fail registration if pod fails
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
