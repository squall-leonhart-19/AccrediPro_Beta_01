import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Get funnel counts
        const [
            totalSignups,
            onboardingComplete,
            firstLessonViewed,
            progress25,
            progress50,
            courseCompleted,
            certificateDownloaded,
        ] = await Promise.all([
            // 1. Total signups (all real users)
            prisma.user.count({
                where: { isFakeProfile: false, email: { not: null } },
            }),
            // 2. Completed onboarding
            prisma.user.count({
                where: {
                    isFakeProfile: false,
                    hasCompletedOnboarding: true
                },
            }),
            // 3. Viewed at least 1 lesson
            prisma.user.count({
                where: {
                    isFakeProfile: false,
                    progress: { some: {} },
                },
            }),
            // 4. Reached 25% on any course
            prisma.enrollment.count({
                where: {
                    progress: { gte: 25 },
                    user: { isFakeProfile: false },
                },
            }),
            // 5. Reached 50% on any course  
            prisma.enrollment.count({
                where: {
                    progress: { gte: 50 },
                    user: { isFakeProfile: false },
                },
            }),
            // 6. Completed a course
            prisma.enrollment.count({
                where: {
                    status: "COMPLETED",
                    user: { isFakeProfile: false },
                },
            }),
            // 7. Downloaded certificate
            prisma.certificate.count({
                where: {
                    user: { isFakeProfile: false },
                },
            }),
        ]);

        const stages = [
            {
                id: 1,
                name: "Signup",
                count: totalSignups,
                percent: 100,
                dropOff: 0,
            },
            {
                id: 2,
                name: "Onboarding",
                count: onboardingComplete,
                percent: totalSignups > 0 ? Math.round((onboardingComplete / totalSignups) * 100) : 0,
                dropOff: totalSignups - onboardingComplete,
            },
            {
                id: 3,
                name: "First Lesson",
                count: firstLessonViewed,
                percent: totalSignups > 0 ? Math.round((firstLessonViewed / totalSignups) * 100) : 0,
                dropOff: onboardingComplete - firstLessonViewed,
            },
            {
                id: 4,
                name: "25% Progress",
                count: progress25,
                percent: totalSignups > 0 ? Math.round((progress25 / totalSignups) * 100) : 0,
                dropOff: firstLessonViewed - progress25,
            },
            {
                id: 5,
                name: "50% Progress",
                count: progress50,
                percent: totalSignups > 0 ? Math.round((progress50 / totalSignups) * 100) : 0,
                dropOff: progress25 - progress50,
            },
            {
                id: 6,
                name: "Course Complete",
                count: courseCompleted,
                percent: totalSignups > 0 ? Math.round((courseCompleted / totalSignups) * 100) : 0,
                dropOff: progress50 - courseCompleted,
            },
            {
                id: 7,
                name: "Certificate",
                count: certificateDownloaded,
                percent: totalSignups > 0 ? Math.round((certificateDownloaded / totalSignups) * 100) : 0,
                dropOff: courseCompleted - certificateDownloaded,
            },
        ];

        // Find biggest drop-off
        const maxDropOff = stages.reduce((max, stage) =>
            stage.dropOff > max.dropOff ? stage : max,
            stages[0]
        );

        return NextResponse.json({
            stages,
            totalSignups,
            finalConversion: totalSignups > 0 ? Math.round((certificateDownloaded / totalSignups) * 100) : 0,
            biggestDropOff: maxDropOff.name,
            biggestDropOffCount: maxDropOff.dropOff,
        });
    } catch (error) {
        console.error("Error fetching funnel data:", error);
        return NextResponse.json({ error: "Failed to fetch funnel data" }, { status: 500 });
    }
}
