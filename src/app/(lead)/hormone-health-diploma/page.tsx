import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LeadOnboardingClient } from "./lead-onboarding-client";

export const dynamic = "force-dynamic";

const LESSONS = [
    { id: 1, title: "Meet Your Hormones", module: 1 },
    { id: 2, title: "The Menstrual Cycle", module: 1 },
    { id: 3, title: "Hormonal Imbalances", module: 1 },
    { id: 4, title: "The Thyroid Connection", module: 2 },
    { id: 5, title: "Adrenal Health", module: 2 },
    { id: 6, title: "Perimenopause & Menopause", module: 2 },
    { id: 7, title: "Hormone Testing", module: 3 },
    { id: 8, title: "Natural Balancing", module: 3 },
    { id: 9, title: "Your Next Step", module: 3 },
];

async function getLeadProgress(userId: string) {
    const [user, enrollment, leadOnboarding, completionTags] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: { firstName: true, lastName: true, email: true, avatar: true, accessExpiresAt: true, createdAt: true },
        }),
        prisma.enrollment.findFirst({
            where: { userId, course: { slug: "hormone-health-mini-diploma" } },
            select: { id: true, enrolledAt: true },
        }),
        prisma.leadOnboarding.findUnique({ where: { userId }, select: { watchedVideo: true, completedQuestions: true } }).catch(() => null),
        prisma.userTag.findMany({ where: { userId, tag: { startsWith: "hormone-health-lesson-complete:" } } }),
    ]);

    if (!enrollment) return null;
    const completedLessons = new Set(completionTags.map((t) => parseInt(t.tag.replace("hormone-health-lesson-complete:", ""))));
    return { user, leadOnboarding, completedLessons: Array.from(completedLessons), enrolledAt: enrollment?.enrolledAt || user?.createdAt };
}

export default async function HormoneHealthDiplomaPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const data = await getLeadProgress(session.user.id);
    if (!data) redirect("/dashboard");

    const { user, leadOnboarding, completedLessons, enrolledAt } = data;
    const firstName = user?.firstName || "there";
    const isTestUser = user?.email === "at.seed019@gmail.com" || user?.email === "tortolialessio1997@gmail.com";

    const watchedVideo = isTestUser || leadOnboarding?.watchedVideo || false;
    const completedQuestions = isTestUser || leadOnboarding?.completedQuestions || false;

    const steps = [
        { id: 1, title: "Watch Welcome Video", completed: watchedVideo },
        { id: 2, title: "Tell Us About You", completed: completedQuestions },
        ...LESSONS.map((l, i) => ({ id: i + 3, title: `Lesson ${l.id}: ${l.title}`, completed: completedLessons.includes(l.id) })),
        { id: 12, title: "Claim Certificate & Review", completed: completedLessons.length === 9 },
    ];

    let currentStep = 1;
    if (watchedVideo && !completedQuestions) currentStep = 2;
    else if (watchedVideo && completedQuestions) {
        for (let i = 1; i <= 9; i++) { if (!completedLessons.includes(i)) { currentStep = i + 2; break; } }
        if (completedLessons.length === 9) currentStep = 12;
    }

    return (
        <LeadOnboardingClient firstName={firstName} userAvatar={user?.avatar} watchedVideo={watchedVideo} completedQuestions={completedQuestions}
            completedLessons={completedLessons} steps={steps} currentStep={currentStep} progress={Math.round((steps.filter((s) => s.completed).length / 12) * 100)} isTestUser={isTestUser} enrolledAt={enrolledAt?.toISOString()} />
    );
}
