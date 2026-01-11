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

export function LessonStressAndLifestyle({
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
            content: `Hey {name}! Welcome to lesson 7 where we dive deep into the powerful connection between stress and lifestyle. 🧠 Today we're exploring mind-body approaches that can transform how your clients handle stress and improve their overall wellbeing.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**The Mind-Body Connection in Stress Management**
• Stress affects both mental and physical health simultaneously
• Chronic stress can lead to inflammation, weakened immunity, and hormonal imbalances
• Mind-body practices activate the parasympathetic nervous system
• These approaches address root causes, not just symptoms
• Regular practice creates lasting neuroplastic changes in the brain`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `The beautiful thing about mind-body approaches is that they're accessible to everyone, regardless of fitness level or background. Let's explore some evidence-based techniques you can confidently recommend to clients.`,
        },
        {
            id: 4,
            type: 'system',
            content: `**Core Mind-Body Stress Reduction Techniques**
• **Mindfulness meditation**: Increases awareness and reduces stress reactivity
• **Deep breathing exercises**: Activates vagus nerve and calms nervous system
• **Progressive muscle relaxation**: Releases physical tension and promotes awareness
• **Yoga and tai chi**: Combine movement, breath, and mindfulness
• **Visualization and guided imagery**: Engages imagination for healing responses
• **Body scanning**: Develops somatic awareness and tension release`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `A client tells you they've tried meditation but 'can't stop their thoughts.' What's your best response?`,
            choices: ["Suggest they're not trying hard enough and need more discipline", "Explain that noticing thoughts IS meditation - the goal isn't to stop thinking", "Recommend they try a different stress management technique instead"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Exactly! One of the biggest misconceptions about meditation is that we need to empty our minds completely. The practice is actually about developing a different relationship with our thoughts - observing them without judgment.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Implementing Breathwork for Stress Relief**
• **4-7-8 breathing**: Inhale 4, hold 7, exhale 8 counts for relaxation
• **Box breathing**: Equal counts for inhale, hold, exhale, hold
• **Belly breathing**: Focuses on diaphragmatic breathing vs. shallow chest breathing
• **Coherent breathing**: 5-6 breaths per minute for optimal heart rate variability
• Start with 5-10 minutes daily and gradually increase duration`,
            systemStyle: 'takeaway',
        },
        {
            id: 8,
            type: 'coach',
            content: `Breathwork is one of my favorite tools because it's always available - no equipment needed! Your clients can use these techniques anywhere, anytime they feel stress rising.`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Creating a Stress-Resilient Lifestyle**
• Establish consistent sleep and wake times
• Incorporate regular movement that feels enjoyable
• Practice boundaries with technology and social media
• Build in micro-recovery moments throughout the day
• Cultivate supportive relationships and community connections
• Engage in activities that promote flow states and joy`,
            systemStyle: 'info',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `Which lifestyle factor has the most immediate impact on stress resilience?`,
            choices: ["Getting 8+ hours of sleep consistently", "Exercising for 60+ minutes daily", "Eliminating all sources of stress"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Sleep is absolutely foundational! When we're well-rested, our stress response is more regulated, our decision-making improves, and we have better emotional resilience. Quality sleep is like a reset button for our nervous system.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Helping Clients Build Sustainable Practices**
• Start small with 2-5 minute daily practices
• Link new habits to existing routines (habit stacking)
• Focus on consistency over perfection
• Encourage experimentation to find what resonates
• Track mood and energy alongside practice frequency
• Celebrate small wins and progress`,
            systemStyle: 'takeaway',
        },
        {
            id: 13,
            type: 'coach',
            content: `Remember, sustainable change happens gradually. Help your clients find practices they actually enjoy - this isn't about adding more stress to reduce stress! 😊`,
        },
        {
            id: 14,
            type: 'system',
            content: `"The greatest weapon against stress is our ability to choose one thought over another." - William James

Mind-body approaches give us the tools to exercise this choice consciously and skillfully.`,
            systemStyle: 'quote',
        },
        {
            id: 15,
            type: 'coach',
            content: `Fantastic work today, {name}! You now have a toolkit of evidence-based mind-body approaches to help clients transform their stress response. Next up in lesson 8, we'll explore how to build sustainable healthy habits that stick. You're doing amazing! 🌟`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Stress & Lifestyle"
            lessonSubtitle="Mind-body approaches"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
