import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Resend Inbound Webhook - receives email.received events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("[INBOUND] Webhook received:", JSON.stringify(body, null, 2));

    // Check if this is a Resend webhook event
    if (body.type === "email.received") {
      const { data } = body;

      // Resend email.received payload structure:
      // data.from, data.to, data.subject, data.text, data.html
      const { from, to, subject, text, html } = data;

      console.log("[INBOUND] Email received event:", { from, to, subject, hasText: !!text, hasHtml: !!html });

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

      // Get email content from the webhook payload directly
      let emailContent = text || "";

      // If no text, try to extract from HTML
      if (!emailContent && html) {
        emailContent = html
          .replace(/<br\s*\/?>/gi, "\n")
          .replace(/<\/p>/gi, "\n\n")
          .replace(/<[^>]*>/g, "")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .trim();
      }

      console.log("[INBOUND] Raw email content:", emailContent?.substring(0, 500));

      // Clean up the email content - remove quoted reply text
      let cleanContent = emailContent;

      // Try to extract just the new reply by splitting on common patterns
      const replyPatterns = [
        /On .+wrote:/i,
        /On .+ at .+ wrote:/i,
        /-----Original Message-----/i,
        /From:.*\nSent:.*\nTo:/i,
        /_{3,}/,
        /-{3,}/,
      ];

      for (const pattern of replyPatterns) {
        const match = cleanContent.match(pattern);
        if (match && match.index !== undefined && match.index > 0) {
          cleanContent = cleanContent.substring(0, match.index).trim();
          break;
        }
      }

      // Remove lines starting with > (quoted text)
      cleanContent = cleanContent
        .split("\n")
        .filter((line) => !line.trim().startsWith(">"))
        .join("\n")
        .trim();

      // Clean up multiple newlines
      cleanContent = cleanContent.replace(/\n{3,}/g, "\n\n").trim();

      // Fallback if we couldn't extract content
      if (!cleanContent) {
        cleanContent = emailContent || `(Reply to ticket - see email for details)`;
      }

      console.log("[INBOUND] Clean content:", cleanContent?.substring(0, 200));

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

    // Handle other webhook formats or direct POST
    const { from, to, subject, text, html } = body;

    if (to) {
      console.log("[INBOUND] Direct format email:", { from, to, subject });

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

    console.log("[INBOUND] Unknown webhook format");
    return NextResponse.json({ success: false, reason: "Unknown format" });
  } catch (error) {
    console.error("[INBOUND] Webhook error:", error);
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
