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
            content: `In just 60 minutes, you've discovered how your nursing skills can transform into a fulfilling coaching career.`,
        },
        {
            id: 3,
            type: 'system',
            content: `**What You've Learned**
✅ Transitioning from bedside to business
✅ The coaching mindset vs. clinical mindset
✅ Burnout recovery strategies
✅ Core coaching skills
✅ Health behavior change techniques
✅ Building your practice
✅ Marketing for nurses
✅ Legal and ethical considerations`,
            systemStyle: 'info',
        },
        {
            id: 4,
            type: 'user-choice',
            content: `How are you feeling right now?`,
            choices: [
                "Excited - I see a path forward!",
                "Empowered - I can use my nursing skills",
                "Motivated - I want to escape burnout",
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
• 3-Level Certification (NLC-FC, NLC-CP, NLC-BC)
• 25+ in-depth lessons
• Practice-building blueprints
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
            content: `The investment is just $297 - less than a single shift, and it could change your entire career path.`,
        },
        {
            id: 8,
            type: 'coach',
            content: `Congratulations on completing your Nurse Life Coach Mini Diploma! 🌟`,
        },
        {
            id: 9,
            type: 'coach',
            content: `Your certificate is ready to download. And I'll be here when you're ready for the next step. 💕`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Your Next Step"
            lessonSubtitle="Becoming a Certified Nurse Life Coach"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
