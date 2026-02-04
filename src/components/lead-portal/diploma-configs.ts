import { DiplomaConfig } from "./LeadPortalDashboard";

// ASI Level 0 Resource Bundle - shared across all mini diplomas
const ASI_LEVEL_0_RESOURCES = [
    // Core Documents
    {
        id: "scope-boundaries",
        title: "Professional Scope & Boundaries",
        description: "Understanding your role as a Level 0 practitioner",
        url: "/documents/asi/core/scope-and-boundaries-level-0.html",
        pdfDownloadId: "scope-and-boundaries",
        pdfFilename: "Professional-Scope-Boundaries.pdf",
        type: "core" as const,
        icon: "Compass" as const,
    },
    {
        id: "practice-toolkit",
        title: "Level 0 Practice Toolkit",
        description: "Essential templates and worksheets for your practice",
        url: "/documents/asi/core/practice-toolkit-level-0.html",
        pdfDownloadId: "practice-toolkit",
        pdfFilename: "Level-0-Practice-Toolkit.pdf",
        type: "core" as const,
        icon: "FileText" as const,
    },
    {
        id: "pathways-guide",
        title: "ASI Certification Pathways Guide",
        description: "Your roadmap from Level 0 to full certification",
        url: "/documents/asi/core/pathways-progression-guide.html",
        pdfDownloadId: "pathways-guide",
        pdfFilename: "ASI-Certification-Pathways-Guide.pdf",
        type: "core" as const,
        icon: "Map" as const,
    },
    // Client Resources
    {
        id: "intake-snapshot",
        title: "Client Intake Snapshot",
        description: "First session essential information gathering",
        url: "/documents/asi/client-resources/client-intake-snapshot.html",
        pdfDownloadId: "client-intake",
        pdfFilename: "Client-Intake-Snapshot.pdf",
        type: "client" as const,
        icon: "Users" as const,
    },
    {
        id: "clarity-map",
        title: "Client Clarity Map",
        description: "Visual tool to understand what the client is experiencing",
        url: "/documents/asi/client-resources/client-clarity-map.html",
        pdfDownloadId: "clarity-map",
        pdfFilename: "Client-Clarity-Map.pdf",
        type: "client" as const,
        icon: "Target" as const,
    },
    {
        id: "support-circle",
        title: "Support Circle Builder",
        description: "Map out the client's existing support network",
        url: "/documents/asi/client-resources/support-circle-builder.html",
        pdfDownloadId: "support-circle",
        pdfFilename: "Support-Circle-Builder.pdf",
        type: "client" as const,
        icon: "Heart" as const,
    },
    {
        id: "goals-translation",
        title: "Goals Translation Sheet",
        description: "Convert vague goals into workable focus areas",
        url: "/documents/asi/client-resources/goals-translation-sheet.html",
        pdfDownloadId: "goals-translation",
        pdfFilename: "Goals-Translation-Sheet.pdf",
        type: "client" as const,
        icon: "Lightbulb" as const,
    },
    {
        id: "readiness-check",
        title: "Readiness for Support Check",
        description: "Assess if the client is ready to engage with support",
        url: "/documents/asi/client-resources/readiness-for-support-check.html",
        pdfDownloadId: "readiness-check",
        pdfFilename: "Readiness-for-Support-Check.pdf",
        type: "client" as const,
        icon: "CheckCircle" as const,
    },
    {
        id: "reflection-card",
        title: "Between-Sessions Reflection Card",
        description: "Simple card for client reflection between sessions",
        url: "/documents/asi/client-resources/between-sessions-reflection.html",
        pdfDownloadId: "reflection-card",
        pdfFilename: "Between-Sessions-Reflection-Card.pdf",
        type: "client" as const,
        icon: "MessageSquare" as const,
    },
];

// Export resources for use in other components
export { ASI_LEVEL_0_RESOURCES };

// Export resource type for type safety
export type ASIResource = typeof ASI_LEVEL_0_RESOURCES[number];

