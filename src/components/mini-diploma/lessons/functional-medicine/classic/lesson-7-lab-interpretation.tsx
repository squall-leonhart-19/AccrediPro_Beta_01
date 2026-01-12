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

export function ClassicLessonLabInterpretation({
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
            content: `{name}! Ready to learn what separates good practitioners from GREAT ones? Lab interpretation. Doctors say "your labs are normal" while you still feel terrible. Here's why that happens...`,
        },
        {
            type: 'heading',
            content: '"Normal" vs. Optimal',
        },
        {
            type: 'list',
            content: 'The key difference:',
            items: [
                'Conventional lab ranges are based on sick populations',
                '"Normal" doesn\'t mean healthy or optimal',
                'Functional ranges are TIGHTER and catch issues earlier',
                'We identify dysfunction BEFORE it becomes disease',
            ],
        },
        {
            type: 'example',
            content: `TSH (Thyroid) Example: Conventional range is 0.5 - 4.5, but functional optimal is 1.0 - 2.0. Someone at 3.5 is "normal" but their thyroid is already struggling. Symptoms appear long before the lab gets flagged.`,
        },
        {
            type: 'callout',
            content: `A skilled practitioner can see a train wreck coming 5-10 years before it becomes an official diagnosis. This is the power of functional lab interpretation.`,
            style: 'tip',
        },
        {
            type: 'heading',
            content: 'Key Functional Markers',
        },
        {
            type: 'list',
            content: 'Essential tests to understand:',
            items: [
                'Fasting insulin - Metabolic health indicator (optimal under 6)',
                'HbA1c - Blood sugar control (optimal 4.8-5.2)',
                'hsCRP - Inflammation marker (optimal under 1)',
                'Vitamin D - Overall health marker (optimal 50-80)',
                'Homocysteine - Methylation status (optimal 6-8)',
            ],
        },
        {
            type: 'heading',
            content: 'The Art of Pattern Recognition',
        },
        {
            type: 'text',
            content: `Don't just look at single markers - look for PATTERNS. This is the real art of functional medicine: connecting dots that others miss.`,
        },
        {
            type: 'list',
            content: 'Pattern examples:',
            items: [
                'High inflammation + low vitamin D = immune dysfunction developing',
                'High fasting insulin + high triglycerides = metabolic syndrome in progress',
                'Low ferritin + low B12 + GI symptoms = absorption issue to investigate',
            ],
        },
        {
            type: 'key-point',
            content: `The goal isn't just to read numbers - it's to understand the story those numbers tell about what's happening in the body and what intervention is needed.`,
        },
        {
            type: 'heading',
            content: 'Functional Ranges vs. Conventional',
        },
        {
            type: 'text',
            content: `In our full certification, you'll learn complete lab panels and how to interpret them functionally. You'll understand why someone can have "normal" labs and still feel terrible - and what to do about it.`,
        },
        {
            type: 'heading',
            content: 'Looking Ahead',
        },
        {
            type: 'text',
            content: `Next lesson: How to actually BUILD protocols for clients. This is where we bridge theory to practical application. Almost there - two more lessons to go!`,
        },
    ];

    const keyTakeaways = [
        '"Normal" lab ranges are based on sick populations, not optimal health',
        'Functional ranges are tighter and catch dysfunction earlier',
        'Pattern recognition is more valuable than single marker analysis',
        'Labs can predict problems 5-10 years before disease manifests',
        'The goal is understanding the story behind the numbers',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Functional Lab Interpretation"
            lessonSubtitle="Reading between the 'normal' lines"
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
