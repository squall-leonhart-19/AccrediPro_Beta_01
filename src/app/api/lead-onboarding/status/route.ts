import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get current onboarding status
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get or create lead onboarding record
        let onboarding = await prisma.leadOnboarding.findUnique({
            where: { userId: session.user.id },
        });

        if (!onboarding) {
            onboarding = await prisma.leadOnboarding.create({
                data: { userId: session.user.id },
            });
        }

        // Get lesson progress for steps 3-11
        const lessonTags = await prisma.userTag.findMany({
            where: {
                userId: session.user.id,
                tag: { startsWith: "wh-lesson-complete:" },
            },
        });

        const completedLessons = lessonTags.map((t) =>
            parseInt(t.tag.replace("wh-lesson-complete:", ""))
        );

        // Build step status
        const steps = [
            { id: 1, title: "Watch Welcome Video", completed: onboarding.watchedVideo },
            { id: 2, title: "Tell Us About You", completed: onboarding.completedQuestions },
            { id: 3, title: "Lesson 1: Meet Your Hormones", completed: completedLessons.includes(1) },
            { id: 4, title: "Lesson 2: The Monthly Dance", completed: completedLessons.includes(2) },
            { id: 5, title: "Lesson 3: When Hormones Go Rogue", completed: completedLessons.includes(3) },
            { id: 6, title: "Lesson 4: The Gut-Hormone Axis", completed: completedLessons.includes(4) },
            { id: 7, title: "Lesson 5: Thyroid & Energy", completed: completedLessons.includes(5) },
            { id: 8, title: "Lesson 6: Stress & Your Adrenals", completed: completedLessons.includes(6) },
            { id: 9, title: "Lesson 7: Food as Medicine", completed: completedLessons.includes(7) },
            { id: 10, title: "Lesson 8: Life Stage Support", completed: completedLessons.includes(8) },
            { id: 11, title: "Lesson 9: Your Next Step", completed: completedLessons.includes(9) },
            { id: 12, title: "Claim Certificate & Review", completed: onboarding.claimedCertificate && onboarding.leftReview },
        ];

        // Calculate current step (first incomplete)
        const currentStepIndex = steps.findIndex((s) => !s.completed);
        const currentStep = currentStepIndex === -1 ? 12 : steps[currentStepIndex].id;

        // Calculate progress
        const completedCount = steps.filter((s) => s.completed).length;
        const progress = Math.round((completedCount / steps.length) * 100);

        return NextResponse.json({
            success: true,
            onboarding,
            steps,
            currentStep,
            progress,
            completedCount,
            totalSteps: steps.length,
        });
    } catch (error) {
        console.error("[lead-onboarding/status] Error:", error);
        return NextResponse.json(
            { error: "Failed to get onboarding status" },
            { status: 500 }
        );
    }
}
