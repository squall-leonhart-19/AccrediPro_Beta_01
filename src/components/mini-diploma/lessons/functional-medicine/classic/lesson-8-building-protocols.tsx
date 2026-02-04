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

export function ClassicLessonBuildingProtocols({
    lessonNumber,
    totalLessons = 9,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const sections: LessonSection[] = [
        // BRIDGE FROM LESSON 7
        {
            type: 'intro',
            content: `{name}, let's talk about something that holds people back: "Who would actually pay me?" This is the #1 fear. And I get it. I had it too. But here's what I've learned: Your ideal clients are **everywhere**. You just don't know how to see them yet.`,
        },

        // THE GAP
        {
            type: 'heading',
            content: 'Who Is Looking For You Right Now',
        },
        {
            type: 'text',
            content: `These people are on YOUR Facebook. In your neighborhood. At your gym. They're waiting for someone who will LISTEN:`,
        },
        {
            type: 'list',
            content: '',
            items: [
                'Women 40-60 who\'ve tried everything and still feel terrible',
                'People told **"your labs are normal"** but know something is wrong',
                'Busy professionals exhausted despite "doing everything right"',
                'Health-conscious people who want to **PREVENT** disease',
                'People tired of 7-minute doctor visits that solve nothing',
            ],
        },
        {
            type: 'callout',
            content: `These are real people with real problems. They don't need another generic health tip. They need someone who understands **root causes** - and that's now YOU.`,
            style: 'tip',
        },

        // THE MINDSET SHIFT
        {
            type: 'heading',
            content: 'What Clients Actually Pay For',
        },
        {
            type: 'definition',
            term: 'Value vs. Credentials',
            content: `People don't pay for certifications or titles. They pay for **solutions** to their problems. Your certification gives you confidence and credibility. But your VALUE comes from your knowledge, your ability to help, and your willingness to listen.`,
        },
        {
            type: 'before-after',
            content: '',
            before: {
                title: 'What You Think Matters',
                items: [
                    'Years of experience',
                    'Advanced degrees',
                    'Extensive credentials',
                    'Fancy office',
                ],
            },
            after: {
                title: 'What Actually Matters',
                items: [
                    'Can you help them feel better?',
                    'Do you understand their problem?',
                    'Will you actually listen?',
                    'Are you trustworthy?',
                ],
            },
        },

        // THE FRAMEWORK - 90 Day Timeline
        {
            type: 'heading',
            content: 'The 90-Day Client Acquisition Timeline',
        },
        {
            type: 'text',
            content: `Here's a realistic timeline for finding your first clients:`,
        },
        {
            type: 'framework',
            content: '',
            framework: {
                name: 'The 90-Day Path',
                steps: [
                    {
                        letter: '1',
                        title: 'Days 1-30: Foundation',
                        description: 'Finish certification. Choose your niche (gut? burnout? inflammation?). Create a simple offer. Tell 20 people what you\'re doing. Offer 3 FREE discovery calls to practice.',
                    },
                    {
                        letter: '2',
                        title: 'Days 31-60: First Clients',
                        description: 'Convert 2-3 discovery calls into clients. Start at reduced rate to build confidence. Document their results for testimonials. Ask for referrals after session 3.',
                    },
                    {
                        letter: '3',
                        title: 'Days 61-90: Momentum',
                        description: 'Raise to full pricing. Ask happy clients for referrals. Get listed in directories. Consider a workshop or webinar. Aim: 5-8 paying clients by Day 90.',
                    },
                ],
            },
        },

        // WHERE TO FIND CLIENTS
        {
            type: 'heading',
            content: 'Where to Find Your First Clients (Free)',
        },
        {
            type: 'list',
            content: '',
            items: [
                '**Your existing network** — Friends, family, coworkers who know you care about health',
                '**Social media** — Post about your journey, share what you\'re learning',
                '**Local groups** — Networking groups, women\'s groups, community organizations',
                '**Referrals** — THE #1 source once you have happy clients',
            ],
        },
        {
            type: 'text',
            content: `Over time, build these additional channels:`,
        },
        {
            type: 'list',
            content: '',
            items: [
                '**Practitioner directories** — Health Coach Alliance, Psychology Today',
                '**Google Business Profile** — Free and powerful for local searches',
                '**Partnerships** — MDs, chiropractors, acupuncturists who need referral partners',
                '**Workshops** — Yoga studios, gyms, wellness centers',
            ],
        },

        // THE POWER OF YOUR STORY
        {
            type: 'heading',
            content: 'Your Story Is Your Best Marketing',
        },
        {
            type: 'text',
            content: `Remember Sarah's story from Lesson 1? Her personal transformation is what makes people trust her. YOUR story works the same way:`,
        },
        {
            type: 'list',
            content: '',
            items: [
                '**If you struggled with fatigue** → You understand exhausted women',
                '**If you dealt with gut issues** → You can help others heal their gut',
                '**If you experienced burnout** → Burned-out professionals trust you',
                '**If you felt dismissed by doctors** → You connect with the "not heard" crowd',
            ],
        },
        {
            type: 'callout',
            content: `Your struggle isn't a weakness. It's your **credential**. Clients trust practitioners who've walked their path. Share your journey authentically - it builds trust faster than any certification.`,
            style: 'success',
        },

        // DON'T WAIT
        {
            type: 'heading',
            content: 'The "I\'m Not Ready" Trap',
        },
        {
            type: 'key-point',
            content: `You will **never feel "ready."** That feeling doesn't come from more learning - it comes from **doing**. You already know more about root-cause health than 99% of people. Start with someone who trusts you. Help them. Get results. Build from there.`,
        },

        // CHECK YOUR KNOWLEDGE
        {
            type: 'quiz',
            content: '',
            questions: [
                {
                    question: 'What do clients actually pay for?',
                    options: [
                        'Years of experience and advanced degrees',
                        'A fancy office and impressive credentials',
                        'Solutions to their problems and someone who listens',
                        'The lowest price possible',
                    ],
                    correctIndex: 2,
                    explanation: 'Clients pay for SOLUTIONS and someone who actually understands and listens to them. Your ability to help matters more than credentials.',
                },
                {
                    question: 'What becomes your #1 client source once you start?',
                    options: [
                        'Paid advertising',
                        'Social media followers',
                        'Referrals from happy clients',
                        'Directory listings',
                    ],
                    correctIndex: 2,
                    explanation: 'Referrals from happy clients become your best source of new clients. When someone gets results working with you, they tell their friends, family, and coworkers.',
                },
            ],
        },

        // BRIDGE TO FINAL LESSON
        {
            type: 'heading',
            content: 'Coming Up: Your Path Forward',
        },
        {
            type: 'text',
            content: `You've now completed the core education. You understand the **5 Root Causes**, the **R.O.O.T Method**, lab interpretation, and how to find clients. In our final lesson, we'll cover **scope of practice** and your next steps.`,
        },
        {
            type: 'callout',
            content: `Next lesson: What you CAN and CAN'T do legally. How to partner with doctors. And your specific action plan after completing this diploma.`,
            style: 'tip',
        },
    ];

    const keyTakeaways = [
        'Your ideal clients are already in your life - you just haven\'t offered yet',
        'Clients pay for **SOLUTIONS**, not credentials',
        'The **90-Day Path**: Foundation → First Clients → Momentum',
        'Your **story** is your best marketing - struggles become credentials',
        '**Referrals** from happy clients become your #1 source',
        'Don\'t wait until you feel "ready" - that feeling comes from **doing**',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Finding Your First Clients"
            lessonSubtitle="How to get started without paid ads"
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
