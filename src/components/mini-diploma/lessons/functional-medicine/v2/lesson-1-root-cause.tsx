"use client";

import { useState } from "react";
import { LessonBaseV2, Message } from "../../shared/lesson-base-v2";
import { SelfAssessmentQuiz } from "../../shared/interactive-elements";

interface LessonProps {
    lessonNumber: number;
    totalLessons?: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

export function Lesson1RootCause({
    lessonNumber,
    totalLessons = 9,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const [score, setScore] = useState(0);

    const messages: Message[] = [
        // HOOK - Personal & Emotional - Sarah's Full Story
        {
            id: 1,
            type: 'coach',
            content: `Hey {name}! I'm Sarah, and I'm genuinely SO excited you're here. Before we dive in, I want to share something personal with you...`,
        },
        {
            id: 2,
            type: 'coach',
            content: `Four years ago, I was a 43-year-old single mom of two, barely holding it together. My husband had passed away 18 months earlier - a heart attack at 46. No warning. Just... gone.`,
        },
        {
            id: 3,
            type: 'coach',
            content: `I fell apart. Grief, stress, anxiety. I gained 35 pounds. Couldn't sleep. Had panic attacks dropping my kids at school. My doctor put me on antidepressants and sleeping pills. "Give it time," she said.`,
        },
        {
            id: 4,
            type: 'coach',
            content: `But I wasn't getting better. I was getting WORSE. And I couldn't afford to fall apart - my kids needed me. I was all they had.`,
        },
        {
            id: 5,
            type: 'coach',
            content: `That's when a friend mentioned functional medicine. I was skeptical - it sounded like "woo-woo" stuff. But I was desperate. So I tried it.`,
        },
        {
            id: 6,
            type: 'coach',
            content: `Within 2 months, I discovered my cortisol was through the roof. My gut was a mess. I had nutrient deficiencies. Things my doctor never checked. Things that EXPLAINED why I felt so broken.`,
        },
        {
            id: 7,
            type: 'coach',
            content: `6 months later? I was off the pills. Lost the weight. Sleeping again. I had my LIFE back. And more importantly - I could finally be the mom my kids deserved.`,
        },
        {
            id: 8,
            type: 'coach',
            content: `That's when I thought: "How many other women are suffering like I was? How many are being given pills instead of answers?"`,
        },
        {
            id: 9,
            type: 'coach',
            content: `I got certified. I started helping other women. And now? I work 15 hours a week from home, earn $6,200/month, and I've helped 200+ women transform their health - just like I did mine.`,
        },
        {
            id: 10,
            type: 'coach',
            content: `I'm telling you this because I want you to know: I'm not some perfect wellness guru. I'm a regular woman who hit rock bottom and found a way out. And I'm going to show you exactly how to help others do the same.`,
        },

        // THE PROBLEM - Healthcare Crisis
        {
            id: 11,
            type: 'system',
            content: `**The Healthcare Crisis Nobody Talks About**

60% of Americans have a chronic disease.
42% have TWO or more.
The average doctor visit? 7 minutes.

Here's the brutal truth:
- Doctors are trained to treat SYMPTOMS, not causes
- They're overwhelmed, overworked, and have no time
- People are DESPERATE for someone who will actually LISTEN

This isn't about replacing doctors. It's about filling a massive gap they can't fill.`,
            systemStyle: 'stats',
        },
        {
            id: 12,
            type: 'coach',
            content: `Here's what I want you to understand: The world doesn't need more doctors. It needs more HEALTH GUIDES - people who can help others navigate their health journey.`,
        },

        // OBJECTION CRUSHER #1: "Am I qualified?"
        {
            id: 13,
            type: 'system',
            content: `**"But Sarah, I'm not a doctor..."**

Neither am I. And here's why that's actually an ADVANTAGE:

**What Doctors Do (Medical Practice):**
- Diagnose diseases
- Prescribe medications
- Perform procedures
- Require MD/DO degree + license

**What Health Coaches Do (Health Education):**
- Educate on nutrition & lifestyle
- Support behavior change
- Help implement healthy habits
- Guide, don't diagnose or prescribe

You're not replacing doctors. You're partnering with them.

As a certified health coach, you legally provide EDUCATION and SUPPORT - not medical advice. This is 100% legal in all 50 states.`,
            systemStyle: 'comparison',
        },
        {
            id: 14,
            type: 'coach',
            content: `Think about it - your friends already ask YOU for health advice, right? They trust you MORE than their doctor because you actually LISTEN.`,
        },

        // REAL TESTIMONIAL #1
        {
            id: 15,
            type: 'system',
            content: `**Meet Linda, 52 - Former Accountant**

"I need to be honest - I was TERRIFIED to start.

I'd already wasted $2,000 on a life coaching certification that led nowhere. My husband gave me 'the look' when I mentioned this program. My sister literally said 'Another course? Really?'

I spent 25 years in corporate accounting. I had no health background. I wasn't thin or fit. I struggled with my OWN weight and energy. Who was I to help anyone?

But something felt different this time. I actually understood what Sarah was teaching. The root cause stuff - it clicked.

My first client was my sister-in-law who'd struggled with fatigue for years. After 3 months, she was off her afternoon energy drinks and lost 18 pounds. She cried when she told me: 'You helped me more in 3 months than my doctor did in 3 years.'

I cried too. Because for the first time, I felt like I was doing something that MATTERED.

Today: I work 20 hours/week from home. Last month I earned $4,800. My husband now brags about me to his friends. And my sister? She's my client now.

To anyone feeling like an imposter: You don't need to be perfect. You just need to START."

- Linda M., Ohio | ASI Graduate 2024`,
            systemStyle: 'testimonial',
        },

        // THE ROOT CAUSE CONCEPT
        {
            id: 16,
            type: 'coach',
            content: `Now let me teach you the most important concept in functional medicine - the thing that separates average health coaches from practitioners who get REAL results...`,
        },
        {
            id: 17,
            type: 'coach',
            content: `It's called ROOT CAUSE thinking. And once you understand it, you'll never look at health the same way.`,
        },
        {
            id: 18,
            type: 'system',
            content: `**Symptom Treatment vs. Root Cause**

**Conventional Approach:**
- Headache? → Take Advil
- Can't sleep? → Sleeping pills
- Fatigue? → More coffee
- Anxious? → Anxiety meds

The symptom goes away... until it comes back. Or shows up somewhere else.

**Root Cause Approach:**
- Headache? → Why? Dehydration? Gut issues? Stress?
- Can't sleep? → Why? Cortisol dysregulation? Blood sugar?
- Fatigue? → Why? Nutrient deficiency? Inflammation?
- Anxious? → Why? Hormone imbalance? Gut-brain axis?

When you fix the ROOT CAUSE, the symptoms disappear - permanently.`,
            systemStyle: 'comparison',
        },

        // SELF-ASSESSMENT
        {
            id: 19,
            type: 'coach',
            content: `Before we go deeper, I want you to see something powerful. Let's check how many of these root causes affect YOU or people you know...`,
        },
        {
            id: 20,
            type: 'custom-component',
            content: '',
            componentProps: { points: 20 },
            renderComponent: ({ onComplete }) => (
                <SelfAssessmentQuiz
                    title="Your Root Cause Assessment"
                    subtitle="Select all that apply to you or someone close to you"
                    options={[
                        { id: 'gut', label: 'Gut issues', description: 'Bloating, IBS, food sensitivities, constipation, acid reflux' },
                        { id: 'inflammation', label: 'Chronic inflammation', description: 'Joint pain, skin issues, allergies, brain fog, frequent illness' },
                        { id: 'toxins', label: 'Toxin exposure', description: 'Live in city, use plastic containers, processed food, unexplained fatigue' },
                        { id: 'nutrients', label: 'Nutrient gaps', description: 'Low energy, weak nails, hair loss, mood swings, muscle cramps' },
                        { id: 'stress', label: 'Stress/Hormone issues', description: 'Burnout, sleep problems, anxious, weight gain around middle' },
                    ]}
                    onComplete={(selected, score) => {
                        onComplete();
                    }}
                />
            ),
        },
        {
            id: 21,
            type: 'coach',
            content: `See? You just identified potential root causes like a practitioner. This is EXACTLY what you'll do with clients - and why they'll pay you for your expertise.`,
        },

        // THE 5 ROOT CAUSES
        {
            id: 22,
            type: 'system',
            content: `**The 5 Root Causes of Chronic Disease**

Almost EVERY chronic health issue traces back to one of these:

1. **Gut Dysfunction** - 70% of immune system lives here
2. **Chronic Inflammation** - The silent killer behind all disease
3. **Toxin Overload** - 80,000+ chemicals in our environment
4. **Nutrient Deficiencies** - Even in the "well-fed"
5. **HPA Axis Dysfunction** - Chronic stress destroying health

The magic? These are all CONNECTED. Fix one, others start improving.

This is what you'll learn to identify and address. Not with prescriptions - with education, nutrition, and lifestyle changes.`,
            systemStyle: 'takeaway',
        },

        // OBJECTION CRUSHER #2: "Who will trust me?"
        {
            id: 23,
            type: 'user-choice',
            content: `Quick question: Do people already ask you for health advice?`,
            choices: [
                "Yes, friends and family ask me all the time",
                "Sometimes - I share what I've learned",
                "Not yet, but I want to help people",
            ],
            showReaction: true,
        },
        {
            id: 24,
            type: 'coach',
            content: `Here's the truth nobody tells you: Your lived experience with health struggles makes you MORE relatable than a doctor, not less.`,
        },
        {
            id: 25,
            type: 'system',
            content: `**Why People Trust Health Coaches**

Research shows clients prefer health coaches because:

- **Time**: Coaches spend 60+ minutes. Doctors spend 7.
- **Empathy**: You've LIVED it. Doctors studied it.
- **Accessibility**: You're not intimidating in a white coat
- **Accountability**: You walk alongside them
- **Results**: You focus on root causes, not quick fixes

"My health coach changed my life. She actually LISTENED." - We hear this daily.

Your personal health journey? It's not a weakness. It's your SUPERPOWER.`,
            systemStyle: 'info',
        },

        // REAL TESTIMONIAL #2
        {
            id: 26,
            type: 'system',
            content: `**Meet Patricia, 47 - Former Teacher**

"I was exhausted. Not 'tired' - EXHAUSTED. For years.

My doctor tested my thyroid and said 'Everything looks fine.' But I knew something was wrong. I was gaining weight, losing hair, couldn't get out of bed. I felt like I was watching my life from behind a fog.

I spent 3 years and thousands of dollars on doctors who dismissed me. 'Have you tried exercise?' they'd say. I wanted to scream.

Then I found functional medicine. I learned that 'normal' thyroid labs don't mean optimal. I learned about T3, reverse T3, antibodies. Things my doctors NEVER mentioned.

For the first time in a decade, I felt better.

And I thought: 'How many other women are being dismissed right now? How many are hearing 'you're fine' when they're SUFFERING?'

I had to do something.

Today I specialize in helping women with thyroid and hormone issues. Last month: 8 clients, $3,400 income, working from home while my kids are at school.

My students ask me: 'What made you qualified to do this?'

I tell them: 'My suffering. My frustration. My refusal to give up. That's my qualification.'"

- Patricia K., Texas | ASI Graduate 2023`,
            systemStyle: 'testimonial',
        },

        // DAY IN THE LIFE
        {
            id: 27,
            type: 'coach',
            content: `Let me paint a picture of what your life could look like as a certified practitioner...`,
        },
        {
            id: 28,
            type: 'system',
            content: `**A Day in the Life: Sarah (Me!)**

**7:30 AM** - Kids off to school. Coffee. Check client messages (15 min)

**9:00 AM** - Client session with Jennifer (Zoom). Reviewing her food journal, adjusting her gut protocol. 60 min = $175

**10:30 AM** - Quick workout, shower, lunch

**12:00 PM** - Client session with Maria. Her inflammation markers improved! She's crying happy tears. 60 min = $175

**1:30 PM** - Admin: update client notes, prep for tomorrow (45 min)

**3:00 PM** - Kids home. I'm done for the day.

**Today's income: $350 for 3 hours of actual work.**

This is what "part-time practitioner" looks like.`,
            systemStyle: 'exercise',
        },

        // INCOME HOOK (Unique to this lesson)
        {
            id: 29,
            type: 'system',
            content: `**The Root Cause Premium**

Why do root cause practitioners earn MORE than average health coaches?

**Average Health Coach:**
- $50-75/session
- Clients see you 2-3 times then leave
- Always chasing new clients
- "I don't see results"

**Root Cause Practitioner:**
- $150-300/session
- Clients stay 4-6 months (ongoing revenue)
- Referrals from happy clients
- Waitlists form organically

The difference? RESULTS. When you fix root causes, people get better. And they tell everyone.

One graduate told us: "I raised my rates to $225 and STILL have a waitlist."`,
            systemStyle: 'income-hook',
        },

        // PREVIEW & CLOSE
        {
            id: 30,
            type: 'coach',
            content: `{name}, you just learned more about functional medicine in 10 minutes than most people learn in months. And this is just Lesson 1.`,
        },
        {
            id: 31,
            type: 'coach',
            content: `In the next lesson, we're diving into the GUT - because Hippocrates said "All disease begins in the gut" 2,000 years ago. And science is proving he was RIGHT.`,
        },
        {
            id: 32,
            type: 'system',
            content: `**Coming Up: The Gut Connection**

- Why 70% of your immune system lives in your gut
- The 5R Protocol every practitioner needs to know
- A real case study for you to solve
- Why gut health specialists are in MASSIVE demand

You're off to an amazing start. See you in Lesson 2!`,
            systemStyle: 'info',
        },
    ];

    return (
        <LessonBaseV2
            lessonNumber={lessonNumber}
            lessonTitle="Why Root Cause Medicine Wins"
            lessonSubtitle="And why YOU can do this (even without a medical degree)"
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
