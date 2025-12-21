import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Resend Inbound Webhook - receives email.received events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("[INBOUND] Webhook received:", JSON.stringify(body, null, 2));

    // Check if this is a Resend webhook event
    if (body.type === "email.received") {
      const { data } = body;
      const { email_id, from, to, subject } = data;

      console.log("[INBOUND] Email received event:", { email_id, from, to, subject });

      // Get the "to" address to extract ticket number
      const toAddresses = Array.isArray(to) ? to : [to];
      let ticketNumber: number | null = null;

      for (const toAddr of toAddresses) {
        const match = toAddr?.match(/ticket-(\d+)@/i);
        if (match) {
          ticketNumber = parseInt(match[1]);
          break;
        }
      }

      if (!ticketNumber) {
        console.log("[INBOUND] No ticket number found in addresses:", toAddresses);
        // Return 200 to acknowledge webhook (don't want Resend to retry)
        return NextResponse.json({ success: false, reason: "No ticket number in address" });
      }

      // Find the ticket
      const ticket = await prisma.supportTicket.findUnique({
        where: { ticketNumber },
      });

      if (!ticket) {
        console.log("[INBOUND] Ticket not found:", ticketNumber);
        return NextResponse.json({ success: false, reason: "Ticket not found" });
      }

      // Fetch the full email content from Resend API
      let emailContent = "";
      try {
        const emailResponse = await fetch(`https://api.resend.com/emails/${email_id}`, {
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
        });

        if (emailResponse.ok) {
          const emailData = await emailResponse.json();
          emailContent = emailData.text || emailData.html?.replace(/<[^>]*>/g, "") || "";
          console.log("[INBOUND] Fetched email content:", emailContent.substring(0, 200));
        } else {
          console.log("[INBOUND] Failed to fetch email:", emailResponse.status);
          // Use subject as fallback
          emailContent = `[Email reply - content unavailable]\n\nSubject: ${subject}`;
        }
      } catch (fetchError) {
        console.error("[INBOUND] Error fetching email content:", fetchError);
        emailContent = `[Email reply]\n\nSubject: ${subject}`;
      }

      // Clean up the email content - remove quoted reply text
      let cleanContent = emailContent;

      // Try to extract just the new reply by splitting on common patterns
      const replyPatterns = [
        /On .+ wrote:/i,
        /-----Original Message-----/i,
        /From:.*\nSent:.*\nTo:/i,
        /-{3,}/,
        /^>.*$/gm,
      ];

      for (const pattern of replyPatterns) {
        if (pattern.global) {
          // For global patterns, remove matching lines
          cleanContent = cleanContent.replace(pattern, "");
        } else {
          const match = cleanContent.match(pattern);
          if (match && match.index) {
            cleanContent = cleanContent.substring(0, match.index).trim();
            break;
          }
        }
      }

      // Remove lines starting with >
      cleanContent = cleanContent
        .split("\n")
        .filter((line) => !line.trim().startsWith(">"))
        .join("\n")
        .trim();

      if (!cleanContent) {
        cleanContent = emailContent || "(Empty reply)";
      }

      // Extract sender email
      const senderEmail = typeof from === "string"
        ? from.match(/<(.+?)>/)?.[1] || from
        : "unknown";

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

      console.log(`[INBOUND] Added reply to ticket #${ticketNumber} from ${senderEmail}`);

      return NextResponse.json({ success: true, ticketNumber });
    }

    // Handle legacy/direct format (in case we need it)
    const { from, to, subject, text, html } = body;

    if (to) {
      console.log("[INBOUND] Legacy format email:", { from, to, subject });

      const toAddress = Array.isArray(to) ? to[0] : to;
      const ticketMatch = toAddress?.match(/ticket-(\d+)@/i);

      if (!ticketMatch) {
        console.log("[INBOUND] No ticket number found:", toAddress);
        return NextResponse.json({ success: false, reason: "No ticket number" });
      }

      const ticketNumber = parseInt(ticketMatch[1]);

      const ticket = await prisma.supportTicket.findUnique({
        where: { ticketNumber },
      });

      if (!ticket) {
        console.log("[INBOUND] Ticket not found:", ticketNumber);
        return NextResponse.json({ success: false, reason: "Ticket not found" });
      }

      let cleanContent = text || html?.replace(/<[^>]*>/g, "") || "(Empty reply)";

      // Clean quoted text
      cleanContent = cleanContent
        .split("\n")
        .filter((line: string) => !line.trim().startsWith(">"))
        .join("\n")
        .trim() || cleanContent;

      await prisma.ticketMessage.create({
        data: {
          ticketId: ticket.id,
          content: cleanContent,
          isFromCustomer: true,
          isInternal: false,
        },
      });

      if (["PENDING", "RESOLVED", "CLOSED"].includes(ticket.status)) {
        await prisma.supportTicket.update({
          where: { id: ticket.id },
          data: { status: "OPEN", updatedAt: new Date() },
        });
      }

      console.log(`[INBOUND] Added reply to ticket #${ticketNumber}`);
      return NextResponse.json({ success: true, ticketNumber });
    }

    console.log("[INBOUND] Unknown webhook format:", body);
    return NextResponse.json({ success: false, reason: "Unknown format" });
  } catch (error) {
    console.error("[INBOUND] Webhook error:", error);
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
