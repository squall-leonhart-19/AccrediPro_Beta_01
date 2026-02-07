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
import { ENERGY_HEALING_NURTURE_SEQUENCE } from "./energy-healing-nurture-60-day";
import { CHRISTIAN_COACHING_NURTURE_SEQUENCE } from "./christian-coaching-nurture-60-day";
import { REIKI_HEALING_NURTURE_SEQUENCE } from "./reiki-healing-nurture-60-day";
import { ADHD_COACHING_NURTURE_SEQUENCE } from "./adhd-coaching-nurture-60-day";
import { PET_NUTRITION_NURTURE_SEQUENCE } from "./pet-nutrition-nurture-60-day";
import { SPIRITUAL_HEALING_NURTURE_SEQUENCE } from "./spiritual-healing-nurture-60-day";

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
    // Post-exam flow options
    postExamFlow?: "scholarship" | "trustpilot"; // default: "scholarship"
    trustpilotUrl?: string; // default: https://www.trustpilot.com/review/accredipro.academy
}

// 3-lesson curriculum — niche-specific method names from blueprints
const FM_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "The Functional Medicine Revolution", module: 1 },
    { id: 2, title: "The D.E.P.T.H. Method™ in Practice", module: 1 },
    { id: 3, title: "Building Your Functional Medicine Practice", module: 1 },
];

const WH_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "The Female Hormonal Landscape", module: 1 },
    { id: 2, title: "The B.L.O.O.M. Method™ in Practice", module: 1 },
    { id: 3, title: "Building Your Women's Health Coaching Practice", module: 1 },
];

const GUT_HEALTH_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "The Gut Health Revolution", module: 1 },
    { id: 2, title: "The R.E.S.E.T. Method™ in Practice", module: 1 },
    { id: 3, title: "Building Your Gut Health Practice", module: 1 },
];

const HORMONE_HEALTH_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "Understanding the Hormonal Symphony", module: 1 },
    { id: 2, title: "The B.A.L.A.N.C.E. Method™ in Practice", module: 1 },
    { id: 3, title: "Building Your Hormone Health Practice", module: 1 },
];

const HOLISTIC_NUTRITION_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "The Holistic Nutrition Revolution", module: 1 },
    { id: 2, title: "The W.H.O.L.E. Method™ in Practice", module: 1 },
    { id: 3, title: "Building Your Holistic Nutrition Practice", module: 1 },
];

const NURSE_COACH_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "From Bedside to Beyond", module: 1 },
    { id: 2, title: "The C.A.R.E.S. Method™ in Practice", module: 1 },
    { id: 3, title: "Building Your Nurse Coaching Business", module: 1 },
];

const HEALTH_COACH_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "The Health Coaching Revolution", module: 1 },
    { id: 2, title: "The T.H.R.I.V.E. Method™ in Practice", module: 1 },
    { id: 3, title: "Building Your Health Coaching Practice", module: 1 },
];

const CHRISTIAN_COACHING_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "The Call to Christian Coaching", module: 1 },
    { id: 2, title: "The G.R.A.C.E. Method™ in Practice", module: 1 },
    { id: 3, title: "Building Your Faith-Based Coaching Practice", module: 1 },
];

const SPIRITUAL_HEALING_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "The Spiritual Healing Awakening", module: 1 },
    { id: 2, title: "The S.A.C.R.E.D. Method™ in Practice", module: 1 },
    { id: 3, title: "Building Your Spiritual Healing Practice", module: 1 },
];

const ENERGY_HEALING_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "The Science of Energy Healing", module: 1 },
    { id: 2, title: "The F.L.O.W. Method™ in Practice", module: 1 },
    { id: 3, title: "Building Your Energy Healing Practice", module: 1 },
];

const REIKI_HEALING_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "The Art of Reiki Healing", module: 1 },
    { id: 2, title: "The L.I.G.H.T. Method™ in Practice", module: 1 },
    { id: 3, title: "Building Your Reiki Healing Practice", module: 1 },
];

