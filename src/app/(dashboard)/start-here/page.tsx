import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StartHereClient } from "./start-here-client";
import { cookies } from "next/headers";

async function getStartHereData(userId: string) {
    // Get Coach Sarah's ID for checking if user messaged her
    const coachSarah = await prisma.user.findFirst({
        where: { email: "sarah@accredipro-certificate.com" },
        select: { id: true },
    });

    // The introduction thread ID for "Share Your Story" XP tracking
    const INTRO_POST_ID = "cmktszaw30000fqm97xx6xrck";

    const [user, enrollmentData, userTags, messagedCoach, hasIntroComment] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                firstName: true,
                hasCompletedOnboarding: true,
                avatar: true,
                learningGoal: true,
                focusAreas: true,
                location: true,
                createdAt: true, // For 24hr bonus timer
            },
        }),
        // Get first enrollment with course and first lesson
        prisma.enrollment.findFirst({
            where: { userId },
            orderBy: { enrolledAt: 'asc' },
            include: {
                course: {
                    select: {
                        id: true,
                        slug: true,
                        title: true,
                        modules: {
                            where: { isPublished: true },
                            orderBy: { order: 'asc' },
                            take: 1,
                            select: {
                                lessons: {
                                    where: { isPublished: true },
                                    orderBy: { order: 'asc' },
                                    take: 1,
                                    select: { id: true, title: true },
                                },
                            },
                        },
                    },
                },
            },
        }),
        prisma.userTag.findMany({
            where: { userId },
            select: { tag: true, value: true, metadata: true },
        }),
        // Check if user has messaged Coach Sarah
        coachSarah ? prisma.message.findFirst({
            where: {
                senderId: userId,
                receiverId: coachSarah.id,
            },
            select: { id: true },
        }) : null,
        // Check if user has commented (introduced themselves) on the community intro thread
        prisma.postComment.findFirst({
            where: {
                authorId: userId,
                postId: INTRO_POST_ID,
            },
            select: { id: true },
        }),
    ]);

    // Get enrollment count separately
    const enrollments = await prisma.enrollment.count({ where: { userId } });

    // Extract relevant tags for display
    const incomeGoalTag = userTags.find(t => t.tag.startsWith('income_goal:'));
    const timelineTag = userTags.find(t => t.tag.startsWith('timeline:'));
    const situationTag = userTags.find(t => t.tag.startsWith('situation:'));
    const investmentTag = userTags.find(t => t.tag.startsWith('investment:'));
    const obstaclesTags = userTags.filter(t => t.tag.startsWith('obstacle:'));
    const interestsTags = userTags.filter(t => t.tag.startsWith('interest:'));

    // Get first lesson URL - using /learning route which is the actual lesson player
    const firstLesson = enrollmentData?.course?.modules?.[0]?.lessons?.[0];
    const firstLessonUrl = firstLesson
        ? `/learning/${enrollmentData.course.slug}/${firstLesson.id}`
        : null;

    return {
        user: user ? {
            firstName: user.firstName,
            hasCompletedOnboarding: user.hasCompletedOnboarding,
            hasProfilePhoto: !!user.avatar,
            learningGoal: user.learningGoal,
            focusAreas: user.focusAreas || [],
            location: user.location,
            createdAt: user.createdAt?.toISOString() || null,
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
        hasMessagedCoach: !!messagedCoach,
        hasIntroPost: !!hasIntroComment,
        firstLessonUrl,
        courseName: enrollmentData?.course?.title || null,
    };
}

export default async function StartHerePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    const { user, enrollments, onboardingData, hasMessagedCoach, hasIntroPost, firstLessonUrl, courseName } = await getStartHereData(session.user.id);

    return (
        <StartHereClient
            user={user}
            userId={session.user.id}
            enrollments={enrollments}
            onboardingData={onboardingData}
            hasMessagedCoach={hasMessagedCoach}
            hasIntroPost={hasIntroPost}
            firstLessonUrl={firstLessonUrl}
            courseName={courseName}
        />
    );
}
