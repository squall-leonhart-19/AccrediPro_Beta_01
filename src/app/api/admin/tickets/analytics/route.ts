import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get ticket analytics
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get all tickets for stats
    const [
      totalTickets,
      openTickets,
      resolvedLast30Days,
      ticketsLast7Days,
      ticketsLast30Days,
      avgRating,
      ticketsByCategory,
      ticketsByPriority,
      recentRatings,
      responseTimeData,
    ] = await Promise.all([
      // Total tickets
      prisma.supportTicket.count(),

      // Currently open (NEW, OPEN, PENDING)
      prisma.supportTicket.count({
        where: { status: { in: ["NEW", "OPEN", "PENDING"] } },
      }),

      // Resolved in last 30 days
      prisma.supportTicket.count({
        where: {
          status: { in: ["RESOLVED", "CLOSED"] },
          resolvedAt: { gte: thirtyDaysAgo },
        },
      }),

      // New tickets last 7 days
      prisma.supportTicket.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),

      // New tickets last 30 days
      prisma.supportTicket.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),

      // Average rating
      prisma.supportTicket.aggregate({
        where: { rating: { not: null } },
        _avg: { rating: true },
        _count: { rating: true },
      }),

      // Tickets by category
      prisma.supportTicket.groupBy({
        by: ["category"],
        _count: { category: true },
      }),

      // Tickets by priority
      prisma.supportTicket.groupBy({
        by: ["priority"],
        _count: { priority: true },
      }),

      // Recent ratings with comments
      prisma.supportTicket.findMany({
        where: {
          rating: { not: null },
          ratingComment: { not: null },
        },
        select: {
          ticketNumber: true,
          rating: true,
          ratingComment: true,
          ratedAt: true,
          customerName: true,
          subject: true,
        },
        orderBy: { ratedAt: "desc" },
        take: 5,
      }),

      // Get tickets with first response time for average calculation
      prisma.supportTicket.findMany({
        where: {
          firstResponseAt: { not: null },
          createdAt: { gte: thirtyDaysAgo },
        },
        select: {
          createdAt: true,
          firstResponseAt: true,
        },
      }),
    ]);

    // Calculate average first response time in hours
    let avgResponseTimeHours = 0;
    if (responseTimeData.length > 0) {
      const totalMs = responseTimeData.reduce((sum, ticket) => {
        if (ticket.firstResponseAt) {
          return sum + (ticket.firstResponseAt.getTime() - ticket.createdAt.getTime());
        }
        return sum;
      }, 0);
      avgResponseTimeHours = Math.round((totalMs / responseTimeData.length) / (1000 * 60 * 60) * 10) / 10;
    }

    // Format category stats
    const categoryStats = ticketsByCategory.reduce(
      (acc, item) => {
        acc[item.category] = item._count.category;
        return acc;
      },
      {} as Record<string, number>
    );

    // Format priority stats
    const priorityStats = ticketsByPriority.reduce(
      (acc, item) => {
        acc[item.priority] = item._count.priority;
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({
      overview: {
        total: totalTickets,
        open: openTickets,
        resolvedLast30Days,
        newLast7Days: ticketsLast7Days,
        newLast30Days: ticketsLast30Days,
      },
      satisfaction: {
        averageRating: avgRating._avg.rating ? Math.round(avgRating._avg.rating * 10) / 10 : null,
        totalRatings: avgRating._count.rating,
        recentFeedback: recentRatings,
      },
      performance: {
        avgFirstResponseHours: avgResponseTimeHours,
      },
      categories: categoryStats,
      priorities: priorityStats,
    });
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
