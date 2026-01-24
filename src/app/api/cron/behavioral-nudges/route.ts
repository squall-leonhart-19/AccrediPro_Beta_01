import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
    BEHAVIORAL_TRIGGERS,
    evaluateBehavioralTrigger,
    fillBehavioralMessage,
    type BehavioralNudgeData,
} from "@/lib/behavioral-nudges";

// Behavioral Nudges CRON
// Runs every 30 minutes to catch real-time behavioral triggers
// DM only (no email for these - they're time-sensitive)

export async function GET(request: Request) {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Get Coach Sarah
        const sarah = await prisma.user.findFirst({
            where: { email: "sarah@accredipro-certificate.com" },
        });

        if (!sarah) {
            return NextResponse.json({ error: "Sarah not found" }, { status: 500 });
        }

        const now = new Date();
        const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);

        // Get students who:
        // 1. Logged in within last 6 hours (potential triggers)
        // 2. Have active enrollments
        const students = await prisma.user.findMany({
            where: {
                role: "STUDENT",
                isActive: true,
                lastLoginAt: { gte: sixHoursAgo },
            },
            select: {
                id: true,
                firstName: true,
                lastLoginAt: true,
                lessonProgress: {
                    where: {
                        isCompleted: true,
                        updatedAt: { gte: sixHoursAgo },
                    },
                    orderBy: { updatedAt: "desc" },
                    take: 1,
                    select: {
                        lessonId: true,
                        updatedAt: true,
                        lesson: {
                            select: {
                                id: true,
                                title: true,
                                order: true,
                                module: {
                                    select: {
                                        id: true,
                                        order: true,
                                        lessons: {
                                            where: { isPublished: true },
                                            orderBy: { order: "asc" },
                                            select: { id: true, title: true, order: true },
                                        },
                                        course: {
                                            select: {
                                                modules: {
                                                    where: { isPublished: true },
                                                    orderBy: { order: "asc" },
                                                    select: {
                                                        id: true,
                                                        order: true,
                                                        lessons: {
                                                            where: { isPublished: true },
                                                            orderBy: { order: "asc" },
                                                            select: { id: true, title: true },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const nudgesSent: { student: string; trigger: string }[] = [];
        const errors: string[] = [];

        for (const student of students) {
            try {
                const recentCompletion = student.lessonProgress[0];
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Find next lesson if they completed one
                let nextLessonTitle: string | null = null;

                if (recentCompletion?.lesson?.module) {
                    const allLessons = recentCompletion.lesson.module.course.modules
                        .flatMap((m) => m.lessons);
                    const currentIndex = allLessons.findIndex(
                        (l) => l.id === recentCompletion.lessonId
                    );
                    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
                        nextLessonTitle = allLessons[currentIndex + 1]?.title || null;
                    }
                }

                const nudgeData: BehavioralNudgeData = {
                    userId: student.id,
                    firstName: student.firstName || "there",
                    lastLoginAt: student.lastLoginAt,
                    lastLessonId: recentCompletion?.lessonId || null,
                    lastLessonTitle: recentCompletion?.lesson?.title || null,
                    lastLessonCompletedAt: recentCompletion?.updatedAt || null,
                    nextLessonTitle,
                    lessonDuration: 10, // Default estimate
                    hasCompletedAnyLessonToday: recentCompletion?.updatedAt
                        ? recentCompletion.updatedAt >= today
                        : false,
                    sessionStartedAt: student.lastLoginAt,
                };

                // Evaluate trigger
                const trigger = evaluateBehavioralTrigger(nudgeData, now);

                if (!trigger) continue;

                // Check cooldown (don't send same trigger type within 24 hours)
                const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                const recentBehavioralNudge = await prisma.message.findFirst({
                    where: {
                        senderId: sarah.id,
                        receiverId: student.id,
                        content: { contains: `<!-- behavioral:${trigger.id} -->` },
                        createdAt: { gte: oneDayAgo },
                    },
                });

                if (recentBehavioralNudge) continue; // Skip - sent recently

                // Fill message
                const message = fillBehavioralMessage(trigger.message, nudgeData);
                const formattedMessage = `${trigger.emoji} ${message}`;

                // Send DM from Sarah
                await prisma.message.create({
                    data: {
                        senderId: sarah.id,
                        receiverId: student.id,
                        content: `${formattedMessage}\n\n<!-- behavioral:${trigger.id} -->`,
                    },
                });

                nudgesSent.push({ student: student.firstName || student.id, trigger: trigger.id });
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Unknown error";
                errors.push(`${student.id}: ${errorMessage}`);
            }
        }

        return NextResponse.json({
            success: true,
            timestamp: now.toISOString(),
            studentsChecked: students.length,
            nudgesSent: nudgesSent.length,
            details: nudgesSent,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error("Behavioral nudges cron error:", error);
        return NextResponse.json(
            { error: "Failed to process behavioral nudges", details: error instanceof Error ? error.message : "Unknown" },
            { status: 500 }
        );
    }
}
