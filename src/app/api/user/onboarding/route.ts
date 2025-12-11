import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const onboardingSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
  healthBackground: z.string().optional(),
  certificationGoal: z.string().optional(),
  learningGoal: z.string().optional(),
  weeklyHours: z.number().optional(),
  experienceLevel: z.string().optional(),
  focusAreas: z.array(z.string()).default([]),
  avatar: z.string().optional(),
  bio: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = onboardingSchema.parse(body);

    // Update user profile
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        phone: data.phone || null,
        location: data.location || null,
        timezone: data.timezone || null,
        healthBackground: data.healthBackground || null,
        certificationGoal: data.certificationGoal || null,
        learningGoal: data.learningGoal || null,
        weeklyHours: data.weeklyHours || null,
        experienceLevel: data.experienceLevel || null,
        focusAreas: data.focusAreas,
        avatar: data.avatar || undefined,
        bio: data.bio || undefined,
        hasCompletedProfile: true,
        hasCompletedOnboarding: true,
      },
    });

    // Create tags based on onboarding data
    const tags: { tag: string; value?: string }[] = [];

    if (data.learningGoal) {
      tags.push({ tag: `goal:${data.learningGoal}` });
    }

    if (data.experienceLevel) {
      tags.push({ tag: `experience:${data.experienceLevel}` });
    }

    if (data.weeklyHours) {
      const commitment = data.weeklyHours >= 10 ? "high" : data.weeklyHours >= 5 ? "medium" : "low";
      tags.push({ tag: `commitment:${commitment}` });
    }

    for (const area of data.focusAreas) {
      tags.push({ tag: `interest:${area}` });
    }

    // Upsert tags
    for (const tagData of tags) {
      await prisma.userTag.upsert({
        where: {
          userId_tag: {
            userId: session.user.id,
            tag: tagData.tag,
          },
        },
        update: {
          value: tagData.value,
        },
        create: {
          userId: session.user.id,
          tag: tagData.tag,
          value: tagData.value,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Profile completed successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}
