import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

/**
 * POST /api/scholarship/submit
 *
 * Captures scholarship quiz submissions.
 * Creates or updates a user with scholarship tags.
 * Sends immediate confirmation email.
 * Separate from mini diploma leads!
 *
 * Body: {
 *   firstName: string;
 *   lastName?: string;
 *   email: string;
 *   phone?: string;
 *   visitorId: string;
 *   quizData: {
 *     type: string;
 *     goal: string;
 *     currentIncome: string;
 *     experience: string;
 *     clinicalReady: string;
 *     labInterest: string;
 *     pastCerts: string;
 *     missingSkill: string;
 *     commitment: string;
 *     vision: string;
 *     startTimeline: string;
 *     role?: string;
 *   };
 *   page?: string;
 * }
 */

// Human-readable labels for email
const INCOME_LABELS: Record<string, string> = {
  "0": "$0/month",
  "under-2k": "under $2K/month",
  "2k-5k": "$2K-$5K/month",
  "over-5k": "over $5K/month",
};

const GOAL_LABELS: Record<string, string> = {
  "5k": "$5,000/month",
  "10k": "$10,000/month",
  "20k": "$20,000/month",
  "50k-plus": "$50,000+/month",
};

const TYPE_LABELS: Record<string, string> = {
  "hormone-health": "Hormone Health",
  "gut-restoration": "Gut Restoration",
  "metabolic-optimization": "Metabolic Optimization",
  "burnout-recovery": "Burnout Recovery",
  "autoimmune-support": "Autoimmune Support",
};

