import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ ticketId: string }> }
) {
    try {
        const { ticketId } = await params;
        // In this specific sub-route, the "ticketId" path segment is actually containing the Ticket Number (integer)
        // because the URL is constructed as /api/tickets/[ticketNumber]/rate
        const ticketNumber = parseInt(ticketId);

        if (isNaN(ticketNumber)) {
            return NextResponse.json(
                { error: "Invalid ticket number" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { rating, ratingComment } = body;

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating must be between 1 and 5" },
                { status: 400 }
            );
        }

        const ticket = await prisma.supportTicket.findUnique({
            where: { ticketNumber },
        });

        if (!ticket) {
            return NextResponse.json(
                { error: "Ticket not found" },
                { status: 404 }
            );
        }

        if (!["RESOLVED", "CLOSED"].includes(ticket.status)) {
            return NextResponse.json(
                { error: "Can only rate resolved or closed tickets" },
                { status: 400 }
            );
        }

        // Update ticket with rating
        await prisma.supportTicket.update({
            where: { ticketNumber },
            data: {
                rating,
                ratingComment,
                ratedAt: new Date(),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to submit rating:", error);
        return NextResponse.json(
            { error: "Failed to submit rating" },
            { status: 500 }
        );
    }
}
