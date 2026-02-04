import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { getConfigByPortalSlug } from "@/lib/mini-diploma-registry";
import { LeadOnboardingClient } from "./lead-onboarding-client";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getLeadProgress(userId: string, config: ReturnType<typeof getConfigByPortalSlug>) {
    if (!config) return null;

    const [user, enrollment, onboardingTags, completionTags, quizTag] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                accessExpiresAt: true,
                createdAt: true,
            },
        }),
        prisma.enrollment.findFirst({
            where: {
                userId,
                course: { slug: config.slug },
            },
            select: {
                id: true,
                enrolledAt: true,
            },
        }),
        // Use niche-specific tags for onboarding
        prisma.userTag.findMany({
            where: {
                userId,
                tag: { in: [`${config.portalSlug}-video-watched`, `${config.portalSlug}-questions-completed`] },
            },
        }),
        prisma.userTag.findMany({
            where: {
                userId,
                tag: { startsWith: `${config.lessonTagPrefix}:` },
            },
        }),
        // Check if quiz is completed
        prisma.userTag.findFirst({
            where: {
                userId,
                tag: "quiz:completed",
            },
        }),
    ]);

    if (!enrollment) return null;

    const completedLessons = new Set(
        completionTags.map((t) => parseInt(t.tag.replace(`${config.lessonTagPrefix}:`, "")))
    );

    // Check niche-specific onboarding tags
    const onboardingTagSet = new Set(onboardingTags.map(t => t.tag));
    const watchedVideo = onboardingTagSet.has(`${config.portalSlug}-video-watched`);
    const completedQuestions = onboardingTagSet.has(`${config.portalSlug}-questions-completed`);

    return {
        user,
        watchedVideo,
        completedQuestions,
        completedLessons: Array.from(completedLessons),
        enrolledAt: enrollment?.enrolledAt || user?.createdAt,
        hasCompletedQuiz: !!quizTag,
    };
}

export default async function PortalPage({ params }: PageProps) {
    const { slug } = await params;
    const config = getConfigByPortalSlug(slug);

    if (!config) {
        notFound();
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const data = await getLeadProgress(session.user.id, config);
    if (!data) redirect("/dashboard");

    const { user, watchedVideo, completedQuestions, completedLessons, enrolledAt, hasCompletedQuiz } = data;
    const firstName = user?.firstName || "there";

    // Since we now collect qualification data in the opt-in funnel, 
    // skip video and questions steps - go straight to lessons
    const effectiveWatchedVideo = true;
    const effectiveCompletedQuestions = true;

    const lessons = config.lessons;
    const totalLessons = lessons.length;

    const steps = [
        { id: 1, title: "Watch Welcome Video", completed: effectiveWatchedVideo },
        { id: 2, title: "Tell Us About You", completed: effectiveCompletedQuestions },
        ...lessons.map((l, i) => ({
            id: i + 3,
            title: `Lesson ${l.id}: ${l.title}`,
            completed: completedLessons.includes(l.id),
        })),
        { id: totalLessons + 3, title: "Claim Certificate & Review", completed: completedLessons.length === totalLessons },
    ];

    // Start at Lesson 1 (step 3) since video/questions are now bypassed
    let currentStep = 3;
    for (let i = 1; i <= totalLessons; i++) {
        if (!completedLessons.includes(i)) {
            currentStep = i + 2;
            break;
        }
    }
    if (completedLessons.length === totalLessons) currentStep = totalLessons + 3;

    const stepsCompleted = steps.filter((s) => s.completed).length;
    const totalSteps = steps.length;
    const progress = Math.round((stepsCompleted / totalSteps) * 100);

    return (
        <LeadOnboardingClient
            firstName={firstName}
            userAvatar={user?.avatar}
            watchedVideo={watchedVideo}
            completedQuestions={completedQuestions}
            completedLessons={completedLessons}
            steps={steps}
            currentStep={currentStep}
            progress={progress}
            enrolledAt={enrolledAt?.toISOString()}
            portalSlug={slug}
            diplomaName={config.displayName}
            hasCompletedQuiz={hasCompletedQuiz}
        />
    );
}
