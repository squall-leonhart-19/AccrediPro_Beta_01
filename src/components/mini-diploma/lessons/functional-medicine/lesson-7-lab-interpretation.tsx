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

export function LessonLabInterpretation({
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
            content: `{name}! 📊 Ready to learn what separates good practitioners from GREAT ones? Lab interpretation.`,
        },
        {
            id: 2,
            type: 'coach',
            content: `Doctors say "your labs are normal" while you still feel terrible. Here's why that happens...`,
        },
        {
            id: 3,
            type: 'system',
            content: `**"Normal" vs. Optimal**
• Lab ranges are based on sick populations
• "Normal" doesn't mean healthy
• Functional ranges are TIGHTER
• We catch dysfunction BEFORE it becomes disease`,
            systemStyle: 'info',
        },
        {
            id: 4,
            type: 'user-choice',
            content: `Have you or someone you know been told "labs are normal" while still symptomatic?`,
            choices: [
                "Yes - it's so frustrating!",
                "Multiple times",
                "This is exactly why I'm here",
            ],
            showReaction: true,
        },
        {
            id: 5,
            type: 'coach',
            content: `You're not alone! This is the #1 frustration I hear. The good news: functional ranges reveal what conventional ranges miss.`,
        },
        {
            id: 6,
            type: 'system',
            content: `**Example: TSH (Thyroid)**
• Conventional range: 0.5 - 4.5
• Functional optimal: 1.0 - 2.0

Someone at 3.5 is "normal" but their thyroid is already struggling. Symptoms appear long before the lab is flagged.`,
            systemStyle: 'takeaway',
        },
        {
            id: 7,
            type: 'coach',
            content: `💡 A skilled practitioner can see a train wreck coming 5-10 years before it becomes a diagnosis!`,
        },
        {
            id: 8,
            type: 'system',
            content: `**Key Functional Markers**
• **Fasting insulin** - Metabolic health (optimal <6)
• **HbA1c** - Blood sugar (optimal 4.8-5.2)
• **hsCRP** - Inflammation (optimal <1)
• **Vitamin D** - Immune, mood (optimal 50-80)
• **Homocysteine** - Methylation (optimal 6-8)`,
            systemStyle: 'info',
        },
        {
            id: 9,
            type: 'user-choice',
            content: `Which marker would you want to check first on yourself?`,
            choices: [
                "Fasting insulin - metabolic health",
                "hsCRP - inflammation",
                "Vitamin D - overall health",
            ],
            showReaction: true,
        },
        {
            id: 10,
            type: 'coach',
            content: `All great choices! In our full certification, you'll learn complete panels and how to read patterns, not just individual markers.`,
        },
        {
            id: 11,
            type: 'system',
            content: `**Pattern Recognition**
Don't just look at single markers. Look for PATTERNS:
• High inflammation + low vitamin D = immune dysfunction
• High fasting insulin + high triglycerides = metabolic syndrome developing
• Low ferritin + low B12 + GI symptoms = absorption issue`,
            systemStyle: 'quote',
        },
        {
            id: 12,
            type: 'coach',
            content: `This is the art of functional medicine - connecting the dots that others miss.`,
        },
        {
            id: 13,
            type: 'coach',
            content: `Next lesson: How to actually BUILD protocols for clients. The practical application! 🔧`,
        },
        {
            id: 14,
            type: 'coach',
            content: `Almost there, {name}! Two more lessons to go. You've got this! 🔥`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Functional Lab Interpretation"
            lessonSubtitle="Reading between the 'normal' lines"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
