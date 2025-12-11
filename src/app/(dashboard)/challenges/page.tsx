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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-burgundy-50/30">
            <ChallengesClient
                challenges={challengesWithProgress}
                userId={session.user.id}
            />
        </div>
    );
}
