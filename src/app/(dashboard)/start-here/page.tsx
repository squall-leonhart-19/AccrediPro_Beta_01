import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StartHereClient } from "./start-here-client";
import { cookies } from "next/headers";

async function getStartHereData(userId: string) {
    const [user, enrollments, userTags] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                firstName: true,
                hasCompletedOnboarding: true,
                avatar: true,
                learningGoal: true,
                focusAreas: true,
                location: true,
            },
        }),
        prisma.enrollment.count({ where: { userId } }),
        prisma.userTag.findMany({
            where: { userId },
            select: { tag: true, value: true, metadata: true },
        }),
    ]);

    // Extract relevant tags for display
    const incomeGoalTag = userTags.find(t => t.tag.startsWith('income_goal:'));
    const timelineTag = userTags.find(t => t.tag.startsWith('timeline:'));
    const situationTag = userTags.find(t => t.tag.startsWith('situation:'));
    const investmentTag = userTags.find(t => t.tag.startsWith('investment:'));
    const obstaclesTags = userTags.filter(t => t.tag.startsWith('obstacle:'));
    const interestsTags = userTags.filter(t => t.tag.startsWith('interest:'));

    return {
        user: user ? {
            firstName: user.firstName,
            hasCompletedOnboarding: user.hasCompletedOnboarding,
            hasProfilePhoto: !!user.avatar,
            learningGoal: user.learningGoal,
            focusAreas: user.focusAreas || [],
            location: user.location,
        } : null,
        enrollments,
        onboardingData: {
            incomeGoal: incomeGoalTag?.tag.replace('income_goal:', '') || null,
            timeline: timelineTag?.tag.replace('timeline:', '') || null,
            situation: situationTag?.tag.replace('situation:', '') || null,
            investmentReadiness: investmentTag?.tag.replace('investment:', '') || null,
            obstacles: obstaclesTags.map(t => t.tag.replace('obstacle:', '')),
            interests: interestsTags.map(t => t.tag.replace('interest:', '')),
        },
    };
}

export default async function StartHerePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    const { user, enrollments, onboardingData } = await getStartHereData(session.user.id);

    // We can't check localStorage from server, so we pass false
    // The client component will check localStorage
    const tourComplete = false;

    return (
        <StartHereClient
            user={user}
            userId={session.user.id}
            enrollments={enrollments}
            tourComplete={tourComplete}
            onboardingData={onboardingData}
        />
    );
}
