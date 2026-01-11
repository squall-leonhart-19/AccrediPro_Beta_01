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
            content: `Hey {name}! 🎉 Congratulations on making it to the final lesson! You've covered so much ground in hormone health, and now it's time to talk about your next steps as a certified Hormone Health Specialist.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**Certification Requirements**
• Complete all 9 lessons with 80% or higher quiz scores
• Submit final case study analysis
• Pass comprehensive certification exam (75 questions)
• Complete 10 hours of practical application exercises
• Agree to continuing education commitments`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `The certification process might seem intensive, but you're already well-prepared! Every lesson has been building toward this moment where you can confidently help others optimize their hormone health.`,
        },
        {
            id: 4,
            type: 'user-choice',
            content: `What aspect of becoming certified excites you most?`,
            choices: ["Helping clients transform their health", "Having official credentials to share my expertise", "Joining a community of hormone health professionals"],
            showReaction: true,
        },
        {
            id: 5,
            type: 'system',
            content: `**Your Scope of Practice as a Hormone Health Specialist**
• Provide education on hormone-supportive nutrition
• Guide lifestyle modifications for hormonal balance
• Recommend appropriate testing and tracking methods
• Refer to medical professionals when necessary
• Support clients through hormone optimization journeys
• Teach stress management and sleep optimization`,
            systemStyle: 'info',
        },
        {
            id: 6,
            type: 'coach',
            content: `Remember, as a Hormone Health Specialist, you're not diagnosing or treating medical conditions. You're empowering people with knowledge and practical strategies to support their body's natural hormone production and balance.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Building Your Practice: Next Steps**
• Define your ideal client avatar
• Create hormone health assessment tools
• Develop signature programs or packages
• Build relationships with healthcare providers for referrals
• Continue learning through advanced certifications
• Join professional networks and communities`,
            systemStyle: 'takeaway',
        },
        {
            id: 8,
            type: 'user-choice',
            content: `Which client population are you most interested in serving?`,
            choices: ["Women navigating perimenopause and menopause", "Young adults struggling with hormonal acne and mood swings", "Anyone wanting to optimize energy and metabolism"],
            showReaction: true,
        },
        {
            id: 9,
            type: 'coach',
            content: `Each client population has unique needs, and your specialized knowledge will make such a difference in their lives. The hormone health field is growing rapidly as more people seek natural, root-cause approaches.`,
        },
        {
            id: 10,
            type: 'system',
            content: `**Continuing Education Opportunities**
• Advanced hormone testing interpretation
• Specialized populations (PCOS, thyroid disorders, adrenal dysfunction)
• Functional nutrition for hormone health
• Mind-body approaches to hormonal balance
• Business development for health practitioners
• Research updates and emerging therapies`,
            systemStyle: 'info',
        },
        {
            id: 11,
            type: 'coach',
            content: `The learning never stops in this field! Hormones research is constantly evolving, and staying current will keep you at the forefront of helping your clients achieve lasting results.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**"The best way to predict the future is to create it. Your journey as a Hormone Health Specialist starts with the commitment to help others reclaim their vitality through balanced hormones."**`,
            systemStyle: 'quote',
        },
        {
            id: 13,
            type: 'coach',
            content: `{name}, you now have the knowledge foundation to make a real impact in people's lives. Your certification exam will be available within 24 hours, and I know you're going to do amazing! 💪`,
        },
        {
            id: 14,
            type: 'coach',
            content: `Take some time to review your notes, complete any outstanding assignments, and when you're ready, dive into that certification exam. I'm so proud of how far you've come, and I can't wait to welcome you officially to our community of certified specialists!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Your Next Step"
            lessonSubtitle="Becoming a certified Hormone Health Specialist"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
