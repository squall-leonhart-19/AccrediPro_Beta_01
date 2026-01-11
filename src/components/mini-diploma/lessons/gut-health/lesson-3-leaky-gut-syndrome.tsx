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

export function LessonLeakyGutSyndrome({
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
            content: `Hey {name}! Welcome to lesson 3 🌟 Today we're diving into something you've probably heard about but might not fully understand - leaky gut syndrome. It's one of those topics that can sound scary, but knowledge is power, and I'm here to guide you through it!`,
        },
        {
            id: 2,
            type: 'system',
            content: `**What is Leaky Gut Syndrome?**
• Also called 'intestinal permeability'
• Occurs when the tight junctions in your intestinal wall become loose
• Allows undigested food particles, toxins, and bacteria to 'leak' into your bloodstream
• Can trigger inflammation and immune system responses
• Not officially recognized as a medical diagnosis, but increasingly studied`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think of your gut lining like a selective security system at an airport. Normally, it only lets the 'good passengers' (nutrients) through while keeping out the 'troublemakers' (toxins and harmful particles). When leaky gut occurs, that security system gets compromised.`,
        },
        {
            id: 4,
            type: 'system',
            content: `**Common Signs and Symptoms**
• Chronic digestive issues (bloating, gas, diarrhea, IBS)
• Food sensitivities that seem to multiply over time
• Autoimmune conditions
• Skin problems like eczema or acne
• Fatigue and brain fog
• Joint pain and inflammation
• Mood disorders and anxiety`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `Which of these factors do you think is MOST likely to contribute to leaky gut?`,
            choices: ["Eating too much fiber", "Chronic stress and poor sleep", "Drinking too much water"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Great thinking! Chronic stress is indeed a major culprit. When we're constantly stressed, our body produces cortisol, which can damage the gut lining over time. But there are several other factors we need to discuss too.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Primary Causes of Leaky Gut**
• Chronic stress and elevated cortisol levels
• Standard American Diet (high sugar, processed foods, alcohol)
• Overuse of antibiotics and NSAIDs
• Infections (bacterial, viral, parasitic, or fungal overgrowth)
• Environmental toxins and chemicals
• Genetic predisposition
• Lack of sleep and poor lifestyle habits`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'coach',
            content: `Here's what's really important to understand: leaky gut doesn't happen overnight. It's usually the result of multiple factors building up over time. The good news? That means we can also heal it step by step! 💪`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Testing for Leaky Gut**
• Lactulose/Mannitol test (measures intestinal permeability)
• Zonulin blood test (measures a protein that regulates gut permeability)
• Comprehensive stool analysis
• Food sensitivity testing
• Work with a functional medicine practitioner for proper assessment
• Note: Many conventional doctors may not offer these tests`,
            systemStyle: 'info',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `If someone suspects they have leaky gut, what should be their FIRST step?`,
            choices: ["Start taking expensive supplements immediately", "Work with a qualified healthcare provider for proper testing", "Eliminate all foods except rice and chicken"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Exactly right! While it's tempting to jump into extreme diets or supplement protocols, getting proper testing and professional guidance is crucial. Everyone's gut situation is unique, and what works for one person might not work for another.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**The Healing Process**
• Remove triggers (inflammatory foods, stress, toxins)
• Replace with healing foods and digestive enzymes
• Reinoculate with beneficial probiotics
• Repair the gut lining with specific nutrients
• Rebalance lifestyle factors (stress, sleep, exercise)
• Be patient - healing can take 3-6 months or longer`,
            systemStyle: 'takeaway',
        },
        {
            id: 13,
            type: 'coach',
            content: `Remember {name}, if you suspect you might have leaky gut, you're not broken or doomed! The gut has an amazing ability to heal itself when given the right support. In our next lesson, we'll explore the gut-brain connection and how your digestive health affects your mental wellbeing.`,
        },
        {
            id: 14,
            type: 'system',
            content: `"The gut is not like Las Vegas. What happens in the gut does not stay in the gut." - Dr. Alessio Fasano, leading researcher in intestinal permeability`,
            systemStyle: 'quote',
        },
        {
            id: 15,
            type: 'coach',
            content: `You're doing amazing work learning about these complex topics! Take some time to reflect on what resonated with you today. See you in lesson 4 where we'll discover the fascinating world of the gut-brain axis! 🧠`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Leaky Gut Syndrome"
            lessonSubtitle="When the gut barrier breaks down"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
