import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { QuizClient } from "@/components/courses/quiz-client";

async function getQuizData(moduleId: string, userId: string) {
  const [module, user] = await Promise.all([
    prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            coach: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            modules: {
              where: { isPublished: true },
              select: { id: true, order: true },
              orderBy: { order: "asc" },
            },
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
        lessons: {
          where: { isPublished: true },
          select: { id: true },
        },
      },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true },
    }),
  ]);

  if (!module || !module.quiz) return null;

  // Check if user has completed all lessons in this module
  const lessonIds = module.lessons.map((l) => l.id);
  const completedLessons = await prisma.lessonProgress.count({
    where: {
      userId,
      lessonId: { in: lessonIds },
      isCompleted: true,
    },
  });

  const allLessonsCompleted = completedLessons >= lessonIds.length;

  // Get previous attempts
  const previousAttempts = await prisma.quizAttempt.findMany({
    where: {
      userId,
      quizId: module.quiz.id,
    },
    orderBy: { startedAt: "desc" },
    take: 5,
  });

  // Get saved progress (if any) - wrapped in try/catch in case table doesn't exist yet
  let savedProgress: { responses: unknown; currentQuestion: number } | null = null;
  try {
    const progress = await prisma.quizProgress.findUnique({
      where: {
        userId_quizId: {
          userId,
          quizId: module.quiz.id,
        },
      },
    });
    if (progress) {
      savedProgress = {
        responses: progress.responses,
        currentQuestion: progress.currentQuestion,
      };
    }
  } catch {
    // QuizProgress table may not exist yet - ignore
  }

  // Check if user can take quiz
  const maxAttempts = module.quiz.maxAttempts;
  const attemptsUsed = previousAttempts.length;
  const canTakeQuiz =
    allLessonsCompleted && (!maxAttempts || attemptsUsed < maxAttempts);

  // Check if user has passed
  const hasPassed = previousAttempts.some((a) => a.passed);

  // Determine if this is the final exam (last module in course)
  const allModules = module.course.modules;
  const maxOrder = Math.max(...allModules.map((m) => m.order));
  const isFinalExam = module.order === maxOrder;

  // Get student name
  const studentName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student"
    : "Student";

  return {
    module: {
      id: module.id,
      title: module.title,
    },
    course: {
      id: module.course.id,
      title: module.course.title,
      slug: module.course.slug,
      coach: module.course.coach ? {
        id: module.course.coach.id,
        firstName: module.course.coach.firstName || "",
        lastName: module.course.coach.lastName || "",
        avatar: module.course.coach.avatar || undefined,
      } : undefined,
    },
    quiz: {
      id: module.quiz.id,
      title: module.quiz.title,
      description: module.quiz.description || undefined,
      passingScore: module.quiz.passingScore,
      maxAttempts: module.quiz.maxAttempts || undefined,
      timeLimit: module.quiz.timeLimit || undefined,
      isRequired: module.quiz.isRequired,
      showCorrectAnswers: module.quiz.showCorrectAnswers,
      // Remove correct answers from client response if not showing
      questions: module.quiz.questions.map((q) => ({
        id: q.id,
        question: q.question,
        explanation: q.explanation || undefined,
        questionType: q.questionType,
        order: q.order,
        points: q.points,
        answers: q.answers.map((a) => ({
          id: a.id,
          answer: a.answer,
          order: a.order,
          // Only include isCorrect if showing answers after submission
        })),
      })),
    },
    studentName,
    isFinalExam,
    allLessonsCompleted,
    canTakeQuiz,
    hasPassed,
    attemptsUsed,
    previousAttempts: previousAttempts.map((a) => ({
      id: a.id,
      score: a.score,
      passed: a.passed,
      completedAt: a.completedAt,
    })),
    savedProgress: savedProgress
      ? {
          responses: savedProgress.responses as Record<string, string[]>,
          currentQuestion: savedProgress.currentQuestion,
        }
      : undefined,
  };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string; moduleId: string }>;
}) {
  const { slug, moduleId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const quizData = await getQuizData(moduleId, session.user.id);

  if (!quizData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <QuizClient
        quiz={quizData.quiz}
        module={quizData.module}
        course={quizData.course}
        studentName={quizData.studentName}
        allLessonsCompleted={quizData.allLessonsCompleted}
        canTakeQuiz={quizData.canTakeQuiz}
        hasPassed={quizData.hasPassed}
        attemptsUsed={quizData.attemptsUsed}
        previousAttempts={quizData.previousAttempts}
        savedProgress={quizData.savedProgress}
        isFinalExam={quizData.isFinalExam}
      />
    </div>
  );
}
