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
        // BRIDGE FROM LESSON 1
        {
            type: 'intro',
            content: `{name}, remember how I mentioned that one root cause is more important than all the others? This is it. The gut. When I finally addressed MY gut issues after my husband passed... that's when everything changed. The anxiety, the exhaustion, the brain fog - they weren't just grief. They were my gut screaming for help. Let me show you what I learned...`,
        },

        // THE GAP
        {
            type: 'heading',
            content: 'Why Your Doctor Missed It',
        },
        {
            type: 'text',
            content: `Hippocrates said "All disease begins in the gut" over 2,000 years ago. Modern medicine FORGOT this. Gastroenterologists focus on diseases like Crohn's or ulcers. They're not trained to see the gut as the COMMAND CENTER of your entire body.`,
        },
        {
            type: 'before-after',
            content: '',
            before: {
                title: 'What Most People Think',
                items: [
                    'Gut = just digestion',
                    'Bloating is "normal"',
                    'Brain fog is unrelated to stomach',
                    'Mood is controlled by brain only',
                ],
            },
            after: {
                title: 'The Reality',
                items: [
                    '70-80% of immune system lives in gut',
                    '95% of serotonin made in gut',
                    'Gut-brain axis directly affects cognition',
                    'Gut bacteria influence mood, weight, energy',
                ],
            },
        },

        // THE CONCEPT - Definition Box
        {
            type: 'heading',
            content: 'The Gut: Your Second Brain',
        },
        {
            type: 'definition',
            term: 'The Gut-Brain Axis',
            content: `A bidirectional communication network between your gut and brain. Your gut contains over **500 million neurons** (more than your spinal cord!) and produces **95% of your serotonin**. When gut health suffers, the brain feels it - as brain fog, anxiety, depression, and fatigue.`,
        },
        {
            type: 'text',
            content: `This is why someone with digestive issues often has mood issues too. It's not "in their head" - it's in their GUT, affecting their head.`,
        },
        {
            type: 'key-point',
            content: `Here's what made everything click for me: The gut is responsible for **immune function** (70-80%), **mood regulation** (serotonin), **nutrient absorption**, **hormone balance**, and **detoxification**. Fix the gut, and you often fix everything else.`,
        },

        // THE 3 PILLARS
        {
            type: 'heading',
            content: 'The 3 Pillars of Gut Health',
        },
        {
            type: 'text',
            content: `I teach every client this simple framework. It makes the complex simple:`,
        },
        {
            type: 'list',
            content: '',
            items: [
                '**The Barrier** — Your gut lining is ONE cell thick. It decides what gets into your blood and what stays out. When damaged = "leaky gut" = inflammation everywhere.',
                '**The Microbiome** — Trillions of bacteria living in your gut. Good vs bad bacteria balance affects digestion, immunity, mood, and weight.',
                '**The Motility** — How food moves through your system. Too slow = toxin buildup. Too fast = nutrient loss.',
            ],
        },
        {
            type: 'callout',
            content: `When one pillar falls, the others follow. But when you restore one, the others start healing too. This is the "magic" that makes gut health specialists seem like miracle workers.`,
            style: 'success',
        },

        // LEAKY GUT - Simple explanation
        {
            type: 'heading',
            content: 'Leaky Gut: The Window Screen Analogy',
        },
        {
            type: 'text',
            content: `I explain this to every client - and now you can too. Imagine your gut lining is a window screen:`,
        },
        {
            type: 'before-after',
            content: '',
            before: {
                title: 'Healthy Screen',
                items: [
                    'Tiny holes let air through (nutrients)',
                    'Keeps bugs out (toxins, pathogens)',
                    'Strong, intact structure',
                    'Selective about what passes',
                ],
            },
            after: {
                title: 'Damaged Screen (Leaky Gut)',
                items: [
                    'Holes get bigger',
                    'Undigested food particles escape into blood',
                    'Immune system attacks these "invaders"',
                    'Chronic inflammation spreads EVERYWHERE',
                ],
            },
        },
        {
            type: 'text',
            content: `This is why someone with leaky gut might have joint pain, brain fog, skin issues, AND digestive problems. The inflammation goes systemic.`,
        },
        {
            type: 'list',
            content: '',
            items: [
                '**What damages the screen:** Gluten (for many), chronic stress, NSAIDs (ibuprofen), alcohol, processed foods, antibiotics',
                '**Signs of damage:** Food sensitivities, bloating, joint pain, brain fog, skin issues, autoimmune flares',
            ],
        },

        // THE FRAMEWORK - 5R Protocol
        {
            type: 'heading',
            content: 'The 5R Protocol™ - Your Gut Healing Framework',
        },
        {
            type: 'text',
            content: `This is THE industry-standard framework that functional medicine practitioners use worldwide. Master this, and you can help almost anyone with gut issues:`,
        },
        {
            type: 'framework',
            content: '',
            framework: {
                name: 'The 5R Protocol™',
                steps: [
                    {
                        letter: 'R',
                        title: 'Remove',
                        description: 'Eliminate triggers: inflammatory foods, pathogens, stressors, toxins. This is where elimination diets come in.',
                    },
                    {
                        letter: 'R',
                        title: 'Replace',
                        description: 'Add what\'s missing: digestive enzymes, stomach acid support (HCl), bile support for those without gallbladders.',
                    },
                    {
                        letter: 'R',
                        title: 'Reinoculate',
                        description: 'Restore good bacteria: probiotics, prebiotics, fermented foods. Rebuild the microbiome.',
                    },
                    {
                        letter: 'R',
                        title: 'Repair',
                        description: 'Heal the gut lining: L-glutamine, zinc carnosine, collagen, bone broth. Seal those "holes" in the screen.',
                    },
                    {
                        letter: 'R',
                        title: 'Rebalance',
                        description: 'Address lifestyle: sleep, stress management, movement. The gut can\'t heal in a stressed body.',
                    },
                ],
            },
        },

        // CASE STUDY
        {
            type: 'heading',
            content: 'Real Client: Amanda\'s 8-Year Mystery',
        },
        {
            type: 'text',
            content: `Amanda, 38, came to me after 8 YEARS of seeing doctors. She'd been to gastroenterologists, neurologists, endocrinologists. Thousands in tests. Here's what she was experiencing:`,
        },
        {
            type: 'list',
            content: '',
            items: [
                'Bloating so bad she looked pregnant after meals',
                'Brain fog that made her forget her kids\' schedules',
                'Crushing fatigue by 2pm every day',
                'Anxiety that started "out of nowhere" in her 30s',
            ],
        },
        {
            type: 'text',
            content: `Every doctor said: "Your labs are normal. Maybe try antidepressants?"`,
        },
        {
            type: 'text',
            content: `Using the 5R Protocol, we REMOVED inflammatory foods (gluten, dairy for 30 days). REPLACED her missing digestive enzymes. REINOCULATED with specific probiotics. REPAIRED with L-glutamine and bone broth. REBALANCED her sleep and stress.`,
        },
        {
            type: 'key-point',
            content: `Results after 90 days: Bloating GONE. Brain clear for the first time in years. Energy sustained until 8pm. Anxiety reduced by 70%. She cried on our call: "I thought this was just how I was going to feel forever. You showed me it didn't have to be."`,
        },

        // SCOPE OF PRACTICE
        {
            type: 'heading',
            content: 'Your Role vs. The Doctor\'s Role',
        },
        {
            type: 'before-after',
            content: '',
            before: {
                title: 'What Doctors Do',
                items: [
                    'Order and interpret medical tests',
                    'Diagnose SIBO, IBD, Crohn\'s, Celiac',
                    'Prescribe medications',
                    'Perform procedures (colonoscopy, etc.)',
                ],
            },
            after: {
                title: 'What You Do',
                items: [
                    'Educate on the 5R Protocol',
                    'Guide dietary and lifestyle changes',
                    'Recommend supplements (not prescribe)',
                    'Support accountability and behavior change',
                ],
            },
        },
        {
            type: 'callout',
            content: `This is why doctors LOVE working with health coaches. Client suspects gut issue → You educate and support → They work with doctor for testing → You help implement the healing protocol. You extend their capacity.`,
            style: 'info',
        },

        // CHECK YOUR KNOWLEDGE
        {
            type: 'quiz',
            content: '',
            questions: [
                {
                    question: 'What percentage of the immune system is located in the gut?',
                    options: [
                        'About 30%',
                        'About 50%',
                        'About 70-80%',
                        'About 95%',
                    ],
                    correctIndex: 2,
                    explanation: 'Approximately 70-80% of the immune system resides in the gut-associated lymphoid tissue (GALT). This is why gut health is foundational to overall health and immunity.',
                },
                {
                    question: 'In the 5R Protocol, what does the "Repair" step focus on?',
                    options: [
                        'Removing inflammatory foods',
                        'Adding probiotics',
                        'Healing the gut lining with nutrients like L-glutamine',
                        'Managing stress and sleep',
                    ],
                    correctIndex: 2,
                    explanation: 'The Repair step focuses on healing the gut lining using nutrients like L-glutamine, zinc carnosine, collagen, and bone broth. This helps "seal the holes" in a leaky gut.',
                },
            ],
        },

        // BRIDGE TO NEXT LESSON
        {
            type: 'heading',
            content: 'Coming Up: The Inflammation Connection',
        },
        {
            type: 'text',
            content: `You now understand why the gut is the foundation of health. But here's the thing - when the gut breaks down, what happens next? **Inflammation**. And not the obvious kind you can see.`,
        },
        {
            type: 'callout',
            content: `In the next lesson, you'll learn about **chronic silent inflammation** - the "invisible fire" behind heart disease, diabetes, Alzheimer's, and autoimmune conditions. This is the root cause that connects almost everything.`,
            style: 'tip',
        },
    ];

    const keyTakeaways = [
        '**70-80%** of your immune system lives in your gut',
        'The **Gut-Brain Axis** explains why gut issues cause mood and cognition problems',
        'The 3 Pillars: **Barrier** (the wall), **Microbiome** (the army), **Motility** (the movement)',
        '**Leaky gut** = damaged barrier = systemic inflammation',
        'The **5R Protocol**: Remove, Replace, Reinoculate, Repair, Rebalance',
        'You educate and support; doctors diagnose and prescribe - you **work together**',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Gut Connection"
            lessonSubtitle="Why 'all disease begins in the gut' - and how to heal it"
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
