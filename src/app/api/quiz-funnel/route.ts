import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * POST /api/quiz-funnel
 *
 * Captures quiz funnel submissions.
 * Creates or updates a lead user with quiz answers stored as tags.
 *
 * Body: {
 *   name: string;
 *   lastName?: string;
 *   email: string;
 *   phone?: string;
 *   funnel: "fm-application" | "depth-method";
 *   answers: Record<string, string>;
 *   practitionerType?: string;
 *   incomeGoal?: string;
 *   currentRole?: string;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, lastName, email, phone, funnel, answers, practitionerType, incomeGoal, currentRole } = body as {
      name: string;
      lastName?: string;
      email: string;
      phone?: string;
      funnel: "fm-application" | "depth-method";
      answers: Record<string, string>;
      practitionerType?: string;
      incomeGoal?: string;
      currentRole?: string;
    };

    if (!name || !email || !funnel) {
      return NextResponse.json(
        { error: "Name, email, and funnel are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const firstName = name.trim();
    const last = lastName?.trim() || null;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true, firstName: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          firstName: firstName || null,
          lastName: last,
          phone: phone?.trim() || null,
          userType: "LEAD",
          role: "STUDENT",
        },
        select: { id: true, email: true, firstName: true },
      });
      console.log(`[Quiz Funnel] Created new LEAD: ${normalizedEmail}`);
    } else {
      // Update existing user with new data if provided
      await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(last && { lastName: last }),
          ...(phone?.trim() && { phone: phone.trim() }),
          ...(firstName && !user.firstName && { firstName }),
        },
      });
    }

    // Store quiz completion as tags
    const tagData: { tag: string; value: string; metadata?: Record<string, any> }[] = [
      {
        tag: `quiz_${funnel}_completed`,
        value: new Date().toISOString(),
        metadata: { answers, practitionerType, incomeGoal, currentRole },
      },
      {
        tag: `quiz_funnel_source`,
        value: funnel,
      },
    ];

    if (practitionerType) {
      tagData.push({ tag: "practitioner_type", value: practitionerType });
    }
    if (incomeGoal) {
      tagData.push({ tag: "quiz_income_goal", value: incomeGoal });
    }
    if (currentRole) {
      tagData.push({ tag: "quiz_current_role", value: currentRole });
    }

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
      `[Quiz Funnel] ${funnel} completed by ${normalizedEmail} (${user.id})`
    );

    return NextResponse.json({
      success: true,
      userId: user.id,
      firstName: user.firstName || firstName,
    });
  } catch (error) {
    console.error("[Quiz Funnel] Error:", error);
    return NextResponse.json(
      { error: "Failed to save quiz data" },
      { status: 500 }
    );
  }
}
