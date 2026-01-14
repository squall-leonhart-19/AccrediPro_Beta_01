import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { LessonPlayer } from "@/components/courses/lesson-player";

async function getLesson(lessonId: string) {
  return prisma.lesson.findFirst({
    where: { id: lessonId, isPublished: true },
    include: {
      module: {
        include: {
          course: {
            include: {
              modules: {
                where: { isPublished: true },
                orderBy: { order: "asc" },
                include: {
                  lessons: {
                    where: { isPublished: true },
                    orderBy: { order: "asc" },
                    select: { id: true, title: true },
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
    },
  });
}

async function getEnrollment(userId: string, courseId: string) {
  return prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
}

async function getAllLessonProgress(userId: string, lessonIds: string[]) {
  const progress = await prisma.lessonProgress.findMany({
    where: { userId, lessonId: { in: lessonIds } },
    select: { lessonId: true, isCompleted: true },
  });
  const progressMap: Record<string, boolean> = {};
  for (const p of progress) {
    progressMap[p.lessonId] = p.isCompleted;
  }
  return progressMap;
}

export default async function LearningPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonId: string }>;
}) {
  const { courseSlug, lessonId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const lesson = await getLesson(lessonId);
  if (!lesson) notFound();

  const course = lesson.module.course;
  const enrollment = await getEnrollment(session.user.id, course.id);

  const userRole = session.user.role as string;
  const isStaff = ["ADMIN", "INSTRUCTOR", "MENTOR"].includes(userRole);

  if (!enrollment && !lesson.isFreePreview && !isStaff) {
    redirect(`/courses/${courseSlug}`);
  }

  // Get all lesson IDs for progress
  const allLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
  const progressMap = await getAllLessonProgress(session.user.id, allLessonIds);

  // Get all lessons in order for navigation
  const allLessons = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleTitle: m.title }))
  );
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <LessonPlayer
      lesson={{
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
      }}
      module={{
        id: lesson.module.id,
        title: lesson.module.title,
      }}
      course={{
        id: course.id,
        title: course.title,
        slug: course.slug,
        modules: course.modules.map(m => ({
          id: m.id,
          title: m.title,
          lessons: m.lessons.map(l => ({ id: l.id, title: l.title })),
        })),
        coach: course.coach ? {
          id: course.coach.id,
          firstName: course.coach.firstName,
          lastName: course.coach.lastName,
          avatar: course.coach.avatar,
        } : null,
      }}
      progress={{
        isCompleted: progressMap[lesson.id] || false,
      }}
      navigation={{
        prevLesson: prevLesson ? { id: prevLesson.id, title: prevLesson.title } : null,
        nextLesson: nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null,
      }}
      progressMap={progressMap}
    />
  );
}
