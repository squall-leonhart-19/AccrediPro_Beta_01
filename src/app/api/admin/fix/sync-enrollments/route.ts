import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/admin/fix/sync-enrollments
 * One-time sync: Create SequenceEnrollment records for all mini-diploma users
 * who have the miniDiplomaOptinAt but no enrollment record
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const now = new Date();
        const results = {
            found: 0,
            created: 0,
            skipped: 0,
            errors: [] as string[],
        };

        // Find the nurture sequence
        const sequence = await prisma.sequence.findFirst({
            where: {
                OR: [
                    { slug: "mini-diploma-to-certification-30d" },
                    { slug: "mini-diploma-nurture" },
                    { name: { contains: "Mini Diploma" } },
                    { triggerType: "MINI_DIPLOMA_STARTED" },
                ],
                isActive: true,
            },
        });

        if (!sequence) {
            return NextResponse.json({ error: "No active nurture sequence found" }, { status: 404 });
        }

        console.log(`[SYNC] Found sequence: ${sequence.name} (${sequence.id})`);

        // Find all mini diploma users who don't have an enrollment
        const usersNeedingEnrollment = await prisma.user.findMany({
            where: {
                miniDiplomaOptinAt: { not: null },
                isFakeProfile: { not: true },
                NOT: {
                    sequenceEnrollments: {
                        some: { sequenceId: sequence.id },
                    },
                },
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                miniDiplomaOptinAt: true,
            },
        });

        results.found = usersNeedingEnrollment.length;
        console.log(`[SYNC] Found ${results.found} users needing enrollment`);

        for (const user of usersNeedingEnrollment) {
            try {
                // Create enrollment - set nextSendAt to NOW so they get email on next cron
                await prisma.sequenceEnrollment.create({
                    data: {
                        userId: user.id,
                        sequenceId: sequence.id,
                        status: "ACTIVE",
                        currentEmailIndex: 0,
                        nextSendAt: now, // Send immediately on next cron run
                        enrolledAt: user.miniDiplomaOptinAt || now,
                    },
                });
                results.created++;
                console.log(`[SYNC] ✅ Enrolled ${user.email}`);
            } catch (err) {
                results.errors.push(`${user.email}: ${err}`);
                results.skipped++;
            }
        }

        // Update sequence totalEnrolled to be accurate
        const actualCount = await prisma.sequenceEnrollment.count({
            where: { sequenceId: sequence.id },
        });

        await prisma.sequence.update({
            where: { id: sequence.id },
            data: { totalEnrolled: actualCount },
        });

        return NextResponse.json({
            success: true,
            sequenceId: sequence.id,
            sequenceName: sequence.name,
            results,
            newTotalEnrolled: actualCount,
        });
    } catch (error) {
        console.error("Sync error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
