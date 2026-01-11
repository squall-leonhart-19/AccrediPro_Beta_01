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

export function LessonMotivationalInterviewing({
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
            content: `Welcome to lesson 5, {name}! 🌟 Today we're diving into one of the most powerful tools in your health coaching toolkit: motivational interviewing. This technique is all about evoking your clients' own intrinsic motivation for change.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**What is Motivational Interviewing?**
• A collaborative conversation style that strengthens a person's motivation for change
• Focuses on exploring and resolving ambivalence about behavior change
• Emphasizes the client's own reasons for change rather than external pressure
• Based on the principle that people are more likely to follow through on changes they articulate themselves`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think about it, {name} - when someone tells you what to do versus when you discover your own reasons for doing something, which feels more compelling? That's the magic of motivational interviewing! 💡`,
        },
        {
            id: 4,
            type: 'system',
            content: `**The Four Processes of Motivational Interviewing**
• **Engaging**: Building rapport and establishing a collaborative relationship
• **Focusing**: Developing and maintaining direction toward a specific goal
• **Evoking**: Drawing out the client's own motivations and commitment to change
• **Planning**: Developing a concrete plan for change when the client is ready`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `Your client says: 'I know I should eat better, but I just don't have time to cook healthy meals.' What's the best motivational interviewing response?`,
            choices: ["You should try meal prepping on Sundays - it really works!", "Tell me more about what eating better would mean to you personally.", "What if I gave you some quick 15-minute healthy recipes?"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Great choice! Notice how the best response explores their personal motivations rather than jumping straight to solutions. This is where the real transformation happens.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Key Techniques for Evoking Motivation**
• **Open-ended questions**: 'What would need to change for you to feel healthier?'
• **Reflective listening**: 'It sounds like your energy levels are really important to you'
• **Exploring values**: 'How does this goal connect to what matters most to you?'
• **Change talk**: Listen for and reinforce statements about desire, ability, reasons, and need for change`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'coach',
            content: `Remember {name}, your role isn't to convince or persuade. You're helping clients discover their own compelling reasons for change. When they hear themselves articulating these reasons, that's when real commitment happens!`,
        },
        {
            id: 9,
            type: 'system',
            content: `**The Spirit of Motivational Interviewing**
• **Partnership**: Working with, not on, your client
• **Acceptance**: Respecting client autonomy and their right to choose
• **Compassion**: Actively promoting client welfare and prioritizing their needs
• **Evocation**: Drawing out rather than imposing ideas and solutions`,
            systemStyle: 'takeaway',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `A client keeps saying 'I can't' when discussing exercise goals. Using motivational interviewing, what should you focus on?`,
            choices: ["Challenging their limiting beliefs directly", "Exploring past times when they overcame challenges", "Providing evidence that they actually can do it"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Exactly! By exploring their past successes, you help them recognize their own capability and resilience. This builds confidence from within rather than from external reassurance.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Common Pitfalls to Avoid**
• The 'righting reflex' - jumping in to fix problems immediately
• Asking too many questions in a row without reflecting
• Arguing for change when the client expresses resistance
• Providing advice before understanding the client's perspective
• Focusing on problems rather than exploring motivations for solutions`,
            systemStyle: 'info',
        },
        {
            id: 13,
            type: 'system',
            content: `**'The curious paradox is that when I accept myself just as I am, then I can change.' - Carl Rogers**

This quote captures the essence of motivational interviewing - creating a safe space for clients to explore change without judgment.`,
            systemStyle: 'quote',
        },
        {
            id: 14,
            type: 'coach',
            content: `You're building such valuable skills, {name}! In our next lesson, we'll explore goal setting strategies that work hand-in-hand with motivational interviewing. You'll learn how to help clients create goals that truly resonate with their intrinsic motivations. Keep practicing these techniques! 🚀`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Motivational Interviewing"
            lessonSubtitle="Evoking intrinsic motivation"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
