import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST - Mark a lesson as complete
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { lessonId } = body;

        if (!lessonId || lessonId < 1 || lessonId > 9) {
            return NextResponse.json(
                { error: "Invalid lesson ID" },
                { status: 400 }
            );
        }

        const tag = `wh-lesson-complete:${lessonId}`;

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
