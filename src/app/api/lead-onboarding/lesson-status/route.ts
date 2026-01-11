import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get lesson status and user info
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const lessonId = parseInt(searchParams.get("lesson") || "0");

        // Get user info
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { firstName: true },
        });

        // Check if lesson is completed
        const lessonTag = await prisma.userTag.findFirst({
            where: {
                userId: session.user.id,
                tag: `wh-lesson-complete:${lessonId}`,
            },
        });

        return NextResponse.json({
            success: true,
            firstName: user?.firstName || "friend",
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
