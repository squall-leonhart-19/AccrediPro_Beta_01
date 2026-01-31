import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

/**
 * Customer Care Daily Digest
 * 
 * Runs every morning at 8 AM via Vercel Cron
 * Sends an email summary of yesterday's support metrics
 * 
 * Cron: 0 8 * * * (8 AM UTC daily)
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
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Calculate date ranges
        const now = new Date();
        const yesterdayStart = new Date(now);
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        yesterdayStart.setHours(0, 0, 0, 0);

        const yesterdayEnd = new Date(now);
        yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
        yesterdayEnd.setHours(23, 59, 59, 999);

        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Run all queries in parallel
        const [
            // Yesterday's metrics
            openedYesterday,
            closedYesterday,
            answeredYesterday,

            // Current state
            currentOpen,
            awaitingReply,
            urgentTickets,

            // All tickets for category breakdown
            allOpenTickets,

            // Response time data (last 7 days)
            ticketsWithResponse,

            // SLA breaches (>24h waiting)
            slaBreaches,
        ] = await Promise.all([
            // Tickets opened yesterday
            prisma.supportTicket.count({
                where: {
                    createdAt: { gte: yesterdayStart, lte: yesterdayEnd }
                }
            }),

            // Tickets closed yesterday
            prisma.supportTicket.count({
                where: {
                    status: { in: ["RESOLVED", "CLOSED"] },
                    updatedAt: { gte: yesterdayStart, lte: yesterdayEnd }
                }
            }),

            // Tickets answered yesterday (messages sent by support)
            prisma.ticketMessage.count({
                where: {
                    isFromCustomer: false,
                    isInternal: false,
                    createdAt: { gte: yesterdayStart, lte: yesterdayEnd }
                }
            }),

            // Currently open tickets
            prisma.supportTicket.count({
                where: { status: { in: ["NEW", "OPEN", "PENDING"] } }
            }),

            // Tickets awaiting agent reply (last customer message)
            prisma.supportTicket.findMany({
                where: {
                    status: { in: ["NEW", "OPEN", "PENDING"] }
                },
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

            // Response time data
            prisma.supportTicket.findMany({
                where: {
                    firstResponseAt: { not: null },
                    createdAt: { gte: sevenDaysAgo }
                },
                select: { createdAt: true, firstResponseAt: true }
            }),

            // SLA breaches - tickets waiting >24h for reply
            prisma.supportTicket.findMany({
                where: {
                    status: { in: ["NEW", "OPEN", "PENDING"] }
                },
                select: {
                    id: true,
                    customerName: true,
                    subject: true,
                    messages: {
                        where: { isFromCustomer: true },
                        orderBy: { createdAt: "desc" },
                        take: 1,
                        select: { createdAt: true }
                    }
                }
            }),
        ]);

        // Calculate awaiting reply count (last message from customer)
        const ticketsAwaitingReply = awaitingReply.filter(t =>
            t.messages.length > 0 && t.messages[0].isFromCustomer
        ).length;

        // Calculate avg response time (in hours)
        let avgResponseTimeHours = 0;
        if (ticketsWithResponse.length > 0) {
            const totalMs = ticketsWithResponse.reduce((sum, t) => {
                if (t.firstResponseAt) {
                    return sum + (t.firstResponseAt.getTime() - t.createdAt.getTime());
                }
                return sum;
            }, 0);
            avgResponseTimeHours = Math.round(totalMs / ticketsWithResponse.length / (1000 * 60 * 60) * 10) / 10;
        }

        // Calculate SLA breaches (customer waiting >24h)
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const slaBreachCount = slaBreaches.filter(t => {
            if (t.messages.length === 0) return false;
            return new Date(t.messages[0].createdAt) < twentyFourHoursAgo;
        }).length;

        // Category breakdown
        const categoryBreakdown: Record<string, number> = {};
        allOpenTickets.forEach(t => {
            const cat = detectCategory(t.subject);
            categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
        });
        const categoryList = Object.entries(categoryBreakdown)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, count]) => `${cat}: ${count}`)
            .join(" | ");

        // Build email HTML
        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Georgia', serif; background: #f9fafb; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #722F37, #8B3D47); color: white; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 8px 0 0; opacity: 0.8; font-size: 14px; }
        .content { padding: 24px; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .stat-card { text-align: center; padding: 16px; background: #f3f4f6; border-radius: 8px; }
        .stat-value { font-size: 32px; font-weight: bold; color: #722F37; }
        .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; margin-top: 4px; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 16px; font-weight: bold; color: #1f2937; margin-bottom: 12px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
        .metric-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
        .metric-label { color: #6b7280; }
        .metric-value { font-weight: 600; color: #1f2937; }
        .alert-box { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 12px; border-radius: 8px; margin-bottom: 16px; }
        .success-box { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 12px; border-radius: 8px; }
        .category-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .pill { background: #e5e7eb; padding: 4px 12px; border-radius: 999px; font-size: 12px; color: #374151; }
        .footer { background: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Customer Care Daily Digest</h1>
            <p>${new Date(yesterdayStart).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div class="content">
            ${slaBreachCount > 0 ? `
            <div class="alert-box">
                ⚠️ <strong>${slaBreachCount} ticket${slaBreachCount > 1 ? 's' : ''}</strong> waiting >24h for response!
            </div>
            ` : `
            <div class="success-box">
                ✅ All tickets within SLA - Great work!
            </div>
            `}
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${openedYesterday}</div>
                    <div class="stat-label">Opened Yesterday</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${answeredYesterday}</div>
                    <div class="stat-label">Answered Yesterday</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${closedYesterday}</div>
                    <div class="stat-label">Closed Yesterday</div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">📈 Current Queue Status</div>
                <div class="metric-row">
                    <span class="metric-label">Total Open Tickets</span>
                    <span class="metric-value">${currentOpen}</span>
                </div>
                <div class="metric-row">
                    <span class="metric-label">Awaiting Reply (Customer Waiting)</span>
                    <span class="metric-value" style="color: ${ticketsAwaitingReply > 5 ? '#dc2626' : '#16a34a'}">${ticketsAwaitingReply}</span>
                </div>
                <div class="metric-row">
                    <span class="metric-label">Urgent/High Priority</span>
                    <span class="metric-value" style="color: ${urgentTickets > 0 ? '#dc2626' : '#16a34a'}">${urgentTickets}</span>
                </div>
                <div class="metric-row">
                    <span class="metric-label">Avg Response Time (7 days)</span>
                    <span class="metric-value">${avgResponseTimeHours}h</span>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">🏷️ Open Tickets by Category</div>
                <div class="category-pills">
                    ${Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1]).map(([cat, count]) =>
            `<span class="pill">${cat}: ${count}</span>`
        ).join('')}
                </div>
            </div>
        </div>
        
        <div class="footer">
            AccrediPro Standards Institute • Student Success Division<br>
            <a href="https://learn.accredipro.academy/support" style="color: #722F37;">Open Support Dashboard →</a>
        </div>
    </div>
</body>
</html>
        `;

        // Send email to customer care team
        const recipientEmail = process.env.CUSTOMER_CARE_EMAIL || "support@accredipro.academy";

        await sendEmail({
            to: recipientEmail,
            subject: `📊 Daily Support Digest: ${openedYesterday} new, ${ticketsAwaitingReply} awaiting reply`,
            html: emailHtml,
            type: "transactional",
        });

        console.log(`[DIGEST] Customer care digest sent to ${recipientEmail}`);

        return NextResponse.json({
            success: true,
            digest: {
                date: yesterdayStart.toISOString().split('T')[0],
                openedYesterday,
                answeredYesterday,
                closedYesterday,
                currentOpen,
                ticketsAwaitingReply,
                urgentTickets,
                avgResponseTimeHours,
                slaBreachCount,
                categoryBreakdown,
            }
        });
    } catch (error) {
        console.error("[DIGEST] Failed to generate customer care digest:", error);
        return NextResponse.json({ error: "Failed to generate digest" }, { status: 500 });
    }
}
