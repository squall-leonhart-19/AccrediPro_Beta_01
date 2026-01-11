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

export function LessonLifeStageSupport({
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
            content: `{name}, women's hormonal needs change throughout life. Understanding these stages helps you support yourself AND other women! 🌺`,
        },
        {
            id: 2,
            type: 'coach',
            content: `Let's walk through the major life stages and what each one needs...`,
        },
        {
            id: 3,
            type: 'system',
            content: `**Reproductive Years (20s-30s)**
Focus areas:
• Regular, healthy cycles
• Fertility optimization
• Managing PMS naturally
• Preconception nutrition
• Postpartum recovery

→ Foundation-building time for long-term health`,
            systemStyle: 'info',
        },
        {
            id: 4,
            type: 'user-choice',
            content: `Which life stage are you most interested in learning about?`,
            choices: [
                "Optimizing fertility",
                "Perimenopause transition",
                "Menopause and beyond",
            ],
            showReaction: true,
        },
        {
            id: 5,
            type: 'system',
            content: `**Perimenopause (Usually 40s)**
The transition begins:
• Cycles become irregular
• Hot flashes may start
• Sleep disruptions
• Mood changes (hello, irritability!)
• Weight redistribution
• Brain fog

→ Can last 4-10 years before menopause`,
            systemStyle: 'comparison',
        },
        {
            id: 6,
            type: 'coach',
            content: `Perimenopause is the most underserved phase. Women are often told "you're too young for menopause" when they're clearly experiencing symptoms!`,
        },
        {
            id: 7,
            type: 'coach',
            content: `💡 Perimenopause deserves SO much more attention. Women in this stage often feel gaslit by doctors who dismiss their symptoms. If you can help women understand what's happening in their bodies during this time, you'll be giving them an incredible gift.`,
        },
        {
            id: 8,
            type: 'system',
            content: `**Menopause & Post-Menopause**
Menopause = 12 months without a period

Focus shifts to:
• Bone health (estrogen protected bones)
• Heart health (risk increases)
• Brain health (cognitive support)
• Muscle maintenance
• Sexual health & vaginal wellness

→ Quality of life can still be amazing!`,
            systemStyle: 'info',
        },
        {
            id: 9,
            type: 'system',
            content: `**Supporting Each Stage Naturally**
**Fertility**: Optimize nutrition, reduce toxins, manage stress
**Perimenopause**: Support liver, balance blood sugar, adaptogenic herbs
**Menopause**: Weight-bearing exercise, phytoestrogens, omega-3s

→ Each stage has unique needs and opportunities`,
            systemStyle: 'takeaway',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `What's your biggest takeaway about life stages?`,
            choices: [
                "Each stage needs different support",
                "Perimenopause is underrecognized",
                "We can thrive at any age",
            ],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `The key message: women deserve support at EVERY stage of life. Too many suffer silently because they don't know what's happening or what to do.`,
        },
        {
            id: 12,
            type: 'coach',
            content: `One more lesson to go! In our final lesson, we'll talk about YOUR next step and how you can use this knowledge to make a real difference. 🌟`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Life Stage Support"
            lessonSubtitle="Supporting women through every phase"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
