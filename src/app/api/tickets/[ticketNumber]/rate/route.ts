import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Customer submits rating for a resolved ticket
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ticketNumber: string }> }
) {
  try {
    const { ticketNumber: ticketNumStr } = await params;
    const ticketNumber = parseInt(ticketNumStr);

    if (isNaN(ticketNumber)) {
      return NextResponse.json({ error: "Invalid ticket number" }, { status: 400 });
    }

    const body = await request.json();
    const { rating, comment, email } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    // Find the ticket
    const ticket = await prisma.supportTicket.findUnique({
      where: { ticketNumber },
      select: {
        id: true,
        customerEmail: true,
        rating: true,
        status: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Verify the email matches (basic security)
    if (email && ticket.customerEmail.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: "Email does not match ticket" }, { status: 403 });
    }

    // Check if already rated
    if (ticket.rating) {
      return NextResponse.json({ error: "Ticket already rated" }, { status: 400 });
    }

    // Check if ticket is resolved or closed
    if (!["RESOLVED", "CLOSED"].includes(ticket.status)) {
      return NextResponse.json({ error: "Can only rate resolved tickets" }, { status: 400 });
    }

    // Update ticket with rating
    await prisma.supportTicket.update({
      where: { id: ticket.id },
      data: {
        rating,
        ratingComment: comment || null,
        ratedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: "Thank you for your feedback!" });
  } catch (error) {
    console.error("Failed to submit rating:", error);
    return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 });
  }
}
