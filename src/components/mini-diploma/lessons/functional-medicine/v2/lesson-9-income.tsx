"use client";

import { useState } from "react";
import { LessonBaseV2, Message } from "../../shared/lesson-base-v2";
import { PractitionerScore } from "../../shared/interactive-elements";

interface LessonProps {
    lessonNumber: number;
    totalLessons?: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
    totalScore?: number;
}

export function Lesson9Income({
    lessonNumber,
    totalLessons = 9,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
    totalScore = 0,
}: LessonProps) {
    const [score, setScore] = useState(totalScore);

    const messages: Message[] = [
        // AUDIO NARRATION
        {
            id: 0,
            type: 'pre-recorded-audio',
            audioUrl: 'https://assets.accredipro.academy/audio/functional-medicine/lesson-9.mp3',
            audioDuration: '4:42',
            content: '🎧 Listen to Sarah explain this lesson',
        },

        // OPENING - CELEBRATION
        {
            id: 1,
            type: 'coach',
            content: `{name}!!! You made it to the FINAL lesson! I'm literally so proud of you right now!`,
        },
        {
            id: 2,
            type: 'coach',
            content: `Before we talk about your exam, I want to show you something. Not more science. You've learned plenty of that. I want to show you the LIFE that's waiting for you on the other side of this decision.`,
        },

        // A DAY IN YOUR NEW LIFE
        {
            id: 3,
            type: 'system',
            content: `**A Day In Your New Life**

Close your eyes. Picture this:

**7:30 AM** — Making breakfast for your kids. No rushing. No dread about the commute. Today, like most days, you work from home.

**8:15 AM** — Drop the kids at school. Come home to a quiet house.

**10:00 AM** — First client call. A woman named Sarah who's finally getting her energy back. She cried on your last call: "You're the first person who actually listened to me." She books 3 more sessions. That's $600 in 45 minutes.

**11:00 AM** — You take a walk. Because you CAN.

**12:30 PM** — Another client. A busy executive who now refers all his colleagues to you.

**2:45 PM** — You close your laptop. School pickup is at 3:00. You're there. Every single day. No asking permission. No PTO requests. No guilt.

This isn't fantasy. This is Diana's real Tuesday. And Jennifer's. And Michelle's.`,
            systemStyle: 'info',
        },
        {
            id: 4,
            type: 'coach',
            content: `The kids see you present. Your clients see results. Your bank account sees growth. And YOU? You finally feel like you're doing what you were meant to do.`,
        },

        // VISUAL - Your New Life
        {
            id: 49,
            type: 'image',
            imageUrl: 'https://assets.accredipro.academy/images/lessons/functional-medicine/lesson-9-doodle.png',
            imageAlt: 'Your new life awaits',
            content: 'This could be your schedule',
        },

        // YOUR SCORE
        {
            id: 5,
            type: 'coach',
            content: `Let's see how you did on your practitioner assessments throughout this course...`,
        },
        {
            id: 6,
            type: 'custom-component',
            content: '',
            renderComponent: ({ onComplete }) => (
                <PractitionerScore
                    currentScore={score}
                    maxScore={210}
                    lessonsCompleted={9}
                    totalLessons={9}
                />
            ),
        },

        // THE 3 PILLARS - NEW TEACHING
        {
            id: 7,
            type: 'coach',
            content: `Now let me teach you something important. Having helped thousands of practitioners, I've seen what separates those who thrive from those who struggle:`,
        },
        {
            id: 8,
            type: 'system',
            content: `**The 3 Pillars of a Thriving Practice**

**Pillar 1: Deep Expertise**
You need to know more than Google. Clients come to you BECAUSE you understand things their doctor doesn't. Root causes. Functional labs. The gut-hormone-inflammation connection.

*You just spent 9 lessons building this foundation. It's real. It matters.*

**Pillar 2: Simple Systems**
Practitioners who burn out wing it. Those who thrive have systems. Intake forms. Session templates. Follow-up protocols. They don't reinvent the wheel — they follow proven frameworks.

**Pillar 3: Unshakeable Confidence**
This is the hardest one. Confidence doesn't come from knowing everything. It comes from knowing ENOUGH — and trusting yourself. It comes from credentials that back you up. From a community that supports you. From seeing your first client get results.

You already have the foundation for Pillar 1. The full certification gives you Pillar 2 (systems) and accelerates Pillar 3 (credentials + community).`,
            systemStyle: 'takeaway',
        },

        // WHO YOU'LL HELP
        {
            id: 9,
            type: 'coach',
            content: `Let me tell you about the people waiting for someone like you...`,
        },
        {
            id: 10,
            type: 'system',
            content: `**The People Who Need You**

**The Exhausted Mom**
She's been to 5 doctors. They ran labs, said "everything looks normal," and prescribed antidepressants. She knows something is wrong. She's not crazy. She needs someone who will actually LOOK at her case with functional medicine eyes.

**The Burned-Out Executive**
High performer. Used to crush it. Now he can barely get through the day. Doctors say "stress" and send him home. He needs someone who understands the HPA axis, cortisol patterns, and real recovery.

**The Chronic Sufferer**
Fibromyalgia. IBS. Autoimmune. She's given up on doctors. She needs hope — and a practitioner who sees the connection between her gut, inflammation, and symptoms.

These people exist. In your neighborhood. In your church. In your kids' school. They NEED you.`,
            systemStyle: 'info',
        },

        // THE INCOME REALITY
        {
            id: 11,
            type: 'coach',
            content: `Now let's talk income. I'm going to be real with you — not everyone makes the same money. It depends on YOUR commitment, YOUR hours, and YOUR willingness to put yourself out there.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**The Income Reality**

**Part-Time Passion (10-15 hours/week)**
- 5-10 clients • $150-200/session
- $2,000-4,000/month
- Perfect for: Moms with kids in school, keeping a day job

**Serious Side Income (15-20 hours/week)**
- 10-15 clients • $175-225/session
- $4,000-7,000/month
- Perfect for: Those transitioning out of their 9-5

**Full Career (20-25 hours/week)**
- 15-20 clients • $200-275/session
- $6,000-10,000+/month
- Perfect for: Those going all-in

Notice the hours. Most practitioners work 15-25 hours per week. Not 40. Not 50. Real flexibility. Real income. And you're HOME for school pickup.`,
            systemStyle: 'stats',
        },

        // REAL TRANSFORMATION STORIES
        {
            id: 13,
            type: 'coach',
            content: `Let me share some real stories from graduates. Not income first — life change first.`,
        },
        {
            id: 14,
            type: 'system',
            content: `**Diana, 53 — "I'm Finally Present"**

"I was stuck in a cubicle, watching my grandkids grow up through Facebook photos. My daughter kept saying, 'Mom, just DO it.' So I enrolled. Scared. Uncertain.

Now? I work 22 hours from my sun room. I pick up my grandkids from school THREE days a week. I see their faces light up when I walk through those doors.

Yes, I earn more than my old corporate salary now. But that's not why I cry sometimes. I cry because I'm THERE. I'm present. I'm helping people. I'm alive.

At 55, I finally have the life I always wanted."`,
            systemStyle: 'testimonial',
        },
        {
            id: 15,
            type: 'system',
            content: `**Michelle, Single Mom — "Every Soccer Game"**

"Single mom. Two kids. I needed flexibility more than anything.

Now I schedule clients around school hours and activities. I was at every soccer game this season. EVERY one.

My kids see me helping people from home. My daughter told her class 'my mom is a health coach and she makes sick people better.'

I ugly-cried in the car after that parent-teacher conference. This career changed everything."`,
            systemStyle: 'testimonial',
        },

        // WHAT YOU'VE BUILT
        {
            id: 16,
            type: 'coach',
            content: `{name}, let's pause and acknowledge what you've accomplished in these 9 lessons:`,
        },
        {
            id: 17,
            type: 'system',
            content: `**What You've Built**

✓ Root cause thinking — what doctors spend 7+ years NOT learning
✓ Gut health — the foundation 90% of practitioners miss
✓ Inflammation — the silent driver of chronic disease
✓ Environmental toxins — a growing crisis creating massive demand
✓ Stress & hormones — the burnout epidemic that needs YOUR help
✓ Functional labs — seeing what conventional ranges miss

You now understand health differently than most healthcare providers. They learned disease treatment. You learned disease PREVENTION and ROOT CAUSE resolution.

That perspective is rare. And it's valuable.`,
            systemStyle: 'takeaway',
        },

        // LEVEL 0 CELEBRATION
        {
            id: 18,
            type: 'system',
            content: `**🎓 CONGRATULATIONS, {name}!**

You have just completed **Level 0 — Foundations** of the ASI Functional Medicine pathway.

This is your first step toward a life-changing career transformation. You now have the foundational knowledge that separates you from 95% of people who talk about health but never take action.

**What You've Achieved:**
✓ Understanding of root cause medicine principles
✓ Knowledge of the 5 core functional medicine systems
✓ Ability to recognize patterns doctors miss
✓ Foundation for helping friends, family, and future clients
✓ Framework for building a wellness practice`,
            systemStyle: 'takeaway',
        },

        // EXAM CTA
        {
            id: 19,
            type: 'coach',
            content: `Now there's just ONE thing left to make it official...`,
        },
        {
            id: 20,
            type: 'system',
            content: `**Complete Your Foundation Exam**

To claim your Level 0 — Foundations certificate:

📝 Complete a short exam (10 questions)
📜 Receive your personalized certificate
🚀 Unlock your next steps

This exam confirms your understanding and makes your achievement official. You've already learned everything you need. This is just the final step to celebrate YOUR accomplishment.`,
            systemStyle: 'info',
        },

        // SARAH'S CLOSING
        {
            id: 21,
            type: 'coach',
            content: `{name}, I want you to know something. I see you. I see the commitment it took to get through 9 lessons. I see the hope in wanting something more. I see the courage it takes to imagine a different life.`,
        },
        {
            id: 22,
            type: 'coach',
            content: `The life waiting for you — the flexible schedule, the meaningful work, the income, the impact — it's not reserved for "special" people. It's available to anyone willing to take the next step.`,
        },
        {
            id: 23,
            type: 'coach',
            content: `You showed up. You learned. You finished. Now let's make it official — click below to start your exam and claim your certificate! I'm SO proud of you!`,
        },
    ];

    return (
        <LessonBaseV2
            lessonNumber={lessonNumber}
            lessonTitle="The Life That's Waiting For You"
            lessonSubtitle="Your new path forward"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
            currentScore={score}
            onScoreUpdate={(points) => setScore(s => s + points)}
        />
    );
}
