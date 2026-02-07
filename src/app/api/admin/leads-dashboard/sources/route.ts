import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ALL_TAG_PREFIXES = [
    "wh-lesson-complete", "whh-lesson-complete",
    "functional-medicine-lesson-complete", "gut-health-lesson-complete",
    "health-coach-lesson-complete", "holistic-nutrition-lesson-complete",
    "hormone-health-lesson-complete", "nurse-coach-lesson-complete",
    "adhd-coaching-lesson-complete",
    "energy-healing-lesson-complete", "christian-coaching-lesson-complete",
    "reiki-healing-lesson-complete", "pet-nutrition-lesson-complete",
    "spiritual-healing-lesson-complete",
];

function countLessonsFromTags(tags: { tag: string; createdAt: Date }[]) {
    const completedLessons = new Set<number>();
    for (const t of tags) {
        for (const prefix of ALL_TAG_PREFIXES) {
            if (t.tag.startsWith(prefix + ":")) {
                const n = parseInt(t.tag.replace(prefix + ":", ""), 10);
                if (!isNaN(n) && n >= 1 && n <= 9) completedLessons.add(n);
                break;
            }
        }
    }
    return completedLessons.size;
}

interface GroupStats {
    signups: number;
    started: number;
    completed: number;
    paid: number;
    revenue: number;
    startRate: number;
    completionRate: number;
    paidConversion: number;
    revenuePerLead: number;
    avgLeadScore: number;
    hotLeads: number;
    warmLeads: number;
    coldLeads: number;
}

function computeGroupStats(leads: {
    lessonsCompleted: number;
    hasPaid: boolean;
    revenue: number;
    leadScore: number;
    leadTier: string;
}[]): GroupStats {
    const s = leads.length;
    const st = leads.filter(l => l.lessonsCompleted > 0).length;
    const c = leads.filter(l => l.lessonsCompleted >= 3).length;
    const p = leads.filter(l => l.hasPaid).length;
    const rev = leads.reduce((sum, l) => sum + l.revenue, 0);
    return {
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
}

/**
 * GET /api/admin/leads-dashboard/sources
 * Returns form/source attribution analytics
 */
export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    if (!["ADMIN", "SUPERUSER", "INSTRUCTOR", "MENTOR", "SUPPORT"].includes(user?.role || "")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get("range") || "all";

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let dateFilter: Date | undefined;
    if (dateRange === "today") dateFilter = todayStart;
    else if (dateRange === "week") { const d = new Date(todayStart); d.setDate(d.getDate() - 7); dateFilter = d; }
    else if (dateRange === "month") dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
    else if (dateRange === "90days") { const d = new Date(todayStart); d.setDate(d.getDate() - 90); dateFilter = d; }

    const leads = await prisma.user.findMany({
        where: {
            miniDiplomaOptinAt: { not: null, ...(dateFilter ? { gte: dateFilter } : {}) },
            isFakeProfile: { not: true },
            email: { not: { contains: "@test" } },
        },
        select: {
            id: true, leadSource: true, leadSourceDetail: true, formVariant: true,
            miniDiplomaCategory: true,
            tags: { select: { tag: true, createdAt: true } },
            enrollments: {
                where: { course: { OR: [{ slug: { contains: "certification" } }, { slug: { contains: "accelerator" } }] } },
                select: { id: true },
            },
            payments: {
                where: { status: "COMPLETED", course: { OR: [{ slug: { contains: "certification" } }, { slug: { contains: "accelerator" } }] } },
                select: { amount: true, refundAmount: true },
            },
        },
    });

    // Enrich
    const enriched = leads.map(l => {
        const lessonsCompleted = countLessonsFromTags(l.tags);
        const revenue = l.payments.reduce((sum, p) => sum + (Number(p.amount) || 0) - (Number(p.refundAmount) || 0), 0);
        const segmentTag = l.tags.find(t => t.tag.startsWith("segment:"));
        const tierTag = l.tags.find(t => t.tag.startsWith("lead_tier:"));
        const scoreTag = l.tags.find(t => t.tag.startsWith("lead_score:"));
        return {
            leadSource: l.leadSource || "unknown",
            leadSourceDetail: l.leadSourceDetail || l.miniDiplomaCategory || "unknown",
            formVariant: l.formVariant || "A",
            segment: segmentTag?.tag.replace("segment:", "") || "default",
            leadTier: tierTag?.tag.replace("lead_tier:", "") || "unknown",
            leadScore: parseInt(scoreTag?.tag.replace("lead_score:", "") || "0", 10),
            lessonsCompleted,
            hasPaid: l.enrollments.length > 0,
            revenue,
        };
    });

    // Group by full entry point: source|detail|variant|segment
    const sourceMap = new Map<string, typeof enriched>();
    enriched.forEach(l => {
        const key = `${l.leadSource}|${l.leadSourceDetail}|${l.formVariant}|${l.segment}`;
        if (!sourceMap.has(key)) sourceMap.set(key, []);
        sourceMap.get(key)!.push(l);
    });

    const sources = Array.from(sourceMap.entries())
        .map(([key, group]) => {
            const parts = key.split("|");
            return {
                key,
                leadSource: parts[0],
                leadSourceDetail: parts[1],
                formVariant: parts[2],
                segment: parts[3],
                ...computeGroupStats(group),
            };
        })
        .sort((a, b) => b.signups - a.signups);

    // Group by variant (A/B test)
    const variantMap = new Map<string, typeof enriched>();
    enriched.forEach(l => {
        if (!variantMap.has(l.formVariant)) variantMap.set(l.formVariant, []);
        variantMap.get(l.formVariant)!.push(l);
    });
    const byVariant = Array.from(variantMap.entries())
        .map(([variant, group]) => ({ variant, stats: computeGroupStats(group) }))
        .sort((a, b) => b.stats.signups - a.stats.signups);

    // Group by segment
    const segmentMap = new Map<string, typeof enriched>();
    enriched.forEach(l => {
        if (!segmentMap.has(l.segment)) segmentMap.set(l.segment, []);
        segmentMap.get(l.segment)!.push(l);
    });
    const bySegment = Array.from(segmentMap.entries())
        .map(([segment, group]) => ({ segment, stats: computeGroupStats(group) }))
        .sort((a, b) => b.stats.signups - a.stats.signups);

    // Group by source (leadSource + leadSourceDetail)
    const bySourceMap = new Map<string, typeof enriched>();
    enriched.forEach(l => {
        const key = `${l.leadSource}|${l.leadSourceDetail}`;
        if (!bySourceMap.has(key)) bySourceMap.set(key, []);
        bySourceMap.get(key)!.push(l);
    });
    const bySource = Array.from(bySourceMap.entries())
        .map(([source, group]) => ({ source, stats: computeGroupStats(group) }))
        .sort((a, b) => b.stats.signups - a.stats.signups);

    return NextResponse.json({ sources, byVariant, bySegment, bySource });
}
