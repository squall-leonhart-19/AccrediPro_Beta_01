import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { RoadmapContent } from "./roadmap-content";
import { getSpecializationTrack, FUNCTIONAL_MEDICINE_TRACK, type SpecializationTrack } from "@/lib/specialization-tracks";

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";

// Define the 4-step career ladder
const CAREER_STEPS = [
    {
        step: 1,
        id: "certified-practitioner",
        title: "Certified Practitioner",
        subtitle: "Become Legitimate",
        description: "Get certified with clinical knowledge, ethical scope, and practitioner tools.",
        incomeVision: "$3K–$5K/month",
        color: "emerald",
        courseSlugs: ["functional-medicine-health-coach"], // Main Step 1 course
    },
    {
        step: 2,
        id: "working-practitioner",
        title: "Working Practitioner",
        subtitle: "Work With Real Clients",
        description: "Build your practice with client acquisition, branding, and income systems.",
        incomeVision: "$5K–$10K/month",
        color: "amber",
        courseSlugs: ["practice-income-path"], // Step 2 course
    },
    {
        step: 3,
        id: "advanced-master",
        title: "Advanced & Master",
        subtitle: "Gain Authority",
        description: "Handle complex cases, charge premium rates, become an industry expert.",
        incomeVision: "$10K–$30K/month",
        color: "blue",
        courseSlugs: ["advanced-master-practitioner"], // Step 3 course
    },
    {
        step: 4,
        id: "business-scaler",
        title: "Business Scaler",
        subtitle: "Build Leverage",
        description: "Scale beyond 1:1 with teams, group programs, and passive income.",
        incomeVision: "$30K–$50K/month",
        color: "burgundy",
        courseSlugs: ["business-acceleration"], // Step 4 / DFY
    },
];

// Roadmap State Types
type RoadmapState =
    | "exploration"           // Has mini diploma / freebie only
    | "step1_in_progress"     // Purchased Step 1, not completed
    | "step1_completed"       // Step 1 completed, ready for Step 2
    | "step2_in_progress"     // Working on practice building
    | "step2_completed"       // Ready for Advanced
    | "step3_available"       // Can purchase Advanced + Master
    | "step3_in_progress"     // Working on Advanced
    | "step4_available"       // Ready for Business Scaler
    | "step4_active";         // In DFY / Mentorship

interface RoadmapData {
    state: RoadmapState;
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
    specialization: SpecializationTrack;
}

async function getRoadmapData(userId: string): Promise<RoadmapData> {
    // Get user with mini diploma status
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { miniDiplomaCompletedAt: true },
    });
    const miniDiplomaCompleted = !!user?.miniDiplomaCompletedAt;

    // Get user tags to determine specialization
    const userTags = await prisma.userTag.findMany({
        where: { userId },
        select: { tag: true },
    });
    const tagStrings = userTags.map((t) => t.tag);
    const specialization = getSpecializationTrack(tagStrings);

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
                // First non-completed enrolled step is current
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

            // Find next incomplete module
            if (!nextModuleTitle && modCompletedLessons < mod.lessons.length) {
                nextModuleTitle = mod.title;
            }
        }

        currentStepProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    }

    // Determine roadmap state
    let state: RoadmapState = "exploration";
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
        // Mini diploma completed - ready for Step 1
        state = "step1_completed"; // This will show Step 1 as the next step
        currentStep = 0; // Mini diploma is step 0, but completed
        completedSteps.push(0); // Add mini diploma to completed steps
    } else if (enrollments.length > 0) {
        // Has some enrollment but not in main steps (mini diploma / freebie in progress)
        state = "exploration";
        currentStep = 0;
    }

    // Calculate total progress across all steps
    const totalProgress = Math.round((completedSteps.length / 4) * 100);

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
        specialization,
    };
}

export default async function RoadmapPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    const roadmapData = await getRoadmapData(session.user.id);

    // Use specialization-specific steps instead of generic CAREER_STEPS
    const specializationSteps = roadmapData.specialization.steps.map((step, index) => ({
        step: step.step,
        id: `step-${step.step}`,
        title: step.title,
        subtitle: step.subtitle,
        description: step.description,
        incomeVision: step.incomeVision,
        color: ["emerald", "amber", "blue", "burgundy"][index] || "emerald",
        courseSlugs: step.courseSlugs,
    }));

    return (
        <RoadmapContent
            data={roadmapData}
            steps={specializationSteps}
            userName={session.user.name || session.user.firstName || "Practitioner"}
            specialization={roadmapData.specialization}
        />
    );
}
