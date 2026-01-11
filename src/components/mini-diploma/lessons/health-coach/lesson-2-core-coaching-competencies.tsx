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

export function LessonCoreCoachingCompetencies({
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
            content: `Hey {name}! 🌟 Welcome to lesson 2! Today we're diving deep into the core coaching competencies that truly transform lives. These aren't just theoretical concepts - they're the practical skills that will make you an exceptional health coach.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**Active Listening: The Foundation of Great Coaching**
• Listen to understand, not to respond
• Pay attention to what's NOT being said
• Use reflective listening to confirm understanding
• Avoid interrupting or rushing to solutions
• Notice tone, pace, and emotional undertones`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Active listening is like being a detective, {name}. Your clients will tell you everything you need to know - but often between the lines. The magic happens when they feel truly heard.`,
        },
        {
            id: 4,
            type: 'user-choice',
            content: `Your client says 'I'm fine with my diet' but their tone sounds frustrated. What's your best response?`,
            choices: ["Great! Let's move on to exercise then", "Tell me more about what 'fine' looks like for you", "You don't sound convinced - what's really going on?"],
            showReaction: true,
        },
        {
            id: 5,
            type: 'system',
            content: `**Powerful Questioning Techniques**
• Open-ended questions that spark reflection
• 'What' and 'How' questions vs. 'Why' questions
• Questions that explore values and motivations
• Scaling questions (1-10) for clarity
• Future-focused questions that inspire action`,
            systemStyle: 'info',
        },
        {
            id: 6,
            type: 'coach',
            content: `The right question at the right moment can create breakthrough insights, {name}. It's not about having all the answers - it's about asking the questions that help your clients find their own answers.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Creating Awareness and Insight**
• Help clients see patterns in their behavior
• Reflect back what you observe without judgment
• Use metaphors and analogies for clarity
• Help connect actions to deeper values
• Celebrate moments of self-discovery`,
            systemStyle: 'takeaway',
        },
        {
            id: 8,
            type: 'user-choice',
            content: `A client keeps making excuses for not exercising. Which approach creates the most awareness?`,
            choices: ["Point out that they're making excuses", "Ask: 'What would need to be different for movement to feel easier?'", "Suggest they just need more willpower"],
            showReaction: true,
        },
        {
            id: 9,
            type: 'coach',
            content: `Beautiful! Questions that explore possibilities rather than problems help clients shift from stuck to solution-focused thinking.`,
        },
        {
            id: 10,
            type: 'system',
            content: `**Goal Setting and Action Planning**
• SMART goals with emotional connection
• Break large goals into micro-steps
• Identify potential obstacles upfront
• Create accountability structures
• Celebrate progress, not just outcomes`,
            systemStyle: 'info',
        },
        {
            id: 11,
            type: 'coach',
            content: `Goals without action are just dreams, {name}. But action without the right support system often leads to frustration. Your job is to help create that bridge.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**The Coaching Presence**
• Be fully present and engaged
• Maintain confident, calm energy
• Trust the coaching process
• Hold space for difficult emotions
• Model the behavior you want to see`,
            systemStyle: 'quote',
        },
        {
            id: 13,
            type: 'coach',
            content: `Your presence is just as important as your words, {name}. Clients can feel when you truly believe in their ability to change. That belief becomes contagious! 💫`,
        },
        {
            id: 14,
            type: 'system',
            content: `**Key Takeaway**
• Master coaches combine all these competencies fluidly
• Practice each skill individually, then integrate
• Your authentic care amplifies every technique
• Continuous learning and self-reflection are essential`,
            systemStyle: 'takeaway',
        },
        {
            id: 15,
            type: 'coach',
            content: `Amazing work today, {name}! You now have the core competencies that separate good coaches from transformational ones. Next up in lesson 3, we'll explore how to conduct powerful initial consultations that set the stage for success. Get ready to put these skills into action!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Core Coaching Competencies"
            lessonSubtitle="Skills that transform lives"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
