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
 * Lesson 4: The Gut-Health Connection
 * Deep dive into gut health and why it matters for everything
 */
export function LessonGutHealth({
    onComplete,
    onNext,
    isCompleted = false,
    lessonNumber = 4,
    totalLessons = 9,
    firstName = "friend",
}: LessonProps) {
    const messages: Message[] = [
        // INTRO
        {
            id: 1,
            type: 'coach',
            content: `Okay {name}, it's time to talk about the gut.`,
            delay: 2500,
        },
        {
            id: 2,
            type: 'coach',
            content: "In FM, we have a saying:",
            delay: 2500,
        },
        {
            id: 3,
            type: 'system',
            content: "**\"All disease begins in the gut.\"**\n\n— Hippocrates, 2,400 years ago\n\n(Turns out he was onto something.)",
            systemStyle: 'quote',
            delay: 4000,
        },
        {
            id: 4,
            type: 'coach',
            content: "Modern research has proven this over and over.",
            delay: 3000,
        },
        {
            id: 5,
            type: 'voice-note',
            content: "When I finally fixed my gut, my energy came back, my brain fog lifted, my mood stabilized, and I lost the weight I'd been carrying for years. It wasn't magic—it was just removing what was causing the problem.",
            voiceDuration: "0:25",
            delay: 4000,
        },

        // THE GUT BASICS
        {
            id: 6,
            type: 'coach',
            content: "Let me give you the crash course on why gut health matters SO much:",
            delay: 3000,
        },
        {
            id: 7,
            type: 'system',
            content: "**Why the Gut is the Center of Health:**\n\n• 70% of your immune system lives in your gut\n• 90% of serotonin (your \"happy hormone\") is made in your gut\n• Your gut has its own nervous system (\"the second brain\")\n• Trillions of bacteria influence everything from weight to mood\n\n→ When the gut is off, EVERYTHING is off.",
            systemStyle: 'info',
            delay: 5500,
        },
        {
            id: 8,
            type: 'user-choice',
            content: "Have you experienced gut issues yourself?",
            choices: [
                "Yes—bloating, gas, digestion problems",
                "Not obviously, but I have other symptoms",
                "I work with clients who have gut issues"
            ],
        },

        // LEAKY GUT EXPLAINED
        {
            id: 9,
            type: 'coach',
            content: "Here's something most people don't know about:",
            delay: 3000,
        },
        {
            id: 10,
            type: 'coach',
            content: "It's called 'leaky gut'—and it's at the root of SO many conditions.",
            delay: 3200,
        },
        {
            id: 11,
            type: 'system',
            content: "**What is Leaky Gut?**\n\nYour intestinal lining should be like a fine mesh net—letting nutrients through but keeping toxins OUT.\n\nWhen this lining gets damaged:\n• Gaps form between the cells\n• Toxins and undigested food particles \"leak\" into the bloodstream\n• Your immune system attacks these \"invaders\"\n• Result: chronic inflammation throughout the body",
            systemStyle: 'info',
            delay: 5500,
        },
        {
            id: 12,
            type: 'coach',
            content: "And chronic inflammation is linked to almost EVERY disease:",
            delay: 3000,
        },
        {
            id: 13,
            type: 'system',
            content: "**Conditions Linked to Leaky Gut:**\n\n• Autoimmune diseases (Hashimoto's, RA, Lupus)\n• Skin issues (eczema, acne, rashes)\n• Brain fog and fatigue\n• Weight gain and metabolic issues\n• Depression and anxiety\n• Allergies and food sensitivities",
            systemStyle: 'stats',
            delay: 4500,
        },
        {
            id: 14,
            type: 'voice-note',
            content: "This is why someone can go to 10 different specialists and never get answers. The dermatologist treats the skin. The psychiatrist treats the mood. The endocrinologist treats the thyroid. But NOBODY is looking at the gut that's driving ALL of it.",
            voiceDuration: "0:28",
            delay: 4000,
        },

        // WHAT CAUSES GUT ISSUES
        {
            id: 15,
            type: 'coach',
            content: "So what CAUSES gut problems in the first place?",
            delay: 3000,
        },
        {
            id: 16,
            type: 'system',
            content: "**Common Gut Disruptors:**\n\n• Chronic stress (shuts down digestion)\n• Processed foods and sugar\n• Antibiotics (kills good AND bad bacteria)\n• NSAIDs (Advil, ibuprofen) damage gut lining\n• Alcohol\n• Pesticides on food\n• Low fiber diet",
            systemStyle: 'info',
            delay: 5000,
        },
        {
            id: 17,
            type: 'coach',
            content: "Look at that list. Most people are hitting 3-4 of these DAILY.",
            delay: 3200,
        },
        {
            id: 18,
            type: 'user-choice',
            content: "How many of those apply to you or your clients?",
            choices: [
                "Stress and processed food for sure",
                "I've taken lots of antibiotics over the years",
                "Honestly, most of them 😅"
            ],
        },

        // THE 4R PROTOCOL
        {
            id: 19,
            type: 'coach',
            content: "Here's the good news: The gut can HEAL.",
            delay: 3000,
        },
        {
            id: 20,
            type: 'coach',
            content: "In FM, we use something called the 4R Protocol:",
            delay: 3000,
        },
        {
            id: 21,
            type: 'system',
            content: "**The 4R Protocol:**\n\n**1️⃣ REMOVE**\nRemove triggers (food sensitivities, infections, toxins)\n\n**2️⃣ REPLACE**\nReplace what's missing (digestive enzymes, stomach acid)\n\n**3️⃣ REINOCULATE**\nReintroduce beneficial bacteria (probiotics, fermented foods)\n\n**4️⃣ REPAIR**\nRepair the gut lining (L-glutamine, bone broth, collagen)",
            systemStyle: 'takeaway',
            delay: 6000,
        },
        {
            id: 22,
            type: 'coach',
            content: "This is a SIMPLIFIED version—there's more nuance in practice.",
            delay: 3200,
        },
        {
            id: 23,
            type: 'coach',
            content: "But this framework alone puts you ahead of 90% of practitioners.",
            delay: 3200,
        },

        // CLIENT APPLICATION
        {
            id: 24,
            type: 'coach',
            content: "Let me show you how this plays out with a client:",
            delay: 3000,
        },
        {
            id: 25,
            type: 'system',
            content: "**Case Study: Michelle**\n\nComplained of: Chronic bloating, fatigue, and brain fog\n\nConventional approach: \"IBS. Take this fiber supplement.\"\n\n**FM Approach (4R Protocol):**\n\n✓ REMOVE: Identified gluten as a trigger through elimination diet\n✓ REPLACE: Added digestive enzymes before meals\n✓ REINOCULATE: Started quality probiotic + fermented foods\n✓ REPAIR: L-glutamine powder + bone broth daily\n\n→ Results: 80% symptom improvement in 6 weeks",
            systemStyle: 'takeaway',
            delay: 6500,
        },
        {
            id: 26,
            type: 'voice-note',
            content: "This is what FM coaching looks like in action. You're not prescribing medication. You're using FOOD and LIFESTYLE as medicine. And honestly? It often works better than pills—because you're fixing the root cause, not masking symptoms.",
            voiceDuration: "0:26",
            delay: 4000,
        },

        // WRAP UP
        {
            id: 27,
            type: 'user-choice',
            content: "Can you see how powerful this approach is?",
            choices: [
                "This is exactly what I want to learn to do",
                "I've tried some of this myself—it works!",
                "Mind blown 🤯"
            ],
            showReaction: true,
        },
        {
            id: 28,
            type: 'coach',
            content: "In the full certification, we go DEEP into gut protocols.",
            delay: 3000,
        },
        {
            id: 29,
            type: 'coach',
            content: "But even this foundation puts you miles ahead.",
            delay: 2800,
        },
        {
            id: 30,
            type: 'system',
            content: "**Lesson 4 Key Takeaway:**\n\nThe gut is the foundation of health. When you learn to heal the gut, you can help people with conditions that seem completely unrelated—from skin issues to brain fog to autoimmune problems.\n\nThe 4R Protocol is your roadmap.",
            systemStyle: 'takeaway',
            delay: 5000,
        },
        {
            id: 31,
            type: 'coach',
            content: "Next up: Hormones & Thyroid. Another system that connects to EVERYTHING.",
            delay: 3200,
        },
        {
            id: 32,
            type: 'coach',
            content: `Great work today, {name}!`,
            delay: 2500,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Gut-Health Connection"
            lessonSubtitle="Where healing begins"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
