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

export function LessonHealthBehaviorChange({
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
            content: `Hey {name}! 🌟 Welcome to one of my favorite lessons - motivational interviewing! This approach is going to revolutionize how you help clients create lasting health changes. Ready to dive into some game-changing communication techniques?`,
        },
        {
            id: 2,
            type: 'system',
            content: `**What is Motivational Interviewing?**
• A collaborative, person-centered form of guiding to elicit and strengthen motivation for change
• Focuses on exploring and resolving ambivalence about behavior change
• Developed by William Miller and Stephen Rollnick
• Evidence-based approach used across healthcare settings
• Emphasizes the client's own motivation rather than external pressure`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think about it, {name} - how many times have you told someone what they 'should' do for their health, only to see them struggle with follow-through? Motivational interviewing flips this approach completely. Instead of being the expert giving advice, you become a guide helping people discover their own reasons for change.`,
        },
        {
            id: 4,
            type: 'system',
            content: `**The Four Processes of Motivational Interviewing**
• **Engaging:** Building rapport and establishing a therapeutic relationship
• **Focusing:** Developing and maintaining direction toward a specific goal
• **Evoking:** Drawing out the client's own motivations for change
• **Planning:** Developing commitment and creating an action plan`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `A client says: 'I know I should exercise, but I just can't find the time.' What's the best motivational interviewing response?`,
            choices: ["You need to make time - your health depends on it", "What matters most to you about staying healthy?", "Here's a simple 10-minute workout you can try"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Perfect! Notice how the best response explores their values rather than giving advice or pushing harder. This is the essence of motivational interviewing - we're curious about what drives them, not focused on what we think they need.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Core Skills: OARS Technique**
• **Open-ended questions:** Encourage elaboration and exploration
• **Affirmations:** Recognize client strengths and efforts
• **Reflections:** Demonstrate understanding and deepen awareness
• **Summaries:** Tie together key themes and move conversation forward`,
            systemStyle: 'takeaway',
        },
        {
            id: 8,
            type: 'coach',
            content: `The OARS technique is your toolkit, {name}. These aren't just communication skills - they're ways to create space for your clients to hear themselves think and discover their own path forward.`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Recognizing Change Talk vs. Sustain Talk**
• **Change Talk:** Statements about desire, ability, reasons, need, or commitment to change
• **Sustain Talk:** Statements supporting the status quo or reasons not to change
• **Your Role:** Respond to change talk with curiosity and reflection
• **Avoid:** Arguing with sustain talk - this creates resistance`,
            systemStyle: 'info',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `Which of these is an example of change talk?`,
            choices: ["I've tried dieting before and it never works", "My family would be proud if I got healthier", "I don't have willpower when it comes to food"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Exactly! When someone mentions their family being proud, that's change talk - they're expressing a reason that matters to them. This is gold! You want to explore this further with reflections like 'Your family's pride really matters to you.'`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Common Motivational Interviewing Pitfalls for Nurses**
• **The Expert Trap:** Jumping into problem-solving mode too quickly
• **The Assessment Trap:** Over-focusing on gathering information
• **The Premature Focus Trap:** Narrowing the conversation before building engagement
• **Remember:** Your nursing expertise is valuable, but timing is everything`,
            systemStyle: 'takeaway',
        },
        {
            id: 13,
            type: 'system',
            content: `**'Change belongs to the client. Our job is to create the conditions where change can happen naturally and authentically.'**

*- Core principle of motivational interviewing*`,
            systemStyle: 'quote',
        },
        {
            id: 14,
            type: 'coach',
            content: `This mindset shift might feel uncomfortable at first, {name}, especially coming from a nursing background where you're used to taking action and solving problems. But trust the process - when people discover their own reasons for change, they're far more likely to follow through.`,
        },
        {
            id: 15,
            type: 'coach',
            content: `Amazing work today! 🎉 You now have powerful tools to help clients move from 'I should' to 'I want to' to 'I will.' Coming up in Lesson 6, we'll explore how to design sustainable wellness programs that actually stick. You're becoming such a skilled coach!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Health Behavior Change"
            lessonSubtitle="Motivational interviewing for nurses"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
