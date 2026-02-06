import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// All possible lesson-complete tag prefixes (used to find ANY lesson completion)
const ALL_TAG_PREFIXES = [
    "wh-lesson-complete",
    "functional-medicine-lesson-complete",
    "gut-health-lesson-complete",
    "health-coach-lesson-complete",
    "holistic-nutrition-lesson-complete",
    "hormone-health-lesson-complete",
    "nurse-coach-lesson-complete",
];

// Map category to display label
const CATEGORY_LABELS: Record<string, string> = {
    "womens-health": "Women's Health",
    "functional-medicine": "Functional Medicine",
    "functional-medicine-general": "FM General",
    "functional-medicine-clinician": "FM Clinician",
    "fm-healthcare": "FM Healthcare",
    "gut-health": "Gut Health",
    "health-coach": "Health Coach",
    "holistic-nutrition": "Holistic Nutrition",
    "hormone-health": "Hormone Health",
    "nurse-coach": "Nurse Coach",
    "unknown": "Unknown/Legacy",
};

// Helper function to count lesson completions from ANY tag prefix
function countLessonsFromTags(tags: { tag: string; createdAt: Date }[]): {
    lessonsCompleted: number;
    lessonNumbers: number[];
    lastActivity: Date | null;
} {
    const completedLessons = new Set<number>();
    let lastActivity: Date | null = null;

    for (const t of tags) {
        // Check if this tag matches any lesson-complete pattern
        for (const prefix of ALL_TAG_PREFIXES) {
            if (t.tag.startsWith(prefix + ":")) {
                const lessonNum = parseInt(t.tag.replace(prefix + ":", ""), 10);
                if (!isNaN(lessonNum) && lessonNum >= 1 && lessonNum <= 9) {
                    completedLessons.add(lessonNum);
                    if (!lastActivity || t.createdAt > lastActivity) {
                        lastActivity = t.createdAt;
                    }
                }
                break;
            }
        }
    }

    return {
        lessonsCompleted: completedLessons.size,
        lessonNumbers: Array.from(completedLessons).sort((a, b) => a - b),
        lastActivity,
    };
}

/**
 * GET /api/admin/leads-dashboard
 *
 * Unified Lead Intelligence Dashboard API
 * Returns:
 * - Summary stats (total, today, week, month)
 * - Funnel metrics (signups → started → completed → paid)
 * - Per-niche breakdown with all KPIs
 * - Revenue attribution
 * - Individual leads with payment data
 */
