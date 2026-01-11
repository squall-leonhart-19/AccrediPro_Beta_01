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

export function LessonGutFoundation({
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
            content: `Welcome back, {name}! 🔬 Today we're diving into the gut - the foundation of ALL health.`,
        },
        {
            id: 2,
            type: 'coach',
            content: `Hippocrates said "All disease begins in the gut" over 2,000 years ago. Modern science finally caught up!`,
        },
        {
            id: 3,
            type: 'system',
            content: `**Why the Gut Matters**
• 70-80% of your immune system lives in your gut
• Your gut makes MORE serotonin than your brain
• It's called the "second brain" for a reason
• Gut dysfunction is linked to autoimmune, mental health, skin issues, and more`,
            systemStyle: 'info',
        },
        {
            id: 4,
            type: 'user-choice',
            content: `Have you or someone you know struggled with gut issues?`,
            choices: [
                "Yes - bloating, IBS, reflux",
                "Yes - food sensitivities",
                "Not directly, but I want to understand it",
            ],
            showReaction: true,
        },
        {
            id: 5,
            type: 'coach',
            content: `Here's what most people don't realize: You can have gut dysfunction WITHOUT digestive symptoms. It can show up as fatigue, brain fog, joint pain, or even anxiety.`,
        },
        {
            id: 6,
            type: 'system',
            content: `**The 3 Pillars of Gut Health**
1. **Gut Barrier** - The lining (leaky gut = problems)
2. **Microbiome** - Trillions of bacteria (balance is key)
3. **Motility** - Movement (constipation = toxin buildup)`,
            systemStyle: 'takeaway',
        },
        {
            id: 7,
            type: 'coach',
            content: `Leaky gut (intestinal permeability) is when the gut lining becomes too porous. Food particles and toxins escape into the bloodstream, triggering inflammation.`,
        },
        {
            id: 8,
            type: 'coach',
            content: `This chronic low-grade inflammation is the ROOT CAUSE of so many conditions doctors can't explain! 🧩`,
        },
        {
            id: 9,
            type: 'user-choice',
            content: `Which gut concept is new or surprising to you?`,
            choices: [
                "Gut affects mental health",
                "You can have gut issues without symptoms",
                "Leaky gut causes inflammation",
            ],
            showReaction: true,
        },
        {
            id: 10,
            type: 'system',
            content: `**Common Causes of Gut Dysfunction**
• Antibiotics (disrupt microbiome)
• Chronic stress (shuts down digestion)
• Processed foods (feed bad bacteria)
• NSAIDs (damage gut lining)
• Low stomach acid (prevents proper breakdown)`,
            systemStyle: 'info',
        },
        {
            id: 11,
            type: 'coach',
            content: `💡 Key insight: When working with clients, ALWAYS assess gut health first. If the gut isn't functioning, nothing else will work properly.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**The 5R Protocol**
1. **Remove** - inflammatory foods, pathogens
2. **Replace** - digestive enzymes, HCl if needed
3. **Reinoculate** - probiotics, prebiotics
4. **Repair** - L-glutamine, zinc, bone broth
5. **Rebalance** - stress management, sleep`,
            systemStyle: 'quote',
        },
        {
            id: 13,
            type: 'coach',
            content: `This 5R protocol is the gold standard for healing the gut. You'll learn to apply it for different conditions.`,
        },
        {
            id: 14,
            type: 'coach',
            content: `Next lesson, we'll explore the inflammation connection - and why it's the common thread in virtually ALL chronic disease.`,
        },
        {
            id: 15,
            type: 'coach',
            content: `Great work, {name}! You're building real expertise here. See you in Lesson 3! 🔥`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Gut Foundation"
            lessonSubtitle="Why all health begins in the gut"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
