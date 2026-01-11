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
            content: `{name}!! 🎉 You made it! I'm so proud of you for completing this Mini Diploma!`,
        },
        {
            id: 2,
            type: 'coach',
            content: `In just 60 minutes, you've learned more about hormone health than most conventionally trained doctors ever will.`,
        },
        {
            id: 3,
            type: 'system',
            content: `**What You've Learned**
✅ The Big 5 female hormones
✅ The menstrual cycle phases
✅ Common hormonal imbalances
✅ Thyroid connections
✅ Adrenal health and cortisol
✅ Perimenopause and menopause
✅ Hormone testing options
✅ Natural balancing strategies`,
            systemStyle: 'info',
        },
        {
            id: 4,
            type: 'user-choice',
            content: `How are you feeling right now?`,
            choices: [
                "Excited - I want to learn more!",
                "Empowered - I finally understand my hormones",
                "Motivated - I want to help other women",
            ],
            showReaction: true,
        },
        {
            id: 5,
            type: 'coach',
            content: `That's amazing! This is just the beginning. There's so much more depth to explore.`,
        },
        {
            id: 6,
            type: 'system',
            content: `**What's in the Full Certification?**
• 3-Level Certification (HH-FC, HH-CP, HH-BC)
• 25+ in-depth lessons
• Clinical protocols for every life stage
• My Circle Mastermind (5-person pod, DAILY check-ins)
• ASI Practitioner Directory listing
• Done-for-you business templates
• Sarah mentorship access
• LIFETIME ACCESS`,
            systemStyle: 'info',
        },
        {
            id: 7,
            type: 'coach',
            content: `The investment is just $297 - less than 2 client sessions once you're certified.`,
        },
        {
            id: 8,
            type: 'coach',
            content: `{name}, you have something special. The fact that you finished this training shows you're serious.`,
        },
        {
            id: 9,
            type: 'coach',
            content: `Congratulations on completing your Hormone Health Mini Diploma! 🌟`,
        },
        {
            id: 10,
            type: 'coach',
            content: `Your certificate is ready to download. And I'll be here when you're ready for the next step. 💕`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Your Next Step"
            lessonSubtitle="Becoming a Certified Hormone Health Specialist"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
