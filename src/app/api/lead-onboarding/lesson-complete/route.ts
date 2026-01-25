import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { enrollUserInSequences } from "@/lib/sequence-enrollment";

// Map niche to tag prefix
const NICHE_TAG_PREFIX: Record<string, string> = {
    "womens-health": "wh-lesson-complete",
    "gut-health": "gut-health-lesson-complete",
    "functional-medicine": "functional-medicine-lesson-complete",
    "health-coach": "health-coach-lesson-complete",
    "nurse-coach": "nurse-coach-lesson-complete",
    "holistic-nutrition": "holistic-nutrition-lesson-complete",
    "hormone-health": "hormone-health-lesson-complete",
};

// POST - Mark a lesson as complete
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { lessonId, niche = "womens-health" } = body;

        if (!lessonId || lessonId < 1 || lessonId > 9) {
            return NextResponse.json(
                { error: "Invalid lesson ID" },
                { status: 400 }
            );
        }

        // Get tag prefix for this niche (default to womens-health)
        const tagPrefix = NICHE_TAG_PREFIX[niche] || "wh-lesson-complete";
        const tag = `${tagPrefix}:${lessonId}`;

        // Check if already complete
        const existingTag = await prisma.userTag.findFirst({
            where: {
                userId: session.user.id,
                tag,
            },
        });

        if (existingTag) {
            return NextResponse.json({
                success: true,
                message: "Lesson already completed",
                lessonId,
            });
        }

        // Create the completion tag
        await prisma.userTag.create({
            data: {
                userId: session.user.id,
                tag,
            },
        });

        console.log(`[lesson-complete] User ${session.user.id} completed lesson ${lessonId}`);

        // When lesson 1 is completed, enroll in MINI_DIPLOMA_STARTED sequences
        if (lessonId === 1) {
            try {
                const enrolled = await enrollUserInSequences(
                    session.user.id,
                    "MINI_DIPLOMA_STARTED",
                    `mini-diploma-${niche}`
                );
                if (enrolled > 0) {
                    console.log(`[lesson-complete] Enrolled user ${session.user.id} in ${enrolled} MINI_DIPLOMA_STARTED sequence(s)`);
                }
            } catch (err) {
                console.error(`[lesson-complete] Failed to enroll in sequences:`, err);
                // Don't fail the lesson completion if sequence enrollment fails
            }
        }

        return NextResponse.json({
            success: true,
            message: "Lesson marked as complete",
            lessonId,
        });
    } catch (error) {
        console.error("[lesson-complete] Error:", error);
        return NextResponse.json(
            { error: "Failed to mark lesson complete" },
            { status: 500 }
        );
    }
}
