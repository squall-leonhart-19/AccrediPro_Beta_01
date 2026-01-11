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

export function LessonMacronutrients({
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
            content: `Hey {name}! Welcome to lesson 2 🌱 Today we're diving deep into the foundation of nutrition - macronutrients! You've probably heard about proteins, fats, and carbs, but we're going to decode what they really do in your body and how to use this knowledge to transform health.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**What Are Macronutrients?**
• The three main nutrients your body needs in large amounts
• Provide energy (calories) and essential building blocks
• Each has unique roles in optimal health and healing
• Quality matters more than quantity in holistic nutrition`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Let's start with proteins - the body's building blocks. Think of protein as the construction crew that repairs and builds everything from muscles to hormones to immune cells.`,
        },
        {
            id: 4,
            type: 'system',
            content: `**Protein: The Body's Builder**
• Made up of 20 amino acids (9 are essential from food)
• Builds and repairs tissues, muscles, organs
• Creates enzymes, hormones, and neurotransmitters
• Supports immune function and blood sugar stability
• Complete proteins: animal sources, quinoa, hemp seeds
• Incomplete proteins: most plant sources (combine for completeness)`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `Which protein source would you recommend for someone following a plant-based diet to ensure complete amino acids?`,
            choices: ["Beans and rice combination", "Spirulina supplements only", "Just eating more vegetables"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Excellent! Combining complementary proteins like beans and rice creates a complete amino acid profile. Now let's talk about fats - probably the most misunderstood macronutrient!`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Fats: Essential for Vitality**
• Critical for hormone production (especially sex hormones)
• Supports brain function and nervous system health
• Enables absorption of fat-soluble vitamins (A, D, E, K)
• Provides stable, long-lasting energy
• Omega-3s reduce inflammation and support heart health
• Quality sources: avocados, nuts, seeds, olive oil, wild fish`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'coach',
            content: `Here's something that might surprise you {name} - your brain is about 60% fat! This is why quality fats are so crucial for mental clarity and mood stability.`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Carbohydrates: Your Body's Preferred Fuel**
• Primary energy source for brain and muscles
• Simple carbs: quick energy (fruits, honey)
• Complex carbs: sustained energy (whole grains, vegetables)
• Fiber supports digestive health and blood sugar balance
• Focus on nutrient-dense, unprocessed sources
• Timing matters: more carbs around activity, fewer at rest`,
            systemStyle: 'info',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `When working with a client who experiences afternoon energy crashes, which carbohydrate strategy would be most beneficial?`,
            choices: ["Eliminate all carbs after lunch", "Focus on complex carbs with protein and fat", "Increase simple sugars for quick energy"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Perfect! Balanced meals with complex carbs, protein, and healthy fats create steady blood sugar - no more afternoon crashes. This is the foundation of sustainable energy.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**The Holistic Approach to Macronutrients**
• Balance all three at each meal for optimal blood sugar
• Individual needs vary based on activity, genetics, health goals
• Quality trumps quantity - choose whole, unprocessed foods
• Consider food combining for better digestion
• Listen to your body's unique responses`,
            systemStyle: 'takeaway',
        },
        {
            id: 13,
            type: 'system',
            content: `"Let food be thy medicine and medicine be thy food. The right combination of macronutrients can transform not just energy levels, but overall vitality and wellbeing." - Holistic Nutrition Principle`,
            systemStyle: 'quote',
        },
        {
            id: 14,
            type: 'coach',
            content: `Amazing work today {name}! You now understand how to use macronutrients as powerful tools for healing and vitality. Next up in lesson 3, we'll explore micronutrients - the vitamins and minerals that make the magic happen. Get ready to become a nutrient detective! ✨`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Macronutrients"
            lessonSubtitle="Proteins, fats, and carbs decoded"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
