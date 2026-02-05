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

    // Send immediate confirmation email with quiz results
    try {
      const typeLabel = TYPE_LABELS[quizData.type] || quizData.type;
      const goalLabel = GOAL_LABELS[quizData.goal] || quizData.goal;
      const incomeLabel = INCOME_LABELS[quizData.currentIncome] || quizData.currentIncome;
      const visionLabel = VISION_LABELS[quizData.vision] || quizData.vision;

      await sendEmail({
        to: normalizedEmail,
        from: "Sarah M. <sarah@accredipro-certificate.com>",
        subject: `${first}, Your DEPTH Method Results Are In!`,
        type: "transactional",
        text: `Hey ${first}!

I just received your DEPTH Method Assessment results and I'm genuinely excited to connect with you.

Here's what stood out to me:

✨ SPECIALIZATION MATCH: ${typeLabel}
This is one of the fastest-growing areas in functional medicine right now. Women with your profile are seeing incredible results.

💰 YOUR INCOME GOAL: ${goalLabel}
You're currently at ${incomeLabel}, and this goal is absolutely achievable with the right clinical framework.

🎯 YOUR VISION: To ${visionLabel}
This is exactly why we created the ASI Scholarship Program. We believe financial limitations shouldn't stop passionate practitioners.

WHAT HAPPENS NEXT:
I'm personally reviewing your application right now. You should hear back from me within the next few minutes about your scholarship eligibility.

In the meantime, I want you to know - we accept ALL scholarship applications. The only question is how much the institute can cover for you.

Talk soon!

Sarah M.
Scholarship Director
Accredipro Specialists Institute

P.S. Keep an eye on the chat widget on the results page - that's where I'll send your scholarship decision!`,
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

  <h1 style="color: #722f37; font-size: 24px; margin-bottom: 20px;">Hey ${first}! 👋</h1>

  <p>I just received your <strong>DEPTH Method Assessment</strong> results and I'm genuinely excited to connect with you.</p>

  <div style="background: linear-gradient(135deg, #f9f7f4 0%, #fff 100%); border-left: 4px solid #d4af37; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
    <h2 style="color: #722f37; font-size: 18px; margin: 0 0 15px 0;">Here's What Stood Out:</h2>

    <p style="margin: 10px 0;"><strong style="color: #d4af37;">✨ SPECIALIZATION MATCH:</strong> ${typeLabel}</p>
    <p style="font-size: 14px; color: #666; margin: 0 0 15px 0;">This is one of the fastest-growing areas in functional medicine right now.</p>

    <p style="margin: 10px 0;"><strong style="color: #d4af37;">💰 YOUR INCOME GOAL:</strong> ${goalLabel}</p>
    <p style="font-size: 14px; color: #666; margin: 0 0 15px 0;">You're currently at ${incomeLabel} - this goal is absolutely achievable.</p>

    <p style="margin: 10px 0;"><strong style="color: #d4af37;">🎯 YOUR VISION:</strong> To ${visionLabel}</p>
    <p style="font-size: 14px; color: #666; margin: 0;">This is exactly why we created the ASI Scholarship Program.</p>
  </div>

  <div style="background: #722f37; color: white; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
    <h3 style="margin: 0 0 10px 0; font-size: 18px;">⏰ What Happens Next?</h3>
    <p style="margin: 0; font-size: 14px; opacity: 0.9;">I'm personally reviewing your application right now.<br>You'll hear back within minutes about your scholarship eligibility.</p>
  </div>

  <p style="font-size: 14px; background: #fff8e1; padding: 15px; border-radius: 8px; border: 1px solid #d4af37;">
    <strong>Remember:</strong> We accept ALL scholarship applications. The only question is how much the institute can cover for you. 💛
  </p>

  <p style="margin-top: 30px;">Talk soon!</p>

  <div style="margin-top: 20px;">
    <p style="margin: 0; font-weight: bold; color: #722f37;">Sarah M.</p>
    <p style="margin: 0; font-size: 14px; color: #666;">Scholarship Director</p>
    <p style="margin: 0; font-size: 14px; color: #666;">Accredipro Specialists Institute</p>
  </div>

  <p style="font-size: 13px; color: #888; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
    P.S. Keep an eye on the chat widget on the results page - that's where I'll send your scholarship decision! 💬
  </p>

</body>
</html>
        `,
      });

      console.log(`[Scholarship] Sent results email to ${normalizedEmail}`);
    } catch (emailError) {
      console.error("[Scholarship] Failed to send results email:", emailError);
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
