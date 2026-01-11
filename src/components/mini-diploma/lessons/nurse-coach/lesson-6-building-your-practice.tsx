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

export function LessonBuildingYourPractice({
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
            content: `Hey {name}! 🎉 Welcome to Lesson 6 - this is where we transition from dreaming about your coaching practice to actually building it! Today we're covering the exciting (and sometimes scary) journey from employee to entrepreneur.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**The Entrepreneurial Mindset Shift**
• Move from trading time for money to creating value-based services
• Embrace uncertainty as opportunity for growth
• Take ownership of your professional destiny
• Develop resilience and adaptability
• Focus on solving problems for your ideal clients`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `I know this transition can feel overwhelming, {name}. When I first started, I was terrified of leaving the security of my nursing job. But here's what I learned - you don't have to make the leap all at once!`,
        },
        {
            id: 4,
            type: 'system',
            content: `**Transition Strategies: Employee to Entrepreneur**
• **Side Hustle Start**: Build your practice evenings/weekends while employed
• **Part-Time Pivot**: Reduce nursing hours gradually as coaching income grows
• **Full-Time Leap**: Leave employment to focus entirely on coaching
• **Hybrid Model**: Maintain some clinical work while building coaching practice
• **Corporate Coaching**: Offer services to healthcare organizations`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `Which transition strategy feels most aligned with your current situation?`,
            choices: ["Side hustle while keeping my full-time job", "Gradually reducing clinical hours", "I'm ready for the full entrepreneurial leap"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Perfect! Remember, there's no 'right' timeline - only what works for YOU and your circumstances. Now let's talk about the practical steps to get your practice off the ground.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Essential Business Foundation Elements**
• **Legal Structure**: LLC, Corporation, or Sole Proprietorship
• **Business License**: Check local and state requirements
• **Insurance**: Professional liability and general business insurance
• **Banking**: Separate business checking and savings accounts
• **Accounting System**: Track income, expenses, and taxes
• **Contracts**: Client agreements and terms of service`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'coach',
            content: `I know the business side can feel dry compared to the coaching work, but having these foundations in place protects you AND your clients. It also helps you feel more confident and professional from day one.`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Client Acquisition Strategies**
• **Referral Network**: Former colleagues, healthcare professionals, friends
• **Content Marketing**: Blog posts, social media, newsletters
• **Speaking Engagements**: Nursing conferences, wellness events, webinars
• **Partnerships**: Collaborate with other wellness professionals
• **Online Presence**: Professional website with clear messaging
• **Free Discovery Sessions**: Let potential clients experience your coaching`,
            systemStyle: 'takeaway',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `What feels like the most natural way for you to start attracting clients?`,
            choices: ["Leveraging my existing healthcare network", "Creating helpful content online", "Speaking at events and workshops"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Excellent choice! Starting with what feels natural to you is key. You can always expand to other strategies later. Now, let's address one of the biggest challenges new coach-entrepreneurs face...`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Pricing Your Services Confidently**
• **Know Your Worth**: Factor in education, nursing experience, and specialized training
• **Market Research**: Understand what other nurse coaches charge in your area
• **Value-Based Pricing**: Price based on client transformation, not just time
• **Package Options**: Offer different levels of service and investment
• **Start Somewhere**: You can always adjust pricing as you gain experience and confidence`,
            systemStyle: 'info',
        },
        {
            id: 13,
            type: 'coach',
            content: `Remember {name}, you're not 'just' starting out - you're bringing YEARS of healthcare expertise to your coaching. That has tremendous value, even if coaching is new to you.`,
        },
        {
            id: 14,
            type: 'system',
            content: `"The expert in anything was once a beginner. Don't let imposter syndrome keep you from serving the people who need exactly what you have to offer." - Marie Forleo`,
            systemStyle: 'quote',
        },
        {
            id: 15,
            type: 'coach',
            content: `Amazing work today, {name}! 💪 In Lesson 7, we're diving deep into Marketing and Building Your Brand - this is where you'll learn to attract your ideal clients authentically. Get ready to discover your unique voice in the coaching world!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Building Your Practice"
            lessonSubtitle="From employee to entrepreneur"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
