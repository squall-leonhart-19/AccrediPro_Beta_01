import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import CustomerCareAnalytics from "@/components/admin/analytics/CustomerCareAnalytics";
import { Prisma } from "@prisma/client";

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Helper to get date ranges
function getDateRanges() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return { now, today, yesterday, weekAgo };
}

// Get message stats
async function getMessageStats() {
    const { today, weekAgo } = getDateRanges();

    // Find Sarah's ID
    const sarah = await prisma.user.findFirst({
        where: { email: "sarah@accredipro-certificate.com" },
        select: { id: true },
    });
    const sarahId = sarah?.id;

    // Return defaults if Sarah doesn't exist
    if (!sarahId) {
        return {
            messagesToday: 0,
            messagesThisWeek: 0,
            totalConversations: 0,
            awaitingResponse: 0,
            trend: [],
            topSenders: []
        };
    }

    // Messages from students (not from Sarah)
    const [messagesToday, messagesThisWeek, totalConversations] = await Promise.all([
        prisma.message.count({
            where: {
                createdAt: { gte: today },
                senderId: { not: sarahId },
            },
        }),
        prisma.message.count({
            where: {
                createdAt: { gte: weekAgo },
                senderId: { not: sarahId },
            },
        }),
        prisma.message.groupBy({
            by: ['receiverId'],
            where: { senderId: { not: sarahId } },
            _count: true,
        }),
    ]);

    // Unanswered messages logic
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const awaitingResponse = await prisma.$queryRaw<{ count: bigint }[]>`
    WITH ConversationPairs AS (
      SELECT DISTINCT
        CASE WHEN "senderId" < "receiverId" 
             THEN "senderId" || '|' || "receiverId" 
             ELSE "receiverId" || '|' || "senderId" END as conv_id,
        "senderId",
        "receiverId"
      FROM "Message"
      WHERE "senderId" = ${sarahId} OR "receiverId" = ${sarahId}
    ),
    LastMessagePerConv AS (
      SELECT DISTINCT ON (
        CASE WHEN m."senderId" < m."receiverId" 
             THEN m."senderId" || '|' || m."receiverId" 
             ELSE m."receiverId" || '|' || m."senderId" END
      )
        CASE WHEN m."senderId" < m."receiverId" 
             THEN m."senderId" || '|' || m."receiverId" 
             ELSE m."receiverId" || '|' || m."senderId" END as conv_id,
        m."senderId" as last_sender,
        m."createdAt" as last_msg_time
      FROM "Message" m
      WHERE m."senderId" = ${sarahId} OR m."receiverId" = ${sarahId}
      ORDER BY conv_id, m."createdAt" DESC
    )
    SELECT COUNT(*)::bigint as count 
    FROM LastMessagePerConv 
    WHERE last_sender != ${sarahId} 
    AND last_msg_time < ${twentyFourHoursAgo}
  `;

    // 7-day Trend
    const trend: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        const count = await prisma.message.count({
            where: {
                createdAt: { gte: start, lt: end },
                senderId: { not: sarahId },
            },
        });
        trend.push({
            date: start.toLocaleDateString("en-US", { weekday: "short" }),
            count,
        });
    }

    // Top Senders (Active Students)
    const topSendersRaw = await prisma.message.groupBy({
        by: ['senderId'],
        where: { createdAt: { gte: weekAgo }, senderId: { not: sarahId } },
        _count: { senderId: true },
        orderBy: { _count: { senderId: 'desc' } },
        take: 5
    });

    const topSenders = await Promise.all(topSendersRaw.map(async (s) => {
        const user = await prisma.user.findUnique({
            where: { id: s.senderId },
            select: { firstName: true, lastName: true, email: true }
        });
        return {
            name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown' : 'Unknown',
            email: user?.email || '',
            count: s._count.senderId
        };
    }));

    return {
        messagesToday,
        messagesThisWeek,
        totalConversations: totalConversations.length,
        awaitingResponse: Number(awaitingResponse[0]?.count || 0),
        trend,
        topSenders
    };
}

// Get ticket stats
async function getTicketStats() {
    const { today, weekAgo } = getDateRanges();

    const [
        openTickets,
        ticketsToday, // Created Today
        repliesToday, // Staff replies today
        resolvedToday, // Resolved today
        urgentTickets,
        avgResponseTime,
        byCategoryRaw,
        ticketTrend
    ] = await Promise.all([
        prisma.supportTicket.count({
            where: { status: { in: ["NEW", "OPEN", "PENDING"] } },
        }),
        prisma.supportTicket.count({
            where: { createdAt: { gte: today } },
        }),
        prisma.ticketMessage.count({
            where: {
                createdAt: { gte: today },
                isFromCustomer: false,
                isInternal: false
            }
        }),
        prisma.supportTicket.count({
            where: {
                status: "RESOLVED",
                resolvedAt: { gte: today }
            }
        }),
        prisma.supportTicket.count({
            where: {
                status: { in: ["NEW", "OPEN", "PENDING"] },
                priority: "HIGH",
            },
        }),
        // Average response time for resolved tickets (last 100)
        prisma.supportTicket.findMany({
            where: {
                status: "RESOLVED",
                resolvedAt: { not: null },
            },
            select: { createdAt: true, resolvedAt: true },
            take: 100,
            orderBy: { resolvedAt: "desc" },
        }),
        // By Category
        prisma.supportTicket.groupBy({
            by: ['category'],
            _count: { category: true },
            orderBy: { _count: { category: 'desc' } }
        }),
        // 7 Day Trend Logic
        getTicketTrend()
    ]);

    // Calculate average response time in hours
    let avgHours = 0;
    if (avgResponseTime.length > 0) {
        const totalMs = avgResponseTime.reduce((acc, t) => {
            if (t.resolvedAt) {
                return acc + (t.resolvedAt.getTime() - t.createdAt.getTime());
            }
            return acc;
        }, 0);
        avgHours = Math.round((totalMs / avgResponseTime.length) / (1000 * 60 * 60));
    }

    const byCategory = byCategoryRaw.map(c => ({
        category: c.category,
        count: c._count.category
    }));

    return {
        openTickets,
        ticketsToday,
        repliesToday,
        resolvedToday,
        avgResponseTimeHours: avgHours,
        urgentTickets,
        ticketTrend,
        byCategory
    };
}

// Helper for ticket trend
async function getTicketTrend() {
    const trend: { date: string; opened: number; resolved: number }[] = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        const [opened, resolved] = await Promise.all([
            prisma.supportTicket.count({ where: { createdAt: { gte: start, lt: end } } }),
            prisma.supportTicket.count({ where: { status: "RESOLVED", resolvedAt: { gte: start, lt: end } } })
        ]);

        trend.push({
            date: start.toLocaleDateString("en-US", { weekday: "short" }),
            opened,
            resolved
        });
    }
    return trend;
}

export default async function CustomerCarePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
        return <div className="p-8 text-center text-red-500">Access denied</div>;
    }

    const [messageStats, ticketStats] = await Promise.all([
        getMessageStats(),
        getTicketStats()
    ]);

    return <CustomerCareAnalytics messageStats={messageStats} ticketStats={ticketStats} />;
}
