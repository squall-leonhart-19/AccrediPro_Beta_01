import prisma from "../src/lib/prisma";

async function resetMiniDiplomaProgress() {
  // Find admin user
  const user = await prisma.user.findFirst({
    where: {
      email: "admin@accredipro-certificate.com",
    },
    select: { id: true, email: true, firstName: true },
  });

  if (!user) {
    console.log("Admin user not found");
    process.exit(1);
  }

  console.log(`Found user: ${user.firstName} (${user.email})`);

  // Find the mini diploma course
  const miniDiplomaCourse = await prisma.course.findFirst({
    where: {
      certificateType: "MINI_DIPLOMA",
    },
    include: {
      modules: {
        include: {
          lessons: true,
          quiz: true,
        },
      },
    },
  });

  if (!miniDiplomaCourse) {
    console.log("No mini diploma course found");
    process.exit(1);
  }

  console.log(`Found course: ${miniDiplomaCourse.title}`);

  const moduleIds = miniDiplomaCourse.modules.map((m) => m.id);
  const lessonIds = miniDiplomaCourse.modules.flatMap((m) =>
    m.lessons.map((l) => l.id)
  );
  const quizIds = miniDiplomaCourse.modules
    .filter((m) => m.quiz)
    .map((m) => m.quiz!.id);

  console.log(
    `Found ${moduleIds.length} modules, ${lessonIds.length} lessons, ${quizIds.length} quizzes`
  );

  // Delete quiz attempts
  const deletedAttempts = await prisma.quizAttempt.deleteMany({
    where: {
      userId: user.id,
      quizId: { in: quizIds },
    },
  });
  console.log(`Deleted ${deletedAttempts.count} quiz attempts`);

  // Delete quiz progress
  try {
    const deletedQuizProgress = await prisma.quizProgress.deleteMany({
      where: {
        userId: user.id,
        quizId: { in: quizIds },
      },
    });
    console.log(`Deleted ${deletedQuizProgress.count} quiz progress records`);
  } catch {
    console.log("QuizProgress table may not exist - skipping");
  }

  // Delete lesson progress
  const deletedLessonProgress = await prisma.lessonProgress.deleteMany({
    where: {
      userId: user.id,
      lessonId: { in: lessonIds },
    },
  });
  console.log(`Deleted ${deletedLessonProgress.count} lesson progress records`);

  // Delete module progress
  const deletedModuleProgress = await prisma.moduleProgress.deleteMany({
    where: {
      userId: user.id,
      moduleId: { in: moduleIds },
    },
  });
  console.log(`Deleted ${deletedModuleProgress.count} module progress records`);

  // Delete certificates
  const deletedCertificates = await prisma.certificate.deleteMany({
    where: {
      userId: user.id,
      courseId: miniDiplomaCourse.id,
    },
  });
  console.log(`Deleted ${deletedCertificates.count} certificates`);

  // Reset user mini diploma completion
  await prisma.user.update({
    where: { id: user.id },
    data: {
      miniDiplomaCompletedAt: null,
    },
  });
  console.log("Reset user miniDiplomaCompletedAt");

  // Delete notifications related to this course
  const deletedNotifications = await prisma.notification.deleteMany({
    where: {
      userId: user.id,
      OR: [
        { type: "MODULE_COMPLETE" },
        { type: "CERTIFICATE_EARNED" },
      ],
    },
  });
  console.log(`Deleted ${deletedNotifications.count} notifications`);

  console.log("\n✓ Mini diploma progress reset complete!");
  console.log("You can now start the mini diploma fresh.");
}

resetMiniDiplomaProgress()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
