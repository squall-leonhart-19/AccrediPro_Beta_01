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

export function ClassicLessonInflammationConnection({
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
            content: `{name}, I'm about to tell you something that will change how you see disease forever. There's ONE thing that connects heart disease, diabetes, Alzheimer's, cancer, depression, and autoimmune conditions. It's not genetics. It's not bad luck. It's INFLAMMATION. Research now links chronic inflammation to the #1 killer in America (heart disease), Type 2 diabetes, obesity, dementia, cancer, and every autoimmune condition. If you understand inflammation, you understand 80% of chronic disease. This is why anti-inflammatory coaching is a $2.3 BILLION market - and growing.`,
        },
        {
            type: 'heading',
            content: '"But I Don\'t Have a Science Background..."',
        },
        {
            type: 'text',
            content: `When people hear "inflammation" they think they need to understand complex biochemistry. They don't. Here's what you actually need to know:`,
        },
        {
            type: 'key-point',
            content: `Inflammation is your body's fire alarm. Acute inflammation: The alarm goes off, fire gets put out, alarm stops. (Good!) Chronic inflammation: The alarm is STUCK ON, 24/7, damaging everything. (Bad!) That's the foundation. You don't need to explain cytokines or NF-kB pathways. You need to help clients understand their alarm is stuck on and show them how to turn it off.`,
        },
        {
            type: 'callout',
            content: `A graduate told us: "I was terrified of the 'science stuff.' Now I explain inflammation to clients using simple analogies. They get it. I get results. Nobody cares that I don't have a PhD."`,
            style: 'tip',
        },
        {
            type: 'heading',
            content: 'Real Story: Jennifer, 49 - Former Stay-at-Home Mom',
        },
        {
            type: 'quote',
            content: `"I raised 4 kids. No career. No degree. At 47, I felt lost. My own inflammation journey started with mysterious joint pain, brain fog, and weight gain. Doctors said 'you're just getting older.' I refused to accept that. I found functional medicine, fixed my own inflammation, and thought: 'Other women need to know this.' Now I specialize in inflammation for women 40+. My numbers: 14 active clients, $175/session average, monthly income $4,900, working around my family's schedule. My husband was skeptical at first. Now he brags about his 'doctor wife.' (I'm not a doctor - I'm a health coach. But I'll take it!)" - Jennifer R., Wisconsin | ASI Graduate 2023`,
        },
        {
            type: 'heading',
            content: 'Two Types of Inflammation',
        },
        {
            type: 'list',
            content: 'ACUTE INFLAMMATION (Good):',
            items: [
                'Cut your finger → swells, reddens → heals',
                'Catch a cold → fever, fatigue → recovery',
                'Sprain your ankle → swelling → repair',
                'Has a clear start, middle, and end',
            ],
        },
        {
            type: 'list',
            content: 'CHRONIC INFLAMMATION (Bad):',
            items: [
                'Low-grade, constant fire',
                'No obvious trigger',
                'Never fully "turns off"',
                'Silently damages tissues for YEARS',
            ],
        },
        {
            type: 'callout',
            content: `The scary part: You can have chronic inflammation for a DECADE before it shows up as a "disease." This is why functional medicine catches problems 5-10 years before conventional medicine. We look for the smoke before the fire burns down the house.`,
            style: 'warning',
        },
        {
            type: 'heading',
            content: 'Signs You\'ll Recognize in Clients',
        },
        {
            type: 'list',
            content: 'Common Signs of Chronic Inflammation:',
            items: [
                'Fatigue that doesn\'t improve with sleep',
                'Joint stiffness, especially in mornings',
                'Brain fog or memory issues',
                'Unexplained weight gain',
                'Skin issues, puffiness, bloating',
            ],
        },
        {
            type: 'text',
            content: `Most people just accept these as "normal aging." They're NOT normal. They're fixable. And you'll be the person who finally helps them understand why.`,
        },
        {
            type: 'heading',
            content: 'The 6 Inflammation Triggers',
        },
        {
            type: 'list',
            content: 'Know These - You\'ll Use Them Daily:',
            items: [
                '1. SUGAR & REFINED CARBS - Spikes blood sugar → inflammatory cascade',
                '2. SEED OILS (Vegetable Oils) - Canola, soybean, corn → Omega-6 overload',
                '3. CHRONIC STRESS - Cortisol dysregulation → immune suppression',
                '4. POOR SLEEP - Under 7 hours → inflammatory markers rise 40%',
                '5. GUT DYSFUNCTION - Leaky gut → systemic inflammation',
                '6. TOXIN EXPOSURE - Heavy metals, mold, chemicals → body treats as threats',
            ],
        },
        {
            type: 'key-point',
            content: `Most people have 3-4 of these going at once. That's why they feel terrible. Your job is to help them identify and address their personal triggers.`,
        },
        {
            type: 'heading',
            content: 'Your Role: Education, Not Diagnosis',
        },
        {
            type: 'list',
            content: 'What YOU Do:',
            items: [
                'Educate on inflammation triggers',
                'Help identify their personal triggers',
                'Create anti-inflammatory meal plans',
                'Suggest lifestyle modifications',
                'Recommend supplements (as education)',
                'Track progress and symptoms',
            ],
        },
        {
            type: 'list',
            content: 'What DOCTORS Do:',
            items: [
                'Run inflammatory marker tests (CRP, ESR)',
                'Diagnose autoimmune conditions',
                'Prescribe medications when needed',
                'Rule out serious conditions',
            ],
        },
        {
            type: 'callout',
            content: `The partnership: You're the day-to-day coach. The doctor is the diagnostic partner. Together, you help clients far better than either could alone. Doctors often REFER to coaches like us because they don't have time for lifestyle education.`,
            style: 'success',
        },
        {
            type: 'heading',
            content: 'Case Study: Think Like a Practitioner',
        },
        {
            type: 'text',
            content: `Maria, 48, works in marketing. She has: fatigue for 3+ years (doctors say labs are "normal"), joint pain in hands and knees (worse every morning), brain fog (can't focus on work), gained 15 lbs in the last year without changing diet, skin breakouts at 48, and feels "puffy" most days.`,
        },
        {
            type: 'key-point',
            content: `What's the most likely underlying issue? CHRONIC SYSTEMIC INFLAMMATION. All her symptoms point to it: joint pain, brain fog, weight resistance, skin issues, puffiness. These are classic inflammatory markers that conventional medicine often misses. As her coach, you'd help her identify triggers, create an anti-inflammatory protocol, and track progress. Within 3 months, most symptoms would likely improve significantly.`,
        },
        {
            type: 'callout',
            content: `Maria would be a 4-6 month client. At $175/session twice monthly, that's $1,400-2,100 from ONE client who finally gets answers.`,
            style: 'success',
        },
        {
            type: 'heading',
            content: 'The Anti-Inflammatory Niche: Income Breakdown',
        },
        {
            type: 'list',
            content: 'The Market Opportunity:',
            items: [
                '77% of Americans have chronic inflammatory symptoms',
                '$2.3 billion anti-inflammatory coaching market',
                'Growing 12% annually',
            ],
        },
        {
            type: 'list',
            content: 'Typical Client Package (12-Week Reset):',
            items: [
                'Initial assessment (90 min): $250',
                '10 weekly sessions (60 min): $1,750',
                'Email support included',
                'TOTAL: $2,000 per client',
            ],
        },
        {
            type: 'key-point',
            content: `5 clients x $2,000 = $10,000 over 12 weeks. That's $3,333/month from 5 people. Graduate quote: "I charge $2,400 for my 12-week inflammation program. I currently have 6 clients. Do the math."`,
        },
        {
            type: 'heading',
            content: 'Real Story: Barbara, 54 - Former Office Manager',
        },
        {
            type: 'quote',
            content: `"I managed an office for 15 years. When I got laid off at 52, I thought my life was over. My own health issues - fibromyalgia, chronic fatigue, constant pain - had plagued me for years. When functional medicine helped me feel 20 years younger, I knew I had to share it. The certification was scary at 52. 'Am I too old? Will anyone take me seriously?' Turns out, being 54 is an ADVANTAGE. My clients are mostly women 45-60. They trust me because I've walked their path. Current status: 11 clients, $200/session, monthly income $4,400. Age isn't a barrier. It's credibility." - Barbara L., Colorado | ASI Graduate 2024`,
        },
        {
            type: 'heading',
            content: 'Your Personal Inflammation Audit',
        },
        {
            type: 'text',
            content: `Rate yourself 1-10 on each trigger: Sugar/refined carb intake, Seed oil consumption, Stress level, Sleep quality, Gut symptoms, Toxin exposure. High scores (7+) = Priority areas. This is EXACTLY what you'll do with clients. Simple. Actionable. Eye-opening. Most clients have never thought about their health this way.`,
        },
        {
            type: 'heading',
            content: 'Coming Up: The Toxin Reality',
        },
        {
            type: 'text',
            content: `You're officially thinking like a practitioner now! Next up: TOXINS. We're diving into the uncomfortable truth about how poisoned our modern world is - and how to safely help clients detox without dangerous fads.`,
        },
        {
            type: 'list',
            content: 'What you\'ll learn:',
            items: [
                '80,000+ synthetic chemicals in our environment',
                'Why most "detox" programs are dangerous',
                'The right way to support detoxification',
                'Why mold illness is a hidden epidemic',
            ],
        },
    ];

    const keyTakeaways = [
        'Chronic inflammation is the common thread in 80% of chronic diseases',
        'You don\'t need a science background - just understand patterns and triggers',
        'The 6 triggers: Sugar, seed oils, stress, poor sleep, gut dysfunction, toxins',
        'You educate and coach; doctors diagnose and test - you partner together',
        'The anti-inflammatory market is $2.3B and growing 12% annually',
        'A 12-week inflammation program can generate $2,000+ per client',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Inflammation Blueprint"
            lessonSubtitle="The $2.3B market hiding in plain sight"
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
