import { HEALTH_COACH_NURTURE_SEQUENCE } from "./health-coach-nurture-60-day";
import { HEALTH_COACH_DMS } from "./health-coach-dms";
import { NURSE_COACH_NURTURE_SEQUENCE } from "./nurse-coach-nurture-60-day";
import { NURSE_COACH_DMS } from "./nurse-coach-dms";
import { HOLISTIC_NUTRITION_NURTURE_SEQUENCE } from "./holistic-nutrition-nurture-60-day";
import { HOLISTIC_NUTRITION_DMS } from "./holistic-nutrition-dms";
import { HORMONE_HEALTH_NURTURE_SEQUENCE } from "./hormone-health-nurture-60-day";
import { HORMONE_HEALTH_DMS } from "./hormone-health-dms";
import { GUT_HEALTH_NURTURE_SEQUENCE } from "./gut-health-nurture-60-day";
import { GUT_HEALTH_DMS } from "./gut-health-dms";
import { FUNCTIONAL_MEDICINE_NURTURE_SEQUENCE } from "./functional-medicine-nurture-60-day";
import { FUNCTIONAL_MEDICINE_DMS } from "./functional-medicine-dms";
import { WH_NURTURE_60_DAY_V3 } from "./wh-nurture-60-day-v3";
import { TIME_BASED_DMS as WH_DMS, SarahDM } from "./wh-sarah-dms";
// Niche-specific nurture sequences (no fallback needed)
import { SPIRITUAL_HEALING_NURTURE_SEQUENCE } from "./spiritual-healing-nurture-60-day";
import { ENERGY_HEALING_NURTURE_SEQUENCE } from "./energy-healing-nurture-60-day";
import { CHRISTIAN_COACHING_NURTURE_SEQUENCE } from "./christian-coaching-nurture-60-day";
import { REIKI_HEALING_NURTURE_SEQUENCE } from "./reiki-healing-nurture-60-day";
import { ADHD_COACHING_NURTURE_SEQUENCE } from "./adhd-coaching-nurture-60-day";
import { PET_NUTRITION_NURTURE_SEQUENCE } from "./pet-nutrition-nurture-60-day";

// Lesson definition for portal
export interface DiplomaLesson {
    id: number;
    title: string;
    module: number;
}

// Type definitions for the registry
export interface MiniDiplomaConfig {
    name: string;
    slug: string;
    // Portal routing fields
    portalSlug: string;      // URL slug (functional-medicine, christian-coaching)
    displayName: string;     // "Functional Medicine Foundation"
    lessons: DiplomaLesson[]; // Lesson definitions for this diploma
    checkoutUrl: string;     // Stripe checkout URL for career roadmap
    examCategory: string;    // fm-healthcare, christian-coaching, etc.
    lessonTagPrefix: string; // functional-medicine-lesson-complete
    // Nurture/DM fields
    nurtureSequence: any[]; // Using any for now to avoid strict typing issues with differing email interfaces
    dmSequence: SarahDM[];
    nudgePrefix: string; // e.g. "wh-nudge" or "lead-nudge"
    nurturePrefix: string; // e.g. "wh-nurture" or "nurture"
    completionTag: string; // e.g. "wh-mini-diploma:completed"
}

// Standard 9-lesson curriculum template - most diplomas follow this pattern
const FM_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "Root Cause Medicine", module: 1 },
    { id: 2, title: "The Gut Foundation", module: 1 },
    { id: 3, title: "The Inflammation Connection", module: 1 },
    { id: 4, title: "The Toxin Burden", module: 2 },
    { id: 5, title: "Stress & The HPA Axis", module: 2 },
    { id: 6, title: "Nutrient Deficiencies", module: 2 },
    { id: 7, title: "Functional Lab Interpretation", module: 3 },
    { id: 8, title: "Building Protocols", module: 3 },
    { id: 9, title: "Your Next Step", module: 3 },
];

const WH_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "Hormonal Health Foundations", module: 1 },
    { id: 2, title: "The Menstrual Cycle", module: 1 },
    { id: 3, title: "Perimenopause & Menopause", module: 1 },
    { id: 4, title: "Thyroid & Adrenal Connection", module: 2 },
    { id: 5, title: "Fertility & Reproductive Health", module: 2 },
    { id: 6, title: "PCOS & Endometriosis", module: 2 },
    { id: 7, title: "Nutrition for Women", module: 3 },
    { id: 8, title: "Stress & Emotional Wellness", module: 3 },
    { id: 9, title: "Your Practice Blueprint", module: 3 },
];

