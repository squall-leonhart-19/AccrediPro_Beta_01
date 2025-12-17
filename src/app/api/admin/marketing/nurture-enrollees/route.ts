import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/marketing/nurture-enrollees
 * Fetch all users tagged with nurture-30-day
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find the nurture-30-day tag
        const nurtureTag = await prisma.marketingTag.findFirst({
            where: {
                OR: [
                    { slug: "nurture-30-day" },
                    { name: "nurture-30-day" },
                ],
            },
        });

        if (!nurtureTag) {
            return NextResponse.json({ enrollees: [] });
        }

        // Get all users with this tag, with their enrollment info
        const taggedUsers = await prisma.userMarketingTag.findMany({
            where: { tagId: nurtureTag.id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Get sequence enrollment info
        const sequence = await prisma.sequence.findFirst({
            where: {
                OR: [
                    { slug: "mini-diploma-to-certification-30d" },
                    { name: { contains: "Mini Diploma" } },
                    { triggerType: "MINI_DIPLOMA_STARTED" },
                ],
                isActive: true,
            },
        });

        let enrollmentMap = new Map();
        if (sequence) {
            const enrollments = await prisma.sequenceEnrollment.findMany({
                where: { sequenceId: sequence.id },
                select: {
                    userId: true,
                    status: true,
                    currentEmailIndex: true,
                    enrolledAt: true,
                    emailsReceived: true,
                },
            });
            enrollments.forEach((e) => enrollmentMap.set(e.userId, e));
        }

        // Combine data
        const enrollees = taggedUsers.map((ut) => {
            const enrollment = enrollmentMap.get(ut.user.id);
            return {
                id: ut.user.id,
                email: ut.user.email,
                firstName: ut.user.firstName,
                lastName: ut.user.lastName,
                taggedAt: ut.createdAt,
                enrolledAt: enrollment?.enrolledAt || ut.createdAt,
                status: enrollment?.status || "TAGGED_ONLY",
                currentEmailIndex: enrollment?.currentEmailIndex ?? 0,
                emailsReceived: enrollment?.emailsReceived ?? 0,
            };
        });

        return NextResponse.json({ enrollees });
    } catch (error) {
        console.error("Error fetching nurture enrollees:", error);
        return NextResponse.json(
            { error: "Failed to fetch enrollees" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/admin/marketing/nurture-enrollees
 * Remove a user from the nurture sequence (untag + remove enrollment)
 */
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        // Find the nurture-30-day tag
        const nurtureTag = await prisma.marketingTag.findFirst({
            where: {
                OR: [
                    { slug: "nurture-30-day" },
                    { name: "nurture-30-day" },
                ],
            },
        });

        if (nurtureTag) {
            // Remove the tag
            const deleted = await prisma.userMarketingTag.deleteMany({
                where: {
                    userId,
                    tagId: nurtureTag.id,
                },
            });

            if (deleted.count > 0) {
                // Decrement tag count
                await prisma.marketingTag.update({
                    where: { id: nurtureTag.id },
                    data: { userCount: { decrement: 1 } },
                });
            }
        }

        // Find and update/remove sequence enrollment
        const sequence = await prisma.sequence.findFirst({
            where: {
                OR: [
                    { slug: "mini-diploma-to-certification-30d" },
                    { name: { contains: "Mini Diploma" } },
                    { triggerType: "MINI_DIPLOMA_STARTED" },
                ],
            },
        });

        if (sequence) {
            const enrollment = await prisma.sequenceEnrollment.findUnique({
                where: {
                    userId_sequenceId: {
                        userId,
                        sequenceId: sequence.id,
                    },
                },
            });

            if (enrollment) {
                // Mark as exited
                await prisma.sequenceEnrollment.update({
                    where: { id: enrollment.id },
                    data: {
                        status: "EXITED",
                        exitedAt: new Date(),
                        nextSendAt: null,
                    },
                });

                // Update sequence stats
                await prisma.sequence.update({
                    where: { id: sequence.id },
                    data: { totalExited: { increment: 1 } },
                });
            }
        }

        console.log(`[NURTURE] Removed user ${userId} from nurture sequence`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error removing nurture enrollee:", error);
        return NextResponse.json(
            { error: "Failed to remove enrollee" },
            { status: 500 }
        );
    }
}
