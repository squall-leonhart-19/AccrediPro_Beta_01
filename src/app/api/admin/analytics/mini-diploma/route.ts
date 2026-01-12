import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// All mini diploma course slugs
const MINI_DIPLOMA_SLUGS = [
    "womens-health-mini-diploma",
    "functional-medicine-mini-diploma",
    "gut-health-mini-diploma",
    "health-coach-mini-diploma",
    "holistic-nutrition-mini-diploma",
    "hormone-health-mini-diploma",
    "nurse-coach-mini-diploma",
];

// Tag prefixes for lesson completion (maps slug to tag prefix)
const SLUG_TO_TAG_PREFIX: Record<string, string> = {
    "womens-health-mini-diploma": "wh-lesson-complete",
    "functional-medicine-mini-diploma": "functional-medicine-lesson-complete",
    "gut-health-mini-diploma": "gut-health-lesson-complete",
    "health-coach-mini-diploma": "health-coach-lesson-complete",
    "holistic-nutrition-mini-diploma": "holistic-nutrition-lesson-complete",
    "hormone-health-mini-diploma": "hormone-health-lesson-complete",
    "nurse-coach-mini-diploma": "nurse-coach-lesson-complete",
};

/**
 * GET /api/admin/analytics/mini-diploma
 * Get Mini Diploma funnel analytics
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const now = new Date();

        // Signups - users enrolled in any mini diploma course (exclude fake/test users)
        const signups = await prisma.enrollment.count({
            where: {
                course: { slug: { in: MINI_DIPLOMA_SLUGS } },
                user: {
                    isFakeProfile: { not: true },
                    email: { not: { contains: "@test" } },
                },
            },
        });

        // Get all mini diploma enrollments with user tags to calculate real progress
        const enrollments = await prisma.enrollment.findMany({
            where: {
                course: { slug: { in: MINI_DIPLOMA_SLUGS } },
                user: {
                    isFakeProfile: { not: true },
                    email: { not: { contains: "@test" } },
                },
            },
            select: {
                userId: true,
                status: true,
                enrolledAt: true,
                completedAt: true,
                course: { select: { slug: true } },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        tags: {
                            select: { tag: true },
                        },
                    },
                },
            },
        });

        // Calculate progress for each enrollment based on UserTags
        const enrollmentsWithProgress = enrollments.map((enrollment) => {
            const tagPrefix = SLUG_TO_TAG_PREFIX[enrollment.course.slug];
            if (!tagPrefix) {
                return { ...enrollment, lessonsCompleted: 0, progress: 0 };
            }

            // Count lesson completion tags for this niche
            const lessonsCompleted = enrollment.user.tags.filter(
                (t) => t.tag.startsWith(`${tagPrefix}:`)
            ).length;

            // Progress is lessons completed / 9 * 100
            const progress = Math.round((lessonsCompleted / 9) * 100);

            return { ...enrollment, lessonsCompleted, progress };
        });

        // Started - users who have completed at least 1 lesson
        const started = enrollmentsWithProgress.filter((e) => e.lessonsCompleted > 0).length;

        // Completed - users who finished all 9 lessons
        const completed = enrollmentsWithProgress.filter((e) => e.lessonsCompleted >= 9).length;

        // Watched training - users with training_watched tag
        const watchedTraining = await prisma.userTag.count({
            where: {
                tag: { contains: "training_watched" },
            },
        });

        // Enrolled in full cert
        const fullCertCourse = await prisma.course.findFirst({
            where: {
                OR: [
                    { slug: { contains: "certification" } },
                    { slug: { contains: "full" } },
                ],
                certificateType: { not: "MINI_DIPLOMA" },
            },
        });

        const enrolled = fullCertCourse
            ? await prisma.enrollment.count({
                where: { courseId: fullCertCourse.id },
            })
            : 0;

        // Avg time to complete (for users with 9 lessons done)
        const completedWithDates = enrollmentsWithProgress.filter(
            (e) => e.lessonsCompleted >= 9 && e.completedAt
        );
        const avgTimeToComplete =
            completedWithDates.length > 0
                ? Math.round(
                    completedWithDates.reduce((acc, e) => {
                        const days =
                            (new Date(e.completedAt!).getTime() - new Date(e.enrolledAt).getTime()) /
                            (1000 * 60 * 60 * 24);
                        return acc + days;
                    }, 0) / completedWithDates.length
                )
                : 0;

        // Avg quiz score (placeholder)
        const avgScore = 78;

        // Drop-off points by lesson (1-9)
        const lessonCounts: Record<number, number> = {};
        for (let i = 1; i <= 9; i++) {
            lessonCounts[i] = 0;
        }

        enrollmentsWithProgress.forEach((e) => {
            for (let i = 1; i <= e.lessonsCompleted; i++) {
                lessonCounts[i]++;
            }
        });

        const dropoffPoints = [];
        for (let i = 1; i <= 9; i++) {
            const atThisLesson = lessonCounts[i] || 0;
            const atPreviousLesson = i === 1 ? started : (lessonCounts[i - 1] || 0);
            const dropRate =
                atPreviousLesson > 0
                    ? Math.round(((atPreviousLesson - atThisLesson) / atPreviousLesson) * 100)
                    : 0;

            dropoffPoints.push({
                module: `Lesson ${i}`,
                dropRate: Math.max(0, dropRate),
            });
        }

        // Recent signups (most recent enrollments, exclude fake/test)
        const recentEnrollments = await prisma.enrollment.findMany({
            where: {
                course: { slug: { in: MINI_DIPLOMA_SLUGS } },
                user: {
                    isFakeProfile: { not: true },
                    email: { not: { contains: "@test" } },
                },
            },
            orderBy: { enrolledAt: "desc" },
            take: 10,
            select: {
                userId: true,
                enrolledAt: true,
                status: true,
                course: { select: { slug: true } },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        tags: { select: { tag: true } },
                    },
                },
            },
        });

        const formattedRecentSignups = recentEnrollments.map((enrollment) => {
            const tagPrefix = SLUG_TO_TAG_PREFIX[enrollment.course.slug] || "";
            const lessonsCompleted = enrollment.user.tags.filter(
                (t) => t.tag.startsWith(`${tagPrefix}:`)
            ).length;
            const progress = Math.round((lessonsCompleted / 9) * 100);
            const licenseTag = enrollment.user.tags.find((t) => t.tag.startsWith("license_type:"));

            return {
                id: enrollment.user.id,
                name: `${enrollment.user.firstName || ""} ${enrollment.user.lastName || ""}`.trim() || "Unknown",
                email: enrollment.user.email || "",
                signupDate: enrollment.enrolledAt.toISOString(),
                status: lessonsCompleted >= 9 ? "COMPLETED" : lessonsCompleted > 0 ? "IN_PROGRESS" : "NOT_STARTED",
                progress,
                licenseType: licenseTag?.tag.replace("license_type:", "") || undefined,
            };
        });

        // Daily signups for last 14 days (exclude fake/test)
        const dailySignups = [];
        for (let i = 13; i >= 0; i--) {
            const dayStart = new Date(now);
            dayStart.setDate(dayStart.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);

            const count = await prisma.enrollment.count({
                where: {
                    course: { slug: { in: MINI_DIPLOMA_SLUGS } },
                    enrolledAt: { gte: dayStart, lte: dayEnd },
                    user: {
                        isFakeProfile: { not: true },
                        email: { not: { contains: "@test" } },
                    },
                },
            });

            dailySignups.push({
                date: dayStart.toISOString(),
                count,
            });
        }

        // Per-niche breakdown
        const nicheStats = [];
        for (const slug of MINI_DIPLOMA_SLUGS) {
            const tagPrefix = SLUG_TO_TAG_PREFIX[slug];
            const nicheEnrollments = enrollmentsWithProgress.filter(
                (e) => e.course.slug === slug
            );

            const nicheSignups = nicheEnrollments.length;
            const nicheStarted = nicheEnrollments.filter((e) => e.lessonsCompleted > 0).length;
            const nicheCompleted = nicheEnrollments.filter((e) => e.lessonsCompleted >= 9).length;

            // Calculate niche-specific drop-off per lesson
            const nicheLessonCounts: Record<number, number> = {};
            for (let i = 1; i <= 9; i++) {
                nicheLessonCounts[i] = 0;
            }
            nicheEnrollments.forEach((e) => {
                for (let i = 1; i <= e.lessonsCompleted; i++) {
                    nicheLessonCounts[i]++;
                }
            });

            const nicheDropoffPoints = [];
            for (let i = 1; i <= 9; i++) {
                const atThisLesson = nicheLessonCounts[i] || 0;
                const atPreviousLesson = i === 1 ? nicheStarted : (nicheLessonCounts[i - 1] || 0);
                const dropRate = atPreviousLesson > 0
                    ? Math.round(((atPreviousLesson - atThisLesson) / atPreviousLesson) * 100)
                    : 0;
                nicheDropoffPoints.push({ lesson: i, dropRate: Math.max(0, dropRate) });
            }

            // Find biggest drop-off point for this niche
            const biggestDropoff = nicheDropoffPoints.reduce(
                (max, p) => (p.dropRate > max.dropRate ? p : max),
                { lesson: 0, dropRate: 0 }
            );

            // Conversion rates
            const startRate = nicheSignups > 0 ? Math.round((nicheStarted / nicheSignups) * 100) : 0;
            const completionRate = nicheStarted > 0 ? Math.round((nicheCompleted / nicheStarted) * 100) : 0;
            const overallConversion = nicheSignups > 0 ? Math.round((nicheCompleted / nicheSignups) * 100) : 0;

            // Format niche name nicely
            const nicheName = slug
                .replace("-mini-diploma", "")
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");

            nicheStats.push({
                slug,
                name: nicheName,
                signups: nicheSignups,
                started: nicheStarted,
                completed: nicheCompleted,
                startRate,
                completionRate,
                overallConversion,
                biggestDropoffLesson: biggestDropoff.lesson,
                biggestDropoffRate: biggestDropoff.dropRate,
                dropoffPoints: nicheDropoffPoints,
            });
        }

        // Sort by signups to find best performer
        const sortedBySignups = [...nicheStats].sort((a, b) => b.signups - a.signups);
        const bestPerformer = sortedBySignups[0];
        const sortedByConversion = [...nicheStats].filter(n => n.signups >= 5).sort((a, b) => b.overallConversion - a.overallConversion);
        const bestConversion = sortedByConversion[0];

        return NextResponse.json({
            signups,
            started,
            completed,
            watchedTraining,
            enrolled,
            avgTimeToComplete,
            avgScore,
            dropoffPoints,
            recentSignups: formattedRecentSignups,
            dailySignups,
            nicheStats,
            bestPerformer: bestPerformer ? {
                name: bestPerformer.name,
                signups: bestPerformer.signups,
                completionRate: bestPerformer.completionRate,
            } : null,
            bestConversion: bestConversion ? {
                name: bestConversion.name,
                overallConversion: bestConversion.overallConversion,
                signups: bestConversion.signups,
            } : null,
        });
    } catch (error) {
        console.error("Error fetching mini diploma analytics:", error);
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
}
