import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StartHereClient } from "./start-here-client";
import { cookies } from "next/headers";

async function getStartHereData(userId: string) {
    const [user, enrollments] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                firstName: true,
                hasCompletedOnboarding: true,
                avatar: true,
                learningGoal: true,
            },
        }),
        prisma.enrollment.count({ where: { userId } }),
    ]);

    return {
        user: user ? {
            firstName: user.firstName,
            hasCompletedOnboarding: user.hasCompletedOnboarding,
            hasProfilePhoto: !!user.avatar,
            learningGoal: user.learningGoal,
        } : null,
        enrollments,
    };
}

export default async function StartHerePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    const { user, enrollments } = await getStartHereData(session.user.id);

    // We can't check localStorage from server, so we pass false
    // The client component will check localStorage
    const tourComplete = false;

    return (
        <StartHereClient
            user={user}
            userId={session.user.id}
            enrollments={enrollments}
            tourComplete={tourComplete}
        />
    );
}
