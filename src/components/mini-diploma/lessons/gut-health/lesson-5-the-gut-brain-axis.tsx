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

export function LessonTheGutBrainAxis({
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
            content: `Hey {name}! 🧠 Welcome to one of my favorite lessons - the gut-brain axis! This connection between your digestive system and your brain is absolutely fascinating and explains so much about how we feel day-to-day.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**The Gut-Brain Connection**
• Your gut and brain communicate constantly through the vagus nerve
• 90% of serotonin (your 'happy hormone') is produced in your gut
• Gut bacteria can influence mood, anxiety, and cognitive function
• Stress affects gut health, and gut health affects stress levels`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think about it - have you ever felt 'butterflies' when nervous or had gut feelings about something? That's this connection in action! Your gut literally has its own nervous system with more neurons than your spinal cord.`,
        },
        {
            id: 4,
            type: 'system',
            content: `**Key Neurotransmitters Produced in the Gut**
• **Serotonin**: Regulates mood, sleep, and appetite
• **GABA**: Promotes calm and reduces anxiety
• **Dopamine**: Controls motivation and reward feelings
• **Acetylcholine**: Supports memory and learning`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `Which scenario best describes your experience with the gut-brain connection?`,
            choices: ["I notice my digestion changes when I'm stressed", "I feel more anxious when my gut is upset", "I haven't noticed a clear connection yet"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Great awareness, {name}! Many people don't realize how connected these systems are until they start paying attention. Let's dive into how your gut microbes are literally influencing your thoughts and feelings.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**How Gut Bacteria Affect Your Brain**
• Produce neurotransmitters that influence mood
• Release metabolites that can cross the blood-brain barrier
• Influence inflammation levels that affect brain function
• Send signals through the vagus nerve directly to the brain
• Affect stress hormone production`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'system',
            content: `**Research shows that people with depression and anxiety often have:**
• Lower bacterial diversity in their gut
• Reduced levels of beneficial bacteria like Bifidobacterium
• Increased intestinal permeability ('leaky gut')
• Higher levels of inflammatory markers`,
            systemStyle: 'takeaway',
        },
        {
            id: 9,
            type: 'coach',
            content: `This research is why we're seeing more doctors prescribe 'psychobiotics' - specific probiotic strains that have been shown to improve mental health outcomes. It's not just about digestion anymore!`,
        },
        {
            id: 10,
            type: 'user-choice',
            content: `What's your biggest motivation for improving your gut-brain connection?`,
            choices: ["Better mood and less anxiety", "Improved focus and mental clarity", "Overall better stress management"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'system',
            content: `**Practical Ways to Support Your Gut-Brain Axis**
• Eat fermented foods rich in beneficial bacteria
• Include prebiotic fibers to feed good bacteria
• Practice stress management techniques like meditation
• Get adequate sleep to support both gut and brain health
• Limit processed foods that disrupt the microbiome
• Consider targeted probiotic supplementation`,
            systemStyle: 'takeaway',
        },
        {
            id: 12,
            type: 'coach',
            content: `The beautiful thing about this connection is that improving one system helps the other. When you take care of your gut, your brain benefits, and when you manage stress, your gut thrives! 🌟`,
        },
        {
            id: 13,
            type: 'system',
            content: `"The gut is not just responsible for digestion, but is a key player in our mental and emotional well-being. Taking care of your gut microbiome is taking care of your mind." - Dr. Emeran Mayer, UCLA Neuroscientist`,
            systemStyle: 'quote',
        },
        {
            id: 14,
            type: 'coach',
            content: `Amazing work today, {name}! You now understand one of the most important connections in your body. Coming up in Lesson 6, we'll explore exactly which foods and nutrients can heal and optimize your gut health. You're doing fantastic!`,
        },
        {
            id: 15,
            type: 'coach',
            content: `Take a moment to notice how you're feeling right now - both mentally and in your gut. This awareness is the first step to harnessing this powerful connection for better health!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Gut-Brain Axis"
            lessonSubtitle="How your gut affects your mood and mind"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
