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

export function LessonGutNutritionConnection({
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
            content: `Hey {name}! Welcome to Lesson 6 - one of my absolute favorites! 🌟 Today we're diving deep into the gut-nutrition connection. Your digestive system is like the control center for your entire health, and understanding how it works will transform how you approach nutrition.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**The Digestive Journey: From Mouth to Microbiome**
• **Mechanical breakdown**: Chewing and stomach churning break food into smaller pieces
• **Chemical breakdown**: Enzymes and acids transform nutrients into absorbable forms
• **Absorption**: Small intestine absorbs 90% of nutrients through intestinal villi
• **Elimination**: Large intestine processes waste and absorbs remaining water
• **Microbiome support**: Beneficial bacteria aid digestion and produce vitamins`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think of your digestive system as a sophisticated factory with multiple departments working together. When one department isn't functioning well, it affects the entire operation. That's why digestive health is so crucial for overall wellness!`,
        },
        {
            id: 4,
            type: 'system',
            content: `**Key Digestive Players and Their Roles**
• **Stomach acid (HCl)**: Activates protein digestion and mineral absorption
• **Pancreatic enzymes**: Break down proteins, fats, and carbohydrates
• **Bile**: Emulsifies fats for proper absorption
• **Intestinal enzymes**: Complete final breakdown of nutrients
• **Gut bacteria**: Ferment fiber, produce vitamins K and B12, support immunity`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `What's the most common sign that someone might have compromised digestive function?`,
            choices: ["Frequent bloating and gas after meals", "Occasional heartburn", "Feeling tired after lunch"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Exactly! Bloating and gas are your body's way of saying 'something's not quite right here.' It often indicates poor enzyme function, food sensitivities, or an imbalanced microbiome. These symptoms are clues, not just inconveniences to ignore.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**The Gut-Brain-Nutrition Triangle**
• **Vagus nerve**: Connects brain and gut, influencing digestion based on stress levels
• **Neurotransmitter production**: 90% of serotonin is made in the gut
• **Stress response**: Chronic stress reduces digestive enzyme production
• **Food mood connection**: Poor digestion affects nutrient availability for brain function
• **Circadian rhythm**: Eating timing affects digestive efficiency`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'coach',
            content: `This is where holistic nutrition really shines, {name}. We can't separate what's happening in the gut from what's happening in the mind. When we're stressed, our digestion suffers. When our digestion is poor, our mood and energy suffer. It's all connected!`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Optimizing Nutrient Absorption**
• **Mindful eating**: Chew thoroughly and eat without distractions
• **Proper food combining**: Avoid conflicting digestive requirements
• **Digestive fire support**: Warm foods, ginger, and bitter herbs enhance digestion
• **Timing matters**: Allow 3-4 hours between meals for proper digestion
• **Hydration balance**: Drink water between meals, not during`,
            systemStyle: 'takeaway',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `Which approach would be most effective for improving a client's nutrient absorption?`,
            choices: ["Adding digestive enzyme supplements immediately", "Starting with mindful eating practices and food timing", "Eliminating all potentially problematic foods"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Perfect choice! While supplements have their place, starting with foundational practices like mindful eating gives us the biggest impact. It's gentle, sustainable, and often resolves issues naturally. Plus, it empowers your clients with lifelong skills.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Supporting Gut Health Through Nutrition**
• **Prebiotic foods**: Feed beneficial bacteria (garlic, onions, asparagus, green bananas)
• **Probiotic foods**: Add beneficial bacteria (fermented vegetables, kefir, miso)
• **Anti-inflammatory foods**: Reduce gut inflammation (turmeric, ginger, leafy greens)
• **Glutamine-rich foods**: Repair intestinal lining (bone broth, cabbage, eggs)
• **Fiber variety**: Different types feed different beneficial bacteria strains`,
            systemStyle: 'info',
        },
        {
            id: 13,
            type: 'coach',
            content: `Remember {name}, healing the gut takes time and patience. Small, consistent changes compound into major improvements. Your role is to guide clients through this process with understanding and realistic expectations.`,
        },
        {
            id: 14,
            type: 'system',
            content: `**"The gut is not like Las Vegas. What happens in the gut does not stay in the gut."** - Alessio Fasano, MD

Gut health influences immune function, mental health, skin conditions, energy levels, and chronic disease risk. When we heal the gut, we often see improvements in seemingly unrelated health issues.`,
            systemStyle: 'quote',
        },
        {
            id: 15,
            type: 'coach',
            content: `What an incredible journey we've taken today! 🎉 You now understand the intricate dance between digestion and nutrition. In our next lesson, we'll explore how to identify and address food sensitivities - a crucial skill that builds perfectly on today's foundation. You're becoming such a knowledgeable practitioner, {name}!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Gut-Nutrition Connection"
            lessonSubtitle="Digestion and nutrient absorption"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
