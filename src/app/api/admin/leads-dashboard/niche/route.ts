import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ALL_TAG_PREFIXES = [
    "wh-lesson-complete",
    "whh-lesson-complete",
    "functional-medicine-lesson-complete",
    "gut-health-lesson-complete",
    "health-coach-lesson-complete",
    "holistic-nutrition-lesson-complete",
    "hormone-health-lesson-complete",
    "nurse-coach-lesson-complete",
    "adhd-coaching-lesson-complete",
    "spiritual-healing-lesson-complete",
    "energy-healing-lesson-complete",
    "christian-coaching-lesson-complete",
    "reiki-healing-lesson-complete",
    "pet-nutrition-lesson-complete",
];

const CATEGORY_LABELS: Record<string, string> = {
    "womens-health": "Women's Health",
    "womens-hormone-health": "Women's Hormone Health",
    "functional-medicine": "Functional Medicine",
    "functional-medicine-general": "FM General",
    "functional-medicine-clinician": "FM Clinician",
    "fm-healthcare": "FM Healthcare",
    "gut-health": "Gut Health",
    "health-coach": "Health Coach",
    "holistic-nutrition": "Holistic Nutrition",
    "hormone-health": "Hormone Health",
    "nurse-coach": "Nurse Coach",
    "spiritual-healing": "Spiritual Healing",
    "energy-healing": "Energy Healing",
    "christian-coaching": "Christian Coaching",
    "reiki-healing": "Reiki Healing",
    "adhd-coaching": "ADHD Coaching",
    "pet-nutrition": "Pet Nutrition",
    "unknown": "Unknown/Legacy",
};

function countLessonsFromTags(tags: { tag: string; createdAt: Date }[]) {
    const completedLessons = new Set<number>();
    let lastActivity: Date | null = null;

    for (const t of tags) {
        for (const prefix of ALL_TAG_PREFIXES) {
            if (t.tag.startsWith(prefix + ":")) {
                const lessonNum = parseInt(t.tag.replace(prefix + ":", ""), 10);
                if (!isNaN(lessonNum) && lessonNum >= 1 && lessonNum <= 9) {
                    completedLessons.add(lessonNum);
                    if (!lastActivity || t.createdAt > lastActivity) lastActivity = t.createdAt;
                }
                break;
            }
        }
    }

    return { lessonsCompleted: completedLessons.size, lessonNumbers: Array.from(completedLessons).sort((a, b) => a - b), lastActivity };
}

/**
 * GET /api/admin/leads-dashboard/niche?slug=functional-medicine&range=all
 * Returns deep-dive data for a single niche
 */
