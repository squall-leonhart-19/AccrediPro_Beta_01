"use client";

import { LessonBase, Message } from "./shared/lesson-base";

interface LessonProps {
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
    lessonNumber?: number;
    totalLessons?: number;
    firstName?: string;
    isPaid?: boolean;
}

/**
 * Lesson 8: Building Your Practice
 * How to find clients and get paid
 */
export function LessonBuildingPractice({
    onComplete,
    onNext,
    isCompleted = false,
    lessonNumber = 8,
    totalLessons = 9,
    firstName = "friend",
}: LessonProps) {
    const messages: Message[] = [
        // INTRO
        {
            id: 1,
            type: 'coach',
            content: `{name}, let's talk MONEY.`,
            delay: 2500,
        },
        {
            id: 2,
            type: 'coach',
            content: "Because knowledge doesn't pay the bills. CLIENTS do.",
            delay: 3000,
        },
        {
            id: 3,
            type: 'coach',
            content: "This lesson is about turning your FM skills into actual income.",
            delay: 3200,
        },
        {
            id: 4,
            type: 'voice-note',
            content: "When I started, I had imposter syndrome like crazy. Who would pay ME for health coaching? But I started with one client—a friend who was struggling. She got results. She told a friend. That friend told two more. Within 6 months I had a full practice.",
            voiceDuration: "0:28",
            delay: 4000,
        },

        // THE OPPORTUNITY
        {
            id: 5,
            type: 'coach',
            content: "First, let's look at the opportunity:",
            delay: 2800,
        },
        {
            id: 6,
            type: 'system',
            content: "**The FM Coaching Market:**\n\n• 79% of people want holistic health solutions\n• Functional medicine is growing 15%+ per year\n• There aren't enough trained practitioners\n• People are ACTIVELY searching for coaches like you\n\n→ Demand is high. Supply is low. That's opportunity.",
            systemStyle: 'stats',
            delay: 5000,
        },
        {
            id: 7,
            type: 'coach',
            content: "Let me show you what FM coaches actually EARN:",
            delay: 3000,
        },
        {
            id: 8,
            type: 'system',
            content: "**FM Coach Income Ranges:**\n\n💰 **Hourly Sessions:**\n• Beginning: $50-75/hour\n• Established: $100-150/hour\n• Expert: $150-250/hour\n\n📦 **Package Programs:**\n• 6-week programs: $500-1,500\n• 12-week transformations: $1,500-3,500\n• VIP intensives: $2,500-5,000+",
            systemStyle: 'stats',
            delay: 5000,
        },
        {
            id: 9,
            type: 'user-choice',
            content: "Which model appeals to you most?",
            choices: [
                "Hourly sessions—I want flexibility",
                "Packages—deeper work with clients",
                "Mix of both depending on the client"
            ],
        },

        // FINDING CLIENTS
        {
            id: 10,
            type: 'coach',
            content: "Now the big question: WHERE do you find clients?",
            delay: 3000,
        },
        {
            id: 11,
            type: 'system',
            content: "**Client Acquisition Strategies:**\n\n**1. Your Network (Fastest Start)**\n• Friends, family, colleagues with health issues\n• Social media announcement\n• \"I'm training in FM—looking for 3 practice clients\"\n\n**2. Content Marketing**\n• Share health tips on Instagram/Facebook\n• Start a simple blog or newsletter\n• Be helpful → Build trust → Get clients\n\n**3. Referral Partners**\n• Yoga studios, gyms, wellness centers\n• Massage therapists, acupuncturists\n• Doctors who want to refer lifestyle cases",
            systemStyle: 'info',
            delay: 6000,
        },
        {
            id: 12,
            type: 'voice-note',
            content: "Here's the secret: You don't need thousands of followers. You need 5-10 clients paying you monthly. That's $2,500 to $10,000 a month depending on your pricing. Start with your warm network. That's where 80% of new coaches get their first clients.",
            voiceDuration: "0:26",
            delay: 4000,
        },

        // YOUR FIRST CLIENTS
        {
            id: 13,
            type: 'coach',
            content: "Let me give you the exact script to get your first clients:",
            delay: 3000,
        },
        {
            id: 14,
            type: 'system',
            content: "**The \"Practice Client\" Script:**\n\n\"Hey [Name], I'm training to become a Functional Medicine health coach. I'm looking for 2-3 people who want to work on [gut health/energy/hormones] to be my practice clients.\n\nIt would be [free/discounted rate] while I'm training, and you'd get real results working with me directly.\n\nWould you be interested, or know someone who would be perfect for this?\"\n\n→ Send this to 20 people. You'll get 3-5 yes responses.",
            systemStyle: 'exercise',
            delay: 6000,
        },
        {
            id: 15,
            type: 'user-choice',
            content: "Could you send this message to people you know?",
            choices: [
                "Yes—I can think of people right now",
                "I'd need to adjust it for my situation",
                "This feels uncomfortable but I'll try"
            ],
            showReaction: true,
        },
        {
            id: 16,
            type: 'coach',
            content: "Discomfort is normal! Everyone feels it.",
            delay: 2800,
        },
        {
            id: 17,
            type: 'coach',
            content: "But think about this: You're not SELLING. You're OFFERING to help.",
            delay: 3200,
        },

        // PRICING
        {
            id: 18,
            type: 'coach',
            content: "Now let's talk about pricing:",
            delay: 2800,
        },
        {
            id: 19,
            type: 'system',
            content: "**Pricing Strategy:**\n\n**Phase 1: Practice Clients (First 3-5)**\n• Free or heavily discounted\n• Goal: Get testimonials and experience\n\n**Phase 2: Early Clients (Next 5-10)**\n• $50-75/session or $300-500 packages\n• Still learning, building confidence\n\n**Phase 3: Established (10+ clients)**\n• $100-150/session or $1,000+ packages\n• You have results to show\n\n**Phase 4: Expert**\n• $150-250/session or $2,500+ programs\n• Waitlist, premium positioning",
            systemStyle: 'info',
            delay: 6000,
        },
        {
            id: 20,
            type: 'voice-note',
            content: "Most people underprice themselves. I started at $50/hour. Within a year I was at $125. Now my programs start at $2,000. Your price will grow with your confidence and results. Just START somewhere.",
            voiceDuration: "0:22",
            delay: 4000,
        },

        // SIMPLE TECH SETUP
        {
            id: 21,
            type: 'coach',
            content: "You don't need complicated tech to start:",
            delay: 2800,
        },
        {
            id: 22,
            type: 'system',
            content: "**Minimum Viable Practice:**\n\n✅ Zoom for sessions (free)\n✅ Calendly for scheduling (free)\n✅ Stripe or PayPal for payments (free)\n✅ Google Docs for client notes\n✅ Simple intake form (Google Forms)\n\nThat's it. You can add fancy software later.",
            systemStyle: 'takeaway',
            delay: 5000,
        },

        // WRAP UP
        {
            id: 23,
            type: 'coach',
            content: "Here's what I want you to remember, {name}:",
            delay: 3000,
        },
        {
            id: 24,
            type: 'coach',
            content: "You don't need a perfect website. You don't need thousands of followers.",
            delay: 3200,
        },
        {
            id: 25,
            type: 'coach',
            content: "You need ONE client. Then two. Then five.",
            delay: 3000,
        },
        {
            id: 26,
            type: 'coach',
            content: "That's how every successful coach started.",
            delay: 2800,
        },
        {
            id: 27,
            type: 'system',
            content: "**Lesson 8 Key Takeaway:**\n\nBuilding a practice is simpler than you think:\n\n1. Start with your network\n2. Get 3-5 practice clients for testimonials\n3. Raise prices as you get results\n4. Build from there\n\nThe hardest part is starting. Everything else follows.",
            systemStyle: 'takeaway',
            delay: 5000,
        },
        {
            id: 28,
            type: 'coach',
            content: "Final lesson coming up: YOUR NEXT STEP. Let's make this real!",
            delay: 3200,
        },
        {
            id: 29,
            type: 'coach',
            content: `Almost there, {name}!`,
            delay: 2500,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Building Your Practice"
            lessonSubtitle="Finding clients and getting paid"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
