"use client";

import { useState } from "react";
import { LessonBaseV2, Message } from "../../shared/lesson-base-v2";
import { KnowledgeCheckQuiz, DownloadResource, CaseStudyChallenge } from "../../shared/interactive-elements";

interface LessonProps {
    lessonNumber: number;
    totalLessons?: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

export function Lesson6Labs({
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
            content: `{name}, have you ever had labs come back "normal" when you KNEW something was wrong?`,
        },
        {
            id: 2,
            type: 'coach',
            content: `Let me tell you about my friend Martha. She spent 3 YEARS bouncing between doctors. Fatigue, weight gain, brain fog. Every doctor said the same thing...`,
        },
        {
            id: 3,
            type: 'coach',
            content: `"Your labs are normal. Maybe try exercising more?"`,
        },
        {
            id: 4,
            type: 'coach',
            content: `Finally, a functional medicine practitioner looked at her labs differently. Her TSH was 3.8 - "normal" by conventional standards, but MISERABLE by functional standards. Six months later, she felt 20 years younger.`,
        },
        {
            id: 5,
            type: 'system',
            content: `**The "Normal" Lab Problem**

"Normal" lab ranges are based on:
- Population averages (including sick people!)
- Wide statistical ranges (95% of population)
- Disease detection - NOT health optimization

**The shocking truth:**
- You can be "normal" and feel terrible
- Problems aren't caught until they become diseases
- Doctors say "you're fine" when you're NOT

Functional ranges catch issues 5-10 years earlier. This is why clients will PAY you to review their labs.`,
            systemStyle: 'stats',
        },

        // OBJECTION CRUSHER: "I'm not a doctor - can I interpret labs?"
        {
            id: 6,
            type: 'coach',
            content: `Now I know what you might be thinking: "Sarah, I'm not a doctor. Can I really look at labs?"`,
        },
        {
            id: 7,
            type: 'system',
            content: `**"But I Can't Interpret Labs Without a Medical Degree..."**

Here's the truth: You're not DIAGNOSING. You're EDUCATING.

**What doctors do:**
- Order labs
- Diagnose disease
- Prescribe treatment
- Use "normal" to rule out disease

**What YOU do:**
- Review labs the client already has
- Educate on optimal vs normal ranges
- Identify patterns that suggest root causes
- Recommend they discuss findings with their doctor

You're a second set of eyes. You're catching what doctors miss because they have 7 minutes and you have 60.

A graduate told us: "I was terrified of looking at labs. Now clients BRING me their bloodwork because I see things their doctor missed. I don't diagnose - I educate. And they love me for it."`,
            systemStyle: 'comparison',
        },

        // TESTIMONIAL - Lab Focus
        {
            id: 8,
            type: 'system',
            content: `**Meet Teresa, 53 - Former Bookkeeper**

"I had no medical training whatsoever. Numbers were my thing - spreadsheets, not blood tests.

But when I learned functional ranges, something clicked. Labs ARE just numbers. Patterns. Trends. I'm good at that!

My specialty now: Lab review sessions. Clients bring me their bloodwork, I spend 60-90 minutes going through everything, explaining what their doctor didn't have time to explain.

Here's what happened:
- First month: 2 lab reviews at $125 each
- Month 3: Word spread. 8 reviews at $175
- Month 6: Now I charge $225 for 90-minute comprehensive reviews
- Current: 6-8 reviews/month = $1,350-1,800 just from labs

And here's the best part: Lab reviews lead to coaching clients. 70% of my lab review clients become ongoing clients.

No medical degree. Just pattern recognition and the willingness to learn."

- Teresa H., Michigan | ASI Graduate 2023`,
            systemStyle: 'testimonial',
        },

        // TEACH - Functional vs Conventional
        {
            id: 9,
            type: 'coach',
            content: `Let me show you the difference between conventional ranges and functional ranges. This is what separates practitioners who get results from those who don't.`,
        },
        {
            id: 10,
            type: 'system',
            content: `**Conventional vs Functional Ranges**

**TSH (Thyroid)**
- Conventional: 0.5 - 4.5 (HUGE range!)
- Functional optimal: 1.0 - 2.0
- Reality: At 3.5 you feel terrible but you're "normal"

**Fasting Glucose**
- Conventional: 70 - 100 (pre-diabetic at 100)
- Functional optimal: 75 - 86
- Reality: At 95, damage is already happening

**Vitamin D**
- Conventional: 30 - 100 (deficient below 30)
- Functional optimal: 50 - 70
- Reality: At 35 you're "fine" but definitely not thriving

**Ferritin (Iron Storage)**
- Conventional: 12 - 150 (women)
- Functional optimal: 50 - 100
- Reality: At 25 you're exhausted but "normal"

Functional ranges = optimal health, not just "not sick"`,
            systemStyle: 'comparison',
        },
        {
            id: 11,
            type: 'user-choice',
            content: `Has this ever happened to you or someone you know?`,
            choices: [
                "Yes! I was told I was fine but felt awful",
                "I've heard this complaint from others",
                "This is new information for me",
            ],
            showReaction: true,
        },

        // THE 5 KEY MARKERS
        {
            id: 12,
            type: 'coach',
            content: `Now let me teach you the 5 functional markers every practitioner needs to understand. Master these and you'll see patterns doctors miss.`,
        },
        {
            id: 13,
            type: 'system',
            content: `**The 5 Key Functional Markers**

**1. FASTING INSULIN**
- The most important metabolic marker
- Shows insulin resistance YEARS before diabetes
- Optimal: 2-5 uIU/mL
- Problem: Many doctors don't even test this!

**2. HbA1c**
- 3-month blood sugar average
- Optimal: 4.8 - 5.2%
- Problem: Pre-diabetes starts at 5.7 - that's too late!

**3. hsCRP (High-Sensitivity CRP)**
- Measures systemic inflammation
- Optimal: < 1.0 mg/L
- Predicts heart disease risk better than cholesterol

**4. VITAMIN D (25-OH)**
- It's a hormone, not just a vitamin
- Optimal: 50-70 ng/mL
- Problem: Most people are severely deficient

**5. HOMOCYSTEINE**
- Methylation and detox marker
- Optimal: 6-8 umol/L
- High = cardiovascular AND cognitive risk

If a client has these 5 optimized, they're probably doing well. If ANY are off, you've found something to work on.`,
            systemStyle: 'takeaway',
        },

        // SCOPE OF PRACTICE - Lab Specific
        {
            id: 14,
            type: 'system',
            content: `**Your Scope: Lab EDUCATION, Not Interpretation**

Clear boundaries protect you and your clients:

**You CAN:**
✓ Review labs the client already has
✓ Educate on optimal vs conventional ranges
✓ Point out patterns and trends
✓ Suggest they ask their doctor about specific tests
✓ Recommend lifestyle changes that affect markers
✓ Track progress over time

**Doctors DO:**
- Order lab tests
- Make clinical diagnoses
- Prescribe based on lab results
- Handle abnormal or critical values

**The magic phrase:**
"Based on functional medicine research, some practitioners consider optimal [marker] to be [range]. You might want to discuss this with your doctor."

You're educating, not diagnosing. Big difference.`,
            systemStyle: 'comparison',
        },

        // CASE STUDY
        {
            id: 15,
            type: 'coach',
            content: `Time to put your lab knowledge to work! Here's a real scenario you'll encounter...`,
        },
        {
            id: 16,
            type: 'custom-component',
            content: '',
            componentProps: { points: 40 },
            renderComponent: ({ onComplete }) => (
                <CaseStudyChallenge
                    caseTitle="Susan's 'Normal' Labs"
                    patientInfo="Susan, 46, marketing manager, exhausted and gaining weight"
                    symptoms={[
                        "Crushing fatigue - can barely make it through workday",
                        "Gained 25 lbs in 2 years despite 'eating healthy'",
                        "Hair thinning, outer eyebrows sparse",
                        "Constipation, feels cold all the time",
                        "Brain fog, forgetting words mid-sentence",
                        "Doctor's labs: TSH 3.4, fasting glucose 96, Vitamin D 32",
                        "Doctor said: 'Everything looks normal. Maybe try eating less.'",
                    ]}
                    question="Based on functional ranges, what would you educate Susan about?"
                    options={[
                        { id: 'a', label: 'Her labs are actually normal, she needs to exercise more', isCorrect: false, explanation: 'This is exactly what conventional medicine told her. But by functional standards, her labs are NOT optimal.' },
                        { id: 'b', label: 'Her TSH, glucose, and Vitamin D are all suboptimal by functional standards', isCorrect: true, explanation: 'Correct! TSH 3.4 is suboptimal (functional: 1.0-2.0), glucose 96 shows insulin resistance starting, and Vitamin D 32 is deficient by functional standards (optimal: 50-70). Her symptoms perfectly match these suboptimal markers.' },
                        { id: 'c', label: 'She probably has a thyroid disease and needs medication', isCorrect: false, explanation: 'You cannot diagnose thyroid disease. But you CAN educate her that her TSH is suboptimal by functional standards and suggest she discuss it with her doctor.' },
                        { id: 'd', label: 'Her Vitamin D is the only issue worth addressing', isCorrect: false, explanation: 'All three markers are suboptimal. Her pattern of symptoms suggests thyroid and metabolic issues too.' },
                    ]}
                    expertExplanation="Susan's case is classic: 'normal' labs that aren't optimal. Her TSH of 3.4 with thyroid symptoms (fatigue, cold, hair loss, constipation, brain fog) suggests subclinical thyroid dysfunction. Her fasting glucose of 96 is heading toward pre-diabetes. Her Vitamin D of 32 is insufficient for optimal function. As her coach, you'd educate her on functional ranges, suggest she discuss a full thyroid panel with her doctor, and work on blood sugar and Vitamin D through lifestyle."
                    incomeHook="Susan would become a 6+ month client. Initial lab review ($175) + ongoing coaching ($175/session x 2/month x 6 months) = $2,275 from one client who finally has answers."
                    onComplete={(selected, isCorrect) => {
                        onComplete();
                    }}
                />
            ),
        },

        // KNOWLEDGE CHECK
        {
            id: 17,
            type: 'coach',
            content: `Let's test your understanding of these crucial markers...`,
        },
        {
            id: 18,
            type: 'custom-component',
            content: '',
            componentProps: { points: 30 },
            renderComponent: ({ onComplete }) => (
                <KnowledgeCheckQuiz
                    title="Lab Interpretation Check"
                    questions={[
                        {
                            id: 'q1',
                            question: 'What is the functional optimal range for TSH?',
                            options: [
                                { id: 'a', label: '0.5 - 4.5', isCorrect: false },
                                { id: 'b', label: '1.0 - 2.0', isCorrect: true },
                                { id: 'c', label: '2.5 - 4.0', isCorrect: false },
                                { id: 'd', label: '0.1 - 1.0', isCorrect: false },
                            ],
                        },
                        {
                            id: 'q2',
                            question: 'Which marker shows insulin resistance years before diabetes?',
                            options: [
                                { id: 'a', label: 'Fasting glucose', isCorrect: false },
                                { id: 'b', label: 'HbA1c', isCorrect: false },
                                { id: 'c', label: 'Fasting insulin', isCorrect: true },
                                { id: 'd', label: 'hsCRP', isCorrect: false },
                            ],
                        },
                        {
                            id: 'q3',
                            question: 'What is the optimal Vitamin D level?',
                            options: [
                                { id: 'a', label: '20-30 ng/mL', isCorrect: false },
                                { id: 'b', label: '30-40 ng/mL', isCorrect: false },
                                { id: 'c', label: '50-70 ng/mL', isCorrect: true },
                                { id: 'd', label: '80-100 ng/mL', isCorrect: false },
                            ],
                        },
                    ]}
                    onComplete={(score, total) => {
                        onComplete();
                    }}
                />
            ),
        },

        // INCOME - Unique to Labs
        {
            id: 19,
            type: 'system',
            content: `**The Lab Review Business Model**

Why lab review is your secret weapon for income:

**Service Tiers:**

*Quick Lab Review (30 min)*
- Review standard panel
- Written summary of findings
- $75-125

*Comprehensive Lab Review (90 min)*
- Full panel analysis
- Functional range education
- Written recommendations
- $175-250

*Quarterly Monitoring Package*
- Review labs 4x/year
- Track trends and progress
- $600-800/year per client

**Why this works:**
- Clients LOVE getting their labs explained
- Doctors give 5 minutes. You give 60-90.
- Natural lead-in to ongoing coaching
- 70% of lab review clients become coaching clients

**Graduate Reality:**
"I do 8-10 lab reviews per month at $195 each. That's $1,560-1,950 just from lab reviews - before any coaching sessions. And most of them become ongoing clients." - Rebecca K., ASI Graduate`,
            systemStyle: 'income-hook',
        },

        // SECOND TESTIMONIAL
        {
            id: 20,
            type: 'system',
            content: `**Meet Janice, 58 - Former Administrative Assistant**

"I was a secretary for 30 years. When I retired, I wanted to do something meaningful. But I thought 'Who's going to listen to a retired secretary about health?'

Then I learned about functional lab ranges. And I realized: This is just about paying attention to details. I did that for 30 years!

My focus became women 50+ with thyroid issues. Why? Because I HAD thyroid issues, and I knew how frustrating it was to be told 'your labs are normal.'

What my practice looks like now:
- Specialize in thyroid and hormone labs
- $200 for comprehensive review
- Average 6 lab reviews per month
- 4 of those become coaching clients
- Monthly income: $3,800

I'm 58 years old. I have no medical training. But I have attention to detail and empathy. That's what clients need."

- Janice W., Virginia | ASI Graduate 2024`,
            systemStyle: 'testimonial',
        },

        // DOWNLOADABLE RESOURCE
        {
            id: 21,
            type: 'coach',
            content: `I want to give you a quick reference guide for lab ranges - this is something you'll use constantly...`,
        },
        {
            id: 22,
            type: 'custom-component',
            content: '',
            renderComponent: ({ onComplete }) => (
                <DownloadResource
                    title="Functional Lab Ranges Cheatsheet"
                    description="Quick reference for conventional vs functional optimal ranges for the 15 most important markers"
                    fileName="Lab-Ranges-Cheatsheet.pdf"
                    downloadUrl="/resources/mini-diploma/lab-ranges-cheatsheet.pdf"
                    icon="pdf"
                    onDownload={onComplete}
                />
            ),
        },

        // ACTION STEP
        {
            id: 23,
            type: 'system',
            content: `**Your Lab Action Step**

Next time you or someone you know gets labs back:

1. Don't just look at "High/Low" flags
2. Compare to FUNCTIONAL optimal ranges
3. Look for PATTERNS across markers
4. Ask: "What could be causing this?"

**Practice exercise:**
Find your most recent labs (or a family member's). Compare each marker to the functional ranges you learned today. What do you notice?

This is exactly what you'll do for paying clients.`,
            systemStyle: 'exercise',
        },

        // PREVIEW
        {
            id: 24,
            type: 'coach',
            content: `{name}, you now understand lab interpretation better than most healthcare providers. Seriously. Doctors spend 30 seconds on labs. You'll spend 90 minutes.`,
        },
        {
            id: 25,
            type: 'coach',
            content: `Next up: BUILDING PROTOCOLS. This is where everything comes together - you'll learn how to turn all this knowledge into actual client programs that get results.`,
        },
        {
            id: 26,
            type: 'system',
            content: `**Coming Up: Building Client Protocols**

- The framework for creating protocols that work
- The "Big 3" interventions that fix 80% of issues
- Your next case study to solve!
- Why protocol-based practitioners earn more

This is where knowledge becomes income. See you there!`,
            systemStyle: 'info',
        },
    ];

    return (
        <LessonBaseV2
            lessonNumber={lessonNumber}
            lessonTitle="Lab Interpretation Secrets"
            lessonSubtitle="See what doctors miss (without a medical degree)"
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
