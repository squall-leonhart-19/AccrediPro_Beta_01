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

export function LessonYourNextStep({
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
            content: `Hey {name}! 🎉 Congratulations on making it to our final lesson! You've covered so much ground in holistic nutrition, and now it's time to talk about your next steps toward becoming a certified Holistic Nutrition Specialist.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**Your Journey So Far**
• Mastered foundational nutrition principles and macronutrients
• Explored the healing power of micronutrients and whole foods
• Learned to assess nutritional needs and create personalized plans
• Discovered how to address common health concerns through nutrition
• Developed skills in meal planning and lifestyle integration`,
            systemStyle: 'takeaway',
        },
        {
            id: 3,
            type: 'coach',
            content: `Before we dive into certification details, I'm curious about your goals. What's driving your passion for holistic nutrition?`,
        },
        {
            id: 4,
            type: 'user-choice',
            content: `What's your primary motivation for pursuing holistic nutrition certification?`,
            choices: ["Help family and friends with better nutrition", "Start a nutrition consulting practice", "Enhance my current health/wellness career"],
            showReaction: true,
        },
        {
            id: 5,
            type: 'coach',
            content: `That's fantastic! Whatever your motivation, you're on the right path. Let me walk you through what becoming a certified Holistic Nutrition Specialist actually involves.`,
        },
        {
            id: 6,
            type: 'system',
            content: `**Certification Requirements Overview**
• Complete all 9 core curriculum lessons with 80% or higher
• Pass comprehensive final assessment covering all modules
• Submit case study analysis demonstrating practical application
• Complete 20 hours of documented practice consultations
• Maintain continuing education credits annually`,
            systemStyle: 'info',
        },
        {
            id: 7,
            type: 'system',
            content: `**Your Scope of Practice as a Holistic Nutrition Specialist**
• Provide nutritional education and wellness coaching
• Create personalized meal plans and lifestyle recommendations
• Conduct nutritional assessments and food sensitivity guidance
• Offer supplement and whole food recommendations
• Support clients in developing sustainable healthy habits
• **Note**: Cannot diagnose medical conditions or prescribe medications`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'coach',
            content: `Understanding your scope of practice is crucial for building trust with clients and staying within ethical boundaries. Now, let's talk about the practical side of starting your practice.`,
        },
        {
            id: 9,
            type: 'user-choice',
            content: `Which aspect of building your nutrition practice feels most challenging right now?`,
            choices: ["Finding and attracting ideal clients", "Setting appropriate pricing and packages", "Building confidence in my consultation skills"],
            showReaction: true,
        },
        {
            id: 10,
            type: 'system',
            content: `**Building Your Holistic Nutrition Practice**
• **Client Acquisition**: Start with friends/family, leverage social media, partner with local wellness providers
• **Pricing Strategy**: Research local market rates, offer package deals, consider sliding scale for accessibility
• **Professional Development**: Join nutrition associations, attend workshops, find a mentor
• **Business Essentials**: Obtain liability insurance, create intake forms, establish clear boundaries`,
            systemStyle: 'info',
        },
        {
            id: 11,
            type: 'coach',
            content: `Remember {name}, every expert was once a beginner. Your certification is just the beginning of a lifelong learning journey in holistic nutrition.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Continuing Your Education**
• Stay current with nutrition research and emerging trends
• Specialize in areas like sports nutrition, digestive health, or hormonal balance
• Attend conferences and workshops in functional medicine
• Consider additional certifications in related fields
• Build a network with other holistic health practitioners`,
            systemStyle: 'takeaway',
        },
        {
            id: 13,
            type: 'coach',
            content: `You've shown incredible dedication throughout this program. Your next step is to take your final assessment, and then you'll be ready to start making a real difference in people's lives through holistic nutrition! 🌱`,
        },
        {
            id: 14,
            type: 'system',
            content: `**"The groundwork for all happiness is good health, and nutrition is the foundation of good health."** - Dr. Asa Andrew`,
            systemStyle: 'quote',
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Your Next Step"
            lessonSubtitle="Becoming a certified Holistic Nutrition Specialist"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
