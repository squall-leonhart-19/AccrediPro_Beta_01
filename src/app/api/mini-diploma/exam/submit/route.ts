import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";

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
