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
        // THE OPPORTUNITY HOOK - First thing they see
        {
            id: 1,
            type: 'coach',
            content: `Hey {name}! I'm Sarah, and I need to tell you something important before we start...`,
        },
        {
            id: 2,
            type: 'coach',
            content: `What if I told you there's a way to earn $5,000 to $15,000 per month... working 15-20 hours a week... from your kitchen table... while your kids are at school?`,
        },
        {
            id: 3,
            type: 'coach',
            content: `No medical degree required. No fancy credentials. Just a passion for helping people and the right training.`,
        },
        {
            id: 4,
            type: 'coach',
            content: `I know that sounds crazy. I thought so too 4 years ago when I was a burned-out single mom barely surviving. But let me show you why this is real...`,
        },

        // THE EXPLOSION - Why Functional Medicine
        {
            id: 5,
            type: 'system',
            content: `**Why Functional Medicine is EXPLODING**

The healthcare system is broken:
- 60% of Americans have a chronic disease
- 42% have TWO or more
- The average doctor visit? 7 minutes
- People spend $4.2 TRILLION on healthcare... and still feel terrible

**The result?**
Millions of people are DESPERATE for someone who will:
- Actually LISTEN to them
- Help them find ROOT CAUSES
- Guide them with personalized support

This isn't about replacing doctors. This is about filling a MASSIVE gap they can't fill.`,
            systemStyle: 'stats',
        },

        // THE MARKET OPPORTUNITY
        {
            id: 6,
            type: 'coach',
            content: `Let me show you just how BIG this opportunity is...`,
        },
        {
            id: 7,
            type: 'system',
            content: `**The Market Sizes Will Blow Your Mind**

🦋 **Thyroid Issues:** 42 million Americans undiagnosed or undertreated
💊 **Gut Problems:** 70 million Americans with digestive disorders
🔥 **Chronic Fatigue:** 836,000+ with CFS, millions more undiagnosed
😰 **Burnout:** 77% of workers experience burnout symptoms
🌸 **Menopause:** 1.3 million women enter menopause EVERY YEAR
⚡ **Inflammation:** 60% of chronic diseases linked to inflammation

Each of these is a SPECIALTY you could focus on.
Each one has desperate people searching for help RIGHT NOW.
Each one is waiting for someone like you.`,
            systemStyle: 'takeaway',
        },

        // NICHE INCOME SPOTLIGHT #1
        {
            id: 8,
            type: 'system',
            content: `**What Practitioners Actually Earn (By Specialty)**

**Thyroid Specialists:** $4,500 - $6,500/month
"I focus on women with thyroid issues. 42 million Americans need this help. My waitlist is 8 weeks." - Margaret, 51

**Menopause Coaches:** $4,800 - $7,200/month  
"Women going through menopause are DESPERATE. No one helps them. I charge $225/session." - Carol, 56

**Gut Health Practitioners:** $4,200 - $6,400/month
"Everyone has gut issues. EVERYONE. I have a 3-month waitlist." - Rachel, 44

**Burnout Recovery:** $4,000 - $6,800/month
"Burned-out executives pay premium prices. $275/session. They don't blink." - Donna, 48

**Mold & Toxin Specialists:** $5,500 - $8,200/month
"Premium niche. Less competition. $300+/session." - Christine, 46

These aren't unicorns. These are regular women who got certified and took action.`,
            systemStyle: 'income-hook',
        },

        // EMOTIONAL CONNECTION - Sarah's Story
        {
            id: 9,
            type: 'coach',
            content: `I want to share my story with you. Because I wasn't always doing this...`,
        },
        {
            id: 10,
            type: 'coach',
            content: `Four years ago, I was a 43-year-old single mom of two, barely holding it together. My husband had passed away 18 months earlier - a heart attack at 46. No warning. Just... gone.`,
        },
        {
            id: 11,
            type: 'coach',
            content: `I fell apart. Grief, stress, anxiety. I gained 35 pounds. Couldn't sleep. Had panic attacks dropping my kids at school. My doctor put me on antidepressants and sleeping pills.`,
        },
        {
            id: 12,
            type: 'coach',
            content: `But I wasn't getting better. I was getting WORSE. And I couldn't afford to fall apart - my kids needed me. I was all they had.`,
        },
        {
            id: 13,
            type: 'coach',
            content: `That's when I discovered functional medicine. Within 2 months, I found my cortisol was through the roof. My gut was a mess. I had nutrient deficiencies. Things my doctor NEVER checked.`,
        },
        {
            id: 14,
            type: 'coach',
            content: `6 months later? I was off the pills. Lost the weight. Sleeping again. I had my LIFE back. And I could finally be the mom my kids deserved.`,
        },
        {
            id: 15,
            type: 'coach',
            content: `Today? I work 15 hours a week from home. I earn $6,200/month. I've helped 200+ women transform their health. And I'm there for every school pickup, every soccer game, every bedtime story.`,
        },
        {
            id: 16,
            type: 'coach',
            content: `That's what this training is about. Not just understanding health - building a LIFE. On your terms.`,
        },

        // LIFESTYLE VISUALIZATION
        {
            id: 17,
            type: 'system',
            content: `**Picture This: Your Life 6 Months From Now**

It's a random Tuesday. 9:47am.

Your kids just left for school. You're in yoga pants with coffee at your kitchen table. Sun coming through the window.

Your first client, Jennifer, Zooms in at 10am. She tells you she slept through the night for the first time in 2 years. She's crying grateful tears. You made that happen.

By 1pm, you're done. You pick up your kids at 3pm.

Your husband comes home and asks about your day. You tell him you earned $350 while he was stuck in traffic.

This is real. This is what our graduates do every single day.`,
            systemStyle: 'exercise',
        },

        // OBJECTION CRUSHER: "Am I qualified?"
        {
            id: 18,
            type: 'system',
            content: `**"But Sarah, I'm not a doctor..."**

Neither am I. And here's why that's actually an ADVANTAGE:

**What Doctors Do:**
- Diagnose diseases
- Prescribe medications
- 7 minutes per patient
- Focus on disease management

**What Health Coaches Do:**
- Educate on nutrition & lifestyle
- Support behavior change
- 60+ minutes per client
- Focus on root cause wellness

You're not replacing doctors. You're filling the gap they CAN'T fill.

Clients don't want another pill. They want someone who LISTENS. Someone who helps them understand their body. Someone who walks alongside them.

That's YOU.`,
            systemStyle: 'comparison',
        },

        // TESTIMONIAL - Identity Transformation
        {
            id: 19,
            type: 'system',
            content: `**Meet Linda, 52 - Former Accountant**

"I spent 25 years in corporate accounting. I had no health background. I wasn't thin or fit. I struggled with my OWN weight and energy.

Who was I to help anyone?

But something clicked. I realized my struggles made me MORE relatable, not less. My clients trust me because I've BEEN there.

My first client was my sister-in-law. After 3 months, she was off energy drinks and lost 18 pounds. She cried: 'You helped me more in 3 months than my doctor did in 3 years.'

Today: I work 20 hours/week from home. Last month: $5,400. My husband now brags about me. My sister is my client now.

You don't need to be perfect. You just need to START."

- Linda M., Ohio | $5,400/month | 20 hrs/week`,
            systemStyle: 'testimonial',
        },

        // ROOT CAUSE CONCEPT
        {
            id: 20,
            type: 'coach',
            content: `Now let me teach you the most important concept in functional medicine - the thing that separates average health coaches from practitioners who get REAL results and command premium prices...`,
        },
        {
            id: 21,
            type: 'system',
            content: `**Symptom Treatment vs. Root Cause**

**Conventional Approach:**
- Headache? → Take Advil
- Can't sleep? → Sleeping pills
- Fatigue? → "Try exercising more"
- Anxious? → Anxiety meds

The symptom goes away... until it comes back. Or shows up somewhere else.

**Root Cause Approach:**
- Headache? → Why? Dehydration? Gut issues? Hormone imbalance?
- Can't sleep? → Why? Cortisol dysregulation? Blood sugar crash?
- Fatigue? → Why? Thyroid? Nutrient deficiency? Inflammation?
- Anxious? → Why? Gut-brain axis? Hormone imbalance?

When you fix the ROOT CAUSE, symptoms disappear permanently.

This is why root cause practitioners charge $150-300/session while average coaches struggle at $50-75.`,
            systemStyle: 'comparison',
        },

        // SELF-ASSESSMENT
        {
            id: 22,
            type: 'coach',
            content: `Before we go deeper, let's see how many root causes affect YOU or people you know...`,
        },
        {
            id: 23,
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
                        { id: 'toxins', label: 'Toxin exposure', description: 'Live in city, use plastic, processed food, unexplained fatigue' },
                        { id: 'nutrients', label: 'Nutrient gaps', description: 'Low energy, weak nails, hair loss, mood swings' },
                        { id: 'stress', label: 'Stress/Hormone issues', description: 'Burnout, sleep problems, anxiety, weight gain around middle' },
                    ]}
                    onComplete={(selected, score) => {
                        onComplete();
                    }}
                />
            ),
        },
        {
            id: 24,
            type: 'coach',
            content: `See? You just identified potential root causes like a practitioner. Every person you selected is a potential client. And there are MILLIONS more just like them.`,
        },

        // THE 5 ROOT CAUSES
        {
            id: 25,
            type: 'system',
            content: `**The 5 Root Causes of Chronic Disease**

Almost EVERY chronic health issue traces back to these:

1. **Gut Dysfunction** - 70% of immune system lives here
2. **Chronic Inflammation** - The silent killer behind all disease
3. **Toxin Overload** - 80,000+ chemicals in our environment
4. **Nutrient Deficiencies** - Even in the "well-fed"
5. **HPA Axis Dysfunction** - Chronic stress destroying health

Each of these is a lesson in this mini diploma.
Each one unlocks a specialty you could build a practice around.
Each one has millions of desperate people waiting for help.`,
            systemStyle: 'takeaway',
        },

        // SECOND TESTIMONIAL - Specialty Focus
        {
            id: 26,
            type: 'system',
            content: `**Meet Patricia, 47 - Former Teacher**

"I was exhausted for YEARS. My doctor said 'Your thyroid labs are normal.' But I was gaining weight, losing hair, couldn't get out of bed.

I felt dismissed. Invisible. Broken.

Through functional medicine, I learned that 'normal' labs don't mean optimal. I learned about T3, reverse T3, antibodies. Things my doctors NEVER mentioned.

For the first time in a decade, I felt better.

And I thought: 'How many other women are being dismissed right now?'

Today I specialize in thyroid and hormone issues. Last month: 11 clients, $4,800 income, working from home while my kids are at school.

My students ask: 'What made you qualified?'

I tell them: 'My suffering. My frustration. My refusal to give up. That's my qualification.'"

- Patricia K., Texas | Thyroid Specialist | $4,800/month`,
            systemStyle: 'testimonial',
        },

        // THE GAP BUILDER
        {
            id: 27,
            type: 'coach',
            content: `{name}, you've just learned more about functional medicine in 15 minutes than most people learn in months.`,
        },
        {
            id: 28,
            type: 'coach',
            content: `But here's the thing - this is just scratching the surface. There's SO much more: advanced protocols, specialized assessments, business building, client acquisition...`,
        },
        {
            id: 29,
            type: 'coach',
            content: `This mini diploma will give you a solid foundation. You'll walk away understanding root causes better than 95% of people. And you'll see exactly what's possible.`,
        },

        // BRIDGE TO LESSON 2
        {
            id: 30,
            type: 'coach',
            content: `In the next lesson, we're diving into the GUT - because Hippocrates said "All disease begins in the gut" 2,000 years ago. And science is proving he was RIGHT.`,
        },
        {
            id: 31,
            type: 'system',
            content: `**Coming Up: The Gut Connection**

- Why 70% of your immune system lives in your gut
- The 5R Protocol every practitioner needs to know
- Why gut health specialists have 3-month waitlists
- A real case study for you to solve
- What practitioners in this niche actually earn

**Gut Health Market:** 70 million Americans with digestive issues
**Average Income:** $4,200 - $6,400/month

Ready to discover the #1 specialty that keeps clients coming back for MONTHS?`,
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
