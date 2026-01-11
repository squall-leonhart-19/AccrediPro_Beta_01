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

export function LessonNutritionFoundations({
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
            content: `Hey {name}! Welcome to Lesson 6 - Nutrition Foundations! 🍎 This is where we dive into the food basics every health coach needs to know. You're going to love how practical and actionable this content is!`,
        },
        {
            id: 2,
            type: 'system',
            content: `**The Three Macronutrients**
• **Carbohydrates**: Body's primary energy source (4 calories per gram)
• **Proteins**: Building blocks for muscles, enzymes, and hormones (4 calories per gram)
• **Fats**: Essential for hormone production and nutrient absorption (9 calories per gram)

Balance is key - your clients need all three for optimal health!`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Understanding macros is foundational, {name}, but here's what I've learned in my years of coaching - it's not just about the numbers. It's about helping your clients understand WHY they need each macronutrient.`,
        },
        {
            id: 4,
            type: 'user-choice',
            content: `A client asks: 'Should I avoid carbs to lose weight?' What's your best coaching response?`,
            choices: ["'Yes, carbs make you gain weight'", "'Carbs provide energy - let's focus on choosing quality sources'", "'Only eat carbs after workouts'"],
            showReaction: true,
        },
        {
            id: 5,
            type: 'system',
            content: `**Micronutrients Matter**
• **Vitamins**: Support immune function, energy production, and cellular repair
• **Minerals**: Essential for bone health, muscle function, and nerve transmission
• **Phytonutrients**: Plant compounds that provide antioxidant and anti-inflammatory benefits

A colorful plate usually means a nutrient-dense meal!`,
            systemStyle: 'info',
        },
        {
            id: 6,
            type: 'coach',
            content: `Here's a simple rule I teach my clients, {name}: 'Eat the rainbow!' When you fill your plate with different colored fruits and vegetables, you're naturally getting a wide variety of micronutrients. It's that simple! 🌈`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Hydration Fundamentals**
• Adults need approximately 8-10 cups (64-80 oz) of water daily
• Increase intake during exercise, hot weather, or illness
• Signs of dehydration: fatigue, headaches, dark urine, dry mouth
• Water supports digestion, nutrient transport, and temperature regulation`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'user-choice',
            content: `Which strategy would you recommend to help a client who struggles to drink enough water?`,
            choices: ["Tell them to force themselves to drink more", "Suggest they track intake and add flavor with fruit", "Recommend they only drink when thirsty"],
            showReaction: true,
        },
        {
            id: 9,
            type: 'coach',
            content: `Hydration coaching is often overlooked, but it's so impactful! I've seen clients' energy levels completely transform just by improving their water intake. Small changes, big results!`,
        },
        {
            id: 10,
            type: 'system',
            content: `**Reading Nutrition Labels**
• Start with serving size - all other numbers are based on this
• Check total calories per serving
• Look for added sugars (aim for minimal amounts)
• Prioritize foods with shorter, recognizable ingredient lists
• Focus on fiber content (aim for 3g+ per serving)`,
            systemStyle: 'takeaway',
        },
        {
            id: 11,
            type: 'coach',
            content: `Label reading is a superpower skill, {name}! When you teach your clients how to decode labels, you're giving them independence. They'll be able to make informed choices even when you're not there to guide them.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Meal Timing and Frequency**
• No single approach works for everyone
• Regular eating patterns can help stabilize blood sugar
• Eating protein within 2 hours post-workout supports recovery
• Listen to hunger and fullness cues rather than strict schedules
• Consider client's lifestyle, preferences, and health goals`,
            systemStyle: 'info',
        },
        {
            id: 13,
            type: 'coach',
            content: `Remember {name}, as a health coach, you're not prescribing specific diets - you're educating and empowering! Your role is to help clients understand these fundamentals so they can make choices that work for their unique lives.`,
        },
        {
            id: 14,
            type: 'system',
            content: `"The best diet is the one you can stick to long-term. Focus on progress, not perfection, and help your clients build sustainable habits that fit their lifestyle." - Evidence-Based Nutrition Practice`,
            systemStyle: 'quote',
        },
        {
            id: 15,
            type: 'coach',
            content: `Fantastic work completing Nutrition Foundations! 🎉 You now have the essential knowledge to guide clients toward better food choices. Up next in Lesson 7: 'Behavior Change Strategies' - where we'll explore the psychology behind lasting habit formation. You're doing amazing, {name}!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Nutrition Foundations"
            lessonSubtitle="Food basics for coaches"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
