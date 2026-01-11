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

export function LessonToxinBurden({
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
            content: `{name}! 🏭 Ready to learn about something most doctors completely ignore? Toxin burden.`,
        },
        {
            id: 2,
            type: 'coach',
            content: `We're exposed to more toxins than any generation in history. Our bodies weren't designed for this.`,
        },
        {
            id: 3,
            type: 'system',
            content: `**The Toxic Load**
• 80,000+ synthetic chemicals in commerce
• Average person exposed to 200+ chemicals before breakfast
• Many are "endocrine disruptors" (mess with hormones)
• Body's detox systems can get overwhelmed`,
            systemStyle: 'info',
        },
        {
            id: 4,
            type: 'user-choice',
            content: `Which toxin source concerns you most?`,
            choices: [
                "Heavy metals (mercury, lead, arsenic)",
                "Pesticides and herbicides",
                "Household chemicals and plastics",
            ],
            showReaction: true,
        },
        {
            id: 5,
            type: 'coach',
            content: `All valid concerns! The key is understanding that toxins ACCUMULATE over time. It's the total burden that matters.`,
        },
        {
            id: 6,
            type: 'system',
            content: `**Major Toxin Categories**
1. **Heavy metals** - Mercury (fish, amalgams), Lead (old paint), Arsenic (rice, water)
2. **Mold/Mycotoxins** - Water-damaged buildings
3. **Pesticides** - Non-organic produce
4. **Plastics/BPA** - Food containers, receipts
5. **Chemicals** - Personal care, cleaning products`,
            systemStyle: 'takeaway',
        },
        {
            id: 7,
            type: 'coach',
            content: `💡 The liver is your main detox organ. But it has TWO phases, and many people have a sluggish Phase 2.`,
        },
        {
            id: 8,
            type: 'system',
            content: `**Liver Detox Phases**
**Phase 1**: Breaks down toxins (creates reactive intermediates)
**Phase 2**: Conjugates and neutralizes (requires nutrients!)

If Phase 2 is slow, you have MORE toxic intermediates floating around.`,
            systemStyle: 'info',
        },
        {
            id: 9,
            type: 'user-choice',
            content: `What symptom is commonly linked to toxin overload?`,
            choices: [
                "Fatigue",
                "Brain fog",
                "All of the above and more",
            ],
            showReaction: true,
        },
        {
            id: 10,
            type: 'coach',
            content: `Exactly - all of them! Plus headaches, skin issues, hormonal imbalances, weight resistance, and chemical sensitivities.`,
        },
        {
            id: 11,
            type: 'system',
            content: `**Supporting Detoxification**
• Reduce exposure (clean up environment)
• Support liver (cruciferous vegetables, milk thistle)
• Bind toxins (activated charcoal, fiber)
• Promote elimination (sweat, bowel movements)
• Ensure hydration`,
            systemStyle: 'quote',
        },
        {
            id: 12,
            type: 'coach',
            content: `Remember: Detox without reducing exposure is like mopping the floor while the faucet is running!`,
        },
        {
            id: 13,
            type: 'coach',
            content: `Next lesson, we'll explore chronic stress and how it destroys health from the inside out. 😰`,
        },
        {
            id: 14,
            type: 'coach',
            content: `Amazing work, {name}! You're halfway through. See you in Lesson 5! 💪`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="The Toxin Burden"
            lessonSubtitle="Understanding environmental health threats"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
