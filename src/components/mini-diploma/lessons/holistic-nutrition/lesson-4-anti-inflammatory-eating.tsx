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

export function LessonAntiInflammatoryEating({
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
            content: `Hey {name}! 🌱 Welcome to one of my favorite lessons - Anti-Inflammatory Eating! This is where nutrition becomes truly therapeutic. Today we'll explore how the foods we choose can either fuel inflammation or help our bodies heal naturally.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**Understanding Inflammation**
• Acute inflammation is protective and necessary for healing
• Chronic inflammation drives disease processes like arthritis, heart disease, and diabetes
• Diet plays a crucial role in either promoting or reducing inflammatory responses
• Common symptoms include joint pain, fatigue, digestive issues, and skin problems`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think of inflammation as your body's fire alarm system. Sometimes we need that alarm, but when it's constantly going off due to poor food choices, it becomes destructive rather than protective.`,
        },
        {
            id: 4,
            type: 'system',
            content: `**Foods That Fuel Inflammation**
• Refined sugars and high-fructose corn syrup
• Trans fats and heavily processed oils
• Refined grains and white flour products
• Processed meats with nitrates and preservatives
• Excessive alcohol and caffeine
• Foods high in artificial additives and preservatives`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `Which of these inflammatory foods do you think is most challenging to eliminate from your diet?`,
            choices: ["Refined sugars and sweet treats", "Processed foods and convenience items", "Refined grains like white bread and pasta"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `That's honest self-reflection, {name}! Remember, this isn't about perfection - it's about awareness and making gradual improvements. Even small changes can significantly impact inflammation levels.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Powerful Anti-Inflammatory Foods**
• Fatty fish rich in omega-3s (salmon, sardines, mackerel)
• Colorful berries and cherries high in antioxidants
• Leafy greens like spinach, kale, and arugula
• Turmeric, ginger, and garlic with potent anti-inflammatory compounds
• Nuts and seeds, especially walnuts and flaxseeds
• Extra virgin olive oil and avocados`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'coach',
            content: `Notice how these healing foods are mostly whole, unprocessed options? Nature has provided us with incredible medicine in the form of food - we just need to choose it more often!`,
        },
        {
            id: 9,
            type: 'system',
            content: `**The Rainbow Approach**
• Red: Tomatoes, red peppers, and watermelon (lycopene)
• Orange/Yellow: Sweet potatoes, carrots, and citrus (beta-carotene)
• Green: Broccoli, spinach, and green tea (chlorophyll and catechins)
• Blue/Purple: Blueberries, eggplant, and red cabbage (anthocyanins)
• White: Garlic, onions, and cauliflower (allicin and quercetin)`,
            systemStyle: 'takeaway',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `Which color group do you eat the least of in your current diet?`,
            choices: ["Blue/Purple foods like berries", "Green vegetables and leafy greens", "Orange/Yellow vegetables"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Perfect awareness, {name}! This gives you a clear target for improvement. Try adding just one serving of that color group daily this week.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Creating Anti-Inflammatory Meals**
• Start each meal with vegetables (aim for 50% of your plate)
• Include healthy fats like olive oil, nuts, or avocado
• Choose lean proteins, especially fatty fish 2-3 times per week
• Add anti-inflammatory spices like turmeric, ginger, and cinnamon
• Stay hydrated with water and herbal teas
• Practice mindful eating to reduce stress-induced inflammation`,
            systemStyle: 'takeaway',
        },
        {
            id: 13,
            type: 'system',
            content: `"Let food be thy medicine and medicine be thy food." - Hippocrates

This ancient wisdom reminds us that every meal is an opportunity to either promote healing or contribute to disease.`,
            systemStyle: 'quote',
        },
        {
            id: 14,
            type: 'coach',
            content: `You're building such valuable knowledge, {name}! 🎯 Next up in Lesson 5, we'll dive into Gut Health and Microbiome - the foundation of all health. Get ready to discover how your digestive system impacts everything from mood to immunity!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Anti-Inflammatory Eating"
            lessonSubtitle="Foods that heal vs. foods that harm"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
