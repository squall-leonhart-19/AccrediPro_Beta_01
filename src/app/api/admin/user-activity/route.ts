import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch complete user activity for dispute resolution
// OPTIMIZED: Reduced query complexity for faster loading
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

        // OPTIMIZED: Fetch data with minimal fields and reduced limits
        const [
            user,
            loginHistory,
            enrollments,
            lessonProgressCount,
            recentLessonProgress,
            certificates,
            activityLogsCount,
        ] = await Promise.all([
            // Basic user info - minimal fields
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

            // Login history - reduced to 20 most recent
            prisma.loginHistory.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                take: 20,
                select: {
                    id: true,
                    createdAt: true,
                    ipAddress: true,
                    device: true,
                    browser: true,
                },
            }),

            // Enrollments - minimal fields, no deep nesting
            prisma.enrollment.findMany({
                where: { userId },
                select: {
                    id: true,
                    status: true,
                    progress: true,
                    enrolledAt: true,
                    completedAt: true,
                    course: {
                        select: { id: true, title: true, slug: true },
                    },
                },
                orderBy: { enrolledAt: "desc" },
            }),

            // OPTIMIZED: Just count completed lessons instead of fetching all
            prisma.lessonProgress.count({
                where: { userId, isCompleted: true },
            }),

            // OPTIMIZED: Only fetch 10 most recent for display
            prisma.lessonProgress.findMany({
                where: { userId },
                select: {
                    id: true,
                    isCompleted: true,
                    watchTime: true,
                    updatedAt: true,
                    lesson: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                },
                orderBy: { updatedAt: "desc" },
                take: 10,
            }),

            // Certificates - minimal fields
            prisma.certificate.findMany({
                where: { userId },
                select: {
                    id: true,
                    issuedAt: true,
                    course: {
                        select: { title: true },
                    },
                },
                orderBy: { issuedAt: "desc" },
            }),

            // OPTIMIZED: Just count activity logs
            prisma.userActivity.count({
                where: { userId },
            }),
        ]);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Calculate stats using counts instead of fetched arrays
        const totalWatchTime = recentLessonProgress.reduce((acc, lp) => acc + (lp.watchTime || 0), 0);

        const stats = {
            totalLogins: user.loginCount,
            firstLogin: user.firstLoginAt,
            lastLogin: user.lastLoginAt,
            accountCreated: user.createdAt,
            totalEnrollments: enrollments.length,
            completedCourses: enrollments.filter(e => e.status === "COMPLETED").length,
            lessonsCompleted: lessonProgressCount,
            totalWatchTime,
            certificatesEarned: certificates.length,
            totalActivityLogs: activityLogsCount,
        };

        return NextResponse.json({
            user,
            stats,
            loginHistory,
            enrollments,
            lessonProgress: recentLessonProgress,
            certificates,
            activityLogs: [], // Don't fetch full logs - just show count in stats
        });
    } catch (error) {
        console.error("Get user activity error:", error);
        return NextResponse.json({ error: "Failed to fetch user activity" }, { status: 500 });
    }
}

