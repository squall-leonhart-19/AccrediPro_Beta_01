import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LeadOnboardingClient } from "./lead-onboarding-client";

export const dynamic = "force-dynamic";

const LESSONS = [
    { id: 1, title: "Root Cause Medicine", module: 1 },
    { id: 2, title: "The Gut Foundation", module: 1 },
    { id: 3, title: "The Inflammation Connection", module: 1 },
    { id: 4, title: "The Toxin Burden", module: 2 },
    { id: 5, title: "Stress & The HPA Axis", module: 2 },
    { id: 6, title: "Nutrient Deficiencies", module: 2 },
    { id: 7, title: "Functional Lab Interpretation", module: 3 },
    { id: 8, title: "Building Protocols", module: 3 },
    { id: 9, title: "Your Next Step", module: 3 },
];

async function getLeadProgress(userId: string) {
    const [user, enrollment, onboardingTags, completionTags] = await Promise.all([
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
                course: { slug: "functional-medicine-mini-diploma" },
            },
            select: {
                id: true,
                enrolledAt: true,
            },
        }),
        // Use niche-specific tags for onboarding instead of shared LeadOnboarding table
        prisma.userTag.findMany({
            where: {
                userId,
                tag: { in: ["functional-medicine-video-watched", "functional-medicine-questions-completed"] },
            },
        }),
        prisma.userTag.findMany({
            where: {
                userId,
                tag: { startsWith: "functional-medicine-lesson-complete:" },
            },
        }),
    ]);

    if (!enrollment) return null;

    const completedLessons = new Set(
        completionTags.map((t) => parseInt(t.tag.replace("functional-medicine-lesson-complete:", "")))
    );

    // Check niche-specific onboarding tags
    const onboardingTagSet = new Set(onboardingTags.map(t => t.tag));
    const watchedVideo = onboardingTagSet.has("functional-medicine-video-watched");
    const completedQuestions = onboardingTagSet.has("functional-medicine-questions-completed");

    return {
        user,
        watchedVideo,
        completedQuestions,
        completedLessons: Array.from(completedLessons),
        enrolledAt: enrollment?.enrolledAt || user?.createdAt,
    };
}

export default async function FunctionalMedicineDiplomaPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const data = await getLeadProgress(session.user.id);
    if (!data) redirect("/dashboard");

    const { user, watchedVideo, completedQuestions, completedLessons, enrolledAt } = data;
    const firstName = user?.firstName || "there";

    // Since we now collect qualification data in the opt-in funnel, 
    // skip video and questions steps - go straight to lessons
    const effectiveWatchedVideo = true;
    const effectiveCompletedQuestions = true;

    const steps = [
        { id: 1, title: "Watch Welcome Video", completed: effectiveWatchedVideo },
        { id: 2, title: "Tell Us About You", completed: effectiveCompletedQuestions },
        ...LESSONS.map((l, i) => ({
            id: i + 3,
            title: `Lesson ${l.id}: ${l.title}`,
            completed: completedLessons.includes(l.id),
        })),
        { id: 12, title: "Claim Certificate & Review", completed: completedLessons.length === 9 },
    ];

    // Start at Lesson 1 (step 3) since video/questions are now bypassed
    let currentStep = 3;
    for (let i = 1; i <= 9; i++) {
        if (!completedLessons.includes(i)) {
            currentStep = i + 2;
            break;
        }
    }
    if (completedLessons.length === 9) currentStep = 12;

    const stepsCompleted = steps.filter((s) => s.completed).length;
    const progress = Math.round((stepsCompleted / 12) * 100);

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
        />
    );
}
