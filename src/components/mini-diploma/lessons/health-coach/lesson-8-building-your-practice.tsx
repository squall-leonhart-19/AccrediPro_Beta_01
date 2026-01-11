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
            content: `Hey {name}! 🎉 Welcome to lesson 8 - this is where your journey transforms from learning to earning! We're going from certification to actual clients, and I'm so excited to guide you through building your thriving health coaching practice.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**Foundation Elements of Your Practice**
• Define your niche and ideal client avatar
• Develop your unique value proposition
• Create professional branding and messaging
• Set up business structure (LLC, insurance, etc.)
• Establish pricing strategy and service packages`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Before we dive deeper, let's think about your ideal starting point. Every successful coach begins somewhere different based on their background and comfort level.`,
        },
        {
            id: 4,
            type: 'user-choice',
            content: `What feels like the most natural first step for launching your practice?`,
            choices: ["Start with friends and family for experience", "Create an online presence first", "Partner with local businesses or practitioners"],
            showReaction: true,
        },
        {
            id: 5,
            type: 'system',
            content: `**Client Acquisition Strategies**
• **Warm Network**: Friends, family, colleagues who trust you
• **Content Marketing**: Blog posts, social media, free resources
• **Partnerships**: Collaborate with gyms, wellness centers, doctors
• **Speaking Engagements**: Workshops, webinars, community events
• **Referral System**: Incentivize existing clients to refer others`,
            systemStyle: 'info',
        },
        {
            id: 6,
            type: 'coach',
            content: `One of the biggest mistakes new coaches make is trying to help everyone. The riches are in the niches, {name}! When you specialize, you become the go-to expert instead of just another health coach.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Popular Health Coaching Niches**
• **Weight Management**: Sustainable weight loss and maintenance
• **Women's Wellness**: Hormones, menopause, reproductive health
• **Corporate Wellness**: Workplace stress and employee health
• **Chronic Condition Support**: Diabetes, heart disease, autoimmune
• **Sports Nutrition**: Athletic performance and recovery
• **Digestive Health**: Gut health and food sensitivities`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'coach',
            content: `Now let's talk about pricing - this is where many coaches undervalue themselves. Remember, you're not just selling time, you're selling transformation and expertise.`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Pricing Your Services**
• **Discovery Sessions**: $0-50 (lead generation tool)
• **Single Sessions**: $75-150 per hour
• **3-Month Programs**: $800-2,500 total
• **6-Month Programs**: $1,500-5,000 total
• **Group Coaching**: $200-800 per person for 6-12 weeks
• **Corporate Programs**: $100-300 per employee`,
            systemStyle: 'info',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `What's your biggest concern about pricing your services?`,
            choices: ["I'm worried I'm not experienced enough to charge premium rates", "I don't know how to communicate my value to justify the price", "I'm afraid people in my area won't pay health coaching rates"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Those pricing fears are totally normal! Here's the truth: people pay for results and transformation, not just your years of experience. Your certification, passion, and commitment to their success have tremendous value.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Essential Business Tools**
• **Scheduling**: Calendly, Acuity Scheduling
• **Video Calls**: Zoom, Google Meet
• **Payment Processing**: Stripe, PayPal, Square
• **Client Management**: Practice Better, My Fitness Pal
• **Email Marketing**: Mailchimp, ConvertKit
• **Website Builder**: Squarespace, WordPress, Wix`,
            systemStyle: 'takeaway',
        },
        {
            id: 13,
            type: 'coach',
            content: `Remember {name}, you don't need to have everything perfect before you start. The most successful coaches are the ones who begin before they feel 100% ready. Your first client just needs to be better off after working with you than before.`,
        },
        {
            id: 14,
            type: 'system',
            content: `"Success in health coaching isn't about being perfect - it's about being authentic, consistent, and genuinely caring about your clients' transformation." - Sarah Mitchell, Master Health Coach`,
            systemStyle: 'quote',
        },
        {
            id: 15,
            type: 'coach',
            content: `You're almost at the finish line! 🏁 Next up is our final lesson where we'll cover your certification completion and continuing education. You've got this, and I can't wait to see the amazing practice you're going to build!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Building Your Practice"
            lessonSubtitle="From certification to clients"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
