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
 * Lesson 3: Your Unfair Advantage
 * Why YOUR background makes you uniquely qualified
 */
export function LessonUnfairAdvantage({
    onComplete,
    onNext,
    isCompleted = false,
    lessonNumber = 3,
    totalLessons = 9,
    firstName = "friend",
}: LessonProps) {
    const messages: Message[] = [
        // INTRO
        {
            id: 1,
            type: 'coach',
            content: `{name}, this lesson is personal.`,
            delay: 2500,
        },
        {
            id: 2,
            type: 'coach',
            content: "I want to talk about something most training programs never mention:",
            delay: 3000,
        },
        {
            id: 3,
            type: 'coach',
            content: "Why YOUR background—whatever it is—is actually your biggest advantage.",
            delay: 3200,
        },
        {
            id: 4,
            type: 'voice-note',
            content: "I used to think I needed to forget my nursing background to become an FM coach. Like it was a liability. But it turned out to be the opposite. Everything I'd seen, every patient I'd lost to the system—that became my fuel. And my credibility.",
            voiceDuration: "0:32",
            delay: 4000,
        },
        {
            id: 5,
            type: 'user-choice',
            content: "What's YOUR background?",
            choices: [
                "Healthcare (nurse, PA, medical)",
                "Wellness (coach, yoga, nutrition)",
                "Personal healing journey",
                "Career changer seeking purpose"
            ],
        },

        // SECTION: Healthcare Professionals
        {
            id: 6,
            type: 'coach',
            content: "No matter your background, you have something valuable.",
            delay: 3000,
        },
        {
            id: 7,
            type: 'system',
            content: "**If You're in Healthcare:**\n\nYour advantage:\n• You understand the medical system from the inside\n• You speak the language—labs, diagnoses, medications\n• You've seen what works AND what doesn't\n• Patients trust you because you've \"been there\"\n\n→ You're not learning from scratch. You're ADDING to what you know.",
            systemStyle: 'takeaway',
            delay: 5000,
        },
        {
            id: 8,
            type: 'coach',
            content: "Linda was an ER nurse for 23 years before she became an FM coach.",
            delay: 3200,
        },
        {
            id: 9,
            type: 'system',
            content: "**Linda's Story:**\n\n\"I thought I'd have to unlearn everything. But my clinical eye? That's gold. I can spot patterns other coaches miss. And my clients know I've seen REAL medicine—I'm not anti-doctor, I'm pro-WHOLE person.\"",
            systemStyle: 'quote',
            delay: 4500,
        },

        // SECTION: Wellness Professionals
        {
            id: 10,
            type: 'coach',
            content: "And if you're already in wellness?",
            delay: 2800,
        },
        {
            id: 11,
            type: 'system',
            content: "**If You're in Wellness:**\n\nYour advantage:\n• You already know how to coach and support people\n• You understand the mind-body connection\n• You've seen lifestyle changes create real results\n• You have a practice (or following) you can expand\n\n→ FM gives you the deeper CLINICAL tools to go further.",
            systemStyle: 'takeaway',
            delay: 5000,
        },
        {
            id: 12,
            type: 'coach',
            content: "Jennifer was a yoga teacher who kept hitting a wall with chronic illness clients.",
            delay: 3200,
        },
        {
            id: 13,
            type: 'system',
            content: "**Jennifer's Story:**\n\n\"Yoga is amazing, but it wasn't enough for clients with autoimmune issues, gut problems, chronic fatigue. Once I added FM protocols, I could finally help them at a deeper level. My 6-week programs went from $150 to $497.\"",
            systemStyle: 'quote',
            delay: 4500,
        },

        // SECTION: Personal Healing Journey
        {
            id: 14,
            type: 'coach',
            content: "What if you don't have a medical or wellness background?",
            delay: 3000,
        },
        {
            id: 15,
            type: 'coach',
            content: "What if you're here because of your OWN health journey?",
            delay: 3000,
        },
        {
            id: 16,
            type: 'voice-note',
            content: "That might be the most powerful advantage of all. Because you KNOW what it feels like to be dismissed. To be told 'your labs are normal' when you know something is wrong. That empathy? That's priceless. Your clients will trust you because you've walked the path.",
            voiceDuration: "0:28",
            delay: 4000,
        },
        {
            id: 17,
            type: 'system',
            content: "**If You've Healed Yourself:**\n\nYour advantage:\n• You have lived experience—the most powerful teacher\n• You understand the emotional side of chronic illness\n• You've tested what works (and what doesn't)\n• Clients connect with your story deeply\n\n→ Your struggle is now your expertise.",
            systemStyle: 'takeaway',
            delay: 5000,
        },
        {
            id: 18,
            type: 'coach',
            content: "Maria had Hashimoto's for 8 years. Doctors just kept adjusting her meds.",
            delay: 3200,
        },
        {
            id: 19,
            type: 'system',
            content: "**Maria's Story:**\n\n\"I healed my own thyroid through FM principles. Now I coach other women with Hashimoto's. They pay me because I've BEEN there. I'm not just giving them theory—I'm giving them what actually worked.\"",
            systemStyle: 'quote',
            delay: 4500,
        },

        // THE CORE MESSAGE
        {
            id: 20,
            type: 'coach',
            content: "Here's what I want you to understand, {name}:",
            delay: 3000,
        },
        {
            id: 21,
            type: 'coach',
            content: "You don't need to be a doctor.",
            delay: 2500,
        },
        {
            id: 22,
            type: 'coach',
            content: "You don't need decades of experience.",
            delay: 2500,
        },
        {
            id: 23,
            type: 'coach',
            content: "You need the RIGHT framework—and the courage to use what you already know.",
            delay: 3500,
        },
        {
            id: 24,
            type: 'system',
            content: "**The FM Coach Formula:**\n\nYour Background + FM Framework = Your Unique Value\n\n• Healthcare + FM = Clinical depth most coaches lack\n• Wellness + FM = Holistic approach backed by science\n• Personal journey + FM = Lived experience + proven methods",
            systemStyle: 'takeaway',
            delay: 5000,
        },
        {
            id: 25,
            type: 'user-choice',
            content: "What's your unique advantage going to be?",
            choices: [
                "My healthcare experience + FM framework",
                "My coaching skills + clinical knowledge",
                "My personal healing story + proven methods"
            ],
            showReaction: true,
        },

        // LOOKING AHEAD
        {
            id: 26,
            type: 'coach',
            content: "THAT is exactly why you're here.",
            delay: 2800,
        },
        {
            id: 27,
            type: 'coach',
            content: "You already have something valuable. We're just giving you the framework to use it.",
            delay: 3500,
        },
        {
            id: 28,
            type: 'voice-note',
            content: "In the next three lessons, we're going to dive into the systems that matter most: gut health, hormones, and how to connect the dots like an FM practitioner. This is where it gets really practical.",
            voiceDuration: "0:22",
            delay: 4000,
        },
        {
            id: 29,
            type: 'system',
            content: "**Lesson 3 Key Takeaway:**\n\nYour background isn't a liability—it's your unfair advantage.\n\nWhether you're from healthcare, wellness, or your own healing journey, YOU bring something to this field that nobody else has: YOUR story.",
            systemStyle: 'takeaway',
            delay: 4500,
        },
        {
            id: 30,
            type: 'coach',
            content: `I'm proud of you for being here, {name}. Let's keep going.`,
            delay: 3000,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Your Unfair Advantage"
            lessonSubtitle="Why your background matters"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
