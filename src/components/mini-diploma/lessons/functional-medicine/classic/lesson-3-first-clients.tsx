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

export function ClassicLessonFirstClients({
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
            content: `{name}, this is where everything comes together. You know the science (Lesson 1). You have the framework (Lesson 2). Now let's talk about the part everyone worries about: "How do I actually GET clients and start earning?"`,
        },
        {
            type: 'key-point',
            content: `Here's the truth: Getting your first clients is easier than you think. You don't need a website. You don't need social media. You don't need to spend a DIME on ads. You need exactly ONE thing: a real conversation with someone who's struggling.`,
        },

        // THE REALITY
        {
            type: 'heading',
            content: 'The $5,000/Month Reality Check',
        },
        {
            type: 'text',
            content: `Let me break down the math that changed my life \u2014 and the lives of hundreds of ASI graduates:`,
        },
        {
            type: 'list',
            content: '',
            items: [
                '**Average client package:** $250-500/month for 3-6 months',
                '**Clients needed for $5K/month:** Just 10-20 active clients',
                '**Time per client:** 2-4 hours/month (calls + prep)',
                '**Total working hours:** 20-40 hours/month (part-time!)',
                '**How fast:** Most students get first paid client within 2-4 weeks',
            ],
        },
        {
            type: 'callout',
            content: `Compare that to a 9-to-5 job at $52,000/year. That's $4,333/month BEFORE taxes, working 160+ hours. As a certified coach, you can match that income working PART-TIME, from HOME, doing work you LOVE.`,
            style: 'success',
        },

        // THE WARM MARKET STRATEGY
        {
            type: 'heading',
            content: 'The 48-Hour Client Strategy',
        },
        {
            type: 'text',
            content: `Forget everything you've heard about "building a brand" or "growing a following." Those take months. My students get their first clients in DAYS using what I call the Warm Market Strategy.`,
        },
        {
            type: 'text',
            content: `Here's the secret: There are people in your life RIGHT NOW who are struggling with health issues. They just don't know you can help them yet.`,
        },
        {
            type: 'list',
            content: '',
            items: [
                '**Step 1: List 20 people** who\'ve mentioned health struggles (friends, family, coworkers, neighbors, church members)',
                '**Step 2: Have a genuine conversation.** Not a pitch. Ask them about their health. Listen. Share what you\'re learning.',
                '**Step 3: Offer a free "Health Discovery Session."** Just 30 minutes to use the D.E.P.T.H. Method\u2122 Discover phase.',
                '**Step 4: Show them the gap.** After the session, they\'ll realize how much they don\'t know about their own health.',
                '**Step 5: Present your coaching package.** "Based on what we discussed, here\'s how I can help you over the next 3 months."',
            ],
        },
        {
            type: 'callout',
            content: `Graduate story: Amanda S., a former dental hygienist, used this exact strategy. She listed 25 people. Reached out to 10. Got 6 discovery sessions. Signed 3 paying clients in her FIRST WEEK. That's $1,500/month before she even finished her certification.`,
            style: 'success',
        },

        // YOUR CERTIFICATION AS YOUR CREDIBILITY
        {
            type: 'heading',
            content: 'Your Certification = Instant Credibility',
        },
        {
            type: 'text',
            content: `One of the biggest fears new coaches have: "Who am I to charge for this?" Your ASI certification answers that question permanently.`,
        },
        {
            type: 'list',
            content: '',
            items: [
                '**Verified credential** \u2014 Your certificate has a unique verification number that clients can look up',
                '**Recognized specialization** \u2014 Functional medicine is one of the fastest-growing fields in healthcare',
                '**Professional framework** \u2014 The D.E.P.T.H. Method\u2122 gives you a structured, professional approach',
                '**Scope of practice clarity** \u2014 You know exactly what you can and can\'t do (education & support)',
                '**Ongoing support** \u2014 The ASI community of 2,400+ graduates supports each other',
            ],
        },

        // WHAT TO CHARGE
        {
            type: 'heading',
            content: 'What To Charge (Without Feeling Guilty)',
        },
        {
            type: 'text',
            content: `New coaches always underprice. Don't make this mistake. Here's why your services are VALUABLE:`,
        },
        {
            type: 'before-after',
            content: '',
            before: {
                title: 'Without a Coach',
                items: [
                    'Years of trial and error',
                    '$3,000+/year on supplements that don\'t work',
                    'Dozens of doctor visits ($200+ each)',
                    'Lost productivity and sick days',
                ],
            },
            after: {
                title: 'With Your Coaching',
                items: [
                    'Personalized roadmap from Day 1',
                    'Targeted support (no wasted money)',
                    'Faster results with D.E.P.T.H. Method\u2122',
                    'Improved energy, focus, and quality of life',
                ],
            },
        },
        {
            type: 'callout',
            content: `Recommended starting packages:\n\u2022 **Discovery Package:** $297/month for 3 months ($891 total)\n\u2022 **Transformation Package:** $497/month for 6 months ($2,982 total)\n\u2022 **VIP Package:** $997/month for 3 months with weekly calls ($2,991 total)\n\nMost new coaches start with the Discovery Package and upgrade as they gain confidence.`,
            style: 'info',
        },

        // SCOPE REMINDER
        {
            type: 'heading',
            content: 'Staying Within Your Scope (Stay Safe, Stay Legal)',
        },
        {
            type: 'text',
            content: `This is critical, {name}. Your certification gives you the authority to EDUCATE and SUPPORT. Not diagnose. Not prescribe. Not treat. Here's your quick-reference guide:`,
        },
        {
            type: 'list',
            content: '',
            items: [
                '**\u2705 You CAN:** Educate on nutrition, support lifestyle changes, help with meal planning, teach stress management, provide accountability',
                '**\u2705 You CAN:** Use the D.E.P.T.H. Method\u2122 to help clients understand their health patterns',
                '**\u274c You CANNOT:** Diagnose conditions, prescribe treatments, order lab tests, provide medical advice',
                '**\u2705 You CAN:** Suggest clients talk to their doctor about specific concerns you notice',
                '**\u2705 You CAN:** Work alongside a client\'s medical team as their education and support partner',
            ],
        },

        // QUIZ
        {
            type: 'quiz',
            content: '',
            questions: [
                {
                    question: 'What is the most effective approach for getting your first clients?',
                    options: [
                        'Wait until you have every certification possible before talking to anyone',
                        'Spend thousands on paid advertising immediately',
                        'Start with your existing network, lead with value and education',
                        'Cold call random people from the phone book',
                    ],
                    correctIndex: 2,
                    explanation: 'The fastest path to your first clients is leveraging your existing network and community. Lead with value and education, build trust, and clients will naturally emerge from those relationships.',
                },
                {
                    question: 'Which of the following is within a certified health coach\'s scope of practice?',
                    options: [
                        'Diagnosing medical conditions based on client symptoms',
                        'Prescribing supplements and specific dosages to treat conditions',
                        'Educating clients on nutrition and supporting healthy lifestyle changes',
                        'Ordering and interpreting blood tests for clients',
                    ],
                    correctIndex: 2,
                    explanation: 'Health coaches educate and support clients in making positive nutrition and lifestyle changes. Diagnosing, prescribing, and ordering medical tests are outside the scope of a health coach.',
                },
            ],
        },

        // FINAL CTA
        {
            type: 'heading',
            content: 'You\'re Ready, {name}.',
        },
        {
            type: 'text',
            content: `You've completed all 3 lessons. You understand the science. You have the framework. You know how to get clients. The only thing standing between you and your new career is a simple final exam.`,
        },
        {
            type: 'callout',
            content: `Click "Complete & Proceed to Final Exam" below. The exam covers what you've learned in these 3 lessons. Once you pass, you'll receive your official ASI certification \u2014 a verified credential that opens the door to your $5,000+/month future.`,
            style: 'tip',
        },
    ];

    const keyTakeaways = [
        'Just 10-20 clients at $250-500/month = **$5,000+/month part-time from home**',
        'The 48-Hour Client Strategy: List 20 people \u2192 Have conversations \u2192 Offer discovery sessions',
        'Your ASI certification provides **instant credibility** and a verified credential',
        'Stay within scope: **EDUCATE and SUPPORT** (not diagnose or prescribe)',
        'Most students get their **first paid client within 2-4 weeks** of certification',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="How To Get Your First Clients"
            lessonSubtitle="The exact strategy to go from certified to earning $5K+/month"
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
