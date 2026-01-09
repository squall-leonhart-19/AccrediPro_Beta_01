import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST - Save onboarding question answers
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            bringReason,
            currentSituation,
            incomeGoal,
            lifeChangeGoal,
            doingItFor,
            uploadedPhoto,
        } = body;

        // Upsert lead onboarding record
        const onboarding = await prisma.leadOnboarding.upsert({
            where: { userId: session.user.id },
            update: {
                bringReason,
                currentSituation,
                incomeGoal,
                lifeChangeGoal,
                doingItFor,
                completedQuestions: true,
                completedQuestionsAt: new Date(),
                uploadedPhoto: uploadedPhoto || false,
                uploadedPhotoAt: uploadedPhoto ? new Date() : undefined,
            },
            create: {
                userId: session.user.id,
                bringReason,
                currentSituation,
                incomeGoal,
                lifeChangeGoal,
                doingItFor,
                completedQuestions: true,
                completedQuestionsAt: new Date(),
                uploadedPhoto: uploadedPhoto || false,
                uploadedPhotoAt: uploadedPhoto ? new Date() : undefined,
            },
        });

        // Also update user profile with relevant data
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                learningGoal: bringReason,
                hasCompletedOnboarding: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Onboarding answers saved",
            onboarding,
        });
    } catch (error) {
        console.error("[lead-onboarding/save-answers] Error:", error);
        return NextResponse.json(
            { error: "Failed to save answers" },
            { status: 500 }
        );
    }
}
