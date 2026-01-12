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

export function ClassicLessonRootCauseMedicine({
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
            content: `Hey {name}! I'm so excited you're here to learn about Functional Medicine! This journey is going to change how you understand health - and help you support others in finding the ROOT CAUSE of their issues.`,
        },
        {
            type: 'heading',
            content: 'Why Conventional Medicine Often Falls Short',
        },
        {
            type: 'text',
            content: `It's not that conventional doctors are bad - they're just trained differently. Most medical education focuses on identifying diseases and prescribing treatments, rather than investigating why the disease developed in the first place.`,
        },
        {
            type: 'key-point',
            content: `Conventional Medicine asks "What disease do you have?" and prescribes medication. Functional Medicine asks "WHY are you sick?" and addresses root causes. Same patient, completely different outcomes.`,
        },
        {
            type: 'heading',
            content: 'The Root Cause Approach',
        },
        {
            type: 'text',
            content: `Here's the key insight: Chronic disease doesn't happen overnight. It's the result of years of small imbalances accumulating. That's why treating symptoms rarely works long-term - you have to find and fix the UPSTREAM cause!`,
        },
        {
            type: 'heading',
            content: 'The 5 Root Causes of Chronic Disease',
        },
        {
            type: 'text',
            content: `In Functional Medicine, we've identified five major root causes that drive most chronic health conditions:`,
        },
        {
            type: 'list',
            content: 'Root causes to investigate:',
            items: [
                'Gut dysfunction - Including leaky gut, dysbiosis, and SIBO',
                'Chronic inflammation - Often called "the silent killer"',
                'Toxin overload - Heavy metals, mold, environmental chemicals',
                'Nutrient deficiencies - Even in people who eat "well"',
                'HPA axis dysfunction - The chronic stress response',
            ],
        },
        {
            type: 'text',
            content: `These 5 root causes are behind MOST chronic conditions: autoimmune diseases, fatigue, brain fog, weight gain, hormonal issues, and more.`,
        },
        {
            type: 'callout',
            content: `Quick tip: When someone comes to you with chronic symptoms, always think "What could be causing this UPSTREAM?" Don't just chase the symptom.`,
            style: 'tip',
        },
        {
            type: 'quote',
            content: `Functional Medicine practitioners don't treat diseases. They treat the PERSON who has the disease. Two people with the same diagnosis may need completely different protocols.`,
        },
        {
            type: 'heading',
            content: 'Looking Ahead',
        },
        {
            type: 'text',
            content: `In our next lesson, we'll dive deep into the gut - because as Hippocrates said 2,000 years ago: "All disease begins in the gut." He was right! Understanding gut health is foundational to everything else we'll cover.`,
        },
    ];

    const keyTakeaways = [
        'Functional Medicine focuses on finding the ROOT CAUSE rather than just treating symptoms',
        'Chronic disease develops from accumulated small imbalances over time',
        'The 5 major root causes are: gut dysfunction, inflammation, toxins, nutrient deficiencies, and HPA axis dysfunction',
        'Two people with the same diagnosis may need completely different treatment approaches',
        'Always think "upstream" when evaluating chronic health issues',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="What is Root Cause Medicine?"
            lessonSubtitle="Understanding the Functional Medicine approach"
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
