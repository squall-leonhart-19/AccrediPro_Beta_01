import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/admin/marketing/sequences/[id]/enrollments/[enrollmentId]/action
// Actions: pause, resume, exit, forward
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; enrollmentId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: sequenceId, enrollmentId } = await params;
        const body = await request.json();
        const { action } = body;

        if (!["pause", "resume", "exit", "forward"].includes(action)) {
            return NextResponse.json(
                { error: "Invalid action. Must be: pause, resume, exit, or forward" },
                { status: 400 }
            );
        }

        // Get enrollment
        const enrollment = await prisma.sequenceEnrollment.findUnique({
            where: { id: enrollmentId },
            include: {
                sequence: {
                    include: {
                        emails: {
                            where: { isActive: true },
                            orderBy: { order: "asc" },
                        },
                    },
                },
            },
        });

        if (!enrollment) {
            return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
        }

        if (enrollment.sequenceId !== sequenceId) {
            return NextResponse.json({ error: "Enrollment does not belong to this sequence" }, { status: 400 });
        }

        const now = new Date();

        switch (action) {
            case "pause":
                if (enrollment.status !== "ACTIVE") {
                    return NextResponse.json({ error: "Can only pause active enrollments" }, { status: 400 });
                }
                await prisma.sequenceEnrollment.update({
                    where: { id: enrollmentId },
                    data: {
                        status: "PAUSED",
                        pausedAt: now,
                    },
                });
                break;

            case "resume":
                if (enrollment.status !== "PAUSED") {
                    return NextResponse.json({ error: "Can only resume paused enrollments" }, { status: 400 });
                }

                // Calculate new nextSendAt based on current email
                const currentEmail = enrollment.sequence.emails.find(
                    (e) => e.order === enrollment.currentEmailIndex
                );

                let nextSendAt = now;
                if (currentEmail) {
                    nextSendAt = new Date(
                        now.getTime() +
                        currentEmail.delayDays * 24 * 60 * 60 * 1000 +
                        currentEmail.delayHours * 60 * 60 * 1000 +
                        currentEmail.delayMinutes * 60 * 1000
                    );
                }

                await prisma.sequenceEnrollment.update({
                    where: { id: enrollmentId },
                    data: {
                        status: "ACTIVE",
                        pausedAt: null,
                        nextSendAt,
                    },
                });
                break;

            case "exit":
                if (!["ACTIVE", "PAUSED"].includes(enrollment.status)) {
                    return NextResponse.json({ error: "Enrollment already exited or completed" }, { status: 400 });
                }
                await prisma.sequenceEnrollment.update({
                    where: { id: enrollmentId },
                    data: {
                        status: "EXITED",
                        exitedAt: now,
                        exitReason: "Manual exit by admin",
                    },
                });

                // Update sequence stats
                await prisma.sequence.update({
                    where: { id: sequenceId },
                    data: { totalExited: { increment: 1 } },
                });
                break;

            case "forward":
                if (!["ACTIVE", "PAUSED"].includes(enrollment.status)) {
                    return NextResponse.json({ error: "Cannot advance completed or exited enrollment" }, { status: 400 });
                }

                const nextIndex = enrollment.currentEmailIndex + 1;
                const nextEmail = enrollment.sequence.emails.find((e) => e.order === nextIndex);

                if (!nextEmail) {
                    // Mark as completed if no more emails
                    await prisma.sequenceEnrollment.update({
                        where: { id: enrollmentId },
                        data: {
                            status: "COMPLETED",
                            completedAt: now,
                            currentEmailIndex: nextIndex,
                        },
                    });

                    await prisma.sequence.update({
                        where: { id: sequenceId },
                        data: { totalCompleted: { increment: 1 } },
                    });
                } else {
                    // Advance to next email
                    const forwardNextSendAt = new Date(
                        now.getTime() +
                        nextEmail.delayDays * 24 * 60 * 60 * 1000 +
                        nextEmail.delayHours * 60 * 60 * 1000 +
                        nextEmail.delayMinutes * 60 * 1000
                    );

                    await prisma.sequenceEnrollment.update({
                        where: { id: enrollmentId },
                        data: {
                            currentEmailIndex: nextIndex,
                            currentEmailId: nextEmail.id,
                            nextSendAt: forwardNextSendAt,
                            status: "ACTIVE",
                        },
                    });
                }
                break;
        }

        return NextResponse.json({ success: true, action });
    } catch (error) {
        console.error("Error performing enrollment action:", error);
        return NextResponse.json(
            { error: "Failed to perform action" },
            { status: 500 }
        );
    }
}
