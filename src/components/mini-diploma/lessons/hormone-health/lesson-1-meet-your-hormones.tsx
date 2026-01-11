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

export function LessonMeetYourHormones({
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
            content: `Hey {name}! Welcome to your hormone health journey! 🌟 I'm Coach Sarah, and I'm so excited to guide you through this fascinating world of hormones. Think of me as your friendly companion who's here to make complex science feel simple and actionable.`,
        },
        {
            id: 2,
            type: 'coach',
            content: `Before we dive in, let me ask you something: Have you ever wondered why you feel energized some days and completely drained others? Or why your mood can shift seemingly out of nowhere? The answer often lies with your hormones - these incredible chemical messengers that orchestrate so much of how you feel and function.`,
        },
        {
            id: 3,
            type: 'system',
            content: `**What Are Hormones?**
• Chemical messengers produced by various glands in your body
• Travel through your bloodstream to deliver instructions to organs and tissues
• Act like a sophisticated communication network coordinating bodily functions
• Influence everything from metabolism and mood to sleep and reproduction
• Work in delicate balance - too much or too little can create noticeable symptoms`,
            systemStyle: 'info',
        },
        {
            id: 4,
            type: 'coach',
            content: `Think of hormones as your body's internal text messaging system. Each hormone has a specific job, and when they're all communicating clearly, you feel amazing. But when there's miscommunication or imbalance, that's when things can feel off.`,
        },
        {
            id: 5,
            type: 'user-choice',
            content: `Which hormone-related symptom resonates most with your current experience?`,
            choices: ["Energy fluctuations throughout the day", "Mood swings or feeling emotionally off", "Sleep issues or feeling unrested"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Whatever you're experiencing, know that you're not alone and there are answers ahead! Let's meet the key players in your hormone orchestra.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**The Major Hormone Players**
• **Insulin**: Regulates blood sugar and energy storage
• **Cortisol**: Your stress hormone, manages fight-or-flight responses
• **Thyroid hormones (T3/T4)**: Control metabolism and energy production
• **Sex hormones (Estrogen, Progesterone, Testosterone)**: Influence reproduction, mood, and vitality
• **Melatonin**: Governs sleep-wake cycles
• **Growth hormone**: Supports tissue repair and regeneration`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'coach',
            content: `Each of these hormones has a specific role, but here's the key: they don't work in isolation. They're constantly communicating and influencing each other. When one gets out of balance, it can create a domino effect.`,
        },
        {
            id: 9,
            type: 'system',
            content: `**How Hormones Work Together**
• **The HPA Axis**: Hypothalamus, pituitary, and adrenal glands work as a team
• **Feedback loops**: Hormones self-regulate through complex feedback mechanisms
• **Circadian rhythms**: Many hormones follow daily cycles tied to light and darkness
• **Cascade effects**: One imbalanced hormone can trigger imbalances in others
• **Environmental influences**: Diet, stress, sleep, and toxins all impact hormone production`,
            systemStyle: 'info',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `What time of day do you typically feel most energized and balanced?`,
            choices: ["Morning - I'm a natural early bird", "Afternoon - I hit my stride mid-day", "Evening - I'm definitely a night person"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Interesting! Your natural energy patterns actually tell us a lot about your hormone rhythms. Cortisol should naturally peak in the morning, while melatonin rises in the evening. Understanding your patterns helps us work WITH your natural rhythms.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Signs of Hormonal Imbalance**
• **Energy**: Unexplained fatigue, energy crashes, or feeling wired but tired
• **Mood**: Anxiety, depression, irritability, or emotional volatility
• **Sleep**: Difficulty falling asleep, staying asleep, or feeling unrested
• **Weight**: Unexplained weight gain or difficulty losing weight
• **Digestion**: Bloating, irregular appetite, or digestive issues
• **Reproduction**: Irregular cycles, PMS, or changes in libido`,
            systemStyle: 'info',
        },
        {
            id: 13,
            type: 'system',
            content: `**Remember This**
• Hormone imbalances are incredibly common and often fixable
• Small, consistent changes can create significant improvements
• Your body wants to be in balance - sometimes it just needs the right support
• Symptoms are your body's way of communicating - they're valuable information, not character flaws`,
            systemStyle: 'takeaway',
        },
        {
            id: 14,
            type: 'coach',
            content: `{name}, you've just taken the first step in understanding the amazing complexity of your hormonal system. In our next lesson, we'll dive deeper into how to recognize the specific signs your body gives you when hormones are out of balance.`,
        },
        {
            id: 15,
            type: 'coach',
            content: `You're already on your way to becoming your own hormone health advocate! 💪 Remember, knowledge is power, and every expert was once a beginner. I'm so proud of you for investing in your health education.`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Meet Your Hormones"
            lessonSubtitle="Understanding the key players in hormonal health"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
