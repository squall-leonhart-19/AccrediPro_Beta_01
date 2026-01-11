"use client";

import { LessonBase, Message } from "../shared/lesson-base";

interface LessonProps {
    lessonNumber: number;
    totalLessons?: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

export function LessonNutrientDeficiencies({
    lessonNumber,
    totalLessons = 9,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const messages: Message[] = [
        {
            id: 1,
            type: 'coach',
            content: `{name}! 🥗 Today's topic might surprise you: NUTRIENT DEFICIENCIES in a world of abundance.`,
        },
        {
            id: 2,
            type: 'coach',
            content: `How can people be deficient when food is everywhere? Let me explain...`,
        },
        {
            id: 3,
            type: 'system',
            content: `**The Modern Paradox**
• Overfed but undernourished
• Soil depletion = less nutrients in food
• Processed foods = empty calories
• Gut dysfunction = poor absorption
• Stress = depletes nutrients faster`,
            systemStyle: 'info',
        },
        {
            id: 4,
            type: 'user-choice',
            content: `Which common deficiency have you heard about?`,
            choices: [
                "Vitamin D - the sunshine vitamin",
                "Magnesium - the relaxation mineral",
                "B12 - the energy vitamin",
            ],
            showReaction: true,
        },
        {
            id: 5,
            type: 'coach',
            content: `All three are EPIDEMIC! Studies show up to 70% of people are deficient in vitamin D and magnesium.`,
        },
        {
            id: 6,
            type: 'system',
            content: `**The Big 5 Deficiencies**
1. **Vitamin D** - Immune, mood, bones (most people need 2000-5000 IU)
2. **Magnesium** - 300+ enzyme reactions, sleep, stress
3. **Omega-3s** - Anti-inflammatory, brain health
4. **B vitamins** - Energy, detox, methylation
5. **Zinc** - Immune, hormones, gut healing`,
            systemStyle: 'takeaway',
        },
        {
            id: 7,
            type: 'coach',
            content: `💡 Key insight: Many symptoms blamed on aging or "it's just stress" are actually correctable nutrient deficiencies!`,
        },
        {
            id: 8,
            type: 'coach',
            content: `Low magnesium alone can cause: muscle cramps, poor sleep, anxiety, constipation, high blood pressure, and more.`,
        },
        {
            id: 9,
            type: 'user-choice',
            content: `What depletes nutrients the fastest?`,
            choices: [
                "Chronic stress",
                "Medications (like antacids, metformin)",
                "Both are major thieves!",
            ],
            showReaction: true,
        },
        {
            id: 10,
            type: 'system',
            content: `**Nutrient Thieves**
• Stress → depletes B vitamins, magnesium, vitamin C
• Alcohol → depletes B vitamins, zinc
• PPIs/Antacids → B12, magnesium, calcium absorption
• Metformin → B12
• Birth control → B vitamins, zinc, magnesium`,
            systemStyle: 'info',
        },
        {
            id: 11,
            type: 'coach',
            content: `This is why we can't just tell people to "eat healthy." We need to assess absorption and depletion factors!`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Assessment & Optimization**
• Test don't guess (blood tests, organic acids)
• Food first, then targeted supplements
• Address absorption (fix gut first!)
• Consider genetic variations (MTHFR, etc.)
• Retest after 3 months`,
            systemStyle: 'quote',
        },
        {
            id: 13,
            type: 'coach',
            content: `Next lesson: How to interpret functional lab testing to find the root cause. 📊`,
        },
        {
            id: 14,
            type: 'coach',
            content: `You're over halfway done, {name}! This knowledge is powerful. See you in Lesson 7! 💪`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Nutrient Deficiencies"
            lessonSubtitle="Hidden hunger in a world of plenty"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
