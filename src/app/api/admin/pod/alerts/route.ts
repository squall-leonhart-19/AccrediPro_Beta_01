import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/pod/alerts - Get at-risk users and engagement alerts
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const now = new Date();
        const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Get all FM certified users (those with the tag)
        const fmTag = await prisma.marketingTag.findFirst({
            where: { slug: "functional_medicine_complete_certification_purchased" },
        });

        if (!fmTag) {
            return NextResponse.json({
                alerts: [],
                summary: { atRisk: 0, inactive: 0, neverEngaged: 0 },
            });
        }

        // Get all users with FM certification
        const fmUsers = await prisma.userMarketingTag.findMany({
            where: { tagId: fmTag.id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        createdAt: true,
                    },
                },
            },
        });

        const userIds = fmUsers.map((u) => u.user.id);

        // Get last engagement for each user
        const lastEngagements = await prisma.podEngagement.groupBy({
            by: ["userId"],
            where: {
                userId: { in: userIds },
            },
            _max: {
                createdAt: true,
            },
        });

        const engagementMap = new Map<string, Date | null>(
            lastEngagements.map((e) => [e.userId, e._max.createdAt as Date | null])
        );

        // Get users who have sent messages
        const usersWithMessages = await prisma.podUserMessage.groupBy({
            by: ["userId"],
            where: {
                userId: { in: userIds },
            },
            _count: true,
        });

        const messageCountMap = new Map<string, number>(
            usersWithMessages.map((u) => [u.userId, (u as any)._count?.id || (u as any)._count || 0])
        );

        // Categorize users
        const alerts: Array<{
            id: string;
            name: string;
            email: string;
            enrolledAt: string;
            daysSinceEnrollment: number;
            lastEngagement: string | null;
            daysSinceLastEngagement: number | null;
            messageCount: number;
            alertType: "never_engaged" | "inactive_7_days" | "at_risk_3_days" | "no_messages";
            severity: "high" | "medium" | "low";
        }> = [];

        fmUsers.forEach((userTag) => {
            const user = userTag.user;
            const lastEngagement = engagementMap.get(user.id);
            const messageCount = messageCountMap.get(user.id) || 0;
            const daysSinceEnrollment = Math.floor(
                (now.getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
            );

            let alertType: typeof alerts[0]["alertType"] | null = null;
            let severity: typeof alerts[0]["severity"] = "low";

            if (!lastEngagement) {
                // Never visited the pod
                if (daysSinceEnrollment >= 3) {
                    alertType = "never_engaged";
                    severity = "high";
                }
            } else {
                const lastEngagementDate = lastEngagement as Date;
                const daysSinceLastEngagement = Math.floor(
                    (now.getTime() - lastEngagementDate.getTime()) / (1000 * 60 * 60 * 24)
                );

                if (daysSinceLastEngagement >= 7) {
                    alertType = "inactive_7_days";
                    severity = "high";
                } else if (daysSinceLastEngagement >= 3) {
                    alertType = "at_risk_3_days";
                    severity = "medium";
                } else if (messageCount === 0 && daysSinceEnrollment >= 5) {
                    alertType = "no_messages";
                    severity = "low";
                }
            }

            if (alertType) {
                alerts.push({
                    id: user.id,
                    name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown",
                    email: user.email,
                    enrolledAt: user.createdAt.toISOString(),
                    daysSinceEnrollment,
                    lastEngagement: lastEngagement ? (lastEngagement as Date).toISOString() : null,
                    daysSinceLastEngagement: lastEngagement
                        ? Math.floor((now.getTime() - (lastEngagement as Date).getTime()) / (1000 * 60 * 60 * 24))
                        : null,
                    messageCount: typeof messageCount === 'number' ? messageCount : 0,
                    alertType,
                    severity,
                });
            }
        });

        // Sort by severity and then by days
        alerts.sort((a, b) => {
            const severityOrder = { high: 0, medium: 1, low: 2 };
            if (severityOrder[a.severity] !== severityOrder[b.severity]) {
                return severityOrder[a.severity] - severityOrder[b.severity];
            }
            return (b.daysSinceLastEngagement || b.daysSinceEnrollment) -
                (a.daysSinceLastEngagement || a.daysSinceEnrollment);
        });

        // Summary counts
        const summary = {
            totalFmUsers: fmUsers.length,
            atRisk: alerts.filter((a) => a.severity === "high").length,
            inactive: alerts.filter((a) => a.alertType === "inactive_7_days").length,
            neverEngaged: alerts.filter((a) => a.alertType === "never_engaged").length,
            noMessages: alerts.filter((a) => a.alertType === "no_messages").length,
        };

        return NextResponse.json({
            alerts: alerts.slice(0, 50), // Limit to top 50
            summary,
        });
    } catch (error) {
        console.error("[Pod Alerts] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
