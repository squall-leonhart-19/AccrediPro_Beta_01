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

// Type definitions for the registry
export interface MiniDiplomaConfig {
    name: string;
    slug: string;
    nurtureSequence: any[]; // Using any for now to avoid strict typing issues with differing email interfaces
    dmSequence: SarahDM[];
    nudgePrefix: string; // e.g. "wh-nudge" or "lead-nudge"
    nurturePrefix: string; // e.g. "wh-nurture" or "nurture"
    completionTag: string; // e.g. "wh-mini-diploma:completed"
}

// The Registry
export const MINI_DIPLOMA_REGISTRY: Record<string, MiniDiplomaConfig> = {
    // Women's Health (The Original)
    "womens-health-mini-diploma": {
        name: "Women's Health",
        slug: "womens-health-mini-diploma",
        nurtureSequence: WH_NURTURE_60_DAY_V3,
        dmSequence: WH_DMS,
        nudgePrefix: "lead-nudge", // Legacy prefix
        nurturePrefix: "wh-nurture",
        completionTag: "wh-mini-diploma:completed"
    },

    "functional-medicine-mini-diploma": {
        name: "Functional Medicine",
        slug: "functional-medicine-mini-diploma",
        nurtureSequence: FUNCTIONAL_MEDICINE_NURTURE_SEQUENCE,
        dmSequence: FUNCTIONAL_MEDICINE_DMS,
        nudgePrefix: "functional-medicine-nudge",
        nurturePrefix: "functional-medicine-nurture",
        completionTag: "functional-medicine-mini-diploma:completed"
    },

    "gut-health-mini-diploma": {
        name: "Gut Health",
        slug: "gut-health-mini-diploma",
        nurtureSequence: GUT_HEALTH_NURTURE_SEQUENCE,
        dmSequence: GUT_HEALTH_DMS,
        nudgePrefix: "gut-health-nudge",
        nurturePrefix: "gut-health-nurture",
        completionTag: "gut-health-mini-diploma:completed"
    },

    "hormone-health-mini-diploma": {
        name: "Hormone Health",
        slug: "hormone-health-mini-diploma",
        nurtureSequence: HORMONE_HEALTH_NURTURE_SEQUENCE,
        dmSequence: HORMONE_HEALTH_DMS,
        nudgePrefix: "hormone-health-nudge",
        nurturePrefix: "hormone-health-nurture",
        completionTag: "hormone-health-mini-diploma:completed"
    },

    "holistic-nutrition-mini-diploma": {
        name: "Holistic Nutrition",
        slug: "holistic-nutrition-mini-diploma",
        nurtureSequence: HOLISTIC_NUTRITION_NURTURE_SEQUENCE,
        dmSequence: HOLISTIC_NUTRITION_DMS,
        nudgePrefix: "holistic-nutrition-nudge",
        nurturePrefix: "holistic-nutrition-nurture",
        completionTag: "holistic-nutrition-mini-diploma:completed"
    },

    "nurse-coach-mini-diploma": {
        name: "Nurse Life Coach",
        slug: "nurse-coach-mini-diploma",
        nurtureSequence: NURSE_COACH_NURTURE_SEQUENCE,
        dmSequence: NURSE_COACH_DMS,
        nudgePrefix: "nurse-coach-nudge",
        nurturePrefix: "nurse-coach-nurture",
        completionTag: "nurse-coach-mini-diploma:completed"
    },

    "health-coach-mini-diploma": {
        name: "Certified Health Coach",
        slug: "health-coach-mini-diploma",
        nurtureSequence: HEALTH_COACH_NURTURE_SEQUENCE,
        dmSequence: HEALTH_COACH_DMS,
        nudgePrefix: "health-coach-nudge",
        nurturePrefix: "health-coach-nurture",
        completionTag: "health-coach-mini-diploma:completed"
    },
};

export const ALL_MINI_DIPLOMA_SLUGS = Object.keys(MINI_DIPLOMA_REGISTRY);
