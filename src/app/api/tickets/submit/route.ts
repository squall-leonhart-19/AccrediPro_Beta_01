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
    const ticketCategory = category || await classifyTicketWithAI(subject, message);

    // Auto-route to department based on category
    const CATEGORY_TO_DEPARTMENT: Record<string, string> = {
      REFUND: "LEGAL",
      BILLING: "BILLING",
      TECHNICAL: "SUPPORT",
      ACCESS: "SUPPORT",
      CERTIFICATES: "CREDENTIALING",
      COURSE_CONTENT: "ACADEMIC",
      GENERAL: "SUPPORT",
    };
    const ticketDepartment = CATEGORY_TO_DEPARTMENT[ticketCategory] || "SUPPORT";

    const ticket = await prisma.supportTicket.create({
      data: {
        subject,
        customerName,
        customerEmail,
        category: ticketCategory,
        department: ticketDepartment as any,
        userId: session?.user?.id || userId || null,
        messages: {
          create: {
            content: message,
            isFromCustomer: true,
          },
        },
      },
    });

    // Department-specific info for email
    const DEPARTMENT_EMAIL_INFO: Record<string, { name: string; response: string; color: string }> = {
      SUPPORT: { name: "Student Success Team", response: "24-48 Working Hours", color: "#10B981" },
      BILLING: { name: "Accounts & Billing Team", response: "24-48 Working Hours", color: "#3B82F6" },
      LEGAL: { name: "Consumer Affairs Division", response: "24-48 Working Hours", color: "#EF4444" },
      ACADEMIC: { name: "Academic Affairs Office", response: "24-48 Working Hours", color: "#8B5CF6" },
      CREDENTIALING: { name: "Credentialing Board", response: "24-48 Working Hours", color: "#F59E0B" },
      TECHNICAL: { name: "Technical Support Team", response: "24-48 Working Hours", color: "#06B6D4" },
    };
    const deptInfo = DEPARTMENT_EMAIL_INFO[ticketDepartment] || DEPARTMENT_EMAIL_INFO.SUPPORT;

    // Send confirmation email to customer
    try {
      await resend.emails.send({
        from: "AccrediPro Academy <support@accredipro-certificate.com>",
        to: customerEmail,
        replyTo: `ticket-${ticket.ticketNumber}@tickets.accredipro-certificate.com`,
        subject: `✅ Ticket #${ticket.ticketNumber} Received - ${subject}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Ticket Confirmation</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                
                <!-- Header with Logo -->
                <div style="background: linear-gradient(135deg, #722F37 0%, #8B3D47 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                  <img src="https://learn.accredipro.academy/logo-gold.png" alt="AccrediPro Academy" style="height: 50px; margin-bottom: 15px;" onerror="this.style.display='none'">
                  <h1 style="color: #D4AF37; margin: 0; font-size: 24px; font-weight: 700;">We've Got You!</h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Your support request has been received</p>
                </div>

                <!-- Main Content -->
                <div style="background: #ffffff; padding: 35px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                  
                  <!-- Greeting -->
                  <p style="font-size: 17px; margin: 0 0 20px 0;">Hi <strong>${customerName.split(" ")[0]}</strong>,</p>
                  
                  <p style="margin: 0 0 25px 0; color: #555;">Thank you for reaching out! We've created ticket <strong style="color: #722F37;">#${ticket.ticketNumber}</strong> for your request.</p>

                  <!-- Ticket Details Card -->
                  <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; padding: 20px; margin-bottom: 25px; border-left: 4px solid ${deptInfo.color};">
                    <table style="width: 100%;">
                      <tr>
                        <td style="padding: 6px 0; color: #666; font-size: 13px; width: 100px;">Ticket #</td>
                        <td style="padding: 6px 0; font-weight: 600; color: #333;">${ticket.ticketNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #666; font-size: 13px;">Subject</td>
                        <td style="padding: 6px 0; font-weight: 600; color: #333;">${subject}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #666; font-size: 13px;">Assigned To</td>
                        <td style="padding: 6px 0;">
                          <span style="display: inline-block; background: ${deptInfo.color}15; color: ${deptInfo.color}; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">${deptInfo.name}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #666; font-size: 13px;">Response Time</td>
                        <td style="padding: 6px 0; font-weight: 600; color: #333;">Within ${deptInfo.response}</td>
                      </tr>
                    </table>
                  </div>

                  <!-- Your Message -->
                  <div style="background: #fafafa; border-radius: 10px; padding: 18px; margin-bottom: 25px; border: 1px solid #eee;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Your Message</p>
                    <p style="margin: 0; color: #444; font-size: 14px; line-height: 1.7;">${message.replace(/\n/g, "<br>")}</p>
                  </div>

                  <!-- CTA Button -->
                  ${session ? `
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://learn.accredipro.academy/dashboard/support" style="display: inline-block; background: linear-gradient(135deg, #722F37 0%, #8B3D47 100%); color: #ffffff; padding: 14px 35px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(114,47,55,0.3);">
                      📬 View Your Tickets
                    </a>
                  </div>
                  ` : ""}

                  <!-- Quick Tips -->
                  <div style="background: #FEF3C7; border-radius: 10px; padding: 16px; margin-bottom: 25px; border: 1px solid #FCD34D;">
                    <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #92400E;">💡 Quick Tip</p>
                    <p style="margin: 0; color: #78350F; font-size: 13px;">You can reply directly to this email to add more information to your ticket. Just hit reply!</p>
                  </div>

                  <!-- Social Proof - Minimal -->
                  <div style="text-align: center; padding: 20px 0; border-top: 1px solid #eee;">
                    <p style="margin: 0 0 3px 0; color: #D4AF37; font-size: 16px; letter-spacing: 2px;">★★★★★</p>
                    <p style="margin: 0 0 2px 0; color: #333; font-size: 12px;">Trusted by <strong>9,376</strong> certified professionals</p>
                    <p style="margin: 0; color: #888; font-size: 11px;">who trust AccrediPro Academy for their healthcare certifications</p>
                  </div>
                </div>

                <!-- Footer -->
                <div style="text-align: center; padding: 25px 20px; color: #888;">
                  <p style="margin: 0 0 10px 0; font-size: 13px;">
                    <a href="https://accredipro.academy" style="color: #722F37; text-decoration: none;">AccrediPro Academy</a>
                    &nbsp;|&nbsp;
                    <a href="https://learn.accredipro.academy/dashboard" style="color: #722F37; text-decoration: none;">My Dashboard</a>
                  </p>
                  <p style="margin: 0; font-size: 11px; color: #aaa;">
                    © ${new Date().getFullYear()} AccrediPro Academy™. All rights reserved.<br>
                    Accredited by 9 leading healthcare certification bodies.
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
