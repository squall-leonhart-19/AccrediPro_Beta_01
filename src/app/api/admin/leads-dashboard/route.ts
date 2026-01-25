import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Tag prefixes for lesson completion (maps miniDiplomaCategory to tag prefix)
const CATEGORY_TO_TAG_PREFIX: Record<string, string> = {
    "womens-health": "wh-lesson-complete",
    "functional-medicine": "functional-medicine-lesson-complete",
    "fm-healthcare": "functional-medicine-lesson-complete",
    "gut-health": "gut-health-lesson-complete",
    "health-coach": "health-coach-lesson-complete",
    "holistic-nutrition": "holistic-nutrition-lesson-complete",
    "hormone-health": "hormone-health-lesson-complete",
    "nurse-coach": "nurse-coach-lesson-complete",
};

const CATEGORY_LABELS: Record<string, string> = {
    "womens-health": "Women's Health",
    "functional-medicine": "Functional Medicine",
    "fm-healthcare": "FM Healthcare",
    "gut-health": "Gut Health",
    "health-coach": "Health Coach",
    "holistic-nutrition": "Holistic Nutrition",
    "hormone-health": "Hormone Health",
    "nurse-coach": "Nurse Coach",
};

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
        const category = lead.miniDiplomaCategory || "functional-medicine";
        const tagPrefix = CATEGORY_TO_TAG_PREFIX[category] || "functional-medicine-lesson-complete";

        // Count lesson completions
        const lessonTags = lead.tags.filter((t) => t.tag.startsWith(`${tagPrefix}:`));
        const lessonsCompleted = lessonTags.length;
        const progress = Math.round((lessonsCompleted / 9) * 100);

        // Get last activity
        const lastLessonTag = lessonTags.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

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
        } else if (lessonsCompleted >= 9) {
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
        const daysSinceActivity = lastLessonTag?.createdAt
            ? Math.floor((now.getTime() - new Date(lastLessonTag.createdAt).getTime()) / (1000 * 60 * 60 * 24))
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
            lastActivity: lastLessonTag?.createdAt.toISOString() || null,
            daysSinceOptin,
            daysSinceActivity,
            isStuck: lessonsCompleted > 0 && lessonsCompleted < 9 && daysSinceActivity > 7,
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
        completed: enrichedLeads.filter(l => l.lessonsCompleted >= 9).length,
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

    // Calculate per-niche stats
    const categories = Object.keys(CATEGORY_TO_TAG_PREFIX);
    const nicheStats = categories.map(category => {
        const nicheLeads = enrichedLeads.filter(l => l.category === category);
        const signups = nicheLeads.length;
        const started = nicheLeads.filter(l => l.lessonsCompleted > 0).length;
        const completed = nicheLeads.filter(l => l.lessonsCompleted >= 9).length;
        const paid = nicheLeads.filter(l => l.hasPaid).length;
        const totalRevenue = nicheLeads.reduce((sum, l) => sum + l.revenue, 0);

        // Calculate lesson-by-lesson drop-off for this niche
        const lessonCounts: Record<number, number> = {};
        for (let i = 1; i <= 9; i++) lessonCounts[i] = 0;
        nicheLeads.forEach(l => {
            for (let i = 1; i <= l.lessonsCompleted; i++) {
                lessonCounts[i]++;
            }
        });

        const dropoffPoints = [];
        let biggestDropoff = { lesson: 0, rate: 0 };
        for (let i = 1; i <= 9; i++) {
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
    for (let i = 1; i <= 9; i++) overallLessonCounts[i] = 0;
    enrichedLeads.forEach(l => {
        for (let i = 1; i <= l.lessonsCompleted; i++) {
            overallLessonCounts[i]++;
        }
    });

    const overallDropoff = [];
    for (let i = 1; i <= 9; i++) {
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
        leads: enrichedLeads,
        categories: categories.map(c => ({ value: c, label: CATEGORY_LABELS[c] || c })),
    });
}
