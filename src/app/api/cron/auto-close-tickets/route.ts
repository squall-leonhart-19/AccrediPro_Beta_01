import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Auto-close tickets that have been resolved for 7+ days with no response
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (Vercel cron protection)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Find tickets that are RESOLVED and haven't been updated in 7+ days
    const staleTickets = await prisma.supportTicket.findMany({
      where: {
        status: "RESOLVED",
        updatedAt: { lt: sevenDaysAgo },
      },
      select: {
        id: true,
        ticketNumber: true,
        subject: true,
        customerEmail: true,
        customerName: true,
      },
    });

    if (staleTickets.length === 0) {
      return NextResponse.json({ message: "No stale tickets to close", closed: 0 });
    }

    // Close all stale tickets
    await prisma.supportTicket.updateMany({
      where: {
        id: { in: staleTickets.map((t) => t.id) },
      },
      data: {
        status: "CLOSED",
        closedAt: new Date(),
      },
    });

    // Send closure notification to each customer
    for (const ticket of staleTickets) {
      try {
        await resend.emails.send({
          from: "AccrediPro Support <support@accredipro-certificate.com>",
          to: ticket.customerEmail,
          subject: `[Ticket #${ticket.ticketNumber}] Closed - ${ticket.subject}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head><meta charset="utf-8"></head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #6B2C40 0%, #8B3A42 100%); padding: 30px; border-radius: 12px 12px 0 0;">
                    <h1 style="color: #D4AF37; margin: 0; font-size: 24px;">AccrediPro Support</h1>
                  </div>

                  <div style="background: #fff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 12px 12px;">
                    <p>Hi ${ticket.customerName.split(" ")[0]},</p>

                    <p>Your support ticket <strong>#${ticket.ticketNumber}</strong> has been automatically closed as it was resolved over 7 days ago with no further response.</p>

                    <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0;">
                      <p style="margin: 0; color: #166534;">
                        <strong>Subject:</strong> ${ticket.subject}
                      </p>
                    </div>

                    <p>If you need further assistance with this issue or have a new question, please don't hesitate to open a new ticket.</p>

                    <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                      <p style="margin: 0 0 15px; font-weight: bold; color: #92400e;">How was your support experience?</p>
                      <a href="https://learn.accredipro.academy/ticket-feedback/${ticket.ticketNumber}"
                         style="display: inline-block; background: #f59e0b; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                        Rate Your Experience
                      </a>
                    </div>

                    <p style="margin-top: 30px;">
                      <a href="https://learn.accredipro.academy/dashboard/support"
                         style="display: inline-block; background: #6B2C40; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                        Contact Support
                      </a>
                    </p>

                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

                    <p style="color: #888; font-size: 12px; margin: 0;">
                      Thank you for choosing AccrediPro Academy.
                    </p>
                  </div>
                </div>
              </body>
            </html>
          `,
        });
      } catch (emailError) {
        console.error(`Failed to send closure email for ticket #${ticket.ticketNumber}:`, emailError);
      }
    }

    console.log(`[CRON] Auto-closed ${staleTickets.length} stale tickets`);

    return NextResponse.json({
      message: `Closed ${staleTickets.length} stale tickets`,
      closed: staleTickets.length,
      tickets: staleTickets.map((t) => t.ticketNumber),
    });
  } catch (error) {
    console.error("[CRON] Auto-close tickets error:", error);
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
