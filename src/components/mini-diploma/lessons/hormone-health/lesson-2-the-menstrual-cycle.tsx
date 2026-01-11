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

export function LessonTheMenstrualCycle({
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
            content: `Hey {name}! 🌙 Welcome to lesson 2 - we're diving into the beautiful complexity of the menstrual cycle today. Think of it as your body's monthly symphony, with hormones playing the lead instruments!`,
        },
        {
            id: 2,
            type: 'system',
            content: `**The Menstrual Cycle Overview**
• Average cycle length: 21-35 days (28 days is just the average)
• Four distinct phases with unique hormonal patterns
• Controlled by the hypothalamic-pituitary-ovarian axis
• Affects mood, energy, metabolism, and much more
• Every woman's cycle is unique to her`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Before we go deeper, I'm curious about your experience. Understanding where you're starting from helps me tailor what we cover next.`,
        },
        {
            id: 4,
            type: 'user-choice',
            content: `How well do you currently track or understand your menstrual cycle?`,
            choices: ["I track everything - apps, symptoms, the works!", "I have a general idea but want to learn more", "Honestly, it's mostly a mystery to me"],
            showReaction: true,
        },
        {
            id: 5,
            type: 'system',
            content: `**Phase 1: Menstrual Phase (Days 1-5)**
• Estrogen and progesterone at their lowest
• Uterine lining sheds (your period)
• Energy may be lower - perfect time for rest and reflection
• Iron levels can drop, affecting energy
• Body temperature at baseline`,
            systemStyle: 'info',
        },
        {
            id: 6,
            type: 'system',
            content: `**Phase 2: Follicular Phase (Days 1-13)**
• Overlaps with menstrual phase initially
• FSH stimulates follicle development
• Estrogen begins to rise steadily
• Energy and mood typically improve
• Great time for starting new projects`,
            systemStyle: 'info',
        },
        {
            id: 7,
            type: 'coach',
            content: `Here's where it gets really interesting - estrogen isn't just about reproduction. It's like your body's natural antidepressant and energy booster!`,
        },
        {
            id: 8,
            type: 'system',
            content: `**Phase 3: Ovulatory Phase (Around Day 14)**
• LH surge triggers ovulation
• Estrogen peaks just before ovulation
• Fertility window - cervical mucus changes
• Confidence and social energy often peak
• Slight temperature rise after ovulation`,
            systemStyle: 'info',
        },
        {
            id: 9,
            type: 'user-choice',
            content: `Many women notice changes in their skin throughout their cycle. When do you think skin typically looks its best?`,
            choices: ["Right before/during ovulation (estrogen peak)", "During the luteal phase (progesterone dominance)", "During menstruation (hormone reset)"],
            showReaction: true,
        },
        {
            id: 10,
            type: 'system',
            content: `**Phase 4: Luteal Phase (Days 15-28)**
• Progesterone rises and dominates
• Estrogen fluctuates but generally declines
• PMS symptoms may appear in late luteal phase
• Body temperature remains elevated
• If no pregnancy, both hormones drop dramatically`,
            systemStyle: 'info',
        },
        {
            id: 11,
            type: 'coach',
            content: `The luteal phase gets a bad rap because of PMS, but progesterone is actually your calming hormone. When it's balanced, it promotes better sleep and reduces anxiety.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Key Takeaway: Hormone Fluctuations Are Normal**
• Your energy, mood, and physical symptoms will naturally vary
• Each phase has its own gifts and challenges
• Tracking helps you work WITH your cycle, not against it
• Severe symptoms may indicate hormonal imbalances worth investigating`,
            systemStyle: 'takeaway',
        },
        {
            id: 13,
            type: 'coach',
            content: `Understanding these patterns is like having a roadmap to your own body. You can start planning your workouts, important meetings, and even social events around your natural rhythms!`,
        },
        {
            id: 14,
            type: 'coach',
            content: `Coming up in lesson 3, we'll explore how stress hijacks these beautiful hormonal patterns and what you can do about it. You're building such important knowledge, {name} - keep going! 💪`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Menstrual Cycle"
            lessonSubtitle="The monthly dance of estrogen and progesterone"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