export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    if (!["ADMIN", "SUPERUSER", "INSTRUCTOR", "MENTOR", "SUPPORT"].includes(user?.role || "")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse query params for filtering
    const { searchParams } = new URL(request.url);
    const categoryFilter = searchParams.get("category") || "all";
    const dateRange = searchParams.get("range") || "all"; // today, week, month, 90days, all

    // Calculate date boundaries
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const ninetyDaysStart = new Date(todayStart);
    ninetyDaysStart.setDate(ninetyDaysStart.getDate() - 90);

    let dateFilter: Date | undefined;
    if (dateRange === "today") dateFilter = todayStart;
    else if (dateRange === "week") dateFilter = weekStart;
    else if (dateRange === "month") dateFilter = monthStart;
    else if (dateRange === "90days") dateFilter = ninetyDaysStart;

    // Get all mini diploma leads with their tags, enrollments, and payments
    const leads = await prisma.user.findMany({
        where: {
            miniDiplomaOptinAt: {
                not: null,
                ...(dateFilter ? { gte: dateFilter } : {}),
            },
            isFakeProfile: { not: true },
            email: { not: { contains: "@test" } },
            NOT: {
                AND: [
                    { leadSource: "ClickFunnels" },
                    { leadSourceDetail: { not: { contains: "mini" } } },
                ],
            },
            ...(categoryFilter !== "all" ? { miniDiplomaCategory: categoryFilter } : {}),
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            miniDiplomaCategory: true,
            miniDiplomaOptinAt: true,
            miniDiplomaCompletedAt: true,
            createdAt: true,
            lastLoginAt: true,
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
                select: {
                    id: true,
                    courseId: true,
                    enrolledAt: true,
                    course: {
                        select: { title: true, slug: true }
                    }
                },
            },
            payments: {
                where: {
                    status: "COMPLETED",
                    course: {
                        OR: [
                            { slug: { contains: "certification" } },
                            { slug: { contains: "accelerator" } },
                        ],
                    },
                },
                select: {
                    id: true,
                    amount: true,
                    createdAt: true,
                    productName: true,
                    refundedAt: true,
                    refundAmount: true,
                },
            },
        },
        orderBy: { miniDiplomaOptinAt: "desc" },
    });

    // Enrich leads with calculated metrics
    const enrichedLeads = leads.map((lead) => {
        // Normalize category - treat null/undefined as "unknown"
        const rawCategory = lead.miniDiplomaCategory;
        const category = rawCategory || "unknown";

        // Count lesson completions from ANY tag prefix (handles legacy/inconsistent data)
        const lessonData = countLessonsFromTags(lead.tags);
        const lessonsCompleted = lessonData.lessonsCompleted;
        const progress = Math.min(100, Math.round((lessonsCompleted / 3) * 100));
        const lastLessonDate = lessonData.lastActivity;

        // Calculate revenue from payments
        const totalRevenue = lead.payments.reduce((sum, p) => {
            const amount = Number(p.amount) || 0;
            const refund = Number(p.refundAmount) || 0;
            return sum + amount - refund;
        }, 0);

        const hasRefund = lead.payments.some(p => p.refundedAt);

        // Determine status
        let status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PAID" | "REFUNDED";
        if (hasRefund && totalRevenue <= 0) {
            status = "REFUNDED";
        } else if (lead.enrollments.length > 0) {
            status = "PAID";
        } else if (lessonsCompleted >= 3) {
            status = "COMPLETED";
        } else if (lessonsCompleted > 0) {
            status = "IN_PROGRESS";
        } else {
            status = "NOT_STARTED";
        }

        // Days since optin (for stuck users)
        const daysSinceOptin = lead.miniDiplomaOptinAt
            ? Math.floor((now.getTime() - new Date(lead.miniDiplomaOptinAt).getTime()) / (1000 * 60 * 60 * 24))
            : 0;

        // Days since last activity
        const daysSinceActivity = lastLessonDate
            ? Math.floor((now.getTime() - new Date(lastLessonDate).getTime()) / (1000 * 60 * 60 * 24))
            : daysSinceOptin;

        return {
            id: lead.id,
            email: lead.email,
            firstName: lead.firstName || "Unknown",
            lastName: lead.lastName,
            phone: lead.phone,
            category,
            categoryLabel: CATEGORY_LABELS[category] || category,
            optinDate: lead.miniDiplomaOptinAt?.toISOString(),
            completedDate: lead.miniDiplomaCompletedAt?.toISOString(),
            lessonsCompleted,
            progress,
            status,
            hasPaid: lead.enrollments.length > 0,
            revenue: totalRevenue,
            hasRefund,
            lastActivity: lastLessonDate?.toISOString() || null,
            daysSinceOptin,
            daysSinceActivity,
            isStuck: lessonsCompleted > 0 && lessonsCompleted < 3 && daysSinceActivity > 7,
            enrolledCourses: lead.enrollments.map(e => e.course?.title || "Unknown"),
        };
    });

    // Calculate overall summary stats
    const summary = {
        total: enrichedLeads.length,
        today: enrichedLeads.filter(l => l.optinDate && new Date(l.optinDate) >= todayStart).length,
        thisWeek: enrichedLeads.filter(l => l.optinDate && new Date(l.optinDate) >= weekStart).length,
        thisMonth: enrichedLeads.filter(l => l.optinDate && new Date(l.optinDate) >= monthStart).length,
    };

    // Calculate funnel metrics
    const funnel = {
        signups: enrichedLeads.length,
        started: enrichedLeads.filter(l => l.lessonsCompleted > 0).length,
        completed: enrichedLeads.filter(l => l.lessonsCompleted >= 3).length,
        paid: enrichedLeads.filter(l => l.hasPaid).length,
        refunded: enrichedLeads.filter(l => l.hasRefund && l.revenue <= 0).length,
        stuck: enrichedLeads.filter(l => l.isStuck).length,
    };

    // Calculate conversion rates
    const rates = {
        startRate: funnel.signups > 0 ? Math.round((funnel.started / funnel.signups) * 100) : 0,
        completionRate: funnel.started > 0 ? Math.round((funnel.completed / funnel.started) * 100) : 0,
        overallCompletion: funnel.signups > 0 ? Math.round((funnel.completed / funnel.signups) * 100) : 0,
        paidConversion: funnel.signups > 0 ? Math.round((funnel.paid / funnel.signups) * 100) : 0,
        refundRate: funnel.paid > 0 ? Math.round((funnel.refunded / funnel.paid) * 100) : 0,
    };

    // Calculate revenue metrics
    const revenue = {
        total: enrichedLeads.reduce((sum, l) => sum + l.revenue, 0),
        avgPerLead: enrichedLeads.length > 0
            ? Math.round(enrichedLeads.reduce((sum, l) => sum + l.revenue, 0) / enrichedLeads.length)
            : 0,
        avgPerPaid: funnel.paid > 0
            ? Math.round(enrichedLeads.filter(l => l.hasPaid).reduce((sum, l) => sum + l.revenue, 0) / funnel.paid)
            : 0,
    };

    // Calculate per-niche stats - use all categories found in leads data
    const uniqueCategories = new Set(enrichedLeads.map(l => l.category));
    const categories = Array.from(uniqueCategories);
    const nicheStats = categories.map(category => {
        const nicheLeads = enrichedLeads.filter(l => l.category === category);
        const signups = nicheLeads.length;
        const started = nicheLeads.filter(l => l.lessonsCompleted > 0).length;
        const completed = nicheLeads.filter(l => l.lessonsCompleted >= 3).length;
        const paid = nicheLeads.filter(l => l.hasPaid).length;
        const totalRevenue = nicheLeads.reduce((sum, l) => sum + l.revenue, 0);

        // Calculate lesson-by-lesson drop-off for this niche
        const lessonCounts: Record<number, number> = {};
        for (let i = 1; i <= 3; i++) lessonCounts[i] = 0;
        nicheLeads.forEach(l => {
            for (let i = 1; i <= Math.min(l.lessonsCompleted, 3); i++) {
                lessonCounts[i]++;
            }
        });

        const dropoffPoints = [];
        let biggestDropoff = { lesson: 0, rate: 0 };
        for (let i = 1; i <= 3; i++) {
            const atThisLesson = lessonCounts[i] || 0;
            const atPreviousLesson = i === 1 ? started : (lessonCounts[i - 1] || 0);
            const dropRate = atPreviousLesson > 0
                ? Math.round(((atPreviousLesson - atThisLesson) / atPreviousLesson) * 100)
                : 0;
            dropoffPoints.push({ lesson: i, count: atThisLesson, dropRate: Math.max(0, dropRate) });
            if (dropRate > biggestDropoff.rate) {
                biggestDropoff = { lesson: i, rate: dropRate };
            }
        }

        return {
            slug: category,
            name: CATEGORY_LABELS[category] || category,
            signups,
            started,
            completed,
            paid,
            revenue: totalRevenue,
            startRate: signups > 0 ? Math.round((started / signups) * 100) : 0,
            completionRate: started > 0 ? Math.round((completed / started) * 100) : 0,
            overallConversion: signups > 0 ? Math.round((completed / signups) * 100) : 0,
            paidConversion: signups > 0 ? Math.round((paid / signups) * 100) : 0,
            revenuePerLead: signups > 0 ? Math.round(totalRevenue / signups) : 0,
            biggestDropoffLesson: biggestDropoff.lesson,
            biggestDropoffRate: biggestDropoff.rate,
            dropoffPoints,
        };
    }).filter(n => n.signups > 0).sort((a, b) => b.signups - a.signups);

    // Find best performers
    const bestByLeads = nicheStats[0] || null;
    const bestByConversion = [...nicheStats].filter(n => n.signups >= 5).sort((a, b) => b.paidConversion - a.paidConversion)[0] || null;
    const bestByRevenue = [...nicheStats].sort((a, b) => b.revenue - a.revenue)[0] || null;

    // Daily signups for trend chart (last 14 days)
    const dailySignups = [];
    for (let i = 13; i >= 0; i--) {
        const dayStart = new Date(now);
        dayStart.setDate(dayStart.getDate() - i);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);

        const count = enrichedLeads.filter(l => {
            if (!l.optinDate) return false;
            const optinDate = new Date(l.optinDate);
            return optinDate >= dayStart && optinDate <= dayEnd;
        }).length;

        dailySignups.push({
            date: dayStart.toISOString(),
            label: dayStart.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
            count,
        });
    }

    // Calculate overall drop-off points
    const overallLessonCounts: Record<number, number> = {};
    for (let i = 1; i <= 3; i++) overallLessonCounts[i] = 0;
    enrichedLeads.forEach(l => {
        for (let i = 1; i <= Math.min(l.lessonsCompleted, 3); i++) {
            overallLessonCounts[i]++;
        }
    });

    const overallDropoff = [];
    for (let i = 1; i <= 3; i++) {
        const atThisLesson = overallLessonCounts[i] || 0;
        const atPreviousLesson = i === 1 ? funnel.started : (overallLessonCounts[i - 1] || 0);
        const dropRate = atPreviousLesson > 0
            ? Math.round(((atPreviousLesson - atThisLesson) / atPreviousLesson) * 100)
            : 0;
        overallDropoff.push({
            lesson: i,
            label: `Lesson ${i}`,
            count: atThisLesson,
            dropRate: Math.max(0, dropRate)
        });
    }

    // ============ WEEKLY COHORTS ============
    // Group leads by the week they signed up (last 12 weeks)
    const weeklyCohorts = [];
    for (let weekOffset = 0; weekOffset < 12; weekOffset++) {
        const weekEnd = new Date(todayStart);
        weekEnd.setDate(weekEnd.getDate() - (weekOffset * 7));
        weekEnd.setHours(23, 59, 59, 999);

        const weekStartDate = new Date(weekEnd);
        weekStartDate.setDate(weekStartDate.getDate() - 6);
        weekStartDate.setHours(0, 0, 0, 0);

        const cohortLeads = enrichedLeads.filter(l => {
            if (!l.optinDate) return false;
            const optinDate = new Date(l.optinDate);
            return optinDate >= weekStartDate && optinDate <= weekEnd;
        });

        const signups = cohortLeads.length;
        const started = cohortLeads.filter(l => l.lessonsCompleted > 0).length;
        const completed = cohortLeads.filter(l => l.lessonsCompleted >= 3).length;
        const paid = cohortLeads.filter(l => l.hasPaid).length;
        const cohortRevenue = cohortLeads.reduce((sum, l) => sum + l.revenue, 0);

        weeklyCohorts.push({
            weekStart: weekStartDate.toISOString(),
            weekEnd: weekEnd.toISOString(),
            label: weekStartDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
                   " - " + weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            signups,
            started,
            completed,
            paid,
            revenue: cohortRevenue,
            startRate: signups > 0 ? Math.round((started / signups) * 100) : 0,
            completionRate: started > 0 ? Math.round((completed / started) * 100) : 0,
            paidConversion: signups > 0 ? Math.round((paid / signups) * 100) : 0,
        });
    }

    // ============ WEEK-OVER-WEEK COMPARISON ============
    // Compare this week vs last week
    const thisWeekCohort = weeklyCohorts[0];
    const lastWeekCohort = weeklyCohorts[1];

    const weekOverWeek = {
        signups: {
            current: thisWeekCohort?.signups || 0,
            previous: lastWeekCohort?.signups || 0,
            delta: (thisWeekCohort?.signups || 0) - (lastWeekCohort?.signups || 0),
            deltaPercent: lastWeekCohort?.signups > 0
                ? Math.round(((thisWeekCohort?.signups || 0) - lastWeekCohort.signups) / lastWeekCohort.signups * 100)
                : 0,
        },
        startRate: {
            current: thisWeekCohort?.startRate || 0,
            previous: lastWeekCohort?.startRate || 0,
            delta: (thisWeekCohort?.startRate || 0) - (lastWeekCohort?.startRate || 0),
        },
        completionRate: {
            current: thisWeekCohort?.completionRate || 0,
            previous: lastWeekCohort?.completionRate || 0,
            delta: (thisWeekCohort?.completionRate || 0) - (lastWeekCohort?.completionRate || 0),
        },
        paidConversion: {
            current: thisWeekCohort?.paidConversion || 0,
            previous: lastWeekCohort?.paidConversion || 0,
            delta: (thisWeekCohort?.paidConversion || 0) - (lastWeekCohort?.paidConversion || 0),
        },
        revenue: {
            current: thisWeekCohort?.revenue || 0,
            previous: lastWeekCohort?.revenue || 0,
            delta: (thisWeekCohort?.revenue || 0) - (lastWeekCohort?.revenue || 0),
            deltaPercent: lastWeekCohort?.revenue > 0
                ? Math.round(((thisWeekCohort?.revenue || 0) - lastWeekCohort.revenue) / lastWeekCohort.revenue * 100)
                : 0,
        },
    };

    // ============ WEEKLY TRENDS (for charts) ============
    // Prepare trend data for the last 12 weeks
    const weeklyTrends = {
        labels: weeklyCohorts.map(w => w.label).reverse(),
        signups: weeklyCohorts.map(w => w.signups).reverse(),
        startRate: weeklyCohorts.map(w => w.startRate).reverse(),
        completionRate: weeklyCohorts.map(w => w.completionRate).reverse(),
        paidConversion: weeklyCohorts.map(w => w.paidConversion).reverse(),
        revenue: weeklyCohorts.map(w => w.revenue).reverse(),
    };

    return NextResponse.json({
        summary,
        funnel,
        rates,
        revenue,
        nicheStats,
        bestPerformers: {
            byLeads: bestByLeads ? { name: bestByLeads.name, value: bestByLeads.signups } : null,
            byConversion: bestByConversion ? { name: bestByConversion.name, value: bestByConversion.paidConversion } : null,
            byRevenue: bestByRevenue ? { name: bestByRevenue.name, value: bestByRevenue.revenue } : null,
        },
        dailySignups,
        overallDropoff,
        // leads[] removed — use /api/admin/leads-dashboard/leads for paginated list
        // Weekly cohort analysis
        weeklyCohorts,
        weekOverWeek,
        weeklyTrends,
        // Return all categories found in the data for the filter dropdown
        categories: Array.from(uniqueCategories)
            .sort((a, b) => {
                // Put "unknown" at the end
                if (a === "unknown") return 1;
                if (b === "unknown") return -1;
                return a.localeCompare(b);
            })
            .map(c => ({ value: c, label: CATEGORY_LABELS[c] || c })),
    });
}
