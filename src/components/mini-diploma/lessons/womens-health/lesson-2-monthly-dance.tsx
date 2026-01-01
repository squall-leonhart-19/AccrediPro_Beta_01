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

export function LessonMonthlyDance({
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
            content: `Welcome back, {name}! Today we're diving into something beautiful - the monthly dance of your menstrual cycle. 🌙`,
        },
        {
            id: 2,
            type: 'coach',
            content: `Your cycle isn't just about your period. It's a 4-phase journey that affects your energy, mood, creativity, and even what foods you crave!`,
        },
        {
            id: 3,
            type: 'system',
            content: `**The 4 Phases of Your Cycle**
• **Menstrual (Days 1-5)** - Rest & Reflect. Low hormones, need for restoration
• **Follicular (Days 6-14)** - Rise & Create. Estrogen rises, energy builds
• **Ovulation (Days 14-16)** - Peak & Connect. Hormones peak, social & confident
• **Luteal (Days 17-28)** - Nest & Complete. Progesterone rises, detail-oriented`,
            systemStyle: 'info',
        },
        {
            id: 4,
            type: 'user-choice',
            content: `Have you ever noticed your energy levels change throughout the month?`,
            choices: [
                "Yes! Some weeks I'm unstoppable, others I'm exhausted",
                "I never really paid attention before",
                "I thought it was just random mood swings",
            ],
            showReaction: true,
        },
        {
            id: 5,
            type: 'coach',
            content: `Here's the game-changer: instead of fighting against these natural rhythms, we can WORK with them! 🎯`,
        },
        {
            id: 6,
            type: 'system',
            content: `**Cycle Syncing Strategy**
**Follicular Phase (Rising Energy)**
→ Start new projects, schedule important meetings, try new workouts

**Ovulation (Peak Energy)**
→ Give presentations, go on dates, tackle challenging tasks

**Luteal Phase (Winding Down)**
→ Complete projects, organize, self-care, lighter exercise

**Menstrual (Restoration)**
→ Rest, reflect, journal, gentle movement`,
            systemStyle: 'takeaway',
        },
        {
            id: 7,
            type: 'coach',
            content: `This is called "cycle syncing" and it's revolutionary for women's productivity and wellbeing!`,
        },
        {
            id: 8,
            type: 'coach',
            content: `💡 When I started tracking my cycle and adjusting my schedule accordingly, everything changed. I stopped feeling broken on low-energy days and started honoring what my body actually needed.`,
        },
        {
            id: 9,
            type: 'user-choice',
            content: `What would be most helpful for you to track?`,
            choices: [
                "Energy levels throughout the month",
                "Mood patterns and what triggers them",
                "Physical symptoms like cramps or bloating",
            ],
            showReaction: true,
        },
        {
            id: 10,
            type: 'system',
            content: `**What to Track**
• Day of cycle (Day 1 = first day of period)
• Energy level (1-10)
• Mood (calm, anxious, irritable, happy)
• Sleep quality
• Physical symptoms
• Food cravings

→ After 2-3 cycles, patterns emerge!`,
            systemStyle: 'exercise',
        },
        {
            id: 11,
            type: 'coach',
            content: `Understanding cycle phases helps you become your own health detective. You'll start noticing patterns you never saw before!`,
        },
        {
            id: 12,
            type: 'coach',
            content: `Next lesson, we'll explore what happens when hormones go "rogue" - the signs of hormonal imbalance and what they mean. See you there! 💪`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Monthly Dance"
            lessonSubtitle="Understanding your menstrual cycle phases"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
