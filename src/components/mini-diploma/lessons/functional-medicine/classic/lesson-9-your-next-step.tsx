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
        {
            type: 'intro',
            content: `{name}, you made it. You completed all 9 lessons. I'm genuinely proud of you. Before we talk about what's next, I want to show you what's POSSIBLE. Not theory. Not hype. REAL numbers from real graduates who started exactly where you are.`,
        },
        {
            type: 'heading',
            content: '"What If I Fail?"',
        },
        {
            type: 'text',
            content: `Let me address the elephant in the room. The fear that keeps most people stuck. What if you invest in certification and it doesn't work out?`,
        },
        {
            type: 'list',
            content: 'Let\'s Do the Math:',
            items: [
                'Full certification investment: $297',
                'Average session rate after certification: $175',
                'Sessions needed to break even: 2',
                'Time to get 2 clients: Usually 2-4 weeks',
            ],
        },
        {
            type: 'callout',
            content: `TWO clients. That's all it takes to recover your investment. Everything after that? Pure upside. Compare that to a college degree ($50,000+) or even a weekend seminar ($2,000+). This is one of the lowest-risk career investments you can make.`,
            style: 'tip',
        },
        {
            type: 'heading',
            content: 'Real Income: What Graduates Actually Earn',
        },
        {
            type: 'text',
            content: `Here are REAL numbers from our graduate community. These aren't the outliers - these are typical results for people who actually implement.`,
        },
        {
            type: 'list',
            content: '6 MONTHS IN (Part-Time):',
            items: [
                'Clients: 5-8',
                'Rate: $150-175/session',
                'Hours: 8-12/week',
                'Monthly income: $1,500-3,000',
            ],
        },
        {
            type: 'list',
            content: '12 MONTHS IN (Growing):',
            items: [
                'Clients: 10-15',
                'Rate: $175-225/session',
                'Hours: 15-20/week',
                'Monthly income: $3,500-5,500',
            ],
        },
        {
            type: 'list',
            content: '24 MONTHS IN (Established):',
            items: [
                'Clients: 12-20',
                'Rate: $200-300/session',
                'Hours: 15-25/week',
                'Monthly income: $5,000-8,000+',
                'Often have waitlists',
            ],
        },
        {
            type: 'key-point',
            content: `Notice: These are PART-TIME numbers. Most graduates work 15-20 hours/week and earn $4,000-6,000/month. That's $50-75/hour effective rate. More than most corporate jobs. With flexibility. Doing work that matters.`,
        },
        {
            type: 'heading',
            content: 'Real Story: Diana, 53 - The Skeptic Who Made It',
        },
        {
            type: 'quote',
            content: `"I was the biggest skeptic. 'This won't work for me.' 'I'm too old.' 'Nobody will pay me.' 'I don't have time.' Every excuse in the book. My daughter finally said: 'Mom, stop talking about it and just do it.' So I did. Month 1: 0 clients. Panic. Month 2: 2 clients from church. $300 total. Month 3: 4 clients. $700. I almost quit. Month 6: 8 clients. $2,400. I stopped making excuses. Month 12: 14 clients. $4,900. I gave my corporate job 2 weeks notice. Month 24 (now): 18 clients. $6,800/month. 22 hours/week. Complete control of my schedule. At 53, I started over. At 55, I have the career I always wanted. The only failure would have been not trying." - Diana M., Georgia | ASI Graduate 2022`,
        },
        {
            type: 'heading',
            content: 'What You\'ve Learned',
        },
        {
            type: 'list',
            content: 'Your New Knowledge:',
            items: [
                'Root cause thinking - the 5 causes behind all chronic disease',
                'Gut health - why it\'s the foundation of everything',
                'Inflammation - the silent killer and how to address it',
                'Toxins - environmental health in a poisoned world',
                'Stress & hormones - the burnout epidemic and HPA axis',
                'Nutrients - what doctors miss in lab reviews',
                'Lab interpretation - functional vs. conventional ranges',
                'Client acquisition - the 90-day path to paying clients',
            ],
        },
        {
            type: 'callout',
            content: `You now know more about root-cause health than most conventionally trained healthcare providers. Seriously. They learn disease treatment. You learned disease PREVENTION and ROOT CAUSE resolution.`,
            style: 'success',
        },
        {
            type: 'heading',
            content: 'Three Paths From Here',
        },
        {
            type: 'list',
            content: 'PATH 1: Get Your Certificate',
            items: [
                'Download your Mini Diploma Certificate',
                'Share on LinkedIn (builds credibility)',
                'Add to your email signature',
                'You earned it - celebrate!',
            ],
        },
        {
            type: 'list',
            content: 'PATH 2: Continue to Full Certification',
            items: [
                'Complete 3-level board certification (FM-FC, FM-CP, FM-BC)',
                '25+ in-depth clinical lessons',
                'Done-for-you business templates',
                'My Circle Mastermind (daily accountability)',
                'ASI Practitioner Directory listing',
                'Sarah mentorship access',
                'LIFETIME ACCESS',
            ],
        },
        {
            type: 'list',
            content: 'PATH 3: Join the Community',
            items: [
                'Connect with 20,000+ practitioners',
                'Get support, ask questions',
                'Find referral partners',
                'Never feel alone on this journey',
            ],
        },
        {
            type: 'heading',
            content: 'The Full Certification Investment',
        },
        {
            type: 'key-point',
            content: `Full board certification: $297. That's less than 2 client sessions at average rates. Get 2 clients, and you've broken even. Everything after that is income AND impact. Most graduates get their first paying client within 30 days.`,
        },
        {
            type: 'heading',
            content: 'A Note From Me',
        },
        {
            type: 'text',
            content: `{name}, I started this journey at 43. Scared. No medical background. Just a burning desire to help people and escape my corporate job. Today, I help over 20,000 practitioners do the same thing.`,
        },
        {
            type: 'text',
            content: `If you're feeling scared, uncertain, wondering if this is for you - I get it. I felt all of that. But here's what I know now: The world needs more people who understand root-cause health. Your friends need you. Your family needs you. Your community needs you.`,
        },
        {
            type: 'text',
            content: `The only question is: Are you ready to answer that call?`,
        },
        {
            type: 'callout',
            content: `Your certificate is ready. Your future clients are waiting. The only thing standing between you and this new chapter is a decision. I believe in you. Now it's time for you to believe in yourself.`,
            style: 'success',
        },
        {
            type: 'heading',
            content: 'Congratulations!',
        },
        {
            type: 'text',
            content: `You did it. You finished. That alone puts you ahead of 90% of people who start things but never finish. I'm proud of you. Now let's make this count. Download your certificate, and when you're ready, I'll be here for the next step.`,
        },
    ];

    const keyTakeaways = [
        '2 clients at $175/session = full certification investment recovered',
        'Typical 12-month graduate: 10-15 clients, $175-225/session, $3,500-5,500/month',
        'Part-time (15-20 hrs/week) can generate $4,000-6,000/month',
        'You now know more about root-cause health than most healthcare providers',
        'The world needs more people who understand functional medicine',
        'Download your certificate - you earned it!',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Your Income Potential"
            lessonSubtitle="Real numbers from real graduates"
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
