"use client";

import { ClassicLessonBase, LessonSection } from "../../shared/classic-lesson-base";

interface LessonProps {
    lessonNumber: number;
    totalLessons?: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

export function ClassicLessonBuildingProtocols({
    lessonNumber,
    totalLessons = 9,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const sections: LessonSection[] = [
        {
            type: 'intro',
            content: `{name}! This is where it all comes together: BUILDING PROTOCOLS that actually work. All the knowledge means nothing if you can't help someone implement it. Let's bridge theory to practice.`,
        },
        {
            type: 'heading',
            content: 'Protocol Building Framework',
        },
        {
            type: 'list',
            content: 'The systematic approach:',
            items: [
                'Identify the root cause(s) through proper assessment',
                'Prioritize interventions (you can\'t fix everything at once)',
                'Remove obstacles - triggers, toxins, inflammatory foods',
                'Replace what\'s missing - nutrients, digestive support',
                'Rebuild compromised systems - gut, HPA axis, detox pathways',
            ],
        },
        {
            type: 'heading',
            content: 'The Minimum Effective Dose',
        },
        {
            type: 'text',
            content: `The hardest parts of helping someone are getting them to follow through and knowing where to start. That's why we focus on the MINIMUM EFFECTIVE DOSE - the fewest changes that create the biggest impact.`,
        },
        {
            type: 'key-point',
            content: `The "Big 3" for most people: Blood sugar stability (protein + fat with every meal), Sleep optimization (7-9 hours, consistent schedule), and Gut support (remove inflammatory foods, add fermented foods). These 3 changes address 80% of issues for most clients.`,
        },
        {
            type: 'callout',
            content: `Start here, build momentum, then layer in more specific interventions based on labs and history. Success breeds compliance.`,
            style: 'tip',
        },
        {
            type: 'heading',
            content: 'Sample 90-Day Protocol Structure',
        },
        {
            type: 'text',
            content: `A structured approach helps clients see progress and stay committed:`,
        },
        {
            type: 'list',
            content: 'Month-by-month breakdown:',
            items: [
                'Month 1 (Foundation): Elimination diet, sleep hygiene, basic supplements',
                'Month 2 (Rebuild): Gut healing with 5R protocol, stress management, advanced nutrients',
                'Month 3 (Optimize): Retest labs, fine-tune protocol, transition to maintenance plan',
            ],
        },
        {
            type: 'heading',
            content: 'Keys to Client Compliance',
        },
        {
            type: 'text',
            content: `People follow through when they understand WHY and when changes feel achievable. Overwhelm leads to failure.`,
        },
        {
            type: 'list',
            content: 'Best practices:',
            items: [
                'Make recommendations simple and achievable',
                'Explain the "why" behind each step',
                'Document everything - intake, protocols, progress',
                'Weekly check-ins beat monthly reviews',
                'Celebrate small wins along the way',
                'Adjust based on feedback and results',
                'Set realistic expectations (3-6 months for real change)',
            ],
        },
        {
            type: 'quote',
            content: `In our full certification, you get done-for-you protocol templates, intake forms, and client tracking tools - everything you need to help clients succeed.`,
        },
        {
            type: 'heading',
            content: 'Looking Ahead',
        },
        {
            type: 'text',
            content: `FINAL LESSON coming up: Your next step to becoming a certified Functional Medicine practitioner! One more lesson to go - you've learned SO much.`,
        },
    ];

    const keyTakeaways = [
        'Use a systematic framework: Identify, Prioritize, Remove, Replace, Rebuild',
        'Focus on the minimum effective dose - fewest changes for biggest impact',
        'The "Big 3" (blood sugar, sleep, gut) address 80% of issues',
        'Structure protocols in 90-day blocks: Foundation, Rebuild, Optimize',
        'Compliance comes from simplicity and understanding the "why"',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Building Protocols"
            lessonSubtitle="From theory to practical application"
            totalLessons={totalLessons}
            sections={sections}
            keyTakeaways={keyTakeaways}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
            niche="functional-medicine"
            nicheLabel="Functional Medicine Diploma"
            baseUrl="/functional-medicine-diploma"
        />
    );
}
