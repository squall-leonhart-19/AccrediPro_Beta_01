/**
 * Niche Configuration System
 * Maps niches to coaches, pixels, and messaging templates
 */

export interface NicheConfig {
    code: string;
    name: string;
    fullName: string;
    coach: CoachId;
    pixel: PixelCategory;
    courseSlug: string;
    tags: {
        l1Purchase: string;
        proPurchase?: string;
    };
}

export type CoachId =
    | "sarah"
    | "olivia"
    | "marcus"
    | "luna"
    | "sage"
    | "maya"
    | "bella"
    | "emma"
    | "grace"
    | "david";

export type PixelCategory =
    | "fm-health"
    | "mental-health"
    | "life-coaching"
    | "spiritual"
    | "herbalism"
    | "yoga-movement"
    | "pet-wellness"
    | "parenting"
    | "faith"
    | "business";

export const COACH_INFO: Record<CoachId, { name: string; specialty: string; email: string }> = {
    sarah: {
        name: "Sarah M.",
        specialty: "functional medicine, root cause healing, and building thriving wellness practices",
        email: "sarah@accredipro.academy",
    },
    olivia: {
        name: "Olivia",
        specialty: "trauma-informed healing and nervous system regulation",
        email: "olivia@accredipro.academy",
    },
    marcus: {
        name: "Marcus",
        specialty: "peak performance and helping people unlock their potential",
        email: "marcus@accredipro.academy",
    },
    luna: {
        name: "Luna",
        specialty: "spiritual and energy work, intuition, and soul alignment",
        email: "luna@accredipro.academy",
    },
    sage: {
        name: "Sage",
        specialty: "plant medicine and herbal healing traditions",
        email: "sage@accredipro.academy",
    },
    maya: {
        name: "Maya",
        specialty: "somatic healing, breathwork, and embodiment",
        email: "maya@accredipro.academy",
    },
    bella: {
        name: "Bella",
        specialty: "animal wellness and holistic pet care",
        email: "bella@accredipro.academy",
    },
    emma: {
        name: "Emma",
        specialty: "family wellness and parenting support",
        email: "emma@accredipro.academy",
    },
    grace: {
        name: "Grace",
        specialty: "faith-based coaching and purpose discovery",
        email: "grace@accredipro.academy",
    },
    david: {
        name: "David",
        specialty: "practice building and business strategy",
        email: "david@accredipro.academy",
    },
};

