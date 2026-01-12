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

export function ClassicLessonStressHPA({
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
            content: `Hey {name}! Let's talk about the elephant in the room: CHRONIC STRESS. Stress isn't just "in your head." It creates REAL physiological changes that wreck your health over time.`,
        },
        {
            type: 'heading',
            content: 'Understanding the HPA Axis',
        },
        {
            type: 'text',
            content: `The HPA axis is your body's stress response system, connecting three key areas:`,
        },
        {
            type: 'list',
            content: 'The three components:',
            items: [
                'Hypothalamus (brain) - Detects stress and initiates the response',
                'Pituitary (brain) - Signals the adrenal glands',
                'Adrenal glands - Produce stress hormones like cortisol',
            ],
        },
        {
            type: 'text',
            content: `When this axis is chronically activated, everything breaks down. Most people call it "adrenal fatigue," but it's really a brain-adrenal communication problem.`,
        },
        {
            type: 'heading',
            content: 'Stages of HPA Dysfunction',
        },
        {
            type: 'list',
            content: 'The progression:',
            items: [
                'Alarm Stage - High cortisol, feeling wired (fight or flight mode)',
                'Resistance Stage - Cortisol stays elevated, starting to feel tired',
                'Exhaustion Stage - Cortisol crashes, complete burnout',
            ],
        },
        {
            type: 'callout',
            content: `Most people seeking help are somewhere in stage 2-3. Common signs include exhaustion but can't sleep, feeling "wired and tired," and constant anxiety or overwhelm.`,
            style: 'info',
        },
        {
            type: 'heading',
            content: 'The Pregnenolone Steal',
        },
        {
            type: 'key-point',
            content: `Chronic stress causes the body to "steal" hormone precursors from sex hormones to make more cortisol. This is why stressed people often have hormone problems - you can't fix hormones without fixing stress!`,
        },
        {
            type: 'heading',
            content: 'Cortisol\'s Downstream Effects',
        },
        {
            type: 'list',
            content: 'What elevated cortisol does:',
            items: [
                'Raises blood sugar levels',
                'Suppresses immune function',
                'Breaks down muscle tissue',
                'Increases belly fat storage',
                'Causes brain fog and memory issues',
                'Disrupts sleep patterns',
            ],
        },
        {
            type: 'text',
            content: `This is why chronic stress is linked to almost every disease. It's not just "feeling stressed" - it's actual physical damage occurring in the body.`,
        },
        {
            type: 'heading',
            content: 'HPA Axis Recovery Protocol',
        },
        {
            type: 'list',
            content: 'Core interventions:',
            items: [
                'Sleep by 10pm to support natural cortisol rhythm',
                'Morning light exposure to reset circadian patterns',
                'Adaptogenic herbs like ashwagandha and rhodiola',
                'Nervous system downregulation through breathing and meditation',
                'Blood sugar stability throughout the day',
            ],
        },
        {
            type: 'callout',
            content: `Recovery takes time - typically 3-6 months of consistent lifestyle changes. But it's absolutely possible with the right approach!`,
            style: 'success',
        },
        {
            type: 'heading',
            content: 'Looking Ahead',
        },
        {
            type: 'text',
            content: `Next lesson: Nutrient deficiencies - why even "healthy" people are often deficient. This connects directly to stress recovery since depleted nutrients impair HPA axis function.`,
        },
    ];

    const keyTakeaways = [
        'The HPA axis controls your stress response through brain-adrenal communication',
        'HPA dysfunction progresses through alarm, resistance, and exhaustion stages',
        'The "pregnenolone steal" explains why stress causes hormone imbalances',
        'Elevated cortisol affects blood sugar, immunity, weight, sleep, and cognition',
        'Recovery requires 3-6 months of consistent lifestyle interventions',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Stress & The HPA Axis"
            lessonSubtitle="The burnout epidemic explained"
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
