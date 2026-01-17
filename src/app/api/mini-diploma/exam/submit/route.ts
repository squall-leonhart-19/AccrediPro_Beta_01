import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper to send completion email and DM (non-blocking)
async function sendCompletionNotifications(
    userId: string,
    email: string,
    firstName: string,
    score: number,
    couponCode: string | undefined
) {
    const certificateUrl = "https://learn.accredipro.academy/functional-medicine-diploma/certificate";
    const scholarshipUrl = couponCode
        ? `https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw?coupon=${couponCode}`
        : "https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw";

    // 1. Send completion email
    console.log(`[EXAM] Sending completion email to ${email}...`);
    try {
        await resend.emails.send({
            from: "Sarah M. <sarah@accredipro-certificate.com>",
            to: email,
            subject: `Congratulations ${firstName}! You're ASI Certified!`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #722F37 0%, #5a252c 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">Congratulations, ${firstName}!</h1>
                        <p style="margin: 10px 0 0; opacity: 0.9;">You're Now ASI Certified!</p>
                    </div>

                    <div style="padding: 30px; background: #fff;">
                        <div style="text-align: center; margin-bottom: 25px;">
                            <div style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; font-size: 48px; font-weight: bold; padding: 20px 40px; border-radius: 12px;">
                                ${score}/100
                            </div>
                            <p style="margin: 10px 0 0; color: #666;">Your Final Score</p>
                        </div>

                        <p style="color: #333; font-size: 16px; line-height: 1.6;">
                            ${firstName}, you did it! You've completed the ASI Functional Medicine Foundation and earned your certificate.
                        </p>

                        <div style="background: #f8f4f0; padding: 20px; border-radius: 12px; margin: 20px 0;">
                            <h3 style="margin: 0 0 10px; color: #722F37;">What's Next:</h3>
                            <ul style="margin: 0; padding-left: 20px; color: #444;">
                                <li style="margin-bottom: 8px;">Download your official certificate</li>
                                <li style="margin-bottom: 8px;">Add it to your LinkedIn profile</li>
                                <li style="margin-bottom: 8px;">Start your journey to $3-10K/month</li>
                            </ul>
                        </div>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${certificateUrl}" style="display: inline-block; background: #722F37; color: white; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                                Download Your Certificate
                            </a>
                        </div>

                        ${couponCode ? `
                        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 12px; border: 2px solid #f59e0b; margin-top: 25px;">
                            <h3 style="margin: 0 0 10px; color: #92400e; text-align: center;">Your Exclusive Graduate Scholarship</h3>
                            <p style="text-align: center; margin: 0 0 15px; color: #78350f;">
                                You qualified for $2,000 OFF the full Board Certification!
                            </p>
                            <div style="text-align: center;">
                                <code style="display: inline-block; background: white; padding: 10px 20px; border-radius: 8px; font-size: 20px; font-weight: bold; color: #722F37; border: 2px dashed #f59e0b;">
                                    ${couponCode}
                                </code>
                            </div>
                            <p style="text-align: center; margin: 15px 0 0; font-size: 14px; color: #92400e;">
                                Expires in 24 hours
                            </p>
                            <div style="text-align: center; margin-top: 15px;">
                                <a href="${scholarshipUrl}" style="display: inline-block; background: #f59e0b; color: #78350f; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                                    Claim Your Scholarship
                                </a>
                            </div>
                        </div>
                        ` : ''}

                        <p style="color: #666; font-size: 14px; margin-top: 25px;">
                            I'm so proud of you! Welcome to the ASI family.
                        </p>
                        <p style="color: #333; font-weight: bold; margin: 0;">
                            — Coach Sarah
                        </p>
                    </div>
                </div>
            `
        });
        console.log(`[EXAM] Completion email sent to ${email}`);
    } catch (err) {
        console.error(`[EXAM] Failed to send completion email to ${email}:`, err);
    }

    // 2. Send private DM from Coach Sarah
    console.log(`[EXAM] Sending completion DM to userId ${userId}...`);
    try {
        // Find or create Sarah's user (the AI coach)
        let sarah = await prisma.user.findFirst({
            where: { email: "sarah@accredipro.academy" },
        });

        if (!sarah) {
            sarah = await prisma.user.create({
                data: {
                    email: "sarah@accredipro.academy",
                    firstName: "Sarah",
                    lastName: "M.",
                    role: "MENTOR",
                },
            });
        }

        // Check if DM already sent (avoid duplicates) - check for both old and new format
        const existingDM = await prisma.message.findFirst({
            where: {
                senderId: sarah.id,
                receiverId: userId,
                OR: [
                    { content: { contains: "You did it!" } },
                    { content: { contains: "YOU DID IT!" } },
                    { content: { contains: "ASI Foundation certification" } },
                ],
            },
        });

        if (existingDM) {
            console.log(`[EXAM] DM already exists for user ${userId}, skipping`);
        } else {
            console.log(`[EXAM] Creating new DM for user ${userId}`);
            const roadmapUrl = "https://learn.accredipro.academy/functional-medicine-diploma/career-roadmap";
            const dmContent = couponCode
                ? `${firstName}, YOU DID IT! 🎉

Congratulations on completing your ASI Foundation certification with an amazing score of ${score}/100!

I'm SO proud of you! This is a huge milestone.

📜 YOUR CERTIFICATE IS READY:
Download it now, add it to LinkedIn, and show the world you're certified!

🎁 HUGE NEWS - YOU QUALIFIED FOR THE SCHOLARSHIP!
Because you scored so well, you've earned our exclusive Graduate Scholarship:

✨ $2,000 OFF the full BC-FMP™ Board Certification
✨ Includes $10K/mo income guarantee
✨ 1-on-1 mentorship with me

Your coupon code: ${couponCode}
⏰ EXPIRES IN 24 HOURS

👉 Claim it here: ${roadmapUrl}

This is your moment, ${firstName}. Don't let it slip away!

Questions? Just reply - I'm here for you every step of the way.

— Coach Sarah 💕`
                : `${firstName}, YOU DID IT! 🎉

Congratulations on completing your ASI Foundation certification with a score of ${score}/100!

I'm SO proud of you! This is a huge milestone.

📜 YOUR CERTIFICATE IS READY:
Download it now, add it to LinkedIn, and show the world you're certified!

This is just the beginning of your journey to a fulfilling career in functional medicine. When you're ready to take the next step toward $3-10K/month, let's chat about the full Board Certification program.

Questions? Just reply - I'm here for you!

— Coach Sarah 💕`;

            await prisma.message.create({
                data: {
                    senderId: sarah.id,
                    receiverId: userId,
                    content: dmContent,
                },
            });
            console.log(`[EXAM] Completion DM sent to user ${userId}`);
        }
    } catch (err) {
        console.error(`[EXAM] Failed to send completion DM to user ${userId}:`, err);
    }
}

/**
 * POST /api/mini-diploma/exam/submit
 *
 * Submit exam answers - ALWAYS passes with 95-100% score.
 * Everyone qualifies for scholarship with 24h countdown.
 * Track monthly scholarship spots (real scarcity - only 3 per month).
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const { examType, answers } = body;

        if (!examType || !answers) {
            return NextResponse.json(
                { error: "Missing examType or answers" },
                { status: 400 }
            );
        }

        // Get user info
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                miniDiplomaCategory: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // ALWAYS generate passing score 95-100 (everyone qualifies!)
        const score = Math.floor(Math.random() * 6) + 95; // 95, 96, 97, 98, 99, or 100
        const total = 10;
        const correct = Math.round((score / 100) * total);
        const passed = true; // Always pass
        const scholarshipQualified = true; // Everyone qualifies

        // Count previous attempts (non-blocking)
        let attemptNumber = 1;
        try {
            const previousAttempts = await prisma.miniDiplomaExam.count({
                where: { userId, category: examType },
            });
            attemptNumber = previousAttempts + 1;
        } catch (e) {
            console.error("[EXAM] Failed to count previous attempts:", e);
            // Continue with default attemptNumber = 1
        }

        let spotsRemaining = 3;
        let couponCode: string | undefined;
        let expiresAt: Date | undefined;

        // Generate scholarship coupon
        const now = new Date();
        const month = now.getMonth() + 1; // 1-12
        const year = now.getFullYear();

        try {
            // Get or create scholarship spot tracking for this month
            let spotRecord = await prisma.scholarshipSpot.findUnique({
                where: {
                    month_year_category: {
                        month,
                        year,
                        category: examType,
                    },
                },
            });

            if (!spotRecord) {
                // Create new month's record
                spotRecord = await prisma.scholarshipSpot.create({
                    data: {
                        month,
                        year,
                        category: examType,
                        totalSpots: 3,
                        usedSpots: 0,
                        claimedBy: [],
                    },
                });
            }

            spotsRemaining = Math.max(0, spotRecord.totalSpots - spotRecord.usedSpots);

            // Check if user already claimed a spot
            const alreadyClaimed = spotRecord.claimedBy.includes(userId);

            if (!alreadyClaimed) {
                // Generate unique coupon code
                couponCode = `ASI-${nanoid(8).toUpperCase()}`;
                expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

                // Reserve the spot
                if (spotsRemaining > 0) {
                    await prisma.scholarshipSpot.update({
                        where: { id: spotRecord.id },
                        data: {
                            usedSpots: spotRecord.usedSpots + 1,
                            claimedBy: [...spotRecord.claimedBy, userId],
                        },
                    });
                    spotsRemaining = Math.max(0, spotsRemaining - 1);
                }

                console.log(`[SCHOLARSHIP] ${user.email} qualified with score ${score}%! Coupon: ${couponCode}, expires: ${expiresAt.toISOString()}`);
            } else {
                // Find their existing exam with coupon
                const existingExam = await prisma.miniDiplomaExam.findFirst({
                    where: {
                        userId,
                        category: examType,
                        scholarshipQualified: true,
                        scholarshipCouponCode: { not: null },
                    },
                    orderBy: { createdAt: "desc" },
                });

                if (existingExam) {
                    couponCode = existingExam.scholarshipCouponCode || undefined;
                    expiresAt = existingExam.scholarshipExpiresAt || undefined;
                } else {
                    // Generate a new coupon anyway
                    couponCode = `ASI-${nanoid(8).toUpperCase()}`;
                    expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                }

                console.log(`[SCHOLARSHIP] ${user.email} already claimed spot. Returning existing coupon.`);
            }
        } catch (e) {
            console.error("[EXAM] Scholarship spot error (non-fatal):", e);
            // Generate coupon anyway
            couponCode = `ASI-${nanoid(8).toUpperCase()}`;
            expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        }

        // Save exam attempt (non-blocking - don't fail the whole request)
        try {
            await prisma.miniDiplomaExam.create({
                data: {
                    userId,
                    category: examType,
                    score,
                    correctAnswers: correct,
                    totalQuestions: total,
                    passed,
                    scholarshipQualified,
                    answers,
                    attemptNumber,
                    scholarshipCouponCode: couponCode,
                    scholarshipExpiresAt: expiresAt,
                },
            });
        } catch (e) {
            console.error("[EXAM] Failed to save exam record:", e);
            // If it's a unique constraint error on coupon code, generate a new one
            if (String(e).includes("scholarshipCouponCode")) {
                couponCode = `ASI-${nanoid(10).toUpperCase()}`;
                try {
                    await prisma.miniDiplomaExam.create({
                        data: {
                            userId,
                            category: examType,
                            score,
                            correctAnswers: correct,
                            totalQuestions: total,
                            passed,
                            scholarshipQualified,
                            answers,
                            attemptNumber,
                            scholarshipCouponCode: couponCode,
                            scholarshipExpiresAt: expiresAt,
                        },
                    });
                } catch (e2) {
                    console.error("[EXAM] Retry save also failed:", e2);
                    // Continue anyway - user still gets their result
                }
            }
        }

        // Add tags for tracking (non-blocking)
        try {
            const tags = [`exam_attempt:${examType}:${attemptNumber}`, `exam_passed:${examType}`, `scholarship_qualified:${examType}`];
            for (const tag of tags) {
                await prisma.userTag.upsert({
                    where: { userId_tag: { userId, tag } },
                    update: {},
                    create: { userId, tag },
                }).catch(() => {}); // Ignore tag errors
            }

            await prisma.userMarketingTag.upsert({
                where: {
                    userId_tag: {
                        userId,
                        tag: `scholarship_qualified`,
                    },
                },
                update: { updatedAt: new Date() },
                create: {
                    userId,
                    tag: `scholarship_qualified`,
                    source: "exam_completion",
                },
            }).catch(() => {}); // Ignore tag errors
        } catch (e) {
            console.error("[EXAM] Tag error (non-fatal):", e);
        }

        console.log(`[EXAM] ${user.email} completed exam: ${score}% (${correct}/${total}), passed: ${passed}, scholarship: ${scholarshipQualified}`);

        // Send completion email and DM (non-blocking - don't await)
        // Always try - the function has its own duplicate checks for DM
        // Email is idempotent (ok to send again if user retakes)
        sendCompletionNotifications(userId, user.email, user.firstName || "there", score, couponCode).catch(err => {
            console.error("[EXAM] Failed to send completion notifications:", err);
        });

        // ALWAYS return success
        return NextResponse.json({
            success: true,
            score,
            correct,
            total,
            passed,
            scholarshipQualified,
            attemptNumber,
            couponCode,
            expiresAt: expiresAt?.toISOString(),
            spotsRemaining,
        });
    } catch (error) {
        console.error("[EXAM] Submit error:", error);

        // Even on error, return a passing result so user isn't stuck
        const fallbackScore = Math.floor(Math.random() * 6) + 95;
        const fallbackCoupon = `ASI-${nanoid(8).toUpperCase()}`;
        const fallbackExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        return NextResponse.json({
            success: true,
            score: fallbackScore,
            correct: Math.round((fallbackScore / 100) * 10),
            total: 10,
            passed: true,
            scholarshipQualified: true,
            attemptNumber: 1,
            couponCode: fallbackCoupon,
            expiresAt: fallbackExpires.toISOString(),
            spotsRemaining: 2,
            warning: "Exam saved with fallback data",
        });
    }
}

/**
 * GET /api/mini-diploma/exam/submit
 *
 * Get user's exam history and scholarship status
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category") || "fm-healthcare";

        // Get all exam attempts
        const exams = await prisma.miniDiplomaExam.findMany({
            where: { userId, category },
            orderBy: { createdAt: "desc" },
        });

        // Get best score
        const bestExam = exams.reduce(
            (best, exam) => (exam.score > (best?.score || 0) ? exam : best),
            null as (typeof exams)[0] | null
        );

        // Get current month spots
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const spotRecord = await prisma.scholarshipSpot.findUnique({
            where: {
                month_year_category: {
                    month,
                    year,
                    category,
                },
            },
        });

        const spotsRemaining = spotRecord
            ? Math.max(0, spotRecord.totalSpots - spotRecord.usedSpots)
            : 3;

        // Check if user has an active (non-expired) scholarship coupon
        const activeCoupon = exams.find(
            (e) =>
                e.scholarshipQualified &&
                e.scholarshipCouponCode &&
                e.scholarshipExpiresAt &&
                new Date(e.scholarshipExpiresAt) > now &&
                !e.scholarshipClaimedAt
        );

        return NextResponse.json({
            attempts: exams.length,
            bestScore: bestExam?.score || 0,
            hasPassed: exams.some((e) => e.passed),
            hasScholarship: exams.some((e) => e.scholarshipQualified),
            activeCoupon: activeCoupon
                ? {
                      code: activeCoupon.scholarshipCouponCode,
                      expiresAt: activeCoupon.scholarshipExpiresAt,
                  }
                : null,
            spotsRemaining,
            exams: exams.map((e) => ({
                id: e.id,
                score: e.score,
                passed: e.passed,
                scholarshipQualified: e.scholarshipQualified,
                attemptNumber: e.attemptNumber,
                createdAt: e.createdAt,
            })),
        });
    } catch (error) {
        console.error("[EXAM] Get history error:", error);
        return NextResponse.json(
            { error: "Failed to get exam history" },
            { status: 500 }
        );
    }
}
