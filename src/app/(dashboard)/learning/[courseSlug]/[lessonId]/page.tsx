import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { LearningClient } from "@/components/learning/learning-client";

interface LearningPageProps {
  params: Promise<{
    courseSlug: string;
    lessonId: string;
  }>;
}

async function getLessonData(userId: string, courseSlug: string, lessonId: string) {
  // Get course with all modules and lessons
  const course = await prisma.course.findFirst({
    where: { slug: courseSlug },
    select: {
      id: true,
      title: true,
      slug: true,
      certificateType: true,
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              order: true,
              videoDuration: true,
              lessonType: true,
              isFreePreview: true,
            },
          },
          quiz: {
            include: {
              questions: {
                orderBy: { order: "asc" },
                include: {
                  answers: {
                    orderBy: { order: "asc" },
                  },
                },
              },
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
  });

  if (!course) return null;

  // Get the current lesson with full content
  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      lessonType: true,
      videoId: true,
      videoDuration: true,
      isFreePreview: true,
      resources: true,
      module: {
        select: {
          id: true,
          title: true,
          order: true,
        },
      },
    },
  });

  if (!lesson) return null;

  // Verify lesson belongs to the course
  const moduleIds = course.modules.map((m) => m.id);
  if (!moduleIds.includes(lesson.module.id)) return null;

  // Check enrollment
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId, courseId: course.id },
  });

  // If not enrolled and not a free preview lesson, deny access
  if (!enrollment && !lesson.isFreePreview) return null;

  // Get all lesson IDs for this course
  const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));

  // Get all progress for this user for lessons in this course
  const progress = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lessonId: { in: allLessonIds }
    },
    select: {
      lessonId: true,
      isCompleted: true,
      watchTime: true,
      lastPosition: true,
    },
  });

  const progressMap: Record<string, { isCompleted: boolean; watchTime?: number; lastPosition?: number }> = {};
  progress.forEach((p) => {
    progressMap[p.lessonId] = {
      isCompleted: p.isCompleted,
      watchTime: p.watchTime || undefined,
      lastPosition: p.lastPosition || undefined,
    };
  });

  // Get user streak
  const userStreak = await prisma.userStreak.findUnique({
    where: { userId },
    select: { currentStreak: true, longestStreak: true },
  });

  // Get quiz attempts for current module's quiz
  const currentModule = course.modules.find((m) => m.id === lesson.module.id);
  let quizAttempts: { id: string; score: number; passed: boolean }[] = [];
  let hasPassed = false;

  if (currentModule?.quiz) {
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId, quizId: currentModule.quiz.id },
      orderBy: { completedAt: "desc" },
      select: { id: true, score: true, passed: true },
    });
    quizAttempts = attempts;
    hasPassed = attempts.some((a) => a.passed);
  }

  // Calculate navigation
  const allLessons = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleId: m.id }))
  );
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Check if this is the last lesson in current module
  const lessonsInCurrentModule = currentModule?.lessons || [];
  const indexInModule = lessonsInCurrentModule.findIndex((l) => l.id === lessonId);
  const isLastLessonInModule = indexInModule === lessonsInCurrentModule.length - 1;

  // Calculate progress stats
  const totalLessons = allLessons.length;
  const completedLessons = Object.values(progressMap).filter((p) => p.isCompleted).length;
  const moduleLessons = lessonsInCurrentModule.length;
  const moduleCompleted = lessonsInCurrentModule.filter((l) => progressMap[l.id]?.isCompleted).length;

  // Get next module info if exists
  const currentModuleIndex = course.modules.findIndex((m) => m.id === lesson.module.id);
  const nextModule = course.modules[currentModuleIndex + 1];
  let nextModuleInfo: { id: string; title: string; firstLessonId: string } | null = null;
  if (nextModule && nextModule.lessons.length > 0) {
    nextModuleInfo = {
      id: nextModule.id,
      title: nextModule.title,
      firstLessonId: nextModule.lessons[0]?.id,
    };
  }

  return {
    lesson: {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      lessonType: lesson.lessonType,
      videoId: lesson.videoId,
      videoDuration: lesson.videoDuration,
      resources: lesson.resources,
    },
    module: {
      id: lesson.module.id,
      title: lesson.module.title,
      order: lesson.module.order,
      quiz: currentModule?.quiz || null,
    },
    course: {
      id: course.id,
      title: course.title,
      slug: course.slug,
      certificateType: course.certificateType,
      modules: course.modules,
      coach: course.coach ? {
        id: course.coach.id,
        firstName: course.coach.firstName,
        lastName: course.coach.lastName,
        image: course.coach.avatar,
      } : null,
    },
    progress: {
      isCompleted: progressMap[lessonId]?.isCompleted || false,
      watchTime: progressMap[lessonId]?.watchTime || 0,
      lastPosition: progressMap[lessonId]?.lastPosition || 0,
      moduleProgress: { total: moduleLessons, completed: moduleCompleted },
      courseProgress: { total: totalLessons, completed: completedLessons },
      lessonIndex: currentIndex,
      totalLessons,
      lessonIndexInModule: indexInModule,
    },
    navigation: {
      prevLesson: prevLesson ? { id: prevLesson.id, title: prevLesson.title } : null,
      nextLesson: nextLesson ? { id: nextLesson.id, title: nextLesson.title, moduleId: nextLesson.moduleId } : null,
      isLastLessonInModule,
      moduleHasQuiz: !!currentModule?.quiz,
    },
    userStreak,
    progressMap,
    quiz: currentModule?.quiz || null,
    quizAttempts,
    hasPassed,
    nextModule: nextModuleInfo,
  };
}

export default async function LearningPage({ params }: LearningPageProps) {
  const { courseSlug, lessonId } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const data = await getLessonData(session.user.id, courseSlug, lessonId);

  if (!data) {
    notFound();
  }

  // For mini diploma courses, get urgency and social proof data
  let miniDiplomaData = null;
  if (data.course.certificateType === "MINI_DIPLOMA") {
    // Get user's optin date for countdown
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { miniDiplomaOptinAt: true },
    });

    // Get total graduates count (users who completed mini diploma)
    const graduatesCount = await prisma.user.count({
      where: {
        miniDiplomaCompletedAt: { not: null },
        isFakeProfile: false,
      },
    });

    miniDiplomaData = {
      optinAt: user?.miniDiplomaOptinAt?.toISOString() || null,
      graduatesCount: graduatesCount + 1700, // Base + real count
    };
  }

  return (
    <LearningClient
      lesson={data.lesson}
      module={data.module as any}
      course={data.course as any}
      progress={data.progress}
      navigation={data.navigation}
      userStreak={data.userStreak}
      progressMap={data.progressMap}
      quiz={data.quiz as any}
      quizAttempts={data.quizAttempts}
      hasPassed={data.hasPassed}
      nextModule={data.nextModule}
      miniDiplomaData={miniDiplomaData}
    />
  );
}
