import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

// GET - Get lesson status and user info
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const lessonId = parseInt(searchParams.get("lesson") || "0");
        const niche = searchParams.get("niche") || "womens-health";

        // Get tag prefix for this niche (default to womens-health)
        const tagPrefix = NICHE_TAG_PREFIX[niche] || "wh-lesson-complete";

        // Get user info
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { firstName: true },
        });

        // Check if lesson is completed
        const lessonTag = await prisma.userTag.findFirst({
            where: {
                userId: session.user.id,
                tag: `${tagPrefix}:${lessonId}`,
            },
        });

        return NextResponse.json({
            success: true,
            firstName: user?.firstName || "friend",
            userId: session.user.id,
            completed: !!lessonTag,
            lessonId,
        });
    } catch (error) {
        console.error("[lesson-status] Error:", error);
        return NextResponse.json(
            { error: "Failed to get lesson status" },
            { status: 500 }
        );
    }
}
