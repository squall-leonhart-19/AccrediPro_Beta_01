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

export function Lesson5Stress({
    lessonNumber,
    totalLessons = 9,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const [score, setScore] = useState(0);

    const messages: Message[] = [
        // HOOK - Personal & Relatable
        {
            id: 1,
            type: 'coach',
            content: `{name}, I want to ask you something personal. Be honest with yourself...`,
        },
        {
            id: 2,
            type: 'coach',
            content: `Do you ever feel "wired but tired"? Like you can't relax even when you have nothing to do? Like you're running on fumes but your brain won't turn off?`,
        },
        {
            id: 3,
            type: 'coach',
            content: `If that sounds familiar, you're not alone. That's your HPA axis screaming for help. And it's happening to MILLIONS of women right now.`,
        },
        {
            id: 4,
            type: 'system',
            content: `**The Burnout Epidemic**

- 77% of workers experience burnout symptoms
- 83% of US workers suffer from work-related stress
- Women 40+ are hit hardest (sandwich generation)
- Post-pandemic burnout is at all-time highs
- Doctors' solution? Usually: "Here's an antidepressant."

This is a MASSIVE, underserved market. And it's personal for most of us.`,
            systemStyle: 'stats',
        },

        // BURNOUT NICHE SPOTLIGHT
        {
            id: 5,
            type: 'system',
            content: `**🔥 NICHE SPOTLIGHT: Burnout & Hormone Specialists**

**The Market:**
- 77% of workers experience burnout
- 1.3 million women enter menopause EVERY YEAR
- Women 40-55 are the most underserved demographic
- Spending on hormone/burnout coaching tripled post-pandemic

**What Practitioners Earn:**
- Average: $4,400 - $6,800/month
- Sessions: $200-350 each
- 12-week programs: $2,400-3,600

**Why This Niche Wins:**
- HIGH-INCOME clients (executives, business owners)
- Willing to pay premium for results
- Long relationships (burnout recovery takes 3-6 months)
- TREMENDOUS gratitude (you give them their life back)
- Endless referrals (burned-out moms know other burned-out moms)

"My burnout clients have MONEY. They're executives. They'll pay $300/session if you can help them feel human again." - Carol, 56`,
            systemStyle: 'income-hook',
        },

        // OBJECTION CRUSHER: "I'm too old to start something new"
        {
            id: 5,
            type: 'coach',
            content: `Now, you might be thinking: "I'm exhausted myself. How can I help others with burnout when I'm burned out?"`,
        },
        {
            id: 6,
            type: 'system',
            content: `**"I'm Too Old/Tired/Burned Out to Start..."**

Here's the truth: Your exhaustion is your CREDENTIAL.

Think about it:
- You've LIVED this. You understand it viscerally.
- Your clients will be women like you. They'll trust you.
- Healing yourself teaches you how to heal others.
- Your story becomes your most powerful marketing tool.

A graduate told us: "I started this certification at rock bottom. Adrenal fatigue, couldn't get through the day. As I learned and applied the principles, I healed myself. Now I help other burned-out moms do the same. My lowest point became my launching pad."

Age isn't a barrier in this work. It's your competitive advantage.`,
            systemStyle: 'comparison',
        },

        // TESTIMONIAL - Age Focus
        {
            id: 8,
            type: 'system',
            content: `**Meet Carol, 56 - Started at "Too Old"**

"I turned 54 and thought my best years were behind me. Empty nest. Menopause. Burned out from 30 years in corporate HR.

Then I got certified. I specifically target women 50+ dealing with burnout and hormone changes. Why? Because I AM one.

My clients say: 'You get it. You're not some 28-year-old who doesn't understand what I'm going through.'

Being older is my MARKETING. I charge $275/session because my experience IS the value.

Current stats (2 years in):
- 15 active clients
- Monthly income: $6,600
- Working 18 hours/week
- More energy than I had at 40

At 56, I'm making more money with less stress than my entire corporate career. Don't tell me you're too old."

- Carol M., New Jersey | $6,600/month | 18 hrs/week`,
            systemStyle: 'testimonial',
        },

        // TEACH - HPA Axis
        {
            id: 8,
            type: 'coach',
            content: `Let me teach you about the HPA axis. Understanding this will change how you see fatigue, anxiety, and burnout forever.`,
        },
        {
            id: 9,
            type: 'system',
            content: `**The HPA Axis Explained Simply**

**H** = Hypothalamus (brain's control center)
**P** = Pituitary (master hormone gland)
**A** = Adrenals (stress response glands)

**How it works:**
1. Brain perceives stress (real OR imagined)
2. Hypothalamus signals pituitary
3. Pituitary signals adrenals
4. Adrenals release CORTISOL
5. Body shifts to "survival mode"

**The problem:**
Your body can't tell the difference between:
- A tiger chasing you
- A stressful email
- Worrying about your kids
- Traffic

It responds the SAME way: Cortisol, cortisol, cortisol.

Modern life keeps this system ON 24/7. That's why everyone is exhausted.`,
            systemStyle: 'info',
        },

        // THE 3 STAGES
        {
            id: 10,
            type: 'user-choice',
            content: `Which of these sounds most like you right now?`,
            choices: [
                "Wired all the time, can't slow down, need caffeine",
                "Tired but can push through, crash in the afternoon",
                "Exhausted 24/7, even small stress feels overwhelming",
            ],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Interesting! Those three answers actually represent the 3 stages of HPA dysfunction. Let me show you the progression...`,
        },
        {
            id: 12,
            type: 'system',
            content: `**The 3 Stages of HPA Dysfunction**

**STAGE 1: ALARM (Wired)**
- High cortisol all day long
- Can't relax or sleep well
- Anxiety, racing thoughts
- "Running on adrenaline"
- Often: High achievers, new stressors

**STAGE 2: RESISTANCE (Tired but pushing)**
- Cortisol rhythm disrupted
- Morning fatigue, afternoon crash
- NEED coffee to function
- Weight gain around middle
- "Running on fumes" - Most common when clients seek help

**STAGE 3: EXHAUSTION (Depleted)**
- Low cortisol (adrenals can't keep up)
- Severe fatigue, can't recover
- Depression, brain fog
- Everything feels overwhelming
- "Can't even" - Requires longer recovery

Most women seeking help are in Stage 2. Catch them before Stage 3.`,
            systemStyle: 'comparison',
        },

        // PREGNENOLONE STEAL
        {
            id: 13,
            type: 'coach',
            content: `Now here's something that will blow your mind - it explains why stressed women have hormone issues, weight problems, and low libido...`,
        },
        {
            id: 14,
            type: 'system',
            content: `**The Pregnenolone Steal**

Pregnenolone is the "mother hormone" - it makes ALL other hormones.

**Under chronic stress:**
Your body prioritizes SURVIVAL (cortisol) over THRIVING (sex hormones).

It literally "steals" pregnenolone from making:
- Estrogen
- Progesterone
- Testosterone
- DHEA

**This is why stressed women experience:**
- Low libido (low testosterone)
- Irregular cycles (low progesterone)
- Fertility issues
- Stubborn weight gain
- Mood swings and depression

**The beautiful part:**
Fix the stress, and hormones often normalize WITHOUT hormone replacement.

This is why burnout coaching is so powerful - you're addressing the ROOT CAUSE of hormone issues.`,
            systemStyle: 'takeaway',
        },

        // CASE STUDY
        {
            id: 15,
            type: 'coach',
            content: `Time for your case study! This is someone you'll encounter all the time. Let's see if you can identify what's going on...`,
        },
        {
            id: 16,
            type: 'custom-component',
            content: '',
            componentProps: { points: 40 },
            renderComponent: ({ onComplete }) => (
                <CaseStudyChallenge
                    caseTitle="Jennifer's Exhaustion"
                    patientInfo="Jennifer, 42, marketing executive, single mom of 2 teenagers"
                    symptoms={[
                        "Wakes up exhausted no matter how much she sleeps",
                        "Needs 3+ cups of coffee just to function at work",
                        "Crashes hard around 3pm every single day",
                        "Gained 20 lbs around her midsection in 2 years",
                        "Used to exercise daily, now can barely walk the dog",
                        "Periods became irregular and heavier last year",
                        "Snaps at her kids, then feels guilty",
                    ]}
                    question="What stage of HPA dysfunction is Jennifer most likely in?"
                    options={[
                        { id: 'a', label: 'Stage 1 - Alarm (High cortisol)', isCorrect: false, explanation: 'Stage 1 shows wired energy and anxiety. Jennifer is exhausted, not wired.' },
                        { id: 'b', label: 'Stage 2 - Resistance (Cortisol dysregulation)', isCorrect: true, explanation: 'Textbook Stage 2: Morning fatigue, caffeine dependence, 3pm crash, midsection weight gain, hormone disruption. Her body is fighting to maintain but losing the battle.' },
                        { id: 'c', label: 'Stage 3 - Exhaustion (Low cortisol)', isCorrect: false, explanation: 'Stage 3 is more severe - she can still push through with coffee. Stage 2 is struggling but functioning.' },
                        { id: 'd', label: 'Not HPA related - probably just thyroid', isCorrect: false, explanation: 'While thyroid should be checked, the pattern strongly suggests HPA dysfunction. Often both are affected.' },
                    ]}
                    expertExplanation="Jennifer is in Stage 2 HPA dysfunction. The morning exhaustion + caffeine dependence + afternoon crash is classic cortisol rhythm disruption. The midsection weight gain happens because cortisol promotes fat storage there. Her irregular periods suggest pregnenolone steal affecting sex hormones. Without intervention, she'll progress to Stage 3 within 1-2 years."
                    incomeHook="Jennifer would be a 6-month client minimum. Burnout recovery programs for high-achieving women like her typically run $2,000-4,000. She'd also refer other stressed executive moms."
                    onComplete={(selected, isCorrect) => {
                        onComplete();
                    }}
                />
            ),
        },

        // YOUR ROLE
        {
            id: 17,
            type: 'system',
            content: `**Your Role: Burnout Coach, Not Doctor**

What you CAN do:
✓ Educate on HPA axis and cortisol
✓ Create stress-reduction protocols
✓ Design sleep optimization plans
✓ Recommend adaptogenic herbs (as education)
✓ Guide on blood sugar stabilization
✓ Teach nervous system regulation techniques
✓ Provide accountability and support

What doctors do:
- Run cortisol tests (blood, saliva, DUTCH)
- Rule out thyroid conditions
- Prescribe medications if needed
- Monitor for serious conditions

**The partnership:**
Client presents with burnout → You educate and create lifestyle protocol → Doctor tests if needed → You implement recovery plan together

Doctors don't have 60 minutes to teach stress management. You do.`,
            systemStyle: 'comparison',
        },

        // INCOME - Unique to Burnout
        {
            id: 18,
            type: 'system',
            content: `**The Burnout Niche: Premium Pricing**

Why burnout coaching commands HIGH prices:

**Your Target Client:**
- High-achieving women 35-55
- Disposable income (they have good jobs)
- Desperate for answers (doctors haven't helped)
- Value their time (willing to pay for results)
- Long-term relationships (recovery takes time)

**Typical Pricing:**

*Initial Burnout Assessment (90 min)*
- Deep dive into stress history
- $250-350

*12-Week Burnout Recovery Program*
- Weekly sessions + support
- $2,400-3,600

*6-Month Adrenal Recovery Package*
- Comprehensive restoration
- $3,600-5,400

**Graduate Reality:**
"My burnout clients have MONEY. They're executives, business owners, successful women. They'll pay $300/session without blinking if you can help them feel human again." - Teresa K., ASI Graduate`,
            systemStyle: 'income-hook',
        },

        // SECOND TESTIMONIAL
        {
            id: 20,
            type: 'system',
            content: `**Meet Donna, 48 - Former Nurse**

"I was a burned-out ER nurse for 20 years. The pandemic broke me. I couldn't go back.

Getting certified in functional medicine felt like learning why I was so destroyed. It was therapy AND career training at the same time.

My niche now: Healthcare workers with burnout. Nurses, doctors, first responders. They trust me because I've BEEN there.

The numbers (14 months in):
- 14 clients (all healthcare workers)
- $225/session
- Monthly income: $5,600
- Work from home, no night shifts, no codes

I make more than nursing AND I'm ALIVE again. My clients are finding the same path out. Best career change I ever made.

You don't have to stay burned out forever. And you can help others escape too."

- Donna R., Minnesota | $5,600/month | 16 hrs/week`,
            systemStyle: 'testimonial',
        },

        // ACTION STEP
        {
            id: 20,
            type: 'system',
            content: `**The 4 Pillars of HPA Recovery**

These are the foundations you'll use with every burnout client:

**1. SLEEP**
- Non-negotiable 7-8 hours
- Consistent sleep/wake times
- Dark, cool room
- No screens 1 hour before

**2. MORNING LIGHT**
- Sunlight within 30 minutes of waking
- Resets circadian rhythm
- Helps cortisol pattern normalize

**3. BLOOD SUGAR**
- Protein with every meal
- No skipping meals
- Reduces cortisol spikes

**4. NERVOUS SYSTEM**
- Daily parasympathetic activation
- 5-10 min breathwork
- Cold exposure, meditation, or gentle yoga

Start with these 4 things. They work for almost everyone.`,
            systemStyle: 'exercise',
        },

        // GAP BUILDER
        {
            id: 22,
            type: 'coach',
            content: `{name}, you just diagnosed a case that most doctors would miss entirely. They'd prescribe antidepressants. You found the root cause.`,
        },
        {
            id: 23,
            type: 'coach',
            content: `But here's the thing - I've given you the foundation of HPA dysfunction. Full practitioners learn advanced protocols for Stage 3 recovery, DUTCH testing interpretation, menopause support, and bio-identical hormone education...`,
        },
        {
            id: 24,
            type: 'coach',
            content: `The burnout/menopause specialty is where the HIGHEST-PAYING clients are. Because they have money, they're desperate, and they'll refer every friend they have.`,
        },

        // BRIDGE TO LESSON 6
        {
            id: 25,
            type: 'coach',
            content: `Now here's what separates amateur coaches from professionals - the ability to interpret lab work. When you can look at bloodwork and spot patterns doctors miss...`,
        },
        {
            id: 26,
            type: 'system',
            content: `**Coming Up: Lab Interpretation Secrets**

- Why "normal" labs don't mean healthy
- The 5 functional markers you MUST know
- How to position yourself as PREMIUM with lab knowledge
- Why clients LOVE getting labs reviewed

**Lab Review Specialists:** PREMIUM POSITIONING
**Average Income:** $5,800 - $9,200/month

This is professional-level knowledge. Ready to think like a practitioner?`,
            systemStyle: 'info',
        },
    ];

    return (
        <LessonBaseV2
            lessonNumber={lessonNumber}
            lessonTitle="Stress & Hormones Decoded"
            lessonSubtitle="Why women 40+ need YOU (not antidepressants)"
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
