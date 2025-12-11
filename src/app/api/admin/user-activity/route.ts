import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch complete user activity for dispute resolution
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        // Fetch all activity data for this user
        const [
            user,
            loginHistory,
            enrollments,
            lessonProgress,
            certificates,
            activityLogs,
        ] = await Promise.all([
            // Basic user info
            prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    createdAt: true,
                    firstLoginAt: true,
                    lastLoginAt: true,
                    loginCount: true,
                },
            }),

            // Login history
            prisma.loginHistory.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                take: 50,
            }),

            // Enrollments with course info
            prisma.enrollment.findMany({
                where: { userId },
                include: {
                    course: {
                        select: { id: true, title: true, slug: true },
                    },
                },
                orderBy: { enrolledAt: "desc" },
            }),

            // Lesson progress with lesson and module info
            prisma.lessonProgress.findMany({
                where: { userId },
                include: {
                    lesson: {
                        select: {
                            id: true,
                            title: true,
                            module: {
                                select: {
                                    title: true,
                                    course: {
                                        select: { title: true },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: { updatedAt: "desc" },
                take: 100,
            }),

            // Certificates issued
            prisma.certificate.findMany({
                where: { userId },
                include: {
                    course: {
                        select: { title: true },
                    },
                },
                orderBy: { issuedAt: "desc" },
            }),

            // General activity logs
            prisma.userActivity.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                take: 100,
            }),
        ]);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Calculate stats
        const stats = {
            totalLogins: user.loginCount,
            firstLogin: user.firstLoginAt,
            lastLogin: user.lastLoginAt,
            accountCreated: user.createdAt,
            totalEnrollments: enrollments.length,
            completedCourses: enrollments.filter(e => e.status === "COMPLETED").length,
            lessonsCompleted: lessonProgress.filter(lp => lp.isCompleted).length,
            totalWatchTime: lessonProgress.reduce((acc, lp) => acc + (lp.watchTime || 0), 0),
            certificatesEarned: certificates.length,
        };

        return NextResponse.json({
            user,
            stats,
            loginHistory,
            enrollments,
            lessonProgress,
            certificates,
            activityLogs,
        });
    } catch (error) {
        console.error("Get user activity error:", error);
        return NextResponse.json({ error: "Failed to fetch user activity" }, { status: 500 });
    }
}
