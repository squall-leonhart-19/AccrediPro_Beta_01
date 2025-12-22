import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendStaffNotificationEmail } from "@/lib/email";

// POST - Customer adds reply to their ticket
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ticketId } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Verify this ticket belongs to the user
    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id: ticketId,
        OR: [
          { userId: session.user.id },
          { customerEmail: session.user.email },
        ],
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Add message
    const message = await prisma.ticketMessage.create({
      data: {
        ticketId,
        content,
        isFromCustomer: true,
        isInternal: false,
      },
    });

    // Update ticket status to OPEN if it was PENDING or RESOLVED
    if (["PENDING", "RESOLVED"].includes(ticket.status)) {
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: "OPEN", updatedAt: new Date() },
      });
    }

    // Send notification to staff
    try {
      await sendStaffNotificationEmail(
        "info@accredipro.academy",
        ticket.ticketNumber,
        ticket.customerName,
        content,
        ticketId
      );
    } catch (emailError) {
      console.error("Failed to send staff notification:", emailError);
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Failed to add reply:", error);
    return NextResponse.json({ error: "Failed to add reply" }, { status: 500 });
  }
}
