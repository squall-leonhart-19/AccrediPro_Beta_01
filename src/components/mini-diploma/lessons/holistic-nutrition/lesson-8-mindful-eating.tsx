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

export function LessonMindfulEating({
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
            content: `Hey {name}! 🧠 Welcome to our lesson on mindful eating and the psychology of food choices. This is where nutrition science meets mental wellness - and it's absolutely fascinating! Ready to explore the deeper reasons behind our eating patterns?`,
        },
        {
            id: 2,
            type: 'system',
            content: `**What is Mindful Eating?**
• Paying full attention to the eating experience without judgment
• Being aware of physical hunger and satiety cues
• Recognizing emotional triggers that influence food choices
• Eating with intention and awareness rather than on autopilot
• Appreciating the sensory aspects of food (taste, smell, texture)`,
            systemStyle: 'info',
        },
        {
            id: 3,
            type: 'coach',
            content: `Most of us eat while distracted - scrolling phones, watching TV, or rushing between tasks. But when we slow down and truly pay attention, eating becomes a completely different experience. Let me share the science behind why this matters so much.`,
        },
        {
            id: 4,
            type: 'system',
            content: `**The Psychology of Food Choices**
• **Emotional eating**: Using food to cope with stress, boredom, or feelings
• **Environmental cues**: Portion sizes, food placement, and social settings
• **Habit patterns**: Automatic behaviors formed through repetition
• **Cultural programming**: Family traditions and societal food messages
• **Neurochemical responses**: How different foods affect mood and cravings`,
            systemStyle: 'info',
        },
        {
            id: 5,
            type: 'user-choice',
            content: `What's your biggest challenge when it comes to mindful eating?`,
            choices: ["Eating too quickly due to busy schedule", "Emotional eating when stressed", "Getting distracted during meals"],
            showReaction: true,
        },
        {
            id: 6,
            type: 'coach',
            content: `That's so common, {name}! The good news is that mindful eating isn't about perfection - it's about building awareness. Even small shifts in how we approach food can create profound changes in our relationship with eating.`,
        },
        {
            id: 7,
            type: 'system',
            content: `**Breaking the Cycle of Emotional Eating**
• **Pause and identify**: Ask "Am I physically hungry or emotionally hungry?"
• **Name the emotion**: Stress, loneliness, boredom, celebration, etc.
• **Create alternative responses**: Deep breathing, journaling, calling a friend
• **Honor emotional needs**: Address the root cause, not just the symptom
• **Practice self-compassion**: Avoid guilt and shame around food choices`,
            systemStyle: 'takeaway',
        },
        {
            id: 8,
            type: 'coach',
            content: `One of my favorite mindful eating techniques is the 'first three bites' practice. For the first three bites of any meal, put down your utensils and focus completely on the flavors, textures, and sensations. It's amazing how this simple practice can shift your entire meal experience!`,
        },
        {
            id: 9,
            type: 'system',
            content: `**Practical Mindful Eating Strategies**
• **The hunger scale**: Rate hunger 1-10 before and during meals
• **20-minute rule**: It takes time for satiety signals to reach the brain
• **Single-tasking**: Eat without phones, TV, or other distractions
• **Gratitude practice**: Appreciate where your food came from
• **Body scan**: Check in with physical sensations while eating`,
            systemStyle: 'info',
        },
        {
            id: 10,
            type: 'user-choice',
            content: `Which mindful eating strategy appeals most to you to try this week?`,
            choices: ["Using the hunger scale before meals", "Practicing the first three bites technique", "Creating a distraction-free eating environment"],
            showReaction: true,
        },
        {
            id: 11,
            type: 'coach',
            content: `Perfect choice! Remember, building new habits takes time and patience. Start small and celebrate the progress you make. Even one mindful meal per day can begin to rewire your relationship with food.`,
        },
        {
            id: 12,
            type: 'system',
            content: `"When we eat mindfully, we eat with our whole being - not just our mouths. We engage our senses, our hearts, and our wisdom to nourish ourselves completely." - Thich Nhat Hanh`,
            systemStyle: 'quote',
        },
        {
            id: 13,
            type: 'coach',
            content: `As we wrap up today's lesson, remember that mindful eating isn't a diet - it's a way of life that honors both your body's needs and your emotional well-being. This foundation will serve you throughout your holistic nutrition journey.`,
        },
        {
            id: 14,
            type: 'system',
            content: `**Key Takeaways from Today**
• Mindful eating increases awareness of hunger and satiety cues
• Emotional eating patterns can be transformed with conscious practice
• Environmental factors significantly influence our food choices
• Small, consistent practices create lasting change
• Self-compassion is essential for developing a healthy relationship with food`,
            systemStyle: 'takeaway',
        },
        {
            id: 15,
            type: 'coach',
            content: `Amazing work today, {name}! 🌟 Next up in our final lesson, we'll put everything together as we explore creating sustainable lifestyle changes. You're so close to completing this certification - I'm proud of how far you've come!`,
        },
    ];

    return (
        <LessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Mindful Eating"
            lessonSubtitle="The psychology of food choices"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
        />
    );
}