const VISION_LABELS: Record<string, string> = {
  "leave-job": "leave your 9-to-5",
  "security": "achieve financial security",
  "fulfillment": "find fulfillment & meaningful work",
  "all-above": "complete life transformation",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, visitorId, quizData, page } = body as {
      firstName: string;
      lastName?: string;
      email: string;
      phone?: string;
      visitorId: string;
      quizData: {
        type: string;
        goal: string;
        currentIncome: string;
        experience: string;
        clinicalReady: string;
        labInterest: string;
        pastCerts: string;
        missingSkill: string;
        commitment: string;
        vision: string;
        startTimeline: string;
        role?: string;
      };
      page?: string;
    };

    if (!firstName || !email) {
      return NextResponse.json(
        { error: "First name and email are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const first = firstName.trim();
    const last = lastName?.trim() || null;

    // Find or create user - separate tracking from mini diploma
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true, firstName: true, userType: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          firstName: first,
          lastName: last,
          phone: phone?.trim() || null,
          userType: "LEAD",
          role: "STUDENT",
          leadSource: "DEPTH_METHOD_QUIZ",
          leadSourceDetail: `scholarship-${page || "healthcare-results"}`,
        },
        select: { id: true, email: true, firstName: true, userType: true },
      });
      console.log(`[Scholarship] Created new LEAD: ${normalizedEmail}`);
    } else {
      // Update existing user with scholarship data if needed
      await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(last && { lastName: last }),
          ...(phone?.trim() && { phone: phone.trim() }),
          ...(first && !user.firstName && { firstName: first }),
          // Don't overwrite leadSource if they came from mini diploma
        },
      });
    }

    // Store scholarship application as tags (completely separate from mini diploma tags)
    const tagData: { tag: string; value: string; metadata?: Record<string, any> }[] = [
      {
        tag: "scholarship_application_submitted",
        value: new Date().toISOString(),
        metadata: {
          quizData,
          visitorId,
          page: page || "healthcare-results",
        },
      },
      {
        tag: "scholarship_source",
        value: "DEPTH_METHOD_QUIZ",
      },
      {
        tag: "scholarship_status",
        value: "pending",
      },
      {
        tag: "scholarship_specialization",
        value: quizData.type,
      },
      {
        tag: "scholarship_income_goal",
        value: quizData.goal,
      },
      {
        tag: "scholarship_current_income",
        value: quizData.currentIncome,
      },
      {
        tag: "scholarship_vision",
        value: quizData.vision,
      },
      {
        tag: "scholarship_past_certs",
        value: quizData.pastCerts,
      },
    ];

    // Upsert all tags
    for (const t of tagData) {
      await prisma.userTag.upsert({
        where: { userId_tag: { userId: user.id, tag: t.tag } },
        update: {
          value: t.value,
          metadata: t.metadata || undefined,
        },
        create: {
          userId: user.id,
          tag: t.tag,
          value: t.value,
          metadata: t.metadata || undefined,
        },
      });
    }

    console.log(
      `[Scholarship] Application submitted by ${normalizedEmail} (${user.id}) - ${TYPE_LABELS[quizData.type] || quizData.type}`
    );

    // Send simple plain-text scholarship qualification email
    try {
      await sendEmail({
        to: normalizedEmail,
        from: "Sarah M. <sarah@accredipro-certificate.com>",
        subject: `🎉 Congratulations ${first} — You Qualify for a Scholarship!`,
        type: "transactional",
        text: `Hey ${first}!

CONGRATULATIONS! 🎉

You QUALIFY for our ASI Scholarship Program!

I just reviewed your application and I'm excited to tell you — you're exactly the kind of practitioner we created this program for.

Here's how it works:

→ You tell us what you can invest
→ The Institute covers THE REST
→ You get the FULL FM Certification (9 specializations included)
→ ONE-TIME payment — not monthly, not recurring

There's no "right" amount. Whatever you can realistically invest in yourself today, that's your scholarship amount.

I'm waiting for you in the chat right now to discuss your personalized rate.

Go back to your results page and let's chat!

Talk soon,

Sarah M.
Scholarship Director
Accredipro Specialists Institute

P.S. I'll be online for the next few hours — don't miss this opportunity! 💛`,
        html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Georgia, serif; line-height: 1.8; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #fafafa;">

  <div style="background: white; padding: 30px; border-radius: 8px;">

    <p style="font-size: 16px; margin: 0 0 20px 0;">Hey ${first}!</p>

    <p style="font-size: 22px; font-weight: bold; color: #722f37; margin: 0 0 20px 0;">CONGRATULATIONS! 🎉</p>

    <p style="font-size: 18px; margin: 0 0 25px 0;"><strong>You QUALIFY for our ASI Scholarship Program!</strong></p>

    <p style="margin: 0 0 20px 0;">I just reviewed your application and I'm excited to tell you — you're exactly the kind of practitioner we created this program for.</p>

    <div style="background: #f9f7f4; padding: 20px; margin: 25px 0; border-left: 3px solid #d4af37;">
      <p style="margin: 0 0 10px 0; font-weight: bold;">Here's how it works:</p>
      <p style="margin: 5px 0;">→ You tell us what you can invest</p>
      <p style="margin: 5px 0;">→ The Institute covers THE REST</p>
      <p style="margin: 5px 0;">→ You get the FULL FM Certification (9 specializations)</p>
      <p style="margin: 5px 0;">→ ONE-TIME payment — not monthly, not recurring</p>
    </div>

    <p style="margin: 0 0 20px 0;">There's no "right" amount. Whatever you can realistically invest in yourself today, that's your scholarship amount.</p>

    <p style="margin: 0 0 25px 0;"><strong>I'm waiting for you in the chat right now to discuss your personalized rate.</strong></p>

    <p style="margin: 0 0 30px 0;">Go back to your results page and let's chat!</p>

    <p style="margin: 0 0 5px 0;">Talk soon,</p>
    <p style="margin: 0 0 5px 0; font-weight: bold; color: #722f37;">Sarah M.</p>
    <p style="margin: 0; font-size: 14px; color: #666;">Scholarship Director<br>Accredipro Specialists Institute</p>

    <p style="margin: 30px 0 0 0; font-size: 14px; color: #888; padding-top: 20px; border-top: 1px solid #eee;">
      P.S. I'll be online for the next few hours — don't miss this opportunity! 💛
    </p>

  </div>

</body>
</html>`,
      });

      console.log(`[Scholarship] Sent qualification email to ${normalizedEmail}`);
    } catch (emailError) {
      console.error("[Scholarship] Failed to send qualification email:", emailError);
      // Don't fail the submission if email fails
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      firstName: user.firstName || first,
    });
  } catch (error) {
    console.error("[Scholarship] Error:", error);
    return NextResponse.json(
      { error: "Failed to save scholarship application" },
      { status: 500 }
    );
  }
}
