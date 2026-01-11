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

export function LessonPersonalizedNutrition({
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
            content: `Hey {name}! Welcome to one of my favorite lessons - Personalized Nutrition! 🌟 Today we're diving deep into bio-individuality and how to create truly customized protocols for your clients. This is where the art meets the science!`,
        },
        {
            id: 2,
            type: 'system',
            content: `**Understanding Bio-Individuality**
• Every person has unique nutritional needs based on genetics, lifestyle, and health history
• Factors include metabolic type, food sensitivities, cultural background, and personal preferences
• One-size-fits-all approaches often fail because they ignore individual differences
• Successful protocols must account for physical, emotional, and lifestyle factors`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think about it - would you give the same nutrition plan to a 25-year-old athlete and a 55-year-old executive with diabetes? Of course not! That's bio-individuality in action.`,
        },
        {
            id: 4,
            type: 'system',
            content: `**Key Assessment Areas for Personalization**
• **Metabolic Type**: Fast vs. slow oxidizers, protein vs. carb types
• **Digestive Health**: Gut microbiome, enzyme production, absorption capacity
• **Stress Response**: Adrenal function, cortisol patterns, stress triggers
• **Inflammatory Markers**: Food sensitivities, autoimmune tendencies
• **Lifestyle Factors**: Sleep patterns, exercise habits, work schedule
• **Cultural & Personal Preferences**: Food traditions, ethical choices, taste preferences`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `When starting with a new client, what should be your FIRST priority in assessment?`,
            choices: ["Comprehensive lab testing", "Understanding their health history and current symptoms", "Analyzing their current diet"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Excellent! While labs are valuable, starting with their story gives you the context needed to interpret everything else. Remember, you're treating a person, not just test results.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Creating Effective Client Protocols**
• **Phase 1**: Foundation building (gut health, basic nutrition, hydration)
• **Phase 2**: Targeted interventions (specific supplements, therapeutic foods)
• **Phase 3**: Optimization and maintenance (fine-tuning, lifestyle integration)
• Start with 2-3 simple changes maximum to ensure compliance
• Build on successes progressively rather than overwhelming clients
• Include both nutrition and lifestyle recommendations for holistic results`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'coach',
            content: `I've learned that sustainable change happens in small steps. Clients who try to overhaul everything at once usually burn out within weeks. Slow and steady wins every time! 🎯`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Common Personalization Factors**
• **Genetic Variations**: MTHFR mutations, histamine intolerance, celiac predisposition
• **Hormonal Patterns**: Thyroid function, insulin sensitivity, reproductive hormones
• **Age-Related Needs**: Growing children, pregnant women, elderly considerations
• **Activity Levels**: Sedentary workers vs. endurance athletes vs. strength trainers
• **Health Conditions**: Diabetes, cardiovascular disease, autoimmune disorders
• **Medication Interactions**: Nutrient depletions, timing considerations`,
            systemStyle: 'takeaway',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `A client reports afternoon energy crashes and sugar cravings. What's your first nutritional strategy?`,
            choices: ["Recommend chromium supplements", "Assess breakfast composition and meal timing", "Suggest eliminating all sugars"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Perfect thinking! Blood sugar stability starts with proper meal composition and timing. Supplements and restrictions come later once we understand the foundation.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Monitoring and Adjusting Protocols**
• Schedule regular check-ins (weekly initially, then bi-weekly/monthly)
• Track both objective measures (weight, energy, sleep) and subjective feelings
• Be prepared to modify based on client response and life changes
• Document what works and what doesn't for future reference
• Celebrate small wins to maintain motivation
• Know when to refer to other practitioners for additional support`,
            systemStyle: 'info',
        },
        {
            id: 13,
            type: 'system',
            content: `**"The goal of personalized nutrition is not perfection, but progress that fits seamlessly into each client's unique life circumstances."**

- Dr. Mark Hyman`,
            systemStyle: 'quote',
        },
        {
            id: 14,
            type: 'coach',
            content: `You're becoming a true nutrition detective, {name}! The ability to see patterns, ask the right questions, and create personalized solutions is what separates good practitioners from great ones.`,
        },
        {
            id: 15,
            type: 'coach',
            content: `Next up in Lesson 8, we're exploring Special Populations - pregnancy, pediatrics, and aging. You'll learn how to modify your approach for life's different stages. Keep up the amazing work! 🌱`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Personalized Nutrition"
            lessonSubtitle="Bio-individuality and client protocols"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
