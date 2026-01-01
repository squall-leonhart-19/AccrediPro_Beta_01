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

export function LessonYourNextStep({
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
            content: `{name}, you made it to the final lesson! 🎉 I'm so proud of you for completing this journey.`,
        },
        {
            id: 2,
            type: 'coach',
            content: `Let's take a moment to reflect on everything you've learned...`,
        },
        {
            id: 3,
            type: 'system',
            content: `**What You've Mastered**
✓ The 5 key female hormones and how they interact
✓ The 4 phases of the menstrual cycle
✓ Common hormonal imbalances and their signs
✓ The gut-hormone connection
✓ Thyroid function and testing
✓ Stress, adrenals, and the cortisol cascade
✓ Nutrition strategies for hormone balance
✓ Supporting women through all life stages`,
            systemStyle: 'takeaway',
        },
        {
            id: 4,
            type: 'user-choice',
            content: `What will you do with this knowledge?`,
            choices: [
                "Apply it to my own health first",
                "Help friends and family",
                "Use it professionally to help women",
            ],
            showReaction: true,
        },
        {
            id: 5,
            type: 'coach',
            content: `Whether you're supporting yourself or others, you now have foundational knowledge that most people - even many doctors - don't have!`,
        },
        {
            id: 6,
            type: 'coach',
            content: `💡 I truly believe that women's health is one of the most impactful areas you can work in. So many women are suffering unnecessarily. With what you've learned, you can make a real difference - even if it's just helping one person understand their body better.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**The Bigger Picture**
Women's health impacts:
• Families (healthy moms, healthy kids)
• Workplaces (productivity, reduced sick days)
• Healthcare costs (prevention > treatment)
• Generational health (we pass patterns down)

→ When you help one woman, you help ripples of people`,
            systemStyle: 'quote',
        },
        {
            id: 8,
            type: 'user-choice',
            content: `How are you feeling about everything you've learned?`,
            choices: [
                "Excited and empowered!",
                "Ready to learn even more",
                "Eager to put it into practice",
            ],
            showReaction: true,
        },
        {
            id: 9,
            type: 'coach',
            content: `That's amazing! I love your energy! 🙌`,
        },
        {
            id: 10,
            type: 'coach',
            content: `Congratulations, {name}! 🎊 You've officially completed the Women's Health & Hormones Mini Diploma!`,
        },
        {
            id: 11,
            type: 'system',
            content: `**Certificate Unlocked!**
You've completed all 9 lessons.

Your official Women's Health & Hormones Mini Diploma certificate is ready to download!

→ Share it on LinkedIn
→ Add it to your credentials
→ Celebrate your achievement! 🌸`,
            systemStyle: 'takeaway',
        },
        {
            id: 12,
            type: 'coach',
            content: `Thank you for learning with me, {name}. You're going to do amazing things with this knowledge. I'll be in touch soon! 💕`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Your Next Step"
            lessonSubtitle="Taking your knowledge forward"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
