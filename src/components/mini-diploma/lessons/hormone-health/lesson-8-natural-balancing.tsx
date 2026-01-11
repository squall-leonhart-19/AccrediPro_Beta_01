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

export function LessonNaturalBalancing({
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
            content: `Hey {name}! Welcome to our Natural Balancing lesson 🌿 Today we're diving into the practical stuff - the lifestyle and nutrition protocols that can truly transform your hormone health. Ready to learn some game-changing strategies?`,
        },
        {
            id: 2,
            type: 'system',
            content: `**Foundation Nutrition Principles for Hormone Balance**
• Eat protein at every meal (20-30g minimum) to support stable blood sugar
• Include healthy fats daily: avocado, nuts, seeds, olive oil, fatty fish
• Choose complex carbohydrates over refined sugars
• Prioritize organic produce when possible to reduce endocrine disruptors
• Stay hydrated with filtered water (half your body weight in ounces daily)`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Nutrition is like giving your hormones the right building blocks to work with. But here's what most people don't realize - it's not just what you eat, but when and how you eat that matters too.`,
        },
        {
            id: 4,
            type: 'user-choice',
            content: `What's your biggest nutrition challenge when it comes to hormone health?`,
            choices: ["Controlling sugar cravings", "Getting enough protein", "Finding time for meal prep"],
            showReaction: true,
        },
        {
            id: 5,
            type: 'system',
            content: `**Strategic Meal Timing and Blood Sugar Balance**
• Eat within 1 hour of waking to support cortisol rhythm
• Include protein and fat with any carbohydrates to slow glucose absorption
• Consider a 12-14 hour overnight fast to support insulin sensitivity
• Avoid eating 2-3 hours before bedtime to optimize sleep hormones
• Eat consistently spaced meals to prevent blood sugar rollercoaster`,
            systemStyle: 'info',
        },
        {
            id: 6,
            type: 'coach',
            content: `Now let's talk about lifestyle factors. Sleep and stress management aren't just 'nice to haves' - they're absolutely critical for hormone production and balance.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Sleep Optimization Protocol**
• Maintain consistent sleep/wake times (even on weekends)
• Create a cool, dark sleep environment (65-68°F ideal)
• Implement a digital sunset: no screens 1 hour before bed
• Use blackout curtains or eye mask to support melatonin production
• Consider magnesium supplementation (200-400mg before bed)
• Aim for 7-9 hours of quality sleep nightly`,
            systemStyle: 'info',
        },
        {
            id: 8,
            type: 'user-choice',
            content: `Which stress management technique appeals to you most for hormone balance?`,
            choices: ["Daily meditation or breathwork", "Regular nature walks", "Journaling and mindfulness"],
            showReaction: true,
        },
        {
            id: 9,
            type: 'system',
            content: `**Stress Management and Cortisol Support**
• Practice daily stress-reduction: meditation, yoga, or deep breathing
• Incorporate adaptogenic herbs: ashwagandha, rhodiola, holy basil
• Schedule regular downtime and boundaries around work
• Engage in gentle, enjoyable movement rather than intense exercise
• Build strong social connections and community support
• Consider therapy or counseling for chronic stress patterns`,
            systemStyle: 'info',
        },
        {
            id: 10,
            type: 'coach',
            content: `Here's something powerful: your body responds to consistency more than perfection. Small, sustainable changes practiced daily will beat extreme measures every time.`,
        },
        {
            id: 11,
            type: 'system',
            content: `**Exercise and Movement Guidelines**
• Prioritize strength training 2-3x per week to support testosterone and growth hormone
• Include gentle cardio like walking, swimming, or cycling
• Avoid excessive high-intensity exercise which can spike cortisol
• Sync exercise with your cycle: strength during follicular, gentle during luteal
• Incorporate daily movement: stairs, stretching, yoga
• Listen to your body's energy levels and adjust accordingly`,
            systemStyle: 'info',
        },
        {
            id: 12,
            type: 'coach',
            content: `Let's also touch on environmental factors. The products you use and the toxins you're exposed to can significantly impact your endocrine system.`,
        },
        {
            id: 13,
            type: 'system',
            content: `**Environmental and Lifestyle Detox**
• Switch to clean beauty and household products (check EWG database)
• Use glass or stainless steel instead of plastic food containers
• Filter your water to remove chlorine and other chemicals
• Choose organic produce for the 'Dirty Dozen' list
• Limit exposure to EMFs, especially near sleep area
• Support natural detoxification with fiber, water, and sweating`,
            systemStyle: 'takeaway',
        },
        {
            id: 14,
            type: 'coach',
            content: `Amazing work getting through this comprehensive natural balancing protocol! 💪 Next lesson is our final one where we'll put it all together and talk about your certification and next steps. You're so close to becoming a hormone health expert!`,
        },
        {
            id: 15,
            type: 'system',
            content: `**Your Action Items This Week**
• Choose 2-3 nutrition principles to implement consistently
• Establish a sleep routine with at least one optimization strategy
• Select one stress management technique to practice daily
• Identify one environmental change you can make this week
• Track your energy and mood as you implement these changes`,
            systemStyle: 'takeaway',
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Natural Balancing"
            lessonSubtitle="Lifestyle and nutrition protocols"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
