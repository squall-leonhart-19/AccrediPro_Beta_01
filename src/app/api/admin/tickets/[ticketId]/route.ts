import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// GET - Get single ticket with all messages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ticketId } = await params;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            enrollments: {
              include: { course: { select: { title: true } } },
              take: 5,
            },
          },
        },
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sentBy: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error("Failed to fetch ticket:", error);
    return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 });
  }
}

// PATCH - Update ticket (status, priority, assignment, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ticketId } = await params;
    const body = await request.json();
    const { status, priority, category, assignedToId } = body;

    const updateData: Record<string, unknown> = {};

    if (status) {
      updateData.status = status;
      if (status === "RESOLVED") {
        updateData.resolvedAt = new Date();
      }
      if (status === "CLOSED") {
        updateData.closedAt = new Date();
      }
    }
    if (priority) updateData.priority = priority;
    if (category) updateData.category = category;
    if (assignedToId !== undefined) updateData.assignedToId = assignedToId || null;

    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: updateData,
      include: {
        assignedTo: { select: { firstName: true, lastName: true } },
      },
    });

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error("Failed to update ticket:", error);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}

// POST - Add reply to ticket (sends email to customer)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ticketId } = await params;
    const body = await request.json();
    const { content, isInternal } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Get ticket info
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      select: {
        id: true,
        ticketNumber: true,
        subject: true,
        customerEmail: true,
        customerName: true,
        firstResponseAt: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    let emailMessageId: string | null = null;
    let emailSentAt: Date | null = null;

    // Send email if not internal note
    if (!isInternal) {
      try {
        const emailResult = await resend.emails.send({
          from: "AccrediPro Support <support@accredipro-certificate.com>",
          to: ticket.customerEmail,
          replyTo: `ticket-${ticket.ticketNumber}@accredipro-certificate.com`,
          subject: `Re: [Ticket #${ticket.ticketNumber}] ${ticket.subject}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
              </head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <p>Hi ${ticket.customerName.split(" ")[0]},</p>

                <div style="margin: 20px 0; padding: 20px; background: #f9f9f9; border-left: 4px solid #6B2C40;">
                  ${content.replace(/\n/g, "<br>")}
                </div>

                <p>You can reply directly to this email to continue the conversation.</p>

                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

                <p style="color: #666; font-size: 12px;">
                  Ticket #${ticket.ticketNumber}<br>
                  AccrediPro Academy Support<br>
                  <a href="https://learn.accredipro.academy/dashboard/support">View your tickets</a>
                </p>
              </body>
            </html>
          `,
        });

        emailMessageId = emailResult.data?.id || null;
        emailSentAt = new Date();
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Continue anyway, just log the message without email
      }
    }

    // Create message
    const message = await prisma.ticketMessage.create({
      data: {
        ticketId,
        content,
        isFromCustomer: false,
        isInternal: isInternal || false,
        sentById: session.user.id,
        emailMessageId,
        emailSentAt,
      },
      include: {
        sentBy: { select: { firstName: true, lastName: true } },
      },
    });

    // Update ticket
    const updateData: Record<string, unknown> = {
      status: "OPEN",
      updatedAt: new Date(),
    };

    // Set first response time if this is the first staff reply
    if (!ticket.firstResponseAt && !isInternal) {
      updateData.firstResponseAt = new Date();
    }

    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: updateData,
    });

    return NextResponse.json({
      message,
      emailSent: !!emailMessageId,
    });
  } catch (error) {
    console.error("Failed to add reply:", error);
    return NextResponse.json({ error: "Failed to add reply" }, { status: 500 });
  }
}

// DELETE - Delete ticket
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ticketId } = await params;

    await prisma.supportTicket.delete({
      where: { id: ticketId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete ticket:", error);
    return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 });
  }
}
