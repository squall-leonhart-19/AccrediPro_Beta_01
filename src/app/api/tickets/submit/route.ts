import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

import Anthropic from "@anthropic-ai/sdk";

// Helper to classify ticket using AI
const classifyTicketWithAI = async (subject: string, message: string): Promise<string> => {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const completion = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 10,
      messages: [
        {
          role: "user",
          content: `Classify this support ticket into exactly one of these categories: BILLING, TECHNICAL, ACCESS, CERTIFICATES, COURSE_CONTENT, REFUND, GENERAL.
          
          Subject: ${subject}
          Message: ${message}
          
          Reply ONLY with the category name.`
        }
      ]
    });

    const textBlock = completion.content[0];
    const category = textBlock.type === 'text' ? textBlock.text.trim().toUpperCase() : "GENERAL";

    const validCategories = ["BILLING", "TECHNICAL", "ACCESS", "CERTIFICATES", "COURSE_CONTENT", "REFUND", "GENERAL"];
    return validCategories.includes(category) ? category : "GENERAL";
  } catch (error) {
    console.error("AI Classification failed:", error);
    // Fallback to regex
    const text = (subject + " " + message).toLowerCase();
    if (text.includes("refund")) return "REFUND";
    if (text.match(/money|charge|bill|invoice|payment|card|bank/)) return "BILLING";
    if (text.match(/login|password|access|cant log|can't log|error|bug|broken|crash/)) return "TECHNICAL";
    if (text.match(/unlocked|locked|permission|module/)) return "ACCESS";
    if (text.match(/certificate|diploma|exam|quiz|test|pass|fail/)) return "CERTIFICATES";
    if (text.match(/content|video|lesson|material/)) return "COURSE_CONTENT";
    return "GENERAL";
  }
};

// POST - Customer submits a new ticket
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const { subject, message, category, name, email, userId } = body;

    // Get customer info from session or form
    const customerName = session?.user?.name || name;
    const customerEmail = session?.user?.email || email;

    if (!subject || !message || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: "Subject, message, name, and email are required" },
        { status: 400 }
      );
    }

    // AUTO-MERGE: Check for existing OPEN or NEW ticket
    const existingTicket = await prisma.supportTicket.findFirst({
      where: {
        OR: [
          { userId: session?.user?.id || userId || undefined },
          { customerEmail: customerEmail }
        ],
        status: { in: ["NEW", "OPEN", "PENDING"] }
      },
      orderBy: { createdAt: "desc" }
    });

    if (existingTicket) {
      // Append message to existing ticket
      await prisma.ticketMessage.create({
        data: {
          ticketId: existingTicket.id,
          content: message,
          isFromCustomer: true
        }
      });

      // Update ticket timestamp and status if needed
      await prisma.supportTicket.update({
        where: { id: existingTicket.id },
        data: {
          updatedAt: new Date(),
          // If pending (waiting for user), move back to OPEN so admin sees reply
          status: existingTicket.status === "PENDING" ? "OPEN" : existingTicket.status
        }
      });

      // Notify customer of merge
      try {
        await resend.emails.send({
          from: "AccrediPro Support <support@accredipro-certificate.com>",
          to: customerEmail,
          subject: `[Ticket #${existingTicket.ticketNumber}] New message added to your open request`,
          html: `
                  <div style="font-family: Arial, sans-serif; color: #333;">
                    <p>Hi ${customerName.split(" ")[0]},</p>
                    <p>We've added your new message to your existing open ticket <strong>#${existingTicket.ticketNumber}</strong>.</p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; margin: 15px 0;">
                       "${message}"
                    </div>
                    <p>You don't need to do anything else. Our team will review this along with your previous messages.</p>
                  </div>
                `
        });
      } catch (e) {
        console.error("Failed to send merge notification:", e);
      }

      return NextResponse.json({
        success: true,
        ticketNumber: existingTicket.ticketNumber,
        message: `Message added to existing ticket #${existingTicket.ticketNumber}`,
        merged: true
      });
    }

    // Create NEW ticket (if no open one exists)
    const ticket = await prisma.supportTicket.create({
      data: {
        subject,
        customerName,
        customerEmail,
        category: category || await classifyTicketWithAI(subject, message),
        userId: session?.user?.id || userId || null,
        messages: {
          create: {
            content: message,
            isFromCustomer: true,
          },
        },
      },
    });

    // Send confirmation email to customer
    try {
      await resend.emails.send({
        from: "AccrediPro Support <support@accredipro-certificate.com>",
        to: customerEmail,
        replyTo: `ticket-${ticket.ticketNumber}@tickets.accredipro-certificate.com`,
        subject: `[Ticket #${ticket.ticketNumber}] ${subject} - We've received your request`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #6B2C40 0%, #8B3A42 100%); padding: 30px; border-radius: 12px 12px 0 0;">
                  <h1 style="color: #D4AF37; margin: 0; font-size: 24px;">AccrediPro Support</h1>
                </div>

                <div style="background: #fff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 12px 12px;">
                  <p>Hi ${customerName.split(" ")[0]},</p>

                  <p>Thank you for contacting AccrediPro Support. We've received your request and created ticket <strong>#${ticket.ticketNumber}</strong>.</p>

                  <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0; font-weight: bold;">Your message:</p>
                    <p style="margin: 0; color: #555;">${message.replace(/\n/g, "<br>")}</p>
                  </div>

                  <p>Our team will review your request and respond within <strong>24 hours</strong>.</p>

                  <p>You can reply directly to this email to add more information to your ticket.</p>

                  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

                  <p style="color: #888; font-size: 12px; margin: 0;">
                    Ticket #${ticket.ticketNumber}<br>
                    ${session ? `<a href="https://learn.accredipro.academy/dashboard/support">View your tickets</a>` : ""}
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Continue anyway
    }

    // Notify staff via email
    try {
      await resend.emails.send({
        from: "AccrediPro Support <support@accredipro-certificate.com>",
        to: "info@accredipro.academy", // Staff notification email
        subject: `🎫 New Ticket #${ticket.ticketNumber}: ${subject}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head><meta charset="utf-8"></head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #6B2C40; padding: 20px; border-radius: 8px 8px 0 0;">
                  <h2 style="color: #FFD700; margin: 0;">🎫 New Support Ticket</h2>
                </div>
                <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
                  <table style="width: 100%; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 8px 0; color: #666;">Ticket #</td>
                      <td style="padding: 8px 0; font-weight: bold;">${ticket.ticketNumber}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666;">From</td>
                      <td style="padding: 8px 0;"><strong>${customerName}</strong> (${customerEmail})</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666;">Category</td>
                      <td style="padding: 8px 0;">${category || "GENERAL"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666;">Subject</td>
                      <td style="padding: 8px 0; font-weight: bold;">${subject}</td>
                    </tr>
                  </table>

                  <div style="background: #f5f5f5; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                    <p style="margin: 0 0 8px; font-weight: bold; color: #666;">Message:</p>
                    <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                  </div>

                  <a href="https://learn.accredipro.academy/admin/tickets"
                     style="display: inline-block; background: #6B2C40; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                    Open Ticket in Admin →
                  </a>
                </div>
              </div>
            </body>
          </html>
        `,
      });
    } catch (staffEmailError) {
      console.error("Failed to send staff notification:", staffEmailError);
    }

    return NextResponse.json({
      success: true,
      ticketNumber: ticket.ticketNumber,
      message: `Ticket #${ticket.ticketNumber} created successfully`,
    });
  } catch (error) {
    console.error("Failed to submit ticket:", error);
    return NextResponse.json({ error: "Failed to submit ticket" }, { status: 500 });
  }
}

// GET - Get customer's tickets (requires auth)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get("id");

    if (ticketId) {
      // Fetch single ticket details
      const ticket = await prisma.supportTicket.findUnique({
        where: { id: ticketId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" }, // Ascending for chat view
          }
        }
      });

      if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

      // Verify ownership
      const isOwner = ticket.userId === session.user.id || ticket.customerEmail === session.user.email;
      if (!isOwner) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

      return NextResponse.json({ ticket });
    }

    // List tickets
    const tickets = await prisma.supportTicket.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { customerEmail: session.user.email },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { content: true, createdAt: true, isFromCustomer: true },
        },
        _count: { select: { messages: true } },
      },
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}
