// Oracle Observer - Tracks all user events

import { prisma } from "@/lib/prisma";
import type { TrackEventParams, OracleEventType } from "./types";

// All trackable events
export const ORACLE_EVENTS = {
    // User activity
    LOGIN: "login",
    LOGOUT: "logout",
    PAGE_VIEW: "page_view",

    // Learning
    LESSON_START: "lesson_start",
    LESSON_COMPLETE: "lesson_complete",
    MODULE_COMPLETE: "module_complete",
    COURSE_COMPLETE: "course_complete",
    QUIZ_PASS: "quiz_pass",
    QUIZ_FAIL: "quiz_fail",
    CERTIFICATE_DOWNLOAD: "certificate_download",

    // Engagement
    NOTE_CREATED: "note_created",
    COMMUNITY_POST: "community_post",
    COMMUNITY_COMMENT: "community_comment",
    DM_SENT: "dm_sent",
    DM_READ: "dm_read",

    // Email
    EMAIL_SENT: "email_sent",
    EMAIL_OPEN: "email_open",
    EMAIL_CLICK: "email_click",

    // Revenue
    PURCHASE: "purchase",
    REFUND: "refund",
    UPGRADE: "upgrade",

    // Custom
    FEEDBACK_GIVEN: "feedback_given",
    REFERRAL_SHARED: "referral_shared",
    SUPPORT_TICKET: "support_ticket",
} as const;

/**
 * Track a user event in Oracle
 */
export async function trackEvent(params: TrackEventParams) {
    try {
        return await prisma.oracleEvent.create({
            data: {
                userId: params.userId,
                event: params.event,
                metadata: params.metadata || {},
                source: params.source || "web",
                sessionId: params.sessionId,
            },
        });
    } catch (error) {
        console.error("[Oracle] Failed to track event:", error);
        return null;
    }
}

/**
 * Get user's recent events
 */
export async function getUserEvents(
    userId: string,
    options?: {
        limit?: number;
        since?: Date;
        eventTypes?: OracleEventType[];
    }
) {
    return prisma.oracleEvent.findMany({
        where: {
            userId,
            createdAt: options?.since ? { gte: options.since } : undefined,
            event: options?.eventTypes ? { in: options.eventTypes } : undefined,
        },
        orderBy: { createdAt: "desc" },
        take: options?.limit || 100,
    });
}

/**
 * Get event counts for a user in a time period
 */
export async function getUserEventCounts(userId: string, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const events = await prisma.oracleEvent.groupBy({
        by: ["event"],
        where: {
            userId,
            createdAt: { gte: since },
        },
        _count: true,
    });

    return events.reduce((acc, e) => {
        acc[e.event] = e._count;
        return acc;
    }, {} as Record<string, number>);
}

/**
 * Get the last login date for a user
 */
export async function getLastLogin(userId: string): Promise<Date | null> {
    const event = await prisma.oracleEvent.findFirst({
        where: {
            userId,
            event: "login",
        },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
    });

    return event?.createdAt || null;
}

/**
 * Get today's event stats for dashboard
 */
export async function getTodayEventStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await prisma.oracleEvent.groupBy({
        by: ["event"],
        where: {
            createdAt: { gte: today },
        },
        _count: true,
    });

    return {
        total: events.reduce((sum, e) => sum + e._count, 0),
        byType: events.reduce((acc, e) => {
            acc[e.event] = e._count;
            return acc;
        }, {} as Record<string, number>),
    };
}

/**
 * Get recent events for live feed
 */
export async function getRecentEvents(limit: number = 50) {
    return prisma.oracleEvent.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true,
                },
            },
        },
    });
}
