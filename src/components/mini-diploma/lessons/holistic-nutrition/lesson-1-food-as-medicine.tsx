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

export function LessonFoodAsMedicine({
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
            content: `Hey {name}! 🌱 Welcome to your first lesson in Holistic Nutrition! I'm so excited you're here. Today we're diving into one of the most powerful concepts in health - Food as Medicine. This isn't just about eating your veggies (though that's important too!). We're talking about understanding how every bite you take can either heal or harm your body.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**The Food as Medicine Philosophy**
• Food contains bioactive compounds that directly influence cellular function
• Nutrients act as co-factors for enzymatic processes and hormone production
• Phytonutrients in plants provide anti-inflammatory and antioxidant protection
• The timing, combination, and quality of foods affects therapeutic outcomes
• Traditional healing systems have used food medicinally for thousands of years`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think about this for a moment - your great-grandmother probably knew that chicken soup helped with colds, or that ginger settled an upset stomach. She was practicing food as medicine without even knowing the science behind it!`,
        },
        {
            id: 4,
            type: 'user-choice',
            content: `What draws you most to the concept of food as medicine?`,
            choices: ["I want to reduce my reliance on medications", "I'm curious about preventing disease naturally", "I want to optimize my energy and performance"],
            showReaction: true,
        },
        {
            id: 5,
            type: 'system',
            content: `**Key Therapeutic Food Categories**
• **Anti-inflammatory foods**: Fatty fish, turmeric, leafy greens, berries
• **Adaptogenic foods**: Mushrooms, ashwagandha, holy basil, ginseng
• **Digestive healing foods**: Bone broth, fermented vegetables, ginger, fennel
• **Detoxification supporters**: Cruciferous vegetables, cilantro, milk thistle
• **Blood sugar regulators**: Cinnamon, chromium-rich foods, fiber-dense vegetables`,
            systemStyle: 'info',
        },
        {
            id: 6,
            type: 'coach',
            content: `The beautiful thing about food as medicine is that it's accessible to everyone. You don't need expensive supplements or complicated protocols - your kitchen can become your pharmacy! 🏠`,
        },
        {
            id: 7,
            type: 'system',
            content: `**The Difference: Holistic vs. Conventional Nutrition**
• **Holistic**: Views food in context of whole person - mind, body, spirit
• **Conventional**: Often focuses on isolated nutrients and calorie counting
• **Holistic**: Considers bio-individuality and constitutional types
• **Conventional**: Uses one-size-fits-all dietary guidelines
• **Holistic**: Emphasizes food quality, sourcing, and preparation methods
• **Conventional**: May prioritize macronutrient ratios over food quality`,
            systemStyle: 'takeaway',
        },
        {
            id: 8,
            type: 'coach',
            content: `Here's something most people don't realize - the same food can have completely different effects on two different people. That's why cookie-cutter diets often fail. We need to understand YOUR unique body.`,
        },
        {
            id: 9,
            type: 'user-choice',
            content: `When you think about your relationship with food, which feels most true for you right now?`,
            choices: ["I eat mostly for convenience and taste", "I try to eat healthy but feel confused by conflicting advice", "I'm already mindful about food choices but want deeper knowledge"],
            showReaction: true,
        },
        {
            id: 10,
            type: 'system',
            content: `**The Science Behind Food as Medicine**
• **Epigenetics**: Foods can turn genes on or off, influencing disease expression
• **Microbiome**: Different foods feed different bacterial strains in your gut
• **Inflammation pathways**: Certain foods trigger or reduce inflammatory cascades
• **Nutrient synergy**: Combinations of foods enhance absorption and effectiveness
• **Circadian rhythms**: Meal timing affects hormone production and metabolism`,
            systemStyle: 'info',
        },
        {
            id: 11,
            type: 'system',
            content: `"Let food be thy medicine and medicine be thy food." - Hippocrates

This ancient wisdom is now backed by modern science. We're not just feeding our bodies - we're programming our cells for optimal function.`,
            systemStyle: 'quote',
        },
        {
            id: 12,
            type: 'coach',
            content: `I want you to start thinking about food differently from this moment forward. Every meal is an opportunity to nourish, heal, and energize your body. It's not about perfection - it's about intention and awareness.`,
        },
        {
            id: 13,
            type: 'system',
            content: `**Your Food as Medicine Toolkit Starts With:**
• **Mindful observation**: How do different foods make you feel?
• **Quality focus**: Choose organic, local, and minimally processed when possible
• **Color variety**: Different colored foods provide different phytonutrients
• **Seasonal eating**: Align your food choices with natural cycles
• **Preparation methods**: Raw, steamed, fermented - each offers unique benefits`,
            systemStyle: 'takeaway',
        },
        {
            id: 14,
            type: 'coach',
            content: `Amazing work completing your first lesson, {name}! 🎉 You've just laid the foundation for everything we'll build together. Next up in Lesson 2, we're exploring 'Understanding Bio-Individuality' - why your nutritional needs are as unique as your fingerprint. Get ready to discover what makes YOUR body thrive!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Food as Medicine"
            lessonSubtitle="The foundation of holistic nutrition"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
