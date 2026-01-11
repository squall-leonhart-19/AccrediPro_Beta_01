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

export function LessonFoodSensitivities({
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
            content: `Hey {name}! Welcome to lesson 8 - one of the most game-changing topics we'll cover together 🎯 Today we're diving deep into food sensitivities and how to become a detective with your own body's reactions.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**Understanding Food Sensitivities vs. Allergies**
• Food allergies: Immediate immune response (IgE-mediated), can be life-threatening
• Food sensitivities: Delayed reaction (IgG/IgA-mediated), symptoms appear hours to days later
• Food intolerances: Digestive issues due to enzyme deficiencies (like lactose intolerance)
• Sensitivities are more common and often go undiagnosed for years`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Here's what's tricky about food sensitivities - you might eat something on Monday and not feel the effects until Wednesday! This delayed response makes them super challenging to identify without a systematic approach.`,
        },
        {
            id: 4,
            type: 'system',
            content: `**Common Food Sensitivity Symptoms**
• Digestive: Bloating, gas, diarrhea, constipation, stomach pain
• Neurological: Brain fog, headaches, mood swings, fatigue
• Skin: Eczema, acne, rashes, dry skin
• Respiratory: Congestion, runny nose, post-nasal drip
• Joint pain and muscle aches
• Sleep disturbances`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `Which of these symptoms have you noticed that might be related to foods you eat?`,
            choices: ["Digestive issues like bloating or irregular bowel movements", "Brain fog, fatigue, or mood changes", "Skin problems or congestion"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Great awareness! The connection between what we eat and how we feel goes way beyond just our digestive system. Now let's talk about the most common culprits behind food sensitivities.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Top Food Sensitivity Triggers**
• Gluten (wheat, barley, rye, oats with cross-contamination)
• Dairy (casein and whey proteins, not just lactose)
• Eggs (especially egg whites)
• Soy and soy-derived ingredients
• Corn and high-fructose corn syrup
• Nuts (particularly almonds and peanuts)
• Nightshades (tomatoes, peppers, potatoes, eggplant)
• Shellfish and certain fish`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'coach',
            content: `Now comes the practical part - how do we actually identify YOUR specific triggers? There are several approaches, and I'll walk you through the most effective methods.`,
        },
        {
            id: 9,
            type: 'system',
            content: `**The Elimination Diet Protocol**
• Remove common trigger foods for 3-4 weeks minimum
• Keep a detailed symptom diary during elimination phase
• Reintroduce one food at a time, waiting 3-4 days between each
• Monitor symptoms for 72 hours after each reintroduction
• Document reactions: severity, timing, and type of symptoms
• Consider working with a healthcare practitioner for guidance`,
            systemStyle: 'takeaway',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `What's your biggest concern about trying an elimination diet?`,
            choices: ["Finding enough foods I can actually eat", "Having the willpower to stick with it", "Knowing how to properly reintroduce foods"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Those are totally valid concerns! Remember, an elimination diet is temporary and incredibly informative. The freedom you'll gain from knowing exactly what works for your body is worth the short-term effort.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Alternative Testing Methods**
• Food sensitivity blood tests (IgG/IgA panels) - convenient but less reliable
• Mediator release testing (MRT) - measures inflammatory response
• Pulse testing - monitor heart rate changes after eating specific foods
• Food and symptom journaling - track patterns over 4-6 weeks
• Professional guidance recommended for complex cases`,
            systemStyle: 'info',
        },
        {
            id: 13,
            type: 'coach',
            content: `Beyond identification, successful management means learning to navigate social situations, reading labels like a pro, and finding delicious alternatives to your trigger foods. This becomes second nature with practice!`,
        },
        {
            id: 14,
            type: 'system',
            content: `**Living Successfully with Food Sensitivities**
• Focus on foods you CAN eat rather than restrictions
• Learn to read ingredient labels thoroughly
• Prepare for dining out with restaurant research
• Build a toolkit of go-to meals and snacks
• Consider working with a nutritionist for meal planning
• Remember that sensitivities can change over time with gut healing`,
            systemStyle: 'takeaway',
        },
        {
            id: 15,
            type: 'coach',
            content: `Amazing work getting through this intensive lesson, {name}! 🌟 You now have the tools to become your own food sensitivity detective. Up next in our final lesson: we'll put everything together with a personalized gut health action plan. You're so close to transforming your digestive health!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Food Sensitivities"
            lessonSubtitle="Identifying and eliminating triggers"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
