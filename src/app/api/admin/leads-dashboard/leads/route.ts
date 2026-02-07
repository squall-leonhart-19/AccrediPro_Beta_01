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

const CATEGORY_LABELS: Record<string, string> = {
    "womens-health": "Women's Health", "womens-hormone-health": "Women's Hormone Health",
    "functional-medicine": "Functional Medicine", "fm-healthcare": "FM Healthcare",
    "gut-health": "Gut Health", "health-coach": "Health Coach",
    "holistic-nutrition": "Holistic Nutrition", "hormone-health": "Hormone Health",
    "energy-healing": "Energy Healing", "christian-coaching": "Christian Coaching",
    "reiki-healing": "Reiki Healing", "adhd-coaching": "ADHD Coaching",
    "pet-nutrition": "Pet Nutrition", "spiritual-healing": "Spiritual Healing",
    "unknown": "Unknown/Legacy",
};

function countLessonsFromTags(tags: { tag: string; createdAt: Date }[]) {
    const completedLessons = new Set<number>();
    let lastActivity: Date | null = null;
    for (const t of tags) {
        for (const prefix of ALL_TAG_PREFIXES) {
            if (t.tag.startsWith(prefix + ":")) {
                const n = parseInt(t.tag.replace(prefix + ":", ""), 10);
                if (!isNaN(n) && n >= 1 && n <= 9) {
                    completedLessons.add(n);
                    if (!lastActivity || t.createdAt > lastActivity) lastActivity = t.createdAt;
                }
                break;
            }
        }
    }
    return { lessonsCompleted: completedLessons.size, lastActivity };
}

/**
 * GET /api/admin/leads-dashboard/leads?page=1&limit=50&niche=all&status=all&search=&sort=newest
 * Paginated leads endpoint
 */
export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    if (!["ADMIN", "SUPERUSER", "INSTRUCTOR", "MENTOR", "SUPPORT"].includes(user?.role || "")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const niche = searchParams.get("niche") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);

    const now = new Date();

    const leads = await prisma.user.findMany({
        where: {
            miniDiplomaOptinAt: { not: null },
            isFakeProfile: { not: true },
            email: { not: { contains: "@test" } },
            ...(niche !== "all" ? { miniDiplomaCategory: niche } : {}),
        },
        select: {
            id: true, email: true, firstName: true, lastName: true, phone: true,
            miniDiplomaCategory: true, miniDiplomaOptinAt: true, miniDiplomaCompletedAt: true,
            createdAt: true,
            tags: { select: { tag: true, createdAt: true } },
            enrollments: {
                where: { course: { OR: [{ slug: { contains: "certification" } }, { slug: { contains: "accelerator" } }] } },
                select: { id: true, course: { select: { title: true } } },
            },
            payments: {
                where: { status: "COMPLETED", course: { OR: [{ slug: { contains: "certification" } }, { slug: { contains: "accelerator" } }] } },
                select: { amount: true, refundedAt: true, refundAmount: true },
            },
        },
        orderBy: { miniDiplomaOptinAt: "desc" },
    });

    const enriched = leads.map(lead => {
        const category = lead.miniDiplomaCategory || "unknown";
        const { lessonsCompleted, lastActivity } = countLessonsFromTags(lead.tags);
        const progress = Math.min(100, Math.round((lessonsCompleted / 3) * 100));
        const revenue = lead.payments.reduce((sum, p) => sum + (Number(p.amount) || 0) - (Number(p.refundAmount) || 0), 0);
        const hasRefund = lead.payments.some(p => p.refundedAt);
        const hasPaid = lead.enrollments.length > 0;

        let status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PAID" | "REFUNDED";
        if (hasRefund && revenue <= 0) status = "REFUNDED";
        else if (hasPaid) status = "PAID";
        else if (lessonsCompleted >= 3) status = "COMPLETED";
        else if (lessonsCompleted > 0) status = "IN_PROGRESS";
        else status = "NOT_STARTED";

        const daysSinceOptin = lead.miniDiplomaOptinAt ? Math.floor((now.getTime() - new Date(lead.miniDiplomaOptinAt).getTime()) / 86400000) : 0;
        const daysSinceActivity = lastActivity ? Math.floor((now.getTime() - lastActivity.getTime()) / 86400000) : daysSinceOptin;

        return {
            id: lead.id, email: lead.email || "", firstName: lead.firstName || "Unknown",
            lastName: lead.lastName, phone: lead.phone, category,
            categoryLabel: CATEGORY_LABELS[category] || category,
            optinDate: lead.miniDiplomaOptinAt?.toISOString(),
            completedDate: lead.miniDiplomaCompletedAt?.toISOString(),
            lessonsCompleted, progress, status, hasPaid, revenue, hasRefund,
            lastActivity: lastActivity?.toISOString() || null,
            daysSinceOptin, daysSinceActivity,
            isStuck: lessonsCompleted > 0 && lessonsCompleted < 3 && daysSinceActivity > 7,
            enrolledCourses: lead.enrollments.map(e => e.course?.title || "Unknown"),
        };
    });

    const total = enriched.length;
    const startIdx = (page - 1) * limit;
    const paged = enriched.slice(startIdx, startIdx + limit);

    return NextResponse.json({
        leads: paged,
        total,
        page,
        limit,
        hasMore: startIdx + limit < total,
    });
}
