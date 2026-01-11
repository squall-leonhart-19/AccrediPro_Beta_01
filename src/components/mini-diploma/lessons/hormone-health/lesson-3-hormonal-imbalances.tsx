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

export function LessonHormonalImbalances({
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
            content: `Hey {name}! Ready to dive into the wild world of hormonal imbalances? 🎢 This is where things get really interesting - and where you'll learn to spot the signs when our hormonal orchestra goes off-key.`,
        },
        {
            id: 2,
            type: 'system',
            content: `**What Are Hormonal Imbalances?**
• When hormone levels are too high, too low, or fluctuating inappropriately
• Can affect single hormones or multiple hormone systems
• May be temporary (stress-induced) or chronic conditions
• Often interconnected - one imbalance can trigger others
• Can occur at any age, though some are more common during specific life stages`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Think of hormones like a symphony orchestra, {name}. When everyone's playing in harmony, beautiful music happens. But when even one section goes rogue, the whole performance can sound off! 🎼`,
        },
        {
            id: 4,
            type: 'system',
            content: `**Common Signs of Hormonal Imbalances**
• **Energy & Sleep:** Chronic fatigue, insomnia, or sleeping too much
• **Mood & Mental:** Anxiety, depression, irritability, brain fog
• **Physical:** Unexplained weight changes, hair loss, skin issues
• **Reproductive:** Irregular periods, low libido, fertility issues
• **Metabolic:** Blood sugar swings, increased appetite, slow metabolism`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `A client comes to you saying they've been gaining weight despite eating well, feeling tired all the time, and their hair is thinning. What's your first thought?`,
            choices: ["Probably just stress - recommend more sleep", "Could be thyroid issues - suggest they see their doctor", "Must be eating more calories than they think"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `Great thinking! Those symptoms together are classic signs of potential thyroid dysfunction. As hormone health coaches, we're detectives looking for patterns, not diagnosing. 🔍`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Major Hormonal Imbalance Categories**
• **Insulin Resistance:** High blood sugar, weight gain around midsection, cravings
• **Thyroid Dysfunction:** Hypo/hyperthyroid affecting metabolism and energy
• **Adrenal Dysfunction:** Chronic stress leading to cortisol imbalances
• **Sex Hormone Imbalances:** Estrogen dominance, low testosterone, PCOS
• **Sleep Hormone Issues:** Disrupted melatonin production`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'coach',
            content: `Here's what's fascinating, {name} - these imbalances rarely travel alone. Chronic stress can mess with your adrenals, which affects your thyroid, which impacts your sex hormones. It's all connected!`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Root Causes of Hormonal Imbalances**
• **Chronic Stress:** Elevates cortisol, disrupts other hormone production
• **Poor Sleep:** Interferes with hormone regulation and repair
• **Nutritional Deficiencies:** Missing building blocks for hormone production
• **Environmental Toxins:** Endocrine disruptors in plastics, cosmetics, food
• **Gut Health Issues:** Affects hormone metabolism and elimination
• **Genetics & Age:** Natural predispositions and life stage changes`,
            systemStyle: 'info',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `Which lifestyle factor do you think has the BIGGEST impact on hormonal balance in most people today?`,
            choices: ["Chronic stress and poor stress management", "Environmental toxins and chemicals", "Processed foods and poor nutrition"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `All of these matter, but chronic stress is often the biggest culprit! It's like a domino effect - stress hits cortisol, which then impacts insulin, thyroid, and sex hormones. The good news? It's very manageable with the right tools.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**The Hormone Cascade Effect**
• One imbalanced hormone often triggers others
• Stress hormones typically override reproductive hormones
• Blood sugar issues affect nearly every other hormone system
• Sleep disruption amplifies all existing imbalances
• Understanding these connections helps target root causes, not just symptoms`,
            systemStyle: 'takeaway',
        },
        {
            id: 13,
            type: 'coach',
            content: `Remember {name}, hormonal imbalances aren't life sentences - they're messages from your body asking for attention and care. Most can be significantly improved with the right approach!`,
        },
        {
            id: 14,
            type: 'system',
            content: `"The body is not a machine, but a complex ecosystem where every hormone plays a vital role in maintaining balance and health." - Dr. Sara Gottfried`,
            systemStyle: 'quote',
        },
        {
            id: 15,
            type: 'coach',
            content: `Amazing work today! 🌟 You're building such valuable knowledge about recognizing when hormones go rogue. Next up in Lesson 4, we're diving into testing and assessment - the tools that help us see what's really happening behind the scenes. See you there!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Hormonal Imbalances"
            lessonSubtitle="When hormones go rogue"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
