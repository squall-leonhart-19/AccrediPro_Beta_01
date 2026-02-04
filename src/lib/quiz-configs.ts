// Quiz configs for mini diploma personalization
// NOTE: No "use client" - this needs to be importable by server components

// ============================================
// QUIZ OPTION TYPE
// ============================================
export interface QuizOption {
    value: string;
    label: string;
    iconName: string; // Icon name as string, resolved in client component
    description: string;
}

export interface QuizQuestion {
    id: string;
    question: string;
    subtitle: string;
    options: QuizOption[];
}

export interface QuizConfig {
    nicheSlug: string;
    nicheLabel: string;
    tagPrefix: string; // For user tags: "fm" -> "fm:interest:gut-health"
    questions: QuizQuestion[];
    completionRedirect: string;
    accentColor: string; // For theming
}

// ============================================
// SHARED QUESTIONS (Goal, Motivation, Experience)
// ============================================
const GOAL_OPTIONS: QuizOption[] = [
    { value: "start-practice", label: "Start a Practice", iconName: "Briefcase", description: "Build a new coaching career" },
    { value: "add-to-practice", label: "Add to Existing Practice", iconName: "Stethoscope", description: "Expand your current services" },
    { value: "personal-knowledge", label: "Personal Knowledge", iconName: "GraduationCap", description: "Learn for yourself & family" },
];

const MOTIVATION_OPTIONS: QuizOption[] = [
    { value: "time-with-family", label: "More Time with Family", iconName: "Users", description: "Flexible schedule & work-life balance" },
    { value: "help-others", label: "Help Others Heal", iconName: "Heart", description: "Make a real difference in people's lives" },
    { value: "financial-freedom", label: "Financial Freedom", iconName: "DollarSign", description: "Build sustainable income" },
    { value: "career-change", label: "Career Change", iconName: "Target", description: "Transition to meaningful work" },
];

// ============================================
// FUNCTIONAL MEDICINE CONFIG
// ============================================
const FUNCTIONAL_MEDICINE_CONFIG: QuizConfig = {
    nicheSlug: "functional-medicine",
    nicheLabel: "Functional Medicine Diploma",
    tagPrefix: "fm",
    accentColor: "#D4AF37", // Gold
    completionRedirect: "/portal/functional-medicine/profile",
    questions: [
        {
            id: "interest",
            question: "What area of health interests you most?",
            subtitle: "This helps us personalize your learning journey",
            options: [
                { value: "gut-health", label: "Gut Health", iconName: "Activity", description: "Digestive wellness & microbiome" },
                { value: "womens-health", label: "Women's Health", iconName: "Heart", description: "Hormones, fertility & menopause" },
                { value: "weight-management", label: "Weight Management", iconName: "Scale", description: "Metabolism & body composition" },
                { value: "autoimmune", label: "Autoimmune", iconName: "Shield", description: "Immune system & inflammation" },
                { value: "general-wellness", label: "General Wellness", iconName: "Leaf", description: "Holistic health approach" },
            ],
        },
        {
            id: "goal",
            question: "What's your goal?",
            subtitle: "Everyone's path is different - we want to support yours",
            options: GOAL_OPTIONS,
        },
        {
            id: "motivation",
            question: "What's driving you?",
            subtitle: "Understanding your 'why' helps us keep you motivated",
            options: MOTIVATION_OPTIONS,
        },
        {
            id: "experience",
            question: "What's your background?",
            subtitle: "We'll adjust the content to match your experience level",
            options: [
                { value: "beginner", label: "Complete Beginner", iconName: "Sparkles", description: "New to health & wellness" },
                { value: "some-background", label: "Some Health Background", iconName: "GraduationCap", description: "Self-taught or personal interest" },
                { value: "healthcare-professional", label: "Healthcare Professional", iconName: "Stethoscope", description: "RN, MD, therapist, etc." },
            ],
        },
    ],
};

// ============================================
// CONFIG REGISTRY
// ============================================
export const QUIZ_CONFIGS: Record<string, QuizConfig> = {
    "functional-medicine": FUNCTIONAL_MEDICINE_CONFIG,
    // Future niches will be added here:
    // "christian-coach": CHRISTIAN_COACH_CONFIG,
    // "adhd-coach": ADHD_COACH_CONFIG,
    // "autism": AUTISM_CONFIG,
};

// Helper function to get config by portal slug
export function getQuizConfig(portalSlug: string): QuizConfig | null {
    return QUIZ_CONFIGS[portalSlug] || null;
}

// Get default config for standalone quiz page
export function getDefaultQuizConfig(): QuizConfig {
    return FUNCTIONAL_MEDICINE_CONFIG;
}

