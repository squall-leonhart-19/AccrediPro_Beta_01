import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ redirectUrl: "/login" });
        }

        // Get user's role from database (session.user.role may be stale)
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        // ADMIN role: Go directly to admin panel (no student dashboard access)
        if (user?.role === "ADMIN") {
            return NextResponse.json({ redirectUrl: "/admin" });
        }

        // SUPERUSER role: Can see both, default to dashboard but can access admin
        // INSTRUCTOR/MENTOR: Same as SUPERUSER
        // They can navigate to /admin if needed

        // Mini diploma course slugs mapped to portal slugs
        const miniDiplomaMap: Record<string, string> = {
            "womens-health-mini-diploma": "womens-health",
            "womens-hormone-health-mini-diploma": "womens-hormone-health",
            "functional-medicine-mini-diploma": "functional-medicine",
            "gut-health-mini-diploma": "gut-health",
            "hormone-health-mini-diploma": "hormone-health",
            "holistic-nutrition-mini-diploma": "holistic-nutrition",
            "nurse-coach-mini-diploma": "nurse-coach",
            "health-coach-mini-diploma": "health-coach",
            "energy-healing-mini-diploma": "energy-healing",
            "christian-coaching-mini-diploma": "christian-coaching",
            "reiki-healing-mini-diploma": "reiki-healing",
            "adhd-coaching-mini-diploma": "adhd-coaching",
            "pet-nutrition-mini-diploma": "pet-nutrition",
            "spiritual-healing-mini-diploma": "spiritual-healing",
            "integrative-health-mini-diploma": "integrative-health",
            "life-coaching-mini-diploma": "life-coaching",
        };

        const miniDiplomaSlugs = Object.keys(miniDiplomaMap);

        // Check if user has a mini diploma enrollment (lead)
        const leadEnrollment = await prisma.enrollment.findFirst({
            where: {
                userId: session.user.id,
                course: { slug: { in: miniDiplomaSlugs } },
            },
            include: {
                course: { select: { slug: true } },
            },
            orderBy: { enrolledAt: 'desc' }, // Get most recent enrollment
        });

        // Check if user has any other paid enrollments
        const paidEnrollments = await prisma.enrollment.count({
            where: {
                userId: session.user.id,
                course: {
                    slug: { notIn: miniDiplomaSlugs }
                },
            },
        });

        // If user ONLY has a lead enrollment (mini-diploma), redirect to that portal
        if (leadEnrollment && paidEnrollments === 0) {
            const courseSlug = leadEnrollment.course?.slug || "womens-health-mini-diploma";
            const portalSlug = miniDiplomaMap[courseSlug] || "womens-health";
            return NextResponse.json({ redirectUrl: `/portal/${portalSlug}` });
        }

        // Otherwise, redirect to main dashboard
        return NextResponse.json({ redirectUrl: "/dashboard" });

    } catch (error) {
        console.error("[GET-REDIRECT] Error:", error);
        return NextResponse.json({ redirectUrl: "/dashboard" });
    }
}
