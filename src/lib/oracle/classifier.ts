// Oracle Classifier - User segmentation and scoring

import { prisma } from "@/lib/prisma";
import { getUserEvents, getUserEventCounts, getLastLogin } from "./observer";
import type { EngagementLevel, LifecycleStage } from "./types";

/**
 * Calculate days since a date
 */
function daysSince(date: Date | null): number {
    if (!date) return 999;
    return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Calculate engagement level based on activity
 */
function calculateEngagementLevel(
    daysSinceLogin: number,
    lessonsThisWeek: number,
    totalEventsThisWeek: number
): { level: EngagementLevel; score: number } {

    // Lost - no activity for 30+ days
    if (daysSinceLogin > 30) {
        return { level: "lost", score: 0 };
    }

    // Dormant - 14-30 days inactive
    if (daysSinceLogin > 14) {
        return { level: "dormant", score: 15 };
    }

    // Active - lessons recently + regular logins
    if (lessonsThisWeek >= 3 && daysSinceLogin <= 2) {
        return { level: "active", score: 90 };
    }

    // Active - good engagement
    if (lessonsThisWeek >= 1 && totalEventsThisWeek >= 10) {
        return { level: "active", score: 75 };
    }

    // Moderate - some activity
    if (daysSinceLogin <= 7 && totalEventsThisWeek >= 3) {
        return { level: "moderate", score: 55 };
    }

    // Dormant - logged in but minimal activity
    if (daysSinceLogin <= 14) {
        return { level: "dormant", score: 30 };
    }

    // New user
    return { level: "new", score: 50 };
}

/**
 * Calculate churn risk (0-100)
 */
function calculateChurnRisk(
    daysSinceLogin: number,
    lessonsThisWeek: number,
    totalEventsThisWeek: number,
    progressPercent: number
): { risk: number; reason: string | null } {

    let risk = 0;
    let reason: string | null = null;

    // Days since login is biggest factor
    if (daysSinceLogin > 30) {
        risk = 95;
        reason = "inactive_30_days";
    } else if (daysSinceLogin > 14) {
        risk = 75;
        reason = "inactive_14_days";
    } else if (daysSinceLogin > 7) {
        risk = 50;
        reason = "inactive_7_days";
    } else if (daysSinceLogin > 3) {
        risk = 30;
        reason = "inactivity";
    } else {
        risk = 10;
    }

    // Adjust for progress
    if (progressPercent === 0 && daysSinceLogin > 3) {
        risk = Math.min(100, risk + 20);
        reason = "no_progress";
    }

    // Low activity even when logging in
    if (daysSinceLogin <= 3 && lessonsThisWeek === 0 && totalEventsThisWeek < 5) {
        risk = Math.min(100, risk + 15);
        reason = "stuck";
    }

    // Active users have low risk
    if (lessonsThisWeek >= 2) {
        risk = Math.max(0, risk - 30);
        reason = null;
    }

    return { risk: Math.max(0, Math.min(100, risk)), reason };
}

/**
 * Determine lifecycle stage
 */
async function determineLifecycle(
    userId: string,
    hasCompletedOnboarding: boolean,
    progress: number,
    hasCertificate: boolean
): Promise<LifecycleStage> {

    if (hasCertificate) {
        return "alumni";
    }

    if (progress >= 90) {
        return "graduate";
    }

    if (progress >= 25) {
        return "engaged";
    }

    if (hasCompletedOnboarding || progress > 0) {
        return "active";
    }

    // Check if they have any enrollments
    const enrollmentCount = await prisma.enrollment.count({
        where: { userId },
    });

    if (enrollmentCount > 0) {
        return "new";
    }

    return "lead";
}

/**
 * Classify a single user and update their segment
 */
export async function classifyUser(userId: string) {
    try {
        // Get user data
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                hasCompletedOnboarding: true,
                lastLoginAt: true,
                isFakeProfile: true,
            },
        });

        if (!user || user.isFakeProfile) {
            return null;
        }

        // Get event counts for last 7 days
        const eventCounts = await getUserEventCounts(userId, 7);
        const lessonsThisWeek = eventCounts["lesson_complete"] || 0;
        const totalEventsThisWeek = Object.values(eventCounts).reduce((a, b) => a + b, 0);

        // Get last login
        const lastLogin = user.lastLoginAt || await getLastLogin(userId);
        const daysSinceLoginVal = daysSince(lastLogin);

        // Get progress
        const enrollments = await prisma.enrollment.findMany({
            where: { userId },
            select: { progress: true },
        });
        const avgProgress = enrollments.length > 0
            ? enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length
            : 0;

        // Check for certificate
        const hasCertificate = await prisma.certificate.count({
            where: { userId },
        }) > 0;

        // Calculate metrics
        const { level: engagementLevel, score: engagementScore } = calculateEngagementLevel(
            daysSinceLoginVal,
            lessonsThisWeek,
            totalEventsThisWeek
        );

        const { risk: churnRisk, reason: churnReason } = calculateChurnRisk(
            daysSinceLoginVal,
            lessonsThisWeek,
            totalEventsThisWeek,
            avgProgress
        );

        const lifecycle = await determineLifecycle(
            userId,
            user.hasCompletedOnboarding,
            avgProgress,
            hasCertificate
        );

        // Upsert segment
        const segment = await prisma.oracleSegment.upsert({
            where: { userId },
            create: {
                userId,
                engagementLevel,
                engagementScore,
                churnRisk,
                churnReason,
                lifecycle,
                completionProb: Math.max(0, 100 - churnRisk),
                lastAnalyzed: new Date(),
            },
            update: {
                engagementLevel,
                engagementScore,
                churnRisk,
                churnReason,
                lifecycle,
                completionProb: Math.max(0, 100 - churnRisk),
                lastAnalyzed: new Date(),
            },
        });

        return segment;
    } catch (error) {
        console.error(`[Oracle] Failed to classify user ${userId}:`, error);
        return null;
    }
}

