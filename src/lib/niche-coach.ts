/**
 * Niche-based Coach Assignment System
 *
 * Maps lead tags to specific coaches for personalized mentorship.
 * When a user opts into a lead magnet (mini diploma), they get
 * assigned a coach who specializes in that niche.
 */

import { prisma } from "@/lib/prisma";

// Niche definitions with their corresponding lead tags
export const NICHE_DEFINITIONS = {
  "functional-medicine": {
    displayName: "Functional Medicine",
    description: "Holistic approach to health addressing root causes",
    leadTags: ["lead:functional-medicine"],
  },
  "health-coach": {
    displayName: "Health Coaching",
    description: "General health and wellness coaching",
    leadTags: ["lead:health-coach"],
  },
  "menopause": {
    displayName: "Menopause & Perimenopause",
    description: "Women's hormonal health and midlife wellness",
    leadTags: ["lead:menopause", "lead:perimenopause"],
  },
  "gut-health": {
    displayName: "Gut Health",
    description: "Digestive wellness and microbiome optimization",
    leadTags: ["lead:gut-health"],
  },
  "womens-health": {
    displayName: "Women's Health",
    description: "Comprehensive women's wellness and hormones",
    leadTags: ["lead:womens-health"],
  },
} as const;

export type NicheSlug = keyof typeof NICHE_DEFINITIONS;

/**
 * Get the niche slug from a lead tag
 */
export function getNicheFromTag(tag: string): NicheSlug | null {
  for (const [niche, def] of Object.entries(NICHE_DEFINITIONS)) {
    if (def.leadTags.includes(tag)) {
      return niche as NicheSlug;
    }
  }
  return null;
}

/**
 * Get the coach assigned to a specific niche
 */
export async function getCoachForNiche(niche: string): Promise<string | null> {
  const nicheCoach = await prisma.nicheCoach.findUnique({
    where: { niche, isActive: true },
  });
  return nicheCoach?.coachId || null;
}

/**
 * Get coach from a lead tag
 */
export async function getCoachFromTag(tag: string): Promise<string | null> {
  const niche = getNicheFromTag(tag);
  if (!niche) return null;
  return getCoachForNiche(niche);
}

/**
 * Assign a coach to a user based on their lead tag
 * Called when user opts into a lead magnet (mini diploma)
 */
export async function assignCoachByTag(
  userId: string,
  tag: string
): Promise<{ success: boolean; coachId?: string; error?: string }> {
  try {
    const niche = getNicheFromTag(tag);
    if (!niche) {
      return { success: false, error: `Unknown niche for tag: ${tag}` };
    }

    const coachId = await getCoachForNiche(niche);
    if (!coachId) {
      // Fallback: get any available coach
      const fallbackCoach = await prisma.user.findFirst({
        where: {
          role: { in: ["MENTOR", "INSTRUCTOR", "ADMIN"] },
          isActive: true,
        },
        orderBy: { createdAt: "asc" },
      });

      if (!fallbackCoach) {
        return { success: false, error: "No coaches available" };
      }

      // Assign fallback coach
      await prisma.user.update({
        where: { id: userId },
        data: { assignedCoachId: fallbackCoach.id },
      });

      return { success: true, coachId: fallbackCoach.id };
    }

    // Assign the niche-specific coach
    await prisma.user.update({
      where: { id: userId },
      data: { assignedCoachId: coachId },
    });

    return { success: true, coachId };
  } catch (error) {
    console.error("Error assigning coach:", error);
    return { success: false, error: "Failed to assign coach" };
  }
}

/**
 * Assign coach based on user's focus areas (from onboarding)
 * Used as fallback when no lead tag exists
 */
export async function assignCoachByFocusAreas(
  userId: string
): Promise<{ success: boolean; coachId?: string; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { focusAreas: true },
    });

    if (!user?.focusAreas?.length) {
      return { success: false, error: "No focus areas found" };
    }

    // Map focus areas to niches
    const focusToNiche: Record<string, NicheSlug> = {
      "functional-medicine": "functional-medicine",
      "Functional Medicine": "functional-medicine",
      "gut-health": "gut-health",
      "Gut Health": "gut-health",
      "womens-health": "womens-health",
      "Women's Health": "womens-health",
      "hormones": "menopause",
      "Hormone Health": "menopause",
      "menopause": "menopause",
      "health-coaching": "health-coach",
      "Health Coaching": "health-coach",
    };

    // Find first matching niche
    for (const area of user.focusAreas) {
      const niche = focusToNiche[area];
      if (niche) {
        const coachId = await getCoachForNiche(niche);
        if (coachId) {
          await prisma.user.update({
            where: { id: userId },
            data: { assignedCoachId: coachId },
          });
          return { success: true, coachId };
        }
      }
    }

    // No match found, use fallback
    const fallbackCoach = await prisma.user.findFirst({
      where: {
        role: { in: ["MENTOR", "INSTRUCTOR", "ADMIN"] },
        isActive: true,
      },
      orderBy: { createdAt: "asc" },
    });

    if (fallbackCoach) {
      await prisma.user.update({
        where: { id: userId },
        data: { assignedCoachId: fallbackCoach.id },
      });
      return { success: true, coachId: fallbackCoach.id };
    }

    return { success: false, error: "No matching coaches found" };
  } catch (error) {
    console.error("Error assigning coach by focus areas:", error);
    return { success: false, error: "Failed to assign coach" };
  }
}

/**
 * Get the assigned coach details for a user
 */
export async function getUserCoach(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      assignedCoach: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
          bio: true,
          specialties: true,
          qualifications: true,
          avgResponseTime: true,
          availabilityNote: true,
          personalQuote: true,
        },
      },
      tags: {
        where: { tag: { startsWith: "lead:" } },
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) return null;

  // Get the niche info based on lead tag
  const leadTag = user.tags[0]?.tag;
  const niche = leadTag ? getNicheFromTag(leadTag) : null;
  const nicheInfo = niche ? NICHE_DEFINITIONS[niche] : null;

  return {
    coach: user.assignedCoach,
    niche: niche,
    nicheDisplayName: nicheInfo?.displayName || null,
    matchReason: nicheInfo
      ? `Matched based on your ${nicheInfo.displayName} interest`
      : "Default coach assignment",
  };
}

/**
 * Seed niche coaches into the database
 * Run this in your seed script or admin panel
 */
export async function seedNicheCoaches(coachMappings: Array<{
  niche: string;
  coachId: string;
  displayName: string;
  description?: string;
}>) {
  for (const mapping of coachMappings) {
    await prisma.nicheCoach.upsert({
      where: { niche: mapping.niche },
      update: {
        coachId: mapping.coachId,
        displayName: mapping.displayName,
        description: mapping.description,
        isActive: true,
      },
      create: {
        niche: mapping.niche,
        coachId: mapping.coachId,
        displayName: mapping.displayName,
        description: mapping.description,
        isActive: true,
      },
    });
  }
}
