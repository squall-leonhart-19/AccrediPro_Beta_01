import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Health status thresholds (in days)
const HEALTHY_THRESHOLD = 7;
const AT_RISK_THRESHOLD = 30;
const CHURNING_THRESHOLD = 60;

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const now = new Date();
        const healthyDate = new Date(now.getTime() - HEALTHY_THRESHOLD * 24 * 60 * 60 * 1000);
        const atRiskDate = new Date(now.getTime() - AT_RISK_THRESHOLD * 24 * 60 * 60 * 1000);
        const churningDate = new Date(now.getTime() - CHURNING_THRESHOLD * 24 * 60 * 60 * 1000);

        // Get real users only (not fake profiles)
        const users = await prisma.user.findMany({
            where: {
                isFakeProfile: false,
                email: { not: null }
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                lastLoginAt: true,
                createdAt: true,
                _count: {
                    select: {
                        enrollments: true,
                        certificates: true,
                    }
                },
                enrollments: {
                    select: {
                        progress: true,
                        status: true,
                    }
                },
            },
        });

        // Categorize users
        const healthy: typeof users = [];
        const atRisk: typeof users = [];
        const churning: typeof users = [];
        const lost: typeof users = [];

        for (const user of users) {
            const lastLogin = user.lastLoginAt ? new Date(user.lastLoginAt) : null;
            const avgProgress = user.enrollments.length > 0
                ? user.enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / user.enrollments.length
                : 0;

            if (!lastLogin) {
                // Never logged in
                lost.push(user);
            } else if (lastLogin > healthyDate && avgProgress >= 30) {
                // Logged in within 7 days and making progress
                healthy.push(user);
            } else if (lastLogin > atRiskDate) {
                // Logged in 7-30 days ago
                atRisk.push(user);
            } else if (lastLogin > churningDate) {
                // Logged in 30-60 days ago
                churning.push(user);
            } else {
                // No login for 60+ days
                lost.push(user);
            }
        }

        // Calculate trends (compare to 30 days ago - simplified)
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const newUsersLast30 = users.filter(u => new Date(u.createdAt) > thirtyDaysAgo).length;

        return NextResponse.json({
            stats: {
                healthy: healthy.length,
                atRisk: atRisk.length,
                churning: churning.length,
                lost: lost.length,
                total: users.length,
                newUsersLast30,
            },
            users: {
                healthy: healthy.slice(0, 20),
                atRisk: atRisk.slice(0, 20),
                churning: churning.slice(0, 20),
                lost: lost.slice(0, 20),
            },
            thresholds: {
                healthy: HEALTHY_THRESHOLD,
                atRisk: AT_RISK_THRESHOLD,
                churning: CHURNING_THRESHOLD,
            }
        });
    } catch (error) {
        console.error("Error fetching health data:", error);
        return NextResponse.json({ error: "Failed to fetch health data" }, { status: 500 });
    }
}
