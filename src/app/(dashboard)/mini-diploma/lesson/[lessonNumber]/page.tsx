import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { LessonContainer } from "./lesson-container";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ lessonNumber: string }>;
}

async function getEnrollmentAndLessons(userId: string) {
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      course: {
        slug: "fm-mini-diploma",
      },
    },
    include: {
      course: {
        include: {
          modules: {
            where: { isPublished: true },
            include: {
              lessons: {
                where: { isPublished: true },
                orderBy: { order: "asc" },
              },
            },
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  return enrollment;
}

async function getLessonProgress(userId: string, courseId: string) {
  const progress = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lesson: {
        module: {
          courseId,
        },
      },
    },
    select: {
      lessonId: true,
      isCompleted: true,
    },
  });

  return new Set(progress.filter((p) => p.isCompleted).map((p) => p.lessonId));
}

export default async function MiniDiplomaLessonPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { lessonNumber: lessonNumberParam } = await params;
  const lessonNumber = parseInt(lessonNumberParam, 10);

  if (isNaN(lessonNumber) || lessonNumber < 1 || lessonNumber > 9) {
    notFound();
  }

  const enrollment = await getEnrollmentAndLessons(session.user.id);

  if (!enrollment) {
    // User doesn't have mini diploma enrollment
    redirect("/dashboard");
  }

  // Get all lessons in order
  const allLessons = enrollment.course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      moduleId: module.id,
    }))
  );

  // Check if the requested lesson exists
  if (lessonNumber > allLessons.length) {
    notFound();
  }

  const currentLesson = allLessons[lessonNumber - 1];
  const completedLessonIds = await getLessonProgress(session.user.id, enrollment.courseId);

  // Test user bypasses sequential access requirement
  const isTestUser = session.user.email === "at.seed019@gmail.com";

  // Check if previous lessons are completed (lesson 1 is always accessible)
  // Test user can access any lesson
  if (lessonNumber > 1 && !isTestUser) {
    const previousLesson = allLessons[lessonNumber - 2];
    if (!completedLessonIds.has(previousLesson.id)) {
      // Previous lesson not completed, redirect to it
      redirect(`/mini-diploma/lesson/${lessonNumber - 1}`);
    }
  }

  const firstName = session.user.firstName || "Student";
  const isCompleted = completedLessonIds.has(currentLesson.id);

  return (
    <LessonContainer
      lessonNumber={lessonNumber}
      lessonId={currentLesson.id}
      firstName={firstName}
      isCompleted={isCompleted}
      userId={session.user.id}
      enrollmentId={enrollment.id}
      courseId={enrollment.courseId}
      moduleId={currentLesson.moduleId}
    />
  );
}
