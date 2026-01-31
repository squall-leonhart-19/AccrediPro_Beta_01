import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    MessageSquare,
    Clock,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    Users,
    Mail,
    RefreshCw,
    ArrowRight,
    Inbox,
    Send,
} from "lucide-react";

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

    // Unanswered messages (student sent, no reply from Sarah within 24h)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Get conversations where last message is from student (not Sarah) and older than threshold
    const awaitingResponse = await prisma.$queryRaw<{ count: bigint }[]>`
    WITH LastMessages AS (
      SELECT 
        CASE WHEN "senderId" = ${sarahId} THEN "receiverId" ELSE "senderId" END as student_id,
        MAX("createdAt") as last_msg_time,
        (SELECT "senderId" FROM "Message" m2 
         WHERE (m2."senderId" = m."senderId" AND m2."receiverId" = m."receiverId")
            OR (m2."senderId" = m."receiverId" AND m2."receiverId" = m."senderId")
         ORDER BY m2."createdAt" DESC LIMIT 1) as last_sender
      FROM "Message" m
      WHERE "senderId" = ${sarahId} OR "receiverId" = ${sarahId}
      GROUP BY student_id
    )
    SELECT COUNT(*)::bigint as count FROM LastMessages 
    WHERE last_sender != ${sarahId} 
    AND last_msg_time < ${twentyFourHoursAgo}
  `;

    return {
        messagesToday,
        messagesThisWeek,
        totalConversations: totalConversations.length,
        awaitingResponse: Number(awaitingResponse[0]?.count || 0),
    };
}

