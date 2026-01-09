import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { MyLearningTabs } from "./my-learning-tabs";
import { MyCoursesTab } from "./tabs/my-courses-tab";
import { CatalogTab } from "./tabs/catalog-tab";
import { RoadmapTab } from "./tabs/roadmap-tab";

export const dynamic = "force-dynamic";

async function getMyLearningData(userId: string) {
    const [
        enrollments,
        lessonProgress,
        userStreak,
        allCourses,
    ] = await Promise.all([
        prisma.enrollment.findMany({
            where: { userId },
            include: {
                course: {
                    select: {
                        id: true,
                        slug: true,
                        title: true,
                        thumbnail: true,
                        category: true,
                        modules: {
                            where: { isPublished: true },
                            include: {
                                lessons: {
                                    where: { isPublished: true },
                                    select: { id: true, title: true }
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { lastAccessedAt: "desc" },
        }),
        prisma.lessonProgress.findMany({
            where: { userId, isCompleted: true },
            select: { lessonId: true },
        }),
        prisma.userStreak.findUnique({ where: { userId } }),
        prisma.course.findMany({
            where: { isPublished: true },
            include: {
                category: true,
                _count: { select: { enrollments: true } },
            },
            orderBy: { enrollments: { _count: "desc" } },
        }),
    ]);

    const completedLessonIds = new Set(lessonProgress.map(l => l.lessonId));

    const enrollmentsWithProgress = enrollments.map(enrollment => {
        const courseLessonIds = enrollment.course.modules.flatMap(m =>
            m.lessons.map(l => l.id)
        );
        const completedInCourse = courseLessonIds.filter(id =>
            completedLessonIds.has(id)
        ).length;
        const progress = courseLessonIds.length > 0
            ? Math.round((completedInCourse / courseLessonIds.length) * 100)
            : 0;

        return {
            ...enrollment,
            progress,
            totalLessons: courseLessonIds.length,
            completedLessons: completedInCourse,
        };
    });

    const enrolledCourseIds = new Set(enrollments.map(e => e.course.id));
    const catalogCourses = allCourses.filter(c => !enrolledCourseIds.has(c.id));

    return {
        enrollments: enrollmentsWithProgress,
        streak: userStreak?.currentStreak || 0,
        catalogCourses,
        stats: {
            totalEnrolled: enrollments.length,
            inProgress: enrollments.filter(e => e.status === "ACTIVE").length,
            completed: enrollments.filter(e => e.status === "COMPLETED").length,
        },
    };
}

export default async function MyLearningPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    const data = await getMyLearningData(session.user.id);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="rounded-xl overflow-hidden bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-700">
                <div className="px-5 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-white">
                                My <span className="text-gold-400">Learning</span>
                            </h1>
                            <p className="text-xs text-burgundy-200 mt-0.5">
                                Your courses, catalog, and career roadmap.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-white">
                            <div className="px-3 py-1.5 bg-white/10 rounded-lg">
                                <span className="font-bold text-gold-400">{data.stats.inProgress}</span> In Progress
                            </div>
                            <div className="px-3 py-1.5 bg-white/10 rounded-lg">
                                <span className="font-bold text-gold-400">{data.stats.completed}</span> Completed
                            </div>
                            <div className="px-3 py-1.5 bg-white/10 rounded-lg">
                                🔥 <span className="font-bold">{data.streak}</span> Day Streak
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabbed Content */}
            <MyLearningTabs defaultTab="courses">
                {{
                    courses: <MyCoursesTab enrollments={data.enrollments} />,
                    catalog: <CatalogTab courses={data.catalogCourses} />,
                    roadmap: <RoadmapTab />,
                }}
            </MyLearningTabs>
        </div>
    );
}