const ADHD_COACHING_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "Understanding ADHD Beyond the Label", module: 1 },
    { id: 2, title: "The F.O.C.U.S. Method™ in Practice", module: 1 },
    { id: 3, title: "Building Your ADHD Coaching Practice", module: 1 },
];

const PET_NUTRITION_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "The Pet Nutrition Crisis", module: 1 },
    { id: 2, title: "The P.A.W.S. Method™ in Practice", module: 1 },
    { id: 3, title: "Building Your Pet Nutrition Business", module: 1 },
];

const INTEGRATIVE_HEALTH_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "The Integrative Health Revolution", module: 1 },
    { id: 2, title: "The B.R.I.D.G.E. Method™ in Practice", module: 1 },
    { id: 3, title: "Building Your Integrative Health Practice", module: 1 },
];

const LIFE_COACHING_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "The Art & Science of Life Coaching", module: 1 },
    { id: 2, title: "The S.H.I.F.T. Method™ in Practice", module: 1 },
    { id: 3, title: "Building a Profitable Coaching Business", module: 1 },
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
        displayName: "Spiritual Healing",
        lessons: SPIRITUAL_HEALING_LESSONS,
        checkoutUrl: DEFAULT_CHECKOUT_URL,
        examCategory: "spiritual-healing-exam",
        lessonTagPrefix: "spiritual-healing-lesson-complete",
        nurtureSequence: SPIRITUAL_HEALING_NURTURE_SEQUENCE,
        nudgePrefix: "spiritual-healing-nudge",
        nurturePrefix: "spiritual-healing-nurture",
        completionTag: "spiritual-healing-mini-diploma:completed",
        postExamFlow: "trustpilot",
        trustpilotUrl: "https://www.trustpilot.com/review/accredipro.academy"
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

    "integrative-health-mini-diploma": {
        name: "Integrative Health",
        slug: "integrative-health-mini-diploma",
        portalSlug: "integrative-health",
        displayName: "Certified Integrative Health Practitioner",
        lessons: INTEGRATIVE_HEALTH_LESSONS,
        checkoutUrl: DEFAULT_CHECKOUT_URL,
        examCategory: "integrative-health",
        lessonTagPrefix: "integrative-health-lesson-complete",
        nurtureSequence: HEALTH_COACH_NURTURE_SEQUENCE, // Fallback until niche-specific created
        dmSequence: HEALTH_COACH_DMS,
        nudgePrefix: "integrative-health-nudge",
        nurturePrefix: "integrative-health-nurture",
        completionTag: "integrative-health-mini-diploma:completed"
    },

    "life-coaching-mini-diploma": {
        name: "Life Coaching",
        slug: "life-coaching-mini-diploma",
        portalSlug: "life-coaching",
        displayName: "Certified Life Coach",
        lessons: LIFE_COACHING_LESSONS,
        checkoutUrl: DEFAULT_CHECKOUT_URL,
        examCategory: "life-coaching",
        lessonTagPrefix: "life-coaching-lesson-complete",
        nurtureSequence: HEALTH_COACH_NURTURE_SEQUENCE, // Fallback until niche-specific created
        dmSequence: HEALTH_COACH_DMS,
        nudgePrefix: "life-coaching-nudge",
        nurturePrefix: "life-coaching-nurture",
        completionTag: "life-coaching-mini-diploma:completed"
    },
};

export const ALL_MINI_DIPLOMA_SLUGS = Object.keys(MINI_DIPLOMA_REGISTRY);

// Helper to get config by portal slug (for dynamic routing)
export function getConfigByPortalSlug(portalSlug: string): MiniDiplomaConfig | undefined {
    return Object.values(MINI_DIPLOMA_REGISTRY).find(c => c.portalSlug === portalSlug);
}

// Helper to get config by exam category
export function getConfigByExamCategory(examCategory: string): MiniDiplomaConfig | undefined {
    return Object.values(MINI_DIPLOMA_REGISTRY).find(c => c.examCategory === examCategory);
}

// Helper to get all portal slugs
export const ALL_PORTAL_SLUGS = Object.values(MINI_DIPLOMA_REGISTRY).map(c => c.portalSlug);
