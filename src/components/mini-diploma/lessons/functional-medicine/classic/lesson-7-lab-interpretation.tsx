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

export function ClassicLessonLabInterpretation({
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
            content: `{name}, this is the lesson that separates PREMIUM practitioners from average coaches. Lab interpretation. When you can look at someone's labs and say "I see why you feel terrible - and here's what we can do about it" - you become INVALUABLE. Doctors charge $200-400 for lab reviews. You can offer this same value.`,
        },
        {
            type: 'heading',
            content: '"Normal" vs. Optimal: The Critical Difference',
        },
        {
            type: 'list',
            content: 'Why "Normal" Means Nothing:',
            items: [
                '"Normal" ranges come from sick population averages',
                'They detect DISEASE, not dysfunction',
                'You can be "normal" for 10 years while getting sicker',
                'Functional ranges catch problems 5-10 years earlier',
            ],
        },
        {
            type: 'key-point',
            content: `Example: TSH (thyroid). Conventional range: 0.5 - 4.5. Functional optimal: 1.0 - 2.5. Someone at TSH 3.8 is "normal" but their thyroid is already struggling. They have symptoms. Doctors say nothing is wrong. YOU can see the problem coming.`,
        },
        {
            type: 'heading',
            content: '"I Can\'t Interpret Labs - I\'m Not a Doctor..."',
        },
        {
            type: 'text',
            content: `Here's the truth: You're not DIAGNOSING. You're EDUCATING.`,
        },
        {
            type: 'list',
            content: 'What Doctors Do:',
            items: [
                'Order labs',
                'Diagnose diseases',
                'Prescribe medications',
                'Use "normal" to rule out disease',
            ],
        },
        {
            type: 'list',
            content: 'What YOU Do:',
            items: [
                'Review labs the client already has',
                'Educate on optimal vs. normal ranges',
                'Identify patterns suggesting root causes',
                'Recommend they discuss findings with their doctor',
                'Create nutrition/lifestyle protocols to support improvement',
            ],
        },
        {
            type: 'callout',
            content: `A graduate told us: "I was terrified of looking at labs. Now clients BRING me their bloodwork because I see things their doctor missed. I don't diagnose - I educate. And they pay me $175 for a 60-minute review." You're a second set of educated eyes. That's valuable.`,
            style: 'tip',
        },
        {
            type: 'heading',
            content: 'Real Story: Sandra, 45 - Former Medical Coder',
        },
        {
            type: 'quote',
            content: `"I worked in medical coding for 18 years. Saw lab results all day but never understood what they meant. After certification, I offer 'Lab Review Sessions' as my premium service. Clients pay $200 for a 90-minute deep dive into their bloodwork. I spot patterns their doctors miss because doctors have 7 minutes. I have 90. Last month: 8 lab reviews = $1,600 from ONE service. This single skill made my practice profitable." - Sandra K., Texas | ASI Graduate 2023`,
        },
        {
            type: 'heading',
            content: 'The 5 Functional Markers You MUST Know',
        },
        {
            type: 'list',
            content: '1. FASTING INSULIN (Metabolic Health):',
            items: [
                'Conventional range: 2.6 - 24.9 uU/mL',
                'Functional optimal: 2 - 6 uU/mL',
                'Above 6 = insulin resistance developing',
                'Catches diabetes 10+ years before glucose goes high',
            ],
        },
        {
            type: 'list',
            content: '2. hsCRP (Inflammation):',
            items: [
                'Conventional range: < 3.0 mg/L',
                'Functional optimal: < 1.0 mg/L',
                'Above 1 = chronic inflammation present',
                'Predicts heart disease, cancer risk',
            ],
        },
        {
            type: 'list',
            content: '3. HOMOCYSTEINE (Methylation/Detox):',
            items: [
                'Conventional range: 5 - 15 umol/L',
                'Functional optimal: 6 - 8 umol/L',
                'Above 10 = cardiovascular risk, B vitamin issues',
                'Below 6 = possible over-methylation',
            ],
        },
        {
            type: 'list',
            content: '4. FERRITIN (Iron/Inflammation):',
            items: [
                'Conventional range: 12 - 150 ng/mL (women)',
                'Functional optimal: 50 - 100 ng/mL',
                'Below 50 = fatigue, hair loss, low thyroid function',
                'Above 150 = inflammation or iron overload',
            ],
        },
        {
            type: 'list',
            content: '5. TSH (Thyroid):',
            items: [
                'Conventional range: 0.5 - 4.5 mU/L',
                'Functional optimal: 1.0 - 2.5 mU/L',
                'Above 2.5 = thyroid struggling (even if "normal")',
                'Most women with fatigue have suboptimal thyroid',
            ],
        },
        {
            type: 'heading',
            content: 'Pattern Recognition: The Art of Connecting Dots',
        },
        {
            type: 'text',
            content: `Great practitioners don't just read individual markers. They see PATTERNS that tell stories.`,
        },
        {
            type: 'list',
            content: 'Common Patterns:',
            items: [
                'High insulin + High triglycerides + Low HDL = Metabolic syndrome developing',
                'High hsCRP + Low vitamin D + Elevated TSH = Inflammation driving thyroid issues',
                'Low ferritin + Low B12 + GI symptoms = Gut absorption problem',
                'High homocysteine + Fatigue + Mood issues = Methylation dysfunction',
            ],
        },
        {
            type: 'callout',
            content: `When you can say: "I see your inflammation is elevated, your vitamin D is low, and your thyroid is struggling - and they're all connected. Here's why and here's what we can do..." - you become their most trusted health advisor.`,
            style: 'success',
        },
        {
            type: 'heading',
            content: 'The Lab Review Business Model',
        },
        {
            type: 'list',
            content: 'How to Structure Lab Review Services:',
            items: [
                'Basic Lab Review (30 min): $75-100 - Quick review of CBC, metabolic panel',
                'Comprehensive Lab Review (60 min): $150-200 - Full panel with written report',
                'Premium Lab Consultation (90 min): $225-300 - Deep dive + protocol creation',
                'Ongoing Lab Tracking (quarterly): $400-600/year - Track progress over time',
            ],
        },
        {
            type: 'key-point',
            content: `Graduate quote: "Lab reviews are my highest-margin service. One 60-minute session = $175. No follow-up required. Clients are grateful because finally someone EXPLAINED what their numbers mean." - Valerie D., ASI Graduate`,
        },
        {
            type: 'heading',
            content: 'Real Story: Valerie, 52 - Career Changer from Accounting',
        },
        {
            type: 'quote',
            content: `"I was an accountant. Numbers were my thing. When I learned functional lab interpretation, it clicked immediately. Now I market myself as the 'Lab Detective.' I find patterns doctors miss because they have 7 minutes and I have 60. My clients are typically women 45-55 who've been told 'your labs are normal' while feeling terrible. I show them they're NOT crazy. The numbers tell a story. Current stats: 12 clients, mix of lab reviews ($175) and ongoing coaching ($200/session). Monthly income: $4,200. I use spreadsheets for labs now instead of taxes!" - Valerie D., Michigan | ASI Graduate 2024`,
        },
        {
            type: 'heading',
            content: 'Coming Up: Building Your Practice',
        },
        {
            type: 'text',
            content: `You now have clinical knowledge that separates you from basic health coaches. Next up: How to BUILD YOUR PRACTICE - finding clients, pricing, and creating packages that sell.`,
        },
        {
            type: 'list',
            content: 'What you\'ll learn:',
            items: [
                'Where to find your ideal clients',
                'How to price your services confidently',
                'Creating packages that clients want',
                'The 90-day client acquisition timeline',
            ],
        },
    ];

    const keyTakeaways = [
        '"Normal" labs detect disease; Functional ranges catch dysfunction years earlier',
        'You EDUCATE on labs, not DIAGNOSE - totally within scope',
        'The 5 must-know markers: Fasting insulin, hsCRP, Homocysteine, Ferritin, TSH',
        'Pattern recognition is more valuable than single marker analysis',
        'Lab review services are high-margin ($150-300 for 60-90 minutes)',
        'This skill alone can make your practice profitable',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Building Your Practice"
            lessonSubtitle="From protocols to paying clients"
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
