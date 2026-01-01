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

export function LessonHormonesGoneRogue({
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
            content: `{name}, now that you understand how hormones should work, let's talk about what happens when they go "rogue." 🚨`,
        },
        {
            id: 2,
            type: 'coach',
            content: `Millions of women suffer from hormonal imbalances without even knowing it. They think feeling terrible is just... normal.`,
        },
        {
            id: 3,
            type: 'system',
            content: `**Common Signs of Hormonal Imbalance**
• Severe PMS (mood swings, bloating, cramps)
• Irregular or painful periods
• Acne, especially along jawline
• Hair loss or excess facial hair
• Weight gain that won't budge
• Fatigue despite adequate sleep
• Brain fog and poor concentration
• Low libido
• Anxiety or depression`,
            systemStyle: 'info',
        },
        {
            id: 4,
            type: 'user-choice',
            content: `Have you or someone you know experienced any of these?`,
            choices: [
                "Yes, several of these sound familiar",
                "A few, but I thought they were normal",
                "I've definitely struggled with some",
            ],
            showReaction: true,
        },
        {
            id: 5,
            type: 'coach',
            content: `Let me introduce you to some common hormonal conditions that affect SO many women...`,
        },
        {
            id: 6,
            type: 'system',
            content: `**Estrogen Dominance**
When estrogen is too high relative to progesterone:
• Heavy, painful periods
• Breast tenderness
• Weight gain (hips & thighs)
• Fibroids, endometriosis
• Mood swings, anxiety

→ Often caused by: stress, poor liver function, xenoestrogens in plastics`,
            systemStyle: 'comparison',
        },
        {
            id: 7,
            type: 'system',
            content: `**PCOS (Polycystic Ovary Syndrome)**
Affects 1 in 10 women:
• Irregular or absent periods
• Excess facial hair (hirsutism)
• Acne
• Weight gain, especially belly
• Difficulty conceiving

→ Root cause: often insulin resistance`,
            systemStyle: 'comparison',
        },
        {
            id: 8,
            type: 'voice-note',
            content: `Here's something important: PCOS isn't just about the ovaries. It's a metabolic condition that affects the whole body. That's why diet and lifestyle changes can be so powerful for managing it.`,
            voiceDuration: '0:20',
        },
        {
            id: 9,
            type: 'system',
            content: `**Endometriosis**
Tissue similar to uterine lining grows outside the uterus:
• Severe period pain
• Pain during intercourse
• Heavy bleeding
• Fatigue
• Digestive issues

→ Affects 1 in 10 women, takes average 7 years to diagnose`,
            systemStyle: 'stats',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `What surprised you most about these conditions?`,
            choices: [
                "How common they are",
                "That they're connected to lifestyle",
                "That they take so long to diagnose",
            ],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `The good news? Many of these conditions can be significantly improved with the right approach - and that's what you're learning!`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Key Takeaway**
Hormonal imbalances are signals, not sentences.

They tell us something in the body needs support. By addressing root causes - stress, diet, gut health, toxins - we can often restore balance naturally.`,
            systemStyle: 'takeaway',
        },
        {
            id: 13,
            type: 'coach',
            content: `Module 1 complete! 🎉 In Module 2, we'll dive into how your gut, thyroid, and stress hormones connect to everything. This is where it gets really interesting!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="When Hormones Go Rogue"
            lessonSubtitle="Recognizing hormonal imbalances"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
