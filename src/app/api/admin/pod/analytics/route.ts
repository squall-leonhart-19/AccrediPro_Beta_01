import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/pod/analytics - Get pod engagement analytics
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get("days") || "14");
        const since = new Date();
        since.setDate(since.getDate() - days);

        // Get all engagement events in period
        const allEvents = await prisma.podEngagement.findMany({
            where: {
                createdAt: { gte: since },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Aggregate stats
        const totalVisits = allEvents.filter((e) => e.eventType === "visit").length;
        const totalMessages = allEvents.filter((e) => e.eventType === "message").length;
        const totalReactions = allEvents.filter((e) => e.eventType === "reaction").length;
        const totalDfyClicks = allEvents.filter((e) => e.eventType === "dfy_click").length;
        const totalEducationalViews = allEvents.filter((e) => e.eventType === "educational_view").length;

        // Unique users
        const uniqueUsers = new Set(allEvents.map((e) => e.userId)).size;

        // Daily breakdown for chart
        const dailyStats: Record<string, { visits: number; messages: number; reactions: number; users: Set<string> }> = {};

        allEvents.forEach((event) => {
            const dateKey = event.createdAt.toISOString().split("T")[0];
            if (!dailyStats[dateKey]) {
                dailyStats[dateKey] = { visits: 0, messages: 0, reactions: 0, users: new Set() };
            }
            dailyStats[dateKey].users.add(event.userId);

            if (event.eventType === "visit") dailyStats[dateKey].visits++;
            if (event.eventType === "message") dailyStats[dateKey].messages++;
            if (event.eventType === "reaction") dailyStats[dateKey].reactions++;
        });

        // Convert to array for chart
        const dailyChart = Object.entries(dailyStats)
            .map(([date, stats]) => ({
                date,
                visits: stats.visits,
                messages: stats.messages,
                reactions: stats.reactions,
                uniqueUsers: stats.users.size,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // User engagement breakdown - days since enrollment
        const dayDistribution: Record<string, number> = {};
        allEvents
            .filter((e) => e.eventType === "visit")
            .forEach((event) => {
                const daysSinceEnrollment = (event.metadata as any)?.daysSinceEnrollment;
                if (daysSinceEnrollment !== undefined) {
                    const dayKey = `Day ${daysSinceEnrollment}`;
                    dayDistribution[dayKey] = (dayDistribution[dayKey] || 0) + 1;
                }
            });

        // Top engaged users
        const userEngagement: Record<string, { name: string; email: string; events: number; messages: number; reactions: number }> = {};
        allEvents.forEach((event) => {
            const userId = event.userId;
            if (!userEngagement[userId]) {
                userEngagement[userId] = {
                    name: `${event.user.firstName || ""} ${event.user.lastName || ""}`.trim() || "Unknown",
                    email: event.user.email,
                    events: 0,
                    messages: 0,
                    reactions: 0,
                };
            }
            userEngagement[userId].events++;
            if (event.eventType === "message") userEngagement[userId].messages++;
            if (event.eventType === "reaction") userEngagement[userId].reactions++;
        });

        const topUsers = Object.entries(userEngagement)
            .map(([id, data]) => ({ id, ...data }))
            .sort((a, b) => b.events - a.events)
            .slice(0, 10);

        // Recent activity feed
        const recentActivity = allEvents.slice(0, 50).map((event) => ({
            id: event.id,
            eventType: event.eventType,
            userName: `${event.user.firstName || ""} ${event.user.lastName || ""}`.trim() || "Unknown",
            email: event.user.email,
            metadata: event.metadata,
            createdAt: event.createdAt,
        }));

        return NextResponse.json({
            summary: {
                totalVisits,
                totalMessages,
                totalReactions,
                totalDfyClicks,
                totalEducationalViews,
                uniqueUsers,
                period: `Last ${days} days`,
            },
            dailyChart,
            dayDistribution,
            topUsers,
            recentActivity,
        });
    } catch (error) {
        console.error("[Pod Analytics] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
