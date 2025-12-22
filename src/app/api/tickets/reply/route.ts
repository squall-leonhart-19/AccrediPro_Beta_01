import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// POST - Student replies to a ticket
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { ticketId, message } = body;

        if (!ticketId || !message) {
            return NextResponse.json({ error: "Ticket ID and message are required" }, { status: 400 });
        }

        // specific check to ensure user owns ticket
        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
        });

        if (!ticket) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        const isOwner = ticket.userId === session.user.id || ticket.customerEmail === session.user.email;
        if (!isOwner) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Add message
        const newMessage = await prisma.ticketMessage.create({
            data: {
                ticketId,
                content: message,
                isFromCustomer: true,
            },
        });

        // Update ticket status to OPEN if it was resolved/pending
        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: {
                status: "OPEN",
                updatedAt: new Date()
            }
        });

        // Notify staff
        try {
            await resend.emails.send({
                from: "AccrediPro Support <support@accredipro-certificate.com>",
                to: "info@accredipro.academy",
                subject: `↩️ New Reply on Ticket #${ticket.ticketNumber}`,
                html: `
            <p>Customer <strong>${session.user.name}</strong> replied to ticket #${ticket.ticketNumber}:</p>
            <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #ccc;">
              ${message.replace(/\n/g, "<br>")}
            </blockquote>
            <p><a href="https://learn.accredipro.academy/admin/tickets">View Ticket</a></p>
          `
            });
        } catch (e) {
            console.error("Failed to notify staff", e);
        }

        return NextResponse.json({ success: true, message: newMessage });

    } catch (error) {
        console.error("Failed to reply to ticket:", error);
        return NextResponse.json({ error: "Failed to reply" }, { status: 500 });
    }
}
