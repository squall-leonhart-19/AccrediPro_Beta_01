import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ChallengesClient } from "@/components/challenges/challenges-client";

export default async function ChallengesPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    // Check user's mini diploma completion status
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            miniDiplomaCompletedAt: true,
            miniDiplomaCategory: true,
        },
    });

    // Challenge unlock logic:
    // 1. User must have completed mini diploma
    // 2. Either: Training watched OR 24 hours passed since mini diploma completion (failsafe)
    const hasCompletedMiniDiploma = !!user?.miniDiplomaCompletedAt;
    const miniDiplomaCompletedAt = user?.miniDiplomaCompletedAt;

    // Check if 24 hours have passed since mini diploma completion (failsafe)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const passedFailsafeTime = miniDiplomaCompletedAt && miniDiplomaCompletedAt < twentyFourHoursAgo;

    // For now, unlock if mini diploma is complete (training watch tracking would need UserBehavior)
    // The failsafe (24h after mini diploma) ensures access even without training completion tracking
    const isChallengeUnlocked = hasCompletedMiniDiploma && (passedFailsafeTime || hasCompletedMiniDiploma);

    const challenges = await prisma.challenge.findMany({
        where: { isActive: true },
        include: {
            modules: {
                orderBy: { day: "asc" },
            },
            badges: {
                orderBy: { day: "asc" },
            },
            enrollments: {
                where: { userId: session.user.id },
            },
            _count: {
                select: { enrollments: true },
            },
        },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });

    const challengesWithProgress = challenges.map((challenge) => {
        const enrollment = challenge.enrollments[0];
        return {
            ...challenge,
            isEnrolled: !!enrollment,
            currentDay: enrollment?.currentDay || 0,
            completedDays: enrollment?.completedDays || [],
            startedAt: enrollment?.startedAt,
            enrollmentCount: challenge._count.enrollments,
        };
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <ChallengesClient
                challenges={challengesWithProgress}
                userId={session.user.id}
                isChallengeUnlocked={isChallengeUnlocked}
                hasCompletedMiniDiploma={hasCompletedMiniDiploma}
                miniDiplomaCompletedAt={miniDiplomaCompletedAt?.toISOString() || null}
            />
        </div>
    );
}
