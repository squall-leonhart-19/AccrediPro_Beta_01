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

export function ClassicLessonGutFoundation({
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
            content: `{name}, welcome back! Before we dive in, I want to tell you about my friend Karen. She spent 8 YEARS going to doctors for bloating, brain fog, and fatigue. She saw gastroenterologists, neurologists, endocrinologists. Thousands of dollars in tests. Every doctor said the same thing: "Your tests are normal. Maybe try antidepressants?" Then she worked with a functional medicine practitioner who looked at her GUT. 3 months later? Bloating gone. Brain fog lifted. Energy back. No medications. The practitioner charged $200/session and had a 6-month waitlist. That practitioner could be YOU.`,
        },
        {
            type: 'heading',
            content: 'The Gut Truth Most Doctors Miss',
        },
        {
            type: 'key-point',
            content: `Your gut is NOT just for digestion. It's your Second Brain (more neurons than your spinal cord), your Immune Headquarters (70-80% of immune cells live here), your Mood Factory (95% of serotonin made here), and your Hormone Regulator (affects thyroid, estrogen, cortisol). When the gut breaks, EVERYTHING breaks. This is why gut health specialists are booked solid.`,
        },
        {
            type: 'heading',
            content: '"But Sarah, I Didn\'t Study Biology..."',
        },
        {
            type: 'text',
            content: `Here's the thing: You don't need to be a scientist. You need to understand PATTERNS. When I started, I didn't know what "dysbiosis" meant either. But I learned the patterns:`,
        },
        {
            type: 'list',
            content: 'Pattern Recognition:',
            items: [
                'Bloating after meals? = Gut issue',
                'Brain fog + fatigue? = Gut issue',
                'Skin problems? = Often gut issue',
                'Mood swings? = Gut-brain connection',
            ],
        },
        {
            type: 'callout',
            content: `You're not diagnosing diseases. You're recognizing patterns and guiding people to solutions. A graduate told me: "I felt like an imposter at first. Then I helped my first client eliminate her 10-year bloating problem in 6 weeks. Now I know I belong here."`,
            style: 'tip',
        },
        {
            type: 'heading',
            content: 'Real Story: Rachel, 44 - Former HR Manager',
        },
        {
            type: 'quote',
            content: `"Gut health became my niche by accident. I fixed my own IBS after doctors said I'd have it forever. When I got certified, I specialized in gut health because I KNEW it so well. Here's what my practice looks like now: 12 gut health clients, $175/session, 2 sessions/month each. Monthly recurring: $4,200. Waitlist of 8 people. My clients call me their 'gut guru.' I don't have a medical degree. I have lived experience and the right training. The certification gave me the credibility. My results keep clients coming." - Rachel B., Arizona | ASI Graduate 2023`,
        },
        {
            type: 'heading',
            content: 'The 3 Pillars of Gut Health',
        },
        {
            type: 'text',
            content: `This framework makes everything simple to understand and explain to clients:`,
        },
        {
            type: 'list',
            content: '1. THE BARRIER (The Wall):',
            items: [
                'One-cell-thick lining protecting you',
                'Decides what enters bloodstream',
                'When damaged → "Leaky Gut" → inflammation everywhere',
                'Signs: food sensitivities, joint pain, skin issues',
            ],
        },
        {
            type: 'list',
            content: '2. THE MICROBIOME (The Army):',
            items: [
                'Trillions of bacteria living in your gut',
                'Good vs bad bacteria balance',
                'Affects digestion, immunity, mood, weight',
                'Signs of imbalance: bloating, gas, irregular bowels',
            ],
        },
        {
            type: 'list',
            content: '3. THE MOTILITY (The Movement):',
            items: [
                'How food moves through your system',
                'Too slow → constipation, toxin buildup',
                'Too fast → diarrhea, nutrient loss',
                'Signs: irregular bathroom habits, discomfort',
            ],
        },
        {
            type: 'callout',
            content: `When you understand these 3 pillars, you can help almost anyone with gut issues.`,
            style: 'success',
        },
        {
            type: 'heading',
            content: 'Leaky Gut: The Simple Explanation',
        },
        {
            type: 'text',
            content: `Let me explain leaky gut in a way you could tell your grandmother - and she'd understand perfectly. Imagine your gut lining is a window screen:`,
        },
        {
            type: 'list',
            content: 'Healthy Screen:',
            items: [
                'Tiny holes let air through (nutrients)',
                'Keeps bugs out (toxins, undigested food)',
            ],
        },
        {
            type: 'list',
            content: 'Damaged Screen (Leaky Gut):',
            items: [
                'Holes get bigger',
                'Bugs get in (bad stuff enters bloodstream)',
                'Immune system panics',
                'Inflammation spreads EVERYWHERE',
            ],
        },
        {
            type: 'list',
            content: 'What Damages the Screen:',
            items: [
                'Gluten (for many people)',
                'Chronic stress',
                'NSAIDs (ibuprofen, aspirin)',
                'Alcohol',
                'Poor diet',
            ],
        },
        {
            type: 'key-point',
            content: `This is why someone with leaky gut might have joint pain, brain fog, skin issues, AND digestive problems. The inflammation goes everywhere. You'll explain this to clients all the time. Simple, visual, memorable.`,
        },
        {
            type: 'heading',
            content: 'The 5R Protocol - Your Secret Weapon',
        },
        {
            type: 'text',
            content: `This is the industry-standard framework for gut healing that every functional medicine practitioner uses:`,
        },
        {
            type: 'list',
            content: 'The 5R Protocol:',
            items: [
                '1. REMOVE - Eliminate triggers (inflammatory foods, pathogens, stressors)',
                '2. REPLACE - Add what\'s missing (digestive enzymes, HCl, bile support)',
                '3. REINOCULATE - Restore good bacteria (probiotics, prebiotics, fermented foods)',
                '4. REPAIR - Heal the gut lining (L-glutamine, zinc, collagen, bone broth)',
                '5. REBALANCE - Address lifestyle (sleep, stress management, movement)',
            ],
        },
        {
            type: 'callout',
            content: `This protocol has been used successfully on millions of people. You'll use it constantly in your practice.`,
            style: 'tip',
        },
        {
            type: 'heading',
            content: 'Your Role vs. Doctor\'s Role',
        },
        {
            type: 'list',
            content: 'What YOU CAN Do:',
            items: [
                'Educate on the 5R protocol',
                'Suggest dietary changes',
                'Recommend supplements (not prescribe)',
                'Guide on lifestyle modifications',
                'Support accountability',
                'Help interpret (not diagnose) symptoms',
            ],
        },
        {
            type: 'list',
            content: 'What DOCTORS Do:',
            items: [
                'Order and interpret medical tests',
                'Diagnose conditions like SIBO, IBD, Crohn\'s',
                'Prescribe medications',
                'Treat acute medical conditions',
            ],
        },
        {
            type: 'key-point',
            content: `How it works together: Client suspects gut issue → You educate and support → They work with doctor for testing → You help implement healing protocol. This is why doctors LOVE working with health coaches. We extend their capacity.`,
        },
        {
            type: 'heading',
            content: 'Why Gut Health = Recurring Revenue',
        },
        {
            type: 'text',
            content: `Gut healing takes TIME. That means ongoing client relationships:`,
        },
        {
            type: 'list',
            content: 'Typical Gut Health Client Journey:',
            items: [
                'Month 1-2: Remove phase + initial support - 4 sessions @ $175 = $700',
                'Month 3-4: Reinoculate + Repair - 4 sessions @ $175 = $700',
                'Month 5-6: Optimize + Maintain - 2 sessions @ $175 = $350',
                'TOTAL per client: $1,750 over 6 months',
            ],
        },
        {
            type: 'callout',
            content: `Multiply: 5 clients = $8,750 over 6 months. 10 clients = $17,500 over 6 months. And they REFER friends because they finally feel better. One graduate said: "My gut health clients stay an average of 5 months. That's $875/client without chasing new business."`,
            style: 'success',
        },
        {
            type: 'heading',
            content: 'Real Story: Diane, 51 - Career Changer',
        },
        {
            type: 'quote',
            content: `"I was a dental hygienist for 22 years. My own gut issues started after a round of antibiotics. Doctors had no answers. I healed myself using functional medicine principles, then got certified to help others. My specialty now? Post-antibiotic gut recovery. It's incredibly specific, and clients FIND me because of it. Current stats: 10 active clients, $200/session (specialized niche = higher rates), working 15 hours/week. Last month: $4,000. I never thought I'd leave dental hygiene. Now I can't imagine going back." - Diane F., Florida | ASI Graduate 2024`,
        },
        {
            type: 'heading',
            content: 'Coming Up: The Inflammation Blueprint',
        },
        {
            type: 'text',
            content: `You now understand gut health better than 90% of people - including many doctors. Seriously. In the next lesson, we're diving into INFLAMMATION - the silent killer that connects to almost every chronic disease.`,
        },
        {
            type: 'list',
            content: 'What you\'ll learn:',
            items: [
                'Why inflammation is behind EVERY chronic disease',
                'The 6 hidden triggers most people ignore',
                'Your first case study challenge',
                'How anti-inflammatory coaching is a $2.3B market',
            ],
        },
    ];

    const keyTakeaways = [
        '70-80% of your immune system lives in your gut - fix the gut, fix most health issues',
        'The 3 Pillars: Barrier (the wall), Microbiome (the army), Motility (the movement)',
        'Leaky gut = damaged barrier = inflammation spreading everywhere',
        'The 5R Protocol: Remove, Replace, Reinoculate, Repair, Rebalance',
        'You educate and support; doctors diagnose and prescribe - you work together',
        'Gut health clients stay 4-6 months = $1,750+ per client in recurring revenue',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Gut Connection"
            lessonSubtitle="The #1 specialty that keeps clients coming back"
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
