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

export function LessonFoodAsMedicine({
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
            type: 'pre-recorded-audio',
            content: `🎧 Welcome to Module 3!`,
            audioUrl: '/audio/functional-medicine/module-3-intro.mp3',
            audioDuration: '0:40',
        },
        {
            id: 2,
            type: 'coach',
            content: `Welcome to Module 3, {name}! 🥗 Now we put everything together with practical action steps.`,
        },
        {
            id: 3,
            type: 'coach',
            content: `Food is medicine - and the RIGHT foods can significantly help balance your hormones. Let's explore the most powerful strategies!`,
        },
        {
            id: 4,
            type: 'system',
            content: `**Hormone-Balancing Nutrition Pillars**
• **Protein at every meal** - Stabilizes blood sugar
• **Healthy fats** - Hormones are made from fat!
• **Fiber** - 25-30g daily for estrogen elimination
• **Cruciferous vegetables** - Support liver detox
• **Minimize sugar** - Causes inflammation & insulin spikes`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `Which pillar do you think you could improve most?`,
            choices: [
                "Adding more protein to meals",
                "Eating more healthy fats",
                "Getting enough fiber",
            ],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Now let me share one of my favorite hormone-balancing practices: seed cycling! 🌱`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Seed Cycling for Hormones**
**Days 1-14 (Follicular Phase)**
• 1 tbsp ground flax seeds
• 1 tbsp pumpkin seeds
→ Support estrogen production

**Days 15-28 (Luteal Phase)**
• 1 tbsp sunflower seeds
• 1 tbsp sesame seeds
→ Support progesterone production

Add to smoothies, oatmeal, or salads!`,
            systemStyle: 'exercise',
        },
        {
            id: 8,
            type: 'coach',
            content: `💡 Seed cycling isn't magic, but it provides key nutrients your body needs at different phases. Combined with other healthy habits, many women notice real improvements in PMS and cycle regularity.`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Foods That Hurt Hormone Balance**
• **Sugar** - Spikes insulin, increases inflammation
• **Alcohol** - Burden on liver, raises estrogen
• **Caffeine excess** - Stresses adrenals
• **Processed oils** - Cause inflammation
• **Conventional dairy** - Contains added hormones`,
            systemStyle: 'comparison',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `What's one food you could reduce to support your hormones?`,
            choices: [
                "Cutting back on sugar",
                "Reducing alcohol intake",
                "Limiting processed foods",
            ],
            showReaction: true,
        },
        {
            id: 11,
            type: 'system',
            content: `**Blood Sugar is KEY**
When blood sugar spikes and crashes:
• Cortisol increases
• Insulin surges
• Inflammation rises
• Cravings intensify
• Energy crashes

→ Eat protein + fat + fiber at every meal to stay stable!`,
            systemStyle: 'takeaway',
        },
        {
            id: 12,
            type: 'coach',
            content: `Remember: you don't have to be perfect. Progress over perfection! Even adding 2-3 of these changes can make a noticeable difference.`,
        },
        {
            id: 13,
            type: 'coach',
            content: `Next lesson: we'll cover how to support women through different life stages - from periods to perimenopause. So important! 💕`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Food as Medicine"
            lessonSubtitle="Nutrition strategies for hormone balance"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
