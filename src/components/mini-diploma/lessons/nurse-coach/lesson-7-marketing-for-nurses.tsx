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

export function LessonMarketingForNurses({
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
            content: `Hey {name}! 👋 Welcome to lesson 7 where we're diving into marketing for nurses. I know the word 'marketing' might feel a bit uncomfortable - many of us became nurses to help people, not to 'sell' ourselves. But here's the thing: authentic marketing is simply about connecting with the people you're meant to serve!`,
        },
        {
            id: 2,
            type: 'system',
            content: `**Why Marketing Feels Different for Nurses**
• We're trained to put others first, not promote ourselves
• Healthcare traditionally hasn't required self-promotion
• Fear of appearing 'salesy' or inauthentic
• Imposter syndrome can make us hesitate to share expertise
• We often undervalue our unique skills and experience`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `The beautiful truth is that your nursing background gives you incredible advantages in marketing authentically. You already know how to build trust, communicate with empathy, and truly listen to what people need.`,
        },
        {
            id: 4,
            type: 'system',
            content: `**Your Nursing Superpowers in Marketing**
• **Trust-building expertise**: You've earned patient trust in vulnerable moments
• **Active listening skills**: You can identify real client pain points
• **Empathetic communication**: You speak with genuine care and understanding
• **Problem-solving mindset**: You're trained to assess and address needs
• **Professional credibility**: Your nursing credentials carry instant respect`,
            systemStyle: 'takeaway',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `Which marketing approach feels most natural to you as a nurse?`,
            choices: ["Sharing educational content about health and wellness", "Telling stories about transformation and healing", "Building relationships through genuine conversations"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `All of these approaches work beautifully! The key is choosing methods that align with your personality and values. Let's explore how to build your authentic marketing foundation.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Building Your Authentic Marketing Foundation**
• **Know your 'why'**: Connect your nursing mission to your coaching purpose
• **Identify your ideal client**: Who specifically needs your unique background?
• **Share your story**: Your nursing journey is part of your credibility
• **Focus on serving**: Lead with value, not sales pitches
• **Be consistently helpful**: Regular, useful content builds trust over time`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'coach',
            content: `Remember, marketing isn't about convincing people they need you - it's about helping the right people find you when they're already looking for support.`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Practical Marketing Strategies for Nurse Coaches**
• **Content marketing**: Blog posts, social media tips, educational videos
• **Speaking opportunities**: Lunch-and-learns, workshops, conference presentations
• **Networking**: Professional associations, alumni groups, healthcare connections
• **Referral partnerships**: Build relationships with other healthcare providers
• **Online presence**: Professional website, LinkedIn optimization, Google My Business`,
            systemStyle: 'info',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `What's your biggest concern about marketing yourself as a nurse coach?`,
            choices: ["Not knowing what to say or share", "Feeling like I'm being 'salesy' or pushy", "Not having enough experience yet"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `These concerns are so normal, {name}! Every successful nurse coach has felt this way. The secret is starting small and focusing on being helpful rather than perfect.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Your Marketing Action Plan**
• **Week 1-2**: Set up basic online presence (LinkedIn, simple website)
• **Week 3-4**: Start sharing one piece of helpful content weekly
• **Month 2**: Reach out to 5 professional contacts about your new direction
• **Month 3**: Offer a free workshop or consultation to gather feedback
• **Ongoing**: Consistently share value, build relationships, ask for referrals`,
            systemStyle: 'takeaway',
        },
        {
            id: 13,
            type: 'coach',
            content: `The most important thing to remember is that marketing is a skill you can learn and improve over time. Your nursing experience has already given you most of what you need - now it's just about translating those skills into attracting your ideal clients.`,
        },
        {
            id: 14,
            type: 'system',
            content: `"The best marketing doesn't feel like marketing. It feels like a nurse sharing wisdom with someone who needs to hear it." - Sarah Chen, Nurse Life Coach`,
            systemStyle: 'quote',
        },
        {
            id: 15,
            type: 'coach',
            content: `Amazing work today, {name}! 🌟 In our next lesson, we'll dive into building sustainable systems for your nurse coaching practice. You're almost ready to launch with confidence - I'm so proud of how far you've come!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Marketing for Nurses"
            lessonSubtitle="Attracting clients authentically"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
