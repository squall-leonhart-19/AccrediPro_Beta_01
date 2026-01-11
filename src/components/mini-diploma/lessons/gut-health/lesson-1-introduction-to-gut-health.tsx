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

export function LessonIntroductionToGutHealth({
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
            content: `Hey {name}! Welcome to your gut health certification journey! 🌟 I'm Coach Sarah, and I'm so excited to guide you through this transformative program. Did you know that your gut is literally called your 'second brain'? Today we're diving into why gut health is the foundation of everything - your energy, mood, immunity, and so much more!`,
        },
        {
            id: 2,
            type: 'system',
            content: `**What Is Gut Health?**
• The balance of microorganisms living in your digestive tract
• Includes bacteria, viruses, fungi, and other microbes (collectively called the microbiome)
• A healthy gut contains approximately 100 trillion microorganisms
• The ratio of beneficial to harmful bacteria determines gut health status`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think about it this way, {name} - your gut is like a bustling city with trillions of residents! When the good guys outnumber the troublemakers, everything runs smoothly. But when that balance gets disrupted... well, that's when we start seeing problems show up everywhere in the body.`,
        },
        {
            id: 4,
            type: 'user-choice',
            content: `Which of these symptoms might surprise you as being connected to gut health?`,
            choices: ["Anxiety and depression", "Skin problems like acne", "Both of the above"],
            showReaction: true,
        },
        {
            id: 5,
            type: 'coach',
            content: `Amazing insight, {name}! Most people are shocked to learn just how far-reaching gut health impacts are. The gut-brain connection is so strong that 90% of your body's serotonin (the 'happy hormone') is actually made in your gut, not your brain! 🧠`,
        },
        {
            id: 6,
            type: 'system',
            content: `**The Gut-Body Connection: Key Systems Affected**
• **Immune System**: 70-80% of immune cells are located in the gut
• **Nervous System**: Direct communication via the vagus nerve
• **Endocrine System**: Gut bacteria influence hormone production
• **Cardiovascular System**: Gut health affects inflammation and heart health
• **Skin Health**: The gut-skin axis influences conditions like eczema and acne`,
            systemStyle: 'info',
        },
        {
            id: 7,
            type: 'coach',
            content: `This is why I always tell my clients that when we heal the gut, we're not just fixing digestive issues - we're potentially transforming their entire health picture. It's pretty incredible when you think about it!`,
        },
        {
            id: 8,
            type: 'system',
            content: `**Signs of an Unhealthy Gut**
• Frequent digestive upset (bloating, gas, constipation, diarrhea)
• Chronic fatigue and low energy
• Mood disorders (anxiety, depression, irritability)
• Frequent infections or autoimmune conditions
• Food intolerances and sensitivities
• Skin issues (acne, eczema, rosacea)
• Difficulty maintaining healthy weight
• Sugar and processed food cravings`,
            systemStyle: 'takeaway',
        },
        {
            id: 9,
            type: 'user-choice',
            content: `Looking at that list, how many of those signs do you currently experience?`,
            choices: ["1-2 symptoms", "3-5 symptoms", "6+ symptoms"],
            showReaction: true,
        },
        {
            id: 10,
            type: 'coach',
            content: `No judgment here, {name}! The good news is that no matter where you're starting from, the gut is incredibly resilient and responds beautifully to the right support. I've seen people transform their health in ways they never thought possible by focusing on gut healing first.`,
        },
        {
            id: 11,
            type: 'system',
            content: `**The Modern Gut Health Crisis**
• Standard American Diet (SAD) feeds harmful bacteria
• Overuse of antibiotics disrupts microbiome balance
• Chronic stress damages gut lining
• Environmental toxins and processed foods create inflammation
• Sedentary lifestyle reduces beneficial bacteria diversity
• Result: 74% of Americans experience digestive discomfort`,
            systemStyle: 'info',
        },
        {
            id: 12,
            type: 'coach',
            content: `Here's what I want you to remember, {name}: your current gut health status isn't permanent! Every meal is an opportunity to feed the good bacteria. Every stress management technique helps heal your gut lining. Small, consistent changes create massive transformations over time.`,
        },
        {
            id: 13,
            type: 'system',
            content: `**Key Takeaway**
• The gut microbiome influences virtually every aspect of health
• Gut imbalances manifest as symptoms throughout the body
• Modern lifestyle factors have created widespread gut dysfunction
• The good news: the gut can be healed and rebalanced with proper protocols`,
            systemStyle: 'takeaway',
        },
        {
            id: 14,
            type: 'coach',
            content: `You've just taken the first step in understanding why gut health is so crucial! In our next lesson, we're going to dive deep into the fascinating world of the microbiome - you'll learn about the specific bacteria that live in your gut and how they impact everything from your weight to your mood. Get ready to be amazed! 🎯`,
        },
        {
            id: 15,
            type: 'coach',
            content: `Great work completing lesson 1, {name}! Take a moment to appreciate that you're investing in the most foundational aspect of your health. Your future self will thank you for this journey. Ready to explore the incredible world of gut bacteria next?`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Introduction to Gut Health"
            lessonSubtitle="Why the gut is the foundation of all health"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
