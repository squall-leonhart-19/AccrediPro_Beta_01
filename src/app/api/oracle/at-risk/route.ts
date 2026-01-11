import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get real at-risk users
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const days = parseInt(searchParams.get("days") || "7");
        const limit = parseInt(searchParams.get("limit") || "50");

        const threshold = new Date();
        threshold.setDate(threshold.getDate() - days);

        // Get users who:
        // 1. Are real (not fake profiles)
        // 2. Haven't logged in for X days
        // 3. Have active enrollments (so they have something to come back to)
        const atRiskUsers = await prisma.user.findMany({
            where: {
                isFakeProfile: false,
                lastLoginAt: {
                    lt: threshold,
                    not: null,
                },
                enrollments: {
                    some: {
                        status: { in: ["ACTIVE", "ENROLLED"] },
                    },
                },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                lastLoginAt: true,
                createdAt: true,
                enrollments: {
                    where: { status: { in: ["ACTIVE", "ENROLLED"] } },
                    select: {
                        progress: true,
                        course: { select: { title: true } },
                    },
                    take: 1,
                },
            },
            orderBy: { lastLoginAt: "asc" },
            take: limit,
        });

        // Calculate churn risk based on inactivity
        const usersWithRisk = atRiskUsers.map((user) => {
            const daysSinceLogin = user.lastLoginAt
                ? Math.floor((Date.now() - new Date(user.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24))
                : 30;

            // Risk calculation: more days = higher risk
            let churnRisk = Math.min(95, 30 + daysSinceLogin * 3);

            // Adjust based on progress
            const progress = user.enrollments[0]?.progress || 0;
            if (progress < 10) churnRisk += 10;
            else if (progress > 50) churnRisk -= 10;

            return {
                id: user.id,
                name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown",
                email: user.email,
                avatar: user.avatar,
                lastLoginAt: user.lastLoginAt,
                daysSinceLogin,
                churnRisk: Math.min(99, Math.max(10, churnRisk)),
                course: user.enrollments[0]?.course?.title || "No active course",
                progress: progress,
            };
        });

        return NextResponse.json({
            success: true,
            count: usersWithRisk.length,
            users: usersWithRisk,
        });
    } catch (error) {
        console.error("At-risk users error:", error);
        return NextResponse.json(
            { error: "Failed to fetch at-risk users" },
            { status: 500 }
        );
    }
}
