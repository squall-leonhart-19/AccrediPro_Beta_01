import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { resend } from "@/lib/email";

// Vercel Cron: Every day at 8am UTC
// Add to vercel.json: { "path": "/api/cron/customer-care-report", "schedule": "0 8 * * *" }

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface DailyStats {
    messagesYesterday: number;
    messagesAwaitingResponse: number;
    openTickets: number;
    ticketsOpenedYesterday: number;
    ticketsResolvedYesterday: number;
    avgResponseTimeHours: number;
}

async function getYesterdayStats(): Promise<DailyStats> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Find Sarah's ID
    const sarah = await prisma.user.findFirst({
        where: { email: "sarah@accredipro-certificate.com" },
        select: { id: true },
    });
    const sarahId = sarah?.id;

    // Messages from students yesterday
    const messagesYesterday = await prisma.message.count({
        where: {
            createdAt: { gte: yesterday, lt: today },
            senderId: { not: sarahId },
        },
    });

    // Awaiting response (>24h)
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

    // Ticket stats
    const [openTickets, ticketsOpenedYesterday, ticketsResolvedYesterday, recentResolved] = await Promise.all([
        prisma.supportTicket.count({
            where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
        }),
        prisma.supportTicket.count({
            where: { createdAt: { gte: yesterday, lt: today } },
        }),
        prisma.supportTicket.count({
            where: {
                status: "RESOLVED",
                resolvedAt: { gte: yesterday, lt: today },
            },
        }),
        prisma.supportTicket.findMany({
            where: {
                status: "RESOLVED",
                resolvedAt: { gte: yesterday },
            },
            select: { createdAt: true, resolvedAt: true },
        }),
    ]);

    // Average response time
    let avgResponseTimeHours = 0;
    if (recentResolved.length > 0) {
        const totalMs = recentResolved.reduce((acc, t) => {
            if (t.resolvedAt) {
                return acc + (t.resolvedAt.getTime() - t.createdAt.getTime());
            }
            return acc;
        }, 0);
        avgResponseTimeHours = Math.round((totalMs / recentResolved.length) / (1000 * 60 * 60));
    }

    return {
        messagesYesterday,
        messagesAwaitingResponse: Number(awaitingResponse[0]?.count || 0),
        openTickets,
        ticketsOpenedYesterday,
        ticketsResolvedYesterday,
        avgResponseTimeHours,
    };
}

function buildEmailHtml(stats: DailyStats): string {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const dateStr = date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const awaitingColor = stats.messagesAwaitingResponse > 0 ? "#dc2626" : "#16a34a";
    const ticketsColor = stats.openTickets > 5 ? "#f59e0b" : "#16a34a";

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Customer Care Report</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f3f4f6; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #4e1f24 0%, #3a171a 100%); padding: 24px; text-align: center;">
      <h1 style="color: #d4af37; margin: 0; font-size: 24px;">📊 Daily Customer Care Report</h1>
      <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 14px;">${dateStr}</p>
    </div>
    
    <!-- KPIs Grid -->
    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px; text-align: center; border: 1px solid #e5e7eb; width: 50%;">
            <p style="margin: 0; font-size: 32px; font-weight: bold; color: #1f2937;">${stats.messagesYesterday}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Messages Yesterday</p>
          </td>
          <td style="padding: 12px; text-align: center; border: 1px solid #e5e7eb; width: 50%;">
            <p style="margin: 0; font-size: 32px; font-weight: bold; color: ${awaitingColor};">${stats.messagesAwaitingResponse}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Awaiting Response (&gt;24h)</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px; text-align: center; border: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 32px; font-weight: bold; color: ${ticketsColor};">${stats.openTickets}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Open Tickets</p>
          </td>
          <td style="padding: 12px; text-align: center; border: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 32px; font-weight: bold; color: #1f2937;">${stats.avgResponseTimeHours}h</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Avg Response Time</p>
          </td>
        </tr>
      </table>
      
      <!-- Ticket Summary -->
      <div style="margin-top: 20px; padding: 16px; background: #f9fafb; border-radius: 8px;">
        <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #374151;">📌 Yesterday's Ticket Activity</h3>
        <div style="display: flex; gap: 16px;">
          <div style="flex: 1;">
            <p style="margin: 0; font-size: 20px; font-weight: bold; color: #f59e0b;">+${stats.ticketsOpenedYesterday}</p>
            <p style="margin: 0; font-size: 11px; color: #6b7280;">Opened</p>
          </div>
          <div style="flex: 1;">
            <p style="margin: 0; font-size: 20px; font-weight: bold; color: #16a34a;">✓${stats.ticketsResolvedYesterday}</p>
            <p style="margin: 0; font-size: 11px; color: #6b7280;">Resolved</p>
          </div>
        </div>
      </div>
      
      <!-- Action Required Alert -->
      ${stats.messagesAwaitingResponse > 0 ? `
      <div style="margin-top: 20px; padding: 16px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;">
        <p style="margin: 0; font-size: 14px; color: #dc2626; font-weight: 600;">⚠️ Action Required</p>
        <p style="margin: 8px 0 0 0; font-size: 13px; color: #7f1d1d;">
          ${stats.messagesAwaitingResponse} student message(s) have been waiting for more than 24 hours.
        </p>
      </div>
      ` : `
      <div style="margin-top: 20px; padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
        <p style="margin: 0; font-size: 14px; color: #16a34a; font-weight: 600;">✅ All Caught Up!</p>
        <p style="margin: 8px 0 0 0; font-size: 13px; color: #166534;">
          All student messages have been answered within 24 hours.
        </p>
      </div>
      `}
      
      <!-- CTA -->
      <div style="margin-top: 24px; text-align: center;">
        <a href="${process.env.NEXTAUTH_URL || 'https://learn.accredipro.academy'}/admin/customer-care" 
           style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #4e1f24 0%, #6b2a30 100%); color: #d4af37; text-decoration: none; border-radius: 8px; font-weight: 600;">
          View Full Dashboard →
        </a>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="padding: 16px 24px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
      <p style="margin: 0; font-size: 11px; color: #9ca3af;">
        This report is automatically generated daily at 8am UTC.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export async function GET(req: NextRequest) {
    // Verify cron secret or allow in development
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (process.env.NODE_ENV === "production" && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Get stats
        const stats = await getYesterdayStats();

        // Get admin emails (all ADMIN users)
        const admins = await prisma.user.findMany({
            where: { role: "ADMIN" },
            select: { email: true, firstName: true },
        });

        if (admins.length === 0) {
            return NextResponse.json({ success: true, message: "No admins to send to" });
        }

        // Build email
        const html = buildEmailHtml(stats);

        // Send to all admins
        const results = await Promise.allSettled(
            admins.map(admin =>
                resend.emails.send({
                    from: "AccrediPro Analytics <notifications@accredipro-certificate.com>",
                    to: admin.email,
                    subject: `📊 Daily Customer Care Report - ${stats.messagesAwaitingResponse > 0 ? `⚠️ ${stats.messagesAwaitingResponse} Awaiting Response` : "✅ All Caught Up"}`,
                    html,
                })
            )
        );

        const sent = results.filter(r => r.status === "fulfilled").length;
        const failed = results.filter(r => r.status === "rejected").length;

        console.log(`[CustomerCareReport] Sent to ${sent} admins, ${failed} failed`);

        return NextResponse.json({
            success: true,
            stats,
            recipients: sent,
            failed,
        });
    } catch (error) {
        console.error("[CustomerCareReport] Error:", error);
        return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
    }
}
