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
            content: `In just 60 minutes, you've learned more about gut health than most conventionally trained doctors ever will.`,
        },
        {
            id: 3,
            type: 'system',
            content: `**What You've Learned**
✅ Why the gut is the foundation of all health
✅ The microbiome and its trillions of partners
✅ Leaky gut and intestinal permeability
✅ SIBO, dysbiosis, and bacterial imbalances
✅ The gut-brain axis connection
✅ Digestive enzymes and stomach acid
✅ The 5R healing protocol
✅ Food sensitivities and elimination`,
            systemStyle: 'info',
        },
        {
            id: 4,
            type: 'user-choice',
            content: `How are you feeling right now?`,
            choices: [
                "Excited - I want to learn more!",
                "Empowered - I finally understand my gut",
                "Motivated - I want to help others",
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
            content: `**Your Options Now**
1. **Download your Mini Diploma Certificate** - Share it on LinkedIn!
2. **Continue to Full Certification** - Become Board Certified
3. **Join our Community** - Connect with 20,000+ practitioners`,
            systemStyle: 'takeaway',
        },
        {
            id: 7,
            type: 'coach',
            content: `The Complete Career Certification takes you from curious learner to confident, credentialed Gut Health Specialist. 🎓`,
        },
        {
            id: 8,
            type: 'system',
            content: `**What's in the Full Certification?**
• 3-Level Certification (GH-FC, GH-CP, GH-BC)
• 25+ in-depth lessons
• Clinical protocols and case studies
• Functional lab interpretation mastery
• My Circle Mastermind (5-person pod, DAILY check-ins)
• ASI Practitioner Directory listing
• Done-for-you business templates
• Sarah mentorship access
• LIFETIME ACCESS`,
            systemStyle: 'info',
        },
        {
            id: 9,
            type: 'user-choice',
            content: `What matters most to you in continuing?`,
            choices: [
                "Getting certified and credentialed",
                "Accountability and community",
                "Practical business tools",
            ],
            showReaction: true,
        },
        {
            id: 10,
            type: 'coach',
            content: `All of those are included! And the investment is just $297 - less than 2 client sessions once you're certified.`,
        },
        {
            id: 11,
            type: 'coach',
            content: `{name}, you have something special. The fact that you finished this training shows you're serious.`,
        },
        {
            id: 12,
            type: 'coach',
            content: `Congratulations on completing your Gut Health Mini Diploma! 🌟`,
        },
        {
            id: 13,
            type: 'coach',
            content: `Your certificate is ready to download. And I'll be here when you're ready for the next step. 💕`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Your Next Step"
            lessonSubtitle="Becoming a Certified Gut Health Specialist"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
