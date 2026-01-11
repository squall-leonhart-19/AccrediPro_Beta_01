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

export function LessonHealingProtocols({
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
            content: `Hey {name}! 🌟 Welcome to Lesson 7 - this is where we get into the real healing work. You've learned so much about gut health fundamentals, and now we're going to explore the powerful 5R framework that can transform digestive wellness. Think of this as your roadmap to gut restoration!`,
        },
        {
            id: 2,
            type: 'system',
            content: `**The 5R Framework Overview**
• **Remove** - Eliminate harmful substances and pathogens
• **Replace** - Restore digestive enzymes and stomach acid
• **Reinoculate** - Replenish beneficial bacteria
• **Repair** - Heal the intestinal lining
• **Rebalance** - Support overall lifestyle factors`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `The 5Rs aren't just steps - they're often happening simultaneously! Let's dive deeper into each phase so you can understand how to apply this framework with your future clients.`,
        },
        {
            id: 4,
            type: 'system',
            content: `**Phase 1: REMOVE**
• **Inflammatory foods**: Sugar, processed foods, common allergens
• **Infections**: SIBO, candida, parasites, H. pylori
• **Medications**: Unnecessary NSAIDs, PPIs when possible
• **Stress factors**: Chronic stress, poor sleep patterns
• **Environmental toxins**: Pesticides, heavy metals`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `Which removal strategy do you think is typically the most challenging for clients to implement?`,
            choices: ["Eliminating inflammatory foods", "Addressing chronic stress patterns", "Treating underlying infections"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Great insight, {name}! Each client will have different challenges. The key is meeting them where they are and prioritizing based on their specific situation and readiness to change.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Phase 2: REPLACE**
• **Digestive enzymes**: Protease, lipase, amylase
• **Stomach acid support**: Betaine HCl, apple cider vinegar
• **Bile acid support**: Ox bile, bitter herbs
• **Nutrient deficiencies**: B12, vitamin D, zinc, magnesium
• **Fiber intake**: Gradual increase of prebiotic fibers`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'system',
            content: `**Phase 3: REINOCULATE**
• **Probiotics**: Multi-strain, high-quality supplements
• **Fermented foods**: Kefir, sauerkraut, kimchi, yogurt
• **Prebiotic foods**: Garlic, onions, Jerusalem artichokes
• **Diverse plant foods**: 30+ different plants per week
• **Soil-based organisms**: For additional microbial diversity`,
            systemStyle: 'info',
        },
        {
            id: 9,
            type: 'coach',
            content: `Now we get to the repair phase - this is often where clients start feeling the real transformation happening! 💫`,
        },
        {
            id: 10,
            type: 'system',
            content: `**Phase 4: REPAIR**
• **L-Glutamine**: Primary fuel for intestinal cells
• **Zinc carnosine**: Supports mucosal healing
• **Collagen peptides**: Provides building blocks for gut lining
• **Omega-3 fatty acids**: Reduces inflammation
• **Bone broth**: Rich in glycine and proline for repair
• **Aloe vera**: Soothes and heals intestinal tissue`,
            systemStyle: 'info',
        },
        {
            id: 11,
            type: 'user-choice',
            content: `How long does the repair phase typically take for most clients?`,
            choices: ["2-4 weeks with noticeable improvements", "2-6 months for significant healing", "6-12 months for complete restoration"],
            showReaction: true,
        },
        {
            id: 12,
            type: 'coach',
            content: `Exactly! Healing takes time, and managing client expectations around this timeline is crucial. Some feel better quickly, but true deep healing is a longer journey.`,
        },
        {
            id: 13,
            type: 'system',
            content: `**Phase 5: REBALANCE**
• **Sleep optimization**: 7-9 hours of quality sleep
• **Stress management**: Meditation, yoga, breathing exercises
• **Regular movement**: Supports gut motility and diversity
• **Mindful eating**: Proper chewing, relaxed meal environment
• **Social connections**: Community support for gut-brain health
• **Regular meal timing**: Supports circadian rhythm`,
            systemStyle: 'takeaway',
        },
        {
            id: 14,
            type: 'coach',
            content: `The rebalance phase is really about creating sustainable lifestyle practices that support long-term gut health. This is where the real magic happens - when healing becomes a way of life rather than just a protocol.`,
        },
        {
            id: 15,
            type: 'coach',
            content: `Amazing work today, {name}! You now have a comprehensive framework for gut restoration. In our next lesson, we'll explore how to customize these protocols for different client populations and health conditions. You're becoming such a knowledgeable gut health practitioner! 🎯`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Healing Protocols"
            lessonSubtitle="The 5R framework for gut restoration"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
