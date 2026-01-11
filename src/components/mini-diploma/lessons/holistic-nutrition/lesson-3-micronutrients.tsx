"use client";

import { LessonBase, Message } from "../shared/lesson-base";

interface LessonProps {
    lessonNumber: number;
    totalLessons?: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

export function LessonMicronutrients({
    lessonNumber,
    totalLessons = 9,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const messages: Message[] = [
        {
            id: 1,
            type: 'coach',
            content: `Hey {name}! Welcome to lesson 3 - we're diving deep into micronutrients today! 🌟 While they may be 'micro' in name, these vitamins and minerals play absolutely massive roles in your health. Ready to unlock the secrets of optimal nutrition?`,
        },
        {
            id: 2,
            type: 'system',
            content: `**What Are Micronutrients?**
• Essential nutrients needed in small amounts for proper body function
• Include vitamins (fat-soluble and water-soluble) and minerals
• Cannot be produced by the body in sufficient quantities
• Must be obtained through diet or supplementation
• Act as cofactors in enzymatic reactions and cellular processes`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think of micronutrients as the spark plugs of your body's engine, {name}. Without them, even the best macronutrients can't do their job effectively. Let's start with the vitamin families!`,
        },
        {
            id: 4,
            type: 'system',
            content: `**Fat-Soluble Vitamins (A, D, E, K)**
• Stored in body fat and liver for extended periods
• Require dietary fats for proper absorption
• Vitamin A: Vision, immune function, skin health
• Vitamin D: Bone health, immune support, hormone regulation
• Vitamin E: Antioxidant protection, cell membrane integrity
• Vitamin K: Blood clotting, bone metabolism`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `Which fat-soluble vitamin is often called the 'sunshine vitamin' and why?`,
            choices: ["Vitamin A - because it brightens your skin", "Vitamin D - because it's synthesized when skin is exposed to sunlight", "Vitamin E - because it protects against sun damage"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Exactly right! Vitamin D synthesis through sunlight exposure is one of nature's most elegant systems. Now let's explore the water-soluble vitamins - they work quite differently.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Water-Soluble Vitamins (B-Complex & C)**
• Not stored long-term; excess amounts excreted in urine
• Need regular replenishment through diet
• B1 (Thiamine): Energy metabolism, nervous system
• B12 (Cobalamin): Red blood cell formation, neurological function
• Folate: DNA synthesis, cellular division
• Vitamin C: Collagen synthesis, immune support, antioxidant`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'coach',
            content: `Here's something fascinating, {name} - because water-soluble vitamins aren't stored, you need them daily. This is why consistent, nutrient-dense eating patterns matter so much in holistic nutrition!`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Essential Minerals: The Body's Building Blocks**
• Macrominerals: Calcium, phosphorus, magnesium, sodium, potassium
• Trace minerals: Iron, zinc, copper, selenium, iodine
• Structural roles: Bone and teeth formation (calcium, phosphorus)
• Functional roles: Enzyme activation, hormone production
• Electrolyte balance: Sodium, potassium for fluid regulation`,
            systemStyle: 'info',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `A client reports fatigue and poor wound healing. Which mineral deficiency might you suspect first?`,
            choices: ["Iron - supports oxygen transport and energy", "Zinc - crucial for immune function and tissue repair", "Calcium - needed for muscle contraction"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Great clinical thinking! Zinc deficiency often shows up as poor wound healing and compromised immunity. This is why we assess symptoms holistically rather than in isolation.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Micronutrient Synergy & Absorption**
• Nutrients work together - iron absorption enhanced by vitamin C
• Calcium and magnesium need proper ratios for optimal function
• Vitamin D enhances calcium absorption
• Some nutrients compete - zinc and copper, iron and zinc
• Food form often superior to isolated supplements`,
            systemStyle: 'takeaway',
        },
        {
            id: 13,
            type: 'coach',
            content: `This is where holistic nutrition truly shines, {name}. We're not just looking at individual nutrients, but understanding how they dance together in the body to create vibrant health.`,
        },
        {
            id: 14,
            type: 'system',
            content: `**Identifying Deficiency Patterns**
• Fatigue: Often iron, B12, or magnesium related
• Poor immunity: Consider zinc, vitamin C, or vitamin D
• Skin issues: May indicate vitamin A, E, or essential fatty acids
• Mood changes: B-vitamins, magnesium, or vitamin D deficiencies
• Always consider whole-person assessment, not just symptoms`,
            systemStyle: 'takeaway',
        },
        {
            id: 15,
            type: 'coach',
            content: `Amazing work today! 💪 You now understand how these tiny but mighty nutrients orchestrate optimal health. Next up in lesson 4, we'll explore phytonutrients - the colorful compounds that make plants true medicine. You're building such a strong foundation, {name}!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Micronutrients"
            lessonSubtitle="Vitamins and minerals for optimal health"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