export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    if (!["ADMIN", "SUPERUSER", "INSTRUCTOR", "MENTOR", "SUPPORT"].includes(user?.role || "")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const dateRange = searchParams.get("range") || "all";

    if (!slug) return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart); weekStart.setDate(weekStart.getDate() - 7);

    let dateFilter: Date | undefined;
    if (dateRange === "today") dateFilter = todayStart;
    else if (dateRange === "week") dateFilter = weekStart;
    else if (dateRange === "month") dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
    else if (dateRange === "90days") { const d = new Date(todayStart); d.setDate(d.getDate() - 90); dateFilter = d; }

    // Fetch leads for this niche
    const leads = await prisma.user.findMany({
        where: {
            miniDiplomaOptinAt: { not: null, ...(dateFilter ? { gte: dateFilter } : {}) },
            miniDiplomaCategory: slug,
            isFakeProfile: { not: true },
            email: { not: { contains: "@test" } },
        },
        select: {
            id: true, email: true, firstName: true, lastName: true, phone: true,
            miniDiplomaCategory: true, miniDiplomaOptinAt: true, miniDiplomaCompletedAt: true,
            leadSource: true, leadSourceDetail: true, formVariant: true,
            createdAt: true, lastLoginAt: true,
            tags: { select: { tag: true, createdAt: true } },
            enrollments: {
                where: { course: { OR: [{ slug: { contains: "certification" } }, { slug: { contains: "accelerator" } }] } },
                select: { id: true, course: { select: { title: true, slug: true } } },
            },
            payments: {
                where: { status: "COMPLETED", course: { OR: [{ slug: { contains: "certification" } }, { slug: { contains: "accelerator" } }] } },
                select: { id: true, amount: true, refundedAt: true, refundAmount: true },
            },
        },
        orderBy: { miniDiplomaOptinAt: "desc" },
    });

    // Enrich leads
    const enrichedLeads = leads.map((lead) => {
        const category = lead.miniDiplomaCategory || "unknown";
        const lessonData = countLessonsFromTags(lead.tags);
        const lessonsCompleted = lessonData.lessonsCompleted;
        const progress = Math.round((lessonsCompleted / 9) * 100);
        const totalRevenue = lead.payments.reduce((sum, p) => (Number(p.amount) || 0) - (Number(p.refundAmount) || 0) + sum, 0);
        const hasRefund = lead.payments.some(p => p.refundedAt);

        let status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PAID" | "REFUNDED";
        if (hasRefund && totalRevenue <= 0) status = "REFUNDED";
        else if (lead.enrollments.length > 0) status = "PAID";
        else if (lessonsCompleted >= 9) status = "COMPLETED";
        else if (lessonsCompleted > 0) status = "IN_PROGRESS";
        else status = "NOT_STARTED";

        const daysSinceOptin = lead.miniDiplomaOptinAt ? Math.floor((now.getTime() - new Date(lead.miniDiplomaOptinAt).getTime()) / 86400000) : 0;
        const daysSinceActivity = lessonData.lastActivity ? Math.floor((now.getTime() - new Date(lessonData.lastActivity).getTime()) / 86400000) : daysSinceOptin;

        // Extract source info from tags
        const segmentTag = lead.tags.find(t => t.tag.startsWith("segment:"));
        const tierTag = lead.tags.find(t => t.tag.startsWith("lead_tier:"));
        const scoreTag = lead.tags.find(t => t.tag.startsWith("lead_score:"));

        return {
            id: lead.id, email: lead.email || "",
            firstName: lead.firstName || "Unknown", lastName: lead.lastName,
            phone: lead.phone, category,
            categoryLabel: CATEGORY_LABELS[category] || category,
            optinDate: lead.miniDiplomaOptinAt?.toISOString(),
            completedDate: lead.miniDiplomaCompletedAt?.toISOString(),
            lessonsCompleted, progress, status,
            hasPaid: lead.enrollments.length > 0,
            revenue: totalRevenue, hasRefund,
            lastActivity: lessonData.lastActivity?.toISOString() || null,
            daysSinceOptin, daysSinceActivity,
            isStuck: lessonsCompleted > 0 && lessonsCompleted < 9 && daysSinceActivity > 7,
            enrolledCourses: lead.enrollments.map(e => e.course?.title || "Unknown"),
            // Source attribution
            leadSource: lead.leadSource || "unknown",
            formVariant: lead.formVariant || "A",
            segment: segmentTag?.tag.replace("segment:", "") || "default",
            leadTier: tierTag?.tag.replace("lead_tier:", "") || "unknown",
            leadScore: parseInt(scoreTag?.tag.replace("lead_score:", "") || "0", 10),
        };
    });

    // Niche summary stats
    const signups = enrichedLeads.length;
    const started = enrichedLeads.filter(l => l.lessonsCompleted > 0).length;
    const completed = enrichedLeads.filter(l => l.lessonsCompleted >= 9).length;
    const paid = enrichedLeads.filter(l => l.hasPaid).length;
    const totalRevenue = enrichedLeads.reduce((sum, l) => sum + l.revenue, 0);

    // Lesson-by-lesson dropoff
    const lessonCounts: Record<number, number> = {};
    for (let i = 1; i <= 9; i++) lessonCounts[i] = 0;
    enrichedLeads.forEach(l => { for (let i = 1; i <= l.lessonsCompleted; i++) lessonCounts[i]++; });

    const dropoffPoints = [];
    let biggestDropoff = { lesson: 0, rate: 0 };
    for (let i = 1; i <= 9; i++) {
        const at = lessonCounts[i] || 0;
        const prev = i === 1 ? started : (lessonCounts[i - 1] || 0);
        const dropRate = prev > 0 ? Math.round(((prev - at) / prev) * 100) : 0;
        dropoffPoints.push({ lesson: i, count: at, dropRate: Math.max(0, dropRate) });
        if (dropRate > biggestDropoff.rate) biggestDropoff = { lesson: i, rate: dropRate };
    }

    // Source breakdown for this niche
    const sourceMap = new Map<string, typeof enrichedLeads>();
    enrichedLeads.forEach(l => {
        const key = `${l.leadSource}|${l.formVariant}|${l.segment}`;
        if (!sourceMap.has(key)) sourceMap.set(key, []);
        sourceMap.get(key)!.push(l);
    });

    const sourceBreakdown = Array.from(sourceMap.entries()).map(([key, leads]) => {
        const parts = key.split("|");
        const s = leads.length;
        const st = leads.filter(l => l.lessonsCompleted > 0).length;
        const c = leads.filter(l => l.lessonsCompleted >= 9).length;
        const p = leads.filter(l => l.hasPaid).length;
        const rev = leads.reduce((sum, l) => sum + l.revenue, 0);
        return {
            key, leadSource: parts[0], leadSourceDetail: slug, formVariant: parts[1], segment: parts[2],
            signups: s, started: st, completed: c, paid: p, revenue: rev,
            startRate: s > 0 ? Math.round((st / s) * 100) : 0,
            completionRate: st > 0 ? Math.round((c / st) * 100) : 0,
            paidConversion: s > 0 ? Math.round((p / s) * 100) : 0,
            revenuePerLead: s > 0 ? Math.round(rev / s) : 0,
            avgLeadScore: s > 0 ? Math.round(leads.reduce((sum, l) => sum + l.leadScore, 0) / s) : 0,
            hotLeads: leads.filter(l => l.leadTier === "hot").length,
            warmLeads: leads.filter(l => l.leadTier === "warm").length,
            coldLeads: leads.filter(l => l.leadTier === "cold").length,
        };
    }).sort((a, b) => b.signups - a.signups);

    // Daily signups (14 days)
    const dailySignups = [];
    for (let i = 13; i >= 0; i--) {
        const dayStart = new Date(now); dayStart.setDate(dayStart.getDate() - i); dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart); dayEnd.setHours(23, 59, 59, 999);
        const count = enrichedLeads.filter(l => l.optinDate && new Date(l.optinDate) >= dayStart && new Date(l.optinDate) <= dayEnd).length;
        dailySignups.push({ date: dayStart.toISOString(), label: dayStart.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }), count });
    }

    // Weekly cohorts (12 weeks)
    const weeklyCohorts = [];
    for (let weekOffset = 0; weekOffset < 12; weekOffset++) {
        const weekEnd = new Date(todayStart); weekEnd.setDate(weekEnd.getDate() - (weekOffset * 7)); weekEnd.setHours(23, 59, 59, 999);
        const ws = new Date(weekEnd); ws.setDate(ws.getDate() - 6); ws.setHours(0, 0, 0, 0);
        const cohort = enrichedLeads.filter(l => l.optinDate && new Date(l.optinDate) >= ws && new Date(l.optinDate) <= weekEnd);
        const cs = cohort.length, cst = cohort.filter(l => l.lessonsCompleted > 0).length;
        const cc = cohort.filter(l => l.lessonsCompleted >= 9).length, cp = cohort.filter(l => l.hasPaid).length;
        weeklyCohorts.push({
            weekStart: ws.toISOString(), weekEnd: weekEnd.toISOString(),
            label: ws.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " - " + weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            signups: cs, started: cst, completed: cc, paid: cp,
            revenue: cohort.reduce((sum, l) => sum + l.revenue, 0),
            startRate: cs > 0 ? Math.round((cst / cs) * 100) : 0,
            completionRate: cst > 0 ? Math.round((cc / cst) * 100) : 0,
            paidConversion: cs > 0 ? Math.round((cp / cs) * 100) : 0,
        });
    }

    const weeklyTrends = {
        labels: weeklyCohorts.map(w => w.label).reverse(),
        signups: weeklyCohorts.map(w => w.signups).reverse(),
        startRate: weeklyCohorts.map(w => w.startRate).reverse(),
        completionRate: weeklyCohorts.map(w => w.completionRate).reverse(),
        paidConversion: weeklyCohorts.map(w => w.paidConversion).reverse(),
        revenue: weeklyCohorts.map(w => w.revenue).reverse(),
    };

    return NextResponse.json({
        niche: {
            slug, name: CATEGORY_LABELS[slug] || slug,
            signups, started, completed, paid, revenue: totalRevenue,
            startRate: signups > 0 ? Math.round((started / signups) * 100) : 0,
            completionRate: started > 0 ? Math.round((completed / started) * 100) : 0,
            overallConversion: signups > 0 ? Math.round((completed / signups) * 100) : 0,
            paidConversion: signups > 0 ? Math.round((paid / signups) * 100) : 0,
            revenuePerLead: signups > 0 ? Math.round(totalRevenue / signups) : 0,
            biggestDropoffLesson: biggestDropoff.lesson,
            biggestDropoffRate: biggestDropoff.rate,
            dropoffPoints,
        },
        leads: enrichedLeads,
        dailySignups,
        weeklyTrends,
        weeklyCohorts,
        stuckLeads: enrichedLeads.filter(l => l.isStuck),
        sourceBreakdown,
    });
}
