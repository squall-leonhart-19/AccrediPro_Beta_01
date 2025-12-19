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
 * Lesson 5: Hormones & Thyroid
 * Understanding the body's messaging system
 */
export function LessonHormonesThyroid({
    onComplete,
    onNext,
    isCompleted = false,
    lessonNumber = 5,
    totalLessons = 9,
    firstName = "friend",
}: LessonProps) {
    const messages: Message[] = [
        // INTRO
        {
            id: 1,
            type: 'coach',
            content: `{name}, let's talk about hormones.`,
            delay: 2500,
        },
        {
            id: 2,
            type: 'coach',
            content: "If the gut is the foundation of health, hormones are the MESSENGERS.",
            delay: 3200,
        },
        {
            id: 3,
            type: 'voice-note',
            content: "When my thyroid was struggling, I had no idea that was the problem. I just knew I was exhausted, gaining weight, losing hair, and feeling like a shell of myself. Doctors said my labs were 'normal.' But normal isn't the same as optimal.",
            voiceDuration: "0:28",
            delay: 4000,
        },
        {
            id: 4,
            type: 'user-choice',
            content: "Have you or someone you know struggled with hormonal issues?",
            choices: [
                "Yes—thyroid problems specifically",
                "Fatigue, weight gain, mood issues",
                "I see this constantly in clients"
            ],
        },

        // HORMONES 101
        {
            id: 5,
            type: 'coach',
            content: "First, let's understand what hormones actually DO:",
            delay: 3000,
        },
        {
            id: 6,
            type: 'system',
            content: "**Hormones: Your Body's Messaging System**\n\nHormones are chemical messengers that tell your cells what to do.\n\n• Thyroid hormones → Control metabolism and energy\n• Cortisol → Stress response and blood sugar\n• Insulin → Blood sugar regulation\n• Estrogen/Progesterone → Reproductive and mood\n• Testosterone → Energy, muscle, libido\n\n→ When one is off, it affects ALL the others.",
            systemStyle: 'info',
            delay: 5500,
        },
        {
            id: 7,
            type: 'coach',
            content: "And here's the key insight:",
            delay: 2800,
        },
        {
            id: 8,
            type: 'system',
            content: "**The Hormone Cascade:**\n\nStress → High cortisol → Thyroid slows down → Metabolism drops → Weight gain → More stress\n\nIt's a vicious cycle. And it's why \"just eat less\" doesn't work for most people.",
            systemStyle: 'comparison',
            delay: 4500,
        },

        // THYROID DEEP DIVE
        {
            id: 9,
            type: 'coach',
            content: "Let's talk about the thyroid specifically.",
            delay: 2800,
        },
        {
            id: 10,
            type: 'coach',
            content: "Because this is where conventional medicine REALLY fails people.",
            delay: 3200,
        },
        {
            id: 11,
            type: 'system',
            content: "**The Thyroid Problem:**\n\nMost doctors only test TSH (Thyroid Stimulating Hormone).\n\nBut TSH is just ONE piece of the puzzle.\n\nA complete thyroid panel includes:\n• TSH\n• Free T4\n• Free T3\n• Reverse T3\n• Thyroid antibodies (TPO, TgAb)\n\n→ Most people only get TSH tested.",
            systemStyle: 'info',
            delay: 5500,
        },
        {
            id: 12,
            type: 'voice-note',
            content: "My TSH was 3.2—technically 'normal' since the range is 0.5 to 4.5. But when we ran the full panel, my Free T3 was tanking and my antibodies were through the roof. I had Hashimoto's that no one had caught for YEARS.",
            voiceDuration: "0:26",
            delay: 4000,
        },
        {
            id: 13,
            type: 'coach',
            content: "This is SO common.",
            delay: 2500,
        },
        {
            id: 14,
            type: 'system',
            content: "**\"Normal\" vs. Optimal:**\n\nLab ranges are based on the average population.\n\nBut the average person is NOT healthy.\n\n**Example - TSH:**\n• Lab \"normal\": 0.5 - 4.5\n• FM \"optimal\": 1.0 - 2.0\n\nSomeone at 3.5 is \"normal\" but likely symptomatic.",
            systemStyle: 'comparison',
            delay: 5000,
        },
        {
            id: 15,
            type: 'user-choice',
            content: "Does this explain something you've experienced or seen?",
            choices: [
                "YES—I've been told I'm 'normal' but feel terrible",
                "I see this with clients all the time",
                "This is eye-opening"
            ],
            showReaction: true,
        },

        // GUT-THYROID CONNECTION
        {
            id: 16,
            type: 'coach',
            content: "Now here's where it connects to what we learned yesterday...",
            delay: 3000,
        },
        {
            id: 17,
            type: 'coach',
            content: "Remember the gut?",
            delay: 2500,
        },
        {
            id: 18,
            type: 'system',
            content: "**The Gut-Thyroid Connection:**\n\n• 20% of thyroid hormone conversion (T4→T3) happens in the gut\n• Leaky gut triggers autoimmune thyroid (Hashimoto's)\n• Inflammation from the gut suppresses thyroid function\n• Poor gut bacteria = poor hormone metabolism\n\n→ Fix the gut, and the thyroid often improves.",
            systemStyle: 'takeaway',
            delay: 5500,
        },
        {
            id: 19,
            type: 'voice-note',
            content: "This is the FM way of thinking. We don't just look at the thyroid in isolation. We ask: What's affecting it? What's upstream? And that's usually the gut, the stress response, or inflammation. Often all three.",
            voiceDuration: "0:24",
            delay: 4000,
        },

        // PRACTICAL APPLICATION
        {
            id: 20,
            type: 'coach',
            content: "So what does this mean practically?",
            delay: 2800,
        },
        {
            id: 21,
            type: 'system',
            content: "**FM Approach to Thyroid:**\n\n1. Get the FULL thyroid panel (not just TSH)\n2. Look at optimal ranges, not just \"normal\"\n3. Check for antibodies (autoimmune component)\n4. Address root causes:\n   • Heal the gut\n   • Reduce inflammation\n   • Manage stress (cortisol)\n   • Optimize nutrients (selenium, zinc, iodine)",
            systemStyle: 'takeaway',
            delay: 5500,
        },
        {
            id: 22,
            type: 'coach',
            content: "This is EXACTLY what FM coaches help clients navigate.",
            delay: 3200,
        },
        {
            id: 23,
            type: 'coach',
            content: "Not by prescribing medication—but by addressing the ROOT CAUSES.",
            delay: 3200,
        },

        // CASE STUDY
        {
            id: 24,
            type: 'coach',
            content: "Let me share a quick case study:",
            delay: 2800,
        },
        {
            id: 25,
            type: 'system',
            content: "**Case Study: Karen, 48**\n\nSymptoms: Fatigue, weight gain, hair loss, depression\nDoctor said: \"TSH is 3.8. You're fine. Here's an antidepressant.\"\n\n**FM Approach:**\n• Full thyroid panel revealed low Free T3 and elevated antibodies\n• Addressed gut health (gluten removal, 4R protocol)\n• Added targeted supplements (selenium, zinc)\n• Stress management protocols\n\n→ 4 months later: Energy back, 12 lbs lost, hair regrowing",
            systemStyle: 'takeaway',
            delay: 6000,
        },
        {
            id: 26,
            type: 'user-choice',
            content: "Can you see why FM coaches are so needed?",
            choices: [
                "This is exactly what the world needs",
                "I want to help people like Karen",
                "I could have been Karen—or AM Karen"
            ],
        },

        // WRAP UP
        {
            id: 27,
            type: 'coach',
            content: "You're learning to think like an FM practitioner now.",
            delay: 3000,
        },
        {
            id: 28,
            type: 'coach',
            content: "Connecting the dots. Seeing the bigger picture.",
            delay: 2800,
        },
        {
            id: 29,
            type: 'system',
            content: "**Lesson 5 Key Takeaway:**\n\nHormones are messengers—and they're all connected. The thyroid doesn't exist in isolation. It's affected by stress, gut health, inflammation, and nutrients.\n\n\"Normal\" labs don't mean optimal function. FM looks deeper.",
            systemStyle: 'takeaway',
            delay: 5000,
        },
        {
            id: 30,
            type: 'coach',
            content: "Tomorrow in Lesson 6, we'll put it ALL together—connecting the dots like a real FM practitioner.",
            delay: 3500,
        },
        {
            id: 31,
            type: 'coach',
            content: `Amazing progress, {name}!`,
            delay: 2500,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Hormones & Thyroid"
            lessonSubtitle="Your body's messaging system"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
