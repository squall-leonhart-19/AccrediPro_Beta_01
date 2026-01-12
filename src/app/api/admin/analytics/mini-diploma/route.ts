import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Tag prefixes for lesson completion (maps miniDiplomaCategory to tag prefix)
const CATEGORY_TO_TAG_PREFIX: Record<string, string> = {
    "womens-health": "wh-lesson-complete",
    "functional-medicine": "functional-medicine-lesson-complete",
    "gut-health": "gut-health-lesson-complete",
    "health-coach": "health-coach-lesson-complete",
    "holistic-nutrition": "holistic-nutrition-lesson-complete",
    "hormone-health": "hormone-health-lesson-complete",
    "nurse-coach": "nurse-coach-lesson-complete",
};

// All mini diploma categories
const MINI_DIPLOMA_CATEGORIES = Object.keys(CATEGORY_TO_TAG_PREFIX);

/**
 * GET /api/admin/analytics/mini-diploma
 * Get Mini Diploma funnel analytics
 *
 * Uses User.miniDiplomaOptinAt as source of truth (same as Leads API)
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "INSTRUCTOR", "MENTOR"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const now = new Date();

        // Get all mini diploma leads (users with miniDiplomaOptinAt set)
        // Same filter as Leads API for consistency
        // EXCLUDE users who came directly from ClickFunnels certification purchases
        const leads = await prisma.user.findMany({
            where: {
                miniDiplomaOptinAt: { not: null },
                isFakeProfile: { not: true },
                email: { not: { contains: "@test" } },
                // Exclude ClickFunnels certification purchasers (they have ClickFunnels as leadSource but NOT mini-diploma)
                NOT: {
                    AND: [
                        { leadSource: "ClickFunnels" },
                        { leadSourceDetail: { not: { contains: "mini" } } },
                    ],
                },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                miniDiplomaCategory: true,
                miniDiplomaOptinAt: true,
                createdAt: true,
                tags: {
                    select: { tag: true, createdAt: true },
                },
                enrollments: {
                    where: {
                        course: {
                            OR: [
                                { slug: { contains: "certification" } },
                                { slug: { contains: "accelerator" } },
                            ],
                        },
                    },
                    select: { id: true },
                },
            },
            orderBy: { miniDiplomaOptinAt: "desc" },
        });

        // Calculate progress for each lead based on their tags
        const leadsWithProgress = leads.map((lead) => {
            const category = lead.miniDiplomaCategory || "functional-medicine";
            const tagPrefix = CATEGORY_TO_TAG_PREFIX[category] || "functional-medicine-lesson-complete";

            // Count lesson completion tags for their category
            const lessonTags = lead.tags.filter((t) => t.tag.startsWith(`${tagPrefix}:`));
            const lessonsCompleted = lessonTags.length;
            const progress = Math.round((lessonsCompleted / 9) * 100);

            // Get last activity date
            const lastLessonTag = lessonTags.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )[0];

            return {
                ...lead,
                category,
                lessonsCompleted,
                progress,
                lastActivity: lastLessonTag?.createdAt || null,
                hasConvertedToPurchase: lead.enrollments.length > 0,
            };
        });

        // Total signups
        const signups = leadsWithProgress.length;

        // Started - users who have completed at least 1 lesson
        const started = leadsWithProgress.filter((l) => l.lessonsCompleted > 0).length;

        // Completed - users who finished all 9 lessons
        const completed = leadsWithProgress.filter((l) => l.lessonsCompleted >= 9).length;

        // Watched training - users with training_watched tag
        const watchedTraining = await prisma.userTag.count({
            where: {
                tag: { contains: "training_watched" },
                user: {
                    miniDiplomaOptinAt: { not: null },
                },
            },
        });

        // Enrolled in full certification (converted)
        const enrolled = leadsWithProgress.filter((l) => l.hasConvertedToPurchase).length;

        // Avg time to complete (for users with 9 lessons done)
        const completedLeads = leadsWithProgress.filter((l) => l.lessonsCompleted >= 9 && l.lastActivity);
        const avgTimeToComplete =
            completedLeads.length > 0
                ? Math.round(
                    completedLeads.reduce((acc, l) => {
                        const days =
                            (new Date(l.lastActivity!).getTime() - new Date(l.miniDiplomaOptinAt!).getTime()) /
                            (1000 * 60 * 60 * 24);
                        return acc + Math.max(0, days);
                    }, 0) / completedLeads.length
                )
                : 0;

        // Avg quiz score (placeholder - would need quiz data)
        const avgScore = 78;

        // Drop-off points by lesson (1-9)
        const lessonCounts: Record<number, number> = {};
        for (let i = 1; i <= 9; i++) {
            lessonCounts[i] = 0;
        }

        leadsWithProgress.forEach((l) => {
            for (let i = 1; i <= l.lessonsCompleted; i++) {
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

        // Recent signups (last 10)
        const formattedRecentSignups = leadsWithProgress.slice(0, 10).map((lead) => {
            const licenseTag = lead.tags.find((t) => t.tag.startsWith("license_type:"));
            return {
                id: lead.id,
                name: `${lead.firstName || ""} ${lead.lastName || ""}`.trim() || "Unknown",
                email: lead.email || "",
                signupDate: lead.miniDiplomaOptinAt?.toISOString() || lead.createdAt.toISOString(),
                status: lead.lessonsCompleted >= 9 ? "COMPLETED" : lead.lessonsCompleted > 0 ? "IN_PROGRESS" : "NOT_STARTED",
                progress: lead.progress,
                licenseType: licenseTag?.tag.replace("license_type:", "") || undefined,
                category: lead.category,
            };
        });

        // Daily signups for last 14 days
        const dailySignups = [];
        for (let i = 13; i >= 0; i--) {
            const dayStart = new Date(now);
            dayStart.setDate(dayStart.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);

            const count = leadsWithProgress.filter((l) => {
                const optinDate = new Date(l.miniDiplomaOptinAt!);
                return optinDate >= dayStart && optinDate <= dayEnd;
            }).length;

            dailySignups.push({
                date: dayStart.toISOString(),
                count,
            });
        }

        // Per-niche breakdown
        const nicheStats = [];
        for (const category of MINI_DIPLOMA_CATEGORIES) {
            const tagPrefix = CATEGORY_TO_TAG_PREFIX[category];
            const nicheLeads = leadsWithProgress.filter(
                (l) => l.category === category
            );

            const nicheSignups = nicheLeads.length;
            const nicheStarted = nicheLeads.filter((l) => l.lessonsCompleted > 0).length;
            const nicheCompleted = nicheLeads.filter((l) => l.lessonsCompleted >= 9).length;
            const nicheConverted = nicheLeads.filter((l) => l.hasConvertedToPurchase).length;

            // Calculate niche-specific drop-off per lesson
            const nicheLessonCounts: Record<number, number> = {};
            for (let i = 1; i <= 9; i++) {
                nicheLessonCounts[i] = 0;
            }
            nicheLeads.forEach((l) => {
                for (let i = 1; i <= l.lessonsCompleted; i++) {
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
            const purchaseConversion = nicheSignups > 0 ? Math.round((nicheConverted / nicheSignups) * 100) : 0;

            // Format niche name nicely
            const nicheName = category
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");

            nicheStats.push({
                slug: category,
                name: nicheName,
                signups: nicheSignups,
                started: nicheStarted,
                completed: nicheCompleted,
                converted: nicheConverted,
                startRate,
                completionRate,
                overallConversion,
                purchaseConversion,
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

        // Calculate overall conversion rate
        const conversionRate = signups > 0 ? Math.round((enrolled / signups) * 100) : 0;

        return NextResponse.json({
            signups,
            started,
            completed,
            watchedTraining,
            enrolled,
            avgTimeToComplete,
            avgScore,
            conversionRate,
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
