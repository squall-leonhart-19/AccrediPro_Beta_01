import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Customer Care Stats API
 * Returns real-time metrics for the admin dashboard widget
 */

// Category detection (same as support page)
const detectCategory = (subject: string): string => {
    const s = subject.toLowerCase();
    if (s.includes("refund") || s.includes("cancel") || s.includes("money back")) return "Refund";
    if (s.includes("access") || s.includes("login") || s.includes("password")) return "Access";
    if (s.includes("certificate") || s.includes("completion")) return "Certificate";
    if (s.includes("billing") || s.includes("payment") || s.includes("charge")) return "Billing";
    if (s.includes("module") || s.includes("lesson") || s.includes("course") || s.includes("video")) return "Course Content";
    if (s.includes("error") || s.includes("bug") || s.includes("broken")) return "Technical";
    return "General";
};

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "SUPERUSER", "INSTRUCTOR", "SUPPORT"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const now = new Date();

        // Today's start
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);

        // 7 days ago
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // 24 hours ago
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Run all queries in parallel for speed
        const [
            currentOpen,
            openTicketsWithMessages,
            answeredToday,
            closedToday,
            urgentCount,
            allOpenTickets,
            ticketsWithResponse,
        ] = await Promise.all([
            // Currently open tickets
            prisma.supportTicket.count({
                where: { status: { in: ["NEW", "OPEN", "PENDING"] } }
            }),

            // Open tickets with last message to check who's waiting
            prisma.supportTicket.findMany({
                where: { status: { in: ["NEW", "OPEN", "PENDING"] } },
                select: {
                    id: true,
                    subject: true,
                    messages: {
                        orderBy: { createdAt: "desc" },
                        take: 1,
                        select: { isFromCustomer: true, createdAt: true }
                    }
                }
            }),

            // Replies sent today (not internal notes)
            prisma.ticketMessage.count({
                where: {
                    isFromCustomer: false,
                    isInternal: false,
                    createdAt: { gte: todayStart }
                }
            }),

            // Tickets closed today
            prisma.supportTicket.count({
                where: {
                    status: { in: ["RESOLVED", "CLOSED"] },
                    updatedAt: { gte: todayStart }
                }
            }),

            // Urgent/High priority open tickets
            prisma.supportTicket.count({
                where: {
                    status: { in: ["NEW", "OPEN", "PENDING"] },
                    priority: { in: ["URGENT", "HIGH"] }
                }
            }),

            // All open tickets for category breakdown
            prisma.supportTicket.findMany({
                where: { status: { in: ["NEW", "OPEN", "PENDING"] } },
                select: { subject: true }
            }),

            // Response time data (last 7 days)
            prisma.supportTicket.findMany({
                where: {
                    firstResponseAt: { not: null },
                    createdAt: { gte: sevenDaysAgo }
                },
                select: { createdAt: true, firstResponseAt: true }
            }),
        ]);

        // Calculate awaiting reply (last message from customer)
        const awaitingReply = openTicketsWithMessages.filter(t =>
            t.messages.length === 0 || t.messages[0].isFromCustomer
        ).length;

        // Calculate SLA breaches (customer waiting >24h)
        const slaBreaches = openTicketsWithMessages.filter(t => {
            if (t.messages.length === 0) return false;
            if (!t.messages[0].isFromCustomer) return false;
            return new Date(t.messages[0].createdAt) < twentyFourHoursAgo;
        }).length;

        // Calculate avg response time (in hours)
        let avgResponseTime = 0;
        if (ticketsWithResponse.length > 0) {
            const totalMs = ticketsWithResponse.reduce((sum, t) => {
                if (t.firstResponseAt) {
                    return sum + (t.firstResponseAt.getTime() - t.createdAt.getTime());
                }
                return sum;
            }, 0);
            avgResponseTime = Math.round(totalMs / ticketsWithResponse.length / (1000 * 60 * 60) * 10) / 10;
        }

        // Category breakdown
        const categoryBreakdown: Record<string, number> = {};
        allOpenTickets.forEach(t => {
            const cat = detectCategory(t.subject);
            categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
        });

        return NextResponse.json({
            stats: {
                currentOpen,
                awaitingReply,
                answeredToday,
                closedToday,
                avgResponseTime,
                slaBreaches,
                urgentCount,
                categoryBreakdown,
            }
        });
    } catch (error) {
        console.error("Failed to fetch customer care stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
