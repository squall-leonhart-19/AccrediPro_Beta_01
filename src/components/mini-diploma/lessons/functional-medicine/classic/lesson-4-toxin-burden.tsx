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

export function ClassicLessonToxinBurden({
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
            content: `{name}, I need to share something uncomfortable with you. It might make you angry. By the time you finished your morning routine today, you were exposed to over 200 synthetic chemicals. Before breakfast. Shampoo. Toothpaste. Deodorant. Makeup. Cleaning products. Plastics. The water from your tap. We're all carrying a toxic burden. The question is: how much? This isn't paranoia. It's the explanation for why so many people feel terrible despite "doing everything right."`,
        },
        {
            type: 'heading',
            content: 'The Toxic Reality',
        },
        {
            type: 'key-point',
            content: `80,000+ synthetic chemicals in our environment. Only 200 have been tested for human safety. Average person: 200+ chemical exposures before breakfast. Newborns: 287 chemicals detected in umbilical cord blood. 50% of US buildings have mold problems.`,
        },
        {
            type: 'heading',
            content: 'Legal Clarity: Your Scope with Detox',
        },
        {
            type: 'list',
            content: 'What You CAN Do:',
            items: [
                'Educate on toxin sources in home/environment',
                'Suggest safer product alternatives',
                'Recommend foods that support natural detox',
                'Guide on lifestyle changes to reduce exposure',
                'Suggest supplements (as education, not prescription)',
            ],
        },
        {
            type: 'list',
            content: 'What Doctors Handle:',
            items: [
                'Order or interpret medical detox tests',
                'Diagnose mold illness or heavy metal toxicity',
                'Create medical detox protocols',
                'Prescribe chelation therapy',
            ],
        },
        {
            type: 'callout',
            content: `The partnership model: You educate and support. Doctors diagnose and treat. Client suspects mold issue → You support lifestyle changes → Doctor orders testing if needed → You help implement recovery protocol. This is environmental health education. It's legal in all 50 states.`,
            style: 'info',
        },
        {
            type: 'heading',
            content: 'Real Story: Christine, 46 - Former Real Estate Agent',
        },
        {
            type: 'quote',
            content: `"I got severely sick from mold in my own home. Doctors had no clue - I saw 11 specialists. When I finally figured it out, I became obsessed with environmental health. Now I specialize in helping people identify hidden toxin sources and clean up their environment. My clients: people with 'mystery' symptoms (often mold), new moms wanting to 'detox' their homes, cancer survivors reducing future risk. My numbers (18 months in): 9 clients currently, $225/session (specialized = premium), monthly $4,050. I'm not a doctor. I'm a 'toxin detective.' And people are desperate for someone like me." - Christine A., Georgia | ASI Graduate 2023`,
        },
        {
            type: 'heading',
            content: 'The 5 Major Toxin Categories',
        },
        {
            type: 'list',
            content: '1. HEAVY METALS:',
            items: [
                'Lead, mercury, arsenic, cadmium, aluminum',
                'Sources: Fish, dental fillings, old paint, water pipes, cookware',
                'Symptoms: Brain fog, fatigue, mood issues, nerve problems',
            ],
        },
        {
            type: 'list',
            content: '2. MOLD & MYCOTOXINS:',
            items: [
                'From water-damaged buildings (50% of US buildings!)',
                'Invisible and often undetected',
                'Symptoms: Fatigue, brain fog, respiratory issues, anxiety',
            ],
        },
        {
            type: 'list',
            content: '3. PESTICIDES & HERBICIDES:',
            items: [
                'Glyphosate in 80% of food supply',
                'Stored in fat tissue for years',
                'Symptoms: Gut issues, hormone disruption, fatigue',
            ],
        },
        {
            type: 'list',
            content: '4. PLASTICS & ENDOCRINE DISRUPTORS:',
            items: [
                'BPA, phthalates in containers, receipts, cosmetics',
                'Mimic hormones (especially estrogen)',
                'Symptoms: Weight gain, hormone issues, fertility problems',
            ],
        },
        {
            type: 'list',
            content: '5. HOUSEHOLD CHEMICALS:',
            items: [
                'Average home: 62 toxic chemicals',
                'Cleaning products, air fresheners, cosmetics, candles',
                'Symptoms: Headaches, respiratory issues, skin problems',
            ],
        },
        {
            type: 'heading',
            content: 'Why Most Detox Programs Are Dangerous',
        },
        {
            type: 'text',
            content: `Your liver detoxifies in 2 phases:`,
        },
        {
            type: 'list',
            content: 'PHASE 1 - Activation:',
            items: [
                'Toxins get "activated" (made water-soluble)',
                'Requires B vitamins, glutathione, antioxidants',
                'PROBLEM: Activated toxins are temporarily MORE harmful',
            ],
        },
        {
            type: 'list',
            content: 'PHASE 2 - Conjugation:',
            items: [
                'Activated toxins get "packaged" for removal',
                'Requires amino acids, sulfur compounds',
                'Toxins exit via bile, urine, sweat',
            ],
        },
        {
            type: 'callout',
            content: `THE DANGER: Most juice cleanses and "detox teas" speed up Phase 1 WITHOUT supporting Phase 2. Result: Activated toxins build up, making you feel WORSE. It's like mopping the floor while the faucet is still running. This is why clients need an educated coach - not a trendy Instagram detox.`,
            style: 'warning',
        },
        {
            type: 'heading',
            content: 'The Detox Market: Massive Opportunity',
        },
        {
            type: 'list',
            content: 'The Market:',
            items: [
                'Detox industry: $50+ BILLION globally',
                'Most programs are ineffective or dangerous',
                'Educated practitioners are RARE',
            ],
        },
        {
            type: 'list',
            content: 'Specialized Niches Within Detox:',
            items: [
                'Mold Illness Support - Clients stay 6-12 months, programs $1,500-3,000',
                'Home Environment Detox - Popular with new moms, 4-6 sessions $600-800',
                'Heavy Metal Support - Monthly programs $200-300/month ongoing',
            ],
        },
        {
            type: 'key-point',
            content: `Graduate Quote: "I did $2,800 last month from just 6 detox clients. One client has been with me 8 months for mold recovery. She refers everyone." - Michelle T., ASI Graduate`,
        },
        {
            type: 'heading',
            content: 'Real Story: Angela, 50 - Cancer Survivor',
        },
        {
            type: 'quote',
            content: `"After breast cancer at 47, I became obsessed with reducing my toxic load. When I got certified, I knew my niche: helping cancer survivors create healthier environments. It's deeply personal work. My clients cry. I cry. We're doing something meaningful. My focus: post-cancer environmental cleanup, reducing exposure for prevention, supporting detox pathways naturally. The numbers: 7 clients currently, $250/session (premium niche), monthly $3,500. Yes, oncologists refer to me. They don't have time to talk about plastics and cleaning products. I do. Cancer gave me purpose." - Angela P., California | ASI Graduate 2024`,
        },
        {
            type: 'heading',
            content: 'Your 3 Immediate Toxin Swaps',
        },
        {
            type: 'list',
            content: 'Start TODAY:',
            items: [
                'WATER - Filter your drinking water (reverse osmosis or carbon filter)',
                'FOOD STORAGE - Replace plastic containers with glass, never heat in plastic',
                'PERSONAL CARE - Check products on EWG.org Skin Deep database, swap highest-use first',
            ],
        },
        {
            type: 'callout',
            content: `This is exactly what you'll walk clients through. Start with yourself - you'll speak from experience.`,
            style: 'tip',
        },
        {
            type: 'heading',
            content: 'Coming Up: Stress & Hormones Decoded',
        },
        {
            type: 'text',
            content: `You now understand toxins better than most healthcare providers. This knowledge is genuinely valuable. Next up: STRESS & HORMONES - the burnout epidemic and why cortisol is secretly destroying your clients' health.`,
        },
        {
            type: 'list',
            content: 'What you\'ll learn:',
            items: [
                'Why 77% of workers are burned out',
                'The 3 stages of adrenal dysfunction',
                'Your next case study to solve',
                'Why burnout coaching for women 40+ is a goldmine',
            ],
        },
    ];

    const keyTakeaways = [
        '80,000+ synthetic chemicals exist, only 200 tested for safety',
        '5 toxin categories: Heavy metals, Mold, Pesticides, Plastics, Household chemicals',
        'Most detox programs are dangerous - they speed Phase 1 without supporting Phase 2',
        'You can legally educate on toxins and recommend lifestyle changes',
        'The detox industry is $50B+ but most practitioners are uneducated',
        'Specialized niches (mold, cancer survivors) command $200-250/session',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Toxin Reality"
            lessonSubtitle="The $50B detox market needs educated coaches"
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
