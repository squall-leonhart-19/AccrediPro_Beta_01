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
        // BRIDGE FROM LESSON 3
        {
            type: 'intro',
            content: `{name}, you just learned that toxin exposure is one of the 6 inflammation triggers. Now I need to tell you something uncomfortable. It might make you angry. By the time you finished your morning routine today, you were exposed to over **200 synthetic chemicals**. Before breakfast.`,
        },

        // THE GAP
        {
            type: 'heading',
            content: 'The Uncomfortable Truth',
        },
        {
            type: 'definition',
            term: 'Toxic Burden',
            content: `The cumulative amount of toxins your body is storing and struggling to process. Modern humans carry **hundreds of synthetic chemicals** in their blood and tissues that didn't exist 100 years ago. The liver can only process so much - when overwhelmed, toxins get stored in fat tissue.`,
        },
        {
            type: 'list',
            content: '',
            items: [
                '**80,000+** synthetic chemicals in our environment',
                'Only **200** have been tested for human safety',
                'Average person: **200+ chemical exposures** before breakfast',
                'Newborns: **287 chemicals** detected in umbilical cord blood',
                '**50%** of US buildings have mold problems',
            ],
        },
        {
            type: 'callout',
            content: `This isn't paranoia. It's the explanation for why so many people feel terrible despite "doing everything right." The toxin connection is often the missing piece.`,
            style: 'warning',
        },

        // THE 5 CATEGORIES
        {
            type: 'heading',
            content: 'The 5 Major Toxin Categories',
        },
        {
            type: 'text',
            content: `When a client comes to you with "mystery symptoms" that no doctor can explain, one of these 5 categories is often involved:`,
        },
        {
            type: 'framework',
            content: '',
            framework: {
                name: 'The 5 Toxin Categories',
                steps: [
                    {
                        letter: '1',
                        title: 'Heavy Metals',
                        description: 'Lead, mercury, arsenic, cadmium. Sources: Fish, dental fillings, old paint, water. Signs: brain fog, fatigue, mood issues.',
                    },
                    {
                        letter: '2',
                        title: 'Mold & Mycotoxins',
                        description: 'From water-damaged buildings (50% of US buildings!). Often invisible. Signs: fatigue, brain fog, respiratory issues, anxiety.',
                    },
                    {
                        letter: '3',
                        title: 'Pesticides & Herbicides',
                        description: 'Glyphosate in 80% of food supply. Stored in fat tissue for years. Signs: gut issues, hormone disruption.',
                    },
                    {
                        letter: '4',
                        title: 'Plastics & Endocrine Disruptors',
                        description: 'BPA, phthalates in containers, receipts, cosmetics. Mimic estrogen. Signs: weight gain, hormone issues.',
                    },
                    {
                        letter: '5',
                        title: 'Household Chemicals',
                        description: 'Average home has 62 toxic chemicals. Cleaning products, air fresheners, candles. Signs: headaches, respiratory issues.',
                    },
                ],
            },
        },

        // LIVER DETOX SCIENCE
        {
            type: 'heading',
            content: 'Why Most "Detox" Programs Are Dangerous',
        },
        {
            type: 'text',
            content: `Here's something most wellness influencers don't understand. Your liver detoxifies in **2 phases**:`,
        },
        {
            type: 'before-after',
            content: '',
            before: {
                title: 'Phase 1: Activation',
                items: [
                    'Toxins get "activated" (made water-soluble)',
                    'Requires B vitamins, glutathione',
                    'PROBLEM: Activated toxins are MORE harmful',
                    'They must move quickly to Phase 2',
                ],
            },
            after: {
                title: 'Phase 2: Conjugation',
                items: [
                    'Activated toxins get "packaged" for removal',
                    'Requires amino acids, sulfur compounds',
                    'Toxins exit via bile, urine, sweat',
                    'If blocked → toxins recirculate',
                ],
            },
        },
        {
            type: 'callout',
            content: `THE DANGER: Most juice cleanses and "detox teas" speed up Phase 1 WITHOUT supporting Phase 2. Activated toxins build up, making you feel WORSE. It's like mopping the floor while the faucet is still running. This is why clients need an educated coach - not an Instagram detox.`,
            style: 'warning',
        },

        // SAFE APPROACH
        {
            type: 'heading',
            content: 'The Safe Approach: Reduce & Support',
        },
        {
            type: 'text',
            content: `Instead of aggressive "detoxing," you'll help clients with a two-pronged approach:`,
        },
        {
            type: 'list',
            content: '',
            items: [
                '**REDUCE EXPOSURE** — Identify and eliminate toxin sources (water, food, products, environment)',
                '**SUPPORT PATHWAYS** — Ensure both liver phases work properly through nutrition and lifestyle',
            ],
        },
        {
            type: 'list',
            content: '',
            items: [
                'Clean water (filtered)',
                'Organic food when possible (especially the "Dirty Dozen")',
                'Cruciferous vegetables (broccoli, cabbage) for liver support',
                'Adequate protein for Phase 2 amino acids',
                'Sweating (sauna, exercise) for excretion',
                'Good bowel movements (or toxins recirculate)',
            ],
        },

        // CASE STUDY
        {
            type: 'heading',
            content: 'Real Client: Laura\'s "Mystery Illness"',
        },
        {
            type: 'text',
            content: `Laura, 41, came to me after seeing 11 specialists over 3 years. None could explain her symptoms:`,
        },
        {
            type: 'list',
            content: '',
            items: [
                'Crushing fatigue (could barely get through work)',
                'Brain fog so bad she forgot mid-sentence',
                'Anxiety that started "out of nowhere"',
                'Respiratory issues, constant congestion',
                'Labs always came back "normal"',
            ],
        },
        {
            type: 'text',
            content: `I asked one question no doctor had asked: "Have you had any water damage in your home?" Her eyes went wide. "We had a leak in the basement 2 years ago. We cleaned it up ourselves..."`,
        },
        {
            type: 'key-point',
            content: `Mold. Hidden behind drywall. 3 months after proper remediation and supporting her detox pathways, Laura was 80% better. She cried on our call: "You found in one session what 11 doctors missed in 3 years."`,
        },

        // SCOPE OF PRACTICE
        {
            type: 'heading',
            content: 'Your Role: Education & Prevention',
        },
        {
            type: 'before-after',
            content: '',
            before: {
                title: 'What Doctors Do',
                items: [
                    'Order heavy metal or mold testing',
                    'Diagnose mold illness or toxicity',
                    'Prescribe chelation therapy',
                    'Create medical detox protocols',
                ],
            },
            after: {
                title: 'What You Do',
                items: [
                    'Educate on toxin sources',
                    'Guide home environment cleanup',
                    'Recommend supportive nutrition',
                    'Suggest safer product alternatives',
                ],
            },
        },
        {
            type: 'callout',
            content: `Client suspects mold issue → You educate and guide lifestyle changes → Doctor orders testing if needed → You help implement recovery protocol. This is environmental health education - legal in all 50 states.`,
            style: 'info',
        },

        // CHECK YOUR KNOWLEDGE
        {
            type: 'quiz',
            content: '',
            questions: [
                {
                    question: 'Why are most "detox" programs dangerous?',
                    options: [
                        'They don\'t use enough supplements',
                        'They speed up Phase 1 without supporting Phase 2',
                        'They are too slow to work',
                        'They require medical supervision',
                    ],
                    correctIndex: 1,
                    explanation: 'Juice cleanses and detox teas often speed up Phase 1 (activation) without supporting Phase 2 (conjugation). This causes activated toxins to build up, making people feel worse rather than better.',
                },
                {
                    question: 'What percentage of US buildings have mold problems?',
                    options: [
                        '10%',
                        '25%',
                        '50%',
                        '75%',
                    ],
                    correctIndex: 2,
                    explanation: 'Approximately 50% of US buildings have mold problems. This is why mold is one of the most commonly overlooked causes of "mystery symptoms" like fatigue, brain fog, and anxiety.',
                },
            ],
        },

        // BRIDGE TO NEXT LESSON
        {
            type: 'heading',
            content: 'Coming Up: Stress & The HPA Axis',
        },
        {
            type: 'text',
            content: `You now understand the toxin connection that most practitioners miss entirely. Next, we're tackling the root cause that affects EVERYONE: **chronic stress**.`,
        },
        {
            type: 'callout',
            content: `77% of Americans experience physical symptoms from stress. The **HPA axis** (your body's stress response system) is behind burnout, weight gain, insomnia, and hormone issues. Master this, and you can help almost anyone.`,
            style: 'tip',
        },
    ];

    const keyTakeaways = [
        '**80,000+** synthetic chemicals exist, only 200 tested for safety',
        '5 toxin categories: Heavy metals, Mold, Pesticides, Plastics, Household chemicals',
        'Liver detox has **2 phases** - both must be supported',
        'Most "detox" programs are dangerous - they speed Phase 1 only',
        'The safe approach: **Reduce exposure** + **Support pathways**',
        'You educate on sources and prevention; doctors diagnose and treat',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Toxin Reality"
            lessonSubtitle="What 80,000 chemicals are doing to your clients"
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
