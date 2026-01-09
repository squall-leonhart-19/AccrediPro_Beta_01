// Credential Path Helper
// Maps user progress to the 4-tier credential system: FC, CP, BC, MC

import type { SpecializationTrack } from "./specialization-tracks";

export interface CredentialTierData {
  tier: string;
  title: string;
  status: "completed" | "in_progress" | "locked";
  progress?: number;
  price?: string;
  earnedDate?: string;
}

// Specialty abbreviations for credentials
export const SPECIALTY_ABBREVIATIONS: Record<string, string> = {
  "functional-medicine": "FM",
  "health-coach": "HC",
  "menopause": "MP",
  "perimenopause": "MP",
  "gut-health": "GH",
  "womens-health": "WH",
  "autism": "AU",
  "adhd": "ADHD",
  "nutrition": "NUT",
  "weight-management": "WM",
};

// Credential tier prices
const TIER_PRICES = {
  foundations: "FREE",
  fc: "$297",
  cp: "$1,997",
  bc: "$5,997",
  mc: "$9,997",
};

interface UserProgressData {
  completedCourses: string[]; // Array of course slugs
  inProgressCourse?: {
    slug: string;
    progress: number; // 0-100
  };
  certificates: {
    type: string;
    earnedAt: Date;
  }[];
}

/**
 * Build credential path tiers for a user based on their progress
 */
export function buildCredentialPath(
  specialization: SpecializationTrack,
  progressData: UserProgressData
): CredentialTierData[] {
  const abbrev = SPECIALTY_ABBREVIATIONS[specialization.slug] || "FM";
  const fullAbbrev = specialization.slug === "functional-medicine" ? "FMP" : abbrev + "P";

  // Check what the user has completed/is working on
  const hasFoundations = progressData.certificates.some(
    c => c.type === "MINI_DIPLOMA" || c.type === "FOUNDATIONS"
  );

  // Determine which step (1-4) the user is on based on course progress
  let currentStep = 0;
  let currentProgress = 0;

  // Check each step's courses
  for (let i = 0; i < specialization.steps.length; i++) {
    const step = specialization.steps[i];
    const stepCompleted = step.courseSlugs.some(slug =>
      progressData.completedCourses.includes(slug)
    );

    if (stepCompleted) {
      currentStep = i + 1;
    } else if (progressData.inProgressCourse) {
      const isInThisStep = step.courseSlugs.includes(progressData.inProgressCourse.slug);
      if (isInThisStep) {
        currentStep = i;
        currentProgress = progressData.inProgressCourse.progress;
        break;
      }
    }
  }

  // Build the credential tiers
  const tiers: CredentialTierData[] = [
    // Foundations (Free tier)
    {
      tier: `${abbrev} Foundations`,
      title: "Foundations Verified",
      status: hasFoundations ? "completed" :
              (currentStep === 0 && currentProgress > 0) ? "in_progress" :
              "locked",
      progress: currentStep === 0 ? currentProgress : undefined,
      price: hasFoundations ? undefined : TIER_PRICES.foundations,
      earnedDate: hasFoundations
        ? progressData.certificates.find(c => c.type === "MINI_DIPLOMA" || c.type === "FOUNDATIONS")?.earnedAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : undefined,
    },
    // FC - Foundation Certified
    {
      tier: `${abbrev}-FC™`,
      title: "Foundation Certified",
      status: currentStep >= 1 ? "completed" :
              (currentStep === 0 && hasFoundations) || currentProgress > 0 ? "in_progress" :
              "locked",
      progress: currentStep === 0 && currentProgress > 0 ? currentProgress : undefined,
      price: currentStep >= 1 ? undefined : TIER_PRICES.fc,
      earnedDate: currentStep >= 1
        ? progressData.certificates.find(c => c.type === "COMPLETION")?.earnedAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : undefined,
    },
    // CP - Certified Professional
    {
      tier: `${abbrev}-CP™`,
      title: "Certified Professional",
      status: currentStep >= 2 ? "completed" :
              currentStep === 1 ? "in_progress" :
              "locked",
      progress: currentStep === 1 ? currentProgress : undefined,
      price: currentStep >= 2 ? undefined : TIER_PRICES.cp,
      earnedDate: currentStep >= 2
        ? progressData.certificates.find(c => c.type === "CERTIFICATION")?.earnedAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : undefined,
    },
    // BC - Board Certified
    {
      tier: `BC-${fullAbbrev}™`,
      title: "Board Certified Practitioner",
      status: currentStep >= 3 ? "completed" :
              currentStep === 2 ? "in_progress" :
              "locked",
      progress: currentStep === 2 ? currentProgress : undefined,
      price: currentStep >= 3 ? undefined : TIER_PRICES.bc,
      earnedDate: currentStep >= 3
        ? progressData.certificates.find(c => c.type === "BOARD_CERTIFIED")?.earnedAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : undefined,
    },
    // MC - Master Practitioner
    {
      tier: `MC-${fullAbbrev}™`,
      title: "Master Practitioner",
      status: currentStep >= 4 ? "completed" :
              currentStep === 3 ? "in_progress" :
              "locked",
      progress: currentStep === 3 ? currentProgress : undefined,
      price: currentStep >= 4 ? undefined : TIER_PRICES.mc,
      earnedDate: currentStep >= 4
        ? progressData.certificates.find(c => c.type === "MASTER")?.earnedAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : undefined,
    },
  ];

  return tiers;
}

/**
 * Get simplified credential path for users just starting out
 * (Shows fewer tiers to avoid overwhelming new students)
 */
export function getSimplifiedCredentialPath(
  specialization: SpecializationTrack,
  progressData: UserProgressData
): CredentialTierData[] {
  const fullPath = buildCredentialPath(specialization, progressData);

  // For new users, only show first 3 tiers
  const completedOrInProgress = fullPath.filter(t => t.status !== "locked").length;

  if (completedOrInProgress <= 2) {
    // Show only foundations + FC + CP (first 3)
    return fullPath.slice(0, 3);
  }

  // Show all tiers for more advanced users
  return fullPath;
}

/**
 * Get the user's current credential tier name
 */
export function getCurrentCredentialTier(
  specialization: SpecializationTrack,
  progressData: UserProgressData
): string {
  const path = buildCredentialPath(specialization, progressData);

  // Find the highest completed tier
  const completed = path.filter(t => t.status === "completed");
  if (completed.length > 0) {
    return completed[completed.length - 1].tier;
  }

  // Otherwise return what they're working on
  const inProgress = path.find(t => t.status === "in_progress");
  return inProgress ? `Working on ${inProgress.tier}` : "Getting Started";
}
