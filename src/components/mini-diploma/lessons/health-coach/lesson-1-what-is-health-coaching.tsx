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

export function LessonWhatIsHealthCoaching({
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
            content: `Hey {name}! Welcome to your first lesson in health coaching! 🎉 I'm so excited to guide you through this transformative journey. Today we're diving into the fundamentals - what health coaching really is and why it's such a powerful tool for helping people change their lives.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**What is Health Coaching?**
• A client-centered approach that helps individuals make sustainable lifestyle changes
• Combines evidence-based health knowledge with proven coaching methodologies
• Focuses on the whole person, not just symptoms or isolated behaviors
• Empowers clients to become the expert of their own health journey`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think of health coaching as being a GPS for someone's wellness journey, {name}. We don't drive the car - our clients do. But we help them navigate the route, avoid roadblocks, and stay motivated when the path gets challenging.`,
        },
        {
            id: 4,
            type: 'user-choice',
            content: `What do you think is the PRIMARY role of a health coach?`,
            choices: ["To give clients detailed meal plans and exercise routines", "To guide clients in discovering their own solutions and motivation", "To diagnose health problems and prescribe treatments"],
            showReaction: true,
        },
        {
            id: 5,
            type: 'system',
            content: `**The Science Behind Behavior Change**
• Only 3% of adults follow the four basic healthy lifestyle practices
• Knowledge alone doesn't create lasting change - it requires behavioral shifts
• The brain's neuroplasticity allows us to form new habits at any age
• Sustainable change happens gradually, not through dramatic overhauls`,
            systemStyle: 'info',
        },
        {
            id: 6,
            type: 'coach',
            content: `Here's what I find fascinating, {name} - most people already know WHAT they should do for their health. The magic happens when we help them discover HOW to actually do it in a way that fits their real life.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Core Principles of Health Coaching**
• **Client-Centered:** The client sets the agenda and goals
• **Strengths-Based:** Focus on what's working, not what's broken
• **Action-Oriented:** Every session moves toward concrete next steps
• **Holistic:** Address physical, mental, emotional, and social wellness
• **Non-Judgmental:** Create a safe space for honest exploration`,
            systemStyle: 'takeaway',
        },
        {
            id: 8,
            type: 'coach',
            content: `I want you to remember this: as health coaches, we're not the heroes of our clients' stories. They are. We're more like wise mentors who help them unlock their own inner wisdom and strength. 💪`,
        },
        {
            id: 9,
            type: 'user-choice',
            content: `Which approach is most effective for creating lasting health changes?`,
            choices: ["Setting one big, dramatic goal", "Making small, consistent changes over time", "Following strict rules and protocols"],
            showReaction: true,
        },
        {
            id: 10,
            type: 'system',
            content: `**Health Coach vs. Other Health Professionals**
• **Doctors/Nutritionists:** Provide medical advice and specific prescriptions
• **Personal Trainers:** Focus primarily on exercise and fitness
• **Therapists:** Address mental health and deeper psychological issues
• **Health Coaches:** Bridge the gap between knowledge and action, focusing on behavior change and sustainable lifestyle shifts`,
            systemStyle: 'info',
        },
        {
            id: 11,
            type: 'coach',
            content: `What makes health coaching so unique is that we work in the space between knowing and doing. We help people translate their health goals into daily actions that actually stick.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**The Health Coaching Process**
• **Assess:** Understand the client's current situation and challenges
• **Explore:** Help clients clarify their values, motivations, and goals
• **Plan:** Co-create actionable, realistic steps forward
• **Support:** Provide accountability, encouragement, and problem-solving
• **Adjust:** Continuously refine the approach based on what works`,
            systemStyle: 'takeaway',
        },
        {
            id: 13,
            type: 'system',
            content: `"The greatest revolution of our generation is the discovery that human beings, by changing the inner attitudes of their minds, can change the outer aspects of their lives." - William James`,
            systemStyle: 'quote',
        },
        {
            id: 14,
            type: 'coach',
            content: `You're already on your way to mastering this incredible skill set, {name}! In our next lesson, we'll dive deep into the psychology of motivation - understanding what really drives people to change and how to tap into that. Get ready to explore the fascinating world of human behavior! 🚀`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="What is Health Coaching?"
            lessonSubtitle="The art and science of behavior change"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
