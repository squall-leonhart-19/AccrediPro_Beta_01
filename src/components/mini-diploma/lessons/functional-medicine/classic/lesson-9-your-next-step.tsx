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

export function ClassicLessonYourNextStep({
    lessonNumber,
    totalLessons = 9,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const sections: LessonSection[] = [
        // OPENING - Transition from learning to vision
        {
            type: 'intro',
            content: `{name}, you made it. 9 lessons. You showed up, you learned, you finished. Before we talk about your exam, I want to show you something. Not more science. You've learned plenty of that. I want to show you the LIFE that's waiting for you on the other side of this decision.`,
        },

        // A DAY IN YOUR NEW LIFE - Lifestyle storytelling
        {
            type: 'heading',
            content: 'A Day In Your New Life',
        },
        {
            type: 'text',
            content: `Close your eyes for a moment. Picture this:`,
        },
        {
            type: 'text',
            content: `It's Tuesday morning. 7:30 AM. You're making breakfast for your kids. No rushing. No stress. No dread about the commute. Because today, like most days, you work from home.`,
        },
        {
            type: 'text',
            content: `You drop the kids at school at 8:15. Come home to a quiet house. Coffee in hand, you open your laptop. Your first client call isn't until 10 AM - a woman named Sarah who's finally getting her energy back after months of fatigue. Her labs are improving. She cried on your last call. "You're the first person who actually listened to me."`,
        },
        {
            type: 'text',
            content: `10:00-10:45 - Sarah's session. You help her adjust her protocol. She books 3 more sessions. That's $600 in 45 minutes.`,
        },
        {
            type: 'text',
            content: `11:00 - You take a walk. Because you can.`,
        },
        {
            type: 'text',
            content: `12:30 - Quick lunch, then another client. A busy executive who was skeptical at first but now refers all his colleagues to you.`,
        },
        {
            type: 'text',
            content: `2:45 PM - You close your laptop. School pickup is at 3:00. You're there. Every single day. No asking permission. No PTO requests. No guilt.`,
        },
        {
            type: 'text',
            content: `This isn't fantasy. This is Diana's real Tuesday. And Jennifer's. And Michelle's. Women who started exactly where you are right now.`,
        },
        {
            type: 'key-point',
            content: `The kids see you present. Your clients see results. Your bank account sees growth. And YOU? You finally feel like you're doing what you were meant to do.`,
        },

        // NEW TEACHING - The 3 Pillars of a Thriving Practice
        {
            type: 'heading',
            content: 'The 3 Pillars of a Thriving Practice',
        },
        {
            type: 'text',
            content: `Before we continue, let me teach you something important. Having helped thousands of practitioners, I've seen what separates those who thrive from those who struggle:`,
        },
        {
            type: 'subheading',
            content: 'Pillar 1: Deep Expertise',
        },
        {
            type: 'text',
            content: `You need to know more than Google. Clients come to you BECAUSE you understand things their doctor doesn't. Root causes. Functional lab interpretation. The gut-hormone-inflammation connection. You just spent 9 lessons building this foundation. It's real. It matters.`,
        },
        {
            type: 'subheading',
            content: 'Pillar 2: Simple Systems',
        },
        {
            type: 'text',
            content: `The practitioners who burn out are the ones who wing it. The ones who thrive have systems. Intake forms. Session templates. Follow-up protocols. They don't reinvent the wheel for every client - they follow proven frameworks.`,
        },
        {
            type: 'subheading',
            content: 'Pillar 3: Unshakeable Confidence',
        },
        {
            type: 'text',
            content: `This is the hardest one. Confidence doesn't come from knowing everything. It comes from knowing ENOUGH - and trusting yourself to figure out the rest. It comes from credentials that back you up. From a community that supports you. From seeing your first client get results.`,
        },
        {
            type: 'callout',
            content: `You already have the foundation for Pillar 1. The full certification gives you Pillar 2 (done-for-you systems) and accelerates Pillar 3 (credentials + community). That's the formula.`,
            style: 'tip',
        },

        // WHO YOU'LL HELP - Purpose-driven emotional hook
        {
            type: 'heading',
            content: 'The People Who Need You',
        },
        {
            type: 'text',
            content: `Let me tell you about the people waiting for someone like you:`,
        },
        {
            type: 'text',
            content: `**The Exhausted Mom.** She's been to 5 doctors. They ran labs, said "everything looks normal," and prescribed antidepressants. She knows something is wrong. She's not crazy. She needs someone who will actually LOOK at her case with functional medicine eyes.`,
        },
        {
            type: 'text',
            content: `**The Burned-Out Executive.** High performer. Used to crush it. Now he can barely get through the day. Doctors say "stress" and send him home. He needs someone who understands the HPA axis, cortisol patterns, and real recovery.`,
        },
        {
            type: 'text',
            content: `**The Chronic Sufferer.** Fibromyalgia. IBS. Autoimmune. She's given up on doctors. She's tried everything. She needs hope - and a practitioner who sees the connection between her gut, inflammation, and symptoms.`,
        },
        {
            type: 'key-point',
            content: `These people exist. In your neighborhood. In your church. In your kids' school. They're spending thousands on random supplements and fad diets. They NEED educated, certified practitioners. They need YOU.`,
        },

        // THE INCOME REALITY - Honest, aspirational
        {
            type: 'heading',
            content: 'The Income Reality',
        },
        {
            type: 'text',
            content: `I'm going to be real with you. Not everyone makes the same money. It depends on YOUR commitment, YOUR hours, and YOUR willingness to put yourself out there. Here's what's genuinely possible:`,
        },
        {
            type: 'list',
            content: 'Part-Time Passion (10-15 hours/week):',
            items: [
                '5-10 clients',
                '$150-200 per session',
                '$2,000-4,000/month',
                'Perfect for: Moms with kids in school, keeping a day job',
            ],
        },
        {
            type: 'list',
            content: 'Serious Side Income (15-20 hours/week):',
            items: [
                '10-15 clients',
                '$175-225 per session',
                '$4,000-7,000/month',
                'Perfect for: Those ready to transition out of their 9-5',
            ],
        },
        {
            type: 'list',
            content: 'Full Career (20-25 hours/week):',
            items: [
                '15-20 clients',
                '$200-275 per session',
                '$6,000-10,000+/month',
                'Perfect for: Those going all-in on this career',
            ],
        },
        {
            type: 'callout',
            content: `Notice the hours. Most practitioners work 15-25 hours per week. Not 40. Not 50. Real flexibility. Real income. And you're HOME for school pickup.`,
            style: 'success',
        },

        // REAL TRANSFORMATION STORIES - Life-focused with income as secondary
        {
            type: 'heading',
            content: 'Real Stories: The Life Change',
        },
        {
            type: 'quote',
            content: `"I was 53, stuck in a cubicle, watching my grandkids grow up through Facebook photos. My daughter kept saying, 'Mom, just DO it.' So I enrolled. Scared. Uncertain. Now? I work 22 hours from my sun room. I pick up my grandkids from school THREE days a week. I see their faces light up when I walk through those doors. Yes, I earn more than my old corporate salary now. But that's not why I cry sometimes. I cry because I'm THERE. I'm present. I'm helping people. I'm alive. At 55, I finally have the life I always wanted." — Diana M., Georgia`,
        },
        {
            type: 'quote',
            content: `"I was a nurse for 18 years. Burned out. Resentful. Every day felt like survival. I thought 'who would pay ME for health advice?' My first client was a friend's mom. She'd been dismissed by doctors for years. Within 3 months, her inflammation markers dropped, her energy came back. She hugged me and said, 'You gave me my life back.' That moment? That's worth more than any paycheck. Though the $6,200/month working 18 hours a week doesn't hurt either." — Jennifer R., Florida`,
        },
        {
            type: 'quote',
            content: `"Single mom. Two kids. I needed flexibility more than anything. Now I schedule clients around school hours and activities. I was at every soccer game this season. EVERY one. My kids see me helping people from home. My daughter told her class 'my mom is a health coach and she makes sick people better.' I ugly-cried in the car after that parent-teacher conference. This career changed everything." — Michelle K., Ohio`,
        },

        // WHAT YOU'VE ACHIEVED
        {
            type: 'heading',
            content: 'What You\'ve Built In 9 Lessons',
        },
        {
            type: 'text',
            content: `Let's pause and acknowledge what you've accomplished:`,
        },
        {
            type: 'list',
            content: 'Your New Foundation:',
            items: [
                'Root cause thinking — what doctors spend 7+ years NOT learning',
                'Gut health — the foundation 90% of practitioners miss',
                'Inflammation — the silent driver of chronic disease',
                'Environmental toxins — a growing crisis creating massive demand',
                'Stress & hormones — the burnout epidemic that needs YOUR help',
                'Functional labs — seeing what conventional ranges miss',
            ],
        },
        {
            type: 'key-point',
            content: `You now understand health differently than most healthcare providers. They learned disease treatment. You learned disease PREVENTION and ROOT CAUSE resolution. That perspective is rare. And it's valuable.`,
        },

        // LEVEL 0 CELEBRATION
        {
            type: 'heading',
            content: 'Congratulations, {name}!',
        },
        {
            type: 'callout',
            content: `You have just completed Level 0 — Foundations of the ASI Functional Medicine pathway. This is your first step toward a life-changing career transformation. You now have the foundational knowledge that separates you from 95% of people who talk about health but never take action.`,
            style: 'success',
        },
        {
            type: 'list',
            content: 'What You\'ve Achieved:',
            items: [
                '✓ Understanding of root cause medicine principles',
                '✓ Knowledge of the 5 core functional medicine systems',
                '✓ Ability to recognize patterns doctors miss',
                '✓ Foundation for helping friends, family, and future clients',
                '✓ Framework for building a wellness practice',
            ],
        },

        // EXAM CTA
        {
            type: 'heading',
            content: 'Complete Your Foundation Exam',
        },
        {
            type: 'text',
            content: `Now there's just ONE thing left to make it official. To claim your Level 0 — Foundations certificate:`,
        },
        {
            type: 'list',
            content: 'Your Final Step:',
            items: [
                '📝 Complete a short exam (10 questions)',
                '📜 Receive your personalized certificate',
                '🚀 Unlock your next steps',
            ],
        },
        {
            type: 'text',
            content: `This exam confirms your understanding and makes your achievement official. You've already learned everything you need. This is just the final step to celebrate YOUR accomplishment!`,
        },

        // SARAH'S CLOSING
        {
            type: 'heading',
            content: 'A Final Note From Me',
        },
        {
            type: 'text',
            content: `{name}, I want you to know something. I see you. I see the commitment it took to get through 9 lessons. I see the hope in wanting something more. I see the courage it takes to imagine a different life.`,
        },
        {
            type: 'text',
            content: `The life waiting for you - the flexible schedule, the meaningful work, the income, the impact - it's not reserved for "special" people. It's available to anyone willing to take the next step.`,
        },
        {
            type: 'text',
            content: `You showed up. You learned. You finished. Now let's make it official. Take your exam when you're ready. I'm proud of you.`,
        },
    ];

    const keyTakeaways = [
        'You completed Level 0 — Foundations of the ASI Functional Medicine pathway',
        'The 3 Pillars of Success: Deep Expertise + Simple Systems + Unshakeable Confidence',
        'Part-time (15-20 hrs/week) practitioners earn $4,000-7,000/month',
        'Flexibility: work from home, school pickup, be PRESENT for your family',
        'The people who need you are waiting — exhausted moms, burned-out executives, chronic sufferers',
        'Complete your Foundation Exam to claim your certificate',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Life That's Waiting For You"
            lessonSubtitle="Your new path forward"
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
            courseSlug="functional-medicine-complete-certification"
        />
    );
}
