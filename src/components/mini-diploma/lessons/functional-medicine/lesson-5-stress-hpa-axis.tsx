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

export function LessonStressHPA({
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
            content: `Hey {name}! 😰 Let's talk about the elephant in the room: CHRONIC STRESS.`,
        },
        {
            id: 2,
            type: 'coach',
            content: `Stress isn't just "in your head." It creates REAL physiological changes that wreck your health over time.`,
        },
        {
            id: 3,
            type: 'system',
            content: `**The HPA Axis**
• **H**ypothalamus (brain)
• **P**ituitary (brain)
• **A**drenal glands

This axis controls your stress response. When chronically activated, everything breaks down.`,
            systemStyle: 'info',
        },
        {
            id: 4,
            type: 'user-choice',
            content: `Which stress symptom resonates most with you?`,
            choices: [
                "Exhaustion but can't sleep",
                "Wired and tired",
                "Anxiety and overwhelm",
            ],
            showReaction: true,
        },
        {
            id: 5,
            type: 'coach',
            content: `These are all classic signs of HPA axis dysfunction. Most people call it "adrenal fatigue" but it's really a brain-adrenal communication problem.`,
        },
        {
            id: 6,
            type: 'system',
            content: `**Stages of HPA Dysfunction**
1. **Alarm** - High cortisol, feeling wired (fight or flight mode)
2. **Resistance** - Cortisol stays elevated, starting to feel tired
3. **Exhaustion** - Cortisol crashes, complete burnout

Most people are somewhere in stage 2-3.`,
            systemStyle: 'takeaway',
        },
        {
            id: 7,
            type: 'coach',
            content: `💡 Key insight: Chronic stress causes the body to "steal" hormone precursors from sex hormones to make more cortisol. This is the pregnenolone steal.`,
        },
        {
            id: 8,
            type: 'coach',
            content: `That's why stressed people often have hormone problems. You can't fix hormones without fixing stress!`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Cortisol's Downstream Effects**
• Raises blood sugar
• Suppresses immune function
• Breaks down muscle
• Increases belly fat storage
• Causes brain fog and memory issues
• Disrupts sleep`,
            systemStyle: 'info',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `What's the most surprising cortisol effect?`,
            choices: [
                "Belly fat storage",
                "Memory issues",
                "Immune suppression",
            ],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `All are common! This is why chronic stress is linked to almost every disease. It's not just "feeling stressed" - it's physical damage.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**HPA Axis Recovery Protocol**
• Sleep by 10pm (cortisol rhythm)
• Morning light exposure
• Adaptogenic herbs (ashwagandha, rhodiola)
• Nervous system downregulation (breathing, meditation)
• Blood sugar stability`,
            systemStyle: 'quote',
        },
        {
            id: 13,
            type: 'coach',
            content: `Recovery takes time - typically 3-6 months of consistent lifestyle changes. But it's absolutely possible!`,
        },
        {
            id: 14,
            type: 'coach',
            content: `Next lesson: Nutrient deficiencies - why even "healthy" people are often deficient. 🥗`,
        },
        {
            id: 15,
            type: 'coach',
            content: `You're doing fantastic, {name}! Keep going! 🔥`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Stress & The HPA Axis"
            lessonSubtitle="The burnout epidemic explained"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
