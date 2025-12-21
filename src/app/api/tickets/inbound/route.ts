import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Resend Inbound Webhook - receives emails sent to ticket-{number}@domain
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Resend inbound webhook payload
    const {
      from,
      to,
      subject,
      text,
      html,
    } = body;

    console.log("Inbound email received:", { from, to, subject });

    // Extract ticket number from reply-to address
    // Format: ticket-1234@accredipro-certificate.com
    const toAddress = Array.isArray(to) ? to[0] : to;
    const ticketMatch = toAddress?.match(/ticket-(\d+)@/i);

    if (!ticketMatch) {
      console.log("No ticket number found in email address:", toAddress);
      return NextResponse.json({ error: "Invalid ticket address" }, { status: 400 });
    }

    const ticketNumber = parseInt(ticketMatch[1]);

    // Find the ticket
    const ticket = await prisma.supportTicket.findUnique({
      where: { ticketNumber },
    });

    if (!ticket) {
      console.log("Ticket not found:", ticketNumber);
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Clean up the email content
    // Remove quoted reply text (lines starting with >)
    let cleanContent = text || "";

    // Try to extract just the new reply by splitting on common patterns
    const replyPatterns = [
      /On .+ wrote:/i,
      /-----Original Message-----/i,
      /From:.*\nSent:.*\nTo:/i,
      /-{3,}/,
    ];

    for (const pattern of replyPatterns) {
      const match = cleanContent.match(pattern);
      if (match && match.index) {
        cleanContent = cleanContent.substring(0, match.index).trim();
        break;
      }
    }

    // Remove lines starting with >
    cleanContent = cleanContent
      .split("\n")
      .filter((line) => !line.trim().startsWith(">"))
      .join("\n")
      .trim();

    if (!cleanContent) {
      cleanContent = text || html?.replace(/<[^>]*>/g, "") || "(Empty reply)";
    }

    // Extract sender email
    const senderEmail = typeof from === "string"
      ? from.match(/<(.+?)>/)?.[1] || from
      : from?.address || from?.email || "unknown";

    // Add message to ticket
    await prisma.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        content: cleanContent,
        isFromCustomer: true,
        isInternal: false,
      },
    });

    // Update ticket status to OPEN if it was PENDING or RESOLVED
    if (["PENDING", "RESOLVED", "CLOSED"].includes(ticket.status)) {
      await prisma.supportTicket.update({
        where: { id: ticket.id },
        data: {
          status: "OPEN",
          updatedAt: new Date(),
        },
      });
    }

    console.log(`Added reply to ticket #${ticketNumber} from ${senderEmail}`);

    return NextResponse.json({ success: true, ticketNumber });
  } catch (error) {
    console.error("Inbound email webhook error:", error);
    return NextResponse.json({ error: "Failed to process inbound email" }, { status: 500 });
  }
}
