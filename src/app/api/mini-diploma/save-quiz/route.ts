import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * Save personalization quiz answers as user tags
 * POST /api/mini-diploma/save-quiz
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { healthInterest, goal, motivation, experience } = body;

        // Validate required fields
        if (!healthInterest || !goal || !motivation || !experience) {
            return NextResponse.json(
                { error: "All quiz questions are required" },
                { status: 400 }
            );
        }

        // Build tag list
        const tags = [
            `interest:${healthInterest}`,
            `goal:${goal}`,
            `motivation:${motivation}`,
            `experience:${experience}`,
            "quiz:completed",
        ];

        // Save tags (upsert to avoid duplicates)
        for (const tag of tags) {
            await prisma.userTag.upsert({
                where: {
                    userId_tag: {
                        userId: session.user.id,
                        tag,
                    },
                },
                update: {},
                create: {
                    userId: session.user.id,
                    tag,
                },
            });
        }

        console.log(`[Quiz] Saved quiz for user ${session.user.id}:`, tags);

        return NextResponse.json({
            success: true,
            message: "Quiz saved successfully",
            tags,
        });
    } catch (error) {
        console.error("[Quiz] Error saving quiz:", error);
        return NextResponse.json(
            { error: "Failed to save quiz" },
            { status: 500 }
        );
    }
}
