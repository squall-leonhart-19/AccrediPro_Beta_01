import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

/**
 * POST /api/admin/scholarships/auto-approve
 *
 * Auto-approve a scholarship application with FOMO sequence:
 * 1. "Bear with me 1 minute, calling the Institute..."
 * 2. (30 second delay via client-side or scheduled job)
 * 3. "Scholarship APPROVED! Only valid for 10 minutes..."
 *
 * Body: {
 *   visitorId: string;
 *   step: "initiate" | "approve";
 *   offeredAmount?: string;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SUPERUSER", "INSTRUCTOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { visitorId, step, offeredAmount } = body as {
      visitorId: string;
      step: "initiate" | "approve";
      offeredAmount?: string;
    };

    if (!visitorId || !step) {
      return NextResponse.json({ error: "visitorId and step are required" }, { status: 400 });
    }

    // Get the original application to find email and name
    const existingMessage = await prisma.salesChat.findFirst({
      where: { visitorId, page: { contains: "scholarship" } },
      orderBy: { createdAt: "desc" },
    });

    if (!existingMessage) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Get user info from optin
    const optin = await prisma.chatOptin.findFirst({
      where: { visitorId },
    });

    const userName = optin?.name || existingMessage.visitorName || "there";
    const firstName = userName.split(" ")[0];
    const userEmail = optin?.email || existingMessage.visitorEmail;

    if (step === "initiate") {
      // Step 1: "Bear with me" message
      const initiateMessage = `Hold on ${firstName}! 🙏 Let me call the Institute right now to check on your scholarship approval. I'll be back in just a moment... ⏳`;

      await prisma.salesChat.create({
        data: {
          visitorId,
          page: existingMessage.page,
          message: initiateMessage,
          isFromVisitor: false,
          isRead: true,
          repliedBy: session.user.id,
        },
      });

      console.log(`[Auto-Approve] Step 1 (initiate) sent to ${visitorId}`);

      return NextResponse.json({
        success: true,
        step: "initiate",
        message: "Initiate message sent. Wait 30-60 seconds then call approve.",
      });
    }

    if (step === "approve") {
      // Step 2: FOMO Approval message
      const amount = offeredAmount || "the amount you mentioned";
      const approvalMessage = `🎉 AMAZING NEWS ${firstName}!

I just got off the phone with the Institute and they've APPROVED your scholarship!

✅ Your scholarship has been approved for ${amount}
✅ Full FM Certification access (normally $4,997)
✅ 9 Clinical Certifications
✅ Lifetime access + mentorship
✅ Complete protocol library

⚠️ IMPORTANT: This scholarship approval is only valid for the next 10 MINUTES. After that, I'll have to resubmit your application and there's no guarantee it'll be approved again.

Ready to lock in your spot? Just reply "YES" and I'll send you the secure payment link right now! 💜`;

      await prisma.salesChat.create({
        data: {
          visitorId,
          page: existingMessage.page,
          message: approvalMessage,
          isFromVisitor: false,
          isRead: true,
          repliedBy: session.user.id,
        },
      });

      // Update scholarship status tag if user exists
      if (userEmail) {
        const user = await prisma.user.findUnique({
          where: { email: userEmail.toLowerCase().trim() },
        });

        if (user) {
          await prisma.userTag.upsert({
            where: { userId_tag: { userId: user.id, tag: "scholarship_status" } },
            update: { value: "approved" },
            create: { userId: user.id, tag: "scholarship_status", value: "approved" },
          });

          await prisma.userTag.upsert({
            where: { userId_tag: { userId: user.id, tag: "scholarship_approved_at" } },
            update: { value: new Date().toISOString() },
            create: { userId: user.id, tag: "scholarship_approved_at", value: new Date().toISOString() },
          });

          if (offeredAmount) {
            await prisma.userTag.upsert({
              where: { userId_tag: { userId: user.id, tag: "scholarship_offered_amount" } },
              update: { value: offeredAmount },
              create: { userId: user.id, tag: "scholarship_offered_amount", value: offeredAmount },
            });
          }

          // Send approval email with FOMO
          try {
            await sendEmail({
              to: userEmail,
              from: "Sarah M. <sarah@accredipro-certificate.com>",
              subject: `🎉 ${firstName}, Your Scholarship Has Been APPROVED!`,
              type: "transactional",
              text: `Hey ${firstName}!

AMAZING NEWS - I just got off the phone with the Institute and your scholarship has been APPROVED! 🎉

Here's what you're getting:

✅ FM Certification (normally $4,997)
✅ 9 Clinical Certifications
✅ Lifetime access + mentorship
✅ Complete protocol library

Your approved scholarship amount: ${amount}

⚠️ IMPORTANT: This approval is only valid for 10 MINUTES from when I sent this message.

I'm waiting for you in the chat to finalize everything. Just reply "YES" and I'll send you the secure payment link!

Don't miss this opportunity,

Sarah M.
Scholarship Director
Accredipro Specialists Institute`,
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
    <h1 style="margin: 0; font-size: 28px;">🎉 SCHOLARSHIP APPROVED!</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Congratulations, ${firstName}!</p>
  </div>

  <p>I just got off the phone with the Institute and I have amazing news...</p>

  <div style="background: #f0fdf4; border: 2px solid #10b981; padding: 20px; border-radius: 12px; margin: 20px 0;">
    <h2 style="color: #059669; margin: 0 0 15px 0; font-size: 18px;">✅ Here's What You're Getting:</h2>
    <ul style="margin: 0; padding-left: 20px; color: #166534;">
      <li>FM Certification (normally $4,997)</li>
      <li>9 Clinical Certifications</li>
      <li>Lifetime access + mentorship</li>
      <li>Complete protocol library</li>
    </ul>
    <p style="margin: 15px 0 0 0; font-size: 18px; font-weight: bold; color: #059669;">
      Your scholarship amount: ${amount}
    </p>
  </div>

  <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 12px; margin: 20px 0;">
    <h3 style="color: #b45309; margin: 0 0 10px 0; font-size: 16px;">⚠️ TIME-SENSITIVE</h3>
    <p style="margin: 0; color: #92400e;">
      This scholarship approval is only valid for <strong>10 MINUTES</strong>. After that, I'll have to resubmit your application and there's no guarantee it'll be approved again.
    </p>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <a href="https://learn.accredipro.academy/quiz/depth-method?tab=scholarship" style="display: inline-block; background: #722f37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
      Open Chat & Lock In Your Spot →
    </a>
  </div>

  <p>I'm waiting for you in the chat to finalize everything. Don't miss this opportunity!</p>

  <div style="margin-top: 30px;">
    <p style="margin: 0; font-weight: bold; color: #722f37;">Sarah M.</p>
    <p style="margin: 0; font-size: 14px; color: #666;">Scholarship Director</p>
    <p style="margin: 0; font-size: 14px; color: #666;">Accredipro Specialists Institute</p>
  </div>

</body>
</html>
              `,
            });

            console.log(`[Auto-Approve] Approval email sent to ${userEmail}`);
          } catch (emailError) {
            console.error("[Auto-Approve] Failed to send approval email:", emailError);
          }
        }
      }

      console.log(`[Auto-Approve] Step 2 (approve) sent to ${visitorId} for ${amount}`);

      return NextResponse.json({
        success: true,
        step: "approve",
        message: "Approval message sent with FOMO timer.",
      });
    }

    return NextResponse.json({ error: "Invalid step" }, { status: 400 });
  } catch (error) {
    console.error("[Auto-Approve] Error:", error);
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
