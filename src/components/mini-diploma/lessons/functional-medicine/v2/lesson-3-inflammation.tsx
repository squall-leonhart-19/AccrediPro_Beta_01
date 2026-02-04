"use client";

import { useState } from "react";
import { LessonBaseV2, Message } from "../../shared/lesson-base-v2";
import { CaseStudyChallenge } from "../../shared/interactive-elements";

interface LessonProps {
    lessonNumber: number;
    totalLessons?: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

export function Lesson3Inflammation({
    lessonNumber,
    totalLessons = 9,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const [score, setScore] = useState(0);

    const messages: Message[] = [
        // HOOK - Shocking Stat
        {
            id: 1,
            type: 'coach',
            content: `{name}, I'm about to tell you something that will change how you see disease forever...`,
        },
        {
            id: 2,
            type: 'coach',
            content: `There's ONE thing that connects heart disease, diabetes, Alzheimer's, cancer, depression, and autoimmune conditions.`,
        },
        {
            id: 3,
            type: 'coach',
            content: `It's not genetics. It's not bad luck. It's INFLAMMATION.`,
        },
        {
            id: 4,
            type: 'system',
            content: `**The Inflammation Connection**

Research now links chronic inflammation to:
- Heart disease (the #1 killer in America)
- Type 2 diabetes and obesity
- Alzheimer's and dementia
- Cancer (tumor growth and spread)
- Depression and anxiety
- Every autoimmune condition

**The key insight:**
If you understand inflammation, you understand 80% of chronic disease.

This is why anti-inflammatory coaching is a $2.3 BILLION market - and growing.`,
            systemStyle: 'stats',
        },

        // INFLAMMATION NICHE SPOTLIGHT
        {
            id: 5,
            type: 'system',
            content: `**🔥 NICHE SPOTLIGHT: Inflammation & Autoimmune Specialists**

**The Market:**
- 24 million Americans have autoimmune diseases
- 77% of Americans have chronic inflammatory symptoms
- Inflammation is linked to 8 of the 10 leading causes of death

**What Practitioners Earn:**
- Average: $4,400 - $6,200/month
- Sessions: $175-250 each
- Premium programs: $2,000-3,000 for 12-week resets

**Why This Niche Wins:**
- DESPERATE clients (autoimmune patients are often dismissed by doctors)
- Long-term relationships (inflammation management is ongoing)
- High-ticket packages (12-week programs common)
- Results people can FEEL (more energy, less pain)

"I specialize in autoimmune. My 12-week program is $2,400. I have 7 clients right now." - Jennifer, 49`,
            systemStyle: 'income-hook',
        },

        // OBJECTION CRUSHER: "I don't have science background"
        {
            id: 5,
            type: 'coach',
            content: `Now, when people hear "inflammation" they think they need to understand complex biochemistry. They don't.`,
        },
        {
            id: 6,
            type: 'system',
            content: `**"But I Don't Have a Science Background..."**

Here's what you actually need to know:

**The Simple Truth:**
Inflammation is your body's fire alarm.
- Acute inflammation: The alarm goes off, fire gets put out, alarm stops. (Good!)
- Chronic inflammation: The alarm is STUCK ON, 24/7, damaging everything. (Bad!)

That's it. That's the foundation.

You don't need to explain cytokines, prostaglandins, or NF-kB pathways to clients. You need to:
1. Help them understand their alarm is stuck on
2. Show them how to turn it off

A graduate told us: "I was terrified of the 'science stuff.' Now I explain inflammation to clients using simple analogies. They get it. I get results. Nobody cares that I don't have a PhD."`,
            systemStyle: 'comparison',
        },

        // REAL TESTIMONIAL
        {
            id: 8,
            type: 'system',
            content: `**Meet Jennifer, 49 - Former Stay-at-Home Mom**

"I raised 4 kids. No career. No degree. At 47, I felt lost.

My own inflammation journey started with mysterious joint pain, brain fog, and weight gain. Doctors said 'you're just getting older.' I refused to accept that.

I found functional medicine, fixed my own inflammation, and thought: 'Other women need to know this.'

The certification was my confidence builder. Now I specialize in inflammation for women 40+.

My numbers:
- 16 active clients
- $200/session average
- Monthly income: $5,600
- Working around my family's schedule

My husband was skeptical at first. Now he brags to everyone about his 'doctor wife.' (I'm not a doctor - I'm a health coach. But I'll take it!)

- Jennifer R., Wisconsin | $5,600/month | 20 hrs/week`,
            systemStyle: 'testimonial',
        },

        // TEACH - Two Types of Inflammation
        {
            id: 8,
            type: 'coach',
            content: `Let me teach you the difference between good inflammation and bad inflammation. This is something you'll explain to every single client.`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Two Types of Inflammation**

**ACUTE INFLAMMATION (Good)**
- Cut your finger → swells, reddens → heals
- Catch a cold → fever, fatigue → recovery
- Sprain your ankle → swelling → repair

This is your body WORKING. It has a clear start, middle, and end.

**CHRONIC INFLAMMATION (Bad)**
- Low-grade, constant fire
- No obvious trigger
- Never fully "turns off"
- Silently damages tissues for YEARS

**The scary part:**
You can have chronic inflammation for a DECADE before it shows up as a "disease."

This is why functional medicine catches problems 5-10 years before conventional medicine. We look for the smoke before the fire burns down the house.`,
            systemStyle: 'comparison',
        },

        // SIGNS OF CHRONIC INFLAMMATION
        {
            id: 10,
            type: 'user-choice',
            content: `Do you or someone you know experience any of these?`,
            choices: [
                "Fatigue that doesn't improve with sleep",
                "Joint stiffness, especially mornings",
                "Brain fog or memory issues",
                "All of these sound familiar!",
            ],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `These are ALL signs of chronic inflammation. And most people just accept them as "normal aging." They're NOT normal. They're fixable.`,
        },

        // THE 6 TRIGGERS
        {
            id: 12,
            type: 'coach',
            content: `Now let me show you the 6 hidden triggers that keep inflammation going. When you know these, you can help almost anyone reduce their inflammation.`,
        },
        {
            id: 13,
            type: 'system',
            content: `**The 6 Inflammation Triggers**

**1. SUGAR & REFINED CARBS**
- Spikes blood sugar → inflammatory cascade
- The #1 trigger for most people

**2. SEED OILS (Vegetable Oils)**
- Canola, soybean, corn, safflower
- Omega-6 overload → inflammation

**3. CHRONIC STRESS**
- Cortisol dysregulation → immune suppression
- Stress literally inflames you

**4. POOR SLEEP**
- Under 7 hours → inflammatory markers rise 40%
- Sleep is anti-inflammatory medicine

**5. GUT DYSFUNCTION**
- Leaky gut → systemic inflammation
- (You learned this in Lesson 2!)

**6. TOXIN EXPOSURE**
- Heavy metals, mold, chemicals
- Your body treats them as threats

Most people have 3-4 of these going at once. That's why they feel terrible.`,
            systemStyle: 'takeaway',
        },

        // YOUR ROLE AS COACH
        {
            id: 14,
            type: 'system',
            content: `**Your Role: Education, Not Diagnosis**

Here's exactly how you'll work with inflammation clients:

**You DO:**
✓ Educate on inflammation triggers
✓ Help identify their personal triggers
✓ Create anti-inflammatory meal plans
✓ Suggest lifestyle modifications
✓ Recommend supplements (as education)
✓ Track progress and symptoms

**Doctors DO:**
- Run inflammatory marker tests (CRP, ESR)
- Diagnose autoimmune conditions
- Prescribe medications when needed
- Rule out serious conditions

**The partnership:**
You're the day-to-day coach. The doctor is the diagnostic partner. Together, you help clients far better than either could alone.

Doctors often REFER to coaches like us because they don't have time for lifestyle education.`,
            systemStyle: 'comparison',
        },

        // CASE STUDY
        {
            id: 15,
            type: 'coach',
            content: `Okay {name}, time to think like a practitioner. I'm going to give you a real case. This is exactly what you'll do with clients.`,
        },
        {
            id: 16,
            type: 'custom-component',
            content: '',
            componentProps: { points: 40 },
            renderComponent: ({ onComplete }) => (
                <CaseStudyChallenge
                    caseTitle="Maria's Mystery Symptoms"
                    patientInfo="Maria, 48, works in marketing, married with two teenage kids"
                    symptoms={[
                        "Fatigue for 3+ years - doctors say labs are 'normal'",
                        "Joint pain in hands and knees (worse every morning)",
                        "Brain fog - can't focus on work anymore",
                        "Gained 15 lbs in the last year without changing diet",
                        "Skin breakouts at 48 (never had acne as a teen)",
                        "Feels 'puffy' and bloated most days",
                    ]}
                    question="Based on what you've learned, what's the MOST LIKELY underlying issue?"
                    options={[
                        { id: 'a', label: 'Depression causing fatigue', isCorrect: false, explanation: 'While depression can cause fatigue, it doesn\'t explain the joint pain, weight gain, skin issues, and puffiness together.' },
                        { id: 'b', label: 'Normal aging at 48', isCorrect: false, explanation: 'This is what most doctors say - and it\'s WRONG. These symptoms are not normal aging. They\'re signals that something is off.' },
                        { id: 'c', label: 'Chronic systemic inflammation', isCorrect: true, explanation: 'All signs point to inflammation: joint pain, brain fog, weight resistance, skin issues, puffiness. These are classic inflammatory markers that conventional medicine often misses.' },
                        { id: 'd', label: 'Simple vitamin deficiency', isCorrect: false, explanation: 'While deficiencies could contribute, the combination and pattern of symptoms strongly suggests systemic inflammation.' },
                    ]}
                    expertExplanation="Maria has classic signs of chronic inflammation. The morning joint stiffness, brain fog, unexplained weight gain, and skin issues are all inflammatory markers. As her coach, you'd help her identify triggers (probably gut dysfunction + stress + diet), create an anti-inflammatory protocol, and track her progress. Within 3 months, most of these symptoms would likely improve significantly."
                    incomeHook="Maria would be a 4-6 month client. At $175/session twice monthly, that's $1,400-2,100 from ONE client who finally gets answers."
                    onComplete={(selected, isCorrect) => {
                        onComplete();
                    }}
                />
            ),
        },

        // CELEBRATION
        {
            id: 17,
            type: 'coach',
            content: `You just analyzed a case better than most healthcare providers would! They'd say "normal labs, try antidepressants." You looked deeper.`,
        },

        // INCOME - Unique to Inflammation
        {
            id: 18,
            type: 'system',
            content: `**The Anti-Inflammatory Niche: Income Breakdown**

Why this niche is so profitable:

**The Market:**
- 77% of Americans have chronic inflammatory symptoms
- $2.3 billion anti-inflammatory coaching market
- Growing 12% annually

**Typical Client Package:**

*12-Week Anti-Inflammatory Reset*
- Initial assessment (90 min): $250
- 10 weekly sessions (60 min): $1,750
- Email support included
- **Total: $2,000 per client**

**What 5 clients looks like:**
- 5 clients x $2,000 = $10,000 over 12 weeks
- That's $3,333/month from 5 people

**Graduate Reality Check:**
"I charge $2,400 for my 12-week inflammation program. I currently have 6 clients. Do the math." - Sandra M., ASI Graduate`,
            systemStyle: 'income-hook',
        },

        // SECOND TESTIMONIAL
        {
            id: 20,
            type: 'system',
            content: `**Meet Barbara, 54 - Former Office Manager**

"I managed an office for 15 years. When I got laid off at 52, I thought my life was over.

My own health issues - fibromyalgia, chronic fatigue, constant pain - had plagued me for years. When functional medicine helped me feel 20 years younger, I knew I had to share it.

The certification was scary at 52. 'Am I too old? Will anyone take me seriously?'

Turns out, being 54 is an ADVANTAGE. My clients are mostly women 45-60. They trust me because I've walked their path.

Current status:
- 13 clients
- $225/session
- Monthly income: $5,800
- More fulfillment than 15 years of office work

Age isn't a barrier. It's credibility."

- Barbara L., Colorado | $5,800/month | 18 hrs/week`,
            systemStyle: 'testimonial',
        },

        // ACTION STEP
        {
            id: 20,
            type: 'coach',
            content: `Here's something you can do TODAY to start thinking like an inflammation detective...`,
        },
        {
            id: 21,
            type: 'system',
            content: `**Your Personal Inflammation Audit**

Rate yourself 1-10 on each trigger:

□ Sugar/refined carb intake: ___
□ Seed oil consumption (fried food, packaged food): ___
□ Stress level: ___
□ Sleep quality (under 7 hours?): ___
□ Gut symptoms (bloating, irregular bowels?): ___
□ Toxin exposure (home, work environment?): ___

**High scores (7+) = Priority areas**

This is EXACTLY what you'll do with clients. Simple. Actionable. Eye-opening.

Most clients have never thought about their health this way. You'll be the first person to show them the connection.`,
            systemStyle: 'exercise',
        },

        // GAP BUILDER
        {
            id: 23,
            type: 'coach',
            content: `{name}, you're officially thinking like a practitioner now. You just diagnosed a case that stumped real doctors!`,
        },
        {
            id: 24,
            type: 'coach',
            content: `But here's the thing - I've taught you the foundation of inflammation. Full practitioners learn advanced anti-inflammatory protocols, autoimmune specialization, and how to work with conditions like Hashimoto's, rheumatoid arthritis, and lupus...`,
        },
        {
            id: 25,
            type: 'coach',
            content: `Each of those is a specialty that clients will PAY PREMIUM for. Because these are the people doctors have given up on.`,
        },

        // BRIDGE TO LESSON 4
        {
            id: 26,
            type: 'coach',
            content: `Now here's what's scary - one of those 6 inflammation triggers I mentioned deserves its own lesson. Because it's literally EVERYWHERE and most people have no idea...`,
        },
        {
            id: 27,
            type: 'system',
            content: `**Coming Up: The Toxin Reality**

- 80,000+ synthetic chemicals in our environment
- Why most "detox" programs are dangerous
- The right way to support detoxification
- Why mold illness is a hidden epidemic

**Toxin/Mold Specialist Market:** PREMIUM NICHE
**Average Income:** $5,500 - $8,200/month

Warning: This lesson will make you look at your home differently.`,
            systemStyle: 'info',
        },
    ];

    return (
        <LessonBaseV2
            lessonNumber={lessonNumber}
            lessonTitle="The Inflammation Blueprint"
            lessonSubtitle="The $2.3B market hiding in plain sight"
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
