import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: List all challenges
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const challenges = await prisma.challenge.findMany({
            where: { isActive: true },
            include: {
                modules: {
                    orderBy: { day: "asc" },
                },
                badges: {
                    orderBy: { day: "asc" },
                },
                enrollments: {
                    where: { userId: session.user.id },
                },
                _count: {
                    select: { enrollments: true },
                },
            },
            orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        });

        // Transform data to include user's progress
        const challengesWithProgress = challenges.map((challenge) => {
            const enrollment = challenge.enrollments[0];
            return {
                ...challenge,
                isEnrolled: !!enrollment,
                currentDay: enrollment?.currentDay || 0,
                completedDays: enrollment?.completedDays || [],
                startedAt: enrollment?.startedAt,
                enrollmentCount: challenge._count.enrollments,
            };
        });

        return NextResponse.json({
            success: true,
            data: challengesWithProgress,
        });
    } catch (error) {
        console.error("Get challenges error:", error);
        return NextResponse.json({ error: "Failed to get challenges" }, { status: 500 });
    }
}

// POST: Enroll in a challenge
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { challengeId } = await req.json();

        if (!challengeId) {
            return NextResponse.json({ error: "Missing challengeId" }, { status: 400 });
        }

        // Check if already enrolled
        const existing = await prisma.challengeEnrollment.findUnique({
            where: {
                userId_challengeId: {
                    userId: session.user.id,
                    challengeId,
                },
            },
        });

        if (existing) {
            return NextResponse.json({ error: "Already enrolled" }, { status: 400 });
        }

        // Create enrollment
        const enrollment = await prisma.challengeEnrollment.create({
            data: {
                userId: session.user.id,
                challengeId,
                currentDay: 1,
                completedDays: [],
            },
            include: {
                challenge: {
                    include: {
                        modules: true,
                        badges: true,
                    },
                },
            },
        });

        // Award XP for enrolling
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                xp: { increment: 10 },
            },
        });

        // Create notification
        await prisma.notification.create({
            data: {
                userId: session.user.id,
                type: "SYSTEM",
                title: "Challenge Started! 🔥",
                message: `You've enrolled in ${enrollment.challenge.title}. Day 1 is ready!`,
            },
        });

        return NextResponse.json({
            success: true,
            data: enrollment,
        });
    } catch (error) {
        console.error("Enroll challenge error:", error);
        return NextResponse.json({ error: "Failed to enroll in challenge" }, { status: 500 });
    }
}