const GUT_HEALTH_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "The Gut-Brain Connection", module: 1 },
    { id: 2, title: "Microbiome Fundamentals", module: 1 },
    { id: 3, title: "Digestive Dysfunction", module: 1 },
    { id: 4, title: "Leaky Gut & Inflammation", module: 2 },
    { id: 5, title: "Food Sensitivities", module: 2 },
    { id: 6, title: "Gut Healing Protocols", module: 2 },
    { id: 7, title: "Functional Testing", module: 3 },
    { id: 8, title: "Nutrition & Supplementation", module: 3 },
    { id: 9, title: "Building Your Practice", module: 3 },
];

const HORMONE_HEALTH_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "Hormonal System Overview", module: 1 },
    { id: 2, title: "Thyroid Mastery", module: 1 },
    { id: 3, title: "Adrenal Health", module: 1 },
    { id: 4, title: "Sex Hormones", module: 2 },
    { id: 5, title: "Insulin & Metabolic Health", module: 2 },
    { id: 6, title: "Hormone Testing", module: 2 },
    { id: 7, title: "Bioidentical HRT Basics", module: 3 },
    { id: 8, title: "Lifestyle Interventions", module: 3 },
    { id: 9, title: "Practice Development", module: 3 },
];

const HOLISTIC_NUTRITION_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "Nutrition Science Foundations", module: 1 },
    { id: 2, title: "Macronutrients Deep Dive", module: 1 },
    { id: 3, title: "Micronutrient Essentials", module: 1 },
    { id: 4, title: "Therapeutic Diets", module: 2 },
    { id: 5, title: "Food as Medicine", module: 2 },
    { id: 6, title: "Detox & Elimination", module: 2 },
    { id: 7, title: "Meal Planning Mastery", module: 3 },
    { id: 8, title: "Client Assessment", module: 3 },
    { id: 9, title: "Growing Your Practice", module: 3 },
];

const NURSE_COACH_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "Nurse Coaching Foundations", module: 1 },
    { id: 2, title: "Holistic Assessment", module: 1 },
    { id: 3, title: "Behavior Change Science", module: 1 },
    { id: 4, title: "Motivational Interviewing", module: 2 },
    { id: 5, title: "Wellness Planning", module: 2 },
    { id: 6, title: "Chronic Disease Management", module: 2 },
    { id: 7, title: "Documentation & Ethics", module: 3 },
    { id: 8, title: "Business Development", module: 3 },
    { id: 9, title: "Your Coaching Career", module: 3 },
];

const HEALTH_COACH_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "Health Coaching Foundations", module: 1 },
    { id: 2, title: "Client Psychology", module: 1 },
    { id: 3, title: "Goal Setting Mastery", module: 1 },
    { id: 4, title: "Nutrition Coaching Basics", module: 2 },
    { id: 5, title: "Movement & Fitness", module: 2 },
    { id: 6, title: "Stress & Sleep", module: 2 },
    { id: 7, title: "Session Structure", module: 3 },
    { id: 8, title: "Building Your Brand", module: 3 },
    { id: 9, title: "Launching Your Business", module: 3 },
];

const CHRISTIAN_COACHING_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "Biblical Foundations of Coaching", module: 1 },
    { id: 2, title: "Spirit-Led Listening", module: 1 },
    { id: 3, title: "Identity in Christ", module: 1 },
    { id: 4, title: "Transformational Questions", module: 2 },
    { id: 5, title: "Overcoming Limiting Beliefs", module: 2 },
    { id: 6, title: "Purpose & Calling Discovery", module: 2 },
    { id: 7, title: "Faith-Based Goal Setting", module: 3 },
    { id: 8, title: "Ministry & Business Ethics", module: 3 },
    { id: 9, title: "Launching Your Ministry", module: 3 },
];

const SPIRITUAL_HEALING_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "Foundations of Spiritual Healing", module: 1 },
    { id: 2, title: "Energy Systems & Chakras", module: 1 },
    { id: 3, title: "Mind-Body-Spirit Connection", module: 1 },
    { id: 4, title: "Meditation & Breathwork Techniques", module: 2 },
    { id: 5, title: "Healing Touch & Energy Transfer", module: 2 },
    { id: 6, title: "Spiritual Assessment Methods", module: 2 },
    { id: 7, title: "Client Sessions & Sacred Space", module: 3 },
    { id: 8, title: "Ethics & Building Your Practice", module: 3 },
    { id: 9, title: "Your Next Step", module: 3 },
];

