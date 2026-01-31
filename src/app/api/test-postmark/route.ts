import { NextResponse } from "next/server";
import * as postmark from "postmark";

// Test Postmark directly - GET /api/test-postmark?email=test@example.com
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "at.seed019@gmail.com";

    if (!process.env.POSTMARK_API_KEY) {
        return NextResponse.json({ success: false, error: "POSTMARK_API_KEY not set" }, { status: 500 });
    }

    const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

    try {
        const result = await client.sendEmail({
            From: "AccrediPro <info@accredipro.academy>",
            To: email,
            Subject: "🧪 Postmark Test - AccrediPro",
            HtmlBody: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #722F37;">✅ Postmark Integration Working!</h1>
          <p>This is a test email from AccrediPro using <strong>Postmark</strong> as the email provider.</p>
          <p style="color: #666;">Sent at: ${new Date().toISOString()}</p>
          <hr/>
          <p style="font-size: 12px; color: #999;">AccrediPro Academy - Professional Certification Excellence</p>
        </div>
      `,
            TextBody: `Postmark Test - AccrediPro\n\nThis is a test email from AccrediPro using Postmark.\nSent at: ${new Date().toISOString()}`,
            MessageStream: "outbound",
        });

        console.log("✅ Postmark test email sent:", result);

        return NextResponse.json({
            success: true,
            messageId: result.MessageID,
            to: email,
            submittedAt: result.SubmittedAt,
        });
    } catch (error) {
        console.error("❌ Postmark test failed:", error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
