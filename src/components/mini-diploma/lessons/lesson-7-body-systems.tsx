"use client";

import { LessonBase, Message } from "./shared/lesson-base";

interface LessonProps {
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
    lessonNumber?: number;
    totalLessons?: number;
    firstName?: string;
    isPaid?: boolean;
}

/**
 * Lesson 2: The 7 Body Systems Model
 * How everything in the body connects
 */
export function Lesson7BodySystems({
    onComplete,
    onNext,
    isCompleted = false,
    lessonNumber = 2,
    totalLessons = 9,
    firstName = "friend",
}: LessonProps) {
    const messages: Message[] = [
        // INTRO - Welcome back
        {
            id: 1,
            type: 'coach',
            content: `Welcome back, {name}! Ready for Lesson 2?`,
            delay: 2500,
        },
        {
            id: 2,
            type: 'coach',
            content: "Today we're diving into something that changed EVERYTHING for me—the 7 Body Systems Model.",
            delay: 3200,
        },
        {
            id: 3,
            type: 'coach',
            content: "This is the framework that FM practitioners use to understand how the body ACTUALLY works.",
            delay: 3500,
        },
        {
            id: 4,
            type: 'user-choice',
            content: "Have you ever wondered why ONE issue seems to cause SO many symptoms?",
            choices: [
                "Yes! It's so frustrating",
                "All the time—nothing seems connected in regular medicine",
                "I've experienced this myself"
            ],
        },

        // THE BIG IDEA
        {
            id: 5,
            type: 'coach',
            content: "Here's the thing conventional medicine gets WRONG:",
            delay: 3000,
        },
        {
            id: 6,
            type: 'system',
            content: "**The Conventional Approach:**\n\n• Heart problem? → See a cardiologist\n• Gut problem? → See a gastroenterologist\n• Thyroid problem? → See an endocrinologist\n\nEach specialist looks at ONE piece. Nobody sees the WHOLE picture.",
            systemStyle: 'comparison',
            delay: 4000,
        },
        {
            id: 7,
            type: 'coach',
            content: "But here's what I learned: Your body isn't a collection of separate parts.",
            delay: 3200,
        },
        {
            id: 8,
            type: 'voice-note',
            content: "Everything is connected. Your gut affects your brain. Your hormones affect your energy. Your stress affects your gut. It's all one system—and when you understand HOW it connects, you can finally help people heal.",
            voiceDuration: "0:25",
            delay: 3500,
        },

        // THE 7 SYSTEMS
        {
            id: 9,
            type: 'coach',
            content: "Let me introduce you to the 7 Body Systems:",
            delay: 2800,
        },
        {
            id: 10,
            type: 'system',
            content: "**The 7 Body Systems Model:**\n\n• 1️⃣ **Gut & Digestion** — Where health begins\n• 2️⃣ **Hormones** — Your body's messaging system\n• 3️⃣ **Immune System** — Defense and inflammation\n• 4️⃣ **Detoxification** — How your body cleans itself\n• 5️⃣ **Energy/Mitochondria** — Your cellular batteries\n• 6️⃣ **Nervous System** — Stress response and balance\n• 7️⃣ **Structural** — Muscles, bones, movement",
            systemStyle: 'info',
            delay: 5000,
        },
        {
            id: 11,
            type: 'coach',
            content: "Now here's the magic: These 7 systems don't work in isolation.",
            delay: 3000,
        },
        {
            id: 12,
            type: 'coach',
            content: "They're all connected. And when ONE system is off, it affects the others.",
            delay: 3200,
        },

        // REAL EXAMPLE
        {
            id: 13,
            type: 'coach',
            content: "Let me show you how this works in real life...",
            delay: 2800,
        },
        {
            id: 14,
            type: 'system',
            content: "**Real Case: Sarah's Client Jane**\n\nJane came to me with:\n• Chronic fatigue\n• Brain fog\n• Weight gain\n• Anxiety\n• Poor sleep\n\nHer conventional doctor said: \"Everything looks normal.\"",
            systemStyle: 'quote',
            delay: 4500,
        },
        {
            id: 15,
            type: 'coach',
            content: "Using the 7 Systems Model, here's what we discovered:",
            delay: 3000,
        },
        {
            id: 16,
            type: 'system',
            content: "**Jane's System Map:**\n\n• **Gut** → Leaky gut from years of stress eating\n• **Immune** → Chronic low-grade inflammation\n• **Hormones** → Thyroid struggling (TSH \"normal\" but not optimal)\n• **Detox** → Liver overwhelmed, can't clear toxins\n• **Energy** → Mitochondria depleted from inflammation\n• **Nervous System** → Stuck in fight-or-flight\n\n→ 5 out of 7 systems were connected and affected!",
            systemStyle: 'takeaway',
            delay: 5500,
        },
        {
            id: 17,
            type: 'coach',
            content: "Her doctor only tested her thyroid. But the REAL issue started in her gut.",
            delay: 3500,
        },
        {
            id: 18,
            type: 'voice-note',
            content: "When we fixed her gut, the inflammation went down. When inflammation went down, her thyroid started working better. When her thyroid improved, her energy came back. It was like dominoes falling—in a GOOD way.",
            voiceDuration: "0:28",
            delay: 4000,
        },
        {
            id: 19,
            type: 'user-choice',
            content: "Does this make sense? Can you see how everything connects?",
            choices: [
                "YES! This explains SO much",
                "I've never thought about it this way",
                "I can see this in my own health issues"
            ],
            showReaction: true,
        },

        // WHY THIS MATTERS
        {
            id: 20,
            type: 'coach',
            content: "This is why the 7 Systems Model is so powerful.",
            delay: 3000,
        },
        {
            id: 21,
            type: 'coach',
            content: "Instead of chasing symptoms one by one...",
            delay: 2800,
        },
        {
            id: 22,
            type: 'coach',
            content: "You find the ROOT CAUSE and watch the dominoes fall.",
            delay: 3000,
        },
        {
            id: 23,
            type: 'system',
            content: "**The FM Practitioner's Secret:**\n\nWe always ask: \"Which system is the UPSTREAM problem?\"\n\nFix that one first, and the others often resolve on their own.",
            systemStyle: 'takeaway',
            delay: 4000,
        },

        // QUICK EXERCISE
        {
            id: 24,
            type: 'coach',
            content: "Quick exercise for you, {name}:",
            delay: 2800,
        },
        {
            id: 25,
            type: 'system',
            content: "**Think About It:**\n\nIf someone came to you with these symptoms:\n• Always tired\n• Bloating after meals\n• Can't lose weight\n• Mood swings\n\nWhich system would YOU start investigating first?",
            systemStyle: 'exercise',
            delay: 4500,
        },
        {
            id: 26,
            type: 'user-choice',
            content: "Which system would you look at FIRST?",
            choices: [
                "Gut — Bloating suggests digestion issues",
                "Hormones — Mood swings and weight",
                "Energy — Always tired is the main complaint"
            ],
        },
        {
            id: 27,
            type: 'coach',
            content: "Great thinking! Here's what experienced FM practitioners know:",
            delay: 3000,
        },
        {
            id: 28,
            type: 'coach',
            content: "When in doubt, START WITH THE GUT.",
            delay: 2800,
        },
        {
            id: 29,
            type: 'system',
            content: "**Why Gut First?**\n\n• 70% of your immune system lives in your gut\n• Gut health affects hormone balance\n• Poor digestion → poor nutrient absorption → low energy\n• The gut-brain connection affects mood\n\n→ Fix the gut, and many other symptoms improve.",
            systemStyle: 'takeaway',
            delay: 5000,
        },

        // WRAP UP
        {
            id: 30,
            type: 'coach',
            content: "This is exactly why Lesson 4 will be a deep dive into gut health.",
            delay: 3200,
        },
        {
            id: 31,
            type: 'coach',
            content: "But first, in Lesson 3, I want to show you something special...",
            delay: 3000,
        },
        {
            id: 32,
            type: 'voice-note',
            content: "I'm going to share why YOUR background—whatever it is—is actually your unfair advantage in this field. There's a reason you're drawn to this work. Let's find out what it is.",
            voiceDuration: "0:20",
            delay: 3500,
        },
        {
            id: 33,
            type: 'system',
            content: "**Lesson 2 Key Takeaway:**\n\nThe 7 Body Systems are all connected. When you learn to see these connections, you can find root causes that others miss.\n\nAnd THAT is what makes FM practitioners so effective.",
            systemStyle: 'takeaway',
            delay: 4500,
        },
        {
            id: 34,
            type: 'coach',
            content: `Amazing work, {name}! You're starting to think like an FM practitioner.`,
            delay: 3200,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The 7 Body Systems Model"
            lessonSubtitle="How everything connects"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
