// Oracle Executor - Execute approved actions (emails, DMs, etc.)

import { prisma } from "@/lib/prisma";
import { trackEvent } from "./observer";

/**
 * Execute a single action
 */
export async function executeAction(actionId: string) {
    const action = await prisma.oracleAction.findUnique({
        where: { id: actionId },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
        },
    });

    if (!action || action.status !== "approved") {
        return { success: false, error: "Action not found or not approved" };
    }

    try {
        let result: any = null;

        switch (action.actionType) {
            case "email":
                result = await sendEmail(action);
                break;
            case "dm":
                result = await sendDM(action);
                break;
            case "push":
                result = await sendPush(action);
                break;
            case "tag":
                result = await addTag(action);
                break;
            default:
                throw new Error(`Unknown action type: ${action.actionType}`);
        }

        // Mark as executed
        await prisma.oracleAction.update({
            where: { id: actionId },
            data: {
                status: "executed",
                executedAt: new Date(),
                outcome: result,
            },
        });

        // Track event
        await trackEvent({
            userId: action.userId,
            event: `oracle_${action.actionType}_sent`,
            metadata: { actionId, template: action.template },
            source: "api",
        });

        return { success: true, result };
    } catch (error) {
        // Mark as failed
        await prisma.oracleAction.update({
            where: { id: actionId },
            data: {
                status: "failed",
                outcome: { error: String(error) },
            },
        });

        return { success: false, error: String(error) };
    }
}

/**
 * Send email
 */
async function sendEmail(action: any) {
    const { user, subject, content } = action;

    if (!user.email) {
        throw new Error("User has no email");
    }

    // Create email record in existing system
    const email = await prisma.emailSend.create({
        data: {
            userId: user.id,
            subject: subject || "Message from AccrediPro",
            content: content,
            status: "PENDING",
            type: "ORACLE_AUTO",
        },
    });

    // In production, this would call Resend/SendGrid
    // For now, mark as sent
    await prisma.emailSend.update({
        where: { id: email.id },
        data: {
            status: "SENT",
            sentAt: new Date(),
        },
    });

    return { emailId: email.id, sent: true };
}

/**
 * Send DM (internal message)
 */
async function sendDM(action: any) {
    const { user, content } = action;

    // Get Sarah coach (or system user)
    const coach = await prisma.user.findFirst({
        where: {
            OR: [
                { email: "sarah@accredipro-certificate.com" },
                { role: "ADMIN" },
            ],
        },
        select: { id: true },
    });

    if (!coach) {
        throw new Error("No coach found to send DM");
    }

    // Create message
    const message = await prisma.message.create({
        data: {
            senderId: coach.id,
            receiverId: user.id,
            content: content,
            isRead: false,
        },
    });

    return { messageId: message.id, sent: true };
}

/**
 * Send push notification
 */
async function sendPush(action: any) {
    const { user, content } = action;

    // Create notification
    const notification = await prisma.notification.create({
        data: {
            userId: user.id,
            type: "ORACLE_NUDGE",
            title: "Coach Sarah",
            message: content,
            isRead: false,
        },
    });

    return { notificationId: notification.id, sent: true };
}

/**
 * Add tag to user
 */
async function addTag(action: any) {
    const { user } = action;
    const tagName = (action.metadata as any)?.tag || "oracle_auto";

    // Find or create tag
    let tag = await prisma.tag.findFirst({
        where: { name: tagName },
    });

    if (!tag) {
        tag = await prisma.tag.create({
            data: { name: tagName },
        });
    }

    // Add to user
    await prisma.userTag.upsert({
        where: {
            userId_tagId: {
                userId: user.id,
                tagId: tag.id,
            },
        },
        create: {
            userId: user.id,
            tagId: tag.id,
        },
        update: {},
    });

    return { tagId: tag.id, added: true };
}

/**
 * Execute all approved actions
 */
export async function executeApprovedActions() {
    const actions = await prisma.oracleAction.findMany({
        where: {
            status: "approved",
            OR: [
                { scheduledAt: null },
                { scheduledAt: { lte: new Date() } },
            ],
        },
        orderBy: [
            { priority: "desc" },
            { createdAt: "asc" },
        ],
        take: 100,
    });

    const results = {
        total: actions.length,
        success: 0,
        failed: 0,
    };

    for (const action of actions) {
        const { success } = await executeAction(action.id);
        if (success) {
            results.success++;
        } else {
            results.failed++;
        }
    }

    return results;
}

/**
 * Get action stats for dashboard
 */
export async function getActionStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);

    const [pending, executedToday, executedWeek, failed] = await Promise.all([
        prisma.oracleAction.count({ where: { status: "pending" } }),
        prisma.oracleAction.count({
            where: {
                status: "executed",
                executedAt: { gte: today },
            },
        }),
        prisma.oracleAction.count({
            where: {
                status: "executed",
                executedAt: { gte: thisWeek },
            },
        }),
        prisma.oracleAction.count({
            where: {
                status: "failed",
                createdAt: { gte: thisWeek },
            },
        }),
    ]);

    return { pending, executedToday, executedWeek, failed };
}
