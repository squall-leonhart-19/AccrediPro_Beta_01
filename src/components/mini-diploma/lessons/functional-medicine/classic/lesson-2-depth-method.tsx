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

export function ClassicLessonDEPTHMethod({
    lessonNumber,
    totalLessons = 3,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const sections: LessonSection[] = [
        // INTRO
        {
            type: 'intro',
            content: `Welcome back, {name}! In Lesson 1 you learned the 5 root causes of chronic disease. Now I'm going to give you the exact framework I use with EVERY client - and the one that took me from scared beginner to a practitioner earning $5-10K+ monthly from home.`,
        },
        {
            type: 'key-point',
            content: `This is the D.E.P.T.H. Method\u2122 - the step-by-step system that over 200 ASI graduates use to get real, measurable results for their clients. When you master this, you'll never feel "lost" with a client again.`,
        },

        // WHY A FRAMEWORK MATTERS
        {
            type: 'heading',
            content: 'Why Most New Coaches Fail (And How to Avoid It)',
        },
        {
            type: 'text',
            content: `Here's a secret the health & wellness industry doesn't tell you: The #1 reason new coaches fail isn't lack of knowledge. It's lack of a SYSTEM.`,
        },
        {
            type: 'text',
            content: `Without a framework, every client feels like starting from scratch. You second-guess yourself. You waste time researching instead of coaching. Your clients sense your uncertainty and don't stay.`,
        },
        {
            type: 'text',
            content: `With the D.E.P.T.H. Method\u2122, you have a proven roadmap for EVERY client, regardless of their health issue. Confidence replaces confusion. Results replace guesswork.`,
        },

        // THE D.E.P.T.H. FRAMEWORK
        {
            type: 'heading',
            content: 'The D.E.P.T.H. Method\u2122',
        },
        {
            type: 'text',
            content: `This is the exact 5-step framework that transformed me from overwhelmed beginner to a practitioner with a waiting list. Now thousands of ASI graduates use this same method.`,
        },
        {
            type: 'framework',
            content: '',
            framework: {
                name: 'The D.E.P.T.H. Method\u2122',
                steps: [
                    {
                        letter: 'D',
                        title: 'Discover',
                        description: 'Deep-dive into your client\'s full health story. Go beyond symptoms to understand lifestyle, stress, diet, sleep, relationships, and history. This is where you find clues that doctors miss in their 7-minute appointments.',
                    },
                    {
                        letter: 'E',
                        title: 'Evaluate',
                        description: 'Assess which of the 5 root causes (Gut, Inflammation, Toxins, Nutrients, HPA Axis) are likely involved. Use intake forms, symptom questionnaires, and timeline analysis to connect the dots.',
                    },
                    {
                        letter: 'P',
                        title: 'Pinpoint',
                        description: 'Identify the specific root causes and imbalances unique to THIS client. No two people are the same. This personalized approach is why functional health coaching gets results where cookie-cutter programs fail.',
                    },
                    {
                        letter: 'T',
                        title: 'Transform',
                        description: 'Create a personalized nutrition and lifestyle protocol. Small, sustainable changes that compound over time. No extreme diets or overwhelming programs - just targeted shifts that address the root causes you pinpointed.',
                    },
                    {
                        letter: 'H',
                        title: 'Heal',
                        description: 'Monitor progress, adjust protocols, and guide your client through their healing journey. This ongoing support is why clients stay 4-6 months (not 1-2 sessions) and why your income grows month after month.',
                    },
                ],
            },
        },

        // EACH STEP IN DEPTH
        {
            type: 'heading',
            content: 'D \u2014 Discover: The Art of the Health Story',
        },
        {
            type: 'text',
            content: `Most practitioners jump straight to solutions. That's backwards. The Discover phase is where you spend 60-90 minutes learning your client's FULL story. This single step sets you apart from 95% of coaches.`,
        },
        {
            type: 'list',
            content: '',
            items: [
                '**Health timeline** \u2014 When did symptoms start? What was happening in their life?',
                '**Daily habits** \u2014 Sleep, meals, exercise, stress management (or lack of)',
                '**Environmental factors** \u2014 Toxin exposure, mold, water quality, work stress',
                '**Emotional history** \u2014 Trauma, grief, chronic stress (this is HUGE and often overlooked)',
                '**What they\'ve already tried** \u2014 This tells you what hasn\'t worked and WHY',
            ],
        },
        {
            type: 'callout',
            content: `My client Sarah K. told me: "You're the first person in 5 years of doctor visits who actually LISTENED to my whole story. That alone made me feel better." This is your superpower as a coach - you have TIME.`,
            style: 'success',
        },

        // E - EVALUATE
        {
            type: 'heading',
            content: 'E \u2014 Evaluate: Connecting the Dots',
        },
        {
            type: 'text',
            content: `Once you have their full story, you map their symptoms to the 5 root causes. This is pattern recognition, and it gets easier with every client you work with.`,
        },
        {
            type: 'before-after',
            content: '',
            before: {
                title: 'Client Says...',
                items: [
                    '"I\'m bloated after every meal"',
                    '"I catch every cold"',
                    '"I\'m exhausted by 2pm"',
                    '"I can\'t think straight anymore"',
                ],
            },
            after: {
                title: 'You Evaluate...',
                items: [
                    'Gut dysfunction (digestion, microbiome)',
                    'Immune system \u2192 70% lives in gut',
                    'HPA axis / cortisol + nutrient status',
                    'Inflammation + B vitamin / iron levels',
                ],
            },
        },

        // P - PINPOINT
        {
            type: 'heading',
            content: 'P \u2014 Pinpoint: Your Client\'s Unique Root Cause Map',
        },
        {
            type: 'text',
            content: `This is where the D.E.P.T.H. Method\u2122 becomes PERSONAL. Two clients can have the same symptom (fatigue) but completely different root causes. Your job is to pinpoint what's driving THIS person's issues.`,
        },
        {
            type: 'example',
            content: `**Example:** Both Jessica (34) and Karen (52) came to me exhausted.\n\n**Jessica's root causes:** Gut inflammation from food sensitivities + chronic stress from toxic work environment.\n\n**Karen's root causes:** Nutrient deficiencies (iron, B12, vitamin D) + HPA axis burnout from years of caregiving.\n\nSame symptom. Different root causes. Different protocols. BOTH transformed in 90 days.`,
        },

        // T - TRANSFORM
        {
            type: 'heading',
            content: 'T \u2014 Transform: The Personalized Protocol',
        },
        {
            type: 'text',
            content: `Now you create a customized plan. The key word is SUSTAINABLE. You're not prescribing extreme diets or 20-supplement protocols. You're making targeted changes that address the specific root causes you pinpointed.`,
        },
        {
            type: 'list',
            content: '',
            items: [
                '**Nutrition shifts** \u2014 Not a diet. Targeted food swaps based on their root causes.',
                '**Lifestyle changes** \u2014 Sleep hygiene, stress management, movement that fits THEIR life.',
                '**Environmental adjustments** \u2014 Reducing toxin exposure in practical, achievable ways.',
                '**Targeted support** \u2014 Evidence-based recommendations within your scope of practice.',
            ],
        },

        // H - HEAL
        {
            type: 'heading',
            content: 'H \u2014 Heal: Ongoing Support & Income Growth',
        },
        {
            type: 'text',
            content: `This final step is where the MAGIC happens \u2014 for your clients AND your income. Healing takes time, and your clients need ongoing guidance. This is why functional health coaching creates RECURRING revenue.`,
        },
        {
            type: 'callout',
            content: `Most clients work with you for 3-6 months at $200-500/month. That means each client is worth $600-$3,000 to your business. Just 10 active clients = $2,000-$5,000+/month. And they refer their friends.`,
            style: 'success',
        },

        // QUIZ
        {
            type: 'quiz',
            content: '',
            questions: [
                {
                    question: 'What does D.E.P.T.H. stand for?',
                    options: [
                        'Diagnose, Examine, Prescribe, Treat, Heal',
                        'Discover, Evaluate, Pinpoint, Transform, Heal',
                        'Detect, Eliminate, Prevent, Test, Help',
                        'Document, Explore, Plan, Track, Hypothesize',
                    ],
                    correctIndex: 1,
                    explanation: 'The D.E.P.T.H. Method\u2122 stands for Discover, Evaluate, Pinpoint, Transform, Heal - a comprehensive framework for guiding clients through their health transformation journey.',
                },
                {
                    question: 'In the D.E.P.T.H. Method, what happens during the "Pinpoint" phase?',
                    options: [
                        'You create a general wellness plan for all clients',
                        'You identify the specific root causes unique to each client',
                        'You prescribe medication based on symptoms',
                        'You schedule follow-up appointments',
                    ],
                    correctIndex: 1,
                    explanation: 'The Pinpoint phase is where you identify the specific root causes and imbalances that are unique to each individual client - this is what makes functional health coaching personalized and effective.',
                },
            ],
        },

        // BRIDGE TO L3
        {
            type: 'heading',
            content: 'Coming Up: How To Get Your First Clients',
        },
        {
            type: 'text',
            content: `You now have the complete D.E.P.T.H. Method\u2122 framework. But knowledge without clients is just a hobby. In the next lesson, I'll show you exactly how to get your first paying clients - without spending a dime on advertising.`,
        },
        {
            type: 'callout',
            content: `Most of my students get their first client within 2-4 weeks of completing the certification. The next lesson gives you the exact strategy that makes that possible. Don't stop now, {name} - you're almost certified!`,
            style: 'tip',
        },
    ];

    const keyTakeaways = [
        'The D.E.P.T.H. Method\u2122: **Discover \u2192 Evaluate \u2192 Pinpoint \u2192 Transform \u2192 Heal**',
        'A proven framework eliminates guesswork and builds client confidence',
        'Each client is unique \u2014 same symptoms can have different root causes',
        'Sustainable changes beat extreme protocols every time',
        'The Heal phase creates recurring revenue: 3-6 months per client at $200-500/month',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The D.E.P.T.H. Method\u2122"
            lessonSubtitle="The exact 5-step framework that creates $5K+/month coaches"
            totalLessons={totalLessons}
            sections={sections}
            keyTakeaways={keyTakeaways}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
            niche="functional-medicine"
            nicheLabel="Functional Medicine Certification"
            baseUrl="/portal/functional-medicine"
            courseSlug="functional-medicine-complete-certification"
        />
    );
}
