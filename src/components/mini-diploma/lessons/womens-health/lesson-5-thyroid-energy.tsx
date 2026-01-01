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

export function LessonThyroidEnergy({
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
            content: `{name}, let's talk about your thyroid - the butterfly-shaped gland that controls your entire metabolism! 🦋`,
        },
        {
            id: 2,
            type: 'coach',
            content: `Women are 5-8x more likely than men to have thyroid issues. And many go undiagnosed for YEARS because symptoms are dismissed as "just stress" or "aging."`,
        },
        {
            id: 3,
            type: 'system',
            content: `**What Your Thyroid Controls**
• Metabolism (how you burn calories)
• Body temperature
• Heart rate
• Energy levels
• Mood
• Hair, skin, and nail health
• Menstrual regularity
• Fertility`,
            systemStyle: 'info',
        },
        {
            id: 4,
            type: 'user-choice',
            content: `Do any of these thyroid symptoms sound familiar?`,
            choices: [
                "Fatigue despite sleeping enough",
                "Can't lose weight no matter what",
                "Feeling cold all the time",
            ],
            showReaction: true,
        },
        {
            id: 5,
            type: 'system',
            content: `**Hypothyroidism (Underactive Thyroid)**
• Fatigue, exhaustion
• Weight gain or can't lose weight
• Feeling cold
• Constipation
• Dry skin, brittle hair/nails
• Brain fog, depression
• Heavy or irregular periods

→ Affects 1 in 8 women in their lifetime`,
            systemStyle: 'comparison',
        },
        {
            id: 6,
            type: 'coach',
            content: `Here's the frustrating part: standard thyroid tests often miss the problem. Many doctors only test TSH, but that's not enough!`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Complete Thyroid Panel Should Include**
• TSH (often the only one tested)
• Free T4
• Free T3
• Reverse T3
• TPO Antibodies
• TG Antibodies

→ You may need to specifically request these!`,
            systemStyle: 'takeaway',
        },
        {
            id: 8,
            type: 'voice-note',
            content: `I've seen so many women told their thyroid is "fine" when it's not. Always ask for a complete panel, and look at optimal ranges, not just "normal" ranges. There's a big difference!`,
            voiceDuration: '0:20',
        },
        {
            id: 9,
            type: 'system',
            content: `**Thyroid-Supporting Nutrients**
• **Selenium** - Brazil nuts, fish
• **Iodine** - Seaweed, seafood
• **Zinc** - Pumpkin seeds, meat
• **Iron** - Crucial for T4 to T3 conversion
• **Vitamin D** - Most people are deficient!

→ Avoid: excess raw cruciferous vegetables, gluten (for some)`,
            systemStyle: 'exercise',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `What would you do with this thyroid information?`,
            choices: [
                "Get a full thyroid panel done",
                "Add more thyroid-supporting foods",
                "Help others understand their labs",
            ],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Remember: a sluggish thyroid affects your entire hormonal system. Supporting it can unlock improvements everywhere!`,
        },
        {
            id: 12,
            type: 'coach',
            content: `Next lesson: we're tackling stress and your adrenals - the hidden driver behind SO many hormonal problems. This one's crucial! 💪`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Thyroid & Energy"
            lessonSubtitle="Your metabolism master controller"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
