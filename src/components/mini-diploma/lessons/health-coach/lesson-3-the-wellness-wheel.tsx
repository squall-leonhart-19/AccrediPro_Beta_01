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

export function LessonTheWellnessWheel({
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
            content: `Hey {name}! 🌟 Welcome to lesson 3 - one of my absolute favorites! Today we're diving into the Wellness Wheel, which is going to become your go-to tool for holistic health assessments. Think of it as your roadmap to understanding how all aspects of wellness connect.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**What is the Wellness Wheel?**
• A visual assessment tool that maps 8 key dimensions of health
• Shows interconnected relationships between different wellness areas
• Helps identify strengths and areas needing attention
• Provides a baseline for tracking progress over time
• Creates a holistic view rather than focusing on isolated health issues`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `The beauty of the Wellness Wheel is that it shows your clients (and you!) that health isn't just about diet and exercise. When someone struggles with physical health, we might discover the real issue is in their emotional or social wellness. It's all connected!`,
        },
        {
            id: 4,
            type: 'system',
            content: `**The 8 Dimensions of Wellness**
• **Physical**: Exercise, nutrition, sleep, medical care
• **Emotional**: Self-awareness, stress management, emotional expression
• **Social**: Relationships, communication, community connections
• **Intellectual**: Learning, creativity, problem-solving, mental stimulation
• **Spiritual**: Purpose, values, meaning, connection to something greater
• **Environmental**: Personal spaces, nature connection, safety
• **Occupational**: Career satisfaction, work-life balance, professional growth
• **Financial**: Money management, financial security, budgeting skills`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `Which dimension do you think most people overlook when thinking about their health?`,
            choices: ["Environmental wellness", "Financial wellness", "Spiritual wellness"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Great insight! You're absolutely right that many people don't realize how much their environment and financial stress impact their overall health. This is exactly why the Wellness Wheel is so powerful - it opens up these conversations.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**How to Use the Wellness Wheel**
• Have clients rate each dimension from 1-10 (1 = needs major attention, 10 = thriving)
• Plot scores on the wheel to create a visual representation
• Look for patterns: Are scores clustered? Any major gaps?
• Identify the lowest 2-3 areas as primary focus points
• Discuss how dimensions might be affecting each other
• Reassess every 3-6 months to track progress`,
            systemStyle: 'takeaway',
        },
        {
            id: 8,
            type: 'coach',
            content: `Here's a pro tip: Don't try to fix everything at once! When I work with clients, we typically focus on 1-2 dimensions that will create the biggest positive ripple effect across other areas.`,
        },
        {
            id: 9,
            type: 'user-choice',
            content: `A client scores high in most areas but very low (3/10) in social wellness. What would be your first coaching approach?`,
            choices: ["Immediately suggest joining social groups", "Explore what social wellness means to them personally", "Focus on their high-scoring areas first"],
            showReaction: true,
        },
        {
            id: 10,
            type: 'coach',
            content: `Perfect! Always start with understanding. What social wellness means to an introvert versus an extrovert can be completely different. Our job is to help them define it for themselves, not impose our assumptions.`,
        },
        {
            id: 11,
            type: 'system',
            content: `**Common Wellness Wheel Insights**
• **Low physical + low emotional**: Often indicates chronic stress or burnout
• **High occupational + low social/spiritual**: May suggest workaholic tendencies
• **Low environmental + low emotional**: Could point to living/work situation issues
• **Balanced but all mid-range scores**: May indicate playing it safe, avoiding growth
• **Extreme highs and lows**: Often shows areas of hyperfocus and neglect`,
            systemStyle: 'info',
        },
        {
            id: 12,
            type: 'system',
            content: `"The Wellness Wheel reminds us that true health isn't about perfection in one area, but about finding dynamic balance across all dimensions of our lives. When we strengthen one spoke, the entire wheel becomes more stable." - Dr. Bill Hettler, Wellness Pioneer`,
            systemStyle: 'quote',
        },
        {
            id: 13,
            type: 'coach',
            content: `I love how this tool gives both you and your clients such clarity! It takes the guesswork out of where to focus and helps people see that small improvements in one area often create unexpected benefits in others.`,
        },
        {
            id: 14,
            type: 'coach',
            content: `Coming up in lesson 4, we're going to learn about 'Motivational Interviewing' - the art of helping clients find their own motivation for change. You'll discover how to ask the right questions that spark real transformation. Can't wait to share these game-changing techniques with you! 💪`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Wellness Wheel"
            lessonSubtitle="Holistic health assessment"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
