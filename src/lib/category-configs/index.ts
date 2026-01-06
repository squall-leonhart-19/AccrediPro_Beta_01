import { CategoryConfig, CategoryDetectionResult, COURSE_TO_CATEGORY } from "./types";
import { fmHealthConfig } from "./fm-health";
import { mentalHealthConfig } from "./mental-health";

// ============================================
// CATEGORY CONFIG REGISTRY
// ============================================

export const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
    "fm-health": fmHealthConfig,
    "mental-health": mentalHealthConfig,
    // Add more as they're created:
    // "spiritual": spiritualConfig,
    // "life-coaching": lifeCoachingConfig,
    // "herbalism": herbalismConfig,
    // "yoga-movement": yogaMovementConfig,
    // "pet": petConfig,
    // "parenting": parentingConfig,
    // "faith": faithConfig,
};

// Default fallback category
export const DEFAULT_CATEGORY_ID = "fm-health";

// ============================================
// DETECTION FUNCTIONS
// ============================================

/**
 * Detect category from course enrollments
 */
export function getCategoryFromEnrollments(
    enrollments: Array<{ course: { slug: string } }>
): CategoryDetectionResult {
    for (const enrollment of enrollments) {
        const categoryId = COURSE_TO_CATEGORY[enrollment.course.slug];
        if (categoryId && CATEGORY_CONFIGS[categoryId]) {
            return {
                categoryId,
                detectedFrom: "enrollment",
                confidence: "high",
            };
        }
    }

    return {
        categoryId: null,
        detectedFrom: "fallback",
        confidence: "low",
    };
}

/**
 * Detect category from user tags (purchase tags)
 */
export function getCategoryFromTags(
    tags: Array<{ tag: string; value?: string | null }>
): CategoryDetectionResult {
    // Look for purchase tags and map them to categories
    for (const { tag } of tags) {
        // Extract course slug from tag (e.g., "functional_medicine_complete_certification_purchased" -> "functional-medicine-complete-certification")
        if (tag.endsWith("_purchased")) {
            const slugFromTag = tag
                .replace("_purchased", "")
                .replace(/_/g, "-");

            const categoryId = COURSE_TO_CATEGORY[slugFromTag];
            if (categoryId && CATEGORY_CONFIGS[categoryId]) {
                return {
                    categoryId,
                    detectedFrom: "tags",
                    confidence: "high",
                };
            }
        }

        // Check for pro accelerator tags (e.g., "fm_pro_accelerator_purchased")
        if (tag.includes("_pro_accelerator_purchased")) {
            const codeMatch = tag.match(/^([a-z]{2})_pro_accelerator_purchased$/);
            if (codeMatch) {
                const code = codeMatch[1].toUpperCase();
                // Map 2-letter code to category
                const codeToCategory: Record<string, string> = {
                    FM: "fm-health",
                    HN: "fm-health",
                    WH: "fm-health",
                    IM: "fm-health",
                    NR: "mental-health",
                    ND: "mental-health",
                    GL: "mental-health",
                    SE: "spiritual",
                    SI: "spiritual",
                    LC: "life-coaching",
                    HB: "herbalism",
                    TM: "yoga-movement",
                    PW: "pet",
                    FB: "parenting",
                    PC: "parenting",
                    CF: "faith",
                };

                const categoryId = codeToCategory[code];
                if (categoryId && CATEGORY_CONFIGS[categoryId]) {
                    return {
                        categoryId,
                        detectedFrom: "tags",
                        confidence: "high",
                    };
                }
            }
        }
    }

    return {
        categoryId: null,
        detectedFrom: "fallback",
        confidence: "low",
    };
}

/**
 * Get category configuration by ID
 * Falls back to default category if not found
 */
export function getCategoryConfig(categoryId: string | null): CategoryConfig {
    if (categoryId && CATEGORY_CONFIGS[categoryId]) {
        return CATEGORY_CONFIGS[categoryId];
    }
    return CATEGORY_CONFIGS[DEFAULT_CATEGORY_ID];
}

/**
 * Detect user's category from enrollments and tags, with priority:
 * 1. Enrollment (highest priority - they're actively taking the course)
 * 2. Tags (purchase history)
 * 3. Default fallback
 */
export function detectUserCategory(
    enrollments: Array<{ course: { slug: string } }>,
    tags: Array<{ tag: string; value?: string | null }>
): { config: CategoryConfig; detection: CategoryDetectionResult } {
    // Try enrollment first
    const enrollmentResult = getCategoryFromEnrollments(enrollments);
    if (enrollmentResult.categoryId) {
        return {
            config: getCategoryConfig(enrollmentResult.categoryId),
            detection: enrollmentResult,
        };
    }

    // Try tags
    const tagResult = getCategoryFromTags(tags);
    if (tagResult.categoryId) {
        return {
            config: getCategoryConfig(tagResult.categoryId),
            detection: tagResult,
        };
    }

    // Fallback
    return {
        config: getCategoryConfig(DEFAULT_CATEGORY_ID),
        detection: {
            categoryId: DEFAULT_CATEGORY_ID,
            detectedFrom: "fallback",
            confidence: "low",
        },
    };
}

// Re-export types
export * from "./types";
