import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * Check if user has completed the personalization quiz
 * GET /api/mini-diploma/quiz-status?niche=functional-medicine
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check for quiz:completed tag
        const quizTag = await prisma.userTag.findFirst({
            where: {
                userId: session.user.id,
                tag: "quiz:completed",
            },
        });

        return NextResponse.json({
            hasCompletedQuiz: !!quizTag,
        });
    } catch (error) {
        console.error("[Quiz Status] Error checking quiz status:", error);
        return NextResponse.json(
            { error: "Failed to check quiz status" },
            { status: 500 }
        );
    }
}