// Interactive Tools - unlock at specific modules
const INTERACTIVE_TOOLS = [
    {
        id: "income-calculator",
        title: "Income Calculator",
        description: "See your earning potential as a certified practitioner",
        url: "income-calculator", // relative to /portal/[slug]/tools/
        type: "tool" as const,
        icon: "Calculator" as const,
    },
    {
        id: "niche-scorecard",
        title: "Niche Scorecard",
        description: "Discover your perfect specialty with this quick quiz",
        url: "niche-scorecard",
        type: "tool" as const,
        icon: "Target" as const,
    },
];

export { INTERACTIVE_TOOLS };
export type InteractiveTool = typeof INTERACTIVE_TOOLS[number];

/**
 * Get interactive tools unlocked for a specific module
 * Module 1 (after L3): Income Calculator + Niche Scorecard
 */
export function getToolsForModule(moduleNum: 1 | 2 | 3): InteractiveTool[] {
    switch (moduleNum) {
        case 1:
            // Both tools unlock after Module 1
            return [INTERACTIVE_TOOLS[0], INTERACTIVE_TOOLS[1]];
        case 2:
        case 3:
            // No new tools for modules 2 and 3
            return [];
    }
}

/**
 * Get resources unlocked for a specific module
 * Module 1 (after L3): 2 resources (Scope & Intake)
 * Module 2 (after L6): 4 resources (Toolkit, Clarity, Support, Goals)
 * Module 3 (after L9): 3 resources (Pathways, Readiness, Reflection)
 */
export function getResourcesForModule(moduleNum: 1 | 2 | 3): ASIResource[] {
    switch (moduleNum) {
        case 1:
            // Scope & Boundaries + Client Intake Snapshot
            return [ASI_LEVEL_0_RESOURCES[0], ASI_LEVEL_0_RESOURCES[3]];
        case 2:
            // Practice Toolkit + Clarity Map + Support Circle + Goals Translation
            return [
                ASI_LEVEL_0_RESOURCES[1],
                ASI_LEVEL_0_RESOURCES[4],
                ASI_LEVEL_0_RESOURCES[5],
                ASI_LEVEL_0_RESOURCES[6]
            ];
        case 3:
            // Pathways Guide + Readiness Check + Reflection Card
            return [
                ASI_LEVEL_0_RESOURCES[2],
                ASI_LEVEL_0_RESOURCES[7],
                ASI_LEVEL_0_RESOURCES[8]
            ];
    }
}


/**
 * Get total unlocked resources after completing a module
 */
export function getTotalUnlockedAfterModule(moduleNum: 1 | 2 | 3): number {
    switch (moduleNum) {
        case 1: return 2;
        case 2: return 6;
        case 3: return 9;
    }
}

