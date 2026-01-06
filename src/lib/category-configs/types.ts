import { LucideIcon } from "lucide-react";

// ============================================
// CATEGORY CONFIG TYPES
// ============================================

/**
 * Career path within a category (replaces "specializations" for non-FM niches)
 */
export interface CareerPath {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: LucideIcon;
    color: string;
    gradient: string;
    income: string;
    timeline: string;
    clientTypes: string;
    deliveredThrough: string[];
    ctaText: string;
    ctaLink: string;
}

/**
 * Success story for social proof
 */
export interface SuccessStory {
    name: string;
    role: string;
    avatar: string;
    quote: string;
    income: string;
    rating: number;
    isRecommended?: boolean;
}

/**
 * Income path tied to career steps
 */
export interface IncomePath {
    level: string;
    range: string;
    description: string;
    step: string;
    stepColor: string;
    perfectFor: string;
}

/**
 * Onboarding interest option
 */
export interface OnboardingInterest {
    id: string;
    label: string;
    description?: string;
}

/**
 * Main category configuration
 */
export interface CategoryConfig {
    // Identity
    id: string;
    name: string;
    code: string; // 2-letter code (FM, NR, ND, etc.)

    // Visual
    color: string; // burgundy, blue, purple, emerald, etc.
    colorClasses: {
        bg: string;
        bgGradient: string;
        text: string;
        border: string;
        badge: string;
    };

    // Content
    careerPaths: CareerPath[];
    successStories: SuccessStory[];
    incomePaths: IncomePath[];

    // Onboarding
    onboardingInterests: OnboardingInterest[];

    // Mapping
    nicheCodes: string[]; // Which niche codes belong to this category
    courseSlugs: string[]; // Which course slugs map to this category

    // Coach
    coachPersonaKey: string; // e.g., "fm-health", "mental-health"

    // Stats (optional overrides)
    stats?: {
        certifiedCount?: number;
        avgMonthlyIncome?: string;
        rating?: number;
    };
}

/**
 * Category detection result
 */
export interface CategoryDetectionResult {
    categoryId: string | null;
    detectedFrom: "enrollment" | "tags" | "fallback";
    confidence: "high" | "medium" | "low";
}

// ============================================
// NICHE CODE TO CATEGORY MAPPING
// ============================================

export const NICHE_TO_CATEGORY: Record<string, string> = {
    // fm-health (Sarah)
    FM: "fm-health",
    WH: "fm-health",
    IM: "fm-health",
    HN: "fm-health",

    // mental-health (Olivia)
    NR: "mental-health",
    ND: "mental-health",
    GL: "mental-health",

    // spiritual (Luna)
    SE: "spiritual",
    SI: "spiritual",

    // life-coaching (Marcus)
    LC: "life-coaching",

    // herbalism (Sage)
    HB: "herbalism",

    // yoga-movement (Maya)
    TM: "yoga-movement",

    // pet (Bella)
    PW: "pet",

    // parenting (Emma)
    FB: "parenting",
    PC: "parenting",

    // faith (Grace)
    CF: "faith",
};

// ============================================
// COURSE SLUG TO CATEGORY MAPPING
// ============================================

export const COURSE_TO_CATEGORY: Record<string, string> = {
    // fm-health
    "functional-medicine-complete-certification": "fm-health",
    "fm-preview": "fm-health",
    "fm-pro-advanced-clinical": "fm-health",
    "fm-pro-master-depth": "fm-health",
    "fm-pro-practice-path": "fm-health",
    "certified-holistic-nutrition-coach": "fm-health",
    "hn-pro-advanced": "fm-health",
    "hn-pro-master": "fm-health",
    "hn-pro-practice": "fm-health",
    "women-s-hormone-health-coach": "fm-health",
    "wh-pro-advanced": "fm-health",
    "wh-pro-master": "fm-health",
    "wh-pro-practice": "fm-health",
    "integrative-medicine-practitioner": "fm-health",
    "im-pro-advanced": "fm-health",
    "im-pro-master": "fm-health",
    "im-pro-practice": "fm-health",

    // mental-health
    "narcissistic-abuse-recovery-coach": "mental-health",
    "nr-pro-advanced": "mental-health",
    "nr-pro-master": "mental-health",
    "nr-pro-practice": "mental-health",
    "certified-adhd-support-specialist": "mental-health",
    "nd-pro-advanced": "mental-health",
    "nd-pro-master": "mental-health",
    "nd-pro-practice": "mental-health",
    "grief-and-loss-coach": "mental-health",
    "gl-pro-advanced": "mental-health",
    "gl-pro-master": "mental-health",
    "gl-pro-practice": "mental-health",

    // spiritual
    "energy-healing-practitioner": "spiritual",
    "se-pro-advanced": "spiritual",
    "se-pro-master": "spiritual",
    "se-pro-practice": "spiritual",
    "sex-intimacy-coach": "spiritual",
    "si-pro-advanced": "spiritual",
    "si-pro-master": "spiritual",
    "si-pro-practice": "spiritual",

    // life-coaching
    "life-coach": "life-coaching",
    "lc-pro-advanced": "life-coaching",
    "lc-pro-master": "life-coaching",
    "lc-pro-practice": "life-coaching",

    // herbalism
    "herbalism-practitioner": "herbalism",
    "hb-pro-advanced": "herbalism",
    "hb-pro-master": "herbalism",
    "hb-pro-practice": "herbalism",

    // yoga-movement
    "eft-tapping-practitioner": "yoga-movement",
    "tm-pro-advanced": "yoga-movement",
    "tm-pro-master": "yoga-movement",
    "tm-pro-practice": "yoga-movement",

    // pet
    "pet-wellness-coach": "pet",
    "pw-pro-advanced": "pet",
    "pw-pro-master": "pet",
    "pw-pro-practice": "pet",

    // parenting
    "birth-postpartum-doula": "parenting",
    "fb-pro-advanced": "parenting",
    "fb-pro-master": "parenting",
    "fb-pro-practice": "parenting",
    "conscious-parenting-coach": "parenting",
    "pc-pro-advanced": "parenting",
    "pc-pro-master": "parenting",
    "pc-pro-practice": "parenting",

    // faith
    "christian-life-coach": "faith",
    "cf-pro-advanced": "faith",
    "cf-pro-master": "faith",
    "cf-pro-practice": "faith",
};
