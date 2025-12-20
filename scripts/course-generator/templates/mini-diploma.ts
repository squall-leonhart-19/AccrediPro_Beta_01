/**
 * Mini-Diploma Template (3 Modules, 9 Lessons)
 * Lead magnet / entry product - $27
 */

export interface MiniDiplomaConfig {
    nicheName: string;
    nicheSlug: string;
    category: string;
    categorySlug: string;
    targetAudience: string;
    keyBenefit: string;
    primaryProblem: string;
}

export interface LessonTemplate {
    title: string;
    description: string;
    duration: number; // seconds
    isFreePreview?: boolean;
}

export interface ModuleTemplate {
    title: string;
    description: string;
    lessons: LessonTemplate[];
}

export function generateMiniDiploma(config: MiniDiplomaConfig): {
    course: {
        title: string;
        slug: string;
        description: string;
        shortDescription: string;
        price: number;
        duration: number;
    };
    modules: ModuleTemplate[];
} {
    const { nicheName, nicheSlug, targetAudience, keyBenefit, primaryProblem } = config;

    return {
        course: {
            title: `${nicheName} Foundations Mini-Diploma`,
            slug: `${nicheSlug}-mini-diploma`,
            description: `Your introduction to ${nicheName}. In just 45 minutes, you'll understand the core principles, discover how ${nicheName} can transform ${targetAudience}, and earn your Mini-Diploma certificate. Perfect for anyone wanting to explore ${nicheName} before committing to the full certification.`,
            shortDescription: `3 modules • 9 lessons • 45 minutes • Mini-Diploma Certificate`,
            price: 27,
            duration: 2700, // 45 minutes in seconds
        },
        modules: [
            {
                title: `Module 1: Introduction to ${nicheName}`,
                description: `Discover what ${nicheName} is and why it's transforming the wellness industry`,
                lessons: [
                    {
                        title: `Welcome to Your ${nicheName} Journey`,
                        description: `Your path to becoming a certified ${nicheName} practitioner starts here`,
                        duration: 300,
                        isFreePreview: true,
                    },
                    {
                        title: `What is ${nicheName}?`,
                        description: `Understanding the core principles and philosophy of ${nicheName}`,
                        duration: 420,
                    },
                    {
                        title: `Why ${nicheName} Matters Now`,
                        description: `The growing demand for ${nicheName} practitioners and how ${primaryProblem} affects millions`,
                        duration: 360,
                    },
                ],
            },
            {
                title: `Module 2: Core Principles of ${nicheName}`,
                description: `Master the foundational concepts every ${nicheName} practitioner needs to know`,
                lessons: [
                    {
                        title: `The 5 Pillars of ${nicheName}`,
                        description: `The essential framework for understanding ${nicheName}`,
                        duration: 480,
                    },
                    {
                        title: `How ${nicheName} Helps ${targetAudience}`,
                        description: `Real-world applications and transformations through ${keyBenefit}`,
                        duration: 420,
                    },
                    {
                        title: `Common Myths Debunked`,
                        description: `Separating fact from fiction in ${nicheName}`,
                        duration: 360,
                    },
                ],
            },
            {
                title: `Module 3: Your Path Forward`,
                description: `Next steps to becoming a certified ${nicheName} practitioner`,
                lessons: [
                    {
                        title: `The ${nicheName} Practitioner Opportunity`,
                        description: `Career paths, income potential, and impact you can make`,
                        duration: 420,
                    },
                    {
                        title: `Your Certification Roadmap`,
                        description: `What to expect in the full ${nicheName} certification program`,
                        duration: 300,
                    },
                    {
                        title: `Mini-Diploma Assessment`,
                        description: `Complete your assessment and earn your Mini-Diploma certificate`,
                        duration: 0, // Quiz
                    },
                ],
            },
        ],
    };
}

// Sample configurations for different niches
export const SAMPLE_CONFIGS: Record<string, MiniDiplomaConfig> = {
    'gut-health': {
        nicheName: 'Gut Health',
        nicheSlug: 'gut-health',
        category: 'Gut Health',
        categorySlug: 'gut-health',
        targetAudience: 'women struggling with digestive issues',
        keyBenefit: 'restored gut health and vitality',
        primaryProblem: 'bloating, IBS, and digestive dysfunction',
    },
    'womens-hormone-health': {
        nicheName: "Women's Hormone Health",
        nicheSlug: 'womens-hormone-health',
        category: "Women's Health",
        categorySlug: 'womens-health',
        targetAudience: 'women experiencing hormonal imbalances',
        keyBenefit: 'balanced hormones and renewed energy',
        primaryProblem: 'fatigue, weight gain, and mood swings',
    },
    'narcissistic-abuse-recovery': {
        nicheName: 'Narcissistic Abuse Recovery',
        nicheSlug: 'narcissistic-abuse-recovery',
        category: 'Relationship Trauma',
        categorySlug: 'relationship-trauma',
        targetAudience: 'survivors of narcissistic abuse',
        keyBenefit: 'healing and reclaiming their identity',
        primaryProblem: 'trauma bonds and emotional manipulation',
    },
    'nervous-system-regulation': {
        nicheName: 'Nervous System Regulation',
        nicheSlug: 'nervous-system-regulation',
        category: 'Mental Health',
        categorySlug: 'mental-health',
        targetAudience: 'people struggling with anxiety and stress',
        keyBenefit: 'a calm, regulated nervous system',
        primaryProblem: 'chronic stress and dysregulation',
    },
};
