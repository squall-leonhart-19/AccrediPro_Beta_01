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
        // BRIDGE FROM LESSON 4
        {
            type: 'intro',
            content: `{name}, I want to ask you something personal. Be honest with yourself... Do you ever feel "wired but tired"? Like you can't relax even when you have nothing to do? Like you're running on fumes but your brain won't turn off? If that sounds familiar, you're not alone. That's your **HPA axis** screaming for help.`,
        },

        // THE GAP
        {
            type: 'heading',
            content: 'The Burnout Epidemic Nobody\'s Solving',
        },
        {
            type: 'list',
            content: '',
            items: [
                '**77%** of workers experience burnout symptoms',
                '**83%** of US workers suffer from work-related stress',
                'Women 40+ are hit hardest (the "sandwich generation")',
                'Post-pandemic burnout is at all-time highs',
            ],
        },
        {
            type: 'text',
            content: `What's the typical doctor's solution? "Here's an antidepressant." But that doesn't fix the ROOT CAUSE. It masks the symptoms while the underlying dysfunction gets worse.`,
        },

        // DEFINITION
        {
            type: 'definition',
            term: 'The HPA Axis',
            content: `The **H**ypothalamic-**P**ituitary-**A**drenal axis is your body's central stress response system. When your brain perceives threat (real OR imagined), it signals through this pathway to release **cortisol**. The problem: Your body can't tell the difference between a tiger chasing you and a stressful email. Modern life keeps this system ON 24/7.`,
        },

        // HOW IT WORKS
        {
            type: 'heading',
            content: 'How Your Stress System Works',
        },
        {
            type: 'list',
            content: '',
            items: [
                '**H**ypothalamus — Your brain\'s control center perceives stress',
                '**P**ituitary — The "master gland" signals the adrenals',
                '**A**drenals — Release cortisol (the "stress hormone")',
                'Body shifts to **survival mode** — digestion stops, immune suppressed, energy diverted',
            ],
        },
        {
            type: 'callout',
            content: `The problem: This system was designed for occasional threats (a predator, a famine). But modern life triggers it constantly - emails, traffic, news, social media, work deadlines. We're living in chronic "survival mode."`,
            style: 'warning',
        },

        // THE 3 STAGES - FRAMEWORK
        {
            type: 'heading',
            content: 'The 3 Stages of HPA Dysfunction',
        },
        {
            type: 'framework',
            content: '',
            framework: {
                name: 'The Burnout Progression',
                steps: [
                    {
                        letter: '1',
                        title: 'Alarm (Wired)',
                        description: 'High cortisol all day. Can\'t relax or sleep well. Anxiety, racing thoughts. "Running on adrenaline." Feels productive but unsustainable.',
                    },
                    {
                        letter: '2',
                        title: 'Resistance (Tired But Pushing)',
                        description: 'Cortisol rhythm disrupted. Morning fatigue + afternoon crash. NEED coffee to function. Weight gain around middle. Most common when clients seek help.',
                    },
                    {
                        letter: '3',
                        title: 'Exhaustion (Depleted)',
                        description: 'Adrenals can\'t keep up anymore. Low cortisol. Severe fatigue, can\'t recover. Depression, brain fog. Everything feels overwhelming.',
                    },
                ],
            },
        },
        {
            type: 'key-point',
            content: `Most people who come to you will be in **Stage 2** - tired but still pushing. If you don't intervene, they'll progress to Stage 3 within 1-2 years. This is why early intervention matters SO much.`,
        },

        // PREGNENOLONE STEAL
        {
            type: 'heading',
            content: 'The Pregnenolone Steal: Why Stress Wrecks Hormones',
        },
        {
            type: 'text',
            content: `This concept explains SO much about why stressed women have hormone issues:`,
        },
        {
            type: 'definition',
            term: 'Pregnenolone Steal',
            content: `Pregnenolone is the "**mother hormone**" - it makes ALL other hormones. Under chronic stress, your body prioritizes SURVIVAL (cortisol) over THRIVING (sex hormones). It literally "steals" pregnenolone to make more cortisol, leaving little for estrogen, progesterone, and testosterone.`,
        },
        {
            type: 'text',
            content: `This is why stressed women experience:`,
        },
        {
            type: 'list',
            content: '',
            items: [
                '**Low libido** (low testosterone)',
                '**Irregular cycles** (low progesterone)',
                '**Fertility struggles** (hormone imbalance)',
                '**Stubborn belly fat** (cortisol storage pattern)',
                '**Mood swings and depression** (neurotransmitter disruption)',
            ],
        },
        {
            type: 'callout',
            content: `The beautiful part: Fix the stress response, and hormones often normalize WITHOUT hormone replacement. You're addressing the ROOT CAUSE of hormone issues, not just adding more hormones.`,
            style: 'success',
        },

        // CASE STUDY
        {
            type: 'heading',
            content: 'Real Client: Jennifer\'s "Just Stress"',
        },
        {
            type: 'text',
            content: `Jennifer, 42, marketing executive, single mom of 2 teenagers. Her doctor said she was "just stressed" and offered antidepressants. Here's what was actually happening:`,
        },
        {
            type: 'list',
            content: '',
            items: [
                'Wakes up exhausted no matter how much she sleeps',
                'Needs 3+ cups of coffee just to function',
                'Crashes hard around 3pm every day',
                'Gained 20 lbs around her midsection in 2 years',
                'Periods became irregular and heavier',
                'Snaps at her kids, then feels guilty',
            ],
        },
        {
            type: 'key-point',
            content: `This is textbook **Stage 2 HPA dysfunction**. The morning exhaustion + caffeine dependence + afternoon crash = cortisol rhythm disruption. The midsection weight gain = cortisol storage pattern. Using the R.O.O.T Method: RECOGNIZE the pattern, trace ORIGINS to HPA dysfunction, OPTIMIZE with the 4 pillars (next section), and TRACK her progress.`,
        },

        // THE 4 PILLARS - FRAMEWORK
        {
            type: 'heading',
            content: 'The 4 Pillars of HPA Recovery',
        },
        {
            type: 'text',
            content: `These are non-negotiables for every burnout client:`,
        },
        {
            type: 'framework',
            content: '',
            framework: {
                name: 'The 4 Recovery Pillars',
                steps: [
                    {
                        letter: '1',
                        title: 'Sleep',
                        description: 'Non-negotiable 7-8 hours. Consistent times. Dark, cool room. No screens 1 hour before bed. This is when the HPA axis resets.',
                    },
                    {
                        letter: '2',
                        title: 'Morning Light',
                        description: 'Sunlight within 30 minutes of waking. This resets the cortisol rhythm. 10 minutes outside or by a bright window.',
                    },
                    {
                        letter: '3',
                        title: 'Blood Sugar',
                        description: 'Protein with every meal. No skipping meals. Blood sugar crashes trigger cortisol spikes. Stable fuel = stable hormones.',
                    },
                    {
                        letter: '4',
                        title: 'Nervous System',
                        description: 'Daily parasympathetic activation. Breathwork, meditation, gentle yoga, or even just 5 minutes of slow breathing. This tells the HPA axis "you\'re safe."',
                    },
                ],
            },
        },

        // INCOME CALCULATOR TEASER - MIDPOINT BONUS
        {
            type: 'callout',
            content: `🎉 **HALFWAY BONUS: See Your Earning Potential!**

You're halfway through your certification! Before we continue, take 30 seconds to calculate what you could earn as a certified Functional Medicine Practitioner.

👉 **[Try the Income Calculator](/portal/functional-medicine/tools/income-calculator)**

*The full version unlocks after Lesson 9!*`,
            style: 'tip',
        },

        // SCOPE OF PRACTICE
        {
            type: 'heading',
            content: 'Your Role: Lifestyle & Education',
        },
        {
            type: 'before-after',
            content: '',
            before: {
                title: 'What Doctors Do',
                items: [
                    'Order cortisol testing (blood/saliva)',
                    'Diagnose adrenal conditions',
                    'Prescribe medications if needed',
                    'Rule out serious conditions',
                ],
            },
            after: {
                title: 'What You Do',
                items: [
                    'Educate on HPA axis function',
                    'Identify lifestyle stress triggers',
                    'Implement the 4 Recovery Pillars',
                    'Track symptoms and progress over time',
                ],
            },
        },

        // CHECK YOUR KNOWLEDGE
        {
            type: 'quiz',
            content: '',
            questions: [
                {
                    question: 'What is the HPA axis and why is it important?',
                    options: [
                        'A digestive system pathway that processes nutrients',
                        'The Hypothalamic-Pituitary-Adrenal axis that regulates stress response',
                        'A measurement tool for blood pressure',
                        'A type of exercise technique for stress relief',
                    ],
                    correctIndex: 1,
                    explanation: 'The HPA (Hypothalamic-Pituitary-Adrenal) axis is your body\'s central stress response system. Chronic HPA dysfunction leads to hormone imbalances, fatigue, weight gain, and weakened immunity.',
                },
                {
                    question: 'What is "Pregnenolone Steal"?',
                    options: [
                        'A type of medication for stress',
                        'When the body prioritizes cortisol over sex hormones under chronic stress',
                        'A medical test for hormone levels',
                        'A diet that reduces cortisol',
                    ],
                    correctIndex: 1,
                    explanation: 'Under chronic stress, the body "steals" pregnenolone (the mother hormone) to make more cortisol instead of sex hormones. This explains why stressed women have low libido, irregular cycles, and hormone issues.',
                },
            ],
        },

        // BRIDGE TO NEXT LESSON
        {
            type: 'heading',
            content: 'Coming Up: Nutrient Deficiencies',
        },
        {
            type: 'text',
            content: `You now understand why chronic stress destroys health at the hormonal level. But here's what most people don't realize: even people who "eat healthy" are often **nutritionally depleted**.`,
        },
        {
            type: 'callout',
            content: `Next lesson: Why modern food is nutritionally bankrupt. The key nutrients that affect EVERYTHING. And why "normal" lab values don't mean optimal health.`,
            style: 'tip',
        },
    ];

    const keyTakeaways = [
        'The **HPA axis** is your stress response system - modern life keeps it ON 24/7',
        '3 Stages: **Alarm** (wired) → **Resistance** (tired but pushing) → **Exhaustion** (depleted)',
        '**Pregnenolone Steal**: Stress hormones get priority over sex hormones',
        'This explains low libido, irregular cycles, weight gain, mood issues',
        'The **4 Recovery Pillars**: Sleep, Morning Light, Blood Sugar, Nervous System',
        'Your role: lifestyle education and implementation support',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Stress & The HPA Axis"
            lessonSubtitle="Why burnout is a hormone problem, not a willpower problem"
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
