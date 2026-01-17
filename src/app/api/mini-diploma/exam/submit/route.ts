import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FM_EXAM_QUESTIONS, calculateExamScore } from "@/lib/fm-exam-questions";
import { nanoid } from "nanoid";

/**
 * POST /api/mini-diploma/exam/submit
 *
 * Submit exam answers and calculate score.
 * If score >= 95%, qualify for scholarship with 24h countdown.
 * Track monthly scholarship spots (real scarcity - only 3 per month).
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await request.json();
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

        // Calculate the score
        const result = calculateExamScore(answers);
        const { score, correct, total, passed, scholarshipQualified } = result;

        // Count previous attempts
        const previousAttempts = await prisma.miniDiplomaExam.count({
            where: { userId, category: examType },
        });

        const attemptNumber = previousAttempts + 1;

        // Prepare exam record data
        const examData: {
            userId: string;
            category: string;
            score: number;
            correctAnswers: number;
            totalQuestions: number;
            passed: boolean;
            scholarshipQualified: boolean;
            answers: typeof answers;
            attemptNumber: number;
            scholarshipCouponCode?: string;
            scholarshipExpiresAt?: Date;
        } = {
            userId,
            category: examType,
            score,
            correctAnswers: correct,
            totalQuestions: total,
            passed,
            scholarshipQualified,
            answers,
            attemptNumber,
        };

        let spotsRemaining = 0;
        let couponCode: string | undefined;
        let expiresAt: Date | undefined;

        // If qualified for scholarship, check spots and create coupon
        if (scholarshipQualified) {
            const now = new Date();
            const month = now.getMonth() + 1; // 1-12
            const year = now.getFullYear();

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

            spotsRemaining = spotRecord.totalSpots - spotRecord.usedSpots;

            // Check if user already claimed a spot
            const alreadyClaimed = spotRecord.claimedBy.includes(userId);

            if (!alreadyClaimed && spotsRemaining > 0) {
                // Generate unique coupon code
                couponCode = `ASI-${nanoid(8).toUpperCase()}`;
                expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

                examData.scholarshipCouponCode = couponCode;
                examData.scholarshipExpiresAt = expiresAt;

                // Reserve the spot (will be "used" when they actually purchase)
                await prisma.scholarshipSpot.update({
                    where: { id: spotRecord.id },
                    data: {
                        usedSpots: spotRecord.usedSpots + 1,
                        claimedBy: [...spotRecord.claimedBy, userId],
                    },
                });

                spotsRemaining = spotsRemaining - 1;

                console.log(`[SCHOLARSHIP] ${user.email} qualified with score ${score}%! Coupon: ${couponCode}, expires: ${expiresAt.toISOString()}`);
            } else if (alreadyClaimed) {
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
                }

                console.log(`[SCHOLARSHIP] ${user.email} already claimed spot. Returning existing coupon.`);
            } else {
                console.log(`[SCHOLARSHIP] ${user.email} qualified but no spots remaining this month.`);
            }
        }

        // Save exam attempt
        await prisma.miniDiplomaExam.create({
            data: examData,
        });

        // Add tags for tracking
        const tags = [`exam_attempt:${examType}:${attemptNumber}`];
        if (passed) tags.push(`exam_passed:${examType}`);
        if (scholarshipQualified) tags.push(`scholarship_qualified:${examType}`);

        for (const tag of tags) {
            await prisma.userTag.upsert({
                where: { userId_tag: { userId, tag } },
                update: {},
                create: { userId, tag },
            });
        }

        // If scholarship qualified, also update user's marketing tags
        if (scholarshipQualified) {
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
            });
        }

        console.log(`[EXAM] ${user.email} completed exam: ${score}% (${correct}/${total}), passed: ${passed}, scholarship: ${scholarshipQualified}`);

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
        return NextResponse.json(
            { error: "Failed to submit exam" },
            { status: 500 }
        );
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
            ? spotRecord.totalSpots - spotRecord.usedSpots
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
