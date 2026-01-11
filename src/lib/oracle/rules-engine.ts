// Oracle Rules Engine - Evaluate and trigger automation rules

import { prisma } from "@/lib/prisma";
import type { OracleActionType } from "./types";

interface RuleCondition {
    event?: string;
    daysSince?: number;
    segment?: string;
    churnRisk?: { min?: number; max?: number };
    lifecycle?: string;
    progress?: { min?: number; max?: number };
}

interface RuleAction {
    template?: string;
    subject?: string;
    content?: string;
    tag?: string;
}

/**
 * Evaluate if a rule's conditions are met for a user
 */
async function evaluateConditions(
    userId: string,
    conditions: RuleCondition
): Promise<boolean> {
    // Get user segment
    const segment = await prisma.oracleSegment.findUnique({
        where: { userId },
    });

    // Get user data
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            lastLoginAt: true,
            hasCompletedOnboarding: true,
        },
    });

    if (!segment || !user) return false;

    // Check segment match
    if (conditions.segment && segment.engagementLevel !== conditions.segment) {
        return false;
    }

    // Check lifecycle match
    if (conditions.lifecycle && segment.lifecycle !== conditions.lifecycle) {
        return false;
    }

    // Check churn risk range
    if (conditions.churnRisk) {
        if (conditions.churnRisk.min !== undefined && segment.churnRisk < conditions.churnRisk.min) {
            return false;
        }
        if (conditions.churnRisk.max !== undefined && segment.churnRisk > conditions.churnRisk.max) {
            return false;
        }
    }

    // Check days since login
    if (conditions.daysSince && user.lastLoginAt) {
        const daysSinceLogin = Math.floor(
            (Date.now() - user.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceLogin < conditions.daysSince) {
            return false;
        }
    }

    // Check progress range
    if (conditions.progress) {
        const enrollment = await prisma.enrollment.findFirst({
            where: { userId },
            orderBy: { updatedAt: "desc" },
            select: { progress: true },
        });
        const progress = enrollment?.progress || 0;

        if (conditions.progress.min !== undefined && progress < conditions.progress.min) {
            return false;
        }
        if (conditions.progress.max !== undefined && progress > conditions.progress.max) {
            return false;
        }
    }

    return true;
}

/**
 * Check if rule can be applied (cooldown, max per user)
 */
async function canApplyRule(ruleId: string, userId: string, cooldownHours: number, maxPerUser?: number | null): Promise<boolean> {
    const cooldownTime = new Date(Date.now() - cooldownHours * 60 * 60 * 1000);

    // Check cooldown
    const recentAction = await prisma.oracleAction.findFirst({
        where: {
            userId,
            triggeredBy: ruleId,
            createdAt: { gte: cooldownTime },
        },
    });

    if (recentAction) return false;

    // Check max per user
    if (maxPerUser) {
        const actionCount = await prisma.oracleAction.count({
            where: {
                userId,
                triggeredBy: ruleId,
            },
        });
        if (actionCount >= maxPerUser) return false;
    }

    return true;
}

/**
 * Create an action based on rule
 */
async function createActionFromRule(
    userId: string,
    ruleId: string,
    actionType: OracleActionType,
    actionData: RuleAction,
    priority: number
) {
    return prisma.oracleAction.create({
        data: {
            userId,
            actionType,
            content: actionData.content || "",
            subject: actionData.subject,
            template: actionData.template,
            triggeredBy: ruleId,
            priority,
            status: priority >= 8 ? "pending" : "approved", // High priority needs approval
        },
    });
}

/**
 * Evaluate a single rule for all applicable users
 */
export async function evaluateRule(ruleId: string) {
    const rule = await prisma.oracleRule.findUnique({
        where: { id: ruleId },
    });

    if (!rule || !rule.isActive) return { triggered: 0 };

    const conditions = rule.conditions as RuleCondition;
    const actionData = rule.actionData as RuleAction;

    // Get users to evaluate based on trigger type
    let users: { id: string }[] = [];

    if (rule.trigger === "segment_based" && conditions.segment) {
        // Get users in specific segment
        const segments = await prisma.oracleSegment.findMany({
            where: { engagementLevel: conditions.segment },
            select: { userId: true },
        });
        users = segments.map(s => ({ id: s.userId }));
    } else {
        // Evaluate all real users
        users = await prisma.user.findMany({
            where: {
                isFakeProfile: false,
                email: { not: null },
            },
            select: { id: true },
            take: 500,
        });
    }

    let triggered = 0;

    for (const user of users) {
        // Check conditions
        const conditionsMet = await evaluateConditions(user.id, conditions);
        if (!conditionsMet) continue;

        // Check cooldown and max
        const canApply = await canApplyRule(
            rule.id,
            user.id,
            rule.cooldown,
            rule.maxPerUser
        );
        if (!canApply) continue;

        // Create action
        await createActionFromRule(
            user.id,
            rule.id,
            rule.actionType as OracleActionType,
            actionData,
            rule.priority
        );

        triggered++;
    }

    // Update rule stats
    await prisma.oracleRule.update({
        where: { id: ruleId },
        data: {
            timesTriggered: { increment: triggered },
            lastTriggered: new Date(),
        },
    });

    return { triggered };
}

/**
 * Evaluate all active rules
 */
export async function evaluateAllRules() {
    const rules = await prisma.oracleRule.findMany({
        where: { isActive: true },
        orderBy: { priority: "desc" },
    });

    const results = {
        rulesEvaluated: rules.length,
        totalTriggered: 0,
    };

    for (const rule of rules) {
        const { triggered } = await evaluateRule(rule.id);
        results.totalTriggered += triggered;
    }

    return results;
}

/**
 * Create a new rule
 */
export async function createRule(data: {
    name: string;
    description?: string;
    trigger: string;
    conditions: RuleCondition;
    actionType: OracleActionType;
    actionData: RuleAction;
    priority?: number;
    cooldown?: number;
    maxPerUser?: number;
}) {
    return prisma.oracleRule.create({
        data: {
            name: data.name,
            description: data.description,
            trigger: data.trigger,
            conditions: data.conditions,
            actionType: data.actionType,
            actionData: data.actionData,
            priority: data.priority || 5,
            cooldown: data.cooldown || 24,
            maxPerUser: data.maxPerUser,
        },
    });
}

/**
 * Get all rules
 */
export async function getRules(activeOnly: boolean = false) {
    return prisma.oracleRule.findMany({
        where: activeOnly ? { isActive: true } : undefined,
        orderBy: [
            { isActive: "desc" },
            { priority: "desc" },
        ],
    });
}

/**
 * Toggle rule active status
 */
export async function toggleRule(ruleId: string) {
    const rule = await prisma.oracleRule.findUnique({
        where: { id: ruleId },
    });

    if (!rule) return null;

    return prisma.oracleRule.update({
        where: { id: ruleId },
        data: { isActive: !rule.isActive },
    });
}
