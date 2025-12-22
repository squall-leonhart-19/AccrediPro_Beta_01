import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Resend Inbound Webhook - receives email.received events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("[INBOUND] Full webhook payload:", JSON.stringify(body, null, 2));

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

      // Fetch the full email content from Resend's receiving API
      let emailContent = "";

      if (emailId) {
        try {
          // Use the receiving emails endpoint
          const emailResponse = await fetch(
            `https://api.resend.com/emails/receiving/${emailId}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              },
            }
          );

          console.log("[INBOUND] Fetch response status:", emailResponse.status);

          if (emailResponse.ok) {
            const emailData = await emailResponse.json();
            console.log("[INBOUND] Fetched email data keys:", Object.keys(emailData));

            // Try different possible field names
            emailContent = emailData.text ||
                          emailData.body ||
                          emailData.plain_text ||
                          emailData.text_body ||
                          "";

            // If no text, try HTML
            if (!emailContent && (emailData.html || emailData.html_body)) {
              const htmlContent = emailData.html || emailData.html_body;
              emailContent = htmlContent
                .replace(/<br\s*\/?>/gi, "\n")
                .replace(/<\/p>/gi, "\n\n")
                .replace(/<[^>]*>/g, "")
                .replace(/&nbsp;/g, " ")
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .trim();
            }

            console.log("[INBOUND] Extracted content:", emailContent?.substring(0, 200));
          } else {
            const errorText = await emailResponse.text();
            console.log("[INBOUND] Fetch error:", emailResponse.status, errorText);
          }
        } catch (fetchError) {
          console.error("[INBOUND] Error fetching email:", fetchError);
        }
      }

      // If we still don't have content, check if it's in the webhook data
      if (!emailContent) {
        emailContent = data.text || data.body || data.plain_text || "";

        if (!emailContent && data.html) {
          emailContent = data.html
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>/gi, "\n\n")
            .replace(/<[^>]*>/g, "")
            .trim();
        }
      }

      // Clean up the email content
      let cleanContent = emailContent;

      if (cleanContent) {
        // Remove quoted reply text
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

        // Remove lines starting with >
        cleanContent = cleanContent
          .split("\n")
          .filter((line) => !line.trim().startsWith(">"))
          .join("\n")
          .trim();

        // Clean up multiple newlines
        cleanContent = cleanContent.replace(/\n{3,}/g, "\n\n").trim();
      }

      // Final fallback - use a meaningful message
      if (!cleanContent) {
        // Extract just the new content indicator
        cleanContent = `[Customer replied via email]\n\nSubject: ${subject || "Re: Ticket"}`;
      }

      console.log("[INBOUND] Final content:", cleanContent);

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

      console.log(`[INBOUND] Added reply to ticket #${ticketNumber} from ${senderEmail}`);

      return NextResponse.json({ success: true, ticketNumber });
    }

    console.log("[INBOUND] Not an email.received event:", body.type);
    return NextResponse.json({ success: false, reason: "Not email.received event" });
  } catch (error) {
    console.error("[INBOUND] Webhook error:", error);
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
