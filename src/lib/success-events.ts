/**
 * Success Events Generator
 * Creates zombie success events for the Success Feed
 * 100% zombie-powered for FOMO and social proof
 */

import { ZOMBIE_PROFILES } from "./zombies";

// Success event types
export type SuccessEventType =
    | "certified"
    | "first_client"
    | "milestone_500"
    | "milestone_1000"
    | "milestone_5000"
    | "milestone_10000"
    | "streak_7"
    | "streak_14"
    | "streak_30"
    | "course_complete"
    | "module_complete";

interface SuccessEventTemplate {
    type: SuccessEventType;
    messages: string[];
    frequency: "daily" | "every_2_days" | "every_3_days" | "weekly";
}

// Templates for zombie success events
export const SUCCESS_EVENT_TEMPLATES: SuccessEventTemplate[] = [
    // Certifications - most impactful, 2-3x per week
    {
        type: "certified",
        frequency: "every_2_days",
        messages: [
            "{name} just got CERTIFIED! 🎓",
            "{name} earned their certification! 🎉",
            "🎓 Congrats to {name} - officially certified!",
            "{name} passed the final exam! Welcome to the practitioner family! 🙌",
        ],
    },

    // First client - every 2-3 days
    {
        type: "first_client",
        frequency: "every_2_days",
        messages: [
            "{name} just got their first paying client! 💰",
            "🎉 {name} landed their first client! The journey begins!",
            "{name}'s first consultation complete! Making money moves 💵",
        ],
    },

    // $500 milestone - every 2-3 days
    {
        type: "milestone_500",
        frequency: "every_3_days",
        messages: [
            "{name} just hit $500 in earnings! 💵",
            "🎯 {name} reached the $500 milestone!",
            "{name} earned their first $500! 💰",
        ],
    },

    // $1,000 milestone - weekly
    {
        type: "milestone_1000",
        frequency: "weekly",
        messages: [
            "🚀 {name} just crossed $1,000/month!",
            "{name} hit $1K in monthly income! 💰",
            "Milestone alert: {name} earned $1,000 this month! 🎉",
        ],
    },

    // $5,000 milestone - rare (weekly)
    {
        type: "milestone_5000",
        frequency: "weekly",
        messages: [
            "🔥 {name} is earning $5,000/month now!",
            "Major milestone: {name} hit $5K monthly! 💎",
        ],
    },

    // Streaks - daily variety
    {
        type: "streak_7",
        frequency: "daily",
        messages: [
            "🔥 {name} hit a 7-day streak!",
            "{name} is on fire - 7 days straight! 🔥",
        ],
    },
    {
        type: "streak_14",
        frequency: "every_2_days",
        messages: [
            "🔥🔥 {name} hit a 14-day streak!",
            "Two weeks strong! {name}'s streak is on fire! 🔥",
        ],
    },

    // Module completions - daily (frequent activity)
    {
        type: "module_complete",
        frequency: "daily",
        messages: [
            "📚 {name} completed a module!",
            "{name} just finished another module! 🎯",
            "Progress! {name} completed Module {module} 📖",
        ],
    },
];

// Generate random zombie success event
export function generateZombieSuccessEvent(): {
    zombieId: string;
    zombieName: string;
    eventType: SuccessEventType;
    message: string;
    createdAt: Date;
} {
    // Pick random zombie
    const zombie = ZOMBIE_PROFILES[Math.floor(Math.random() * ZOMBIE_PROFILES.length)];

    // Weight event types by frequency
    const weightedTemplates: SuccessEventTemplate[] = [];
    SUCCESS_EVENT_TEMPLATES.forEach((template) => {
        const weight =
            template.frequency === "daily" ? 4 :
                template.frequency === "every_2_days" ? 2 :
                    template.frequency === "every_3_days" ? 1.5 :
                        1;
        for (let i = 0; i < weight; i++) {
            weightedTemplates.push(template);
        }
    });

    // Pick random template
    const template = weightedTemplates[Math.floor(Math.random() * weightedTemplates.length)];

    // Generate message
    let message = template.messages[Math.floor(Math.random() * template.messages.length)];
    message = message.replace("{name}", zombie.name);
    message = message.replace("{module}", String(Math.floor(Math.random() * 8) + 1));

    // Random time in last 24 hours
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    const createdAt = new Date(Date.now() - hoursAgo * 3600000 - minutesAgo * 60000);

    return {
        zombieId: zombie.name.toLowerCase().replace(/\s+/g, "-"),
        zombieName: zombie.name,
        eventType: template.type,
        message,
        createdAt,
    };
}

// Generate batch of zombie events for display
export function generateZombieSuccessEvents(count: number = 5): ReturnType<typeof generateZombieSuccessEvent>[] {
    const events: ReturnType<typeof generateZombieSuccessEvent>[] = [];
    const usedTypes = new Set<string>();

    for (let i = 0; i < count; i++) {
        let event = generateZombieSuccessEvent();
        // Avoid too many of the same type
        let attempts = 0;
        while (usedTypes.has(event.eventType) && attempts < 10) {
            event = generateZombieSuccessEvent();
            attempts++;
        }
        usedTypes.add(event.eventType);
        events.push(event);
    }

    // Sort by time (most recent first)
    events.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return events;
}

// Generate income events specifically (for income feed)
export function generateZombieIncomeEvents(count: number = 3): ReturnType<typeof generateZombieSuccessEvent>[] {
    const incomeTypes: SuccessEventType[] = [
        "first_client",
        "milestone_500",
        "milestone_1000",
        "milestone_5000",
    ];

    const events: ReturnType<typeof generateZombieSuccessEvent>[] = [];

    for (let i = 0; i < count; i++) {
        const zombie = ZOMBIE_PROFILES[Math.floor(Math.random() * ZOMBIE_PROFILES.length)];
        const eventType = incomeTypes[Math.floor(Math.random() * incomeTypes.length)];
        const template = SUCCESS_EVENT_TEMPLATES.find((t) => t.type === eventType)!;
        let message = template.messages[Math.floor(Math.random() * template.messages.length)];
        message = message.replace("{name}", zombie.name);

        // Spread over 2-3 days
        const hoursAgo = Math.floor(Math.random() * 72);
        const createdAt = new Date(Date.now() - hoursAgo * 3600000);

        events.push({
            zombieId: zombie.name.toLowerCase().replace(/\s+/g, "-"),
            zombieName: zombie.name,
            eventType,
            message,
            createdAt,
        });
    }

    events.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return events;
}
