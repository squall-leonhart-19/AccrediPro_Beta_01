"use client";

import { useState } from "react";
import { LessonBaseV2, Message } from "../../shared/lesson-base-v2";
import { KnowledgeCheckQuiz, DownloadResource } from "../../shared/interactive-elements";

interface LessonProps {
    lessonNumber: number;
    totalLessons?: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

export function Lesson2Gut({
    lessonNumber,
    totalLessons = 9,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const [score, setScore] = useState(0);

    const messages: Message[] = [
        // HOOK - Personal Story
        {
            id: 1,
            type: 'coach',
            content: `{name}, welcome back! Before we dive in, I want to tell you about my friend Karen...`,
        },
        {
            id: 2,
            type: 'coach',
            content: `Karen spent 8 YEARS going to doctors for bloating, brain fog, and fatigue. She saw gastroenterologists, neurologists, endocrinologists. Thousands of dollars in tests.`,
        },
        {
            id: 3,
            type: 'coach',
            content: `Every doctor said the same thing: "Your tests are normal. Maybe try antidepressants?"`,
        },
        {
            id: 4,
            type: 'coach',
            content: `Then she worked with a functional medicine practitioner who looked at her GUT. 3 months later? Bloating gone. Brain fog lifted. Energy back. No medications.`,
        },
        {
            id: 5,
            type: 'coach',
            content: `The practitioner? She charged $225/session and had an 8-week waitlist. That practitioner could be YOU.`,
        },

        // GUT HEALTH NICHE SPOTLIGHT
        {
            id: 6,
            type: 'system',
            content: `**🔬 NICHE SPOTLIGHT: Gut Health Practitioners**

**The Market:**
- 70 million Americans have digestive disorders
- IBS alone affects 25-45 million Americans
- Gut issues are the #1 reason people seek functional medicine

**What Practitioners Earn:**
- Average: $4,200 - $6,400/month
- Sessions: $175-250 each
- Client retention: 4-6 months (recurring revenue!)

**Why This Niche Wins:**
- Long-term client relationships (gut healing takes time)
- Results are VISIBLE (no more bloating = happy client)
- Endless referrals ("You have to talk to my coach!")
- Less competition than general wellness

"I work 18 hours a week and have an 8-week waitlist. All gut health." - Rachel, 44`,
            systemStyle: 'income-hook',
        },

        // THE GUT REVELATION
        {
            id: 6,
            type: 'system',
            content: `**The Gut Truth Most Doctors Miss**

Your gut is NOT just for digestion. It's your:

- **Second Brain** - More neurons than your spinal cord
- **Immune Headquarters** - 70-80% of immune cells live here
- **Mood Factory** - 95% of serotonin made here
- **Hormone Regulator** - Affects thyroid, estrogen, cortisol

When the gut breaks, EVERYTHING breaks.

This is why gut health specialists are booked solid.`,
            systemStyle: 'stats',
        },

        // OBJECTION CRUSHER: "This is too complicated"
        {
            id: 7,
            type: 'coach',
            content: `Now, I know what you might be thinking: "This sounds complicated. I don't have a medical background."`,
        },
        {
            id: 8,
            type: 'system',
            content: `**"But Sarah, I didn't study biology..."**

Here's the thing: You don't need to be a scientist. You need to understand PATTERNS.

When I started, I didn't know what "dysbiosis" meant either. But I learned:
- Bloating after meals? = Gut issue
- Brain fog + fatigue? = Gut issue
- Skin problems? = Often gut issue
- Mood swings? = Gut-brain connection

You're not diagnosing diseases. You're recognizing patterns and guiding people to solutions.

A graduate told me: "I felt like an imposter at first. Then I helped my first client eliminate her 10-year bloating problem in 6 weeks. Now I know I belong here."`,
            systemStyle: 'comparison',
        },

        // REAL TESTIMONIAL - Gut Focus
        {
            id: 10,
            type: 'system',
            content: `**Meet Rachel, 44 - Former HR Manager**

"Gut health became my niche by accident. I fixed my own IBS after doctors said I'd have it forever. When I got certified, I specialized in gut health because I KNEW it so well.

Here's what my practice looks like now:

- 15 gut health clients
- $200/session, 2 sessions/month each
- Monthly recurring: $6,000
- Waitlist of 12 people

I turned away 4 clients last week. I had to RAISE my rates just to slow demand.

My clients call me their 'gut guru.' I don't have a medical degree. I have lived experience and the right training.

The certification gave me the credibility. My results keep clients coming."

- Rachel B., Arizona | $6,000/month | 18 hrs/week`,
            systemStyle: 'testimonial',
        },

        // TEACH - The 3 Pillars
        {
            id: 10,
            type: 'coach',
            content: `Let me teach you the 3 Pillars of Gut Health. This framework makes everything simple to understand and explain to clients.`,
        },
        {
            id: 11,
            type: 'system',
            content: `**The 3 Pillars of Gut Health**

**1. THE BARRIER (The Wall)**
- One-cell-thick lining protecting you
- Decides what enters bloodstream
- When damaged → "Leaky Gut" → inflammation everywhere
- Signs: food sensitivities, joint pain, skin issues

**2. THE MICROBIOME (The Army)**
- Trillions of bacteria living in your gut
- Good vs bad bacteria balance
- Affects digestion, immunity, mood, weight
- Signs of imbalance: bloating, gas, irregular bowels

**3. THE MOTILITY (The Movement)**
- How food moves through your system
- Too slow → constipation, toxin buildup
- Too fast → diarrhea, nutrient loss
- Signs: irregular bathroom habits, discomfort

When you understand these 3 pillars, you can help almost anyone.`,
            systemStyle: 'takeaway',
        },

        // LEAKY GUT EXPLAINED SIMPLY
        {
            id: 12,
            type: 'user-choice',
            content: `Have you heard the term "leaky gut" before?`,
            choices: [
                "Yes, but I don't fully get it",
                "I've heard it mentioned",
                "This is new to me",
            ],
            showReaction: true,
        },
        {
            id: 13,
            type: 'coach',
            content: `Let me explain leaky gut in a way you could tell your grandmother - and she'd understand perfectly.`,
        },
        {
            id: 14,
            type: 'system',
            content: `**Leaky Gut: The Simple Explanation**

Imagine your gut lining is a window screen:

**Healthy Screen:**
- Tiny holes let air through (nutrients)
- Keeps bugs out (toxins, undigested food)

**Damaged Screen (Leaky Gut):**
- Holes get bigger
- Bugs get in (bad stuff enters bloodstream)
- Immune system panics
- Inflammation spreads EVERYWHERE

**What damages the screen?**
- Gluten (for many people)
- Chronic stress
- NSAIDs (ibuprofen, aspirin)
- Alcohol
- Poor diet

This is why someone with leaky gut might have joint pain, brain fog, skin issues, AND digestive problems. The inflammation goes everywhere.

You'll explain this to clients all the time. Simple, visual, memorable.`,
            systemStyle: 'info',
        },

        // THE 5R PROTOCOL
        {
            id: 15,
            type: 'coach',
            content: `Now here's your secret weapon - the protocol every functional medicine practitioner uses for gut healing. This is gold.`,
        },
        {
            id: 16,
            type: 'system',
            content: `**The 5R Protocol**

This is the industry-standard framework for gut healing:

**1. REMOVE** - Eliminate the triggers
- Inflammatory foods, pathogens, stressors
- "What's making things worse?"

**2. REPLACE** - Add what's missing
- Digestive enzymes, HCl, bile support
- "What does digestion need to work?"

**3. REINOCULATE** - Restore good bacteria
- Probiotics, prebiotics, fermented foods
- "Rebuild the good army"

**4. REPAIR** - Heal the gut lining
- L-glutamine, zinc, collagen, bone broth
- "Fix the damaged screen"

**5. REBALANCE** - Address lifestyle
- Sleep, stress management, movement
- "Prevent it from happening again"

This protocol has been used successfully on millions of people. You'll use it constantly.`,
            systemStyle: 'takeaway',
        },

        // SCOPE OF PRACTICE CLARITY
        {
            id: 17,
            type: 'system',
            content: `**Important: Your Role vs. Doctor's Role**

As a health coach, here's exactly what you CAN and CAN'T do:

**YOU CAN:**
✓ Educate on the 5R protocol
✓ Suggest dietary changes
✓ Recommend supplements (not prescribe)
✓ Guide on lifestyle modifications
✓ Support accountability
✓ Help interpret (not diagnose) symptoms

**DOCTORS DO:**
- Order and interpret medical tests
- Diagnose conditions like SIBO, IBD, Crohn's
- Prescribe medications
- Treat acute medical conditions

**How it works together:**
Client suspects gut issue → You educate and support → They work with doctor for testing → You help implement healing protocol

This is why doctors LOVE working with health coaches. We extend their capacity.`,
            systemStyle: 'comparison',
        },

        // KNOWLEDGE CHECK
        {
            id: 18,
            type: 'coach',
            content: `Let's make sure this is clicking. Quick knowledge check!`,
        },
        {
            id: 19,
            type: 'custom-component',
            content: '',
            componentProps: { points: 30 },
            renderComponent: ({ onComplete }) => (
                <KnowledgeCheckQuiz
                    title="Gut Health Check"
                    questions={[
                        {
                            id: 'q1',
                            question: 'What percentage of your immune system lives in your gut?',
                            options: [
                                { id: 'a', label: '30-40%', isCorrect: false },
                                { id: 'b', label: '50-60%', isCorrect: false },
                                { id: 'c', label: '70-80%', isCorrect: true },
                                { id: 'd', label: '90-95%', isCorrect: false },
                            ],
                        },
                        {
                            id: 'q2',
                            question: 'What is "leaky gut"?',
                            options: [
                                { id: 'a', label: 'When the gut barrier becomes too permeable', isCorrect: true },
                                { id: 'b', label: 'When you have diarrhea', isCorrect: false },
                                { id: 'c', label: 'When bacteria die off', isCorrect: false },
                                { id: 'd', label: 'When you eat too much fiber', isCorrect: false },
                            ],
                        },
                        {
                            id: 'q3',
                            question: 'In the 5R Protocol, what does "Repair" focus on?',
                            options: [
                                { id: 'a', label: 'Removing food sensitivities', isCorrect: false },
                                { id: 'b', label: 'Restoring good bacteria', isCorrect: false },
                                { id: 'c', label: 'Healing the gut lining', isCorrect: true },
                                { id: 'd', label: 'Rebalancing lifestyle', isCorrect: false },
                            ],
                        },
                    ]}
                    onComplete={(score, total) => {
                        onComplete();
                    }}
                />
            ),
        },

        // REAL INCOME EXAMPLE - Unique to Gut
        {
            id: 20,
            type: 'coach',
            content: `You're getting this! Now let me show you why gut health is one of the most PROFITABLE specialties...`,
        },
        {
            id: 21,
            type: 'system',
            content: `**Why Gut Health = Recurring Revenue**

Gut healing takes TIME. That means ongoing client relationships.

**Typical Gut Health Client Journey:**

Month 1-2: Remove phase + initial support
- 4 sessions @ $175 = $700

Month 3-4: Reinoculate + Repair
- 4 sessions @ $175 = $700

Month 5-6: Optimize + Maintain
- 2 sessions @ $175 = $350

**Total per client: $1,750 over 6 months**

Now multiply:
- 5 clients = $8,750 over 6 months
- 10 clients = $17,500 over 6 months

And they REFER friends because they finally feel better.

One graduate said: "My gut health clients stay an average of 5 months. That's $875/client without chasing new business."`,
            systemStyle: 'income-hook',
        },

        // DOWNLOADABLE RESOURCE
        {
            id: 22,
            type: 'coach',
            content: `I want to give you something you'll use constantly - the 5R Protocol cheatsheet...`,
        },
        {
            id: 23,
            type: 'custom-component',
            content: '',
            renderComponent: ({ onComplete }) => (
                <DownloadResource
                    title="The 5R Protocol Cheatsheet"
                    description="Quick reference guide with the complete 5R framework, common supplements, and implementation timeline"
                    fileName="5R-Protocol-Cheatsheet.pdf"
                    downloadUrl="/resources/mini-diploma/5r-protocol-cheatsheet.pdf"
                    icon="checklist"
                    onDownload={onComplete}
                />
            ),
        },

        // SECOND TESTIMONIAL - Different Angle
        {
            id: 25,
            type: 'system',
            content: `**Meet Diane, 51 - Career Changer**

"I was a dental hygienist for 22 years. My own gut issues started after a round of antibiotics. Doctors had no answers.

I healed myself using functional medicine principles, then got certified to help others.

My specialty now? Post-antibiotic gut recovery. It's incredibly specific, and clients FIND me because of it.

Current stats:
- 14 active clients
- $225/session (specialized niche = higher rates)
- Working 16 hours/week
- Last month: $5,200

I never thought I'd leave dental hygiene. Now I can't imagine going back. I'm home when my grandkids visit. I set my own schedule. And I help people who were suffering like I was."

- Diane F., Florida | $5,200/month | 16 hrs/week`,
            systemStyle: 'testimonial',
        },

        // GAP BUILDER
        {
            id: 26,
            type: 'coach',
            content: `{name}, you now understand gut health better than 90% of people - including many doctors. Seriously.`,
        },
        {
            id: 27,
            type: 'coach',
            content: `But here's the thing - what I just taught you is the FOUNDATION. Full practitioners learn advanced protocols for SIBO, candida, parasites, histamine intolerance, H. pylori...`,
        },
        {
            id: 28,
            type: 'coach',
            content: `Each one of those is a specialty within a specialty. And each one has desperate clients willing to pay premium prices for someone who understands their unique situation.`,
        },

        // BRIDGE TO LESSON 3
        {
            id: 29,
            type: 'coach',
            content: `Now here's what's fascinating - gut issues don't exist in isolation. There's a silent fire burning underneath almost every chronic condition...`,
        },
        {
            id: 30,
            type: 'system',
            content: `**Coming Up: The Inflammation Blueprint**

- Why inflammation is behind EVERY chronic disease
- The 6 hidden triggers most people ignore
- Your first case study challenge
- What anti-inflammation specialists earn

**Inflammation/Autoimmune Market:** 24 million Americans with autoimmune diseases
**Average Income:** $4,400 - $6,200/month

Ready to understand the ROOT of chronic disease?`,
            systemStyle: 'info',
        },
    ];

    return (
        <LessonBaseV2
            lessonNumber={lessonNumber}
            lessonTitle="The Gut Connection"
            lessonSubtitle="The #1 specialty that keeps clients coming back"
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
