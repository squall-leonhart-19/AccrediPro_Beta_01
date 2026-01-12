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

export function ClassicLessonToxinBurden({
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
            content: `{name}! Ready to learn about something most doctors completely ignore? Toxin burden. We're exposed to more toxins than any generation in history, and our bodies weren't designed for this level of chemical exposure.`,
        },
        {
            type: 'heading',
            content: 'The Modern Toxic Load',
        },
        {
            type: 'list',
            content: 'The reality we face:',
            items: [
                'Over 80,000 synthetic chemicals are currently in commerce',
                'The average person is exposed to 200+ chemicals before breakfast',
                'Many are "endocrine disruptors" that interfere with hormones',
                'Our body\'s detoxification systems can become overwhelmed',
            ],
        },
        {
            type: 'text',
            content: `The key is understanding that toxins ACCUMULATE over time. It's the total burden that matters, not just individual exposures. This cumulative effect is why people can suddenly develop symptoms after years of seemingly fine health.`,
        },
        {
            type: 'heading',
            content: 'Major Toxin Categories',
        },
        {
            type: 'list',
            content: 'Primary sources to assess:',
            items: [
                'Heavy metals - Mercury (fish, dental amalgams), Lead (old paint), Arsenic (rice, water)',
                'Mold/Mycotoxins - From water-damaged buildings',
                'Pesticides - Found in non-organic produce',
                'Plastics/BPA - Food containers, thermal receipts',
                'Household chemicals - Personal care products, cleaning supplies',
            ],
        },
        {
            type: 'heading',
            content: 'Understanding Liver Detoxification',
        },
        {
            type: 'text',
            content: `The liver is your main detox organ, but it works in two phases. Many people have a sluggish Phase 2, which creates problems:`,
        },
        {
            type: 'key-point',
            content: `Phase 1 breaks down toxins but creates reactive intermediates. Phase 2 conjugates and neutralizes these intermediates (requires specific nutrients!). If Phase 2 is slow, you have MORE toxic intermediates circulating in your body.`,
        },
        {
            type: 'heading',
            content: 'Symptoms of Toxin Overload',
        },
        {
            type: 'list',
            content: 'Common presentations:',
            items: [
                'Persistent fatigue',
                'Brain fog and cognitive issues',
                'Headaches',
                'Skin problems',
                'Hormonal imbalances',
                'Weight loss resistance',
                'Chemical sensitivities',
            ],
        },
        {
            type: 'heading',
            content: 'Supporting Detoxification',
        },
        {
            type: 'list',
            content: 'A comprehensive approach:',
            items: [
                'Reduce exposure - Clean up your environment first',
                'Support liver function - Cruciferous vegetables, milk thistle',
                'Bind toxins - Activated charcoal, fiber',
                'Promote elimination - Through sweat and regular bowel movements',
                'Ensure adequate hydration',
            ],
        },
        {
            type: 'callout',
            content: `Remember: Detox without reducing exposure is like mopping the floor while the faucet is running! Always address the source first.`,
            style: 'tip',
        },
        {
            type: 'heading',
            content: 'Looking Ahead',
        },
        {
            type: 'text',
            content: `Next lesson, we'll explore chronic stress and how it destroys health from the inside out. You're halfway through - amazing progress!`,
        },
    ];

    const keyTakeaways = [
        'We\'re exposed to more toxins than any previous generation',
        'Toxins accumulate over time - it\'s the total burden that matters',
        'The liver detoxifies in two phases, and Phase 2 often needs support',
        'Toxin overload can cause fatigue, brain fog, hormonal issues, and more',
        'Always reduce exposure before attempting detox protocols',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Toxin Burden"
            lessonSubtitle="Understanding environmental health threats"
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
