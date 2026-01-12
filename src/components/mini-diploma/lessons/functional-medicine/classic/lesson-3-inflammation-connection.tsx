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

export function ClassicLessonInflammationConnection({
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
            content: `Hey {name}! Today we're tackling the BIG one: Chronic inflammation. If there's ONE concept that explains most chronic disease, it's inflammation. Let's break it down.`,
        },
        {
            type: 'heading',
            content: 'Acute vs. Chronic Inflammation',
        },
        {
            type: 'text',
            content: `Not all inflammation is bad. Acute inflammation is your body's healthy response - it helps heal a cut or fight an infection. Chronic inflammation, however, is a different story. It's low-grade, constant, and "silent" - like a fire that never goes out, slowly damaging tissues over years.`,
        },
        {
            type: 'key-point',
            content: `Chronic inflammation is linked to heart disease, autoimmune conditions, depression, brain fog, diabetes, Alzheimer's, cancer, and obesity. It's the common thread in virtually all chronic disease.`,
        },
        {
            type: 'heading',
            content: 'The Inflammation Cascade',
        },
        {
            type: 'text',
            content: `Understanding how inflammation develops helps us know where to intervene:`,
        },
        {
            type: 'list',
            content: 'The cascade:',
            items: [
                'Trigger appears (toxin, food, stress, or infection)',
                'Immune system activates in response',
                'Inflammatory cytokines are released',
                'Tissue damage occurs over time',
                'Disease eventually manifests',
            ],
        },
        {
            type: 'callout',
            content: `By the time someone gets a diagnosis, inflammation has been building for YEARS. We need to intervene upstream! This is why Functional Medicine is so powerful - we don't wait for disease, we address inflammation early.`,
            style: 'warning',
        },
        {
            type: 'heading',
            content: 'Top Inflammation Triggers',
        },
        {
            type: 'list',
            content: 'The main drivers:',
            items: [
                'Sugar and refined carbs - Spike blood sugar, trigger inflammation',
                'Processed seed oils - Create omega-6 overload',
                'Chronic stress - Leads to cortisol dysregulation',
                'Poor sleep - Lost recovery time for the body',
                'Gut dysfunction - Leaky gut causes systemic inflammation',
                'Toxin exposure - Heavy metals, mold, environmental chemicals',
            ],
        },
        {
            type: 'text',
            content: `Notice how these are all lifestyle factors? That's the good news - inflammation is MODIFIABLE. You can help clients reverse it through targeted interventions.`,
        },
        {
            type: 'heading',
            content: 'Anti-Inflammatory Protocol Foundation',
        },
        {
            type: 'list',
            content: 'Core interventions:',
            items: [
                'Remove inflammatory foods (sugar, seed oils, processed foods)',
                'Add anti-inflammatory foods (omega-3s, vegetables, turmeric)',
                'Manage stress through HPA axis support',
                'Prioritize sleep (7-9 hours nightly)',
                'Heal the gut using the 5R protocol',
            ],
        },
        {
            type: 'quote',
            content: `When you help clients reduce chronic inflammation, EVERYTHING gets better. Energy, mood, weight, pain... it's remarkable to witness these transformations.`,
        },
        {
            type: 'heading',
            content: 'Looking Ahead',
        },
        {
            type: 'text',
            content: `Next lesson, we'll explore the toxin burden that's silently affecting almost everyone in our modern world. Understanding toxin exposure is essential for addressing chronic inflammation at its source.`,
        },
    ];

    const keyTakeaways = [
        'Acute inflammation heals; chronic inflammation destroys',
        'Chronic inflammation is the common thread in most modern diseases',
        'By the time disease is diagnosed, inflammation has been building for years',
        'Major triggers include sugar, processed oils, stress, poor sleep, and gut dysfunction',
        'Inflammation is modifiable through diet, lifestyle, and targeted interventions',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Inflammation Connection"
            lessonSubtitle="The silent driver of chronic disease"
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
