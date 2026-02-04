"use client";

import { useState } from "react";
import { LessonBaseV2, Message } from "../../shared/lesson-base-v2";
import { CaseStudyChallenge, DownloadResource } from "../../shared/interactive-elements";

interface LessonProps {
    lessonNumber: number;
    totalLessons?: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

export function Lesson7Protocols({
    lessonNumber,
    totalLessons = 9,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const [score, setScore] = useState(0);

    const messages: Message[] = [
        // HOOK - The Transformation Moment
        {
            id: 1,
            type: 'coach',
            content: `{name}, here's the moment of truth. You've learned about gut health, inflammation, toxins, stress, and labs...`,
        },
        {
            id: 2,
            type: 'coach',
            content: `But knowledge without APPLICATION is useless. Today I'm going to show you how to turn everything you've learned into actual client protocols.`,
        },
        {
            id: 3,
            type: 'coach',
            content: `This is where "I learned some stuff" becomes "I get people RESULTS." This is where your $200+/session income begins.`,
        },

        // PROTOCOL NICHE SPOTLIGHT
        {
            id: 4,
            type: 'system',
            content: `**📊 NICHE SPOTLIGHT: Protocol-Based Practitioners**

**The Shift:**
- Wellness coaches: $50-75/session (commodity)
- Protocol practitioners: $1,500-2,500 per program (specialist)

**What Practitioners Earn:**
- Average: $6,200 - $10,000/month
- 90-day protocols: $1,500-2,500 each
- 5-6 active clients = full practice
- Plus maintenance clients: $150-200/month each

**Why Protocol-Based Wins:**
- Client COMMITS upfront (paid in full or payment plan)
- Predictable monthly income
- BETTER results (they're invested)
- Natural upsell to maintenance
- Higher perceived value

"When I switched from per-session to protocols, my income doubled and my results improved." - Sandra, 45`,
            systemStyle: 'income-hook',
        },

        // OBJECTION CRUSHER: "Am I qualified to create protocols?"
        {
            id: 4,
            type: 'coach',
            content: `Now, you might be thinking: "Sarah, I just learned this stuff. Am I really qualified to create protocols for people?"`,
        },
        {
            id: 5,
            type: 'system',
            content: `**"But I Don't Feel Qualified to Create Protocols..."**

Here's what you need to understand:

**You're NOT creating:**
- Medical treatment plans
- Prescription protocols
- Disease intervention strategies

**You ARE creating:**
- Lifestyle modification guides
- Nutritional education plans
- Habit change roadmaps
- Support structures

Think about it: Personal trainers create workout protocols. Nutrition coaches create meal plans. Life coaches create action plans.

You're creating HEALTH OPTIMIZATION protocols - education-based plans that help people make better choices.

A graduate told us: "I felt like a fraud creating my first protocol. Then my client lost 15 pounds and her brain fog disappeared. That's when I realized: This isn't about credentials. It's about results."`,
            systemStyle: 'comparison',
        },

        // TESTIMONIAL - Protocol Focus
        {
            id: 7,
            type: 'system',
            content: `**Meet Sandra, 45 - Former Project Manager**

"Project management taught me how to break big goals into actionable steps. Turns out, that's EXACTLY what health protocols are.

I was terrified at first. 'What if I give someone the wrong advice?' But then I realized: I'm not prescribing. I'm ORGANIZING. I'm taking what clients already know they should do and turning it into a clear, step-by-step plan.

My signature offering now: The 90-Day Reset Protocol

Here's what it looks like:
- Week 1-2: Foundation assessment
- Week 3-4: Remove phase (triggers out)
- Week 5-8: Rebuild phase (support in)
- Week 9-12: Optimize phase (fine-tune)

My numbers:
- Protocol package: $2,200 for 90 days
- Currently running 5 clients at a time
- Monthly income: $3,600 (from protocols alone)
- Plus ongoing maintenance clients: $1,800/month

Total: $5,400/month. The framework made everything click. Now I can help anyone."

- Sandra B., Oregon | $5,400/month | 16 hrs/week`,
            systemStyle: 'testimonial',
        },

        // THE FRAMEWORK
        {
            id: 7,
            type: 'system',
            content: `**The Protocol Framework**

Great protocols follow this structure:

**IDENTIFY** → What's the root cause?
Use intake forms, symptom patterns, lab review

**PRIORITIZE** → What do we fix first?
You can't fix everything at once. Start with highest impact.

**REMOVE** → What needs to stop?
Triggers, inflammatory foods, toxic exposures, energy drains

**REPLACE** → What needs to be added?
Nutrients, supportive foods, healthy habits, stress management

**REBUILD** → How do we sustain results?
Long-term habits, maintenance protocols, check-in systems

Simple. Repeatable. Effective.`,
            systemStyle: 'info',
        },

        // THE BIG 3
        {
            id: 8,
            type: 'coach',
            content: `Here's a secret that took me years to learn: You don't need to fix EVERYTHING at once. Focus on the "Big 3" and watch 80% of issues resolve.`,
        },
        {
            id: 9,
            type: 'system',
            content: `**The Big 3 Interventions**

These 3 things fix 80% of chronic issues:

**1. BLOOD SUGAR STABILITY**
- Impacts: energy, mood, weight, hormones, brain function
- The foundation for everything else
- Changes: protein with every meal, reduce refined carbs, no skipping meals
- Timeline: Results in 1-2 weeks

**2. SLEEP OPTIMIZATION**
- When sleep is broken, NOTHING else works
- Target: 7-8 hours, consistent schedule
- Changes: Sleep hygiene protocol, blue light management
- Timeline: Results in 2-4 weeks

**3. GUT SUPPORT**
- Remember: 70% of immune system lives here
- Impacts: brain, hormones, inflammation, energy
- Changes: Remove triggers, add fermented foods, fiber, probiotics
- Timeline: Results in 4-8 weeks

Start here. Always. Without exception.`,
            systemStyle: 'takeaway',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `Which of the Big 3 do you think is most neglected by conventional medicine?`,
            choices: [
                "Blood sugar - they wait until diabetes",
                "Sleep - just prescribe sleeping pills",
                "Gut - completely ignored by most doctors",
            ],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `All three are neglected! That's why there's such a huge opportunity for practitioners like you who actually understand these foundations.`,
        },

        // 90-DAY PROTOCOL STRUCTURE
        {
            id: 12,
            type: 'coach',
            content: `Now let me show you how to structure a 90-day protocol. This is the format that gets results AND keeps clients coming back.`,
        },
        {
            id: 13,
            type: 'system',
            content: `**The 90-Day Protocol Structure**

**PHASE 1: FOUNDATION (Days 1-30)**
*"Clear the Path"*
- Focus on Big 3 only
- Remove major triggers (sugar, processed food, alcohol)
- Establish foundational habits
- Weekly check-ins (4 sessions)
- Client investment: Often seeing energy improve by week 2

**PHASE 2: REBUILD (Days 31-60)**
*"Add the Support"*
- Address secondary issues (gut healing, nutrient support)
- Add targeted supplements
- Fine-tune based on response
- Bi-weekly check-ins (2 sessions)
- Client investment: Seeing significant improvements

**PHASE 3: OPTIMIZE (Days 61-90)**
*"Lock It In"*
- Advanced interventions
- Lab re-testing if applicable
- Long-term maintenance plan
- Monthly check-ins (1-2 sessions)
- Client investment: Feeling transformed, ready to maintain

This structure = client retention + real results + natural upsell to maintenance`,
            systemStyle: 'comparison',
        },

        // SCOPE OF PRACTICE - Protocol Specific
        {
            id: 14,
            type: 'system',
            content: `**Protocol Scope: Education, Not Treatment**

Clear boundaries make you SAFER and MORE effective:

**Your protocols CAN include:**
✓ Dietary recommendations (anti-inflammatory, blood sugar support)
✓ Lifestyle modifications (sleep, stress, movement)
✓ Supplement suggestions (as education, not prescription)
✓ Habit tracking and accountability
✓ Educational resources and guidance
✓ Progress monitoring and adjustment

**Medical providers handle:**
- Prescription medications
- Diagnosed conditions
- Acute medical situations
- Medical testing orders

**The partnership model:**
Your client works with you AND their doctor. You handle lifestyle. Doctor handles medical. Everyone wins.

**The key phrase:**
"This protocol is educational guidance to support your health goals. Please discuss any changes with your healthcare provider."`,
            systemStyle: 'comparison',
        },

        // CASE STUDY
        {
            id: 15,
            type: 'coach',
            content: `Time to put it all together! Here's your most comprehensive case study yet. Think through everything you've learned...`,
        },
        {
            id: 16,
            type: 'custom-component',
            content: '',
            componentProps: { points: 50 },
            renderComponent: ({ onComplete }) => (
                <CaseStudyChallenge
                    caseTitle="Building Michelle's Protocol"
                    patientInfo="Michelle, 45, teacher, wants to lose 30 lbs and have more energy for her kids"
                    symptoms={[
                        "Wakes up exhausted, needs 2-3 coffees to start her day",
                        "Crashes hard at 3pm, craves sugar and carbs constantly",
                        "Bloating after most meals, uncomfortable by evening",
                        "Brain fog - forgetting student names, losing train of thought",
                        "Gained 30 lbs over 5 years despite 'eating healthy'",
                        "Recent labs: TSH 3.2 (suboptimal), fasting glucose 98, Vitamin D 28",
                        "Stressed from work, not sleeping well, maybe 5-6 hours/night",
                    ]}
                    question="What should be Michelle's FIRST priority in Phase 1?"
                    options={[
                        { id: 'a', label: 'Start a thyroid support supplement', isCorrect: false, explanation: 'While her TSH is suboptimal, jumping to supplements isn\'t the first step. Foundation comes first - supplements are Phase 2.' },
                        { id: 'b', label: 'Begin an elimination diet to find food sensitivities', isCorrect: false, explanation: 'Elimination diets are important but overwhelming to start with. Stabilize the basics first, then layer in elimination in Phase 2.' },
                        { id: 'c', label: 'Stabilize blood sugar with protein-focused eating', isCorrect: true, explanation: 'Exactly right! Her 3pm crash, constant sugar cravings, and fasting glucose of 98 all point to blood sugar instability. This is THE foundation issue affecting her energy, weight, brain fog, and likely her sleep and thyroid function.' },
                        { id: 'd', label: 'Focus on the bloating with digestive enzymes', isCorrect: false, explanation: 'Bloating is important but it\'s downstream of blood sugar issues. When blood sugar is unstable, digestion suffers. Fix blood sugar first, then address gut in Phase 2.' },
                    ]}
                    expertExplanation="Michelle's case is textbook blood sugar dysregulation driving everything else. Her 3pm crash, constant sugar cravings, pre-diabetic glucose (98), and weight gain all point to insulin resistance. Her poor sleep (5-6 hours) and high stress are making it worse. By stabilizing blood sugar FIRST with protein at every meal and eliminating blood sugar spikes, her energy will improve within 1-2 weeks, cravings will reduce, and her body can start healing. Phase 2 would address her suboptimal thyroid and Vitamin D. Phase 3 would tackle gut and optimize."
                    incomeHook="A 90-day protocol for Michelle would typically be $1,500-2,000. She'd likely continue with maintenance at $150-200/month. That's $2,400-3,200 from one client, plus she'll refer her teacher friends."
                    onComplete={(selected, isCorrect) => {
                        onComplete();
                    }}
                />
            ),
        },

        // INCOME - Unique to Protocols
        {
            id: 17,
            type: 'system',
            content: `**Protocol-Based Pricing: The Business Model**

Why protocols are your key to sustainable income:

**One-Off Sessions vs. Protocol Packages**

*Session-based:*
- $150-200/session
- Client books when they "feel like it"
- Inconsistent income
- Hard to get results

*Protocol-based:*
- $1,500-2,500 for 90-day program
- Client commits upfront
- Predictable income
- MUCH better results

**Typical Protocol Pricing:**

*Starter Protocol (30 days)*
- 4 sessions + email support
- $600-800

*Signature Protocol (90 days)*
- 6-8 sessions + email support + resources
- $1,500-2,500

*Premium Protocol (6 months)*
- 12+ sessions + full support
- $3,000-4,500

**Graduate Reality:**
"When I switched from charging per session to selling 90-day protocols, my income doubled and my results improved. Clients are committed. I can actually help them." - Margaret P., ASI Graduate`,
            systemStyle: 'income-hook',
        },

        // SECOND TESTIMONIAL
        {
            id: 19,
            type: 'system',
            content: `**Meet Valerie, 52 - Former Social Worker**

"As a social worker, I helped people navigate complex systems. I never imagined I'd become a health practitioner.

But here's what I realized: My REAL skill was helping people make sustainable changes. That's what social work taught me. And that's exactly what protocol building is.

I was nervous about the 'health' part. But the certification gave me the knowledge. My life experience gave me the coaching skills.

My specialty: Women in high-stress caregiving roles (nurses, teachers, moms caring for aging parents)

My signature program:
- 'Caregiver Recovery Protocol' - 12 weeks
- $2,200 per client
- Currently have 6 active clients
- Monthly income: $4,400 from protocols
- Plus 5 maintenance clients: $750/month

Total: $5,150/month working about 16 hours/week.

At 52, I started a new career. My social work skills were MORE valuable than I knew."

- Valerie D., Pennsylvania | $5,150/month | 16 hrs/week`,
            systemStyle: 'testimonial',
        },

        // KEY INSIGHT
        {
            id: 19,
            type: 'system',
            content: `**The Minimum Effective Dose**

Remember: Clients don't need 47 supplements and 23 lifestyle changes.

They need:
- The RIGHT 3-5 interventions
- At the RIGHT time
- In the RIGHT order
- With accountability and support

**The formula:**
Simplicity + Understanding = Compliance
Compliance = Results
Results = Referrals
Referrals = Sustainable Practice

Less is more. Focus on what moves the needle. Save the advanced stuff for Phase 2 and 3.`,
            systemStyle: 'quote',
        },

        // DOWNLOADABLE RESOURCE
        {
            id: 20,
            type: 'coach',
            content: `Here's something you'll use all the time - a protocol template you can customize for any client...`,
        },
        {
            id: 21,
            type: 'custom-component',
            content: '',
            renderComponent: ({ onComplete }) => (
                <DownloadResource
                    title="90-Day Protocol Template"
                    description="Customizable protocol framework with phase-by-phase structure, tracking sheets, and client worksheets"
                    fileName="90-Day-Protocol-Template.pdf"
                    downloadUrl="/resources/mini-diploma/90-day-protocol-template.pdf"
                    icon="template"
                    onDownload={onComplete}
                />
            ),
        },

        // GAP BUILDER
        {
            id: 23,
            type: 'coach',
            content: `Phenomenal work, {name}! You just built a real protocol for a real client scenario. This is EXACTLY what you'll do as a certified practitioner.`,
        },
        {
            id: 24,
            type: 'coach',
            content: `But here's the thing - I've shown you the template. Full practitioners learn advanced protocol customization, supplement sequencing, re-testing strategies, and how to handle complex multi-system cases...`,
        },
        {
            id: 25,
            type: 'coach',
            content: `Protocol-based practitioners are the ones earning $6K-10K/month. Because they deliver TRANSFORMATION, not just information.`,
        },

        // BRIDGE TO LESSON 8
        {
            id: 26,
            type: 'coach',
            content: `Now here's the exciting part - you have the knowledge and the protocol framework. But how do you actually GET clients? That's what's next...`,
        },
        {
            id: 27,
            type: 'system',
            content: `**Coming Up: Finding Your First Clients**

- Where your ideal clients are hiding
- 3 strategies that work (without being salesy)
- How to overcome "but I'm just starting out"
- The conversation that converts

**Client Acquisition:** THE KEY SKILL
**What Separates:** $0/month from $5K+/month practitioners

This is where theory becomes practice. Ready to find your first clients?`,
            systemStyle: 'info',
        },
    ];

    return (
        <LessonBaseV2
            lessonNumber={lessonNumber}
            lessonTitle="Building Client Protocols"
            lessonSubtitle="Turn knowledge into transformation (and income)"
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
