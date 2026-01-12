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
              title: true,
              description: true,
              passingScore: true,
              maxAttempts: true,
              timeLimit: true,
              isRequired: true,
              showCorrectAnswers: true,
              questions: {
                orderBy: { order: "asc" },
                select: {
                  id: true,
                  question: true,
                  explanation: true,
                  questionType: true,
                  order: true,
                  points: true,
                  answers: {
                    orderBy: { order: "asc" },
                    select: {
                      id: true,
                      answer: true,
                      order: true,
                      isCorrect: true,
                    },
                  },
                },
              },
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

async function getQuizAttempts(userId: string, quizId: string) {
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId, quizId },
    select: {
      id: true,
      score: true,
      passed: true,
    },
    orderBy: { id: "desc" },
  });
  const hasPassed = attempts.some(a => a.passed);
  return { attempts, hasPassed };
}

export default async function LearningPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonId: string }>;
}) {
  // Note: The route params are named 'courseSlug' and 'lessonId' based on folder structure
  const { courseSlug, lessonId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const lesson = await getLesson(lessonId);

  if (!lesson) notFound();

  const course = lesson.module.course;
  const enrollment = await getEnrollment(session.user.id, course.id);

  // Check access - Admin/Instructor/Mentor bypass enrollment requirement
  const userRole = session.user.role as string;
  const isStaff = ["ADMIN", "INSTRUCTOR", "MENTOR"].includes(userRole);

  if (!enrollment && !lesson.isFreePreview && !isStaff) {
    redirect(`/courses/${courseSlug}`);
  }

  // Get lesson index within current module (need this early for quiz check)
  const currentModule = course.modules.find(m => m.id === lesson.module.id);
  const lessonIndexInModule = currentModule?.lessons.findIndex(l => l.id === lesson.id) ?? 0;

  // Check if this is the last lesson in the current module
  const isLastLessonInModule = currentModule
    ? lessonIndexInModule === currentModule.lessons.length - 1
    : false;

  // Check if the current module has a published quiz
  const moduleHasQuiz = currentModule?.quiz?.isPublished ?? false;
  const moduleQuiz = moduleHasQuiz && currentModule?.quiz ? currentModule.quiz : null;

  // Fetch progress, streak, and quiz attempts in parallel
  const [progressData, userStreak, quizData] = await Promise.all([
    getLessonProgress(session.user.id, course.id, lesson.module.id),
    getUserStreak(session.user.id),
    moduleQuiz && isLastLessonInModule
      ? getQuizAttempts(session.user.id, moduleQuiz.id)
      : Promise.resolve({ attempts: [], hasPassed: false }),
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

  // Get next module info for quiz navigation
  const currentModuleIndex = course.modules.findIndex(m => m.id === lesson.module.id);
  const nextModule = currentModuleIndex < course.modules.length - 1
    ? course.modules[currentModuleIndex + 1]
    : null;

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
        quizId: moduleHasQuiz ? currentModule?.quiz?.id : undefined,
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
      quizData={moduleQuiz && isLastLessonInModule && moduleQuiz.questions && moduleQuiz.questions.length > 0 ? {
        quiz: {
          id: moduleQuiz.id,
          title: moduleQuiz.title || "Module Quiz",
          description: moduleQuiz.description ?? undefined,
          passingScore: moduleQuiz.passingScore,
          maxAttempts: moduleQuiz.maxAttempts ?? undefined,
          timeLimit: moduleQuiz.timeLimit ?? undefined,
          isRequired: moduleQuiz.isRequired,
          showCorrectAnswers: moduleQuiz.showCorrectAnswers,
          questions: moduleQuiz.questions.map(q => ({
            id: q.id,
            question: q.question,
            explanation: q.explanation ?? undefined,
            questionType: q.questionType as "MULTIPLE_CHOICE" | "MULTI_SELECT" | "TRUE_FALSE",
            order: q.order,
            points: q.points,
            answers: q.answers.map(a => ({
              id: a.id,
              answer: a.answer,
              order: a.order,
              isCorrect: a.isCorrect ?? false,
            })),
          })),
        },
        hasPassed: quizData.hasPassed,
        previousAttempts: quizData.attempts,
        nextModule: nextModule ? {
          id: nextModule.id,
          title: nextModule.title,
          firstLessonId: nextModule.lessons[0]?.id || "",
        } : undefined,
      } : undefined}
    />
  );
}
