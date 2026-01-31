import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, message, category } = await request.json();

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    const userEmail = session.user.email;
    const userName = session.user.name || "Student";

    // Escape HTML to prevent injection in email templates
    const escapeHtml = (str: string) =>
      str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

    const safeUserName = escapeHtml(userName);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);
    const safeCategory = category ? escapeHtml(category) : "";

    // Send email to support
    const supportEmail = process.env.SUPPORT_EMAIL || "support@accredipro.academy";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Support Request</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #722F37; margin: 0;">AccrediPro Support</h1>
            <p style="color: #666; margin: 5px 0;">New Support Request</p>
          </div>

          <div style="background: #f8f9fa; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
            <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0;">
              <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">From</p>
              <p style="margin: 5px 0 0 0; font-weight: bold;">${safeUserName}</p>
              <p style="margin: 2px 0 0 0; color: #666;">${userEmail}</p>
            </div>

            ${category ? `
            <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0;">
              <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">Category</p>
              <p style="margin: 5px 0 0 0; font-weight: bold;">${safeCategory}</p>
            </div>
            ` : ""}

            <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0;">
              <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">Subject</p>
              <p style="margin: 5px 0 0 0; font-weight: bold;">${safeSubject}</p>
            </div>

            <div>
              <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">Message</p>
              <div style="margin-top: 10px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e0e0e0;">
                <p style="margin: 0; white-space: pre-wrap;">${safeMessage}</p>
              </div>
            </div>
          </div>

          <div style="text-align: center; color: #999; font-size: 12px;">
            <p>Reply directly to this email to respond to the student.</p>
          </div>
        </body>
      </html>
    `;

    const result = await sendEmail({
      to: supportEmail,
      subject: `[Support] ${category ? `[${category}] ` : ""}${subject}`,
      html,
    });

    if (!result.success) {
      console.error("Failed to send support email:", result.error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    // Send confirmation to user
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>We Received Your Message</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #722F37; margin: 0;">AccrediPro</h1>
            <p style="color: #666; margin: 5px 0;">Educational Excellence</p>
          </div>

          <div style="background: #f8f9fa; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">We Received Your Message</h2>
            <p>Hi ${escapeHtml(userName.split(" ")[0])},</p>
            <p>Thank you for reaching out to AccrediPro Support. We've received your message and will get back to you within 24 hours.</p>

            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #722F37;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #722F37;">Your Request:</p>
              <p style="margin: 0; color: #666;"><strong>Subject:</strong> ${safeSubject}</p>
              ${safeCategory ? `<p style="margin: 5px 0 0 0; color: #666;"><strong>Category:</strong> ${safeCategory}</p>` : ""}
            </div>

            <p style="color: #666; font-size: 14px;">In the meantime, you might find answers in our <a href="${process.env.NEXTAUTH_URL}/help" style="color: #722F37;">FAQ section</a> or reach out to your coach via <a href="${process.env.NEXTAUTH_URL}/messages" style="color: #722F37;">Live Chat</a>.</p>
          </div>

          <div style="text-align: center; color: #999; font-size: 12px;">
            <p>AccrediPro - Veritas Et Excellentia</p>
          </div>
        </body>
      </html>
    `;

    // Send confirmation email (fire and forget)
    sendEmail({
      to: userEmail!,
      subject: "We Received Your Support Request - AccrediPro",
      html: confirmationHtml,
    }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Support contact error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
