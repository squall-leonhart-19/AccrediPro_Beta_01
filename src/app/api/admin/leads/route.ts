import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/leads
 *
 * Returns all mini diploma leads (users who opted in via register-freebie)
 * Separate from purchases - only users with miniDiplomaOptinAt
 */
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin/instructor access
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    if (!["ADMIN", "INSTRUCTOR", "MENTOR"].includes(user?.role || "")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all mini diploma leads (not purchases)
    const leads = await prisma.user.findMany({
        where: {
            miniDiplomaOptinAt: { not: null },
            isFakeProfile: { not: true },
            email: { not: { contains: "@test" } },
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            miniDiplomaCategory: true,
            miniDiplomaOptinAt: true,
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
                select: { id: true, courseId: true },
            },
        },
        orderBy: { miniDiplomaOptinAt: "desc" },
    });

    // Calculate progress for each lead based on their tags
    const enrichedLeads = leads.map((lead) => {
        // Find lesson completion tags for their category
        const category = lead.miniDiplomaCategory || "womens-health";
        const tagPrefix = getTagPrefixForCategory(category);

        const lessonTags = lead.tags.filter((t) => t.tag.startsWith(tagPrefix));
        const lessonCompleted = lessonTags.length;
        const totalLessons = 9; // Default mini diploma has 9 lessons
        const progress = Math.round((lessonCompleted / totalLessons) * 100);

        // Get last activity
        const lastLessonTag = lessonTags.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        return {
            id: lead.id,
            email: lead.email,
            firstName: lead.firstName || "Unknown",
            lastName: lead.lastName,
            phone: lead.phone,
            miniDiplomaCategory: lead.miniDiplomaCategory,
            miniDiplomaOptinAt: lead.miniDiplomaOptinAt?.toISOString(),
            createdAt: lead.createdAt.toISOString(),
            progress,
            lessonCompleted,
            lastActivity: lastLessonTag?.createdAt.toISOString() || null,
            hasConvertedToPurchase: lead.enrollments.length > 0,
        };
    });

    // Calculate stats
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
        total: enrichedLeads.length,
        today: enrichedLeads.filter(
            (l) => l.miniDiplomaOptinAt && new Date(l.miniDiplomaOptinAt) >= todayStart
        ).length,
        thisWeek: enrichedLeads.filter(
            (l) => l.miniDiplomaOptinAt && new Date(l.miniDiplomaOptinAt) >= weekStart
        ).length,
        thisMonth: enrichedLeads.filter(
            (l) => l.miniDiplomaOptinAt && new Date(l.miniDiplomaOptinAt) >= monthStart
        ).length,
        byCategory: getCategoryStats(enrichedLeads),
        conversionRate: enrichedLeads.length > 0
            ? Math.round(
                (enrichedLeads.filter((l) => l.hasConvertedToPurchase).length / enrichedLeads.length) * 100
            )
            : 0,
    };

    return NextResponse.json({ leads: enrichedLeads, stats });
}

function getTagPrefixForCategory(category: string): string {
    const prefixMap: Record<string, string> = {
        "womens-health": "wh-lesson-complete:",
        "functional-medicine": "functional-medicine-lesson-complete:",
        "gut-health": "gut-health-lesson-complete:",
        "hormone-health": "hormone-health-lesson-complete:",
        "holistic-nutrition": "holistic-nutrition-lesson-complete:",
        "nurse-coach": "nurse-coach-lesson-complete:",
        "health-coach": "health-coach-lesson-complete:",
    };
    return prefixMap[category] || "wh-lesson-complete:";
}

function getCategoryStats(leads: Array<{ miniDiplomaCategory: string | null }>) {
    const counts: Record<string, number> = {};
    leads.forEach((lead) => {
        const category = lead.miniDiplomaCategory || "unknown";
        counts[category] = (counts[category] || 0) + 1;
    });

    return Object.entries(counts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);
}
