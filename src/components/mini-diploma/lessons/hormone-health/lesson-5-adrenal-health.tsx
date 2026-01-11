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

export function LessonAdrenalHealth({
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
            content: `Hey {name}! 👋 Welcome to lesson 5 - we're diving into adrenal health today. This is such an important topic because your adrenals are literally your stress-response headquarters. Ready to understand how stress affects your hormones?`,
        },
        {
            id: 2,
            type: 'system',
            content: `**Understanding Your Adrenal Glands**
• Two small glands sitting on top of your kidneys
• Produce over 50 different hormones including cortisol, adrenaline, and aldosterone
• Act as your body's built-in alarm system for stress
• Work closely with your hypothalamus and pituitary gland (HPA axis)
• Essential for energy, blood pressure, immune function, and stress response`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think of your adrenals like your body's emergency response team. They're amazing at handling acute stress - but problems arise when that emergency alarm never gets turned off. Sound familiar? 😅`,
        },
        {
            id: 4,
            type: 'system',
            content: `**The Cortisol Connection**
• Known as the 'stress hormone' but actually essential for life
• Should follow a natural rhythm: high in morning, low at night
• Helps regulate blood sugar, inflammation, and blood pressure
• Becomes problematic when chronically elevated
• Can suppress other hormones like thyroid, sex hormones, and growth hormone
• Affects mood, sleep, digestion, and immune function`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `When you're stressed, what's typically your first physical symptom?`,
            choices: ["Tension in shoulders/neck", "Stomach upset or digestive issues", "Sleep problems or fatigue"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Those physical symptoms are your body's way of communicating that your stress response system is working overtime. Let's look at what happens when this becomes chronic.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Stages of Adrenal Dysfunction**
• **Stage 1 - Alarm:** High cortisol, feeling 'wired but tired'
• **Stage 2 - Resistance:** Cortisol rhythm disrupted, energy crashes
• **Stage 3 - Exhaustion:** Low cortisol, chronic fatigue, burnout
• **Recovery:** Possible with proper support and lifestyle changes
• Note: 'Adrenal fatigue' isn't a medical diagnosis, but adrenal dysfunction is real`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'coach',
            content: `The good news? Your adrenals are incredibly resilient and can recover with the right support. It's not about eliminating stress completely - it's about changing how your body responds to it.`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Supporting Adrenal Health**
• **Sleep:** 7-9 hours, consistent bedtime routine
• **Nutrition:** Balanced blood sugar, adequate protein, limit caffeine
• **Movement:** Gentle exercise during recovery, avoid overtraining
• **Stress management:** Meditation, breathwork, boundaries
• **Supplements:** Adaptogenic herbs, B vitamins, vitamin C (with practitioner guidance)
• **Professional support:** Work with healthcare providers for testing and treatment`,
            systemStyle: 'takeaway',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `Which area feels most challenging for you to implement right now?`,
            choices: ["Getting consistent, quality sleep", "Managing daily stress levels", "Balancing nutrition and blood sugar"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Remember, healing your adrenals isn't a quick fix - it's a journey. Start with one small change and build from there. Your body wants to heal; sometimes it just needs the right environment.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Red Flags: When to Seek Help**
• Chronic fatigue that doesn't improve with rest
• Difficulty waking up or extreme afternoon crashes
• Anxiety, depression, or mood swings
• Frequent infections or slow healing
• Salt cravings or blood pressure changes
• Unexplained weight changes or difficulty losing weight`,
            systemStyle: 'info',
        },
        {
            id: 13,
            type: 'coach',
            content: `Amazing work getting through this lesson, {name}! 🌟 Next up in lesson 6, we're exploring thyroid health - another crucial piece of the hormone puzzle. You're building such valuable knowledge!`,
        },
        {
            id: 14,
            type: 'system',
            content: `**Key Takeaway**
• Your adrenals are designed to handle stress, but chronic activation disrupts your entire hormone system. Recovery is possible with consistent, gentle support that addresses sleep, nutrition, movement, and stress management. Small, sustainable changes create lasting healing.`,
            systemStyle: 'takeaway',
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Adrenal Health"
            lessonSubtitle="Stress, cortisol, and burnout"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
