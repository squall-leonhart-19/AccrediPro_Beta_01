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

export function LessonFromBedsideToBusiness({
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
            content: `Hey {name}! 🌟 Welcome to your first lesson in becoming a Nurse Life Coach! I'm so excited you're here. You've already made the hardest decision - taking that leap from traditional nursing into entrepreneurship. Today we're going to explore how your nursing background is actually your secret weapon in the coaching world.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**Why Nurses Make Exceptional Life Coaches**
• Natural empathy and active listening skills
• Experience managing stress and crisis situations
• Deep understanding of human behavior and psychology
• Strong assessment and problem-solving abilities
• Credibility and trust that comes with healthcare experience
• Holistic approach to wellness and patient care`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think about it, {name} - how many times have you been the person patients turn to not just for medical care, but for emotional support, guidance, and hope? That's coaching at its core! You've been doing it all along.`,
        },
        {
            id: 4,
            type: 'user-choice',
            content: `What nursing skill do you think translates BEST to life coaching?`,
            choices: ["Active listening and empathy", "Crisis management and staying calm under pressure", "Health education and teaching skills"],
            showReaction: true,
        },
        {
            id: 5,
            type: 'system',
            content: `**The Nursing Assessment Process vs. Coaching Discovery**
• **Assessment** → Initial client consultation and goal identification
• **Diagnosis** → Identifying limiting beliefs and obstacles
• **Planning** → Creating actionable coaching plans and strategies
• **Implementation** → Guiding clients through behavior changes
• **Evaluation** → Measuring progress and adjusting approaches`,
            systemStyle: 'takeaway',
        },
        {
            id: 6,
            type: 'coach',
            content: `See how perfectly your nursing process maps to coaching? You're not starting from scratch - you're building on a foundation of expertise that took years to develop.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Your Unique Value Proposition as a Nurse Coach**
• Medical knowledge that builds instant credibility
• Understanding of stress, burnout, and workplace challenges
• Experience with behavior change and patient compliance
• Comfort with difficult conversations and emotional situations
• Network within the healthcare community
• Personal experience with healthcare system challenges`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'user-choice',
            content: `Which area of life coaching feels most natural given your nursing background?`,
            choices: ["Stress management and burnout recovery", "Health and wellness coaching", "Career transition and professional development"],
            showReaction: true,
        },
        {
            id: 9,
            type: 'coach',
            content: `Whatever area calls to you, remember that your nursing experience gives you something most coaches don't have - real-world experience helping people through their most vulnerable moments.`,
        },
        {
            id: 10,
            type: 'system',
            content: `**Common Concerns When Transitioning**
• **"I don't have business experience"** → Your patient care IS customer service experience
• **"I'm not qualified to give life advice"** → You help people make life-changing health decisions daily
• **"What if I fail?"** → You've handled life-or-death situations; you can handle this
• **"I need more training"** → True, but you have a stronger foundation than most`,
            systemStyle: 'info',
        },
        {
            id: 11,
            type: 'system',
            content: `**"The skills you've developed as a nurse - compassion, critical thinking, the ability to stay calm under pressure - these aren't just transferable to coaching. They're the very foundation of transformational coaching."**

*- Dr. Christine Carter, Nurse Coach Pioneer*`,
            systemStyle: 'quote',
        },
        {
            id: 12,
            type: 'coach',
            content: `I want you to start seeing yourself differently, {name}. You're not 'just a nurse' trying to become a coach. You're a skilled healthcare professional who's expanding into a natural extension of your calling.`,
        },
        {
            id: 13,
            type: 'system',
            content: `**Action Steps for This Week**
• Reflect on coaching conversations you've already had with patients, colleagues, or friends
• Identify 3 specific nursing skills you're most confident about
• Start noticing when others come to you for advice or support
• Journal about what draws you to coaching beyond nursing`,
            systemStyle: 'takeaway',
        },
        {
            id: 14,
            type: 'coach',
            content: `Next week in Lesson 2, we'll dive into identifying your ideal coaching niche and how to position yourself in the market. You're going to discover there's a perfect audience waiting for exactly what you have to offer! 💪`,
        },
        {
            id: 15,
            type: 'coach',
            content: `Remember {name}, every expert was once a beginner, but not every beginner has your clinical experience, your heart for helping others, and your proven ability to make a difference in people's lives. You've got this!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="From Bedside to Business"
            lessonSubtitle="Leveraging your nursing expertise"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
