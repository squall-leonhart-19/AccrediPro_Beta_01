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

export function LessonSiboAndDysbiosis({
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
            content: `Hey {name}! Ready to dive into one of the most common gut health issues I see in my practice? 🔍 Today we're exploring SIBO and dysbiosis - two conditions that can really impact how you feel day-to-day.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**What is SIBO?**
• Small Intestinal Bacterial Overgrowth (SIBO) occurs when bacteria overgrow in the small intestine
• The small intestine should have relatively few bacteria compared to the large intestine
• Can cause bloating, gas, abdominal pain, and altered bowel movements
• Often develops due to slowed gut motility or structural abnormalities`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `SIBO is like having a party in the wrong room of your house. The bacteria aren't necessarily bad - they're just in the wrong place! This can create some uncomfortable symptoms that many people live with for years without knowing the cause.`,
        },
        {
            id: 4,
            type: 'system',
            content: `**Types of SIBO**
• **Hydrogen SIBO**: Most common, caused by hydrogen-producing bacteria
• **Methane SIBO**: Caused by methane-producing archaea, often linked to constipation
• **Hydrogen Sulfide SIBO**: Less common, produces toxic hydrogen sulfide gas
• Each type requires different treatment approaches`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `Which SIBO symptom pattern would most likely indicate methane-dominant SIBO?`,
            choices: ["Severe diarrhea and cramping", "Chronic constipation and bloating", "Alternating loose stools and gas"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Exactly! Methane-producing organisms actually slow down gut motility, which is why constipation is such a telltale sign. Now let's look at the broader picture of bacterial imbalances.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Understanding Dysbiosis**
• Imbalance between beneficial and harmful bacteria in the gut
• Can occur throughout the digestive tract, not just the small intestine
• Often involves loss of microbial diversity
• Common triggers include antibiotics, stress, poor diet, and infections`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'coach',
            content: `Think of dysbiosis as your gut's ecosystem being out of balance. Just like a forest needs diversity to thrive, your gut needs a variety of beneficial bacteria to function optimally! 🌱`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Common Signs of Bacterial Imbalances**
• Digestive symptoms: bloating, gas, irregular bowel movements
• Food intolerances that seem to multiply over time
• Fatigue and brain fog
• Skin issues like eczema or acne
• Frequent infections or poor immune function
• Mood changes or anxiety`,
            systemStyle: 'info',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `What's typically the first step in addressing suspected SIBO or dysbiosis?`,
            choices: ["Immediately start probiotics", "Get proper testing and assessment", "Begin a strict elimination diet"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Yes! Testing is crucial because SIBO and dysbiosis can present similarly but require different approaches. You wouldn't want to guess when you can know for sure what you're dealing with.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Testing Options**
• **SIBO breath test**: Measures hydrogen and methane gases
• **Comprehensive stool analysis**: Shows bacterial balance and diversity
• **Organic acids test**: Reveals bacterial and yeast metabolites
• **Food sensitivity testing**: Identifies reactive foods contributing to inflammation`,
            systemStyle: 'takeaway',
        },
        {
            id: 13,
            type: 'coach',
            content: `Remember {name}, bacterial imbalances are incredibly common and very treatable! The key is identifying what type of imbalance you're dealing with and addressing the root causes, not just the symptoms.`,
        },
        {
            id: 14,
            type: 'system',
            content: `**Key Takeaway**
• SIBO and dysbiosis are different but related conditions involving bacterial imbalances
• Proper testing is essential for targeted treatment
• Symptoms can extend far beyond digestive issues
• Both conditions respond well to appropriate interventions when root causes are addressed`,
            systemStyle: 'takeaway',
        },
        {
            id: 15,
            type: 'coach',
            content: `Great work today! 🎉 Next up, we'll explore how to heal and restore gut balance through targeted nutrition strategies. You're building such valuable knowledge that will help you support optimal gut health!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="SIBO & Dysbiosis"
            lessonSubtitle="Bacterial imbalances and their effects"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
