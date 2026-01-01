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

export function LessonStressAdrenals({
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
            content: `{name}, this might be the most important lesson yet. Let's talk about stress and your adrenals! 🎯`,
        },
        {
            id: 2,
            type: 'coach',
            content: `Your adrenal glands sit on top of your kidneys and produce cortisol - your main stress hormone. When stress is chronic, EVERYTHING else falls apart.`,
        },
        {
            id: 3,
            type: 'system',
            content: `**The Cortisol Cascade**
When you're chronically stressed:

1. Adrenals pump out cortisol constantly
2. Body "steals" progesterone to make more cortisol
3. Estrogen becomes dominant
4. Thyroid slows down to conserve energy
5. Blood sugar becomes unstable
6. Sleep suffers → more stress → cycle continues`,
            systemStyle: 'info',
        },
        {
            id: 4,
            type: 'user-choice',
            content: `How would you rate your current stress levels?`,
            choices: [
                "Constantly stressed - it's my baseline",
                "Moderate - some days are harder than others",
                "I manage it okay but want to do better",
            ],
            showReaction: true,
        },
        {
            id: 5,
            type: 'coach',
            content: `Here's what most people don't realize: your body can't tell the difference between running from a tiger and running late for work. It responds the same way!`,
        },
        {
            id: 6,
            type: 'system',
            content: `**Signs of Adrenal Dysfunction**
• Exhausted but wired at night
• Need caffeine to function
• Afternoon energy crash (2-4pm)
• Crave salt or sugar
• Slow to recover from illness
• Irritable when hungry
• Brain fog
• Feeling overwhelmed easily`,
            systemStyle: 'comparison',
        },
        {
            id: 7,
            type: 'voice-note',
            content: `The term "adrenal fatigue" is controversial, but the symptoms are real. I prefer to call it HPA axis dysfunction. Your hypothalamus, pituitary, and adrenals get out of sync from chronic stress, and that affects everything.`,
            voiceDuration: '0:22',
        },
        {
            id: 8,
            type: 'system',
            content: `**Adrenal Recovery Strategies**
• **Sleep** - In bed by 10pm when possible
• **Blood sugar** - Eat protein with every meal
• **Caffeine** - Limit or eliminate temporarily
• **Exercise** - Lower intensity while recovering
• **Breathwork** - Activates parasympathetic nervous system
• **Boundaries** - Learning to say no`,
            systemStyle: 'takeaway',
        },
        {
            id: 9,
            type: 'user-choice',
            content: `Which stress-reducing practice could you commit to this week?`,
            choices: [
                "Better sleep schedule",
                "Reducing caffeine intake",
                "Daily breathing exercises",
            ],
            showReaction: true,
        },
        {
            id: 10,
            type: 'system',
            content: `**Quick Stress Reset: Box Breathing**
Do this when stressed:
• Breathe in for 4 counts
• Hold for 4 counts
• Breathe out for 4 counts
• Hold for 4 counts

→ Repeat 4 times. Takes 1 minute, works immediately!`,
            systemStyle: 'exercise',
        },
        {
            id: 11,
            type: 'coach',
            content: `Congratulations - you've completed Module 2! 🎉 You now understand the gut-hormone axis, thyroid, and adrenal connection.`,
        },
        {
            id: 12,
            type: 'coach',
            content: `Module 3 is all about taking action - food as medicine, life stage support, and your path forward. Let's go! 🌟`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Stress & Your Adrenals"
            lessonSubtitle="The hidden driver of hormonal imbalance"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
