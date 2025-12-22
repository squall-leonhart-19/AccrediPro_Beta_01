import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTicketRatingRequestEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
    // Simple auth check for cron jobs (verify secret if needed, but for now assuming Vercel Cron or secure internal call)
    // Check for CRON_SECRET if properly secured
    // if (request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Find stale tickets
        const staleTickets = await prisma.supportTicket.findMany({
            where: {
                status: "RESOLVED",
                updatedAt: { lt: sevenDaysAgo },
                // Ensure we haven't already rated them or closed them (redundancy check)
            },
            take: 50, // Process in batches to avoid timeout
        });

        console.log(`Found ${staleTickets.length} stale tickets to close.`);

        const results: number[] = [];

        for (const ticket of staleTickets) {
            // 1. Close ticket
            await prisma.supportTicket.update({
                where: { id: ticket.id },
                data: {
                    status: "CLOSED",
                    closedAt: new Date(),
                },
            });

            // 2. Send rating request if not already rated
            if (!ticket.rating) {
                try {
                    await sendTicketRatingRequestEmail(
                        ticket.customerEmail,
                        ticket.customerName,
                        ticket.ticketNumber
                    );
                } catch (emailError) {
                    console.error(`Failed to send rating email for ticket #${ticket.ticketNumber}:`, emailError);
                }
            }

            results.push(ticket.ticketNumber);
        }

        return NextResponse.json({
            success: true,
            processed: results.length,
            ticketNumbers: results
        });

    } catch (error) {
        console.error("Auto-close cron job failed:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
