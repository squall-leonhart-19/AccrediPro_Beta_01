import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Resend Inbound Webhook - receives email.received events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("[INBOUND] Webhook type:", body.type);

    // Check if this is a Resend webhook event
    if (body.type === "email.received") {
      const { data } = body;
      const emailId = data.email_id;
      const from = data.from;
      const to = data.to;
      const subject = data.subject;

      console.log("[INBOUND] Email received:", { emailId, from, to, subject });

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

      // Fetch the full email content using Resend SDK
      let emailContent = "";

      if (emailId) {
        try {
          console.log("[INBOUND] Fetching email content for:", emailId);

          // Use Resend SDK to get the received email
          const { data: emailData, error } = await resend.emails.receiving.get(emailId);

          if (error) {
            console.error("[INBOUND] Resend SDK error:", error);
          }

          if (emailData) {
            console.log("[INBOUND] Email data received:", {
              hasText: !!emailData.text,
              hasHtml: !!emailData.html,
              textLength: emailData.text?.length || 0,
              htmlLength: emailData.html?.length || 0,
            });

            // Get text content, or extract from HTML
            emailContent = emailData.text || "";

            if (!emailContent && emailData.html) {
              emailContent = emailData.html
                .replace(/<br\s*\/?>/gi, "\n")
                .replace(/<\/p>/gi, "\n\n")
                .replace(/<\/div>/gi, "\n")
                .replace(/<[^>]*>/g, "")
                .replace(/&nbsp;/g, " ")
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .trim();
            }

            console.log("[INBOUND] Extracted content preview:", emailContent?.substring(0, 100));
          }
        } catch (fetchError) {
          console.error("[INBOUND] Error fetching email:", fetchError);
        }
      }

      // Clean up the email content
      let cleanContent = emailContent;

      if (cleanContent) {
        // Remove quoted reply text (various languages/formats)
        const replyPatterns = [
          /On .+wrote:/i,
          /On .+ at .+ wrote:/i,
          /Il giorno .+ ha scritto:/i, // Italian
          /Le .+ a écrit:/i, // French
          /Am .+ schrieb:/i, // German
          /El .+ escribió:/i, // Spanish
          /-----Original Message-----/i,
          /From:.*\r?\nSent:.*\r?\nTo:/i,
          /Da:.*\r?\nInviato:.*\r?\nA:/i, // Italian Outlook
          /_{3,}/,
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
      }

      // Fallback if no content extracted
      if (!cleanContent) {
        cleanContent = `[Customer replied via email]`;
      }

      console.log("[INBOUND] Final content:", cleanContent);

      // Extract sender email
      const senderEmail = typeof from === "string"
        ? from.match(/<(.+?)>/)?.[1] || from
        : from;

      // Add message to ticket
      await prisma.ticketMessage.create({
        data: {
          ticketId: ticket.id,
          content: cleanContent,
          isFromCustomer: true,
          isInternal: false,
        },
      });

      // Update ticket status to OPEN if closed
      if (["PENDING", "RESOLVED", "CLOSED"].includes(ticket.status)) {
        await prisma.supportTicket.update({
          where: { id: ticket.id },
          data: {
            status: "OPEN",
            updatedAt: new Date(),
          },
        });
      }

      console.log(`[INBOUND] Success! Added reply to ticket #${ticketNumber} from ${senderEmail}`);

      return NextResponse.json({ success: true, ticketNumber });
    }

    console.log("[INBOUND] Not an email.received event:", body.type);
    return NextResponse.json({ success: false, reason: "Not email.received event" });
  } catch (error) {
    console.error("[INBOUND] Webhook error:", error);
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
