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

export function LessonCoreCoachingSkills({
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
            content: `Hey {name}! 🌟 Welcome to one of my favorite lessons - Core Coaching Skills! Today we're diving deep into the foundational skills that will transform how you connect with your clients: active listening and asking powerful questions. These aren't just techniques - they're the heart of meaningful coaching relationships.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**What is Active Listening?**
• Full attention to the speaker without planning your response
• Listening for emotions, values, and underlying beliefs
• Observing non-verbal cues like tone, pace, and body language
• Reflecting back what you hear to confirm understanding
• Creating a safe space for clients to explore their thoughts`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think about the last time someone REALLY listened to you, {name}. How did that feel? That's the gift you'll be giving your nursing colleagues when you master active listening. It's more than just hearing words - it's about creating space for transformation.`,
        },
        {
            id: 4,
            type: 'system',
            content: `**The Three Levels of Listening**
• **Level 1 - Internal Listening:** Focused on your own thoughts and reactions
• **Level 2 - Focused Listening:** Complete attention on the client's words and emotions
• **Level 3 - Global Listening:** Aware of energy, intuition, and what's not being said
• **Goal:** Practice moving from Level 1 to Levels 2 and 3 during coaching conversations`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `A nurse tells you: 'I'm fine, just tired from my shift.' But their voice sounds flat and they're avoiding eye contact. What's your best response as their coach?`,
            choices: ["'That's good that you're fine. Let's talk about time management.'", "'I hear you saying you're fine, and I'm noticing something in your voice. What's really going on?'", "'You should get more sleep. How many hours did you work?'"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Beautiful! That's Level 3 listening in action - noticing the disconnect between words and energy. Now let's explore how powerful questions can help your clients discover their own answers and insights.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Characteristics of Powerful Questions**
• Open-ended (cannot be answered with yes/no)
• Thought-provoking and create pause for reflection
• Focus on the client's agenda, not your curiosity
• Invite exploration of values, beliefs, and possibilities
• Often begin with 'What...' 'How...' or 'When...'`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'system',
            content: `**Powerful Questions for Nurse Clients**
• 'What would feeling fulfilled in your nursing career look like?'
• 'How do you want to show up differently in your workplace?'
• 'What's possible if you prioritized your own wellbeing?'
• 'When have you felt most energized and engaged at work?'
• 'What would you do if you knew you couldn't fail?'`,
            systemStyle: 'takeaway',
        },
        {
            id: 9,
            type: 'coach',
            content: `Notice how these questions invite deep reflection rather than quick answers? The magic happens in the pause after you ask them. Give your clients space to think and feel into their responses.`,
        },
        {
            id: 10,
            type: 'user-choice',
            content: `Your client says: 'I hate my job but I can't leave because I need the money.' What's the most powerful follow-up question?`,
            choices: ["'Have you looked for other jobs with similar pay?'", "'What specifically do you hate about your current position?'", "'If money wasn't a factor, what would you choose to do?'"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'system',
            content: `**Common Listening Blocks to Avoid**
• **Judging:** Making assumptions about what's right or wrong
• **Problem-solving:** Jumping to solutions before fully understanding
• **Relating:** Connecting everything back to your own experience
• **Rehearsing:** Planning what you'll say next while they're talking
• **Filtering:** Only hearing what confirms your existing beliefs`,
            systemStyle: 'info',
        },
        {
            id: 12,
            type: 'coach',
            content: `Remember {name}, as nurses, we're trained to assess and solve problems quickly. In coaching, we slow down and trust that our clients have their own wisdom. Your job is to help them access it through your presence and curiosity.`,
        },
        {
            id: 13,
            type: 'system',
            content: `**Practice Exercise**
• Find a colleague or friend to practice with this week
• Set a timer for 10 minutes
• Have them share something they're working through
• Focus only on listening and asking powerful questions
• Notice your urge to give advice - and resist it!
• Debrief: How did it feel to be truly heard?`,
            systemStyle: 'takeaway',
        },
        {
            id: 14,
            type: 'coach',
            content: `You're building such important skills, {name}! 💫 Next up in Lesson 5, we'll explore how to help your clients set meaningful goals and create accountability structures that actually work. These core skills you're learning will be the foundation for everything else we cover.`,
        },
        {
            id: 15,
            type: 'coach',
            content: `Take some time this week to practice these skills - even in casual conversations. You'll be amazed at how differently people respond when they feel truly heard. See you in the next lesson!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Core Coaching Skills"
            lessonSubtitle="Active listening, powerful questions"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
