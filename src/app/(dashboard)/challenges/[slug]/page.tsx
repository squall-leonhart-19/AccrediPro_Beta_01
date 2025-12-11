import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ChallengeDetailClient } from "@/components/challenges/challenge-detail-client";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ChallengePage({ params }: PageProps) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const { slug } = await params;

    const challenge = await prisma.challenge.findUnique({
        where: { slug },
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
        },
    });

    if (!challenge) {
        notFound();
    }

    const enrollment = challenge.enrollments[0];

    // Calculate unlocked days
    let unlockedDays: number[] = [];
    if (enrollment) {
        const startDate = new Date(enrollment.startedAt);
        const now = new Date();
        const daysSinceStart = Math.floor(
            (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        for (let i = 1; i <= Math.min(challenge.durationDays, daysSinceStart + 1); i++) {
            unlockedDays.push(i);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-burgundy-50/30">
            <ChallengeDetailClient
                challenge={{
                    ...challenge,
                    isEnrolled: !!enrollment,
                    currentDay: enrollment?.currentDay || 0,
                    completedDays: enrollment?.completedDays || [],
                    unlockedDays,
                    startedAt: enrollment?.startedAt,
                }}
                userId={session.user.id}
            />
        </div>
    );
}
