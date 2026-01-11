import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { LessonPageV3 } from "@/components/courses/learn-v3/lesson-page-v3";

async function getLesson(lessonId: string) {
    return prisma.lesson.findFirst({
        where: { id: lessonId, isPublished: true },
        include: {
            module: {
                include: {
                    quiz: {
                        select: {
                            id: true,
                            isPublished: true,
                        },
                    },
                    course: {
                        include: {
                            modules: {
                                where: { isPublished: true },
                                orderBy: { order: "asc" },
                                include: {
                                    lessons: {
                                        where: { isPublished: true },
                                        orderBy: { order: "asc" },
                                    },
                                    quiz: {
                                        select: {
                                            id: true,
                                            isPublished: true,
                                        },
                                    },
                                },
                            },
                            coach: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    avatar: true,
                                },
                            },
                        },
                    },
                },
            },
            resources: true,
        },
    });
}

async function getEnrollment(userId: string, courseId: string) {
    return prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
    });
}

async function getLessonProgress(userId: string, courseId: string, currentModuleId: string) {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            modules: {
                where: { isPublished: true },
                orderBy: { order: "asc" },
                include: {
                    lessons: {
                        where: { isPublished: true },
                        select: { id: true },
                    },
                },
            },
        },
    });

    if (!course) return {
        progressMap: new Map(),
        totalLessons: 0,
        completedLessons: 0,
        moduleProgress: { total: 0, completed: 0 },
        courseProgress: { total: 0, completed: 0 }
    };

    const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
    const currentModule = course.modules.find(m => m.id === currentModuleId);
    const currentModuleLessonIds = currentModule?.lessons.map(l => l.id) || [];

    const progress = await prisma.lessonProgress.findMany({
        where: {
            userId,
            lessonId: { in: lessonIds },
        },
    });

    const progressMap = new Map(progress.map((p) => [p.lessonId, p]));
    const completedLessons = progress.filter((p) => p.isCompleted).length;
    const moduleCompletedLessons = progress.filter(
        (p) => p.isCompleted && currentModuleLessonIds.includes(p.lessonId)
    ).length;

    return {
        progressMap,
        totalLessons: lessonIds.length,
        completedLessons,
        moduleProgress: {
            total: currentModuleLessonIds.length,
            completed: moduleCompletedLessons,
        },
        courseProgress: {
            total: lessonIds.length,
            completed: completedLessons,
        }
    };
}

async function getUserStreak(userId: string) {
    return prisma.userStreak.findUnique({
        where: { userId },
    });
}

export default async function LearnV3Page({
    params,
}: {
    params: Promise<{ slug: string; lessonId: string }>;
}) {
    const { slug, lessonId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const lesson = await getLesson(lessonId);

    if (!lesson) notFound();

    const course = lesson.module.course;
    const enrollment = await getEnrollment(session.user.id, course.id);

    // Check access
    if (!enrollment && !lesson.isFreePreview) {
        redirect(`/courses/${slug}`);
    }

    const [progressData, userStreak] = await Promise.all([
        getLessonProgress(session.user.id, course.id, lesson.module.id),
        getUserStreak(session.user.id),
    ]);

    const { progressMap, totalLessons, moduleProgress, courseProgress } = progressData;

    const currentProgress = progressMap.get(lesson.id);
    const isCompleted = currentProgress?.isCompleted || false;

    // Get all lessons in order
    const allLessons = course.modules.flatMap((m) =>
        m.lessons.map((l) => ({ ...l, moduleTitle: m.title, moduleId: m.id }))
    );
    const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    // Get lesson index within current module
    const currentModule = course.modules.find(m => m.id === lesson.module.id);
    const lessonIndexInModule = currentModule?.lessons.findIndex(l => l.id === lesson.id) ?? 0;

    // Check if this is the last lesson in the current module
    const isLastLessonInModule = currentModule
        ? lessonIndexInModule === currentModule.lessons.length - 1
        : false;

    // Check if the current module has a published quiz
    const moduleHasQuiz = currentModule?.quiz?.isPublished ?? false;

    // Convert progressMap for client component (can't pass Map directly)
    const progressMapForClient: Record<string, { isCompleted: boolean }> = {};
    progressMap.forEach((value, key) => {
        progressMapForClient[key] = { isCompleted: value.isCompleted };
    });

    return (
        <LessonPageV3
            lesson={{
                id: lesson.id,
                title: lesson.title,
                description: lesson.description,
                content: lesson.content,
                lessonType: lesson.lessonType,
                videoId: lesson.videoId,
                videoDuration: lesson.videoDuration,
            }}
            module={{
                id: lesson.module.id,
                title: lesson.module.title,
                order: lesson.module.order,
            }}
            course={{
                id: course.id,
                title: course.title,
                slug: course.slug,
                modules: course.modules.map((m) => ({
                    id: m.id,
                    title: m.title,
                    order: m.order,
                    lessons: m.lessons.map((l) => ({
                        id: l.id,
                        title: l.title,
                        description: l.description,
                        content: l.content,
                        lessonType: l.lessonType,
                        videoId: l.videoId,
                        videoDuration: l.videoDuration,
                        order: l.order,
                        isFreePreview: l.isFreePreview,
                    })),
                })),
                coach: course.coach
                    ? {
                        id: course.coach.id,
                        firstName: course.coach.firstName,
                        lastName: course.coach.lastName,
                        avatar: course.coach.avatar,
                    }
                    : null,
            }}
            progress={{
                isCompleted,
                moduleProgress,
                courseProgress,
                lessonIndex: currentIndex,
                totalLessons,
                lessonIndexInModule,
            }}
            navigation={{
                prevLesson: prevLesson
                    ? { id: prevLesson.id, title: prevLesson.title }
                    : null,
                nextLesson: nextLesson
                    ? { id: nextLesson.id, title: nextLesson.title }
                    : null,
                isLastLessonInModule,
                moduleHasQuiz,
            }}
            userStreak={
                userStreak
                    ? {
                        currentStreak: userStreak.currentStreak,
                        longestStreak: userStreak.longestStreak,
                    }
                    : null
            }
            progressMap={progressMapForClient}
        />
    );
}
