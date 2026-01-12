import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Play,
    CheckCircle,
    GraduationCap,
    ChevronRight,
    BookOpen,
} from "lucide-react";

async function getEnrolledCourses(userId: string) {
    return prisma.enrollment.findMany({
        where: { userId },
        include: {
            course: {
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    thumbnail: true,
                    modules: {
                        where: { isPublished: true },
                        include: {
                            lessons: { where: { isPublished: true }, select: { id: true } },
                        },
                    },
                },
            },
        },
        orderBy: { lastAccessedAt: "desc" },
    });
}

async function calculateProgress(userId: string, enrollment: any) {
    const totalLessons = enrollment.course.modules.reduce(
        (acc: number, m: any) => acc + m.lessons.length,
        0
    );

    const completedLessons = await prisma.lessonProgress.count({
        where: {
            userId,
            isCompleted: true,
            lesson: { module: { courseId: enrollment.courseId } }
        },
    });

    return {
        totalLessons,
        completedLessons,
        progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    };
}

export default async function MyCoursesPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    const enrollments = await getEnrolledCourses(session.user.id);

    const enrollmentsWithProgress = await Promise.all(
        enrollments.map(async (enrollment) => {
            const progressData = await calculateProgress(session.user.id, enrollment);
            return { ...enrollment, ...progressData };
        })
    );

    // Sort: in-progress first (by progress desc), then not started, then completed
    const sortedEnrollments = enrollmentsWithProgress.sort((a, b) => {
        const aStatus = a.progress === 100 ? 2 : a.progress > 0 ? 0 : 1;
        const bStatus = b.progress === 100 ? 2 : b.progress > 0 ? 0 : 1;
        if (aStatus !== bStatus) return aStatus - bStatus;
        return b.progress - a.progress;
    });

    const inProgress = sortedEnrollments.filter(e => e.progress > 0 && e.progress < 100);
    const notStarted = sortedEnrollments.filter(e => e.progress === 0);
    const completed = sortedEnrollments.filter(e => e.progress === 100);

    const firstName = session.user.firstName || "there";

    return (
        <div className="min-h-[80vh] space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    {inProgress.length > 0 ? `Continue Learning, ${firstName}` : `Your Courses`}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    {sortedEnrollments.length} course{sortedEnrollments.length !== 1 ? "s" : ""} enrolled
                </p>
            </div>

            {sortedEnrollments.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <GraduationCap className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h2>
                    <p className="text-gray-500 mb-6 max-w-sm">
                        Start your certification journey by exploring our catalog.
                    </p>
                    <Link href="/catalog">
                        <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Browse Courses
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Continue Learning */}
                    {inProgress.length > 0 && (
                        <section>
                            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                                Continue Learning
                            </h2>
                            <div className="space-y-3">
                                {inProgress.map((enrollment) => (
                                    <CourseRow key={enrollment.id} enrollment={enrollment} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Not Started */}
                    {notStarted.length > 0 && (
                        <section>
                            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                                Ready to Start
                            </h2>
                            <div className="space-y-3">
                                {notStarted.map((enrollment) => (
                                    <CourseRow key={enrollment.id} enrollment={enrollment} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Completed */}
                    {completed.length > 0 && (
                        <section>
                            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                                Completed
                            </h2>
                            <div className="space-y-3">
                                {completed.map((enrollment) => (
                                    <CourseRow key={enrollment.id} enrollment={enrollment} isCompleted />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}

function CourseRow({
    enrollment,
    isCompleted = false,
}: {
    enrollment: any;
    isCompleted?: boolean;
}) {
    return (
        <Link
            href={`/courses/${enrollment.course.slug}`}
            className="group flex items-center gap-4 p-3 -mx-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
            {/* Thumbnail */}
            <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                {enrollment.course.thumbnail ? (
                    <Image
                        src={enrollment.course.thumbnail}
                        alt={enrollment.course.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-burgundy-500 to-burgundy-700">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                )}
                {/* Play overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-white" />
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 group-hover:text-burgundy-700 truncate transition-colors">
                    {enrollment.course.title}
                </h3>
                <div className="flex items-center gap-3 mt-1.5">
                    {isCompleted ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Completed
                        </span>
                    ) : (
                        <>
                            <Progress
                                value={enrollment.progress}
                                className="w-24 h-1.5"
                            />
                            <span className="text-xs text-gray-500">
                                {enrollment.progress}%
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Arrow */}
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-burgundy-600 transition-colors flex-shrink-0" />
        </Link>
    );
}