// Configuration for all mini diploma portals
export const DIPLOMA_CONFIGS: Record<string, DiplomaConfig> = {
    "functional-medicine-diploma": {
        slug: "functional-medicine-diploma",
        portalSlug: "functional-medicine",
        name: "Functional Medicine Certification",
        shortName: "Functional Medicine",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Foundations",
                description: "Core principles of functional medicine",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "Root Cause Medicine", duration: "8 min" },
                    { id: 2, title: "The Gut Foundation", duration: "7 min" },
                    { id: 3, title: "The Inflammation Connection", duration: "6 min" },
                ],
            },
            {
                id: 2,
                title: "Core Concepts",
                description: "Deep dive into key mechanisms",
                icon: "Target",
                lessons: [
                    { id: 4, title: "The Toxin Burden", duration: "7 min" },
                    { id: 5, title: "Stress & The HPA Axis", duration: "8 min" },
                    { id: 6, title: "Nutrient Deficiencies", duration: "6 min" },
                ],
            },
            {
                id: 3,
                title: "Application",
                description: "Putting it all into practice",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Functional Lab Interpretation", duration: "9 min" },
                    { id: 8, title: "Building Protocols", duration: "8 min" },
                    { id: 9, title: "Your Next Step", duration: "5 min" },
                ],
            },
        ],
        resources: ASI_LEVEL_0_RESOURCES,
    },
    "womens-health-diploma": {
        slug: "womens-health-diploma",
        name: "Women's Health Certification",
        shortName: "Women's Health",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Hormone Foundations",
                description: "Understanding the female hormone system",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "The Hormone Symphony", duration: "8 min" },
                    { id: 2, title: "Estrogen & Progesterone", duration: "7 min" },
                    { id: 3, title: "The Menstrual Cycle", duration: "7 min" },
                ],
            },
            {
                id: 2,
                title: "Life Stages",
                description: "Hormones through the decades",
                icon: "Target",
                lessons: [
                    { id: 4, title: "Perimenopause Essentials", duration: "8 min" },
                    { id: 5, title: "Menopause Mastery", duration: "8 min" },
                    { id: 6, title: "Post-Menopause Thriving", duration: "6 min" },
                ],
            },
            {
                id: 3,
                title: "Practical Application",
                description: "Working with real clients",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Nutrition for Hormones", duration: "9 min" },
                    { id: 8, title: "Lifestyle Protocols", duration: "8 min" },
                    { id: 9, title: "Your Coaching Practice", duration: "6 min" },
                ],
            },
        ],
        resources: ASI_LEVEL_0_RESOURCES,
    },
    "womens-hormone-health-diploma": {
        slug: "womens-hormone-health-diploma",
        name: "Women's Hormone Health Certification",
        shortName: "Women's Hormone Health",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Hormone Foundations",
                description: "Understanding the female hormone system",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "The Hormone Symphony", duration: "8 min" },
                    { id: 2, title: "Estrogen & Progesterone", duration: "7 min" },
                    { id: 3, title: "The Menstrual Cycle", duration: "7 min" },
                ],
            },
            {
                id: 2,
                title: "Life Stages & Transitions",
                description: "Hormones through the decades",
                icon: "Target",
                lessons: [
                    { id: 4, title: "Perimenopause Essentials", duration: "8 min" },
                    { id: 5, title: "Menopause Mastery", duration: "8 min" },
                    { id: 6, title: "Post-Menopause Thriving", duration: "6 min" },
                ],
            },
            {
                id: 3,
                title: "Practical Application",
                description: "Working with real clients",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Nutrition for Hormones", duration: "9 min" },
                    { id: 8, title: "Lifestyle Protocols", duration: "8 min" },
                    { id: 9, title: "Your Coaching Practice", duration: "6 min" },
                ],
            },
        ],
        resources: ASI_LEVEL_0_RESOURCES,
    },
    "gut-health-diploma": {
        slug: "gut-health-diploma",
        name: "Gut Health Certification",
        shortName: "Gut Health",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Gut Foundations",
                description: "Understanding the digestive system",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "The Gut-Brain Connection", duration: "8 min" },
                    { id: 2, title: "Microbiome Basics", duration: "7 min" },
                    { id: 3, title: "Leaky Gut Explained", duration: "7 min" },
                ],
            },
            {
                id: 2,
                title: "Core Protocols",
                description: "Healing the gut naturally",
                icon: "Target",
                lessons: [
                    { id: 4, title: "The 5R Protocol", duration: "9 min" },
                    { id: 5, title: "Elimination Diets", duration: "7 min" },
                    { id: 6, title: "Probiotics & Prebiotics", duration: "6 min" },
                ],
            },
            {
                id: 3,
                title: "Client Work",
                description: "Applying protocols with clients",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Gut Testing Interpretation", duration: "8 min" },
                    { id: 8, title: "Personalized Protocols", duration: "8 min" },
                    { id: 9, title: "Building Your Practice", duration: "5 min" },
                ],
            },
        ],
        resources: ASI_LEVEL_0_RESOURCES,
    },
    "hormone-health-diploma": {
        slug: "hormone-health-diploma",
        name: "Hormone Health Certification",
        shortName: "Hormone Health",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Hormone Basics",
                description: "The endocrine system explained",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "The Endocrine System", duration: "8 min" },
                    { id: 2, title: "Key Hormone Players", duration: "7 min" },
                    { id: 3, title: "Hormone Imbalance Signs", duration: "7 min" },
                ],
            },
            {
                id: 2,
                title: "Hormone Optimization",
                description: "Natural hormone balancing",
                icon: "Target",
                lessons: [
                    { id: 4, title: "Thyroid Health", duration: "9 min" },
                    { id: 5, title: "Adrenal Function", duration: "8 min" },
                    { id: 6, title: "Blood Sugar Balance", duration: "6 min" },
                ],
            },
            {
                id: 3,
                title: "Practitioner Skills",
                description: "Working with hormone clients",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Hormone Testing", duration: "8 min" },
                    { id: 8, title: "Protocol Development", duration: "8 min" },
                    { id: 9, title: "Your Next Steps", duration: "5 min" },
                ],
            },
        ],
        resources: ASI_LEVEL_0_RESOURCES,
    },
    "holistic-nutrition-diploma": {
        slug: "holistic-nutrition-diploma",
        name: "Holistic Nutrition Certification",
        shortName: "Holistic Nutrition",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Nutrition Foundations",
                description: "The science of whole foods nutrition",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "Whole Foods Philosophy", duration: "8 min" },
                    { id: 2, title: "Macronutrient Balance", duration: "7 min" },
                    { id: 3, title: "Micronutrient Essentials", duration: "7 min" },
                ],
            },
            {
                id: 2,
                title: "Therapeutic Nutrition",
                description: "Food as medicine approaches",
                icon: "Target",
                lessons: [
                    { id: 4, title: "Anti-Inflammatory Eating", duration: "8 min" },
                    { id: 5, title: "Detoxification Support", duration: "7 min" },
                    { id: 6, title: "Blood Sugar Protocols", duration: "7 min" },
                ],
            },
            {
                id: 3,
                title: "Client Practice",
                description: "Building your nutrition practice",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Nutrition Assessment", duration: "9 min" },
                    { id: 8, title: "Meal Planning Mastery", duration: "8 min" },
                    { id: 9, title: "Growing Your Practice", duration: "5 min" },
                ],
            },
        ],
        resources: ASI_LEVEL_0_RESOURCES,
    },
    "nurse-coach-diploma": {
        slug: "nurse-coach-diploma",
        name: "Nurse Coach Certification",
        shortName: "Nurse Coach",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Coaching Foundations",
                description: "From nurse to coach mindset shift",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "The Nurse Coach Model", duration: "8 min" },
                    { id: 2, title: "Coaching vs. Nursing", duration: "7 min" },
                    { id: 3, title: "Your Unique Value", duration: "6 min" },
                ],
            },
            {
                id: 2,
                title: "Coaching Skills",
                description: "Essential coaching techniques",
                icon: "Target",
                lessons: [
                    { id: 4, title: "Active Listening", duration: "8 min" },
                    { id: 5, title: "Powerful Questions", duration: "7 min" },
                    { id: 6, title: "Goal Setting with Clients", duration: "7 min" },
                ],
            },
            {
                id: 3,
                title: "Business Building",
                description: "Starting your coaching practice",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Finding Your Niche", duration: "8 min" },
                    { id: 8, title: "Pricing & Packages", duration: "8 min" },
                    { id: 9, title: "Getting First Clients", duration: "6 min" },
                ],
            },
        ],
        resources: ASI_LEVEL_0_RESOURCES,
    },
    "health-coach-diploma": {
        slug: "health-coach-diploma",
        name: "Health Coach Certification",
        shortName: "Health Coaching",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Coaching Essentials",
                description: "Foundation of health coaching",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "What is Health Coaching?", duration: "7 min" },
                    { id: 2, title: "Behavior Change Science", duration: "8 min" },
                    { id: 3, title: "The Coaching Conversation", duration: "7 min" },
                ],
            },
            {
                id: 2,
                title: "Health Domains",
                description: "Key areas of health coaching",
                icon: "Target",
                lessons: [
                    { id: 4, title: "Nutrition Coaching", duration: "8 min" },
                    { id: 5, title: "Movement & Exercise", duration: "7 min" },
                    { id: 6, title: "Stress & Sleep", duration: "7 min" },
                ],
            },
            {
                id: 3,
                title: "Building Your Practice",
                description: "Launch your coaching business",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Your Coaching Niche", duration: "8 min" },
                    { id: 8, title: "Client Sessions", duration: "9 min" },
                    { id: 9, title: "Marketing Yourself", duration: "6 min" },
                ],
            },
        ],
        resources: ASI_LEVEL_0_RESOURCES,
    },
    "spiritual-healing-diploma": {
        slug: "spiritual-healing-diploma",
        name: "Spiritual Healing Certification",
        shortName: "Spiritual Healing",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Healing Foundations",
                description: "Core principles of spiritual healing",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "Foundations of Spiritual Healing", duration: "8 min" },
                    { id: 2, title: "Energy Systems & Chakras", duration: "7 min" },
                    { id: 3, title: "Mind-Body-Spirit Connection", duration: "7 min" },
                ],
            },
            {
                id: 2,
                title: "Healing Techniques",
                description: "Practical healing methods",
                icon: "Target",
                lessons: [
                    { id: 4, title: "Meditation & Breathwork Techniques", duration: "8 min" },
                    { id: 5, title: "Healing Touch & Energy Transfer", duration: "7 min" },
                    { id: 6, title: "Spiritual Assessment Methods", duration: "7 min" },
                ],
            },
            {
                id: 3,
                title: "Building Your Practice",
                description: "Creating a healing practice",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Client Sessions & Sacred Space", duration: "8 min" },
                    { id: 8, title: "Ethics & Building Your Practice", duration: "8 min" },
                    { id: 9, title: "Your Next Step", duration: "5 min" },
                ],
            },
        ],
        resources: ASI_LEVEL_0_RESOURCES,
    },
    "energy-healing-diploma": {
        slug: "energy-healing-diploma",
        name: "Energy Healing Certification",
        shortName: "Energy Healing",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Energy Foundations",
                description: "Core principles of energy healing",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "Foundations of Energy Healing", duration: "8 min" },
                    { id: 2, title: "The Human Energy Field", duration: "7 min" },
                    { id: 3, title: "Chakra Systems & Energy Centers", duration: "7 min" },
                ],
            },
            {
                id: 2,
                title: "Healing Techniques",
                description: "Practical energy healing methods",
                icon: "Target",
                lessons: [
                    { id: 4, title: "Grounding & Protection Techniques", duration: "8 min" },
                    { id: 5, title: "Energy Assessment & Scanning", duration: "7 min" },
                    { id: 6, title: "Hands-On Healing Methods", duration: "7 min" },
                ],
            },
            {
                id: 3,
                title: "Building Your Practice",
                description: "Creating a healing practice",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Distance Healing Practices", duration: "8 min" },
                    { id: 8, title: "Ethics & Client Boundaries", duration: "8 min" },
                    { id: 9, title: "Your Next Step", duration: "5 min" },
                ],
            },
        ],
        resources: ASI_LEVEL_0_RESOURCES,
    },
    "christian-coaching-diploma": {
        slug: "christian-coaching-diploma",
        name: "Christian Life Coach Certification",
        shortName: "Christian Coaching",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Biblical Foundations",
                description: "Coaching rooted in Scripture",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "Biblical Foundations of Coaching", duration: "8 min" },
                    { id: 2, title: "Spirit-Led Listening", duration: "7 min" },
                    { id: 3, title: "Identity in Christ", duration: "7 min" },
                ],
            },
            {
                id: 2,
                title: "Transformation Skills",
                description: "Faith-based coaching techniques",
                icon: "Target",
                lessons: [
                    { id: 4, title: "Transformational Questions", duration: "8 min" },
                    { id: 5, title: "Overcoming Limiting Beliefs", duration: "7 min" },
                    { id: 6, title: "Purpose & Calling Discovery", duration: "7 min" },
                ],
            },
            {
                id: 3,
                title: "Ministry & Practice",
                description: "Building your coaching ministry",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Faith-Based Goal Setting", duration: "8 min" },
                    { id: 8, title: "Ministry & Business Ethics", duration: "8 min" },
                    { id: 9, title: "Launching Your Ministry", duration: "5 min" },
                ],
            },
        ],
        resources: ASI_LEVEL_0_RESOURCES,
    },
    "reiki-healing-diploma": {
        slug: "reiki-healing-diploma",
        name: "Reiki Practitioner Certification",
        shortName: "Reiki Healing",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Reiki Foundations",
                description: "History and principles of Reiki",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "Foundations of Reiki", duration: "8 min" },
                    { id: 2, title: "The Human Energy System", duration: "7 min" },
                    { id: 3, title: "Connecting to Universal Energy", duration: "7 min" },
                ],
            },
            {
                id: 2,
                title: "Reiki Practice",
                description: "Hands-on healing techniques",
                icon: "Target",
                lessons: [
                    { id: 4, title: "Hand Positions & Techniques", duration: "9 min" },
                    { id: 5, title: "Self-Healing Practice", duration: "7 min" },
                    { id: 6, title: "Working with Clients", duration: "7 min" },
                ],
            },
            {
                id: 3,
                title: "Advanced Practice",
                description: "Building your Reiki practice",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Distance Reiki", duration: "8 min" },
                    { id: 8, title: "Ethics & Building Your Practice", duration: "8 min" },
                    { id: 9, title: "Your Next Step", duration: "5 min" },
                ],
            },
        ],
        resources: ASI_LEVEL_0_RESOURCES,
    },
    "adhd-coaching-diploma": {
        slug: "adhd-coaching-diploma",
        name: "ADHD Coach Certification",
        shortName: "ADHD Coaching",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "ADHD Foundations",
                description: "Understanding the ADHD brain",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "Understanding ADHD", duration: "8 min" },
                    { id: 2, title: "The ADHD Brain", duration: "7 min" },
                    { id: 3, title: "Executive Function & Self-Regulation", duration: "7 min" },
                ],
            },
            {
                id: 2,
                title: "Coaching Skills",
                description: "Practical strategies for ADHD",
                icon: "Target",
                lessons: [
                    { id: 4, title: "Time Management & Organization", duration: "8 min" },
                    { id: 5, title: "Emotional Regulation Strategies", duration: "7 min" },
                    { id: 6, title: "Building Habits That Stick", duration: "7 min" },
                ],
            },
            {
                id: 3,
                title: "Client Work",
                description: "Building your ADHD coaching practice",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Coaching Adults with ADHD", duration: "8 min" },
                    { id: 8, title: "Working with Parents of ADHD Kids", duration: "8 min" },
                    { id: 9, title: "Your Next Step", duration: "5 min" },
                ],
            },
        ],
        resources: ASI_LEVEL_0_RESOURCES,
    },
    "pet-nutrition-diploma": {
        slug: "pet-nutrition-diploma",
        name: "Pet Nutrition Specialist Certification",
        shortName: "Pet Nutrition",
        coachName: "Sarah",
        coachImage: "/coaches/sarah-coach.webp",
        modules: [
            {
                id: 1,
                title: "Nutrition Foundations",
                description: "Core principles of pet nutrition",
                icon: "BookOpen",
                lessons: [
                    { id: 1, title: "Pet Nutrition Foundations", duration: "8 min" },
                    { id: 2, title: "Understanding Pet Food Labels", duration: "7 min" },
                    { id: 3, title: "Species-Appropriate Diets", duration: "7 min" },
                ],
            },
            {
                id: 2,
                title: "Health Optimization",
                description: "Supporting pet health through nutrition",
                icon: "Target",
                lessons: [
                    { id: 4, title: "Common Nutritional Deficiencies", duration: "8 min" },
                    { id: 5, title: "Natural Supplements for Pets", duration: "7 min" },
                    { id: 6, title: "Weight Management Strategies", duration: "7 min" },
                ],
            },
            {
                id: 3,
                title: "Building Your Practice",
                description: "Becoming a pet nutrition specialist",
                icon: "Award",
                lessons: [
                    { id: 7, title: "Life Stage Nutrition", duration: "8 min" },
                    { id: 8, title: "Treating Health Issues with Diet", duration: "8 min" },
                    { id: 9, title: "Your Next Step", duration: "5 min" },
                ],
            },
        ],
        resources: ASI_LEVEL_0_RESOURCES,
    },
};
