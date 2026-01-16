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

export function ClassicLessonStressHPA({
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
            content: `{name}, I want to ask you something personal. Be honest with yourself... Do you ever feel "wired but tired"? Like you can't relax even when you have nothing to do? Like you're running on fumes but your brain won't turn off? If that sounds familiar, you're not alone. That's your HPA axis screaming for help. And it's happening to MILLIONS of women right now.`,
        },
        {
            type: 'heading',
            content: 'The Burnout Epidemic',
        },
        {
            type: 'key-point',
            content: `77% of workers experience burnout symptoms. 83% of US workers suffer from work-related stress. Women 40+ are hit hardest (sandwich generation). Post-pandemic burnout is at all-time highs. Doctors' solution? Usually: "Here's an antidepressant." This is a MASSIVE, underserved market. And it's personal for most of us.`,
        },
        {
            type: 'heading',
            content: '"I\'m Too Old/Tired/Burned Out to Start..."',
        },
        {
            type: 'text',
            content: `Here's the truth: Your exhaustion is your CREDENTIAL. Think about it:`,
        },
        {
            type: 'list',
            content: 'Why Your Experience Matters:',
            items: [
                'You\'ve LIVED this. You understand it viscerally.',
                'Your clients will be women like you. They\'ll trust you.',
                'Healing yourself teaches you how to heal others.',
                'Your story becomes your most powerful marketing tool.',
            ],
        },
        {
            type: 'callout',
            content: `A graduate told us: "I started this certification at rock bottom. Adrenal fatigue, couldn't get through the day. As I learned and applied the principles, I healed myself. Now I help other burned-out moms do the same. My lowest point became my launching pad." Age isn't a barrier in this work. It's your competitive advantage.`,
            style: 'tip',
        },
        {
            type: 'heading',
            content: 'Real Story: Carol, 56 - Started at "Too Old"',
        },
        {
            type: 'quote',
            content: `"I turned 54 and thought my best years were behind me. Empty nest. Menopause. Burned out from 30 years in corporate HR. Then I got certified. I specifically target women 50+ dealing with burnout and hormone changes. Why? Because I AM one. My clients say: 'You get it. You're not some 28-year-old who doesn't understand.' Being older is my MARKETING. I charge $225/session because my experience IS the value. Current stats (2 years in): 13 active clients, monthly income $5,850, working 18 hours/week. At 56, I'm making more money with less stress than my entire corporate career. Don't tell me you're too old." - Carol M., New Jersey | ASI Graduate 2022`,
        },
        {
            type: 'heading',
            content: 'The HPA Axis Explained Simply',
        },
        {
            type: 'list',
            content: 'What the HPA Axis Is:',
            items: [
                'H = Hypothalamus (brain\'s control center)',
                'P = Pituitary (master hormone gland)',
                'A = Adrenals (stress response glands)',
            ],
        },
        {
            type: 'list',
            content: 'How It Works:',
            items: [
                '1. Brain perceives stress (real OR imagined)',
                '2. Hypothalamus signals pituitary',
                '3. Pituitary signals adrenals',
                '4. Adrenals release CORTISOL',
                '5. Body shifts to "survival mode"',
            ],
        },
        {
            type: 'callout',
            content: `The problem: Your body can't tell the difference between a tiger chasing you and a stressful email. It responds the SAME way: Cortisol, cortisol, cortisol. Modern life keeps this system ON 24/7. That's why everyone is exhausted.`,
            style: 'warning',
        },
        {
            type: 'heading',
            content: 'The 3 Stages of HPA Dysfunction',
        },
        {
            type: 'list',
            content: 'STAGE 1: ALARM (Wired)',
            items: [
                'High cortisol all day long',
                'Can\'t relax or sleep well',
                'Anxiety, racing thoughts',
                '"Running on adrenaline"',
            ],
        },
        {
            type: 'list',
            content: 'STAGE 2: RESISTANCE (Tired but pushing)',
            items: [
                'Cortisol rhythm disrupted',
                'Morning fatigue, afternoon crash',
                'NEED coffee to function',
                'Weight gain around middle',
                'Most common when clients seek help',
            ],
        },
        {
            type: 'list',
            content: 'STAGE 3: EXHAUSTION (Depleted)',
            items: [
                'Low cortisol (adrenals can\'t keep up)',
                'Severe fatigue, can\'t recover',
                'Depression, brain fog',
                'Everything feels overwhelming',
            ],
        },
        {
            type: 'heading',
            content: 'The Pregnenolone Steal',
        },
        {
            type: 'text',
            content: `Pregnenolone is the "mother hormone" - it makes ALL other hormones. Under chronic stress, your body prioritizes SURVIVAL (cortisol) over THRIVING (sex hormones). It literally "steals" pregnenolone from making estrogen, progesterone, testosterone, and DHEA.`,
        },
        {
            type: 'list',
            content: 'Why Stressed Women Experience:',
            items: [
                'Low libido (low testosterone)',
                'Irregular cycles (low progesterone)',
                'Fertility issues',
                'Stubborn weight gain',
                'Mood swings and depression',
            ],
        },
        {
            type: 'key-point',
            content: `The beautiful part: Fix the stress, and hormones often normalize WITHOUT hormone replacement. This is why burnout coaching is so powerful - you're addressing the ROOT CAUSE of hormone issues.`,
        },
        {
            type: 'heading',
            content: 'Case Study: Jennifer\'s Exhaustion',
        },
        {
            type: 'text',
            content: `Jennifer, 42, marketing executive, single mom of 2 teenagers. Symptoms: Wakes up exhausted no matter how much she sleeps. Needs 3+ cups of coffee to function. Crashes hard around 3pm every day. Gained 20 lbs around her midsection in 2 years. Periods became irregular and heavier. Snaps at her kids, then feels guilty.`,
        },
        {
            type: 'key-point',
            content: `Diagnosis: Stage 2 HPA dysfunction. The morning exhaustion + caffeine dependence + afternoon crash is classic cortisol rhythm disruption. The midsection weight gain happens because cortisol promotes fat storage there. Without intervention, she'll progress to Stage 3 within 1-2 years. Jennifer would be a 6-month client minimum at $2,000-4,000 for a burnout recovery program.`,
        },
        {
            type: 'heading',
            content: 'The Burnout Niche: Premium Pricing',
        },
        {
            type: 'list',
            content: 'Your Target Client:',
            items: [
                'High-achieving women 35-55',
                'Disposable income (they have good jobs)',
                'Desperate for answers (doctors haven\'t helped)',
                'Long-term relationships (recovery takes time)',
            ],
        },
        {
            type: 'list',
            content: 'Typical Pricing:',
            items: [
                'Initial Burnout Assessment (90 min): $250-350',
                '12-Week Burnout Recovery Program: $2,400-3,600',
                '6-Month Adrenal Recovery Package: $3,600-5,400',
            ],
        },
        {
            type: 'callout',
            content: `Graduate Reality: "My burnout clients have MONEY. They're executives, business owners, successful women. They'll pay $300/session without blinking if you can help them feel human again." - Teresa K., ASI Graduate`,
            style: 'success',
        },
        {
            type: 'heading',
            content: 'Real Story: Donna, 48 - Former Nurse',
        },
        {
            type: 'quote',
            content: `"I was a burned-out ER nurse for 20 years. The pandemic broke me. I couldn't go back. Getting certified in functional medicine felt like learning why I was so destroyed. It was therapy AND career training. My niche now: Healthcare workers with burnout. Nurses, doctors, first responders. They trust me because I've BEEN there. The numbers (14 months in): 11 clients (all healthcare workers), $200/session, monthly income $4,400. I make less than nursing but I'm ALIVE again. You don't have to stay burned out forever." - Donna R., Minnesota | ASI Graduate 2024`,
        },
        {
            type: 'heading',
            content: 'The 4 Pillars of HPA Recovery',
        },
        {
            type: 'list',
            content: 'Use These With Every Burnout Client:',
            items: [
                '1. SLEEP - Non-negotiable 7-8 hours, consistent times, dark cool room',
                '2. MORNING LIGHT - Sunlight within 30 min of waking, resets cortisol',
                '3. BLOOD SUGAR - Protein with every meal, no skipping meals',
                '4. NERVOUS SYSTEM - Daily breathwork, meditation, or gentle yoga',
            ],
        },
        {
            type: 'heading',
            content: 'Coming Up: Lab Interpretation Secrets',
        },
        {
            type: 'text',
            content: `You just diagnosed a case that most doctors would miss entirely. They'd prescribe antidepressants. You found the root cause. Next up: LAB INTERPRETATION - where you learn to see what doctors miss.`,
        },
        {
            type: 'list',
            content: 'What you\'ll learn:',
            items: [
                'Why "normal" labs don\'t mean healthy',
                'The 5 functional markers you MUST know',
                'How to position yourself as premium with lab knowledge',
                'Why clients LOVE getting labs reviewed',
            ],
        },
    ];

    const keyTakeaways = [
        'Your burnout experience is your CREDENTIAL, not a weakness',
        'The HPA axis controls stress response - modern life keeps it stuck ON',
        '3 stages: Alarm (wired), Resistance (tired but pushing), Exhaustion (depleted)',
        'Pregnenolone steal explains why stress causes hormone problems',
        'Burnout coaching commands premium prices ($200-300/session)',
        'The 4 pillars: Sleep, Morning Light, Blood Sugar, Nervous System',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Stress & Hormones Decoded"
            lessonSubtitle="Why women 40+ need YOU (not antidepressants)"
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
