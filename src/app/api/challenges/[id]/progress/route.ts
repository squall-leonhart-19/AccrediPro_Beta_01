import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST: Complete a day in the challenge
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { day } = await req.json();

        if (!day) {
            return NextResponse.json({ error: "Missing day" }, { status: 400 });
        }

        // Get enrollment
        const enrollment = await prisma.challengeEnrollment.findUnique({
            where: {
                userId_challengeId: {
                    userId: session.user.id,
                    challengeId: id,
                },
            },
            include: {
                challenge: {
                    include: {
                        badges: true,
                    },
                },
            },
        });

        if (!enrollment) {
            return NextResponse.json({ error: "Not enrolled in this challenge" }, { status: 400 });
        }

        // Check if day is unlocked
        const startDate = new Date(enrollment.startedAt);
        const now = new Date();
        const daysSinceStart = Math.floor(
            (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const unlockedDay = daysSinceStart + 1;

        if (day > unlockedDay) {
            return NextResponse.json({ error: "This day is not yet unlocked" }, { status: 400 });
        }

        // Check if already completed
        if (enrollment.completedDays.includes(day)) {
            return NextResponse.json({ error: "Day already completed" }, { status: 400 });
        }

        // Update enrollment
        const newCompletedDays = [...enrollment.completedDays, day].sort((a, b) => a - b);
        const isComplete = newCompletedDays.length === enrollment.challenge.durationDays;

        const updated = await prisma.challengeEnrollment.update({
            where: { id: enrollment.id },
            data: {
                completedDays: newCompletedDays,
                currentDay: day + 1,
                completedAt: isComplete ? new Date() : null,
            },
        });

        // Award XP
        const xpEarned = isComplete ? 100 : 25;
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                xp: { increment: xpEarned },
            },
        });

        // Find badge for this day
        const badge = enrollment.challenge.badges.find((b) => b.day === day);
        let earnedBadge = null;

        if (badge) {
            // Create user badge
            const existingBadge = await prisma.badge.findUnique({
                where: { slug: `challenge-${id}-day-${day}` },
            });

            if (!existingBadge) {
                // Create the badge if it doesn't exist
                const newBadge = await prisma.badge.create({
                    data: {
                        name: badge.name,
                        slug: `challenge-${id}-day-${day}`,
                        description: badge.description || `Completed Day ${day}`,
                        icon: badge.icon,
                        color: "#722f37",
                        criteria: `Complete Day ${day} of the challenge`,
                        points: 25,
                    },
                });
                await prisma.userBadge.create({
                    data: {
                        userId: session.user.id,
                        badgeId: newBadge.id,
                    },
                });
                earnedBadge = newBadge;
            }
        }

        // Send mentor DM if coach is assigned
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { assignedCoachId: true, firstName: true },
        });

        if (user?.assignedCoachId) {
            const dayMessages: Record<number, string> = {
                1: `Amazing start, ${user.firstName}! You've taken your first step. I'm so proud of you! 💛`,
                3: `You're building momentum! Day 3 is a turning point. Keep going! 🔥`,
                5: `Halfway there! You're starting to think like a real practitioner now.`,
                7: `CONGRATULATIONS! 🎉 You've completed the challenge! You are READY for your next step.`,
            };

            if (dayMessages[day]) {
                await prisma.message.create({
                    data: {
                        senderId: user.assignedCoachId,
                        receiverId: session.user.id,
                        content: dayMessages[day],
                        messageType: "MENTORSHIP",
                    },
                });
            }
        }

        // Create notification
        await prisma.notification.create({
            data: {
                userId: session.user.id,
                type: "LESSON_COMPLETE",
                title: isComplete ? "Challenge Complete! 🏆" : `Day ${day} Complete! 🎉`,
                message: isComplete
                    ? `You've completed the entire challenge! +${xpEarned} XP`
                    : `Great work completing Day ${day}! +${xpEarned} XP`,
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                enrollment: updated,
                xpEarned,
                earnedBadge,
                isComplete,
            },
        });
    } catch (error) {
        console.error("Complete day error:", error);
        return NextResponse.json({ error: "Failed to complete day" }, { status: 500 });
    }
}