const ENERGY_HEALING_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "Foundations of Energy Healing", module: 1 },
    { id: 2, title: "The Human Energy Field", module: 1 },
    { id: 3, title: "Chakra Systems & Energy Centers", module: 1 },
    { id: 4, title: "Grounding & Protection Techniques", module: 2 },
    { id: 5, title: "Energy Assessment & Scanning", module: 2 },
    { id: 6, title: "Hands-On Healing Methods", module: 2 },
    { id: 7, title: "Distance Healing Practices", module: 3 },
    { id: 8, title: "Ethics & Client Boundaries", module: 3 },
    { id: 9, title: "Your Next Step", module: 3 },
];

const REIKI_HEALING_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "Foundations of Reiki", module: 1 },
    { id: 2, title: "The Human Energy System", module: 1 },
    { id: 3, title: "Connecting to Universal Energy", module: 1 },
    { id: 4, title: "Hand Positions & Techniques", module: 2 },
    { id: 5, title: "Self-Healing Practice", module: 2 },
    { id: 6, title: "Working with Clients", module: 2 },
    { id: 7, title: "Distance Reiki", module: 3 },
    { id: 8, title: "Ethics & Building Your Practice", module: 3 },
    { id: 9, title: "Your Next Step", module: 3 },
];

const ADHD_COACHING_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "Understanding ADHD", module: 1 },
    { id: 2, title: "The ADHD Brain", module: 1 },
    { id: 3, title: "Executive Function & Self-Regulation", module: 1 },
    { id: 4, title: "Time Management & Organization", module: 2 },
    { id: 5, title: "Emotional Regulation Strategies", module: 2 },
    { id: 6, title: "Building Habits That Stick", module: 2 },
    { id: 7, title: "Coaching Adults with ADHD", module: 3 },
    { id: 8, title: "Working with Parents of ADHD Kids", module: 3 },
    { id: 9, title: "Your Next Step", module: 3 },
];

const PET_NUTRITION_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "Pet Nutrition Foundations", module: 1 },
    { id: 2, title: "Understanding Pet Food Labels", module: 1 },
    { id: 3, title: "Species-Appropriate Diets", module: 1 },
    { id: 4, title: "Common Nutritional Deficiencies", module: 2 },
    { id: 5, title: "Natural Supplements for Pets", module: 2 },
    { id: 6, title: "Weight Management Strategies", module: 2 },
    { id: 7, title: "Life Stage Nutrition", module: 3 },
    { id: 8, title: "Treating Health Issues with Diet", module: 3 },
    { id: 9, title: "Your Next Step", module: 3 },
];

// Default Stripe checkout URL (can be overridden per diploma)
const DEFAULT_CHECKOUT_URL = "https://www.fanbasis.com/agency-checkout/AccrediPro/Gvw2y";

