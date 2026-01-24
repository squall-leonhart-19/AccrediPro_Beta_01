// Behavioral Nudges System
// Triggers based on real-time user behavior (not just time-based inactivity)
// Runs every 30 minutes via CRON

export interface BehavioralTrigger {
    id: string;
    condition: "opened_no_action" | "lesson_abandoned" | "lesson_complete_no_continue";
    windowMinutes: number; // How far back to look
    delayMinutes: number; // How long after trigger before sending nudge
    message: string;
    emoji: string;
    priority: number;
}

export const BEHAVIORAL_TRIGGERS: BehavioralTrigger[] = [
    {
        id: "opened_no_action",
        condition: "opened_no_action",
        windowMinutes: 30, // Look at last 30 min
        delayMinutes: 10, // Wait 10 min after open before nudging
        message: "Hey {{firstName}}! I saw you pop in. Looking for something specific? I'm here if you need help!",
        emoji: "👋",
        priority: 1,
    },
    {
        id: "lesson_abandoned_50",
        condition: "lesson_abandoned",
        windowMinutes: 180, // Look at last 3 hours
        delayMinutes: 120, // Wait 2 hours after abandoning
        message: "You were halfway through \"{{lessonTitle}}\"! Want me to summarize where you left off? Sometimes a quick refresh is all we need.",
        emoji: "📚",
        priority: 2,
    },
    {
        id: "lesson_complete_no_continue",
        condition: "lesson_complete_no_continue",
        windowMinutes: 360, // Look at last 6 hours
        delayMinutes: 240, // Wait 4 hours after completing
        message: "Nice work finishing \"{{lessonTitle}}\"! Ready for the next one? {{nextLessonTitle}} is only {{lessonDuration}} minutes.",
        emoji: "🎯",
        priority: 2,
    },
];

export interface BehavioralNudgeData {
    userId: string;
    firstName: string;
    lastLoginAt: Date | null;
    lastLessonId: string | null;
    lastLessonTitle: string | null;
    lastLessonCompletedAt: Date | null;
    nextLessonTitle: string | null;
    lessonDuration: number;
    hasCompletedAnyLessonToday: boolean;
    sessionStartedAt: Date | null; // When they opened the app
}

/**
 * Evaluate which behavioral trigger (if any) applies
 */
export function evaluateBehavioralTrigger(
    data: BehavioralNudgeData,
    now: Date = new Date()
): BehavioralTrigger | null {
    const applicableTriggers: BehavioralTrigger[] = [];

    for (const trigger of BEHAVIORAL_TRIGGERS) {
        const windowStart = new Date(now.getTime() - trigger.windowMinutes * 60 * 1000);
        const nudgeThreshold = new Date(now.getTime() - trigger.delayMinutes * 60 * 1000);

        switch (trigger.condition) {
            case "opened_no_action":
                // User opened app but hasn't completed any lesson and session is old enough
                if (
                    data.sessionStartedAt &&
                    data.sessionStartedAt >= windowStart &&
                    data.sessionStartedAt <= nudgeThreshold &&
                    !data.hasCompletedAnyLessonToday
                ) {
                    applicableTriggers.push(trigger);
                }
                break;

            case "lesson_abandoned":
                // User was in a lesson but didn't complete it (tracked by page view without completion)
                // This requires a separate tracking mechanism - simplified for now
                break;

            case "lesson_complete_no_continue":
                // User completed a lesson but didn't start the next one
                if (
                    data.lastLessonCompletedAt &&
                    data.lastLessonCompletedAt >= windowStart &&
                    data.lastLessonCompletedAt <= nudgeThreshold &&
                    data.nextLessonTitle
                ) {
                    applicableTriggers.push(trigger);
                }
                break;
        }
    }

    // Return highest priority trigger
    return applicableTriggers.sort((a, b) => b.priority - a.priority)[0] || null;
}

/**
 * Fill in message template with user data
 */
export function fillBehavioralMessage(
    template: string,
    data: BehavioralNudgeData
): string {
    return template
        .replace(/\{\{firstName\}\}/g, data.firstName)
        .replace(/\{\{lessonTitle\}\}/g, data.lastLessonTitle || "your lesson")
        .replace(/\{\{nextLessonTitle\}\}/g, data.nextLessonTitle || "the next lesson")
        .replace(/\{\{lessonDuration\}\}/g, String(data.lessonDuration || 10));
}
