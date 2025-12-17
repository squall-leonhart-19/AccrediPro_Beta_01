import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        // Get mini diploma course
        const miniDiplomaCourse = await prisma.course.findFirst({
            where: {
                OR: [
                    { slug: { contains: "mini-diploma" } },
                    { certificateType: "MINI_DIPLOMA" },
                ],
            },
        });

        if (!miniDiplomaCourse) {
            return NextResponse.json({ error: "Mini Diploma course not found" }, { status: 404 });
        }

        // Signups - users with miniDiplomaOptinAt
        const signups = await prisma.user.count({
            where: {
                miniDiplomaOptinAt: { not: null },
                isFakeProfile: { not: true },
            },
        });

        // Started - users enrolled in mini diploma
        const started = await prisma.enrollment.count({
            where: {
                courseId: miniDiplomaCourse.id,
                progress: { gt: 0 },
            },
        });

        // Completed - users who finished mini diploma
        const completed = await prisma.enrollment.count({
            where: {
                courseId: miniDiplomaCourse.id,
                status: "COMPLETED",
            },
        });

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

        // Avg time to complete
        const completedEnrollments = await prisma.enrollment.findMany({
            where: {
                courseId: miniDiplomaCourse.id,
                status: "COMPLETED",
                completedAt: { not: null },
            },
            select: {
                enrolledAt: true,
                completedAt: true,
            },
        });

        const avgTimeToComplete =
            completedEnrollments.length > 0
                ? Math.round(
                    completedEnrollments.reduce((acc, e) => {
                        const days =
                            (new Date(e.completedAt!).getTime() - new Date(e.enrolledAt).getTime()) /
                            (1000 * 60 * 60 * 24);
                        return acc + days;
                    }, 0) / completedEnrollments.length
                )
                : 0;

        // Avg quiz score (if available)
        const avgScore = 78; // Placeholder - would need quiz results table

        // Drop-off points by module
        const modules = await prisma.module.findMany({
            where: { courseId: miniDiplomaCourse.id },
            orderBy: { order: "asc" },
            select: { id: true, title: true },
        });

        const dropoffPoints = await Promise.all(
            modules.map(async (module, index) => {
                const atThisModule = await prisma.lessonProgress.count({
                    where: {
                        lesson: { moduleId: module.id },
                        isCompleted: true,
                    },
                });

                const previousModule = index > 0 ? modules[index - 1] : null;
                const atPreviousModule = previousModule
                    ? await prisma.lessonProgress.count({
                        where: {
                            lesson: { moduleId: previousModule.id },
                            isCompleted: true,
                        },
                    })
                    : started;

                const dropRate =
                    atPreviousModule > 0
                        ? Math.round(((atPreviousModule - atThisModule) / atPreviousModule) * 100)
                        : 0;

                return {
                    module: module.title,
                    dropRate: Math.max(0, dropRate),
                };
            })
        );

        // Recent signups
        const recentSignups = await prisma.user.findMany({
            where: {
                miniDiplomaOptinAt: { not: null },
                isFakeProfile: { not: true },
            },
            orderBy: { miniDiplomaOptinAt: "desc" },
            take: 10,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                miniDiplomaOptinAt: true,
                enrollments: {
                    where: { courseId: miniDiplomaCourse.id },
                    select: { progress: true, status: true },
                },
                tags: {
                    where: { tag: { startsWith: "license_type:" } },
                    select: { tag: true },
                },
            },
        });

        const formattedRecentSignups = recentSignups.map((user) => ({
            id: user.id,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown",
            email: user.email || "",
            signupDate: user.miniDiplomaOptinAt?.toISOString() || "",
            status: user.enrollments[0]?.status || "NOT_STARTED",
            progress: user.enrollments[0]?.progress || 0,
            licenseType: user.tags[0]?.tag.replace("license_type:", "") || undefined,
        }));

        // Daily signups for last 14 days
        const dailySignups = [];
        for (let i = 13; i >= 0; i--) {
            const dayStart = new Date(now);
            dayStart.setDate(dayStart.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);

            const count = await prisma.user.count({
                where: {
                    miniDiplomaOptinAt: { gte: dayStart, lte: dayEnd },
                    isFakeProfile: { not: true },
                },
            });

            dailySignups.push({
                date: dayStart.toISOString(),
                count,
            });
        }

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
        });
    } catch (error) {
        console.error("Error fetching mini diploma analytics:", error);
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
}
