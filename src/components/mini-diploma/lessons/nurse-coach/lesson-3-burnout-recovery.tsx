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

export function LessonBurnoutRecovery({
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
            content: `Hey {name}! 💚 Welcome to one of the most important lessons in your journey as a nurse life coach. Today we're diving deep into burnout recovery - because you can't pour from an empty cup, and healing yourself is the foundation for helping others heal.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**Understanding Nurse Burnout**
• Physical exhaustion beyond normal tiredness
• Emotional depletion and cynicism toward work
• Reduced sense of personal accomplishment
• Depersonalization of patient relationships
• Increased medical errors and safety concerns
• Higher turnover rates (up to 18% annually in nursing)`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `I know this might hit close to home, {name}. The statistics are sobering, but here's what I want you to remember: recognizing burnout isn't a weakness - it's the first step toward healing and becoming a more effective healer yourself.`,
        },
        {
            id: 4,
            type: 'user-choice',
            content: `Which burnout symptom have you experienced most intensely in your nursing career?`,
            choices: ["Physical exhaustion that rest doesn't fix", "Emotional numbness toward patients", "Feeling like nothing you do makes a difference"],
            showReaction: true,
        },
        {
            id: 5,
            type: 'system',
            content: `**The Burnout Recovery Framework**
• **Recognition**: Acknowledge without judgment
• **Rest**: Prioritize sleep, nutrition, and downtime
• **Reconnection**: Rediscover your 'why' in nursing
• **Boundaries**: Learn to say no and protect your energy
• **Support**: Build professional and personal networks
• **Purpose**: Align work with deeper values and meaning`,
            systemStyle: 'takeaway',
        },
        {
            id: 6,
            type: 'coach',
            content: `This framework isn't just theory - it's your roadmap back to yourself. As nurse life coaches, we need to model this recovery process. Our clients will sense our authenticity when we've done our own healing work.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Physical Recovery Strategies**
• Establish consistent sleep hygiene (7-9 hours)
• Implement micro-breaks during shifts (2-3 minutes)
• Practice progressive muscle relaxation
• Maintain regular exercise routine (even 15 minutes daily)
• Focus on anti-inflammatory nutrition
• Consider massage therapy or acupuncture`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'system',
            content: `**Emotional and Mental Recovery**
• Journaling for emotional processing
• Mindfulness meditation (start with 5 minutes)
• Therapy or counseling support
• Gratitude practices specific to nursing wins
• Creative outlets unrelated to healthcare
• Limit exposure to negative news and social media`,
            systemStyle: 'info',
        },
        {
            id: 9,
            type: 'coach',
            content: `Recovery isn't linear, {name}. Some days will feel like progress, others like setbacks. That's completely normal and part of the healing process. The key is consistency, not perfection.`,
        },
        {
            id: 10,
            type: 'user-choice',
            content: `What's your biggest barrier to implementing self-care as a nurse?`,
            choices: ["Guilt about taking time for myself", "Lack of time due to work demands", "Not knowing where to start"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'system',
            content: `**Professional Boundary Setting**
• Learn to say 'no' to extra shifts when exhausted
• Delegate appropriately to support staff
• Leave work at work (no checking emails at home)
• Separate personal identity from nursing identity
• Seek feedback and mentorship regularly
• Advocate for systemic changes in your workplace`,
            systemStyle: 'takeaway',
        },
        {
            id: 12,
            type: 'system',
            content: `"The wounded healer is not someone who has been healed, but someone who is healing and helping others heal in the process." - Henri Nouwen`,
            systemStyle: 'quote',
        },
        {
            id: 13,
            type: 'coach',
            content: `This quote perfectly captures what we're building toward, {name}. As nurse life coaches, our greatest strength isn't that we have it all figured out - it's that we're committed to our own ongoing healing journey.`,
        },
        {
            id: 14,
            type: 'system',
            content: `**Creating Your Recovery Action Plan**
• Choose 1-2 strategies from each category to start
• Set specific, measurable goals (e.g., 'meditate 5 minutes daily')
• Schedule recovery activities like patient appointments
• Track progress weekly, adjust monthly
• Celebrate small wins consistently
• Build accountability with trusted colleagues`,
            systemStyle: 'takeaway',
        },
        {
            id: 15,
            type: 'coach',
            content: `You're doing incredible work by prioritizing your own healing, {name}! 🌱 Next week in Lesson 4, we'll explore how to identify your unique coaching niche within nursing - building on this foundation of self-awareness and recovery. Remember: every step you take toward healing yourself multiplies your ability to help others do the same.`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Burnout Recovery"
            lessonSubtitle="Healing yourself to help others"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
