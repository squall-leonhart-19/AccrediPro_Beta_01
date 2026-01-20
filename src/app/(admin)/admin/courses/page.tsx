import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CoursesClient } from "@/components/admin/courses-client";

async function getCoursesData() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [
        courses,
        categories,
        totalEnrollments,
        totalCertificates,
        activeStudents,
        completedEnrollments,
        // Mini Diploma funnel metrics
        miniDiplomaOptedIn,
        miniDiplomaStarted,
        miniDiplomaCompleted,
        miniDiplomaPaidConversions,
    ] = await Promise.all([
        prisma.course.findMany({
            include: {
                category: true,
                _count: {
                    select: {
                        enrollments: true,
                        modules: true,
                        certificates: true,
                    },
                },
                modules: {
                    include: {
                        lessons: {
                            orderBy: { order: "asc" },
                            select: {
                                id: true,
                                title: true,
                                order: true,
                                isPublished: true,
                                lessonType: true,
                                videoDuration: true,
                            },
                        },
                        _count: { select: { lessons: true } },
                    },
                    orderBy: { order: "asc" },
                },
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.category.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
        }),
        prisma.enrollment.count(),
        prisma.certificate.count(),
        prisma.enrollment.count({
            where: {
                lastAccessedAt: { gte: oneWeekAgo },
            },
        }),
        prisma.enrollment.count({
            where: { status: "COMPLETED" },
        }),
        // Mini Diploma: Users who opted in (have miniDiplomaCategory set)
        prisma.user.count({
            where: { miniDiplomaCategory: { not: null }, isFakeProfile: false },
        }),
        // Mini Diploma: Users who started (miniDiplomaProgress > 0)
        prisma.user.count({
            where: { miniDiplomaProgress: { gt: 0 }, isFakeProfile: false },
        }),
        // Mini Diploma: Users who completed
        prisma.user.count({
            where: { miniDiplomaCompletedAt: { not: null }, isFakeProfile: false },
        }),
        // Mini Diploma: Users who converted to paid (have a payment after mini diploma completion)
        prisma.payment.count({
            where: {
                status: "COMPLETED",
                user: {
                    miniDiplomaCompletedAt: { not: null },
                },
            },
        }),
    ]);

    const avgCompletionRate = totalEnrollments > 0
        ? Math.round((completedEnrollments / totalEnrollments) * 100)
        : 0;

    return {
        courses,
        categories,
        totalEnrollments,
        totalCertificates,
        activeStudentsThisWeek: activeStudents,
        avgCompletionRate,
        miniDiplomaFunnel: {
            optedIn: miniDiplomaOptedIn,
            started: miniDiplomaStarted,
            completed: miniDiplomaCompleted,
            convertedToPaid: miniDiplomaPaidConversions,
        },
    };
}

export default async function AdminCoursesPage() {
    const session = await getServerSession(authOptions);
    // Allow SUPPORT for read-only access
    if (!session?.user?.id || !["ADMIN", "SUPERUSER", "INSTRUCTOR", "SUPPORT"].includes(session.user.role as string)) {
        redirect("/login");
    }

    const {
        courses,
        categories,
        totalEnrollments,
        totalCertificates,
        activeStudentsThisWeek,
        avgCompletionRate,
        miniDiplomaFunnel,
    } = await getCoursesData();

    // Serialize for client component
    const serializedCourses = courses.map(course => ({
        ...course,
        price: course.price ? Number(course.price) : undefined,
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),
        publishedAt: course.publishedAt?.toISOString() || null,
    }));

    return (
        <CoursesClient
            initialCourses={serializedCourses as any}
            categories={categories}
            totalEnrollments={totalEnrollments}
            totalCertificates={totalCertificates}
            activeStudentsThisWeek={activeStudentsThisWeek}
            avgCompletionRate={avgCompletionRate}
            miniDiplomaFunnel={miniDiplomaFunnel}
        />
    );
}
