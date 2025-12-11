import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: Get challenge details with user progress
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const challenge = await prisma.challenge.findUnique({
            where: { id },
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
            },
        });

        if (!challenge) {
            return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
        }

        const enrollment = challenge.enrollments[0];

        // Calculate unlocked days based on enrollment date
        let unlockedDays: number[] = [];
        if (enrollment) {
            const startDate = new Date(enrollment.startedAt);
            const now = new Date();
            const daysSinceStart = Math.floor(
                (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            // Day 1 is always unlocked, then +1 for each day passed
            for (let i = 1; i <= Math.min(challenge.durationDays, daysSinceStart + 1); i++) {
                unlockedDays.push(i);
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                ...challenge,
                isEnrolled: !!enrollment,
                currentDay: enrollment?.currentDay || 0,
                completedDays: enrollment?.completedDays || [],
                unlockedDays,
                startedAt: enrollment?.startedAt,
            },
        });
    } catch (error) {
        console.error("Get challenge error:", error);
        return NextResponse.json({ error: "Failed to get challenge" }, { status: 500 });
    }
}
