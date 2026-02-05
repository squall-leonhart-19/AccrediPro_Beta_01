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
      const { sendScholarshipQualificationEmail } = await import("@/lib/scholarship-emails");
      await sendScholarshipQualificationEmail({
        to: normalizedEmail,
        firstName: first,
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
