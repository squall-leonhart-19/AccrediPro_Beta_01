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

export function LessonDigestiveEnzymesAndHcl({
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
            content: `Hey {name}! Welcome to lesson 6 - we're diving deep into the chemistry of digestion today! 🧪 You've learned about the gut microbiome, now let's explore the powerful enzymes and acids that break down your food.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**What Are Digestive Enzymes?**
• Specialized proteins that break down food into absorbable nutrients
• Each enzyme targets specific macronutrients (proteins, fats, carbs)
• Produced by salivary glands, stomach, pancreas, and small intestine
• Essential for proper nutrient absorption and gut health`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think of digestive enzymes as tiny molecular scissors, each designed to cut specific bonds in your food. Without them, even the healthiest meal would just pass through your system unused!`,
        },
        {
            id: 4,
            type: 'system',
            content: `**The Three Main Enzyme Categories**
• **Proteases**: Break down proteins into amino acids (pepsin, trypsin)
• **Lipases**: Break down fats into fatty acids and glycerol
• **Amylases**: Break down carbohydrates into simple sugars
• **Lactase**: Specifically breaks down lactose (milk sugar)`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `Which digestive enzyme would be most important for someone eating a high-protein meal like grilled chicken?`,
            choices: ["Amylase", "Protease", "Lipase"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Exactly right! Proteases are crucial for protein digestion. Now let's talk about your stomach's secret weapon - hydrochloric acid (HCl).`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Hydrochloric Acid (HCl) Functions**
• Creates acidic environment (pH 1.5-3.5) for protein digestion
• Activates pepsinogen into pepsin (main stomach enzyme)
• Kills harmful bacteria and pathogens in food
• Enhances absorption of minerals like iron, zinc, and B12
• Signals pancreas to release digestive enzymes`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'coach',
            content: `Your stomach acid is incredibly powerful - strong enough to dissolve metal! But sometimes our HCl production decreases with age, stress, or certain medications.`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Signs of Low Digestive Enzymes or HCl**
• Bloating and gas after meals
• Feeling overly full after eating
• Undigested food in stool
• Frequent heartburn or acid reflux
• Nutrient deficiencies despite good diet
• Food sensitivities or allergies`,
            systemStyle: 'takeaway',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `What's the most effective way to support natural enzyme production?`,
            choices: ["Eat processed foods quickly", "Chew food thoroughly and eat mindfully", "Drink lots of water during meals"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Perfect! Proper chewing and mindful eating are foundational. When you chew thoroughly, you're not just breaking down food mechanically - you're also triggering enzyme release throughout your digestive system.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Natural Ways to Support Digestive Enzymes**
• Chew food thoroughly (20-30 chews per bite)
• Eat enzyme-rich foods (pineapple, papaya, fermented foods)
• Manage stress levels to support HCl production
• Avoid drinking large amounts of liquid with meals
• Consider digestive bitters before meals
• Maintain adequate zinc levels for enzyme production`,
            systemStyle: 'takeaway',
        },
        {
            id: 13,
            type: 'coach',
            content: `Remember {name}, your digestive system is incredibly sophisticated! Sometimes it just needs a little support through lifestyle changes rather than always reaching for supplements.`,
        },
        {
            id: 14,
            type: 'system',
            content: `**"The digestive system is the foundation of health. When we properly break down and absorb nutrients, every cell in our body benefits."**
*- Functional Medicine Principle*`,
            systemStyle: 'quote',
        },
        {
            id: 15,
            type: 'coach',
            content: `Amazing work today! 🎉 You now understand the chemical processes that transform food into fuel for your body. Next up in lesson 7, we'll explore the gut-brain connection - prepare to be amazed by how your gut literally talks to your brain!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Digestive Enzymes & HCl"
            lessonSubtitle="The chemistry of proper digestion"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
