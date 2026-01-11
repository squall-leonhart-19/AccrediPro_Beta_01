// Oracle Event Tracking - Easy integration for the app

import { prisma } from "@/lib/prisma";

// Event types
export const EVENTS = {
    // Auth events
    LOGIN: "login",
    LOGOUT: "logout",
    SIGNUP: "signup",

    // Learning events
    LESSON_STARTED: "lesson_started",
    LESSON_COMPLETED: "lesson_completed",
    QUIZ_COMPLETED: "quiz_completed",
    MODULE_COMPLETED: "module_completed",
    COURSE_COMPLETED: "course_completed",

    // Engagement events
    COURSE_ENROLLED: "course_enrolled",
    CERTIFICATE_DOWNLOADED: "certificate_downloaded",
    PROFILE_UPDATED: "profile_updated",

    // Communication events
    MESSAGE_SENT: "message_sent",
    DM_OPENED: "dm_opened",
    EMAIL_OPENED: "email_opened",
    EMAIL_CLICKED: "email_clicked",

    // Purchase events
    PURCHASE_STARTED: "purchase_started",
    PURCHASE_COMPLETED: "purchase_completed",

    // Community events
    POST_CREATED: "post_created",
    COMMENT_ADDED: "comment_added",
};

/**
 * Track a user event in Oracle
 * Safe to call even if Oracle tables don't exist yet
 */
export async function trackEvent(
    userId: string,
    event: string,
    metadata?: Record<string, any>
): Promise<boolean> {
    try {
        await prisma.oracleEvent.create({
            data: {
                userId,
                event,
                metadata: metadata || {},
            },
        });
        return true;
    } catch (error) {
        // Silently fail if tables don't exist
        console.log(`[Oracle] Event tracking skipped: ${event}`);
        return false;
    }
}

/**
 * Get recent events for a user
 */
export async function getUserEvents(userId: string, limit = 50) {
    try {
        return await prisma.oracleEvent.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    } catch {
        return [];
    }
}

/**
 * Get today's event count
 */
export async function getTodayEventCount() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return await prisma.oracleEvent.count({
            where: { createdAt: { gte: today } },
        });
    } catch {
        return 0;
    }
}

/**
 * Get recent activity feed
 */
export async function getActivityFeed(limit = 20) {
    try {
        const events = await prisma.oracleEvent.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        return events.map((e) => ({
            id: e.id,
            event: e.event,
            userName: `${e.user.firstName || ""} ${e.user.lastName || ""}`.trim() || "User",
            metadata: e.metadata,
            createdAt: e.createdAt,
        }));
    } catch {
        return [];
    }
}
