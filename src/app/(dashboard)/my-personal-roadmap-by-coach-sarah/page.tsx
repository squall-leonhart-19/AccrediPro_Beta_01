import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PersonalRoadmap } from "./personal-roadmap";
import { getSpecializationTrack } from "@/lib/specialization-tracks";

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";

// Career Steps Configuration
const CAREER_STEPS = [
    {
        step: 1,
        id: "certified-practitioner",
        title: "Certified Practitioner",
        subtitle: "Become Legitimate",
        description: "Get certified with clinical knowledge, ethical scope, and practitioner tools.",
        incomeVision: "$3K–$5K/month",
        courseSlugs: ["functional-medicine-health-coach", "functional-medicine-complete-certification"],
    },
    {
        step: 2,
        id: "working-practitioner",
        title: "Working Practitioner",
        subtitle: "Work With Real Clients",
        description: "Build your practice with client acquisition, branding, and income systems.",
        incomeVision: "$5K–$10K/month",
        courseSlugs: ["practice-income-path", "fm-pro-accelerator"],
    },
    {
        step: 3,
        id: "advanced-master",
        title: "Advanced & Master",
        subtitle: "Gain Authority",
        description: "Handle complex cases, charge premium rates, become an industry expert.",
        incomeVision: "$10K–$30K/month",
        courseSlugs: ["advanced-master-practitioner"],
    },
    {
        step: 4,
        id: "business-scaler",
        title: "Business Scaler",
        subtitle: "Build Leverage",
        description: "Scale beyond 1:1 with teams, group programs, and passive income.",
        incomeVision: "$30K–$50K/month",
        courseSlugs: ["business-acceleration"],
    },
];

interface RoadmapData {
    state: string;
    currentStep: number;
    currentStepProgress: number;
    currentCourse: {
        id: string;
        slug: string;
        title: string;
        progress: number;
        nextModule?: string;
    } | null;
    completedSteps: number[];
    enrolledSteps: number[];
    totalProgress: number;
    userName: string;
    userEmail: string;
    memberSince: string;
}

async function getRoadmapData(userId: string): Promise<RoadmapData> {
    // Get user info
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            name: true,
            firstName: true,
            email: true,
            createdAt: true,
            miniDiplomaCompletedAt: true,
        },
    });

    const miniDiplomaCompleted = !!user?.miniDiplomaCompletedAt;
    const userName = user?.firstName || user?.name?.split(" ")[0] || "Practitioner";
    const userEmail = user?.email || "";
    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : "";

    // Get all enrollments with progress
    const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: {
            course: {
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    modules: {
                        where: { isPublished: true },
                        orderBy: { order: "asc" },
                        select: {
                            id: true,
                            title: true,
                            order: true,
                            lessons: {
                                where: { isPublished: true },
                                select: { id: true },
                            },
                        },
                    },
                },
            },
        },
    });

    // Get lesson progress for current courses
    const lessonProgress = await prisma.lessonProgress.findMany({
        where: {
            userId,
            isCompleted: true,
        },
        select: { lessonId: true },
    });
    const completedLessonIds = new Set(lessonProgress.map((lp) => lp.lessonId));

    // Map enrollments to steps
    const enrollmentBySlug = new Map(enrollments.map((e) => [e.course.slug, e]));

    // Determine which steps are enrolled and completed
    const enrolledSteps: number[] = [];
    const completedSteps: number[] = [];
    let currentStepData: typeof CAREER_STEPS[0] | null = null;
    let currentEnrollment: typeof enrollments[0] | null = null;

    for (const step of CAREER_STEPS) {
        const enrollment = step.courseSlugs.map((slug) => enrollmentBySlug.get(slug)).find(Boolean);

        if (enrollment) {
            enrolledSteps.push(step.step);

            if (enrollment.status === "COMPLETED") {
                completedSteps.push(step.step);
            } else if (!currentStepData) {
                currentStepData = step;
                currentEnrollment = enrollment;
            }
        }
    }

    // Calculate current step progress
    let currentStepProgress = 0;
    let nextModuleTitle: string | undefined;

    if (currentEnrollment?.course.modules) {
        const modules = currentEnrollment.course.modules;
        let totalLessons = 0;
        let completedLessons = 0;

        for (const mod of modules) {
            totalLessons += mod.lessons.length;
            const modCompletedLessons = mod.lessons.filter((l) => completedLessonIds.has(l.id)).length;
            completedLessons += modCompletedLessons;

            if (!nextModuleTitle && modCompletedLessons < mod.lessons.length) {
                nextModuleTitle = mod.title;
            }
        }

        currentStepProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    }

    // Determine state
    let state = "exploration";
    let currentStep = 0;

    if (completedSteps.includes(4)) {
        state = "step4_active";
        currentStep = 4;
    } else if (enrolledSteps.includes(4)) {
        state = "step4_active";
        currentStep = 4;
    } else if (completedSteps.includes(3)) {
        state = "step4_available";
        currentStep = 3;
    } else if (enrolledSteps.includes(3)) {
        state = "step3_in_progress";
        currentStep = 3;
    } else if (completedSteps.includes(2)) {
        state = "step3_available";
        currentStep = 2;
    } else if (enrolledSteps.includes(2)) {
        state = "step2_in_progress";
        currentStep = 2;
    } else if (completedSteps.includes(1)) {
        state = "step1_completed";
        currentStep = 1;
    } else if (enrolledSteps.includes(1)) {
        state = "step1_in_progress";
        currentStep = 1;
    } else if (miniDiplomaCompleted) {
        state = "exploration";
        currentStep = 0;
        completedSteps.push(0);
    }

    const totalProgress = Math.round((completedSteps.filter(s => s > 0).length / 4) * 100);

    return {
        state,
        currentStep,
        currentStepProgress,
        currentCourse: currentEnrollment ? {
            id: currentEnrollment.course.id,
            slug: currentEnrollment.course.slug,
            title: currentEnrollment.course.title,
            progress: currentStepProgress,
            nextModule: nextModuleTitle,
        } : null,
        completedSteps,
        enrolledSteps,
        totalProgress,
        userName,
        userEmail,
        memberSince,
    };
}

export default async function MyPersonalRoadmapPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    const roadmapData = await getRoadmapData(session.user.id);

    // Get user tags for specialization
    const userTags = await prisma.userTag.findMany({
        where: { userId: session.user.id },
        select: { tag: true },
    });
    const tagStrings = userTags.map((t) => t.tag);
    const specialization = getSpecializationTrack(tagStrings);

    return (
        <PersonalRoadmap
            data={roadmapData}
            steps={CAREER_STEPS}
            specialization={specialization}
        />
    );
}
