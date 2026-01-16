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

export function ClassicLessonNutrientDeficiencies({
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
            content: `{name}, have you ever had labs come back "normal" when you KNEW something was wrong? Let me tell you about my friend Martha. She spent 3 YEARS bouncing between doctors. Fatigue, weight gain, brain fog. Every doctor said: "Your labs are normal. Maybe try exercising more?" Finally, a functional medicine practitioner looked at her labs differently. Her vitamin D was 28 - "normal" by conventional standards but MISERABLE by functional standards. Six months later, she felt 20 years younger. This is what you're about to learn.`,
        },
        {
            type: 'heading',
            content: 'The Modern Paradox',
        },
        {
            type: 'key-point',
            content: `We're overfed but UNDERNOURISHED. 70% of Americans are deficient in vitamin D. 80% are deficient in magnesium. Up to 40% are deficient in B12. Meanwhile, they're eating 3,000+ calories daily. This isn't about eating MORE. It's about eating BETTER and absorbing what you eat.`,
        },
        {
            type: 'heading',
            content: '"I Can\'t Recommend Supplements - I\'m Not a Doctor..."',
        },
        {
            type: 'text',
            content: `Here's the truth: You're not PRESCRIBING. You're EDUCATING.`,
        },
        {
            type: 'list',
            content: 'What Doctors Do:',
            items: [
                'Diagnose deficiency diseases (scurvy, rickets)',
                'Order and interpret lab tests',
                'Prescribe pharmaceutical-grade treatments',
            ],
        },
        {
            type: 'list',
            content: 'What YOU Do:',
            items: [
                'Educate on the role of nutrients in health',
                'Suggest food sources of key nutrients',
                'Discuss supplement options (not prescribe)',
                'Help clients implement dietary changes',
                'Track symptoms and improvements',
            ],
        },
        {
            type: 'callout',
            content: `You're a nutrition educator, not a prescriber. A graduate said: "I was terrified to mention supplements. Now I say 'Many people find magnesium helpful for sleep - here's some research to discuss with your doctor.' Totally within scope. Clients love it."`,
            style: 'tip',
        },
        {
            type: 'heading',
            content: 'Real Story: Teresa, 53 - Former Bank Teller',
        },
        {
            type: 'quote',
            content: `"I worked at a bank for 25 years. No health background. When my own fatigue led me to discover I had severe vitamin D deficiency (at 18!), everything changed. My doctor said 'take a supplement' but didn't explain why, how much, or how to optimize absorption. I became obsessed with learning. Now I specialize in helping women optimize their nutrient status. My numbers: 10 clients, $185/session, monthly income $3,700. Last month a client told me: 'You taught me more about vitamin D in one hour than my doctor did in 10 years.'" - Teresa G., Ohio | ASI Graduate 2023`,
        },
        {
            type: 'heading',
            content: 'The Big 5 Deficiencies',
        },
        {
            type: 'list',
            content: '1. VITAMIN D (The Hormone Vitamin):',
            items: [
                '70% of Americans are deficient',
                'Optimal: 50-70 ng/mL (not the 30 "normal" cutoff)',
                'Affects: Immunity, mood, bones, cancer risk, hormones',
                'Most need 5,000-10,000 IU daily to optimize',
            ],
        },
        {
            type: 'list',
            content: '2. MAGNESIUM (The Relaxation Mineral):',
            items: [
                '80% of Americans are deficient',
                'Involved in 300+ enzyme reactions',
                'Affects: Sleep, anxiety, muscle cramps, blood pressure, blood sugar',
                'Stress DEPLETES magnesium rapidly',
            ],
        },
        {
            type: 'list',
            content: '3. B12 (The Energy Vitamin):',
            items: [
                'Up to 40% deficient, especially over 50',
                'Required for: Energy, brain function, nerve health, DNA synthesis',
                'PPIs (acid blockers) destroy B12 absorption',
                'Vegans are always deficient without supplementation',
            ],
        },
        {
            type: 'list',
            content: '4. OMEGA-3s (The Anti-Inflammatory Fats):',
            items: [
                'Most Americans have 20:1 omega-6 to omega-3 ratio (should be 4:1)',
                'Critical for: Brain health, inflammation, heart, mood',
                'Can\'t be made by the body - must come from diet',
            ],
        },
        {
            type: 'list',
            content: '5. ZINC (The Immune Mineral):',
            items: [
                'Essential for: Immunity, gut healing, hormones, skin',
                'Depleted by: Stress, alcohol, vegetarian diets',
                'Low zinc = frequent colds, slow healing, low testosterone',
            ],
        },
        {
            type: 'heading',
            content: 'Nutrient Thieves: What\'s Stealing Your Clients\' Nutrients',
        },
        {
            type: 'list',
            content: 'Common Depletors:',
            items: [
                'STRESS - Depletes B vitamins, magnesium, vitamin C, zinc',
                'PPIs (Prilosec, Nexium) - Destroys B12, magnesium, calcium absorption',
                'METFORMIN - Depletes B12 (80% of diabetics are deficient)',
                'BIRTH CONTROL - Depletes B vitamins, zinc, magnesium',
                'ALCOHOL - Depletes B vitamins, zinc, magnesium',
                'SUGAR - Depletes B vitamins, magnesium',
            ],
        },
        {
            type: 'key-point',
            content: `This is why asking about medications is CRITICAL in your intake. A client on PPIs for 10 years is almost certainly B12 and magnesium deficient. Their doctor probably never mentioned it.`,
        },
        {
            type: 'heading',
            content: 'Case Study: Susan\'s "Normal" Labs',
        },
        {
            type: 'text',
            content: `Susan, 51, retired nurse. Symptoms: Exhausted all the time. Brain fog at work. Muscle cramps every night. Mood swings, anxiety. Hair thinning. Doctor said: "Labs are normal, you're just getting older."`,
        },
        {
            type: 'list',
            content: 'Her "Normal" Labs (Conventional View):',
            items: [
                'Vitamin D: 32 ng/mL (normal range: 30-100)',
                'B12: 350 pg/mL (normal range: 200-900)',
                'Ferritin: 25 ng/mL (normal range: 12-150)',
            ],
        },
        {
            type: 'list',
            content: 'Functional View (OPTIMAL ranges):',
            items: [
                'Vitamin D: 32 → SUBOPTIMAL (want 50-70)',
                'B12: 350 → LOW END (want 500-800)',
                'Ferritin: 25 → LOW (want 50-100)',
            ],
        },
        {
            type: 'callout',
            content: `Susan was "normal" by disease standards but MISERABLE by optimization standards. After 3 months of targeted nutrition support, her energy returned, brain fog lifted, cramps stopped. Same woman, optimized nutrients, different life. This is what you'll do for clients.`,
            style: 'success',
        },
        {
            type: 'heading',
            content: 'The Nutrient Coaching Market',
        },
        {
            type: 'list',
            content: 'Why This Niche Is Lucrative:',
            items: [
                '$50+ billion supplement industry (people are confused)',
                'Doctors don\'t have time to discuss nutrition',
                'Most people waste money on wrong supplements',
                'Personalized nutrition coaching is rare',
            ],
        },
        {
            type: 'list',
            content: 'Typical Services:',
            items: [
                'Nutrient Status Review (60 min): $150-200',
                'Personalized Supplement Protocol: $75-100',
                'Monthly Optimization Check-in: $125/session',
                '3-Month Nutrient Reset Program: $800-1,200',
            ],
        },
        {
            type: 'key-point',
            content: `Graduate quote: "I help women stop wasting money on random supplements from Instagram. Instead, I create targeted protocols based on their labs and symptoms. They save money AND feel better. Win-win." - Janice T., ASI Graduate`,
        },
        {
            type: 'heading',
            content: 'Real Story: Janice, 58 - Former Pharmacy Tech',
        },
        {
            type: 'quote',
            content: `"I worked in a pharmacy for 30 years. Watched people fill prescriptions that depleted their nutrients, then fill more prescriptions for the symptoms of those deficiencies. It was a vicious cycle. Now I educate people on nutrient-drug interactions. My clients' doctors actually THANK me. They didn't learn this in med school. My niche: People on multiple medications. I help them understand what's being depleted and how to replenish. Current stats: 8 clients, $175/session, monthly income $2,800, working 12 hours/week. More fulfilling than 30 years in pharmacy." - Janice R., Florida | ASI Graduate 2024`,
        },
        {
            type: 'heading',
            content: 'Coming Up: Lab Interpretation Secrets',
        },
        {
            type: 'text',
            content: `You're now seeing health through a new lens - the nutrient lens. Next up: LAB INTERPRETATION - where you learn to read labs like a functional medicine practitioner and see what doctors miss.`,
        },
        {
            type: 'list',
            content: 'What you\'ll learn:',
            items: [
                'Why "normal" labs often mean nothing',
                'The 5 functional markers every practitioner needs',
                'How to add premium value with lab reviews',
                'Case studies to practice your new skills',
            ],
        },
    ];

    const keyTakeaways = [
        '70%+ of Americans are deficient in vitamin D and magnesium alone',
        'The Big 5: Vitamin D, Magnesium, B12, Omega-3s, Zinc',
        '"Normal" lab ranges are for disease detection, not health optimization',
        'Medications are major nutrient thieves - always ask about them',
        'You EDUCATE on nutrients; doctors DIAGNOSE and PRESCRIBE',
        'Nutrient coaching saves clients money on random supplements while improving results',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Lab Secrets: What Doctors Miss"
            lessonSubtitle="Why 'normal' labs don't mean healthy"
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
        />
    );
}
