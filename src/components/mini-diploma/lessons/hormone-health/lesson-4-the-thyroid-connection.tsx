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

export function LessonTheThyroidConnection({
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
            content: `Hey {name}! 🎯 Welcome to lesson 4 - we're diving deep into your thyroid today. This little butterfly-shaped gland is literally controlling your metabolism right now as you read this!`,
        },
        {
            id: 2,
            type: 'system',
            content: `**What Is Your Thyroid?**
• Small butterfly-shaped gland in your neck
• Your body's metabolic control center
• Produces hormones T3 and T4 that affect every cell
• Regulates heart rate, body temperature, and energy production
• Controls how fast or slow your body burns calories`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think of your thyroid as the gas pedal for your entire body, {name}. When it's working perfectly, you feel energized and your weight stays stable. But when it's off... well, that's when things get tricky.`,
        },
        {
            id: 4,
            type: 'system',
            content: `**The Two Main Thyroid Hormones**
• **T4 (Thyroxine)**: The storage form - about 90% of thyroid production
• **T3 (Triiodothyronine)**: The active form - 3-4 times more potent than T4
• T4 must be converted to T3 in your liver, kidneys, and other tissues
• Poor conversion = thyroid symptoms even with 'normal' lab values`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `Which of these symptoms might indicate your thyroid needs attention?`,
            choices: ["Unexplained weight gain and feeling cold all the time", "Anxiety, rapid heartbeat, and difficulty sleeping", "Both of the above could be thyroid-related"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Exactly right, {name}! Your thyroid can swing both ways - too slow (hypothyroid) OR too fast (hyperthyroid). Most people only think about the 'slow' side, but both directions cause real problems.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Hypothyroid vs Hyperthyroid Symptoms**
• **Hypothyroid (underactive)**: Weight gain, fatigue, cold hands/feet, brain fog, constipation, dry skin
• **Hyperthyroid (overactive)**: Weight loss, anxiety, rapid heartbeat, insomnia, frequent bowel movements
• **Both can cause**: Hair loss, irregular periods, mood changes, difficulty concentrating`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'coach',
            content: `Here's what most doctors don't tell you - your thyroid doesn't work in isolation. It's constantly talking to your adrenals, ovaries, and even your gut bacteria!`,
        },
        {
            id: 9,
            type: 'system',
            content: `**What Disrupts Thyroid Function**
• Chronic stress (elevates cortisol which blocks T3)
• Nutrient deficiencies: iodine, selenium, zinc, tyrosine
• Gut dysfunction and inflammation
• Environmental toxins (especially fluoride and chlorine)
• Autoimmune conditions like Hashimoto's
• Certain medications and excessive soy consumption`,
            systemStyle: 'takeaway',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `What's the most comprehensive way to assess your thyroid function?`,
            choices: ["Just test TSH - that's what most doctors do", "Test TSH, T4, and T3 for a complete picture", "Test TSH, T4, T3, reverse T3, and thyroid antibodies"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `You're learning to think like a hormone detective, {name}! 🕵️‍♀️ The full panel tells the complete story - not just whether your thyroid is 'working' but HOW well and if your body is actually using those hormones.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Supporting Your Thyroid Naturally**
• Eat selenium-rich foods (Brazil nuts, sardines)
• Include iodine sources (sea vegetables, Celtic sea salt)
• Manage stress to protect T3 conversion
• Support gut health with fiber and probiotics
• Avoid excessive raw cruciferous vegetables
• Consider morning light exposure to support circadian rhythm`,
            systemStyle: 'takeaway',
        },
        {
            id: 13,
            type: 'system',
            content: `"The thyroid gland is the conductor of the metabolic orchestra. When it's out of tune, the whole symphony suffers." - Functional Medicine Principle`,
            systemStyle: 'quote',
        },
        {
            id: 14,
            type: 'coach',
            content: `Remember {name}, your thyroid responds beautifully to the right support. Small changes in nutrition and lifestyle can make a huge difference in how you feel every single day.`,
        },
        {
            id: 15,
            type: 'coach',
            content: `Next up in lesson 5, we're exploring your adrenal glands - your stress response headquarters. You'll discover why 'adrenal fatigue' isn't the whole story and what's really happening when stress hormones go haywire. See you there! 💪`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Thyroid Connection"
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
