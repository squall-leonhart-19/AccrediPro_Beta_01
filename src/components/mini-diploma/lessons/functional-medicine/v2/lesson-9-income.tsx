"use client";

import { useState } from "react";
import { LessonBaseV2, Message } from "../../shared/lesson-base-v2";
import { IncomeCalculator, DownloadResource, PractitionerScore } from "../../shared/interactive-elements";

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
    const [calculatedIncome, setCalculatedIncome] = useState<{ monthly: number; yearly: number } | null>(null);

    const messages: Message[] = [
        // CELEBRATION
        {
            id: 1,
            type: 'coach',
            content: `{name}!!! You made it to the FINAL lesson! I'm literally cheering for you right now!`,
        },
        {
            id: 2,
            type: 'coach',
            content: `Over the past 8 lessons, you've learned more about functional medicine than most healthcare providers know. That's not an exaggeration.`,
        },
        {
            id: 3,
            type: 'system',
            content: `**What You've Mastered**

✓ Root cause thinking (vs symptom chasing)
✓ The gut connection (70% of immunity)
✓ The inflammation blueprint
✓ Environmental toxins and safe detox
✓ Stress, hormones & the HPA axis
✓ Functional lab interpretation
✓ Building client protocols
✓ Finding your first clients

You now understand health better than 95% of people - including many doctors who focus on disease, not wellness.

You're ready for the next step.`,
            systemStyle: 'takeaway',
        },

        // YOUR SCORE
        {
            id: 4,
            type: 'coach',
            content: `Let's see how you did on your practitioner assessments throughout this course...`,
        },
        {
            id: 5,
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

        // THE REALITY CHECK
        {
            id: 6,
            type: 'coach',
            content: `Now, let's talk about what's ACTUALLY possible. Not hype. Not "6-figure promises." Real numbers from real graduates.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**The Reality of Graduate Income**

Let me be honest with you about what to expect:

**The first 3 months:**
- Building your foundation
- Finding your first clients
- Learning what works
- Income: $0-1,500/month

**Months 4-6:**
- Gaining momentum
- Word of mouth starting
- Confidence building
- Income: $1,500-3,000/month

**Months 7-12:**
- Established practice
- Referrals flowing
- Raising rates
- Income: $2,500-5,000/month

**Year 2+:**
- Full practice
- Premium pricing
- Waitlist possible
- Income: $4,000-8,000+/month

This isn't overnight success. It's building something real. The graduates who succeed are the ones who START.`,
            systemStyle: 'stats',
        },

        // INCOME CALCULATOR
        {
            id: 8,
            type: 'coach',
            content: `Now for the exciting part. Let's calculate what YOUR income could look like based on YOUR situation...`,
        },
        {
            id: 9,
            type: 'coach',
            content: `Play with the sliders below. Be realistic about your available time. See what's possible.`,
        },
        {
            id: 10,
            type: 'custom-component',
            content: '',
            componentProps: { points: 0 },
            renderComponent: ({ onComplete }) => (
                <IncomeCalculator
                    onComplete={(monthly, yearly) => {
                        setCalculatedIncome({ monthly, yearly });
                        onComplete();
                    }}
                />
            ),
        },

        // REAL GRADUATE STORIES - VARIED
        {
            id: 11,
            type: 'system',
            content: `**Real Graduate Results: The Range**

Not everyone makes the same. Here's the honest range:

**Lower End - Part-Time Practice**
*Kathy, 51 - 8 hours/week*
- 4 clients, $150/session
- Monthly: $1,200
- "It's my 'fun money' while the kids are at school"

**Middle Range - Serious Side Income**
*Michelle, 46 - 15 hours/week*
- 8 clients, $175/session
- Monthly: $2,800
- "More than my old part-time retail job"

**Higher End - Full Practice**
*Jennifer, 49 - 20 hours/week*
- 12 clients, $200/session
- Monthly: $4,800
- "Quit my corporate job at month 8"

**Top Performers**
*Susan, 44 - 25 hours/week*
- 15 clients, $225/session + programs
- Monthly: $6,700
- "Never imagined this was possible"

Your results depend on: time invested, commitment, and willingness to put yourself out there.`,
            systemStyle: 'testimonial',
        },

        // THE OBJECTION: "What if I fail?"
        {
            id: 12,
            type: 'coach',
            content: `Now, I know what you might be thinking. "What if I invest in this and it doesn't work?"`,
        },
        {
            id: 13,
            type: 'system',
            content: `**"What If I Fail?"**

Let's address this head-on:

**What "failure" actually looks like:**
- You help a few people, even if you don't build a business
- You understand your OWN health better than ever
- You have knowledge that serves you for life
- You tried something meaningful

**What NOT trying looks like:**
- You're in the same place a year from now
- Still wondering "what if?"
- Still watching others do what you dreamed of
- Still feeling stuck

The only real failure is never starting.

**The truth:**
Graduates who "fail" usually didn't fail at the knowledge. They failed to take action. They learned everything but never reached out to their first client.

The ones who succeed? They start before they feel ready.`,
            systemStyle: 'comparison',
        },

        // THE FULL CERTIFICATION
        {
            id: 14,
            type: 'coach',
            content: `{name}, this mini diploma gave you the foundation. But to actually PRACTICE at a professional level, charge premium rates, and have the credibility you need, you need the full certification.`,
        },
        {
            id: 15,
            type: 'system',
            content: `**What the Full Certification Includes**

**Complete Training (Not Just 9 Lessons):**
- 12 comprehensive modules
- Advanced protocols for every condition
- Real case studies with solutions
- Business & marketing training
- Pricing and packaging strategies

**Professional Tools:**
- Client intake forms (customizable)
- Protocol templates
- Lab interpretation guides
- Marketing materials
- Website copy templates

**Credentials That Matter:**
- ASI Certified Functional Medicine Practitioner
- Digital badge for LinkedIn and website
- Listed in our practitioner directory
- Verification system for clients

**Ongoing Support:**
- Live Q&A calls monthly
- Private practitioner community
- Continuing education
- Mentor support
- Referral network

Everything you need to launch and grow your practice.`,
            systemStyle: 'info',
        },

        // URGENCY - Why Now
        {
            id: 16,
            type: 'system',
            content: `**Why NOW Matters**

The market reality:

**Demand is EXPLODING:**
- 60% of Americans have chronic disease
- Trust in conventional medicine at all-time low
- "Wellness" is the #1 searched health topic
- Functional medicine searches up 340% since 2020

**Competition is coming:**
- More people discovering this opportunity every day
- Early movers establish themselves first
- Your local market has limited capacity

**Your situation:**
- You just completed this mini diploma
- The knowledge is fresh
- Your motivation is high
- The path is clear

Every day you wait, someone else is starting.

The best time to plant a tree was 20 years ago. The second best time is TODAY.`,
            systemStyle: 'stats',
        },

        // THE TESTIMONIAL THAT HITS DIFFERENT
        {
            id: 17,
            type: 'system',
            content: `**Meet Diana, 53 - "I Almost Didn't Start"**

"I need to tell you something. I almost didn't enroll.

I had every excuse:
- 'I'm too old' (53)
- 'I have no background' (25 years in banking)
- 'Who will take me seriously?' (impostor syndrome)
- 'What if it doesn't work?' (fear of failure)

I sat on the enrollment page for 3 weeks. Then my friend (also 50+) enrolled. I thought, 'If she can do it...'

So I did it. Terrified. Uncertain. But I did it.

Here's what happened:
- Month 1: Started learning, feeling overwhelmed
- Month 2: Took on 2 practice clients (family friends)
- Month 3: First paying client ($125/session)
- Month 6: 6 clients at $175/session = $2,100/month
- Month 12: 10 clients at $200/session = $4,000/month
- Now (18 months): 12 clients, $225/session, $5,400/month

I work 18 hours a week. From home. Helping women like me who doctors dismissed.

My banking career paid more. But I've never felt this ALIVE.

If I had listened to my excuses, I'd still be miserable at a job I hated. Instead, I have PURPOSE.

The only thing standing between you and this is the decision to start."

- Diana M., Colorado | ASI Graduate 2023`,
            systemStyle: 'testimonial',
        },

        // DOWNLOADABLE RESOURCE
        {
            id: 18,
            type: 'coach',
            content: `Here's a roadmap showing exactly where you are and where you could be in 6 months...`,
        },
        {
            id: 19,
            type: 'custom-component',
            content: '',
            renderComponent: ({ onComplete }) => (
                <DownloadResource
                    title="Your 6-Month Career Roadmap"
                    description="Step-by-step plan from today to your first $3K-5K month as a certified practitioner"
                    fileName="Career-Roadmap.pdf"
                    downloadUrl="/resources/mini-diploma/career-roadmap.pdf"
                    icon="guide"
                    onDownload={onComplete}
                />
            ),
        },

        // THE DECISION POINT
        {
            id: 20,
            type: 'system',
            content: `**Where You Stand Right Now**

You have 3 options:

**Option 1: Do Nothing**
- This mini diploma was interesting
- You go back to your life
- Nothing changes
- A year from now, you're in the same place

**Option 2: Try to Figure It Out Alone**
- Use what you learned here
- Piece together information from YouTube
- No structure, no credentials, no support
- Maybe help a few people, maybe not

**Option 3: Get Certified and Go All In**
- Complete the full training
- Get the credentials that matter
- Build a real practice
- Change your life AND others' lives

The choice is yours. But you didn't complete 9 lessons by accident. Something brought you here.

What will you do with it?`,
            systemStyle: 'comparison',
        },

        // FINAL MESSAGE
        {
            id: 21,
            type: 'coach',
            content: `{name}, I believe in you. I've watched you complete this entire mini diploma. I've seen you answer case studies correctly. I've seen you engage with the material.`,
        },
        {
            id: 22,
            type: 'coach',
            content: `You have what it takes. The question isn't "Can I do this?" - you just proved you can. The question is "Will I do this?"`,
        },
        {
            id: 23,
            type: 'coach',
            content: `Your certificate is ready. Your next step is waiting. I'll be here cheering you on, whatever you decide.`,
        },
        {
            id: 24,
            type: 'system',
            content: `**Your Certificate is Ready!**

You've completed all 9 lessons of the ASI Functional Medicine Foundation.

Your completion certificate is waiting for you.

Click below to:
- Download your certificate
- See your full certification options
- Take the next step in your journey

This is your moment, {name}.

What comes next is up to you.`,
            systemStyle: 'takeaway',
        },
        {
            id: 25,
            type: 'coach',
            content: `Congratulations! You did it! Now go claim your certificate and let's talk about what's next for you. I'm SO proud of you, {name}!`,
        },
    ];

    return (
        <LessonBaseV2
            lessonNumber={lessonNumber}
            lessonTitle="Your Income Potential"
            lessonSubtitle="The math, the path, and your next step"
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
