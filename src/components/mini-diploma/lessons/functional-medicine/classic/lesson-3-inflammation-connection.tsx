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

export function ClassicLessonInflammationConnection({
    lessonNumber,
    totalLessons = 9,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const sections: LessonSection[] = [
        // BRIDGE FROM LESSON 2
        {
            type: 'intro',
            content: `{name}, in the last lesson you learned that the gut is the foundation of health. But what happens when the gut breaks down? Or when stress becomes chronic? Or when we're overloaded with toxins? ONE thing: **Inflammation**. And not the obvious kind you can see...`,
        },

        // THE GAP
        {
            type: 'heading',
            content: 'The "Silent Killer" Nobody Talks About',
        },
        {
            type: 'text',
            content: `Heart disease. Diabetes. Alzheimer's. Cancer. Depression. Autoimmune conditions. What do they ALL have in common? Research now confirms they share ONE underlying driver: **chronic inflammation**.`,
        },
        {
            type: 'text',
            content: `The scary part? You can have chronic inflammation for a DECADE before it shows up as a "disease." This is why functional medicine catches problems 5-10 years before conventional medicine. We look for the smoke before the fire burns down the house.`,
        },

        // DEFINITION
        {
            type: 'definition',
            term: 'Chronic Inflammation',
            content: `Unlike acute inflammation (a cut healing, a fever fighting infection), chronic inflammation is a **low-grade, constant fire** that never fully turns off. It silently damages tissues for years before manifesting as disease. Think of it as a fire alarm stuck in the "ON" position 24/7.`,
        },

        // BEFORE-AFTER: Two Types
        {
            type: 'heading',
            content: 'Good Fire vs. Bad Fire',
        },
        {
            type: 'before-after',
            content: '',
            before: {
                title: 'Acute Inflammation (Good)',
                items: [
                    'Cut your finger → swells → heals',
                    'Catch a cold → fever → recovery',
                    'Sprain ankle → swelling → repair',
                    'Clear start, middle, and END',
                ],
            },
            after: {
                title: 'Chronic Inflammation (Bad)',
                items: [
                    'Low-grade, constant fire',
                    'No obvious trigger',
                    'Never fully "turns off"',
                    'Silently damages tissues for YEARS',
                ],
            },
        },

        // SIGNS
        {
            type: 'heading',
            content: 'Signs You\'ll Recognize in Every Client',
        },
        {
            type: 'text',
            content: `These symptoms are so common that most people think they're "normal aging." They're not. They're **fixable**:`,
        },
        {
            type: 'list',
            content: '',
            items: [
                '**Fatigue** that doesn\'t improve with sleep',
                '**Joint stiffness**, especially in the mornings',
                '**Brain fog** or memory issues',
                '**Unexplained weight gain** (especially belly fat)',
                '**Skin issues**, puffiness, bloating',
                '**Mood changes** - irritability, anxiety, depression',
            ],
        },
        {
            type: 'callout',
            content: `When a client comes to you with 3+ of these symptoms and their doctor says "labs are normal," chronic inflammation is almost always the culprit. You'll see this pattern constantly.`,
            style: 'tip',
        },

        // THE FRAMEWORK - 6 Triggers
        {
            type: 'heading',
            content: 'The 6 Inflammation Triggers',
        },
        {
            type: 'text',
            content: `Master these 6 triggers and you can help almost anyone reduce inflammation:`,
        },
        {
            type: 'framework',
            content: '',
            framework: {
                name: 'The 6 Fire Starters',
                steps: [
                    {
                        letter: '1',
                        title: 'Sugar & Refined Carbs',
                        description: 'Blood sugar spikes trigger inflammatory cascades. The average American eats 17 teaspoons of added sugar daily.',
                    },
                    {
                        letter: '2',
                        title: 'Seed Oils (Vegetable Oils)',
                        description: 'Canola, soybean, corn oil → Omega-6 overload. These are in almost every processed food.',
                    },
                    {
                        letter: '3',
                        title: 'Chronic Stress',
                        description: 'Cortisol dysregulation → immune suppression → inflammation. The body can\'t tell work stress from lion attack.',
                    },
                    {
                        letter: '4',
                        title: 'Poor Sleep',
                        description: 'Under 7 hours → inflammatory markers rise 40%. Sleep is when the body repairs and clears inflammation.',
                    },
                    {
                        letter: '5',
                        title: 'Gut Dysfunction',
                        description: 'Leaky gut → particles escape → immune system attacks → systemic inflammation. (You learned this!)',
                    },
                    {
                        letter: '6',
                        title: 'Toxin Exposure',
                        description: 'Heavy metals, mold, chemicals → body treats as threats → chronic inflammatory response.',
                    },
                ],
            },
        },
        {
            type: 'key-point',
            content: `Most people have **3-4 of these going at once**. That's why they feel terrible. Your job is to help them identify their personal triggers and address them systematically.`,
        },

        // CASE STUDY
        {
            type: 'heading',
            content: 'Real Client: Diane\'s "Normal Aging"',
        },
        {
            type: 'text',
            content: `Diane, 52, came to me after being told by 3 doctors that her symptoms were "just aging":`,
        },
        {
            type: 'list',
            content: '',
            items: [
                'Fatigue for 3+ years (labs "normal")',
                'Joint pain in hands and knees (worse every morning)',
                'Brain fog so bad she forgot appointments',
                'Gained 20 lbs in 2 years without changing diet',
                'Felt "puffy" and inflamed constantly',
            ],
        },
        {
            type: 'text',
            content: `I helped her identify her triggers: high sugar intake (she was eating "healthy" granola bars loaded with sugar), poor sleep (5-6 hours), and chronic work stress. We addressed all three systematically.`,
        },
        {
            type: 'key-point',
            content: `Results after 90 days: Joint pain reduced by 80%. Energy back to "like my 40s." Lost 12 lbs without dieting. Brain fog GONE. She told me: "My doctor asked what I was doing because my inflammatory markers dropped. I said, 'I'm working with a health coach.'"`,
        },

        // SCOPE OF PRACTICE
        {
            type: 'heading',
            content: 'Your Role: Educate, Don\'t Diagnose',
        },
        {
            type: 'before-after',
            content: '',
            before: {
                title: 'What Doctors Do',
                items: [
                    'Run inflammatory marker tests (CRP, ESR)',
                    'Diagnose autoimmune conditions',
                    'Prescribe anti-inflammatory medications',
                    'Rule out serious conditions',
                ],
            },
            after: {
                title: 'What You Do',
                items: [
                    'Educate on the 6 inflammation triggers',
                    'Help identify personal trigger patterns',
                    'Create anti-inflammatory meal plans',
                    'Guide lifestyle modifications',
                ],
            },
        },
        {
            type: 'callout',
            content: `The partnership model: Doctors diagnose and test. You educate and implement. Together, you help clients far better than either could alone. Many doctors actively REFER to coaches like us because they don't have time for lifestyle education.`,
            style: 'info',
        },

        // CHECK YOUR KNOWLEDGE
        {
            type: 'quiz',
            content: '',
            questions: [
                {
                    question: 'Which of the following is TRUE about chronic inflammation?',
                    options: [
                        'Chronic inflammation always shows visible symptoms like redness',
                        'Chronic inflammation is often "silent" and can persist for years',
                        'Chronic inflammation only affects one organ at a time',
                        'Chronic inflammation always causes fever',
                    ],
                    correctIndex: 1,
                    explanation: 'Chronic inflammation is called the "silent killer" because it can persist for years without obvious symptoms, slowly contributing to conditions like heart disease, diabetes, and autoimmune disorders.',
                },
                {
                    question: 'How many of the 6 inflammation triggers do most people have active at once?',
                    options: [
                        '1 trigger maximum',
                        '2 triggers',
                        '3-4 triggers',
                        'All 6 triggers',
                    ],
                    correctIndex: 2,
                    explanation: 'Most people have 3-4 inflammation triggers going at once (like poor diet + stress + bad sleep). This is why they feel terrible - multiple fires burning simultaneously.',
                },
            ],
        },

        // BRIDGE TO NEXT LESSON
        {
            type: 'heading',
            content: 'Coming Up: The Toxin Reality',
        },
        {
            type: 'text',
            content: `You just learned that toxin exposure is one of the 6 inflammation triggers. But here's the uncomfortable truth - we're ALL being exposed to toxins daily, whether we know it or not.`,
        },
        {
            type: 'callout',
            content: `Next up: **80,000+ synthetic chemicals** in our environment. Why most "detox" programs are useless (or dangerous). And how to safely support the body's natural detoxification pathways.`,
            style: 'tip',
        },
    ];

    const keyTakeaways = [
        '**Chronic inflammation** is the common thread in 80% of chronic diseases',
        'It can be "silent" for years before showing up as disease',
        'The **6 Triggers**: Sugar, Seed Oils, Stress, Poor Sleep, Gut Dysfunction, Toxins',
        'Most people have **3-4 triggers active** at once',
        'Signs: fatigue, joint stiffness, brain fog, weight gain, puffiness',
        'You educate on triggers and lifestyle; doctors diagnose and test',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Inflammation Connection"
            lessonSubtitle="The silent fire behind 80% of chronic disease"
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
