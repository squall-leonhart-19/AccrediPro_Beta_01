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
 * Lesson 6: Connecting the Dots
 * Thinking like an FM practitioner
 */
export function LessonConnectingDots({
    onComplete,
    onNext,
    isCompleted = false,
    lessonNumber = 6,
    totalLessons = 9,
    firstName = "friend",
}: LessonProps) {
    const messages: Message[] = [
        // INTRO
        {
            id: 1,
            type: 'coach',
            content: `{name}, this lesson is where it all comes together.`,
            delay: 2500,
        },
        {
            id: 2,
            type: 'coach',
            content: "We've covered the 7 Systems, gut health, and hormones.",
            delay: 3000,
        },
        {
            id: 3,
            type: 'coach',
            content: "Now let's learn how to CONNECT THE DOTS like a real FM practitioner.",
            delay: 3200,
        },
        {
            id: 4,
            type: 'voice-note',
            content: "This is the skill that separates good coaches from great ones. Anyone can learn facts. But seeing patterns? Finding the one thread that ties everything together? That's where the magic happens.",
            voiceDuration: "0:22",
            delay: 4000,
        },

        // THE FM THINKING PROCESS
        {
            id: 5,
            type: 'coach',
            content: "Let me teach you the FM thinking process:",
            delay: 2800,
        },
        {
            id: 6,
            type: 'system',
            content: "**The FM Thinking Process:**\n\n1️⃣ **GATHER** — Listen to the full story\n2️⃣ **ORGANIZE** — Map symptoms to body systems\n3️⃣ **CONNECT** — Find the patterns and links\n4️⃣ **PRIORITIZE** — Identify the upstream issue\n5️⃣ **ACT** — Address root cause first",
            systemStyle: 'info',
            delay: 5000,
        },
        {
            id: 7,
            type: 'coach',
            content: "Let's practice with a real case.",
            delay: 2800,
        },

        // CASE STUDY WALKTHROUGH
        {
            id: 8,
            type: 'system',
            content: "**Case: Patricia, 51**\n\nSymptoms she reports:\n• Constant fatigue (worse after lunch)\n• Brain fog, can't focus\n• Belly bloat, especially after eating\n• Gained 20 lbs in the past 2 years\n• Anxious and irritable\n• Terrible sleep (wakes at 3am)\n• Joint pain in the mornings\n• Skin breakouts on chin and jawline",
            systemStyle: 'quote',
            delay: 5500,
        },
        {
            id: 9,
            type: 'coach',
            content: "Step 1: Let's ORGANIZE these by body system.",
            delay: 3000,
        },
        {
            id: 10,
            type: 'system',
            content: "**Mapping Patricia's Symptoms:**\n\n🔹 **Gut:** Bloating after eating\n🔹 **Hormones:** Weight gain, chin breakouts (hormonal acne)\n🔹 **Immune:** Joint pain, inflammation signs\n🔹 **Energy:** Fatigue, worse after lunch\n🔹 **Nervous System:** Anxiety, irritability, poor sleep\n🔹 **Detox:** Skin issues (toxins coming out)\n\n→ 6 out of 7 systems are showing symptoms!",
            systemStyle: 'info',
            delay: 5500,
        },
        {
            id: 11,
            type: 'user-choice',
            content: "Looking at this map, which system would YOU investigate FIRST?",
            choices: [
                "Gut—bloating suggests digestion issues",
                "Hormones—weight gain and skin breakouts",
                "Nervous system—stress is affecting everything"
            ],
        },
        {
            id: 12,
            type: 'coach',
            content: "Great thinking! Here's how an FM practitioner would connect the dots:",
            delay: 3000,
        },
        {
            id: 13,
            type: 'system',
            content: "**Connecting Patricia's Dots:**\n\n**The Pattern:**\nBloating after eating → suggests gut inflammation\nGut inflammation → triggers immune response\nImmune activation → causes systemic inflammation\nInflammation → disrupts hormones and sleep\nPoor sleep + inflammation → increases cortisol\nHigh cortisol → weight gain, anxiety, more inflammation\n\n**The Root:** Everything traces back to GUT DYSFUNCTION",
            systemStyle: 'takeaway',
            delay: 6000,
        },
        {
            id: 14,
            type: 'voice-note',
            content: "See how it works? We didn't need 6 different specialists. We found ONE upstream issue—the gut—and when we fix that, the other symptoms start resolving. This is the power of systems thinking.",
            voiceDuration: "0:24",
            delay: 4000,
        },

        // THE PRIORITY QUESTION
        {
            id: 15,
            type: 'coach',
            content: "The key question FM practitioners always ask:",
            delay: 2800,
        },
        {
            id: 16,
            type: 'system',
            content: "**The Priority Question:**\n\n\"What is the ONE upstream issue that, if we fix it first, will have the biggest ripple effect?\"\n\nUsually it's:\n• Gut health\n• Chronic stress/cortisol\n• Blood sugar regulation\n• A hidden infection or toxin\n\nFix the upstream issue → Downstream symptoms improve.",
            systemStyle: 'takeaway',
            delay: 5500,
        },
        {
            id: 17,
            type: 'user-choice',
            content: "Does this way of thinking make sense?",
            choices: [
                "YES—this is totally different from conventional medicine",
                "I'm starting to see patterns I never noticed before",
                "This is exactly what I want to do for people"
            ],
            showReaction: true,
        },

        // ANOTHER QUICK CASE
        {
            id: 18,
            type: 'coach',
            content: "Let's try one more quick case to practice:",
            delay: 2800,
        },
        {
            id: 19,
            type: 'system',
            content: "**Quick Case: David, 45**\n\n• High blood pressure (on medication)\n• Pre-diabetic (A1C 5.9)\n• Overweight, especially belly fat\n• Low energy, crashes at 3pm\n• Poor sleep, snores heavily\n• Craves sugar and carbs",
            systemStyle: 'quote',
            delay: 4500,
        },
        {
            id: 20,
            type: 'user-choice',
            content: "What's likely the upstream issue for David?",
            choices: [
                "Blood sugar/insulin resistance",
                "Gut health",
                "Stress and cortisol"
            ],
        },
        {
            id: 21,
            type: 'coach',
            content: "Excellent instinct!",
            delay: 2500,
        },
        {
            id: 22,
            type: 'system',
            content: "**David's Connection:**\n\n**Root Issue:** Insulin resistance / blood sugar dysregulation\n\n• High carb diet → Insulin spikes → Fat storage → Belly fat\n• Insulin resistance → Energy crashes → Cravings\n• Belly fat → Sleep apnea → Poor sleep → More cortisol\n• High cortisol → Higher blood pressure\n• High insulin → Pre-diabetes\n\n→ Fix the blood sugar, and multiple issues improve.",
            systemStyle: 'takeaway',
            delay: 5500,
        },
        {
            id: 23,
            type: 'coach',
            content: "His doctor put him on blood pressure meds. But the REAL issue is blood sugar.",
            delay: 3200,
        },
        {
            id: 24,
            type: 'voice-note',
            content: "This is why FM is so needed. Conventional medicine treats each symptom separately. We see the web. We find the cause. And we help people actually HEAL instead of just managing symptoms with pills.",
            voiceDuration: "0:22",
            delay: 4000,
        },

        // WRAP UP
        {
            id: 25,
            type: 'coach',
            content: "You're now thinking like an FM practitioner, {name}.",
            delay: 3000,
        },
        {
            id: 26,
            type: 'coach',
            content: "Seeing connections. Finding patterns. Looking upstream.",
            delay: 3000,
        },
        {
            id: 27,
            type: 'system',
            content: "**Lesson 6 Key Takeaway:**\n\nFM thinking is about CONNECTING symptoms across body systems to find the root cause.\n\nThe question isn't \"what pill fixes this symptom?\" It's \"what's upstream causing all of this?\"\n\nFix the root → The branches heal themselves.",
            systemStyle: 'takeaway',
            delay: 5000,
        },
        {
            id: 28,
            type: 'coach',
            content: "In the next lesson, we shift gears. We'll talk about actually WORKING with clients.",
            delay: 3200,
        },
        {
            id: 29,
            type: 'coach',
            content: `You're doing amazing, {name}. See you in Lesson 7!`,
            delay: 2800,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Connecting the Dots"
            lessonSubtitle="Thinking like an FM practitioner"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
