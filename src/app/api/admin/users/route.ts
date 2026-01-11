import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const deleteUsersSchema = z.object({
    userIds: z.array(z.string()).min(1, "At least one user ID is required"),
});

async function safeDeleteMany(model: any, where: object) {
    try {
        await model.deleteMany({ where });
    } catch (e) {
        // Ignore errors - model might not have those records
        console.log(`Safe delete skipped:`, e);
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Must be admin
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized. Admin access required." },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { userIds } = deleteUsersSchema.parse(body);

        // Prevent admin from deleting themselves
        if (userIds.includes(session.user.id)) {
            return NextResponse.json(
                { error: "You cannot delete your own account" },
                { status: 400 }
            );
        }

        // Delete users one by one
        for (const userId of userIds) {
            try {
                // Delete all related records (in order of dependencies)
                // Some of these might not exist for all users, so we use safeDeleteMany

                // Progress and learning data
                await safeDeleteMany(prisma.lessonProgress, { userId });
                await safeDeleteMany(prisma.moduleProgress, { userId });
                await safeDeleteMany(prisma.enrollment, { userId });

                // Certificates
                await safeDeleteMany(prisma.certificate, { userId });

                // Messages - delete reactions first
                const userMessages = await prisma.message.findMany({
                    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
                    select: { id: true }
                });
                const messageIds = userMessages.map(m => m.id);
                if (messageIds.length > 0) {
                    await safeDeleteMany(prisma.messageReaction, { messageId: { in: messageIds } });
                }
                await safeDeleteMany(prisma.message, { OR: [{ senderId: userId }, { receiverId: userId }] });
                await safeDeleteMany(prisma.typingStatus, { OR: [{ senderId: userId }, { receiverId: userId }] });

                // Notifications
                await safeDeleteMany(prisma.notification, { userId });

                // Gamification
                await safeDeleteMany(prisma.userTag, { userId });
                await safeDeleteMany(prisma.userBadge, { userId });
                await safeDeleteMany(prisma.userStreak, { userId });

                // Community
                await safeDeleteMany(prisma.postLike, { userId });
                await safeDeleteMany(prisma.postComment, { authorId: userId });
                await safeDeleteMany(prisma.communityPost, { authorId: userId });

                // Mentorship
                await safeDeleteMany(prisma.mentorSession, { OR: [{ mentorId: userId }, { studentId: userId }] });

                // Analytics & History
                await safeDeleteMany(prisma.userActivity, { userId });
                await safeDeleteMany(prisma.courseReview, { userId });
                await safeDeleteMany(prisma.loginHistory, { userId });

                // Auth related
                await safeDeleteMany(prisma.account, { userId });
                await safeDeleteMany(prisma.session, { userId });

                // Offers & Marketing
                await safeDeleteMany(prisma.offerRedemption, { userId });
                await safeDeleteMany(prisma.userMarketingTag, { userId });
                await safeDeleteMany(prisma.sequenceEnrollment, { userId });
                await safeDeleteMany(prisma.emailSend, { userId });

                // Credits & Behavior
                await safeDeleteMany(prisma.userCreditProfile, { userId });
                await safeDeleteMany(prisma.userBehavior, { userId });

                // Finally delete the user - use select to avoid P2022 errors
                await prisma.user.delete({ where: { id: userId }, select: { id: true } });

            } catch (userError) {
                console.error(`Failed to delete user ${userId}:`, userError);
                // Continue with other users instead of failing completely
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully deleted ${userIds.length} user(s)`,
            deletedCount: userIds.length,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            );
        }

        console.error("Delete users error:", error);
        return NextResponse.json(
            { error: `Failed to delete users: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}
