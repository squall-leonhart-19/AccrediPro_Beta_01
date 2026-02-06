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

export function ClassicLessonFoundation({
    lessonNumber,
    totalLessons = 3,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const sections: LessonSection[] = [
        // SARAH'S INTRO
        {
            type: 'intro',
            content: `Hey {name}, I'm Sarah. Before we dive in, I want you to know who's teaching you - because my story might be a lot like yours.`,
        },
        {
            type: 'text',
            content: `I was a nurse for 12 years. Long shifts, missing my kids' school plays, barely seeing my husband. I loved helping people, but the hospital system was crushing me. $52,000 a year. Two kids. Daycare ate half my paycheck.`,
        },
        {
            type: 'text',
            content: `Then my husband passed away suddenly. A heart attack at 46. No warning. Just... gone.`,
        },
        {
            type: 'text',
            content: `I fell apart. Single mom. Two kids. Grief, exhaustion, anxiety. My own doctor put me on antidepressants. "Give it time," she said. But I was getting WORSE, not better. And I couldn't afford to fall apart - my children needed me.`,
        },
        {
            type: 'text',
            content: `A friend mentioned functional medicine. I was skeptical - it sounded like "woo-woo" stuff. But I was desperate. Within 2 months, I discovered WHY I felt so broken: cortisol through the roof, gut issues, nutrient deficiencies. Things my doctor never checked.`,
        },
        {
            type: 'key-point',
            content: `6 months later? Off the pills. Energy back. Sleeping again. I got my LIFE back. And I thought: "How many other women are suffering like I was? How many are being handed pills instead of answers?"`,
        },
        {
            type: 'text',
            content: `So I got certified. I started helping other women. Now? I work part-time from home, earn $5-10k+ monthly, and I'm FINALLY there for my kids. School pickups, dinner together, weekends free. The life I dreamed of as a burnt-out nurse.`,
        },
        {
            type: 'text',
            content: `Over 200 women have now used the same method I'm about to teach you. Many of them also came from healthcare - nurses, medical assistants, caregivers - people who wanted to help others BUT couldn't sacrifice their families anymore.`,
        },

        // THE GAP
        {
            type: 'heading',
            content: 'The $200 Billion Healthcare Gap',
        },
        {
            type: 'text',
            content: `Right now, 60% of Americans have a chronic disease. 42% have TWO or more. Diabetes, autoimmune conditions, chronic fatigue, anxiety, gut issues... they're EVERYWHERE.`,
        },
        {
            type: 'text',
            content: `Here's what's broken: Doctors are trained for ACUTE care - heart attacks, broken bones, emergencies. They're heroes at that. But chronic disease? It requires TIME, investigation, lifestyle changes. Things a 7-minute appointment can't provide.`,
        },
        {
            type: 'before-after',
            content: '',
            before: {
                title: 'The Conventional Approach',
                items: [
                    'Patient: "I\'m exhausted all the time"',
                    'Doctor: "Your labs look fine"',
                    'Prescription: Anti-depressants',
                    'Result: Symptoms managed, cause ignored',
                ],
            },
            after: {
                title: 'The Root Cause Approach',
                items: [
                    'Client: "I\'m exhausted all the time"',
                    'You: "Let\'s investigate WHY"',
                    'Discovery: Thyroid, gut, or adrenal dysfunction',
                    'Result: Root cause addressed, energy returns',
                ],
            },
        },

        // WHAT IS FM
        {
            type: 'heading',
            content: 'What IS Functional Medicine?',
        },
        {
            type: 'definition',
            term: 'Functional Medicine',
            content: `A personalized, systems-oriented approach that empowers clients to achieve their highest expression of health by addressing the **root causes** of disease rather than just treating symptoms. It asks "WHY is this happening?" instead of "WHAT pill can mask this?"`,
        },
        {
            type: 'text',
            content: `Think of it like this: If your car's check engine light comes on, you don't just cover it with tape and keep driving. You figure out WHY it's on. That's functional medicine for the human body.`,
        },
        {
            type: 'key-point',
            content: `Here's the insight that changed everything for me: Almost EVERY chronic health issue traces back to dysfunction in one of **five areas**. Master these five, and you can help 90% of the clients who walk through your door.`,
        },
        {
            type: 'checkpoint',
            content: '',
            checkpoint: {
                question: 'What does functional medicine primarily focus on?',
                options: [
                    { label: 'Prescribing medications for symptoms', isCorrect: false },
                    { label: 'Addressing root causes of disease', isCorrect: true },
                    { label: 'Performing surgical procedures', isCorrect: false },
                ],
                successMessage: 'Exactly! Root causes, not symptoms.',
            },
        },

        // THE 5 ROOT CAUSES
        {
            type: 'heading',
            content: 'The 5 Root Causes of Chronic Disease',
        },
        {
            type: 'text',
            content: `Every chronic condition your clients experience can be traced to dysfunction in one or more of these five areas:`,
        },
        {
            type: 'list',
            content: '',
            items: [
                '**Gut Dysfunction** — 70% of the immune system lives here. When the gut breaks, everything breaks.',
                '**Chronic Inflammation** — The silent killer behind heart disease, diabetes, Alzheimer\'s, and autoimmune conditions.',
                '**Toxin Overload** — 80,000+ synthetic chemicals in our environment. Our bodies weren\'t designed for this.',
                '**Nutrient Deficiencies** — Even the "well-fed" are malnourished. Modern food is nutritionally depleted.',
                '**HPA Axis Dysfunction** — Chronic stress destroys health. Cortisol dysregulation affects everything.',
            ],
        },
        {
            type: 'callout',
            content: `The magic? These 5 causes are all CONNECTED. Fix one, and others start improving. This is why root cause practitioners get results that seem almost miraculous - they're not treating symptoms, they're restoring balance.`,
            style: 'success',
        },
        {
            type: 'checkpoint',
            content: '',
            checkpoint: {
                question: 'Which of the following is NOT one of the 5 root causes?',
                options: [
                    { label: 'Gut Dysfunction', isCorrect: false },
                    { label: 'Genetic Mutations', isCorrect: true },
                    { label: 'HPA Axis Dysfunction', isCorrect: false },
                ],
                successMessage: 'Correct! The 5 root causes focus on modifiable factors like gut, inflammation, toxins, nutrients, and HPA axis.',
            },
        },

        // REAL CLIENT EXAMPLE
        {
            type: 'heading',
            content: 'Real Client: Maria\'s Transformation',
        },
        {
            type: 'text',
            content: `Maria, 44, came to me after 3 years of seeing doctors. She was a teacher, exhausted by 2pm, missing her daughter's dance recitals because she "just couldn't." Her symptoms:`,
        },
        {
            type: 'list',
            content: '',
            items: [
                'Crushing fatigue (couldn\'t make it past 2pm)',
                'Brain fog so bad she forgot lesson plans mid-class',
                'Gained 40 lbs on "healthy" eating',
                'Depression, anxiety, crying in her car before work',
            ],
        },
        {
            type: 'text',
            content: `Her doctors said: "Labs are normal. Have you tried therapy and a gym membership?" She felt dismissed. Invisible. Broken.`,
        },
        {
            type: 'reveal-card',
            content: '',
            revealCard: {
                teaser: "Tap to see Maria's results after 90 days →",
                content: "Results after 90 days: Energy 8/10 (was 2/10). Brain fog GONE. Lost 18 lbs. She called me crying: \"I made it to my daughter's dance recital. I was THERE. You gave me my life back.\"",
            },
        },
        {
            type: 'micro-commitment',
            content: 'Could you see yourself helping someone like Maria?',
            commitmentOptions: {
                positive: 'Yes, absolutely',
                neutral: 'Tell me more',
            },
        },

        // SCOPE OF PRACTICE
        {
            type: 'heading',
            content: '"But Sarah, I\'m Not a Doctor..."',
        },
        {
            type: 'text',
            content: `Neither am I. I'm a former nurse who was tired of watching the system fail people. And here's why NOT being a doctor is actually an ADVANTAGE:`,
        },
        {
            type: 'before-after',
            content: '',
            before: {
                title: 'What Doctors Do (Medical Practice)',
                items: [
                    'Diagnose diseases',
                    'Prescribe medications',
                    'Perform procedures',
                    'Limited to 7-minute visits',
                ],
            },
            after: {
                title: 'What Health Coaches Do (Education)',
                items: [
                    'Educate on nutrition & lifestyle',
                    'Support behavior change',
                    'Help implement healthy habits',
                    'Spend 60+ minutes with clients',
                ],
            },
        },
        {
            type: 'callout',
            content: `You're not replacing doctors - you're PARTNERING with them. As a certified health coach, you legally provide EDUCATION and SUPPORT, not medical advice. This is 100% legal in all 50 states. Your job is to help clients implement what doctors don't have time to teach.`,
            style: 'info',
        },
        {
            type: 'checkpoint',
            content: '',
            checkpoint: {
                question: 'As a certified health coach, what is your primary role?',
                options: [
                    { label: 'Diagnose diseases and prescribe treatments', isCorrect: false },
                    { label: 'Educate and support lifestyle changes', isCorrect: true },
                ],
                successMessage: 'Right! Education and support — 100% legal in all 50 states.',
            },
        },

        // BRIDGE TO L2
        {
            type: 'heading',
            content: 'Coming Up: The D.E.P.T.H. Method™',
        },
        {
            type: 'text',
            content: `You now understand what functional medicine is, the 5 root causes, and your scope of practice. But knowing the root causes is only half the battle.`,
        },
        {
            type: 'callout',
            content: `In the next lesson, you'll learn the exact step-by-step framework I use with every single client - the **D.E.P.T.H. Method™**. This is what separates coaches who struggle from coaches who have waiting lists and earn $5,000+ monthly.`,
            style: 'tip',
        },
    ];

    const keyTakeaways = [
        'Functional medicine addresses **root causes**, not just symptoms',
        '5 Root Causes: **Gut, Inflammation, Toxins, Nutrients, HPA Axis** (Stress)',
        'Health coaches provide EDUCATION, not medical diagnosis',
        'The healthcare gap creates massive demand for certified coaches',
        'Your personal health journey is your SUPERPOWER, not a limitation',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Functional Medicine Foundation"
            lessonSubtitle="The $200B healthcare gap and why certified coaches are in massive demand"
            totalLessons={totalLessons}
            sections={sections}
            keyTakeaways={keyTakeaways}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
            niche="functional-medicine"
            nicheLabel="Functional Medicine Certification"
            baseUrl="/portal/functional-medicine"
            courseSlug="functional-medicine-complete-certification"
        />
    );
}
