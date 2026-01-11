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

export function LessonGoalSettingAndActionPlans({
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
            content: `Hey {name}! Welcome to lesson 4 - we're diving into the heart of sustainable change today 🎯 You've learned about motivation and behavior change, now let's put it all together with goal setting and action plans that actually work!`,
        },
        {
            id: 2,
            type: 'system',
            content: `**The SMART-ER Goal Framework**
• **Specific**: Clear and well-defined outcomes
• **Measurable**: Trackable progress indicators
• **Achievable**: Realistic given current circumstances
• **Relevant**: Aligned with values and priorities
• **Time-bound**: Clear deadlines and milestones
• **Evaluated**: Regular check-ins and adjustments
• **Readjusted**: Flexibility to modify as needed`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Notice how we added 'ER' to the classic SMART goals? That's because real life happens, {name}. The best goals are ones that can bend without breaking when circumstances change.`,
        },
        {
            id: 4,
            type: 'user-choice',
            content: `A client wants to 'get healthier.' What's your first step as their coach?`,
            choices: ["Help them define what 'healthier' means specifically", "Create a comprehensive meal and exercise plan", "Set up weekly weigh-ins to track progress"],
            showReaction: true,
        },
        {
            id: 5,
            type: 'system',
            content: `**Breaking Down Big Goals: The Staircase Method**
• **Long-term vision**: 6-12 month outcome goal
• **Medium-term milestones**: Monthly progress markers
• **Short-term targets**: Weekly action steps
• **Daily habits**: Small, consistent behaviors
• **Micro-actions**: Tiny steps that build momentum`,
            systemStyle: 'info',
        },
        {
            id: 6,
            type: 'coach',
            content: `Think of it like climbing stairs instead of trying to jump to the second floor, {name}. Each step builds confidence and creates momentum for the next one.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Common Goal-Setting Mistakes to Avoid**
• Setting too many goals at once (stick to 1-3 max)
• Focusing only on outcome goals vs. process goals
• Making goals too vague or unmeasurable
• Not planning for obstacles and setbacks
• Forgetting to celebrate small wins along the way
• Creating unrealistic timelines`,
            systemStyle: 'takeaway',
        },
        {
            id: 8,
            type: 'user-choice',
            content: `Your client keeps missing their daily 10,000 step goal. What's the best coaching approach?`,
            choices: ["Lower the goal to something more achievable", "Explore what barriers are preventing success", "Add accountability with daily check-ins"],
            showReaction: true,
        },
        {
            id: 9,
            type: 'coach',
            content: `Great thinking! It's always about understanding the 'why' behind the struggle before jumping to solutions. That's what makes you a coach, not just a goal-setter.`,
        },
        {
            id: 10,
            type: 'system',
            content: `**Creating Action Plans That Work**
• **Implementation intentions**: 'When X happens, I will do Y'
• **Environmental design**: Set up your surroundings for success
• **If-then scenarios**: Plan for common obstacles
• **Support systems**: Identify who can help and how
• **Progress tracking**: Choose simple, consistent methods
• **Reward systems**: Built-in celebrations for milestones`,
            systemStyle: 'info',
        },
        {
            id: 11,
            type: 'coach',
            content: `The magic happens in the details, {name}. A goal without a plan is just a wish - but a goal with a solid action plan becomes inevitable.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**The Weekly Action Planning Process**
• Review previous week's progress and lessons learned
• Identify the top 3 priorities for the coming week
• Schedule specific times for health-related activities
• Anticipate potential obstacles and create backup plans
• Choose one small experiment to try
• Set up accountability check-ins`,
            systemStyle: 'takeaway',
        },
        {
            id: 13,
            type: 'coach',
            content: `Remember: sustainable change happens through consistent small actions, not perfect execution. Help your clients focus on progress, not perfection! ✨`,
        },
        {
            id: 14,
            type: 'coach',
            content: `Amazing work today, {name}! You now have the framework to help clients create goals that stick. Next up in lesson 5: Communication & Active Listening - because the best action plans mean nothing if we can't connect with our clients. See you there!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Goal Setting & Action Plans"
            lessonSubtitle="Making change sustainable"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
