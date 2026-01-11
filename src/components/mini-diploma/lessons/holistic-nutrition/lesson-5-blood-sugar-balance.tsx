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

export function LessonBloodSugarBalance({
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
            content: `Hey {name}! Welcome to lesson 5 - one of my absolute favorites! 🌟 Today we're diving deep into blood sugar balance, which is honestly the secret sauce to sustained energy and healthy weight management. Ready to unlock this game-changer?`,
        },
        {
            id: 2,
            type: 'system',
            content: `**What is Blood Sugar Balance?**
• Your blood glucose levels rising and falling in a steady, controlled pattern throughout the day
• Avoiding dramatic spikes and crashes that leave you tired, hungry, and craving sugar
• Maintaining stable energy levels that support your metabolism, mood, and cognitive function
• The foundation for healthy weight management and reducing inflammation`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think about your typical day, {name}. Do you experience that 3pm energy crash? Or maybe you feel hangry between meals? These are classic signs of blood sugar imbalance - but the good news is it's totally fixable! 💪`,
        },
        {
            id: 4,
            type: 'system',
            content: `**The Blood Sugar Rollercoaster**
• **High-carb breakfast**: Causes rapid glucose spike followed by insulin surge
• **Energy crash**: Blood sugar drops below baseline 2-3 hours later
• **Cravings kick in**: Your body desperately seeks quick energy (usually sugar/refined carbs)
• **The cycle repeats**: Each spike and crash makes the next one worse
• **Long-term effects**: Insulin resistance, weight gain, increased inflammation, and fatigue`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `What's typically your biggest blood sugar challenge throughout the day?`,
            choices: ["Morning energy crashes after breakfast", "Afternoon slump and sugar cravings", "Late-night snacking and poor sleep"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Perfect insight, {name}! Identifying your personal patterns is the first step to creating lasting change. Now let's talk about the powerful strategies that will transform how you feel every single day.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**The Balanced Plate Method**
• **Protein (25-30%)**: Slows glucose absorption and increases satiety
• **Healthy fats (20-25%)**: Further slows digestion and supports hormone production
• **Complex carbs (25-30%)**: Provides steady energy without dramatic spikes
• **Non-starchy vegetables (20-25%)**: Adds fiber, nutrients, and volume
• **Timing matters**: Eat protein and fat first, then vegetables, then carbs`,
            systemStyle: 'takeaway',
        },
        {
            id: 8,
            type: 'coach',
            content: `Here's a pro tip that my clients love: always pair your carbs with protein or healthy fat. Apple with almond butter instead of just apple. Oatmeal with nuts and seeds instead of plain oats. This simple switch is incredibly powerful!`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Blood Sugar Balancing Superfoods**
• **Cinnamon**: Improves insulin sensitivity and glucose uptake
• **Apple cider vinegar**: Reduces post-meal glucose spikes by up to 30%
• **Chromium-rich foods**: Broccoli, grape juice, whole grains enhance insulin function
• **Fiber powerhouses**: Chia seeds, flaxseeds, beans slow glucose absorption
• **Healthy fats**: Avocado, nuts, olive oil stabilize blood sugar and increase satiety`,
            systemStyle: 'info',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `Which blood sugar balancing strategy feels most doable for you to start with?`,
            choices: ["Adding protein to every meal and snack", "Incorporating more fiber-rich foods", "Using herbs and spices like cinnamon daily"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Excellent choice, {name}! Remember, small consistent changes create massive results over time. Start with one strategy and build from there - your body will thank you for the steady approach.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Lifestyle Factors That Impact Blood Sugar**
• **Sleep**: Poor sleep increases cortisol and insulin resistance
• **Stress management**: Chronic stress elevates glucose levels
• **Exercise timing**: Post-meal walks reduce glucose spikes by 20-30%
• **Meal timing**: Eating every 3-4 hours prevents dramatic swings
• **Hydration**: Dehydration can raise blood glucose levels`,
            systemStyle: 'info',
        },
        {
            id: 13,
            type: 'coach',
            content: `The beauty of blood sugar balance is how quickly you'll feel the difference, {name}! Most of my clients notice improved energy within just 3-5 days of implementing these strategies. Your future self is going to feel amazing! ✨`,
        },
        {
            id: 14,
            type: 'system',
            content: `**Coming Up Next: Digestive Wellness**
In lesson 6, we'll explore how your gut health impacts every aspect of your wellbeing - from nutrient absorption to immune function to mood regulation. Get ready to discover the secrets of optimal digestion!`,
            systemStyle: 'takeaway',
        },
        {
            id: 15,
            type: 'coach',
            content: `You're doing incredible work, {name}! Blood sugar balance truly is the foundation of feeling your best. Take some time this week to experiment with these strategies and notice how your energy shifts. See you in lesson 6! 🌿`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Blood Sugar Balance"
            lessonSubtitle="The key to energy and weight management"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
