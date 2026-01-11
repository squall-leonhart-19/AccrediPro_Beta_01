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

export function LessonBuildingProtocols({
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
            content: `{name}! 🔧 This is where it all comes together: BUILDING PROTOCOLS that actually work.`,
        },
        {
            id: 2,
            type: 'coach',
            content: `All the knowledge means nothing if you can't help someone implement it. Let's bridge theory to practice.`,
        },
        {
            id: 3,
            type: 'system',
            content: `**Protocol Building Framework**
1. Identify the root cause(s)
2. Prioritize (you can't fix everything at once)
3. Remove obstacles (triggers, toxins, foods)
4. Replace what's missing (nutrients, support)
5. Rebuild systems (gut, HPA, detox)`,
            systemStyle: 'info',
        },
        {
            id: 4,
            type: 'user-choice',
            content: `What's the hardest part of helping someone change their health?`,
            choices: [
                "Getting them to actually follow through",
                "Knowing where to start",
                "Personalizing the approach",
            ],
            showReaction: true,
        },
        {
            id: 5,
            type: 'coach',
            content: `All valid challenges! That's why we focus on the MINIMUM EFFECTIVE DOSE - the fewest changes that create the biggest impact.`,
        },
        {
            id: 6,
            type: 'system',
            content: `**The "Big 3" for Most People**
1. **Blood sugar stability** - Protein + fat with every meal
2. **Sleep optimization** - 7-9 hours, consistent schedule
3. **Gut support** - Remove inflammatory foods, add fermented foods

These 3 changes address 80% of issues for most clients.`,
            systemStyle: 'takeaway',
        },
        {
            id: 7,
            type: 'coach',
            content: `💡 Start here, build momentum, then layer in more specific interventions based on labs and history.`,
        },
        {
            id: 8,
            type: 'system',
            content: `**Sample 90-Day Protocol Structure**
**Month 1**: Foundation
- Elimination diet, sleep hygiene, basic supplements

**Month 2**: Rebuild
- Gut healing (5R), stress management, advanced nutrients

**Month 3**: Optimize
- Retest labs, fine-tune protocol, transition to maintenance`,
            systemStyle: 'info',
        },
        {
            id: 9,
            type: 'user-choice',
            content: `What's the key to client compliance?`,
            choices: [
                "Make it simple and achievable",
                "Explain the 'why' behind each step",
                "Both - simplicity + understanding",
            ],
            showReaction: true,
        },
        {
            id: 10,
            type: 'coach',
            content: `Exactly! People follow through when they understand WHY and when it feels achievable. Overwhelm = failure.`,
        },
        {
            id: 11,
            type: 'system',
            content: `**Protocol Best Practices**
• Document everything (intake, protocols, progress)
• Weekly check-ins >>> monthly reviews
• Celebrate small wins
• Adjust based on feedback
• Set realistic expectations (3-6 months for real change)`,
            systemStyle: 'quote',
        },
        {
            id: 12,
            type: 'coach',
            content: `In our full certification, you get done-for-you protocol templates, intake forms, and client tracking tools.`,
        },
        {
            id: 13,
            type: 'coach',
            content: `FINAL LESSON coming up: Your next step to becoming a certified Functional Medicine practitioner! 🎯`,
        },
        {
            id: 14,
            type: 'coach',
            content: `One more lesson, {name}! You've learned SO much. Proud of you! 💪`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Building Protocols"
            lessonSubtitle="From theory to practical application"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
