import { Resend } from "resend";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
  console.log("Testing email with same sender as transactional...");
  
  try {
    const result = await resend.emails.send({
      from: "accredipro-certificate.com <info@accredipro-certificate.com>",
      to: ["tortolialessio1997@gmail.com"],
      subject: "Test - Personal Style Email",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #333; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto;">
              <p>Hi there,</p>
              <p>This is a test email using the same sender as transactional emails.</p>
              <p>It should land in your Primary inbox!</p>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888;">
                <p style="margin: 0;">AccrediPro Academy</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    
    if (result.data) {
      console.log("✅ Email sent successfully!");
      console.log("Message ID:", result.data.id);
    } else {
      console.log("❌ Email failed:", result.error);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

test();
