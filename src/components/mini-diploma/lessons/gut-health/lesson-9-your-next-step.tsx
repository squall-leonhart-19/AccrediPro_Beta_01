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
            content: `Hey {name}! 🎉 Congratulations on making it to the final lesson! You've come so far in understanding gut health, and now it's time to talk about your next step - becoming a certified Gut Health Specialist.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**What You've Accomplished**
• Mastered the fundamentals of gut microbiome science
• Learned to identify digestive disorders and imbalances
• Understood the gut-brain connection and its health implications
• Gained practical skills in nutrition and lifestyle interventions
• Developed protocols for supporting optimal gut health`,
            systemStyle: 'takeaway',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think about where you started compared to where you are now. You have the knowledge to make a real difference in people's lives - including your own! Let's explore what certification means for your future.`,
        },
        {
            id: 4,
            type: 'user-choice',
            content: `What's your primary motivation for pursuing gut health certification?`,
            choices: ["Help clients with digestive issues professionally", "Enhance my existing health practice", "Personal health journey and helping family/friends"],
            showReaction: true,
        },
        {
            id: 5,
            type: 'system',
            content: `**Certification Requirements**
• Complete all 9 course modules with passing grades
• Submit final case study analysis
• Pass comprehensive certification exam (80% or higher)
• Agree to continuing education requirements
• Commit to ethical practice standards`,
            systemStyle: 'info',
        },
        {
            id: 6,
            type: 'coach',
            content: `The certification process ensures you're truly ready to help others. It's not just about passing a test - it's about demonstrating you can apply this knowledge safely and effectively.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Your Certification Includes**
• Official Gut Health Specialist certificate
• Digital badge for professional profiles
• Access to practitioner-only resources and protocols
• Monthly continuing education webinars
• Professional liability insurance discounts
• Marketing materials for your practice`,
            systemStyle: 'takeaway',
        },
        {
            id: 8,
            type: 'user-choice',
            content: `How do you plan to use your certification?`,
            choices: ["Start my own gut health practice", "Add services to existing business", "Work within healthcare/wellness teams"],
            showReaction: true,
        },
        {
            id: 9,
            type: 'coach',
            content: `Whatever path you choose, you'll have ongoing support. This certification isn't the end - it's really just the beginning of your journey as a gut health specialist!`,
        },
        {
            id: 10,
            type: 'system',
            content: `**Continuing Your Education**
• Advanced gut health protocols masterclass
• Pediatric gut health specialization
• Functional testing interpretation course
• Business building for health practitioners
• Research updates and new findings quarterly`,
            systemStyle: 'info',
        },
        {
            id: 11,
            type: 'coach',
            content: `Remember, the field of gut health is constantly evolving. Staying current with research and best practices is what separates great practitioners from good ones.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Next Steps Checklist**
• Review all course materials one final time
• Complete your case study submission
• Schedule your certification exam
• Join the graduate practitioner community
• Plan your continuing education pathway`,
            systemStyle: 'takeaway',
        },
        {
            id: 13,
            type: 'coach',
            content: `{name}, you have everything you need to succeed as a certified Gut Health Specialist. Trust in your knowledge, continue learning, and remember - you're going to help so many people heal and thrive! 🌟`,
        },
        {
            id: 14,
            type: 'system',
            content: `**Final Thought**
"The best time to plant a tree was 20 years ago. The second best time is now. You've planted the seeds of knowledge - now watch them grow into a practice that transforms lives."`,
            systemStyle: 'quote',
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Your Next Step"
            lessonSubtitle="Becoming a certified Gut Health Specialist"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
