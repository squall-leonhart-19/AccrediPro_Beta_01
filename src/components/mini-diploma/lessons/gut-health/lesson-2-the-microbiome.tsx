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

export function LessonTheMicrobiome({
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
            content: `Hey {name}! 🦠 Welcome to lesson 2 - we're diving deep into the fascinating world of your microbiome today. Think of this as meeting your trillion microscopic roommates who've been quietly running the show in your gut!`,
        },
        {
            id: 2,
            type: 'system',
            content: `**What is the Microbiome?**
• A collection of trillions of microorganisms living in and on your body
• Includes bacteria, viruses, fungi, and other microbes
• Your gut microbiome alone weighs about 2-3 pounds
• Contains roughly the same number of microbial cells as human cells
• Acts like a separate organ with its own functions`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Pretty mind-blowing, right {name}? You're literally more microbe than human! But here's the cool part - these aren't just passive passengers. They're active partners in your health.`,
        },
        {
            id: 4,
            type: 'system',
            content: `**Key Functions of Your Gut Microbiome**
• **Digestion**: Breaks down fiber and produces short-chain fatty acids
• **Immune Support**: Trains and regulates 70% of your immune system
• **Nutrient Production**: Creates vitamins B12, K, and folate
• **Barrier Protection**: Prevents harmful pathogens from taking hold
• **Neurotransmitter Production**: Makes serotonin, GABA, and dopamine
• **Metabolism**: Influences weight, blood sugar, and inflammation`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `Which microbiome function surprises you the most?`,
            choices: ["That it produces neurotransmitters like serotonin", "That it weighs 2-3 pounds", "That it trains 70% of my immune system"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Amazing choice, {name}! The gut-brain connection is one of the most exciting areas of microbiome research. Let's explore what makes up a healthy microbiome community.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**The Big Players: Major Bacterial Families**
• **Bacteroidetes**: Fiber-lovers, help with weight management
• **Firmicutes**: Energy extractors, balance is key for metabolism
• **Actinobacteria**: Includes beneficial Bifidobacterium
• **Proteobacteria**: Small amounts are normal, too much signals imbalance
• **Verrucomicrobia**: Includes Akkermansia, supports gut lining integrity`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'coach',
            content: `Think of these bacterial families like different neighborhoods in a city. A healthy gut has diverse, thriving communities that work together harmoniously.`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Diversity is Everything**
• Higher bacterial diversity = better health outcomes
• Modern lifestyle reduces microbiome diversity
• Loss of diversity linked to allergies, autoimmune issues, and chronic disease
• Each person's microbiome is as unique as a fingerprint
• Diversity can be improved through diet and lifestyle changes`,
            systemStyle: 'takeaway',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `What do you think has the biggest impact on microbiome diversity?`,
            choices: ["The foods I eat regularly", "Antibiotic use", "Stress and sleep patterns"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Excellent thinking, {name}! All of these factors matter, but diet tends to have the most immediate and controllable impact on your microbial communities.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Signs of a Healthy vs. Imbalanced Microbiome**

**Healthy Signs:**
• Regular, comfortable bowel movements
• Good energy levels
• Strong immune function
• Stable mood
• Clear skin

**Imbalance Signs:**
• Digestive issues (bloating, irregularity)
• Frequent infections
• Food intolerances
• Mood swings
• Skin problems
• Sugar cravings`,
            systemStyle: 'info',
        },
        {
            id: 13,
            type: 'coach',
            content: `Remember {name}, your microbiome is constantly changing based on what you feed it and how you treat it. The good news? Small changes can make a big difference! 🌱`,
        },
        {
            id: 14,
            type: 'system',
            content: `"The microbiome represents a remarkable biological system that has co-evolved with humans over millennia. Understanding and nurturing this partnership may be one of the most important steps we can take for our health." - Dr. Justin Sonnenberg, Stanford University`,
            systemStyle: 'quote',
        },
        {
            id: 15,
            type: 'coach',
            content: `Great work completing lesson 2, {name}! You now understand your incredible microbial partners. Next up in lesson 3, we'll explore how modern life disrupts this delicate ecosystem and what that means for your health. See you there!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Microbiome"
            lessonSubtitle="Understanding your trillion bacterial partners"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
