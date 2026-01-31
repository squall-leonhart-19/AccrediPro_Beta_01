import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch onboarding progress for current user
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only for STUDENT users (buyers)
        if (session.user.userType === "LEAD") {
            return NextResponse.json({
                progress: null,
                message: "Onboarding only for buyers"
            });
        }

        let progress = await prisma.onboardingProgress.findUnique({
            where: { userId: session.user.id },
        });

        // Create progress record if doesn't exist
        if (!progress) {
            progress = await prisma.onboardingProgress.create({
                data: { userId: session.user.id },
            });
        }

        // Check if user has set their goals (has income_goal tag)
        const hasIncomeGoalTag = await prisma.userTag.findFirst({
            where: {
                userId: session.user.id,
                tag: { startsWith: "income_goal:" },
            },
        });
        const goalsSet = !!hasIncomeGoalTag;

        // Calculate completion percentage (now 7 steps)
        const steps = [
            progress.profileComplete,
            progress.welcomeVideoWatched,
            goalsSet, // NEW: Set your goals step
            progress.firstMessageSent,
            progress.firstLessonComplete,
            progress.communityIntro,
            progress.resourceDownloaded,
        ];
        const completedCount = steps.filter(Boolean).length;
        const totalSteps = 7;
        const percentage = Math.round((completedCount / totalSteps) * 100);

        return NextResponse.json({
            progress: {
                ...progress,
                goalsSet, // Include in response
            },
            completedCount,
            totalSteps,
            percentage,
            isComplete: completedCount === totalSteps,
        });
    } catch (error) {
        console.error("[Onboarding] Error fetching progress:", error);
        return NextResponse.json(
            { error: "Failed to fetch onboarding progress" },
            { status: 500 }
        );
    }
}

// POST - Update a specific step
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { step } = body;

        const validSteps = [
            "profileComplete",
            "welcomeVideoWatched",
            "firstMessageSent",
            "firstLessonComplete",
            "communityIntro",
            "resourceDownloaded",
        ];

        if (!step || !validSteps.includes(step)) {
            return NextResponse.json(
                { error: "Invalid step" },
                { status: 400 }
            );
        }

        // Upsert progress record
        let progress = await prisma.onboardingProgress.upsert({
            where: { userId: session.user.id },
            create: {
                userId: session.user.id,
                [step]: true,
            },
            update: {
                [step]: true,
            },
        });

        // Check if all steps complete
        const steps = [
            progress.profileComplete,
            progress.welcomeVideoWatched,
            progress.firstMessageSent,
            progress.firstLessonComplete,
            progress.communityIntro,
            progress.resourceDownloaded,
        ];
        const allComplete = steps.every(Boolean);

        // Mark as fully complete if all done
        if (allComplete && !progress.completedAt) {
            progress = await prisma.onboardingProgress.update({
                where: { userId: session.user.id },
                data: { completedAt: new Date() },
            });
        }

        const completedCount = steps.filter(Boolean).length;

        return NextResponse.json({
            success: true,
            progress,
            completedCount,
            totalSteps: 6,
            percentage: Math.round((completedCount / 6) * 100),
            isComplete: allComplete,
            justCompleted: allComplete && !progress.completedAt,
        });
    } catch (error) {
        console.error("[Onboarding] Error updating step:", error);
        return NextResponse.json(
            { error: "Failed to update onboarding step" },
            { status: 500 }
        );
    }
}
