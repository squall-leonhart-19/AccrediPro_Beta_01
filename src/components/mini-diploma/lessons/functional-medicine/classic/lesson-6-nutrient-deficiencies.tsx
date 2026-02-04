"use client";

import { ClassicLessonBase, LessonSection } from "../../shared/classic-lesson-base";

interface LessonProps {
    lessonNumber: number;
    totalLessons?: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

export function ClassicLessonNutrientDeficiencies({
    lessonNumber,
    totalLessons = 9,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const sections: LessonSection[] = [
        // BRIDGE FROM LESSON 5
        {
            type: 'intro',
            content: `{name}, have you ever had labs come back "normal" when you KNEW something was wrong? Here's what most people don't realize: We're **overfed but undernourished**. Even people who "eat healthy" are often missing critical nutrients. This is one of the 5 root causes that gets overlooked constantly.`,
        },

        // THE GAP
        {
            type: 'heading',
            content: 'The Modern Paradox',
        },
        {
            type: 'list',
            content: '',
            items: [
                '**70%** of Americans are deficient in Vitamin D',
                '**80%** are deficient in Magnesium',
                'Up to **40%** are deficient in B12',
                'Meanwhile, eating **3,000+ calories daily**',
            ],
        },
        {
            type: 'text',
            content: `This isn't about eating MORE. It's about eating BETTER and absorbing what you eat. Modern food is nutritionally depleted. Soil is exhausted. Processing strips nutrients. Stress burns through what's left.`,
        },

        // DEFINITION
        {
            type: 'definition',
            term: 'Functional vs. Conventional Ranges',
            content: `Conventional lab ranges are designed to detect **disease** (like scurvy or rickets). Functional ranges are designed for **optimal health**. Someone can be "normal" by disease standards but **miserable** by optimization standards. This is why "normal" labs don't always mean healthy.`,
        },

        // THE BIG 5 FRAMEWORK
        {
            type: 'heading',
            content: 'The Big 5 Nutrient Deficiencies',
        },
        {
            type: 'text',
            content: `These 5 nutrients affect almost every symptom your clients will bring to you:`,
        },
        {
            type: 'framework',
            content: '',
            framework: {
                name: 'The Big 5 Deficiencies',
                steps: [
                    {
                        letter: 'D',
                        title: 'Vitamin D (The Hormone)',
                        description: '70% deficient. Optimal: 50-70 ng/mL (not the 30 "normal" cutoff). Affects immunity, mood, bones, hormones.',
                    },
                    {
                        letter: 'Mg',
                        title: 'Magnesium (The Relaxer)',
                        description: '80% deficient. Involved in 300+ reactions. Affects sleep, anxiety, muscle cramps, blood pressure. Stress depletes it rapidly.',
                    },
                    {
                        letter: 'B12',
                        title: 'B12 (The Energy)',
                        description: '40% deficient, especially over 50. Required for energy, brain function, nerve health. PPIs (acid blockers) destroy absorption.',
                    },
                    {
                        letter: 'Ω3',
                        title: 'Omega-3s (Anti-Inflammatory)',
                        description: 'Most Americans have 20:1 omega-6 to omega-3 ratio (should be 4:1). Critical for brain, heart, inflammation.',
                    },
                    {
                        letter: 'Zn',
                        title: 'Zinc (The Immune)',
                        description: 'Essential for immunity, gut healing, hormones, skin. Low zinc = frequent colds, slow healing, low testosterone.',
                    },
                ],
            },
        },

        // NUTRIENT THIEVES
        {
            type: 'heading',
            content: 'Nutrient Thieves: What\'s Depleting Your Clients',
        },
        {
            type: 'text',
            content: `This is critical for your intake process - always ask about medications and lifestyle:`,
        },
        {
            type: 'list',
            content: '',
            items: [
                '**STRESS** — Depletes B vitamins, magnesium, vitamin C, zinc',
                '**PPIs** (Prilosec, Nexium) — Destroys B12, magnesium, calcium absorption',
                '**METFORMIN** — Depletes B12 (80% of diabetics are deficient)',
                '**BIRTH CONTROL** — Depletes B vitamins, zinc, magnesium',
                '**ALCOHOL** — Depletes B vitamins, zinc, magnesium',
                '**SUGAR** — Depletes B vitamins, magnesium',
            ],
        },
        {
            type: 'callout',
            content: `A client on PPIs for 10 years is almost certainly B12 and magnesium deficient. A woman on birth control for a decade is likely depleted in multiple B vitamins. Their doctors probably never mentioned it.`,
            style: 'warning',
        },

        // CASE STUDY
        {
            type: 'heading',
            content: 'Real Client: Susan\'s "Normal" Labs',
        },
        {
            type: 'text',
            content: `Susan, 51, came to me after her doctor said her labs were "normal, you're just getting older." Her symptoms: exhausted, brain fog, muscle cramps every night, mood swings, thinning hair.`,
        },
        {
            type: 'before-after',
            content: '',
            before: {
                title: 'Conventional View ("Normal")',
                items: [
                    'Vitamin D: 32 ng/mL (range: 30-100) ✓',
                    'B12: 350 pg/mL (range: 200-900) ✓',
                    'Ferritin: 25 ng/mL (range: 12-150) ✓',
                ],
            },
            after: {
                title: 'Functional View (Optimal)',
                items: [
                    'Vitamin D: 32 → SUBOPTIMAL (want 50-70)',
                    'B12: 350 → LOW END (want 500-800)',
                    'Ferritin: 25 → LOW (want 50-100)',
                ],
            },
        },
        {
            type: 'key-point',
            content: `After 3 months of targeted nutrition support, Susan's energy returned, brain fog lifted, muscle cramps stopped. Same woman, optimized nutrients, **different life**. This is the power of functional vs. conventional thinking.`,
        },

        // SCOPE OF PRACTICE
        {
            type: 'heading',
            content: 'Your Role: Education, Not Prescription',
        },
        {
            type: 'before-after',
            content: '',
            before: {
                title: 'What Doctors Do',
                items: [
                    'Diagnose deficiency diseases (scurvy, rickets)',
                    'Order and interpret medical labs',
                    'Prescribe pharmaceutical treatments',
                ],
            },
            after: {
                title: 'What You Do',
                items: [
                    'Educate on nutrient roles in health',
                    'Suggest food sources of key nutrients',
                    'Discuss supplement options (not prescribe)',
                    'Help implement dietary changes',
                ],
            },
        },
        {
            type: 'callout',
            content: `The language matters. Say: "Many people find magnesium helpful for sleep - here's some research you might discuss with your doctor." You're educating, not prescribing. Totally within scope.`,
            style: 'info',
        },

        // CHECK YOUR KNOWLEDGE
        {
            type: 'quiz',
            content: '',
            questions: [
                {
                    question: 'Why are conventional "normal" lab ranges often insufficient for optimal health?',
                    options: [
                        'Conventional ranges are designed for elite athletes only',
                        'Conventional ranges detect disease, not optimal function',
                        'Conventional ranges are always too strict',
                        'There is no difference between conventional and functional ranges',
                    ],
                    correctIndex: 1,
                    explanation: 'Conventional lab ranges are designed to detect deficiency diseases (like scurvy), not to identify optimal health. Someone can be "normal" by disease standards but still feel terrible.',
                },
                {
                    question: 'Which medication commonly depletes B12, magnesium, and calcium?',
                    options: [
                        'Birth control',
                        'Metformin',
                        'PPIs (acid blockers like Prilosec)',
                        'Ibuprofen',
                    ],
                    correctIndex: 2,
                    explanation: 'PPIs (proton pump inhibitors) like Prilosec and Nexium destroy B12, magnesium, and calcium absorption. Long-term use creates significant deficiencies doctors often overlook.',
                },
            ],
        },

        // BRIDGE TO NEXT LESSON
        {
            type: 'heading',
            content: 'Coming Up: Client Attraction',
        },
        {
            type: 'text',
            content: `You now understand the 5 root causes of chronic disease: Gut, Inflammation, Toxins, Stress/HPA Axis, and Nutrients. You have real frameworks to help real people. Now let's talk about **finding your first clients**.`,
        },
        {
            type: 'callout',
            content: `Next lesson: How to find clients without paid ads. Why your story is your best marketing. And the simplest way to get started while you're still learning.`,
            style: 'tip',
        },
    ];

    const keyTakeaways = [
        'We\'re **overfed but undernourished** - even "healthy" eaters are deficient',
        'The **Big 5**: Vitamin D, Magnesium, B12, Omega-3s, Zinc',
        '**Conventional ranges** detect disease; **Functional ranges** detect optimal health',
        'Medications are major **Nutrient Thieves** - always ask about them',
        'You EDUCATE on nutrients; doctors DIAGNOSE and PRESCRIBE',
        'Optimizing nutrients can resolve symptoms doctors called "normal aging"',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Nutrient Deficiencies"
            lessonSubtitle="Why 'normal' labs don't mean healthy"
            totalLessons={totalLessons}
            sections={sections}
            keyTakeaways={keyTakeaways}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
            niche="functional-medicine"
            nicheLabel="Functional Medicine Diploma"
            baseUrl="/portal/functional-medicine"
            courseSlug="functional-medicine-complete-certification"
        />
    );
}