// The Registry
export const MINI_DIPLOMA_REGISTRY: Record<string, MiniDiplomaConfig> = {
    // Women's Hormone Health
    "womens-hormone-health-mini-diploma": {
        name: "Women's Hormone Health",
        slug: "womens-hormone-health-mini-diploma",
        portalSlug: "womens-hormone-health",
        displayName: "Women's Hormone Health Foundation",
        lessons: WH_LESSONS,
        checkoutUrl: DEFAULT_CHECKOUT_URL,
        examCategory: "womens-hormone-health",
        lessonTagPrefix: "whh-lesson-complete",
        nurtureSequence: WH_NURTURE_60_DAY_V3,
        dmSequence: WH_DMS,
        nudgePrefix: "whh-nudge",
        nurturePrefix: "whh-nurture",
        completionTag: "womens-hormone-health-mini-diploma:completed"
    },

    "functional-medicine-mini-diploma": {
        name: "Functional Medicine",
        slug: "functional-medicine-mini-diploma",
        portalSlug: "functional-medicine",
        displayName: "Functional Medicine Foundation",
        lessons: FM_LESSONS,
        checkoutUrl: DEFAULT_CHECKOUT_URL,
        examCategory: "fm-healthcare",
        lessonTagPrefix: "functional-medicine-lesson-complete",
        nurtureSequence: FUNCTIONAL_MEDICINE_NURTURE_SEQUENCE,
        dmSequence: FUNCTIONAL_MEDICINE_DMS,
        nudgePrefix: "functional-medicine-nudge",
        nurturePrefix: "functional-medicine-nurture",
        completionTag: "functional-medicine-mini-diploma:completed"
    },

    "gut-health-mini-diploma": {
        name: "Gut Health",
        slug: "gut-health-mini-diploma",
        portalSlug: "gut-health",
        displayName: "Gut Health Specialist",
        lessons: GUT_HEALTH_LESSONS,
        checkoutUrl: DEFAULT_CHECKOUT_URL,
        examCategory: "gut-health",
        lessonTagPrefix: "gut-health-lesson-complete",
        nurtureSequence: GUT_HEALTH_NURTURE_SEQUENCE,
        dmSequence: GUT_HEALTH_DMS,
        nudgePrefix: "gut-health-nudge",
        nurturePrefix: "gut-health-nurture",
        completionTag: "gut-health-mini-diploma:completed"
    },

    "hormone-health-mini-diploma": {
        name: "Hormone Health",
        slug: "hormone-health-mini-diploma",
        portalSlug: "hormone-health",
        displayName: "Hormone Health Specialist",
        lessons: HORMONE_HEALTH_LESSONS,
        checkoutUrl: DEFAULT_CHECKOUT_URL,
        examCategory: "hormone-health",
        lessonTagPrefix: "hormone-health-lesson-complete",
        nurtureSequence: HORMONE_HEALTH_NURTURE_SEQUENCE,
        dmSequence: HORMONE_HEALTH_DMS,
        nudgePrefix: "hormone-health-nudge",
        nurturePrefix: "hormone-health-nurture",
        completionTag: "hormone-health-mini-diploma:completed"
    },

    "holistic-nutrition-mini-diploma": {
        name: "Holistic Nutrition",
        slug: "holistic-nutrition-mini-diploma",
        portalSlug: "holistic-nutrition",
        displayName: "Holistic Nutrition Specialist",
        lessons: HOLISTIC_NUTRITION_LESSONS,
        checkoutUrl: DEFAULT_CHECKOUT_URL,
        examCategory: "holistic-nutrition",
        lessonTagPrefix: "holistic-nutrition-lesson-complete",
        nurtureSequence: HOLISTIC_NUTRITION_NURTURE_SEQUENCE,
        dmSequence: HOLISTIC_NUTRITION_DMS,
        nudgePrefix: "holistic-nutrition-nudge",
        nurturePrefix: "holistic-nutrition-nurture",
        completionTag: "holistic-nutrition-mini-diploma:completed"
    },

    "nurse-coach-mini-diploma": {
        name: "Nurse Life Coach",
        slug: "nurse-coach-mini-diploma",
        portalSlug: "nurse-coach",
        displayName: "Certified Nurse Life Coach",
        lessons: NURSE_COACH_LESSONS,
        checkoutUrl: DEFAULT_CHECKOUT_URL,
        examCategory: "nurse-coach",
        lessonTagPrefix: "nurse-coach-lesson-complete",
        nurtureSequence: NURSE_COACH_NURTURE_SEQUENCE,
        dmSequence: NURSE_COACH_DMS,
        nudgePrefix: "nurse-coach-nudge",
        nurturePrefix: "nurse-coach-nurture",
        completionTag: "nurse-coach-mini-diploma:completed"
    },

    "health-coach-mini-diploma": {
        name: "Certified Health Coach",
        slug: "health-coach-mini-diploma",
        portalSlug: "health-coach",
        displayName: "Certified Health Coach",
        lessons: HEALTH_COACH_LESSONS,
        checkoutUrl: DEFAULT_CHECKOUT_URL,
        examCategory: "health-coach",
        lessonTagPrefix: "health-coach-lesson-complete",
        nurtureSequence: HEALTH_COACH_NURTURE_SEQUENCE,
        dmSequence: HEALTH_COACH_DMS,
        nudgePrefix: "health-coach-nudge",
        nurturePrefix: "health-coach-nurture",
        completionTag: "health-coach-mini-diploma:completed"
    },

    "spiritual-healing-mini-diploma": {
        name: "Spiritual Healing",
        slug: "spiritual-healing-mini-diploma",
        portalSlug: "spiritual-healing",
        displayName: "Certified Spiritual Healing Specialist",
        lessons: SPIRITUAL_HEALING_LESSONS,
        checkoutUrl: DEFAULT_CHECKOUT_URL,
        examCategory: "spiritual-healing",
        lessonTagPrefix: "spiritual-healing-lesson-complete",
        nurtureSequence: SPIRITUAL_HEALING_NURTURE_SEQUENCE,
        dmSequence: HEALTH_COACH_DMS, // DMs still use health coach fallback
        nudgePrefix: "spiritual-healing-nudge",
        nurturePrefix: "spiritual-healing-nurture",
        completionTag: "spiritual-healing-mini-diploma:completed"
    },

    "energy-healing-mini-diploma": {
        name: "Energy Healing",
        slug: "energy-healing-mini-diploma",
        portalSlug: "energy-healing",
        displayName: "Certified Energy Healing Practitioner",
        lessons: ENERGY_HEALING_LESSONS,
        checkoutUrl: DEFAULT_CHECKOUT_URL,
        examCategory: "energy-healing-exam",
        lessonTagPrefix: "energy-healing-lesson-complete",
        nurtureSequence: ENERGY_HEALING_NURTURE_SEQUENCE,
        dmSequence: HEALTH_COACH_DMS, // DMs still use health coach fallback
        nudgePrefix: "energy-healing-nudge",
        nurturePrefix: "energy-healing-nurture",
        completionTag: "energy-healing-mini-diploma:completed"
    },

    "christian-coaching-mini-diploma": {
        name: "Christian Coaching",
        slug: "christian-coaching-mini-diploma",
        portalSlug: "christian-coaching",
        displayName: "Certified Christian Life Coach",
        lessons: CHRISTIAN_COACHING_LESSONS,
        checkoutUrl: DEFAULT_CHECKOUT_URL,
        examCategory: "christian-coaching",
        lessonTagPrefix: "christian-coaching-lesson-complete",
        nurtureSequence: CHRISTIAN_COACHING_NURTURE_SEQUENCE,
        dmSequence: HEALTH_COACH_DMS, // DMs still use health coach fallback
        nudgePrefix: "christian-coaching-nudge",
        nurturePrefix: "christian-coaching-nurture",
        completionTag: "christian-coaching-mini-diploma:completed"
    },

    "reiki-healing-mini-diploma": {
        name: "Reiki Healing",
        slug: "reiki-healing-mini-diploma",
        portalSlug: "reiki-healing",
        displayName: "Certified Reiki Practitioner",
        lessons: REIKI_HEALING_LESSONS,
        checkoutUrl: DEFAULT_CHECKOUT_URL,
        examCategory: "reiki-healing",
        lessonTagPrefix: "reiki-healing-lesson-complete",
        nurtureSequence: REIKI_HEALING_NURTURE_SEQUENCE,
        dmSequence: HEALTH_COACH_DMS, // DMs still use health coach fallback
        nudgePrefix: "reiki-healing-nudge",
        nurturePrefix: "reiki-healing-nurture",
        completionTag: "reiki-healing-mini-diploma:completed"
    },

    "adhd-coaching-mini-diploma": {
        name: "ADHD Coaching",
        slug: "adhd-coaching-mini-diploma",
        portalSlug: "adhd-coaching",
        displayName: "Certified ADHD Coach",
        lessons: ADHD_COACHING_LESSONS,
        checkoutUrl: DEFAULT_CHECKOUT_URL,
        examCategory: "adhd-coaching",
        lessonTagPrefix: "adhd-coaching-lesson-complete",
        nurtureSequence: ADHD_COACHING_NURTURE_SEQUENCE,
        dmSequence: HEALTH_COACH_DMS, // DMs still use health coach fallback
        nudgePrefix: "adhd-coaching-nudge",
        nurturePrefix: "adhd-coaching-nurture",
        completionTag: "adhd-coaching-mini-diploma:completed"
    },

    "pet-nutrition-mini-diploma": {
        name: "Pet Nutrition & Wellness",
        slug: "pet-nutrition-mini-diploma",
        portalSlug: "pet-nutrition",
        displayName: "Certified Pet Nutrition Specialist",
        lessons: PET_NUTRITION_LESSONS,
        checkoutUrl: DEFAULT_CHECKOUT_URL,
        examCategory: "pet-nutrition",
        lessonTagPrefix: "pet-nutrition-lesson-complete",
        nurtureSequence: PET_NUTRITION_NURTURE_SEQUENCE,
        dmSequence: HEALTH_COACH_DMS, // DMs still use health coach fallback
        nudgePrefix: "pet-nutrition-nudge",
        nurturePrefix: "pet-nutrition-nurture",
        completionTag: "pet-nutrition-mini-diploma:completed"
    },
};

export const ALL_MINI_DIPLOMA_SLUGS = Object.keys(MINI_DIPLOMA_REGISTRY);

// Helper to get config by portal slug (for dynamic routing)
export function getConfigByPortalSlug(portalSlug: string): MiniDiplomaConfig | undefined {
    return Object.values(MINI_DIPLOMA_REGISTRY).find(c => c.portalSlug === portalSlug);
}

// Helper to get all portal slugs
export const ALL_PORTAL_SLUGS = Object.values(MINI_DIPLOMA_REGISTRY).map(c => c.portalSlug);

