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

export function LessonGutHormoneAxis({
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
            content: `Welcome to Module 2, {name}! 🎉 Now we're getting into the connections that most doctors miss.`,
        },
        {
            id: 2,
            type: 'coach',
            content: `Did you know your gut health directly affects your hormones? Let me introduce you to the estrobolome...`,
        },
        {
            id: 3,
            type: 'system',
            content: `**What is the Estrobolome?**
A collection of gut bacteria that helps metabolize and eliminate estrogen from your body.

→ Healthy estrobolome = balanced estrogen levels
→ Unhealthy estrobolome = estrogen recirculates = estrogen dominance`,
            systemStyle: 'info',
        },
        {
            id: 4,
            type: 'user-choice',
            content: `Did you know gut bacteria could affect your hormones?`,
            choices: [
                "I had no idea - this is mind-blowing!",
                "I've heard of gut-hormone connection but not details",
                "This explains so much about my issues",
            ],
            showReaction: true,
        },
        {
            id: 5,
            type: 'coach',
            content: `Here's why this matters: if your gut is out of balance, you could eat perfectly and still have hormonal issues!`,
        },
        {
            id: 6,
            type: 'system',
            content: `**Signs Your Gut is Affecting Your Hormones**
• Bloating, especially premenstrual
• Constipation (less than 1 bowel movement/day)
• PMS that won't quit
• Skin breakouts
• Recurring yeast infections
• Mood swings and anxiety

→ The gut-brain-hormone axis is REAL`,
            systemStyle: 'comparison',
        },
        {
            id: 7,
            type: 'voice-note',
            content: `I always tell my clients: you cannot fully balance your hormones without addressing gut health first. They're intimately connected. Start with the gut, and often the hormones follow.`,
            voiceDuration: '0:18',
        },
        {
            id: 8,
            type: 'system',
            content: `**Gut Health Quick Wins**
• **Fiber** - 25-30g daily for healthy elimination
• **Fermented foods** - Sauerkraut, kimchi, yogurt
• **Reduce sugar** - Feeds bad bacteria
• **Manage stress** - Stress destroys gut lining
• **Hydrate** - 8+ glasses of water daily`,
            systemStyle: 'takeaway',
        },
        {
            id: 9,
            type: 'user-choice',
            content: `Which gut health habit would be easiest for you to start?`,
            choices: [
                "Adding more fiber to my diet",
                "Eating fermented foods",
                "Drinking more water",
            ],
            showReaction: true,
        },
        {
            id: 10,
            type: 'coach',
            content: `Small changes add up! Even adding one serving of fermented foods daily can make a difference over time.`,
        },
        {
            id: 11,
            type: 'system',
            content: `**The Elimination Connection**
Fun fact: You should have 1-2 bowel movements DAILY.

If you're constipated, estrogen gets reabsorbed instead of eliminated. This is a major cause of estrogen dominance that's often overlooked!`,
            systemStyle: 'stats',
        },
        {
            id: 12,
            type: 'coach',
            content: `Next up: the thyroid! This tiny gland controls your entire metabolism. Let's see how it connects to your hormonal health. 🦋`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Gut-Hormone Axis"
            lessonSubtitle="How your gut health affects your hormones"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
