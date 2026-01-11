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
            content: `Hey {name}! 🎉 We've reached the final lesson of your Nurse Life Coach certification program! You've come so far, and I'm incredibly proud of your dedication. Today we're going to map out your next steps to become a certified Nurse Life Coach and launch your practice.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**Certification Requirements Overview**
• Complete all 9 course modules with passing scores
• Submit final case study demonstrating coaching skills
• Pass comprehensive certification exam (80% minimum)
• Complete 10 practice coaching sessions with feedback
• Submit ethics and professional standards agreement`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `The certification process might feel overwhelming, but remember - you already have the nursing expertise and caring heart. We're just adding the coaching framework to help you serve in a new way! ✨`,
        },
        {
            id: 4,
            type: 'user-choice',
            content: `What feels most challenging about moving forward with certification?`,
            choices: ["Taking the final exam", "Finding practice clients", "Setting up my coaching business"],
            showReaction: true,
        },
        {
            id: 5,
            type: 'system',
            content: `**Post-Certification Business Setup**
• Obtain liability insurance for coaching practice
• Create professional coaching agreements and intake forms
• Establish pricing structure for your services
• Set up secure communication platforms for client sessions
• Develop marketing materials highlighting your nursing background`,
            systemStyle: 'info',
        },
        {
            id: 6,
            type: 'coach',
            content: `Your nursing background is actually your superpower in the coaching world, {name}. Clients trust nurses inherently, and you understand health challenges in ways other coaches simply can't.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Continuing Education & Growth**
• Join professional nurse coaching associations (AHNCC, IINHC)
• Attend annual conferences and workshops
• Pursue specialty certifications (wellness, chronic illness, stress management)
• Participate in peer coaching circles for ongoing support
• Consider advanced training in specific coaching methodologies`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'user-choice',
            content: `Which area do you feel most excited to specialize in as a Nurse Life Coach?`,
            choices: ["Wellness and prevention coaching", "Chronic illness support", "Healthcare professional burnout"],
            showReaction: true,
        },
        {
            id: 9,
            type: 'system',
            content: `**Your Unique Value Proposition**
• Clinical knowledge combined with coaching skills
• Deep understanding of healthcare system challenges
• Ability to bridge medical recommendations with lifestyle change
• Natural empathy and patient advocacy skills
• Credibility with both healthcare teams and patients`,
            systemStyle: 'takeaway',
        },
        {
            id: 10,
            type: 'coach',
            content: `Think about it - who better to help someone navigate a diabetes diagnosis, manage chronic pain, or find work-life balance in healthcare than a nurse who's also trained in life coaching?`,
        },
        {
            id: 11,
            type: 'system',
            content: `**Timeline for Launch**
• Week 1-2: Complete final exam and case study
• Week 3-4: Finish practice coaching sessions
• Week 5-6: Set up business basics (insurance, contracts, pricing)
• Week 7-8: Create marketing materials and online presence
• Week 9-12: Soft launch with family/friends, gather testimonials
• Month 4+: Full practice launch`,
            systemStyle: 'info',
        },
        {
            id: 12,
            type: 'coach',
            content: `Remember, {name}, you don't have to have everything perfect before you start. Many successful nurse coaches began by coaching just a few hours per week while maintaining their nursing positions.`,
        },
        {
            id: 13,
            type: 'system',
            content: `"The best time to plant a tree was 20 years ago. The second best time is now. Your nursing experience has been growing your roots - now it's time to branch into coaching."`,
            systemStyle: 'quote',
        },
        {
            id: 14,
            type: 'coach',
            content: `You're ready for this next chapter! Your combination of clinical expertise and coaching skills will make a real difference in people's lives. Take the final exam when you feel prepared, and remember - I'm here to support you even after certification. Go change the world, one conversation at a time! 🌟`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Your Next Step"
            lessonSubtitle="Becoming a certified Nurse Life Coach"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