/**
 * Classify all active users (for batch processing)
 */
export async function classifyAllUsers(options?: { limit?: number }) {
    const users = await prisma.user.findMany({
        where: {
            isFakeProfile: false,
            email: { not: null },
        },
        select: { id: true },
        take: options?.limit || 1000,
    });

    const results = {
        total: users.length,
        success: 0,
        failed: 0,
    };

    for (const user of users) {
        const result = await classifyUser(user.id);
        if (result) {
            results.success++;
        } else {
            results.failed++;
        }
    }

    return results;
}

/**
 * Get segment distribution stats
 */
export async function getSegmentStats() {
    const segments = await prisma.oracleSegment.groupBy({
        by: ["engagementLevel"],
        _count: true,
    });

    const atRisk = await prisma.oracleSegment.count({
        where: { churnRisk: { gte: 50 } },
    });

    return {
        distribution: segments.reduce((acc, s) => {
            acc[s.engagementLevel] = s._count;
            return acc;
        }, {} as Record<string, number>),
        atRisk,
        total: segments.reduce((sum, s) => sum + s._count, 0),
    };
}

/**
 * Get users in a specific segment
 */
export async function getUsersBySegment(
    engagementLevel: EngagementLevel,
    options?: { limit?: number; offset?: number }
) {
    return prisma.oracleSegment.findMany({
        where: { engagementLevel },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true,
                    lastLoginAt: true,
                },
            },
        },
        orderBy: { churnRisk: "desc" },
        take: options?.limit || 50,
        skip: options?.offset || 0,
    });
}

/**
 * Get at-risk users
 */
export async function getAtRiskUsers(minRisk: number = 50, limit: number = 50) {
    return prisma.oracleSegment.findMany({
        where: { churnRisk: { gte: minRisk } },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true,
                    lastLoginAt: true,
                },
            },
        },
        orderBy: { churnRisk: "desc" },
        take: limit,
    });
}
