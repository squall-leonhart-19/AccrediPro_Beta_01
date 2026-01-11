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

export function LessonInflammationConnection({
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
            content: `Hey {name}! 🔥 Today we're tackling the BIG one: Chronic inflammation.`,
        },
        {
            id: 2,
            type: 'coach',
            content: `If there's ONE concept that explains most chronic disease, it's inflammation. Let's break it down.`,
        },
        {
            id: 3,
            type: 'system',
            content: `**Acute vs. Chronic Inflammation**
• **Acute**: Good! Your body healing a cut or fighting infection
• **Chronic**: Bad! Low-grade, constant, "silent" inflammation

Chronic inflammation is like a fire that never goes out. It slowly damages tissues over years.`,
            systemStyle: 'info',
        },
        {
            id: 4,
            type: 'user-choice',
            content: `Have you heard inflammation linked to any of these?`,
            choices: [
                "Heart disease",
                "Autoimmune conditions",
                "Depression and brain fog",
            ],
            showReaction: true,
        },
        {
            id: 5,
            type: 'coach',
            content: `All of those! Plus diabetes, Alzheimer's, cancer, obesity... the list goes on. Inflammation is the common thread.`,
        },
        {
            id: 6,
            type: 'system',
            content: `**The Inflammation Cascade**
Trigger (toxin, food, stress, infection)
    ↓
Immune system activation
    ↓
Inflammatory cytokines released
    ↓
Tissue damage over time
    ↓
Disease manifests`,
            systemStyle: 'takeaway',
        },
        {
            id: 7,
            type: 'coach',
            content: `Here's the key: By the time someone gets a diagnosis, inflammation has been building for YEARS. We need to intervene upstream!`,
        },
        {
            id: 8,
            type: 'coach',
            content: `💡 This is why Functional Medicine is so powerful. We don't wait for disease. We address inflammation early.`,
        },
        {
            id: 9,
            type: 'user-choice',
            content: `What's the most surprising inflammation trigger to you?`,
            choices: [
                "Sugar and processed foods",
                "Chronic stress",
                "Poor sleep",
            ],
            showReaction: true,
        },
        {
            id: 10,
            type: 'system',
            content: `**Top Inflammation Triggers**
1. Sugar and refined carbs (spike blood sugar → inflammation)
2. Processed seed oils (omega-6 overload)
3. Chronic stress (cortisol dysregulation)
4. Poor sleep (recovery time lost)
5. Gut dysfunction (leaky gut = systemic inflammation)
6. Toxin exposure (heavy metals, mold, chemicals)`,
            systemStyle: 'info',
        },
        {
            id: 11,
            type: 'coach',
            content: `Notice how these are all lifestyle factors? That's the good news - inflammation is MODIFIABLE. You can help clients reverse it!`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Anti-Inflammatory Protocol Foundation**
• Remove inflammatory foods (sugar, seed oils, processed)
• Add anti-inflammatory foods (omega-3s, vegetables, turmeric)
• Manage stress (HPA axis support)
• Prioritize sleep (7-9 hours)
• Heal the gut (5R protocol)`,
            systemStyle: 'quote',
        },
        {
            id: 13,
            type: 'coach',
            content: `When you help clients reduce chronic inflammation, EVERYTHING gets better. Energy, mood, weight, pain... it's remarkable.`,
        },
        {
            id: 14,
            type: 'coach',
            content: `Next lesson: We'll explore the toxin burden that's silently affecting almost everyone in our modern world. 🏭`,
        },
        {
            id: 15,
            type: 'coach',
            content: `You're doing amazing, {name}! See you in Lesson 4! 💪`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Inflammation Connection"
            lessonSubtitle="The silent driver of chronic disease"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
