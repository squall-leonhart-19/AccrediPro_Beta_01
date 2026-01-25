import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { enrollUserInSequences } from "@/lib/sequence-enrollment";

/**
 * POST /api/admin/retroactive-sequence-enroll
 *
 * Retroactively enroll users who have already started/completed mini diplomas
 * but were never enrolled in email sequences.
 *
 * Admin only endpoint.
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify admin role
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        if (user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Admin access required" }, { status: 403 });
        }

        const results = {
            started: { checked: 0, enrolled: 0, skipped: 0, errors: 0 },
            completed: { checked: 0, enrolled: 0, skipped: 0, errors: 0 },
            details: [] as string[],
        };

        // === ENROLL USERS WHO STARTED (completed lesson 1) ===
        // Find users with lesson 1 completion tags
        const startedUsers = await prisma.userTag.findMany({
            where: {
                tag: { endsWith: "-lesson-complete:1" },
            },
            select: {
                userId: true,
                tag: true,
            },
            distinct: ["userId"],
        });

        results.details.push(`Found ${startedUsers.length} users who completed lesson 1`);

        for (const { userId } of startedUsers) {
            results.started.checked++;
            try {
                const enrolled = await enrollUserInSequences(
                    userId,
                    "MINI_DIPLOMA_STARTED",
                    "retroactive-started"
                );
                if (enrolled > 0) {
                    results.started.enrolled++;
                } else {
                    results.started.skipped++;
                }
            } catch (error) {
                results.started.errors++;
                console.error(`[retroactive-enroll] Error for started user ${userId}:`, error);
            }
        }

        // === ENROLL USERS WHO COMPLETED ===
        // Find users who have miniDiplomaCompletedAt set
        const completedUsers = await prisma.user.findMany({
            where: {
                miniDiplomaCompletedAt: { not: null },
            },
            select: {
                id: true,
                email: true,
            },
        });

        results.details.push(`Found ${completedUsers.length} users who completed mini diploma`);

        for (const { id: userId, email } of completedUsers) {
            results.completed.checked++;
            try {
                const enrolled = await enrollUserInSequences(
                    userId,
                    "MINI_DIPLOMA_COMPLETED",
                    "retroactive-completed"
                );
                if (enrolled > 0) {
                    results.completed.enrolled++;
                    results.details.push(`Enrolled ${email} in completion sequence`);
                } else {
                    results.completed.skipped++;
                }
            } catch (error) {
                results.completed.errors++;
                console.error(`[retroactive-enroll] Error for completed user ${userId}:`, error);
            }
        }

        console.log("[retroactive-enroll] Complete:", results);

        return NextResponse.json({
            success: true,
            ...results,
            summary: {
                startedEnrolled: results.started.enrolled,
                completedEnrolled: results.completed.enrolled,
                totalNewEnrollments: results.started.enrolled + results.completed.enrolled,
            },
        });

    } catch (error) {
        console.error("[retroactive-enroll] Error:", error);
        return NextResponse.json(
            { error: "Failed to process retroactive enrollment" },
            { status: 500 }
        );
    }
}

/**
 * GET - Check status without enrolling
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        if (user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Admin access required" }, { status: 403 });
        }

        // Count users who started
        const startedCount = await prisma.userTag.groupBy({
            by: ["userId"],
            where: {
                tag: { endsWith: "-lesson-complete:1" },
            },
        });

        // Count users who completed
        const completedCount = await prisma.user.count({
            where: {
                miniDiplomaCompletedAt: { not: null },
            },
        });

        // Count current enrollments
        const startedSequences = await prisma.sequence.findMany({
            where: {
                triggerType: "MINI_DIPLOMA_STARTED",
                isActive: true,
            },
            select: { id: true, slug: true, totalEnrolled: true },
        });

        const completedSequences = await prisma.sequence.findMany({
            where: {
                triggerType: "MINI_DIPLOMA_COMPLETED",
                isActive: true,
            },
            select: { id: true, slug: true, totalEnrolled: true },
        });

        return NextResponse.json({
            usersWhoStarted: startedCount.length,
            usersWhoCompleted: completedCount,
            sequences: {
                started: startedSequences,
                completed: completedSequences,
            },
        });

    } catch (error) {
        console.error("[retroactive-enroll] Error:", error);
        return NextResponse.json(
            { error: "Failed to get status" },
            { status: 500 }
        );
    }
}
