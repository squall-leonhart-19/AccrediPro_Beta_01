import prisma from "@/lib/prisma";

/**
 * Check if a user has been marked as disputed (chargeback filed)
 * Used to suppress all emails and block access
 */
export async function isUserDisputed(userId: string): Promise<boolean> {
    if (!userId) return false;

    const disputeTag = await prisma.userTag.findUnique({
        where: { userId_tag: { userId, tag: "dispute_filed" } },
        select: { id: true },
    });

    return !!disputeTag;
}

/**
 * Check if a user's email should be suppressed
 * Returns true if user has dispute_filed or email_suppressed tag
 */
export async function isEmailSuppressed(userId: string): Promise<boolean> {
    if (!userId) return false;

    const suppressionTag = await prisma.userTag.findFirst({
        where: {
            userId,
            tag: { in: ["dispute_filed", "email_suppressed", "suppress_bounced"] },
        },
        select: { tag: true },
    });

    return !!suppressionTag;
}

/**
 * Check if a user's access should be blocked
 * Returns true if user has dispute_filed or access_blocked tag
 */
export async function isAccessBlocked(userId: string): Promise<boolean> {
    if (!userId) return false;

    const blockTag = await prisma.userTag.findFirst({
        where: {
            userId,
            tag: { in: ["dispute_filed", "access_blocked"] },
        },
        select: { tag: true },
    });

    return !!blockTag;
}

/**
 * Get dispute status details 
 */
export async function getDisputeStatus(userId: string): Promise<{
    isDisputed: boolean;
    disputeDetails?: {
        filedAt?: string;
        reason?: string;
    };
}> {
    if (!userId) return { isDisputed: false };

    const disputeTag = await prisma.userTag.findUnique({
        where: { userId_tag: { userId, tag: "dispute_filed" } },
        select: { value: true, createdAt: true },
    });

    if (!disputeTag) return { isDisputed: false };

    let details = {};
    try {
        details = disputeTag.value ? JSON.parse(disputeTag.value) : {};
    } catch {
        details = { filedAt: disputeTag.createdAt?.toISOString() };
    }

    return {
        isDisputed: true,
        disputeDetails: details as { filedAt?: string; reason?: string },
    };
}
