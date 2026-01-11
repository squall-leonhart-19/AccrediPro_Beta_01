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

export function LessonPerimenopauseAndMenopause({
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
            content: `Hey {name}! Welcome to lesson 6 - we're diving into one of the most significant hormonal transitions women experience. Today we'll explore perimenopause and menopause with compassion and practical knowledge 💫`,
        },
        {
            id: 2,
            type: 'system',
            content: `**Understanding Perimenopause**
• Transition period before menopause, typically lasting 4-10 years
• Usually begins in the 40s but can start in late 30s
• Characterized by fluctuating hormone levels, especially estrogen and progesterone
• Ovulation becomes irregular but still occurs
• Symptoms can be unpredictable and vary greatly between women`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think of perimenopause as your body's rehearsal for menopause, {name}. The hormonal fluctuations can feel like a roller coaster, but understanding what's happening helps us support women through this transition with greater confidence.`,
        },
        {
            id: 4,
            type: 'user-choice',
            content: `What's typically the first sign many women notice during perimenopause?`,
            choices: ["Complete cessation of periods", "Irregular menstrual cycles", "Severe hot flashes"],
            showReaction: true,
        },
        {
            id: 5,
            type: 'system',
            content: `**Common Perimenopause Symptoms**
• Irregular periods (shorter, longer, heavier, or lighter)
• Hot flashes and night sweats
• Sleep disturbances and insomnia
• Mood changes, anxiety, and irritability
• Brain fog and memory issues
• Weight gain, especially around the midsection
• Decreased libido and vaginal dryness
• Joint aches and muscle tension`,
            systemStyle: 'info',
        },
        {
            id: 6,
            type: 'coach',
            content: `Remember, {name}, every woman's experience is unique. Some sail through with minimal symptoms, while others find it more challenging. Our role is to normalize this experience and provide practical support strategies.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Menopause Defined**
• Officially diagnosed after 12 consecutive months without a menstrual period
• Average age is 51 in the United States
• Represents the end of reproductive years
• Estrogen and progesterone levels stabilize at much lower levels
• Early menopause: before age 40 (premature) or before age 45
• Can occur naturally or be induced by surgery, chemotherapy, or radiation`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'user-choice',
            content: `Which approach is most effective for managing menopause symptoms?`,
            choices: ["One-size-fits-all hormone therapy", "Individualized, holistic approach", "Waiting it out without intervention"],
            showReaction: true,
        },
        {
            id: 9,
            type: 'system',
            content: `**Natural Support Strategies**
• **Nutrition**: Focus on phytoestrogen-rich foods (flaxseeds, soy, legumes)
• **Exercise**: Regular movement helps with weight management and mood
• **Sleep hygiene**: Cool room, consistent schedule, limit screen time
• **Stress management**: Meditation, yoga, deep breathing techniques
• **Hydration**: Adequate water intake supports all body systems
• **Supplements**: Consider vitamin D, omega-3s, magnesium (with healthcare provider approval)`,
            systemStyle: 'takeaway',
        },
        {
            id: 10,
            type: 'coach',
            content: `The lifestyle foundations we've discussed throughout this program become even more crucial during this transition. Small, consistent changes can make a significant difference in how women experience these life stages.`,
        },
        {
            id: 11,
            type: 'system',
            content: `**When to Seek Medical Support**
• Severe symptoms impacting quality of life
• Heavy bleeding or bleeding between periods
• Symptoms of depression or severe anxiety
• Significant bone loss or fracture risk
• Cardiovascular concerns
• Consideration of hormone replacement therapy (HRT)
• Need for symptom management beyond lifestyle changes`,
            systemStyle: 'info',
        },
        {
            id: 12,
            type: 'system',
            content: `"Menopause is not a disease to be cured, but a natural transition to be honored and supported with wisdom, compassion, and the right tools." - Dr. Christiane Northrup`,
            systemStyle: 'quote',
        },
        {
            id: 13,
            type: 'coach',
            content: `You're doing amazing work learning about these important transitions, {name}. In our next lesson, we'll explore thyroid health and its connection to hormonal balance. Keep up the excellent progress! ✨`,
        },
        {
            id: 14,
            type: 'system',
            content: `**Key Takeaways**
• Perimenopause is a natural transition that can last several years
• Symptoms vary widely and deserve individualized support
• Lifestyle interventions can significantly improve quality of life
• Medical support should be considered when symptoms are severe
• This transition can be an opportunity for renewed health focus`,
            systemStyle: 'takeaway',
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Perimenopause & Menopause"
            lessonSubtitle="Navigating life stage transitions"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