// Get ticket stats
async function getTicketStats() {
    const { today, weekAgo } = getDateRanges();

    const [openTickets, ticketsToday, ticketsThisWeek, urgentTickets, avgResponseTime] = await Promise.all([
        prisma.supportTicket.count({
            where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
        }),
        prisma.supportTicket.count({
            where: { createdAt: { gte: today } },
        }),
        prisma.supportTicket.count({
            where: { createdAt: { gte: weekAgo } },
        }),
        prisma.supportTicket.count({
            where: {
                status: { in: ["OPEN", "IN_PROGRESS"] },
                priority: "HIGH",
            },
        }),
        // Average response time for resolved tickets
        prisma.supportTicket.findMany({
            where: {
                status: "RESOLVED",
                resolvedAt: { not: null },
            },
            select: { createdAt: true, resolvedAt: true },
            take: 100,
            orderBy: { resolvedAt: "desc" },
        }),
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

    return {
        openTickets,
        ticketsToday,
        ticketsThisWeek,
        urgentTickets,
        avgResponseTimeHours: avgHours,
    };
}

// Get 7-day message trend
async function getMessageTrend() {
    const trend: { date: string; count: number }[] = [];
    const sarah = await prisma.user.findFirst({
        where: { email: "sarah@accredipro-certificate.com" },
        select: { id: true },
    });

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        const count = await prisma.message.count({
            where: {
                createdAt: { gte: start, lt: end },
                senderId: { not: sarah?.id },
            },
        });

        trend.push({
            date: start.toLocaleDateString("en-US", { weekday: "short" }),
            count,
        });
    }

    return trend;
}

// Get recent unanswered messages
async function getUnansweredMessages() {
    const sarah = await prisma.user.findFirst({
        where: { email: "sarah@accredipro-certificate.com" },
        select: { id: true },
    });

    if (!sarah) return [];

    // Get the most recent message per conversation where student sent last
    const recentMessages = await prisma.message.findMany({
        where: {
            receiverId: sarah.id,
        },
        include: {
            sender: {
                select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
    });

    // Filter to only those without a reply after
    const unanswered: typeof recentMessages = [];
    const seenSenders = new Set<string>();

    for (const msg of recentMessages) {
        if (seenSenders.has(msg.senderId)) continue;
        seenSenders.add(msg.senderId);

        // Check if Sarah replied after this message
        const sarahReply = await prisma.message.findFirst({
            where: {
                senderId: sarah.id,
                receiverId: msg.senderId,
                createdAt: { gt: msg.createdAt },
            },
        });

        if (!sarahReply) {
            unanswered.push(msg);
        }

        if (unanswered.length >= 10) break;
    }

    return unanswered;
}

// Get open tickets
async function getOpenTickets() {
    return prisma.supportTicket.findMany({
        where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
        include: {
            user: {
                select: { firstName: true, lastName: true, email: true, avatar: true },
            },
        },
        orderBy: [
            { priority: "desc" },
            { createdAt: "asc" },
        ],
        take: 10,
    });
}

export default async function CustomerCarePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
        return <div className="p-8 text-center text-red-500">Access denied</div>;
    }

    const [messageStats, ticketStats, messageTrend, unansweredMessages, openTickets] = await Promise.all([
        getMessageStats(),
        getTicketStats(),
        getMessageTrend(),
        getUnansweredMessages(),
        getOpenTickets(),
    ]);

    const maxTrendValue = Math.max(...messageTrend.map(d => d.count), 1);

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customer Care Dashboard</h1>
                    <p className="text-gray-500 text-sm">Monitor messages, tickets, and response times</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-700">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Live Data
                    </Badge>
                    <Link href="/admin/messages">
                        <Button variant="outline" size="sm">
                            <Mail className="w-4 h-4 mr-2" />
                            View Messages
                        </Button>
                    </Link>
                    <Link href="/admin/tickets">
                        <Button variant="outline" size="sm">
                            <Inbox className="w-4 h-4 mr-2" />
                            View Tickets
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Messages Today */}
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Messages Today</p>
                                <p className="text-3xl font-bold text-gray-900">{messageStats.messagesToday}</p>
                                <p className="text-xs text-gray-400">{messageStats.messagesThisWeek} this week</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Awaiting Response */}
                <Card className={`border-l-4 ${messageStats.awaitingResponse > 0 ? 'border-l-red-500' : 'border-l-green-500'}`}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Awaiting Response</p>
                                <p className="text-3xl font-bold text-gray-900">{messageStats.awaitingResponse}</p>
                                <p className="text-xs text-gray-400">&gt;24h without reply</p>
                            </div>
                            <div className={`w-12 h-12 ${messageStats.awaitingResponse > 0 ? 'bg-red-100' : 'bg-green-100'} rounded-full flex items-center justify-center`}>
                                {messageStats.awaitingResponse > 0 ? (
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                ) : (
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Open Tickets */}
                <Card className={`border-l-4 ${ticketStats.openTickets > 0 ? 'border-l-amber-500' : 'border-l-green-500'}`}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Open Tickets</p>
                                <p className="text-3xl font-bold text-gray-900">{ticketStats.openTickets}</p>
                                <p className="text-xs text-gray-400">{ticketStats.urgentTickets} urgent</p>
                            </div>
                            <div className={`w-12 h-12 ${ticketStats.openTickets > 0 ? 'bg-amber-100' : 'bg-green-100'} rounded-full flex items-center justify-center`}>
                                <Inbox className={`w-6 h-6 ${ticketStats.openTickets > 0 ? 'text-amber-600' : 'text-green-600'}`} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Avg Response Time */}
                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Avg Response Time</p>
                                <p className="text-3xl font-bold text-gray-900">{ticketStats.avgResponseTimeHours}h</p>
                                <p className="text-xs text-gray-400">for resolved tickets</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Message Trend Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        Message Trend (Last 7 Days)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end gap-2 h-40">
                        {messageTrend.map((day, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex flex-col items-center">
                                    <span className="text-sm font-medium text-gray-700">{day.count}</span>
                                    <div
                                        className="w-full bg-blue-500 rounded-t transition-all"
                                        style={{ height: `${(day.count / maxTrendValue) * 100}px`, minHeight: '4px' }}
                                    />
                                </div>
                                <span className="text-xs text-gray-500">{day.date}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Two Column Layout: Unanswered Messages + Open Tickets */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Unanswered Messages */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-red-500" />
                            Unanswered Messages
                        </CardTitle>
                        <Link href="/admin/messages">
                            <Button variant="ghost" size="sm">
                                View All <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {unansweredMessages.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                                <p>All messages answered! 🎉</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {unansweredMessages.map((msg) => (
                                    <Link
                                        key={msg.id}
                                        href={`/admin/messages?userId=${msg.senderId}`}
                                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                            {msg.sender?.avatar ? (
                                                <img src={msg.sender.avatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-sm font-medium text-gray-600">
                                                    {msg.sender?.firstName?.[0]}{msg.sender?.lastName?.[0]}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm text-gray-900 truncate">
                                                {msg.sender?.firstName} {msg.sender?.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">{msg.content}</p>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Open Tickets */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Inbox className="w-5 h-5 text-amber-500" />
                            Open Tickets
                        </CardTitle>
                        <Link href="/admin/tickets">
                            <Button variant="ghost" size="sm">
                                View All <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {openTickets.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                                <p>No open tickets! 🎉</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {openTickets.map((ticket) => (
                                    <Link
                                        key={ticket.id}
                                        href={`/admin/tickets/${ticket.id}`}
                                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                            {ticket.user?.avatar ? (
                                                <img src={ticket.user.avatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-sm font-medium text-gray-600">
                                                    {ticket.user?.firstName?.[0]}{ticket.user?.lastName?.[0]}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-sm text-gray-900 truncate">{ticket.subject}</p>
                                                {ticket.priority === "HIGH" && (
                                                    <Badge className="bg-red-100 text-red-700 text-xs">Urgent</Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {ticket.user?.firstName} {ticket.user?.lastName}
                                            </p>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Footer Stats */}
            <Card className="bg-gradient-to-r from-burgundy-50 to-gold-50">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-burgundy-700">{messageStats.totalConversations}</p>
                                <p className="text-xs text-gray-500">Total Conversations</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-burgundy-700">{ticketStats.ticketsThisWeek}</p>
                                <p className="text-xs text-gray-500">Tickets This Week</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Users className="w-4 h-4" />
                            <span>Customer Care Team Performance</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
