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

export function LessonHormoneTesting({
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
            content: `Hey {name}! Welcome to lesson 7 - this is where we get into the nitty-gritty of hormone testing 🔬 Ready to become a detective and uncover what your hormones are really up to?`,
        },
        {
            id: 2,
            type: 'system',
            content: `**Why Hormone Testing Matters**
• Symptoms can overlap between different hormone imbalances
• Testing provides objective data vs. guessing
• Helps identify root causes rather than treating symptoms
• Allows for targeted, personalized treatment approaches
• Monitors progress and treatment effectiveness over time`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think of hormone testing as your roadmap. Without it, you're basically driving blindfolded trying to balance your hormones. Not fun, right? Let's look at the different types of tests available.`,
        },
        {
            id: 4,
            type: 'system',
            content: `**Types of Hormone Tests**
• **Blood tests**: Most common, measures hormones in serum
• **Saliva tests**: Shows free (active) hormones, good for cortisol patterns
• **Urine tests**: 24-hour collection shows hormone metabolites
• **At-home tests**: Convenient but may have limitations
• **Functional vs. conventional ranges**: Optimal vs. 'normal' levels`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `If you had to choose just ONE hormone test to start with, which would be most valuable?`,
            choices: ["Complete thyroid panel (TSH, T3, T4, antibodies)", "Comprehensive metabolic panel", "Basic estrogen/progesterone only"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Great choice! The thyroid really is the master controller. Now let's dive into what specific markers you should actually be looking for in your tests.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Essential Hormone Markers to Test**
• **Thyroid**: TSH, Free T3, Free T4, Reverse T3, TPO antibodies, Thyroglobulin antibodies
• **Adrenal**: Cortisol (4-point saliva), DHEA-S, Aldosterone
• **Sex hormones**: Estradiol, Progesterone, Testosterone (free & total), SHBG
• **Metabolic**: Fasting insulin, Glucose, HbA1c
• **Other**: Vitamin D, B12, Ferritin, Inflammatory markers (CRP, ESR)`,
            systemStyle: 'takeaway',
        },
        {
            id: 8,
            type: 'coach',
            content: `I know that list looks overwhelming, but you don't need everything at once. Your symptoms and health history will guide which tests to prioritize first.`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Timing Your Tests**
• **Menstruating women**: Day 19-21 of cycle for progesterone peak
• **Cortisol**: Morning for baseline, 4-point saliva for daily rhythm
• **Thyroid**: Morning, fasted, consistent timing if on medication
• **Insulin/Glucose**: Fasted for 8-12 hours
• **Post-menopause**: Any time, but consistent timing for comparisons`,
            systemStyle: 'info',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `You're experiencing afternoon energy crashes and trouble sleeping. Which test timing would be most revealing?`,
            choices: ["4-point cortisol saliva test throughout the day", "Single morning blood cortisol", "Evening-only hormone panel"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Exactly! Those afternoon crashes often point to cortisol rhythm issues - you need to see the whole daily pattern, not just a snapshot.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Reading Your Results**
• **Functional ranges**: Optimal health ranges vs. lab 'normal'
• **Patterns matter**: Look at ratios and relationships between hormones
• **Symptoms + labs**: Numbers without context don't tell the whole story
• **Trends over time**: Single tests show moments, tracking shows progress
• **Work with practitioners**: Interpretation requires expertise and experience`,
            systemStyle: 'takeaway',
        },
        {
            id: 13,
            type: 'coach',
            content: `Remember {name}, a 'normal' lab result doesn't always mean optimal. Many people suffer with symptoms while their labs appear 'fine' because we're not looking at functional ranges.`,
        },
        {
            id: 14,
            type: 'system',
            content: `**Red Flags in Hormone Testing**
• Only testing TSH for thyroid function
• Ignoring symptoms when labs are 'normal'
• Testing at wrong times of cycle or day
• Not retesting after interventions
• Using outdated reference ranges
• Focusing on single markers instead of patterns`,
            systemStyle: 'info',
        },
        {
            id: 15,
            type: 'coach',
            content: `Amazing work getting through all that testing info! 🎉 Next up in lesson 8, we'll cover natural ways to support and balance your hormones. Get ready for some game-changing lifestyle strategies!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Hormone Testing"
            lessonSubtitle="Labs that reveal the truth"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