export const NICHE_CONFIG: Record<string, NicheConfig> = {
    // FM/Health Pixel - Sarah
    FM: {
        code: "FM",
        name: "Functional Medicine",
        fullName: "Certified Functional Medicine Practitioner™",
        coach: "sarah",
        pixel: "fm-health",
        courseSlug: "functional-medicine-practitioner",
        tags: {
            l1Purchase: "functional_medicine_complete_certification_purchased",
            proPurchase: "fm_pro_accelerator_purchased",
        },
    },
    WH: {
        code: "WH",
        name: "Women's Hormone Health",
        fullName: "Certified Women's Hormone Health Coach™",
        coach: "sarah",
        pixel: "fm-health",
        courseSlug: "womens-hormone-health-coach",
        tags: {
            l1Purchase: "womens_hormone_health_coach_certification_purchased",
        },
    },
    IM: {
        code: "IM",
        name: "Integrative Medicine",
        fullName: "Certified Integrative Medicine Practitioner™",
        coach: "sarah",
        pixel: "fm-health",
        courseSlug: "integrative-medicine-practitioner",
        tags: {
            l1Purchase: "integrative_medicine_practitioner_certification_purchased",
        },
    },
    HN: {
        code: "HN",
        name: "Holistic Nutrition",
        fullName: "Certified Holistic Nutrition Coach™",
        coach: "sarah",
        pixel: "fm-health",
        courseSlug: "holistic-nutrition-coach",
        tags: {
            l1Purchase: "holistic_nutrition_coach_certification_purchased",
        },
    },

    // Mental Health Pixel - Olivia
    NR: {
        code: "NR",
        name: "Narcissistic Recovery",
        fullName: "Certified Narcissistic Abuse Recovery Coach™",
        coach: "olivia",
        pixel: "mental-health",
        courseSlug: "narcissistic-abuse-recovery-coach",
        tags: {
            l1Purchase: "narcissistic_abuse_recovery_coach_certification_purchased",
        },
    },
    ND: {
        code: "ND",
        name: "Neurodiversity",
        fullName: "Certified Neurodiversity Coach™",
        coach: "olivia",
        pixel: "mental-health",
        courseSlug: "neurodiversity-coach",
        tags: {
            l1Purchase: "neurodiversity_coach_certification_purchased",
        },
    },
    GL: {
        code: "GL",
        name: "Grief & Loss",
        fullName: "Certified Grief & Loss Coach™",
        coach: "olivia",
        pixel: "mental-health",
        courseSlug: "grief-loss-coach",
        tags: {
            l1Purchase: "grief_loss_coach_certification_purchased",
        },
    },

    // Life Coaching Pixel - Marcus
    LC: {
        code: "LC",
        name: "Life Coaching",
        fullName: "Certified Life Coach™",
        coach: "marcus",
        pixel: "life-coaching",
        courseSlug: "life-coach",
        tags: {
            l1Purchase: "life_coach_certification_purchased",
        },
    },

    // Spiritual Pixel - Luna
    SE: {
        code: "SE",
        name: "Spiritual Energy",
        fullName: "Certified Spiritual Energy Practitioner™",
        coach: "luna",
        pixel: "spiritual",
        courseSlug: "spiritual-energy-practitioner",
        tags: {
            l1Purchase: "spiritual_energy_practitioner_certification_purchased",
        },
    },
    SI: {
        code: "SI",
        name: "Sex & Intimacy",
        fullName: "Certified Sex & Intimacy Coach™",
        coach: "luna",
        pixel: "spiritual",
        courseSlug: "sex-intimacy-coach",
        tags: {
            l1Purchase: "sex_intimacy_coach_certification_purchased",
        },
    },

    // Herbalism Pixel - Sage
    HB: {
        code: "HB",
        name: "Herbalism",
        fullName: "Certified Herbalist Practitioner™",
        coach: "sage",
        pixel: "herbalism",
        courseSlug: "herbalist-practitioner",
        tags: {
            l1Purchase: "herbalist_practitioner_certification_purchased",
        },
    },

    // Yoga/Movement Pixel - Maya
    TM: {
        code: "TM",
        name: "Therapy Modalities",
        fullName: "Certified EFT/Tapping Practitioner™",
        coach: "maya",
        pixel: "yoga-movement",
        courseSlug: "eft-tapping-practitioner",
        tags: {
            l1Purchase: "eft_tapping_practitioner_certification_purchased",
        },
    },

    // Pet Wellness Pixel - Bella
    PW: {
        code: "PW",
        name: "Pet Wellness",
        fullName: "Certified Pet Wellness Coach™",
        coach: "bella",
        pixel: "pet-wellness",
        courseSlug: "pet-wellness-coach",
        tags: {
            l1Purchase: "pet_wellness_coach_certification_purchased",
        },
    },

    // Parenting Pixel - Emma
    FB: {
        code: "FB",
        name: "Fertility & Birth",
        fullName: "Certified Birth & Postpartum Doula™",
        coach: "emma",
        pixel: "parenting",
        courseSlug: "birth-postpartum-doula",
        tags: {
            l1Purchase: "birth_postpartum_doula_certification_purchased",
        },
    },
    PC: {
        code: "PC",
        name: "Parenting Coach",
        fullName: "Certified Parenting Coach™",
        coach: "emma",
        pixel: "parenting",
        courseSlug: "parenting-coach",
        tags: {
            l1Purchase: "parenting_coach_certification_purchased",
        },
    },

    // Faith Pixel - Grace
    CF: {
        code: "CF",
        name: "Christian Faith",
        fullName: "Certified Christian Life Coach™",
        coach: "grace",
        pixel: "faith",
        courseSlug: "christian-life-coach",
        tags: {
            l1Purchase: "christian_life_coach_certification_purchased",
        },
    },
};

/**
 * Get niche config by code
 */
export function getNicheConfig(code: string): NicheConfig | null {
    return NICHE_CONFIG[code.toUpperCase()] || null;
}

/**
 * Get niche config by course slug
 */
export function getNicheBySlug(slug: string): NicheConfig | null {
    return Object.values(NICHE_CONFIG).find((n) => n.courseSlug === slug) || null;
}

/**
 * Get niche config by purchase tag
 */
export function getNicheByTag(tag: string): NicheConfig | null {
    return Object.values(NICHE_CONFIG).find(
        (n) => n.tags.l1Purchase === tag || n.tags.proPurchase === tag
    ) || null;
}

/**
 * Get all niches for a specific coach
 */
export function getNichesByCoach(coachId: CoachId): NicheConfig[] {
    return Object.values(NICHE_CONFIG).filter((n) => n.coach === coachId);
}

/**
 * Get all niches for a specific pixel
 */
export function getNichesByPixel(pixel: PixelCategory): NicheConfig[] {
    return Object.values(NICHE_CONFIG).filter((n) => n.pixel === pixel);
}
