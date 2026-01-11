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

export function LessonTheCoachingMindset({
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
            content: `Hey {name}! 🌟 Welcome to one of the most transformational lessons in this program. Today we're diving deep into the coaching mindset - and honestly, this shift from 'fixing' to 'facilitating' is what separates great nurse life coaches from the rest.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**The Fundamental Shift: From Nurse to Coach**
• Traditional nursing: Diagnose problems and provide solutions
• Coaching approach: Ask powerful questions and guide self-discovery
• Nursing mindset: 'I need to fix this person'
• Coaching mindset: 'This person has the answers within them'
• Focus shifts from giving advice to empowering choices`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `I know this might feel uncomfortable at first, {name}. As nurses, we're trained to jump in and solve problems quickly. But in coaching, our superpower lies in restraint and curiosity.`,
        },
        {
            id: 4,
            type: 'user-choice',
            content: `When a client says 'I'm so stressed at work, what should I do?', what's your instinct as a nurse?`,
            choices: ["Give them stress management techniques immediately", "Share what worked for you in similar situations", "Ask them what they think might help"],
            showReaction: true,
        },
        {
            id: 5,
            type: 'system',
            content: `**Core Principles of the Coaching Mindset**
• **Curiosity over certainty**: Stay genuinely curious about their experience
• **Questions over answers**: Lead with inquiry, not instruction
• **Process over outcome**: Trust the coaching process, not just results
• **Partnership over hierarchy**: You're walking alongside, not above
• **Empowerment over dependency**: Build their capacity, not reliance on you`,
            systemStyle: 'takeaway',
        },
        {
            id: 6,
            type: 'coach',
            content: `Think of yourself as a skilled guide on a hiking trail, {name}. You know the terrain, but your client chooses the pace and discovers the views for themselves. 🥾`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Practical Mindset Shifts in Action**
• Instead of 'You should try...' → 'What options are you considering?'
• Instead of 'That won't work because...' → 'What concerns do you have about that approach?'
• Instead of 'I had a similar situation...' → 'What's most important to you in this situation?'
• Instead of 'The research shows...' → 'What does your experience tell you?'`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'user-choice',
            content: `A client keeps making the same mistake repeatedly. What's the most coaching-focused response?`,
            choices: ["Point out the pattern and explain why it's problematic", "Ask 'What are you noticing about this situation?'", "Give them a step-by-step plan to break the cycle"],
            showReaction: true,
        },
        {
            id: 9,
            type: 'coach',
            content: `Beautiful! The coaching mindset requires us to trust that our clients are naturally creative, resourceful, and whole. This doesn't mean we don't bring our nursing wisdom - we just deliver it differently.`,
        },
        {
            id: 10,
            type: 'system',
            content: `**When Nursing Knowledge Enhances Coaching**
• Use clinical insights to inform better questions
• Recognize health patterns to guide exploration
• Apply emotional intelligence from patient care
• Leverage communication skills for deeper listening
• Draw on crisis management for challenging moments
• Maintain professional boundaries naturally`,
            systemStyle: 'info',
        },
        {
            id: 11,
            type: 'coach',
            content: `Your nursing background is actually a huge advantage, {name}! You already have incredible listening skills, empathy, and the ability to hold space for people in difficult moments.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Common Mindset Challenges for Nurse Coaches**
• **The advice trap**: Jumping to solutions too quickly
• **The rescue reflex**: Feeling responsible for client outcomes
• **Knowledge pressure**: Feeling you must have all the answers
• **Pace anxiety**: Wanting faster progress than natural timing allows
• **Boundary confusion**: Mixing clinical assessment with coaching inquiry`,
            systemStyle: 'takeaway',
        },
        {
            id: 13,
            type: 'system',
            content: `"The coach's job is not to provide answers but to ask the questions that help the client find their own answers. In this way, the client develops capacity, confidence, and ownership of their growth." - International Coach Federation`,
            systemStyle: 'quote',
        },
        {
            id: 14,
            type: 'coach',
            content: `Remember {name}, adopting the coaching mindset is a practice, not a perfection. Be patient with yourself as you make this beautiful shift from healer to empowerer.`,
        },
        {
            id: 15,
            type: 'coach',
            content: `Up next in Lesson 3, we'll dive into 'Building Rapport and Trust' - the foundation skills that make everything else possible. You're doing amazing work here! 💪`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Coaching Mindset"
            lessonSubtitle="Shifting from fixing to facilitating"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
