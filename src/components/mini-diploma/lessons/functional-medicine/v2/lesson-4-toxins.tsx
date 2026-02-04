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

export function Lesson4Toxins({
    lessonNumber,
    totalLessons = 9,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const [score, setScore] = useState(0);

    const messages: Message[] = [
        // HOOK - Shocking Reality
        {
            id: 1,
            type: 'coach',
            content: `{name}, I need to share something uncomfortable with you. It might make you angry.`,
        },
        {
            id: 2,
            type: 'coach',
            content: `By the time you finished your morning routine today, you were exposed to over 200 synthetic chemicals. Before breakfast.`,
        },
        {
            id: 3,
            type: 'coach',
            content: `Shampoo. Toothpaste. Deodorant. Makeup. Cleaning products. Plastics. The water from your tap.`,
        },
        {
            id: 4,
            type: 'system',
            content: `**The Toxic Reality**

- 80,000+ synthetic chemicals in our environment
- Only 200 have been tested for human safety
- Average person: 200+ chemical exposures before breakfast
- Newborns: 287 chemicals detected in umbilical cord blood
- 50% of US buildings have mold problems

We're all carrying a toxic burden. The question is: how much?

This isn't paranoia. It's the explanation for why so many people feel terrible despite "doing everything right."`,
            systemStyle: 'stats',
        },

        // TOXIN NICHE SPOTLIGHT
        {
            id: 5,
            type: 'system',
            content: `**☢️ NICHE SPOTLIGHT: Toxin & Mold Specialists**

**The Market:**
- 50% of US buildings have mold problems
- 80,000+ synthetic chemicals in our environment
- Mold illness is a HIDDEN EPIDEMIC
- Most doctors don't recognize or test for it

**What Practitioners Earn:**
- Average: $5,500 - $8,200/month
- Sessions: $225-350 each (PREMIUM)
- Mold recovery clients stay 6-12 months

**Why This Niche Wins:**
- PREMIUM pricing (specialized knowledge)
- Low competition (most coaches avoid this)
- Desperate clients (mold illness is devastating)
- Long-term relationships (recovery takes time)
- Oncologist referrals (cancer prevention)

"Mold clients stay with me for 8-12 months. That's $2,400-4,000 per client." - Christine, 46`,
            systemStyle: 'income-hook',
        },

        // OBJECTION CRUSHER: "Can I legally advise on this?"
        {
            id: 5,
            type: 'coach',
            content: `Now, before you worry - helping clients reduce toxin exposure is 100% within your scope as a health coach.`,
        },
        {
            id: 6,
            type: 'system',
            content: `**Legal Clarity: Detox & Toxins**

As a health coach, you absolutely CAN:
✓ Educate on toxin sources in home/environment
✓ Suggest safer product alternatives
✓ Recommend foods that support natural detox
✓ Guide on lifestyle changes to reduce exposure
✓ Suggest supplements (as education, not prescription)

You do NOT:
✗ Order or interpret medical detox tests
✗ Diagnose mold illness or heavy metal toxicity
✗ Create medical detox protocols
✗ Prescribe chelation therapy

**The partnership model:**
You educate and support. Doctors diagnose and treat.
Client suspects mold issue → You support lifestyle changes → Doctor orders testing if needed → You help implement recovery protocol

This is environmental health education. It's legal in all 50 states.`,
            systemStyle: 'comparison',
        },

        // TESTIMONIAL - Detox Focus
        {
            id: 8,
            type: 'system',
            content: `**Meet Christine, 46 - Former Real Estate Agent**

"I got severely sick from mold in my own home. Doctors had no clue what was wrong - I saw 11 specialists. When I finally figured it out, I became obsessed with environmental health.

Now I specialize in helping people identify hidden toxin sources and clean up their environment. It's a niche nobody else is filling.

My clients:
- People with 'mystery' symptoms (often mold)
- New moms wanting to 'detox' their homes
- Cancer survivors reducing future risk
- Anyone sensitive to chemicals

My numbers (18 months in):
- 12 clients currently
- $275/session (specialized = premium)
- Monthly: $6,600
- Working from home, my own hours

I'm not a doctor. I'm a 'toxin detective.' And people are desperate for someone like me. My last 6 clients came from referrals."

- Christine A., Georgia | $6,600/month | 18 hrs/week`,
            systemStyle: 'testimonial',
        },

        // TEACH - 5 Toxin Categories
        {
            id: 8,
            type: 'coach',
            content: `Let me break down the 5 major toxin categories. Understanding these will make you invaluable to clients who feel "poisoned but can't prove it."`,
        },
        {
            id: 9,
            type: 'system',
            content: `**The 5 Major Toxin Categories**

**1. HEAVY METALS**
- Lead, mercury, arsenic, cadmium, aluminum
- Sources: Fish, dental fillings, old paint, water pipes, cookware
- Symptoms: Brain fog, fatigue, mood issues, nerve problems

**2. MOLD & MYCOTOXINS**
- From water-damaged buildings (50% of US buildings!)
- Invisible and often undetected
- Symptoms: Fatigue, brain fog, respiratory issues, anxiety

**3. PESTICIDES & HERBICIDES**
- Glyphosate in 80% of food supply
- Stored in fat tissue for years
- Symptoms: Gut issues, hormone disruption, fatigue

**4. PLASTICS & ENDOCRINE DISRUPTORS**
- BPA, phthalates in containers, receipts, cosmetics
- Mimic hormones (especially estrogen)
- Symptoms: Weight gain, hormone issues, fertility problems

**5. HOUSEHOLD CHEMICALS**
- Average home: 62 toxic chemicals
- Cleaning products, air fresheners, cosmetics, candles
- Symptoms: Headaches, respiratory issues, skin problems

Most people have exposure from ALL 5 categories.`,
            systemStyle: 'takeaway',
        },

        // THE LIVER DETOX
        {
            id: 10,
            type: 'user-choice',
            content: `Have you ever done a "detox" or "cleanse" before?`,
            choices: [
                "Yes - juice cleanse or similar",
                "I've thought about it but wasn't sure",
                "No, I don't trust most detox programs",
            ],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Here's something crucial: Most detox programs out there are not just ineffective - they can be DANGEROUS. Let me explain why.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Why Most Detox Programs Are Dangerous**

Your liver detoxifies in 2 phases:

**PHASE 1: Activation**
- Toxins get "activated" (made water-soluble)
- Requires B vitamins, glutathione, antioxidants
- PROBLEM: Activated toxins are temporarily MORE harmful

**PHASE 2: Conjugation**
- Activated toxins get "packaged" for removal
- Requires amino acids, sulfur compounds
- Toxins exit via bile, urine, sweat

**THE DANGER:**
Most juice cleanses and "detox teas" speed up Phase 1 WITHOUT supporting Phase 2.

Result: Activated toxins build up in your body, making you feel WORSE.

It's like mopping the floor while the faucet is still running.

This is why clients need an educated coach - not a trendy Instagram detox.`,
            systemStyle: 'info',
        },

        // KNOWLEDGE CHECK
        {
            id: 13,
            type: 'coach',
            content: `Let's make sure you've got the key concepts. Quick check!`,
        },
        {
            id: 14,
            type: 'custom-component',
            content: '',
            componentProps: { points: 30 },
            renderComponent: ({ onComplete }) => (
                <KnowledgeCheckQuiz
                    title="Toxin Knowledge Check"
                    questions={[
                        {
                            id: 'q1',
                            question: 'How many synthetic chemicals are in our environment?',
                            options: [
                                { id: 'a', label: 'Around 5,000', isCorrect: false },
                                { id: 'b', label: 'Around 20,000', isCorrect: false },
                                { id: 'c', label: 'Over 80,000', isCorrect: true },
                                { id: 'd', label: 'Around 1,000', isCorrect: false },
                            ],
                        },
                        {
                            id: 'q2',
                            question: 'Why can juice cleanses be dangerous?',
                            options: [
                                { id: 'a', label: 'Too much sugar', isCorrect: false },
                                { id: 'b', label: 'They speed up Phase 1 without supporting Phase 2', isCorrect: true },
                                { id: 'c', label: 'Not enough protein', isCorrect: false },
                                { id: 'd', label: 'They dehydrate you', isCorrect: false },
                            ],
                        },
                        {
                            id: 'q3',
                            question: 'What percentage of US buildings may have mold issues?',
                            options: [
                                { id: 'a', label: '10%', isCorrect: false },
                                { id: 'b', label: '25%', isCorrect: false },
                                { id: 'c', label: '50%', isCorrect: true },
                                { id: 'd', label: '75%', isCorrect: false },
                            ],
                        },
                    ]}
                    onComplete={(score, total) => {
                        onComplete();
                    }}
                />
            ),
        },

        // SCOPE OF PRACTICE - Detox Specific
        {
            id: 15,
            type: 'system',
            content: `**What You CAN Help Clients With**

Environmental Education:
✓ Audit their home for toxin sources
✓ Recommend cleaner product alternatives
✓ Create "clean up" action plans
✓ Suggest air purifiers, water filters

Nutrition Support:
✓ Foods that support liver Phase 1 & 2
✓ Cruciferous vegetables, berries, cilantro
✓ Hydration for toxin elimination
✓ Supplements like NAC, glutathione (as education)

Lifestyle Guidance:
✓ Sweating protocols (sauna, exercise)
✓ Sleep optimization (detox happens at night)
✓ Stress reduction (stress impairs detox)

**What Doctors Handle:**
- Medical testing for heavy metals, mold exposure
- Chelation therapy or prescription protocols
- Treating acute toxicity
- IV therapies

You're the guide through the maze. They're the emergency responders.`,
            systemStyle: 'comparison',
        },

        // INCOME - Unique to Toxins/Detox
        {
            id: 16,
            type: 'system',
            content: `**The Detox Market: Massive Opportunity**

Why this niche is exploding:

**The Market:**
- Detox industry: $50+ BILLION globally
- Most programs are ineffective or dangerous
- Educated practitioners are RARE

**Specialized Niches Within Detox:**

*Mold Illness Support*
- Highly underserved market
- Clients stay 6-12 months
- Programs: $1,500-3,000

*Home Environment Detox*
- Popular with new moms, health-conscious families
- 4-6 session packages: $600-800

*Heavy Metal Support*
- Long-term relationships
- Monthly programs: $200-300/month ongoing

**Graduate Quote:**
"I did $2,800 last month from just 6 detox clients. One client has been with me 8 months for mold recovery. She refers everyone." - Michelle T., ASI Graduate`,
            systemStyle: 'income-hook',
        },

        // DOWNLOADABLE RESOURCE
        {
            id: 17,
            type: 'coach',
            content: `Here's something incredibly practical - a room-by-room guide to identifying toxins in any home...`,
        },
        {
            id: 18,
            type: 'custom-component',
            content: '',
            renderComponent: ({ onComplete }) => (
                <DownloadResource
                    title="Home Toxin Audit Checklist"
                    description="Room-by-room guide to identifying the top 20 toxin sources in any home, with swap recommendations"
                    fileName="Home-Toxins-Checklist.pdf"
                    downloadUrl="/resources/mini-diploma/home-toxins-checklist.pdf"
                    icon="checklist"
                    onDownload={onComplete}
                />
            ),
        },

        // SECOND TESTIMONIAL
        {
            id: 20,
            type: 'system',
            content: `**Meet Angela, 50 - Cancer Survivor**

"After breast cancer at 47, I became obsessed with reducing my toxic load. I researched everything. When I got certified, I knew my niche immediately: helping other cancer survivors create healthier environments.

It's deeply personal work. My clients cry. I cry. We're doing something meaningful.

My focus:
- Post-cancer environmental cleanup
- Reducing exposure for prevention
- Supporting detox pathways naturally

The numbers:
- 10 clients currently
- $300/session (premium niche)
- Monthly: $5,400
- Referrals from oncologists (!!)

Yes, oncologists refer to me. They don't have time to talk about plastics and cleaning products. I do.

Cancer gave me purpose. Now I help others not become statistics."

- Angela P., California | $5,400/month | 15 hrs/week`,
            systemStyle: 'testimonial',
        },

        // ACTION STEP
        {
            id: 20,
            type: 'system',
            content: `**Your 3 Immediate Toxin Swaps**

Start TODAY with these high-impact changes:

**1. WATER**
- Filter your drinking water
- Reverse osmosis or quality carbon filter
- $150-400 investment, massive return

**2. FOOD STORAGE**
- Replace plastic containers with glass
- Never heat food in plastic
- Avoid canned foods (BPA lining)

**3. PERSONAL CARE**
- Check 1 product on EWG.org Skin Deep database
- Swap your most-used products first
- Deodorant, lotion, and makeup are high-impact

This is exactly what you'll walk clients through. Start with yourself - you'll speak from experience.`,
            systemStyle: 'exercise',
        },

        // GAP BUILDER
        {
            id: 22,
            type: 'coach',
            content: `{name}, you now understand toxins better than most healthcare providers. This knowledge is genuinely valuable.`,
        },
        {
            id: 23,
            type: 'coach',
            content: `But here's the thing - I've given you the foundation. Full practitioners learn advanced detox protocols, mold illness recovery, heavy metal support, and how to work with the sickest clients safely...`,
        },
        {
            id: 24,
            type: 'coach',
            content: `The toxin/mold space is where the REALLY premium clients are. Because they're the ones western medicine has completely failed.`,
        },

        // BRIDGE TO LESSON 5
        {
            id: 25,
            type: 'coach',
            content: `Now here's something interesting - toxins destroy your hormones. And hormones destroyed by stress create a cascade of symptoms that millions of burned-out people are experiencing right now...`,
        },
        {
            id: 26,
            type: 'system',
            content: `**Coming Up: Stress & Hormones Decoded**

- Why 77% of workers are burned out
- The 3 stages of HPA axis dysfunction
- Your next case study to solve
- Why burnout coaching for women 40+ is a goldmine

**Burnout/Menopause Market:** 77% of workers + 1.3M women/year
**Average Income:** $4,400 - $6,800/month

This one hits close to home for most women.`,
            systemStyle: 'info',
        },
    ];

    return (
        <LessonBaseV2
            lessonNumber={lessonNumber}
            lessonTitle="The Toxin Reality"
            lessonSubtitle="The $50B detox market needs educated coaches"
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
