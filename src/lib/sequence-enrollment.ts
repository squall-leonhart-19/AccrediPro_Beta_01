import prisma from "@/lib/prisma";

/**
 * Enroll a user in sequences with the given trigger type
 *
 * @param userId - The user ID to enroll
 * @param triggerType - The sequence trigger type (MINI_DIPLOMA_STARTED, MINI_DIPLOMA_COMPLETED, etc.)
 * @param source - Optional source identifier for tracking
 * @returns Number of sequences the user was enrolled in
 */
export async function enrollUserInSequences(
    userId: string,
    triggerType: string,
    source?: string
): Promise<number> {
    const now = new Date();

    // Find all active sequences with this trigger
    const sequences = await prisma.sequence.findMany({
        where: {
            isActive: true,
            triggerType: triggerType as any,
        },
        include: {
            emails: {
                where: { isActive: true },
                orderBy: { order: "asc" },
                take: 1, // Only need first email for delay calculation
            },
        },
    });

    if (sequences.length === 0) {
        console.log(`[sequence-enrollment] No active sequences found for trigger: ${triggerType}`);
        return 0;
    }

    let enrolledCount = 0;

    for (const sequence of sequences) {
        // Check if already enrolled
        const existingEnrollment = await prisma.sequenceEnrollment.findFirst({
            where: {
                userId,
                sequenceId: sequence.id,
            },
        });

        if (existingEnrollment) {
            console.log(`[sequence-enrollment] User ${userId} already enrolled in sequence ${sequence.slug}`);
            continue;
        }

        // Calculate first email send time
        const firstEmail = sequence.emails[0];
        let nextSendAt: Date;

        if (firstEmail) {
            const delayMs = ((firstEmail.delayDays || 0) * 24 * 60 + (firstEmail.delayHours || 0) * 60) * 60 * 1000;
            if (delayMs === 0) {
                // Day 0 email: send in 5 minutes
                nextSendAt = new Date(now.getTime() + 5 * 60 * 1000);
            } else {
                // Future email: calculate based on delay
                nextSendAt = new Date(now.getTime() + delayMs);
            }
        } else {
            nextSendAt = new Date(now.getTime() + 5 * 60 * 1000);
        }

        // Create enrollment
        await prisma.sequenceEnrollment.create({
            data: {
                userId,
                sequenceId: sequence.id,
                status: "ACTIVE",
                currentEmailIndex: 0,
                nextSendAt,
            },
        });

        // Update sequence enrollment count
        await prisma.sequence.update({
            where: { id: sequence.id },
            data: { totalEnrolled: { increment: 1 } },
        });

        enrolledCount++;
        console.log(`[sequence-enrollment] Enrolled user ${userId} in sequence: ${sequence.slug}`);
    }

    return enrolledCount;
}

/**
 * Retroactively enroll users who have already completed the trigger action
 * but were never enrolled in sequences
 *
 * @param triggerType - The trigger type to check
 * @param tagPattern - The tag pattern to find users (e.g., "%-lesson-complete:1" for lesson 1)
 * @returns Object with counts
 */
export async function retroactiveEnrollment(
    triggerType: string,
    tagPattern: string
): Promise<{ checked: number; enrolled: number; skipped: number; errors: number }> {
    const results = { checked: 0, enrolled: 0, skipped: 0, errors: 0 };

    // Find sequences with this trigger
    const sequences = await prisma.sequence.findMany({
        where: {
            isActive: true,
            triggerType: triggerType as any,
        },
    });

    if (sequences.length === 0) {
        console.log(`[retroactive-enroll] No sequences found for trigger: ${triggerType}`);
        return results;
    }

    // Find users with matching tags who aren't enrolled
    const usersWithTag = await prisma.userTag.findMany({
        where: {
            tag: { contains: tagPattern },
        },
        select: {
            userId: true,
        },
        distinct: ['userId'],
    });

    console.log(`[retroactive-enroll] Found ${usersWithTag.length} users with tag pattern: ${tagPattern}`);

    for (const { userId } of usersWithTag) {
        results.checked++;

        try {
            const enrolled = await enrollUserInSequences(userId, triggerType, "retroactive");
            if (enrolled > 0) {
                results.enrolled++;
            } else {
                results.skipped++;
            }
        } catch (error) {
            results.errors++;
            console.error(`[retroactive-enroll] Error enrolling user ${userId}:`, error);
        }
    }

    return results;
}
