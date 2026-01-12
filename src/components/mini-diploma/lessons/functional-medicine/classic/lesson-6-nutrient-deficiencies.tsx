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
        {
            type: 'intro',
            content: `{name}! Today's topic might surprise you: NUTRIENT DEFICIENCIES in a world of abundance. How can people be deficient when food is everywhere? Let me explain...`,
        },
        {
            type: 'heading',
            content: 'The Modern Paradox',
        },
        {
            type: 'list',
            content: 'Why deficiencies are epidemic:',
            items: [
                'Overfed but undernourished - empty calories everywhere',
                'Soil depletion means less nutrients in our food',
                'Processed foods provide calories without nutrition',
                'Gut dysfunction impairs absorption',
                'Chronic stress depletes nutrients faster',
            ],
        },
        {
            type: 'heading',
            content: 'The Big 5 Deficiencies',
        },
        {
            type: 'text',
            content: `Studies show up to 70% of people are deficient in vitamin D and magnesium alone. Here are the most common deficiencies we see:`,
        },
        {
            type: 'list',
            content: 'Critical nutrients:',
            items: [
                'Vitamin D - Supports immune function, mood, and bone health (most need 2000-5000 IU)',
                'Magnesium - Involved in 300+ enzyme reactions, supports sleep and stress response',
                'Omega-3s - Anti-inflammatory, essential for brain health',
                'B vitamins - Required for energy production, detox, and methylation',
                'Zinc - Critical for immune function, hormones, and gut healing',
            ],
        },
        {
            type: 'callout',
            content: `Key insight: Many symptoms blamed on aging or "it's just stress" are actually correctable nutrient deficiencies! Low magnesium alone can cause muscle cramps, poor sleep, anxiety, constipation, and high blood pressure.`,
            style: 'tip',
        },
        {
            type: 'heading',
            content: 'Nutrient Thieves',
        },
        {
            type: 'text',
            content: `Beyond poor intake, many factors actively deplete our nutrient stores:`,
        },
        {
            type: 'list',
            content: 'What steals nutrients:',
            items: [
                'Chronic stress - Depletes B vitamins, magnesium, vitamin C',
                'Alcohol - Depletes B vitamins and zinc',
                'PPIs/Antacids - Impair B12, magnesium, and calcium absorption',
                'Metformin - Depletes B12',
                'Birth control - Depletes B vitamins, zinc, and magnesium',
            ],
        },
        {
            type: 'key-point',
            content: `This is why we can't just tell people to "eat healthy." We need to assess absorption capacity and depletion factors to truly optimize nutrient status.`,
        },
        {
            type: 'heading',
            content: 'Assessment & Optimization',
        },
        {
            type: 'list',
            content: 'The proper approach:',
            items: [
                'Test don\'t guess - Use blood tests and organic acids testing',
                'Food first, then targeted supplementation',
                'Address absorption issues - Fix the gut first!',
                'Consider genetic variations (MTHFR and others)',
                'Retest after 3 months to verify improvement',
            ],
        },
        {
            type: 'heading',
            content: 'Looking Ahead',
        },
        {
            type: 'text',
            content: `Next lesson: How to interpret functional lab testing to find the root cause. You'll learn why "normal" labs often miss the real problems and how to read between the lines.`,
        },
    ];

    const keyTakeaways = [
        'Modern people are often overfed but undernourished',
        'The big 5 deficiencies are: Vitamin D, Magnesium, Omega-3s, B vitamins, and Zinc',
        'Many symptoms attributed to aging are actually correctable deficiencies',
        'Medications and stress actively deplete nutrient stores',
        'Always test, address absorption, and retest after intervention',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Nutrient Deficiencies"
            lessonSubtitle="Hidden hunger in a world of plenty"
            totalLessons={totalLessons}
            sections={sections}
            keyTakeaways={keyTakeaways}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
            niche="functional-medicine"
            nicheLabel="Functional Medicine Diploma"
            baseUrl="/functional-medicine-diploma"
        />
    );
}
