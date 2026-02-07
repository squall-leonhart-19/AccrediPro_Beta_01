import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST - Complete all lessons for test user
export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow test users
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true },
    });

    const testEmails = ["at.seed019@gmail.com", "tortolialessio1997@gmail.com"];
    if (!user?.email || !testEmails.includes(user.email)) {
        return NextResponse.json({ error: "Not a test user" }, { status: 403 });
    }

    try {
        // Mark onboarding complete
        await prisma.leadOnboarding.upsert({
            where: { userId: session.user.id },
            update: {
                watchedVideo: true,
                completedQuestions: true,
            },
            create: {
                userId: session.user.id,
                watchedVideo: true,
                completedQuestions: true,
            },
        });

        // Complete all 3 lessons
        const lessonTags = [];
        for (let i = 1; i <= 9; i++) {
            lessonTags.push({
                userId: session.user.id,
                tag: `wh-lesson-complete:${i}`,
            });
        }

        // Delete existing tags first to avoid duplicates
        await prisma.userTag.deleteMany({
            where: {
                userId: session.user.id,
                tag: { startsWith: "wh-lesson-complete:" },
            },
        });

        // Create all lesson completion tags
        await prisma.userTag.createMany({
            data: lessonTags,
        });

        return NextResponse.json({
            success: true,
            message: "All steps completed! Refresh the page."
        });
    } catch (error) {
        console.error("Error completing all steps:", error);
        return NextResponse.json({ error: "Failed to complete" }, { status: 500 });
    }
}

// DELETE - Reset all progress for test user
export async function DELETE() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow test users
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true },
    });

    const testEmails = ["at.seed019@gmail.com", "tortolialessio1997@gmail.com"];
    if (!user?.email || !testEmails.includes(user.email)) {
        return NextResponse.json({ error: "Not a test user" }, { status: 403 });
    }

    try {
        // Reset onboarding
        await prisma.leadOnboarding.deleteMany({
            where: { userId: session.user.id },
        });

        // Delete lesson completion tags
        await prisma.userTag.deleteMany({
            where: {
                userId: session.user.id,
                tag: { startsWith: "wh-lesson-complete:" },
            },
        });

        return NextResponse.json({
            success: true,
            message: "Progress reset! Refresh the page."
        });
    } catch (error) {
        console.error("Error resetting progress:", error);
        return NextResponse.json({ error: "Failed to reset" }, { status: 500 });
    }
}
