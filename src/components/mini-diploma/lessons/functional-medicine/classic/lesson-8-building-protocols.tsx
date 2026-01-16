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
        {
            type: 'intro',
            content: `{name}, let's talk about something that terrifies most new coaches: "Who would actually PAY me?" This is the #1 fear. And I get it. I had it too. But here's what I've learned after helping hundreds of graduates build practices: Your ideal clients are EVERYWHERE. You just don't know how to see them yet.`,
        },
        {
            type: 'heading',
            content: '"Who Would Pay ME?"',
        },
        {
            type: 'text',
            content: `Let me tell you who's looking for you RIGHT NOW:`,
        },
        {
            type: 'list',
            content: 'Your Ideal Clients:',
            items: [
                'Women 40-60 who\'ve tried everything and still feel terrible',
                'People told "your labs are normal" but know something is wrong',
                'Busy professionals who can\'t figure out why they\'re exhausted',
                'Health-conscious people who want to PREVENT disease, not just treat it',
                'People tired of 7-minute doctor visits that solve nothing',
            ],
        },
        {
            type: 'callout',
            content: `These people are on YOUR Facebook. In YOUR neighborhood. At YOUR gym. They're your sister-in-law, your coworker, your friend from church. They're waiting for someone who will LISTEN.`,
            style: 'tip',
        },
        {
            type: 'heading',
            content: '"But I\'m Not Certified Yet..."',
        },
        {
            type: 'text',
            content: `Here's a secret: People don't pay for certifications. They pay for SOLUTIONS.`,
        },
        {
            type: 'list',
            content: 'What Clients Actually Care About:',
            items: [
                'Can you help them feel better? (YES - you know root causes now)',
                'Do you understand their problem? (YES - you may have lived it)',
                'Will you listen to them? (YES - that\'s your competitive advantage)',
                'Are you trustworthy? (YES - your story builds trust)',
            ],
        },
        {
            type: 'key-point',
            content: `The certification gives you confidence and credibility. But your VALUE comes from your knowledge and your ability to help. You already have more knowledge than most people - including many doctors - about root-cause health.`,
        },
        {
            type: 'heading',
            content: 'Real Story: Nancy, 49 - Started Before She Felt "Ready"',
        },
        {
            type: 'quote',
            content: `"I kept waiting until I felt 'ready.' My mentor finally said: 'Nancy, you know more now than 99% of people. Start helping.' My first client was my neighbor who'd complained about fatigue for years. I was terrified. But I helped her identify her root causes (gut issues + nutrient deficiencies), and within 2 months she felt like a new person. She paid me $150/session. Then she referred her sister. Then her coworker. 14 months later: 11 clients, $3,850/month. I was never going to feel 'ready.' I just had to start." - Nancy R., Pennsylvania | ASI Graduate 2023`,
        },
        {
            type: 'heading',
            content: 'The 90-Day Client Acquisition Timeline',
        },
        {
            type: 'text',
            content: `Here's a realistic timeline for building your first client base:`,
        },
        {
            type: 'list',
            content: 'DAYS 1-30: Foundation',
            items: [
                'Finish certification and claim your credentials',
                'Choose your niche (gut health? burnout? inflammation?)',
                'Create a simple offer (90-day program)',
                'Tell 20 people what you\'re doing (social media, in person)',
                'Offer 3 FREE discovery calls to practice',
            ],
        },
        {
            type: 'list',
            content: 'DAYS 31-60: First Clients',
            items: [
                'Convert 2-3 discovery calls into paying clients',
                'Start your first clients at reduced rate ($100-125/session)',
                'Document their results obsessively (for testimonials)',
                'Ask for referrals after session 3 (when they feel better)',
                'Post about your work on social media weekly',
            ],
        },
        {
            type: 'list',
            content: 'DAYS 61-90: Momentum',
            items: [
                'Raise rates to full price ($150-200/session)',
                'Ask happy clients for testimonials and referrals',
                'Get listed in directories (ASI, Health Coach Institute, etc.)',
                'Consider a workshop or free webinar to attract leads',
                'Aim: 5-8 paying clients by Day 90',
            ],
        },
        {
            type: 'callout',
            content: `By Day 90, if you follow this timeline, you should have 5-8 clients paying $150-200/session. That's $1,500-3,200/month while still building. Not quit-your-job money yet - but PROOF OF CONCEPT. Proof that people will pay you.`,
            style: 'success',
        },
        {
            type: 'heading',
            content: 'Pricing Without Apologizing',
        },
        {
            type: 'list',
            content: 'What Other Practitioners Charge:',
            items: [
                'Basic health coach: $50-100/session',
                'Certified Functional Medicine Coach: $150-200/session',
                'Specialized practitioner (burnout, gut, labs): $200-300/session',
                'Premium programs (3-6 months): $2,000-5,000 total',
            ],
        },
        {
            type: 'key-point',
            content: `You have specialized knowledge. You're not a $50 coach. You understand root causes, labs, protocols. You should charge $150-200/session minimum. After 6 months of results, raise to $200-250.`,
        },
        {
            type: 'heading',
            content: 'Real Story: Gloria, 55 - Doubled Her Rates in 6 Months',
        },
        {
            type: 'quote',
            content: `"I started at $100/session because I was scared. After 3 months, I had 8 clients and was overwhelmed. My mentor said: 'Raise your rates or you'll burn out.' I went to $175. Lost 2 clients but gained 3 new ones at the higher rate - making MORE money with LESS work. 6 months later I raised to $225. Now I have a waitlist. The clients who pay more are MORE committed and get BETTER results. Don't undercharge. It attracts the wrong people." - Gloria T., North Carolina | ASI Graduate 2023`,
        },
        {
            type: 'heading',
            content: 'Where to Find Your First Clients',
        },
        {
            type: 'list',
            content: 'Start Here (Free):',
            items: [
                'Your existing network - friends, family, coworkers who know you\'re passionate about health',
                'Facebook - Post about your journey, share what you\'re learning',
                'Local networking - BNI groups, women\'s groups, church groups',
                'Referrals from happy clients - THE #1 source once you start',
            ],
        },
        {
            type: 'list',
            content: 'Build These (Over Time):',
            items: [
                'Practitioner directories - ASI, Health Coach Alliance, Psychology Today',
                'Google Business Profile - Free and powerful for local searches',
                'Partnerships with MDs, chiropractors, acupuncturists',
                'Workshops at yoga studios, gyms, wellness centers',
            ],
        },
        {
            type: 'heading',
            content: 'Coming Up: Your Income Potential',
        },
        {
            type: 'text',
            content: `You've got the clinical knowledge. You've got the business basics. In our final lesson, I'm going to show you EXACTLY what income looks like at different stages - and share the inspiring stories of graduates who built thriving practices.`,
        },
        {
            type: 'list',
            content: 'What you\'ll learn:',
            items: [
                'Real income numbers from graduates at all stages',
                'Part-time vs. full-time practice models',
                'The path from $0 to $5,000+/month',
                'Your next step to make this real',
            ],
        },
    ];

    const keyTakeaways = [
        'Your ideal clients are already in your life - you just haven\'t offered yet',
        'People pay for SOLUTIONS, not certifications - you have solutions',
        'The 90-Day Timeline: Foundation → First Clients → Momentum',
        'Start at $100-125/session, raise to $150-200 after 3 months',
        'Don\'t wait until you feel "ready" - start with people who trust you',
        'Referrals from happy clients will become your #1 client source',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Finding Your First Clients"
            lessonSubtitle="The 90-day path from 0 to paying clients"
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
