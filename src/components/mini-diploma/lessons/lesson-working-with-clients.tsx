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
 * Lesson 7: Working With Clients
 * The practical side of FM coaching
 */
export function LessonWorkingWithClients({
    onComplete,
    onNext,
    isCompleted = false,
    lessonNumber = 7,
    totalLessons = 9,
    firstName = "friend",
}: LessonProps) {
    const messages: Message[] = [
        // INTRO
        {
            id: 1,
            type: 'coach',
            content: `{name}, we're in the home stretch now!`,
            delay: 2500,
        },
        {
            id: 2,
            type: 'coach',
            content: "You've learned the theory. Now let's talk about DOING the work.",
            delay: 3000,
        },
        {
            id: 3,
            type: 'coach',
            content: "How do you actually work with clients as an FM health coach?",
            delay: 3000,
        },
        {
            id: 4,
            type: 'voice-note',
            content: "I remember my first client. I was terrified I didn't know enough. But here's what I learned: You don't need to have all the answers. You need to ask the right questions and guide the process. Let me show you what that looks like.",
            voiceDuration: "0:26",
            delay: 4000,
        },

        // WHAT FM COACHES DO
        {
            id: 5,
            type: 'coach',
            content: "First, let's be clear about what FM coaches DO and DON'T do:",
            delay: 3000,
        },
        {
            id: 6,
            type: 'system',
            content: "**What FM Health Coaches DO:**\n\n✅ Guide clients through lifestyle changes\n✅ Help implement nutrition protocols\n✅ Teach stress management techniques\n✅ Track progress and adjust strategies\n✅ Provide accountability and support\n✅ Recommend functional labs (not diagnose)\n✅ Educate clients on root cause health",
            systemStyle: 'info',
            delay: 5000,
        },
        {
            id: 7,
            type: 'system',
            content: "**What FM Health Coaches DON'T DO:**\n\n❌ Diagnose diseases\n❌ Prescribe medications\n❌ Order labs (unless certified to do so)\n❌ Replace medical care\n❌ Treat acute conditions\n\n→ We work ALONGSIDE the medical system, not against it.",
            systemStyle: 'comparison',
            delay: 5000,
        },
        {
            id: 8,
            type: 'coach',
            content: "This is actually your ADVANTAGE.",
            delay: 2800,
        },
        {
            id: 9,
            type: 'coach',
            content: "Doctors don't have time for lifestyle coaching. That's where YOU come in.",
            delay: 3200,
        },

        // CLIENT JOURNEY
        {
            id: 10,
            type: 'coach',
            content: "Let me walk you through a typical client journey:",
            delay: 2800,
        },
        {
            id: 11,
            type: 'system',
            content: "**The Client Journey:**\n\n**Week 1-2: Discovery**\n• Comprehensive intake (history, symptoms, lifestyle)\n• Identify patterns using the 7 Systems\n• Set initial goals and expectations\n\n**Week 3-6: Foundation**\n• Implement core protocols (gut, blood sugar, etc.)\n• Teach key lifestyle changes\n• Track symptoms and adjust\n\n**Week 7-12: Optimization**\n• Deeper work on root causes\n• Fine-tune what's working\n• Build sustainable habits",
            systemStyle: 'info',
            delay: 6000,
        },
        {
            id: 12,
            type: 'user-choice',
            content: "Can you see yourself guiding clients through this process?",
            choices: [
                "Yes! This feels doable",
                "I'd need more training, but I can see it",
                "I'm already doing some of this informally"
            ],
        },

        // THE INTAKE CALL
        {
            id: 13,
            type: 'coach',
            content: "The most important skill: The INTAKE CALL.",
            delay: 3000,
        },
        {
            id: 14,
            type: 'coach',
            content: "This is where you gather the client's full story.",
            delay: 2800,
        },
        {
            id: 15,
            type: 'system',
            content: "**Key Intake Questions:**\n\n• \"Tell me your health story—start wherever feels right.\"\n• \"When did you last feel truly WELL?\"\n• \"What happened around the time symptoms started?\"\n• \"What's your energy like throughout the day?\"\n• \"How is your digestion? Sleep? Mood?\"\n• \"What have you already tried?\"\n• \"What would your life look like if you solved this?\"",
            systemStyle: 'exercise',
            delay: 5500,
        },
        {
            id: 16,
            type: 'voice-note',
            content: "Most clients have NEVER been asked these questions. Doctors get 15 minutes. You might spend an hour really LISTENING. That alone is healing. People feel SEEN for the first time in years.",
            voiceDuration: "0:22",
            delay: 4000,
        },

        // PRACTICAL PROTOCOLS
        {
            id: 17,
            type: 'coach',
            content: "Now, what kind of protocols do you actually implement?",
            delay: 3000,
        },
        {
            id: 18,
            type: 'system',
            content: "**Common FM Coaching Protocols:**\n\n🥗 **Nutrition:**\n• Elimination diets (find food triggers)\n• Blood sugar balancing\n• Gut healing foods\n\n💊 **Supplements:**\n• Probiotics, digestive enzymes\n• Targeted nutrients\n• Adaptogenic herbs\n\n🧘 **Lifestyle:**\n• Sleep optimization\n• Stress management\n• Movement that heals (not harms)\n\n🧪 **Labs:**\n• Interpret functional lab results\n• Recommend relevant testing",
            systemStyle: 'info',
            delay: 6000,
        },
        {
            id: 19,
            type: 'coach',
            content: "The full certification goes DEEP into each of these protocols.",
            delay: 3200,
        },
        {
            id: 20,
            type: 'coach',
            content: "But even this foundation lets you start helping people TODAY.",
            delay: 3000,
        },

        // SESSION STRUCTURE
        {
            id: 21,
            type: 'coach',
            content: "Let me show you what a typical coaching session looks like:",
            delay: 2800,
        },
        {
            id: 22,
            type: 'system',
            content: "**45-Minute Coaching Session:**\n\n**First 10 min:** Check-in\n• How are you feeling?\n• What wins/challenges this week?\n• Review symptom tracking\n\n**Middle 25 min:** Deep work\n• Address the biggest issue\n• Teach or adjust protocols\n• Problem-solve barriers\n\n**Final 10 min:** Action planning\n• What's the ONE focus for next week?\n• Specific, measurable action items\n• Schedule next session",
            systemStyle: 'exercise',
            delay: 5500,
        },
        {
            id: 23,
            type: 'user-choice',
            content: "Does this structure feel manageable?",
            choices: [
                "Yes—I could do this!",
                "I'd need practice, but it makes sense",
                "I want to learn the protocols deeper"
            ],
            showReaction: true,
        },

        // SCOPE OF PRACTICE
        {
            id: 24,
            type: 'coach',
            content: "One more important thing: SCOPE OF PRACTICE.",
            delay: 2800,
        },
        {
            id: 25,
            type: 'system',
            content: "**Know Your Scope:**\n\nAs a health coach, you can:\n• Educate and inform\n• Guide lifestyle changes\n• Recommend (not prescribe) supplements\n• Suggest labs to discuss with their doctor\n• Provide accountability and support\n\nWhen to refer out:\n• Acute symptoms (chest pain, etc.)\n• Mental health crises\n• Suspected serious conditions\n• Anything that needs a diagnosis",
            systemStyle: 'takeaway',
            delay: 5500,
        },
        {
            id: 26,
            type: 'voice-note',
            content: "Working within your scope isn't a limitation—it's protection for you AND your clients. And honestly? The lifestyle piece is often what makes the BIGGEST difference anyway.",
            voiceDuration: "0:18",
            delay: 4000,
        },

        // WRAP UP
        {
            id: 27,
            type: 'coach',
            content: "You're getting a real picture of what this work looks like, {name}.",
            delay: 3000,
        },
        {
            id: 28,
            type: 'system',
            content: "**Lesson 7 Key Takeaway:**\n\nFM coaching is about guiding clients through lifestyle change—not diagnosing or prescribing.\n\nThe power is in the questions you ask, the protocols you teach, and the accountability you provide.\n\nYou're the partner they've been missing.",
            systemStyle: 'takeaway',
            delay: 5000,
        },
        {
            id: 29,
            type: 'coach',
            content: "Next lesson: We talk about building your PRACTICE. How to actually get paid for this work!",
            delay: 3200,
        },
        {
            id: 30,
            type: 'coach',
            content: `See you there, {name}!`,
            delay: 2500,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Working With Clients"
            lessonSubtitle="The practical side of coaching"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
