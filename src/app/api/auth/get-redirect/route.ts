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

        // Check if user has the womens-health-mini-diploma enrollment (lead)
        const leadEnrollment = await prisma.enrollment.findFirst({
            where: {
                userId: session.user.id,
                course: { slug: "womens-health-mini-diploma" },
            },
        });

        // Check if user has any other paid enrollments
        const paidEnrollments = await prisma.enrollment.count({
            where: {
                userId: session.user.id,
                course: {
                    slug: { not: "womens-health-mini-diploma" }
                },
            },
        });

        // If user ONLY has the lead enrollment (mini-diploma), redirect to lead portal
        if (leadEnrollment && paidEnrollments === 0) {
            return NextResponse.json({ redirectUrl: "/womens-health-diploma" });
        }

        // Otherwise, redirect to main dashboard
        return NextResponse.json({ redirectUrl: "/dashboard" });

    } catch (error) {
        console.error("[GET-REDIRECT] Error:", error);
        return NextResponse.json({ redirectUrl: "/dashboard" });
    }
}
