import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

/**
 * POST /api/admin/scholarships/recovery
 *
 * Send recovery "Scholarship Approved" emails to existing leads.
 * Can send to a single lead or batch process.
 *
 * Body: {
 *   mode: "single" | "batch";
 *   email?: string; // For single mode
 *   firstName?: string;
 *   offeredAmount?: string;
 *   // For batch mode:
 *   leads?: Array<{ email: string; firstName: string; offeredAmount?: string }>;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { mode, email, firstName, offeredAmount, leads } = body as {
      mode: "single" | "batch";
      email?: string;
      firstName?: string;
      offeredAmount?: string;
      leads?: Array<{ email: string; firstName: string; offeredAmount?: string }>;
    };

    const results: Array<{ email: string; success: boolean; error?: string }> = [];

    const sendRecoveryEmail = async (
      toEmail: string,
      toFirstName: string,
      amount: string
    ) => {
      try {
        await sendEmail({
          to: toEmail,
          from: "Sarah M. <sarah@accredipro-certificate.com>",
          subject: `🎉 ${toFirstName}, Your ASI Scholarship Has Been APPROVED!`,
          type: "transactional",
          text: `Hey ${toFirstName}!

Great news - I've been reviewing scholarship applications and I just approved yours! 🎉

I remember you applied for our FM Certification scholarship recently, and I wanted to reach out personally because I believe in your potential.

Here's what you're getting with your approved scholarship:

✅ Full FM Certification
✅ 9 Clinical Certifications
✅ Lifetime access + mentorship
✅ Complete protocol library

Your approved scholarship: ${amount}

I know life gets busy, so I wanted to give you another chance to lock this in.

Here's the thing though - I can only hold this scholarship spot for 24 hours. After that, I'll need to offer it to someone else on the waitlist.

Ready to get started? Just reply to this email and I'll send you the secure payment link right away!

Talk soon,

Sarah M.
Scholarship Director
Accredipro Specialists Institute

P.S. You can also chat with me directly here: https://learn.accredipro.academy/quiz/depth-method`,
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="text-align: center; margin-bottom: 30px;">
    <img src="https://assets.accredipro.academy/fm-certification/Senza-titolo-Logo-1.png" alt="AccrediPro" style="width: 80px; height: auto;">
  </div>

  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 25px;">
    <h1 style="margin: 0; font-size: 26px;">🎉 SCHOLARSHIP APPROVED!</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Congratulations, ${toFirstName}!</p>
  </div>

  <p>Hey ${toFirstName}!</p>

  <p>I've been reviewing scholarship applications and I just approved yours! I remember you applied recently, and I wanted to reach out personally because I believe in your potential.</p>

  <div style="background: #f0fdf4; border: 2px solid #10b981; padding: 20px; border-radius: 12px; margin: 20px 0;">
    <h2 style="color: #059669; margin: 0 0 15px 0; font-size: 18px;">✅ What You're Getting:</h2>
    <ul style="margin: 0; padding-left: 20px; color: #166534;">
      <li>Full FM Certification</li>
      <li>9 Clinical Certifications</li>
      <li>Lifetime access + mentorship</li>
      <li>Complete protocol library</li>
    </ul>
    <p style="margin: 15px 0 0 0; font-size: 20px; font-weight: bold; color: #059669;">
      Your Scholarship: ${amount}
    </p>
  </div>

  <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 12px; margin: 20px 0;">
    <h3 style="color: #b45309; margin: 0 0 10px 0; font-size: 16px;">⏰ Limited Time</h3>
    <p style="margin: 0; color: #92400e;">
      I can only hold this scholarship spot for <strong>24 hours</strong>. After that, I'll need to offer it to someone else on the waitlist.
    </p>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <a href="https://learn.accredipro.academy/quiz/depth-method" style="display: inline-block; background: #722f37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
      Chat With Me to Lock In Your Spot →
    </a>
  </div>

  <p>Ready to get started? Just reply to this email and I'll send you the secure payment link right away!</p>

  <div style="margin-top: 30px;">
    <p style="margin: 0; font-weight: bold; color: #722f37;">Sarah M.</p>
    <p style="margin: 0; font-size: 14px; color: #666;">Scholarship Director</p>
    <p style="margin: 0; font-size: 14px; color: #666;">Accredipro Specialists Institute</p>
  </div>

</body>
</html>
          `,
        });

        // Track the recovery email in user tags if user exists
        const user = await prisma.user.findUnique({
          where: { email: toEmail.toLowerCase().trim() },
        });

        if (user) {
          await prisma.userTag.upsert({
            where: { userId_tag: { userId: user.id, tag: "scholarship_recovery_sent" } },
            update: { value: new Date().toISOString() },
            create: { userId: user.id, tag: "scholarship_recovery_sent", value: new Date().toISOString() },
          });
        }

        return { success: true };
      } catch (error: any) {
        console.error(`[Recovery] Failed to send to ${toEmail}:`, error);
        return { success: false, error: error.message };
      }
    };

    if (mode === "single") {
      if (!email || !firstName) {
        return NextResponse.json({ error: "email and firstName are required" }, { status: 400 });
      }
      const amount = offeredAmount || "your requested amount";
      const result = await sendRecoveryEmail(email, firstName, amount);
      results.push({ email, ...result });
    } else if (mode === "batch" && leads) {
      for (const lead of leads) {
        const amount = lead.offeredAmount || "your requested amount";
        const result = await sendRecoveryEmail(lead.email, lead.firstName, amount);
        results.push({ email: lead.email, ...result });
        // Add a small delay between emails to avoid rate limiting
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    console.log(`[Recovery] Sent ${successCount} emails, ${failCount} failed`);

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failCount,
      results,
    });
  } catch (error) {
    console.error("[Recovery] Error:", error);
    return NextResponse.json({ error: "Failed to send recovery emails" }, { status: 500 });
  }
}
