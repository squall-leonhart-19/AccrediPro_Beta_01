import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTicketRatingRequestEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // 1. Find RESOLVED tickets older than 7 days to close
        const resolvedStaleTickets = await prisma.supportTicket.findMany({
            where: {
                status: "RESOLVED",
                updatedAt: { lt: sevenDaysAgo },
            },
            take: 50,
        });

        // 2. Find OPEN/PENDING tickets where last message was from support (not customer) 
        // and older than 7 days - no customer response = auto-close
        const pendingStaleTickets = await prisma.supportTicket.findMany({
            where: {
                status: { in: ["OPEN", "PENDING"] },
                updatedAt: { lt: sevenDaysAgo },
            },
            include: {
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    select: { isFromCustomer: true, createdAt: true },
                },
            },
            take: 50,
        });

        // Filter: only close if last message was NOT from customer (support replied, customer ghosted)
        const noResponseTickets = pendingStaleTickets.filter(ticket => {
            const lastMsg = ticket.messages[0];
            if (!lastMsg) return false;
            // Last message is from support AND older than 7 days
            return !lastMsg.isFromCustomer && new Date(lastMsg.createdAt) < sevenDaysAgo;
        });

        console.log(`Found ${resolvedStaleTickets.length} resolved + ${noResponseTickets.length} no-response tickets to close.`);

        const results: { ticketNumber: number; reason: string }[] = [];

        // Close resolved tickets
        for (const ticket of resolvedStaleTickets) {
            await prisma.supportTicket.update({
                where: { id: ticket.id },
                data: { status: "CLOSED", closedAt: new Date() },
            });

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

            results.push({ ticketNumber: ticket.ticketNumber, reason: "resolved_7d" });
        }

        // Close no-response tickets
        for (const ticket of noResponseTickets) {
            await prisma.supportTicket.update({
                where: { id: ticket.id },
                data: {
                    status: "CLOSED",
                    closedAt: new Date(),
                },
            });

            // Add auto-close message
            await prisma.ticketMessage.create({
                data: {
                    ticketId: ticket.id,
                    content: "This ticket has been automatically closed due to no response from customer after 7 days. If you still need help, please open a new ticket.",
                    isFromCustomer: false,
                    isInternal: false,
                },
            });

            results.push({ ticketNumber: ticket.ticketNumber, reason: "no_response_7d" });
        }

        return NextResponse.json({
            success: true,
            processed: results.length,
            results,
        });

    } catch (error) {
        console.error("Auto-close cron job failed:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
