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
        // BRIDGE FROM LESSON 6
        {
            type: 'intro',
            content: `{name}, in the last lesson you learned about functional vs conventional ranges. Now let's put that into practice. This is the skill that separates premium practitioners from basic coaches: **reading labs like a detective**. When you can look at someone's labs and say "I see why you feel terrible" - you become invaluable.`,
        },

        // THE GAP
        {
            type: 'heading',
            content: 'Why "Normal" Labs Mean Nothing',
        },
        {
            type: 'definition',
            term: 'Lab Reference Ranges',
            content: `Conventional "normal" ranges are calculated from the **average of the population** - which includes sick people. They're designed to detect **disease** (diabetes, anemia), not **dysfunction** (pre-diabetes, suboptimal iron). You can be "normal" for 10 years while your health slowly deteriorates.`,
        },
        {
            type: 'key-point',
            content: `Example: **TSH** (thyroid). Conventional range: 0.5 - 4.5. Functional optimal: 1.0 - 2.5. Someone at TSH 3.8 is "normal" but their thyroid is already struggling. They have symptoms. Doctors say nothing is wrong. YOU can see the problem developing.`,
        },

        // THE 5 MARKERS FRAMEWORK
        {
            type: 'heading',
            content: 'The 5 Functional Markers You MUST Know',
        },
        {
            type: 'text',
            content: `These 5 markers tell you more about someone's health than all other markers combined:`,
        },
        {
            type: 'framework',
            content: '',
            framework: {
                name: 'The 5 Key Markers',
                steps: [
                    {
                        letter: '1',
                        title: 'Fasting Insulin (Metabolism)',
                        description: 'Conventional: 2.6-24.9. Optimal: 2-6. Above 6 = insulin resistance. Catches diabetes 10+ years before glucose goes high.',
                    },
                    {
                        letter: '2',
                        title: 'hsCRP (Inflammation)',
                        description: 'Conventional: <3.0. Optimal: <1.0. Above 1 = chronic inflammation. Predicts heart disease and cancer risk.',
                    },
                    {
                        letter: '3',
                        title: 'Homocysteine (Methylation)',
                        description: 'Conventional: 5-15. Optimal: 6-8. Above 10 = cardiovascular risk, B vitamin issues. Below 6 = over-methylation.',
                    },
                    {
                        letter: '4',
                        title: 'Ferritin (Iron/Inflammation)',
                        description: 'Conventional: 12-150 (women). Optimal: 50-100. Below 50 = fatigue, hair loss. Above 150 = inflammation or iron overload.',
                    },
                    {
                        letter: '5',
                        title: 'TSH (Thyroid)',
                        description: 'Conventional: 0.5-4.5. Optimal: 1.0-2.5. Above 2.5 = thyroid struggling. Most fatigued women have suboptimal thyroid.',
                    },
                ],
            },
        },

        // PATTERN RECOGNITION
        {
            type: 'heading',
            content: 'Pattern Recognition: The Art of Connection',
        },
        {
            type: 'text',
            content: `Great practitioners don't just read individual markers. They see **patterns** that tell stories:`,
        },
        {
            type: 'list',
            content: '',
            items: [
                '**High insulin + High triglycerides + Low HDL** = Metabolic syndrome developing',
                '**High hsCRP + Low vitamin D + Elevated TSH** = Inflammation driving thyroid issues',
                '**Low ferritin + Low B12 + GI symptoms** = Gut absorption problem',
                '**High homocysteine + Fatigue + Mood issues** = Methylation dysfunction',
            ],
        },
        {
            type: 'callout',
            content: `When you can say: "I see your inflammation is elevated, your vitamin D is low, and your thyroid is struggling - and they're all CONNECTED. Here's why and here's what we can do..." - you become their most trusted health resource.`,
            style: 'success',
        },

        // CASE STUDY
        {
            type: 'heading',
            content: 'Real Client: Janet\'s "Perfect" Labs',
        },
        {
            type: 'text',
            content: `Janet, 48, came to me frustrated. Her doctor said her labs were "perfect." She felt terrible:`,
        },
        {
            type: 'list',
            content: '',
            items: [
                'Exhausted by noon every day',
                'Brain fog worsening',
                'Weight creeping up despite exercise',
                'Mood swings and anxiety',
            ],
        },
        {
            type: 'before-after',
            content: '',
            before: {
                title: 'Doctor\'s View ("Perfect")',
                items: [
                    'TSH: 3.2 (range 0.5-4.5) ✓',
                    'Fasting glucose: 95 (range <100) ✓',
                    'Vitamin D: 35 (range 30-100) ✓',
                    'hsCRP: 2.1 (range <3.0) ✓',
                ],
            },
            after: {
                title: 'Functional View (Pattern)',
                items: [
                    'TSH: 3.2 → Thyroid struggling (optimal 1-2.5)',
                    'Glucose: 95 → Needs insulin check (pre-diabetes?)',
                    'Vitamin D: 35 → Suboptimal (want 50-70)',
                    'hsCRP: 2.1 → Inflammation present (want <1)',
                ],
            },
        },
        {
            type: 'key-point',
            content: `The pattern: **Inflammation (hsCRP) → Low vitamin D → Thyroid dysfunction → Fatigue + weight gain**. They're all connected! When we addressed the inflammation and vitamin D, her TSH improved without thyroid medication. This is the power of pattern thinking.`,
        },

        // SCOPE OF PRACTICE
        {
            type: 'heading',
            content: 'Your Role: Educate, Not Diagnose',
        },
        {
            type: 'before-after',
            content: '',
            before: {
                title: 'What Doctors Do',
                items: [
                    'Order labs',
                    'Diagnose diseases',
                    'Prescribe medications',
                    'Use "normal" to rule out disease',
                ],
            },
            after: {
                title: 'What You Do',
                items: [
                    'Review labs client already has',
                    'Educate on optimal vs normal ranges',
                    'Identify patterns suggesting root causes',
                    'Recommend they discuss with their doctor',
                ],
            },
        },
        {
            type: 'callout',
            content: `You're a "second set of educated eyes." You don't order labs or diagnose. You EDUCATE on what the numbers might mean and suggest they discuss concerns with their doctor. That's completely within scope.`,
            style: 'info',
        },

        // CHECK YOUR KNOWLEDGE
        {
            type: 'quiz',
            content: '',
            questions: [
                {
                    question: 'When interpreting labs from a functional perspective, which approach is most accurate?',
                    options: [
                        'Only look at values flagged as "high" or "low"',
                        'Use optimal ranges and look for patterns across multiple markers',
                        'Ignore all labs and rely solely on symptoms',
                        'Only consider labs taken in a hospital',
                    ],
                    correctIndex: 1,
                    explanation: 'Functional practitioners use optimal ranges (narrower than conventional) and look for patterns across multiple markers to identify dysfunction before it becomes disease.',
                },
                {
                    question: 'What pattern might indicate inflammation driving thyroid issues?',
                    options: [
                        'Low insulin + High HDL',
                        'High hsCRP + Low vitamin D + Elevated TSH',
                        'Normal glucose + Normal ferritin',
                        'Low homocysteine only',
                    ],
                    correctIndex: 1,
                    explanation: 'High hsCRP (inflammation) + Low vitamin D + Elevated TSH suggests inflammation is disrupting thyroid function. Address the inflammation and vitamin D first, and thyroid often improves.',
                },
            ],
        },

        // BRIDGE TO NEXT LESSON
        {
            type: 'heading',
            content: 'Coming Up: Finding Your First Clients',
        },
        {
            type: 'text',
            content: `You now have genuine clinical knowledge - root causes, frameworks, lab interpretation. You're ready to help real people. The final lesson: **how to actually find clients** without spending on ads.`,
        },
        {
            type: 'callout',
            content: `Next lesson: Why your story is your best marketing. The fastest path to your first client. And how to build trust before anyone pays you.`,
            style: 'tip',
        },
    ];

    const keyTakeaways = [
        '**"Normal" ranges** detect disease; **Functional ranges** catch dysfunction years earlier',
        'The **5 Key Markers**: Fasting Insulin, hsCRP, Homocysteine, Ferritin, TSH',
        '**Pattern recognition** is more valuable than single marker analysis',
        'Look for connections - inflammation, nutrients, and hormones affect each other',
        'You EDUCATE on labs; doctors ORDER labs and DIAGNOSE',
        'Being a "second set of educated eyes" is incredibly valuable to clients',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Lab Interpretation Secrets"
            lessonSubtitle="See what doctors miss - and why it matters"
            totalLessons={totalLessons}
            sections={sections}
            keyTakeaways={keyTakeaways}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
            niche="functional-medicine"
            nicheLabel="Functional Medicine Diploma"
            baseUrl="/portal/functional-medicine"
            courseSlug="functional-medicine-complete-certification"
        />
    );
}
