import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Dashboard stats for Oracle (uses existing tables)
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const thisWeek = new Date();
        thisWeek.setDate(thisWeek.getDate() - 7);

        // Get real stats from existing tables (not Oracle tables)
        const [
            totalUsers,
            activeThisWeek,
            newThisWeek,
            completions,
            enrollments,
            messages,
        ] = await Promise.all([
            // Total real users (not fake)
            prisma.user.count({
                where: {
                    isFakeProfile: false,
                    email: { not: null },
                },
            }),

            // Active this week (logged in)
            prisma.user.count({
                where: {
                    lastLoginAt: { gte: thisWeek },
                    isFakeProfile: false,
                },
            }),

            // New users this week
            prisma.user.count({
                where: {
                    createdAt: { gte: thisWeek },
                    isFakeProfile: false,
                },
            }),

            // Course completions
            prisma.enrollment.count({
                where: {
                    status: "COMPLETED",
                },
            }),

            // Total enrollments
            prisma.enrollment.count(),

            // Total messages sent
            prisma.message.count(),
        ]);

        // Try to get Oracle-specific stats (may fail if tables don't exist)
        let oracleStats = {
            eventsToday: 0,
            actionsThisWeek: 0,
            pendingActions: 0,
            activeSegments: 0,
        };

        try {
            const [eventsToday, actionsWeek, pending, active] = await Promise.all([
                prisma.oracleEvent.count({
                    where: { createdAt: { gte: today } },
                }),
                prisma.oracleAction.count({
                    where: {
                        status: "executed",
                        createdAt: { gte: thisWeek },
                    },
                }),
                prisma.oracleAction.count({
                    where: { status: "pending" },
                }),
                prisma.oracleSegment.count({
                    where: { engagementLevel: "active" },
                }),
            ]);

            oracleStats = {
                eventsToday,
                actionsThisWeek: actionsWeek,
                pendingActions: pending,
                activeSegments: active,
            };
        } catch (e) {
            // Oracle tables not yet created - that's ok
            console.log("[Oracle] Tables not yet created, using fallback stats");
        }

        return NextResponse.json({
            // Real stats from existing tables
            totalUsers,
            activeThisWeek,
            newThisWeek,
            completions,
            enrollments,
            messages,

            // Oracle-specific (may be 0 if tables don't exist)
            ...oracleStats,

            // Calculated metrics
            engagementRate: totalUsers > 0
                ? Math.round((activeThisWeek / totalUsers) * 100)
                : 0,
            completionRate: enrollments > 0
                ? Math.round((completions / enrollments) * 100)
                : 0,
        });
    } catch (error) {
        console.error("Error fetching Oracle stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
