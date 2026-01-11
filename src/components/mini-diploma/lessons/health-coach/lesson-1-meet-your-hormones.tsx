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
            type: 'pre-recorded-audio',
            content: `🎧 Welcome to Module 1!`,
            audioUrl: '/audio/health-coach/module-1-intro.mp3',
            audioDuration: '0:45',
        },
        {
            id: 2,
            type: 'coach',
            content: `Hey {name}! 💕 I'm so excited you're here to learn about women's hormonal health!`,
        },
        {
            id: 3,
            type: 'coach',
            content: `This journey is going to change how you understand your body - and help you support other women on their health journeys too.`,
        },
        {
            id: 4,
            type: 'user-choice',
            content: `Before we dive in, how familiar are you with hormones?`,
            choices: [
                "I know the basics but want to learn more",
                "I've heard of estrogen and progesterone",
                "I'm starting from scratch - teach me everything!",
            ],
            showReaction: true,
        },
        {
            id: 5,
            type: 'coach',
            content: `Perfect! Let's start with the key players in your hormonal orchestra. Yes, I said orchestra - because hormones work together like a symphony! 🎵`,
        },
        {
            id: 6,
            type: 'system',
            content: `**The Big 5 Female Hormones**
• **Estrogen** - The "feminine" hormone: affects skin, bones, mood, and reproduction
• **Progesterone** - The "calming" hormone: prepares body for pregnancy, promotes sleep
• **Testosterone** - Yes, women need it too! Energy, libido, muscle tone
• **Cortisol** - The "stress" hormone: affects everything when out of balance
• **Thyroid hormones** - Your metabolism master controller`,
            systemStyle: 'info',
        },
        {
            id: 7,
            type: 'coach',
            content: `Here's what most people don't realize: these hormones don't work in isolation. When one is off, it affects ALL the others.`,
        },
        {
            id: 8,
            type: 'coach',
            content: `That's why treating just one hormone rarely works. You have to look at the whole picture! 🧩`,
        },
        {
            id: 9,
            type: 'user-choice',
            content: `Which hormone are you most curious about?`,
            choices: [
                "Estrogen - I hear about it all the time",
                "Cortisol - stress feels like my issue",
                "Thyroid - I suspect something's off there",
            ],
            showReaction: true,
        },
        {
            id: 10,
            type: 'system',
            content: `**The Hormone Hierarchy**
Think of it like this: Your body prioritizes survival hormones (cortisol) over sex hormones (estrogen, progesterone).

→ When you're chronically stressed, your body "steals" building blocks from progesterone to make more cortisol.

This is why stress wreaks havoc on your cycle!`,
            systemStyle: 'takeaway',
        },
        {
            id: 11,
            type: 'coach',
            content: `This concept is called "pregnenolone steal" - and understanding it is key to helping women balance their hormones naturally.`,
        },
        {
            id: 12,
            type: 'coach',
            content: `💡 Quick tip: when a woman comes to you with hormonal issues, always ask about her stress levels first. Stress is often the root cause that throws everything else off balance.`,
        },
        {
            id: 13,
            type: 'system',
            content: `**Key Insight**
Hormonal imbalance is rarely about one hormone being "bad." It's about the relationships between all your hormones.

→ Balance is restored through lifestyle, not just supplements`,
            systemStyle: 'quote',
        },
        {
            id: 14,
            type: 'coach',
            content: `In our next lesson, we'll explore the beautiful monthly dance of your menstrual cycle - and how each phase affects how you feel.`,
        },
        {
            id: 15,
            type: 'coach',
            content: `You're off to an amazing start, {name}! See you in the next lesson! 🌸`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Meet Your Hormones"
            lessonSubtitle="Understanding the key players in women's health"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
