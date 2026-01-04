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
  currentField: z.string().optional(), // NEW: profession/field for upsell targeting
  weeklyHours: z.number().optional(),
  experienceLevel: z.string().optional(),
  focusAreas: z.array(z.string()).default([]),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  // New AOV/CRO/Segmentation fields
  incomeGoal: z.string().optional(),
  timeline: z.string().optional(),
  currentSituation: z.string().optional(),
  investmentReadiness: z.string().optional(),
  obstacles: z.array(z.string()).optional(),
  referralSource: z.string().optional(),
  personalMessage: z.string().optional(),
  leadScore: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = onboardingSchema.parse(body);

    // Update user profile - use type assertion for new fields that may not be in Prisma types yet
    const updateData: Record<string, any> = {
      firstName: data.firstName || undefined,
      lastName: data.lastName || undefined,
      phone: data.phone || undefined,
      location: data.location || null,
      timezone: data.timezone || null,
      healthBackground: data.healthBackground || data.personalMessage || null,
      certificationGoal: data.certificationGoal || null,
      learningGoal: data.learningGoal || null,
      weeklyHours: data.weeklyHours || null,
      experienceLevel: data.experienceLevel || null,
      focusAreas: data.focusAreas,
      avatar: data.avatar || undefined,
      bio: data.bio || undefined,
      hasCompletedProfile: true,
      hasCompletedOnboarding: true,
    };

    // Add currentField if provided (may need DB migration)
    if (data.currentField) {
      updateData.currentField = data.currentField;
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData as any,
    });

    // Create tags based on onboarding data for segmentation
    const tags: { tag: string; value?: string; metadata?: any }[] = [];

    // Primary goal tag
    if (data.learningGoal) {
      tags.push({ tag: `goal:${data.learningGoal}` });
    }

    // Income goal tag (AOV indicator)
    if (data.incomeGoal) {
      tags.push({
        tag: `income_goal:${data.incomeGoal}`,
        metadata: { aov_tier: getAovTier(data.incomeGoal) }
      });
    }

    // Timeline/Urgency tag (CRO indicator)
    if (data.timeline) {
      tags.push({
        tag: `timeline:${data.timeline}`,
        metadata: { urgency: getUrgency(data.timeline) }
      });
    }

    // Current situation tag (segmentation)
    if (data.currentSituation) {
      tags.push({ tag: `situation:${data.currentSituation}` });
    }

    // Investment readiness tag (sales qualifier)
    if (data.investmentReadiness) {
      tags.push({
        tag: `investment:${data.investmentReadiness}`,
        metadata: { sales_ready: data.investmentReadiness === 'ready_now' || data.investmentReadiness === 'need_details' }
      });
    }

    // Obstacles tags (pain points for marketing)
    if (data.obstacles) {
      for (const obstacle of data.obstacles) {
        tags.push({ tag: `obstacle:${obstacle}` });
      }
    }

    // Experience level
    if (data.experienceLevel) {
      tags.push({ tag: `experience:${data.experienceLevel}` });
    }

    // Weekly commitment
    if (data.weeklyHours) {
      const commitment = data.weeklyHours >= 10 ? "high" : data.weeklyHours >= 5 ? "medium" : "low";
      tags.push({ tag: `commitment:${commitment}` });
    }

    // Focus areas / niches
    for (const area of data.focusAreas) {
      tags.push({ tag: `interest:${area}` });
    }

    // Referral source
    if (data.referralSource) {
      tags.push({ tag: `source:${data.referralSource.toLowerCase().replace(/\s+/g, '_')}` });
    }

    // Lead score tag
    if (data.leadScore) {
      const leadTier = data.leadScore >= 70 ? 'hot' : data.leadScore >= 40 ? 'warm' : 'cold';
      tags.push({
        tag: `lead_score:${leadTier}`,
        value: data.leadScore.toString(),
        metadata: { score: data.leadScore, tier: leadTier }
      });
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
          metadata: tagData.metadata,
        },
        create: {
          userId: session.user.id,
          tag: tagData.tag,
          value: tagData.value,
          metadata: tagData.metadata,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Profile completed successfully",
      leadScore: data.leadScore,
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

// Helper functions for segmentation
function getAovTier(incomeGoal: string): string {
  switch (incomeGoal) {
    case '10k_plus': return 'premium';
    case '5k_10k': return 'professional';
    case '2k_5k': return 'growth';
    default: return 'starter';
  }
}

function getUrgency(timeline: string): string {
  switch (timeline) {
    case 'asap': return 'hot';
    case '1_3_months': return 'warm';
    case '3_6_months': return 'nurture';
    default: return 'cold';
  }
}
