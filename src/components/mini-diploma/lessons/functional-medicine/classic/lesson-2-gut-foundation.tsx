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

export function ClassicLessonGutFoundation({
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
            content: `Welcome back, {name}! Today we're diving into the gut - the foundation of ALL health. Hippocrates said "All disease begins in the gut" over 2,000 years ago. Modern science has finally caught up!`,
        },
        {
            type: 'heading',
            content: 'Why the Gut Matters',
        },
        {
            type: 'text',
            content: `Your gut is far more than just a digestive organ. It's home to 70-80% of your immune system, produces more serotonin than your brain, and is called the "second brain" for good reason. Gut dysfunction is linked to autoimmune conditions, mental health issues, skin problems, and much more.`,
        },
        {
            type: 'callout',
            content: `Here's what most people don't realize: You can have gut dysfunction WITHOUT digestive symptoms. It can show up as fatigue, brain fog, joint pain, or even anxiety.`,
            style: 'warning',
        },
        {
            type: 'heading',
            content: 'The 3 Pillars of Gut Health',
        },
        {
            type: 'list',
            content: 'Every gut assessment should evaluate:',
            items: [
                'Gut Barrier - The intestinal lining (when it becomes "leaky," problems arise)',
                'Microbiome - Trillions of bacteria (balance is key)',
                'Motility - Movement through the digestive tract (constipation = toxin buildup)',
            ],
        },
        {
            type: 'heading',
            content: 'Understanding Leaky Gut',
        },
        {
            type: 'text',
            content: `Leaky gut (intestinal permeability) occurs when the gut lining becomes too porous. Food particles and toxins escape into the bloodstream, triggering inflammation. This chronic low-grade inflammation is the ROOT CAUSE of so many conditions doctors can't explain.`,
        },
        {
            type: 'heading',
            content: 'Common Causes of Gut Dysfunction',
        },
        {
            type: 'list',
            content: 'What damages gut health:',
            items: [
                'Antibiotics - Disrupt the microbiome balance',
                'Chronic stress - Shuts down proper digestion',
                'Processed foods - Feed harmful bacteria',
                'NSAIDs (ibuprofen, aspirin) - Damage the gut lining',
                'Low stomach acid - Prevents proper food breakdown',
            ],
        },
        {
            type: 'callout',
            content: `Key insight: When working with clients, ALWAYS assess gut health first. If the gut isn't functioning properly, nothing else will work optimally.`,
            style: 'tip',
        },
        {
            type: 'heading',
            content: 'The 5R Protocol',
        },
        {
            type: 'text',
            content: `The 5R protocol is the gold standard for healing the gut. This framework provides a systematic approach to restoring gut health:`,
        },
        {
            type: 'list',
            content: 'The 5 Rs:',
            items: [
                'Remove - Eliminate inflammatory foods and pathogens',
                'Replace - Add digestive enzymes, HCl if needed',
                'Reinoculate - Introduce probiotics and prebiotics',
                'Repair - Use L-glutamine, zinc, bone broth for healing',
                'Rebalance - Address stress management and sleep',
            ],
        },
        {
            type: 'heading',
            content: 'Looking Ahead',
        },
        {
            type: 'text',
            content: `In our next lesson, we'll explore the inflammation connection - and why it's the common thread in virtually ALL chronic disease. Understanding inflammation is crucial for connecting gut health to the rest of the body.`,
        },
    ];

    const keyTakeaways = [
        '70-80% of your immune system lives in your gut',
        'Gut dysfunction can exist without obvious digestive symptoms',
        'The 3 pillars of gut health are: barrier integrity, microbiome balance, and motility',
        'Leaky gut triggers systemic inflammation throughout the body',
        'The 5R Protocol (Remove, Replace, Reinoculate, Repair, Rebalance) is the gold standard for gut healing',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Gut Foundation"
            lessonSubtitle="Why all health begins in the gut"
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
