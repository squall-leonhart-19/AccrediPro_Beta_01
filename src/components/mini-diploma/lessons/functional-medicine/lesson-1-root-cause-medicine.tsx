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

export function LessonRootCauseMedicine({
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
            audioUrl: '/audio/functional-medicine/module-1-intro.mp3',
            audioDuration: '0:45',
        },
        {
            id: 2,
            type: 'coach',
            content: `Hey {name}! 💕 I'm so excited you're here to learn about Functional Medicine!`,
        },
        {
            id: 3,
            type: 'coach',
            content: `This journey is going to change how you understand health - and help you support others in finding the ROOT CAUSE of their issues.`,
        },
        {
            id: 4,
            type: 'user-choice',
            content: `Before we dive in, how familiar are you with Functional Medicine?`,
            choices: [
                "I know the basics but want to learn more",
                "I've heard of 'root cause' approaches",
                "I'm starting from scratch - teach me everything!",
            ],
            showReaction: true,
        },
        {
            id: 5,
            type: 'coach',
            content: `Perfect! Let's start with WHY conventional medicine often fails chronic patients. It's not that doctors are bad - they're just trained differently. 🏥`,
        },
        {
            id: 6,
            type: 'system',
            content: `**Conventional vs. Functional Medicine**
• **Conventional**: Asks "What disease do you have?" → Prescribes medication
• **Functional**: Asks "WHY are you sick?" → Addresses root causes

Same patient. Completely different outcomes.`,
            systemStyle: 'info',
        },
        {
            id: 7,
            type: 'coach',
            content: `Here's the key insight: Chronic disease doesn't happen overnight. It's the result of years of small imbalances accumulating.`,
        },
        {
            id: 8,
            type: 'coach',
            content: `That's why treating symptoms rarely works long-term. You have to find and fix the UPSTREAM cause! 🔍`,
        },
        {
            id: 9,
            type: 'user-choice',
            content: `Which root cause area interests you most?`,
            choices: [
                "Gut health - the foundation of everything",
                "Toxins - our modern environment",
                "Stress/HPA axis - the burnout epidemic",
            ],
            showReaction: true,
        },
        {
            id: 10,
            type: 'system',
            content: `**The 5 Root Causes of Chronic Disease**
1. **Gut dysfunction** - Leaky gut, dysbiosis, SIBO
2. **Chronic inflammation** - The silent killer
3. **Toxin overload** - Heavy metals, mold, chemicals
4. **Nutrient deficiencies** - Even in the "well-fed"
5. **HPA axis dysfunction** - Chronic stress response`,
            systemStyle: 'takeaway',
        },
        {
            id: 11,
            type: 'coach',
            content: `These 5 root causes are behind MOST chronic conditions: autoimmune diseases, fatigue, brain fog, weight gain, hormonal issues, and more.`,
        },
        {
            id: 12,
            type: 'coach',
            content: `💡 Quick tip: When someone comes to you with chronic symptoms, always think "What could be causing this UPSTREAM?" Don't just chase the symptom.`,
        },
        {
            id: 13,
            type: 'system',
            content: `**Key Insight**
Functional Medicine practitioners don't treat diseases. 
They treat the PERSON who has the disease.

→ Two people with the same diagnosis may need completely different protocols`,
            systemStyle: 'quote',
        },
        {
            id: 14,
            type: 'coach',
            content: `In our next lesson, we'll dive deep into the gut - because as Hippocrates said 2,000 years ago: "All disease begins in the gut." He was right! 🧬`,
        },
        {
            id: 15,
            type: 'coach',
            content: `You're off to an amazing start, {name}! See you in the next lesson! 🔥`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="What is Root Cause Medicine?"
            lessonSubtitle="Understanding the Functional Medicine approach"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
