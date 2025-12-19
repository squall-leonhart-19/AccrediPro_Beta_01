import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MasterclassLocked } from "./masterclass-locked";
import { MasterclassUnlocked } from "./masterclass-unlocked";

export const dynamic = "force-dynamic";

async function getMasterclassAccess(userId: string) {
  // Check if user has completed the Mini Diploma
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      course: { slug: "fm-mini-diploma" },
    },
    select: {
      status: true,
      progress: true,
      completedAt: true,
    },
  });

  // Also check user's miniDiplomaCompletedAt field
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      miniDiplomaCompletedAt: true,
    },
  });

  const isUnlocked =
    enrollment?.status === "COMPLETED" ||
    enrollment?.progress === 100 ||
    user?.miniDiplomaCompletedAt !== null;

  // Get Mini Diploma progress for locked state
  let miniDiplomaProgress = 0;
  let completedLessons = 0;
  let totalLessons = 9;

  if (!isUnlocked && enrollment) {
    // Get actual lesson progress
    const course = await prisma.course.findFirst({
      where: { slug: "fm-mini-diploma" },
      include: {
        modules: {
          include: {
            lessons: { where: { isPublished: true } },
          },
        },
      },
    });

    if (course) {
      const allLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
      totalLessons = allLessonIds.length;

      const progress = await prisma.lessonProgress.findMany({
        where: {
          userId,
          lessonId: { in: allLessonIds },
          isCompleted: true,
        },
      });

      completedLessons = progress.length;
      miniDiplomaProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    }
  }

  return {
    isUnlocked,
    firstName: user?.firstName || "there",
    miniDiplomaProgress,
    completedLessons,
    totalLessons,
  };
}

export default async function MasterclassPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { isUnlocked, firstName, miniDiplomaProgress, completedLessons, totalLessons } =
    await getMasterclassAccess(session.user.id);

  if (isUnlocked) {
    return <MasterclassUnlocked firstName={firstName} />;
  }

  return (
    <MasterclassLocked
      firstName={firstName}
      progress={miniDiplomaProgress}
      completedLessons={completedLessons}
      totalLessons={totalLessons}
    />
  );
}
