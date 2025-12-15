import prisma from '../src/lib/prisma';

async function check() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@accredipro-certificate.com' },
    select: { id: true }
  });

  if (!user) {
    console.log('User not found');
    return;
  }

  // Check lesson progress for Module 5
  const module5 = await prisma.module.findFirst({
    where: { order: 5 },
    include: {
      lessons: {
        orderBy: { order: 'asc' }
      },
      course: true
    }
  });

  if (!module5) {
    console.log('Module 5 not found');
    return;
  }

  console.log(`\nModule 5: ${module5.title}`);
  console.log(`Total lessons: ${module5.lessons.length}`);

  // Check lesson progress
  const lessonProgress = await prisma.lessonProgress.findMany({
    where: {
      lessonId: { in: module5.lessons.map(l => l.id) },
      userId: user.id
    },
    include: { lesson: true }
  });

  console.log('\nLesson Progress:');
  module5.lessons.forEach(lesson => {
    const progress = lessonProgress.find(p => p.lessonId === lesson.id);
    console.log(`  ${lesson.order}. ${lesson.title}: ${progress?.isCompleted ? '✓ Completed' : '✗ Not completed'}`);
  });

  // Check module progress
  const moduleProgress = await prisma.moduleProgress.findUnique({
    where: {
      userId_moduleId: {
        userId: user.id,
        moduleId: module5.id
      }
    }
  });
  console.log(`\nModule Progress: ${moduleProgress?.isCompleted ? '✓ Completed' : '✗ Not completed'}`);

  // Check if quiz was attempted for Module 5
  const quizAttempt = await prisma.quizAttempt.findFirst({
    where: {
      userId: user.id,
      quiz: {
        moduleId: module5.id
      }
    },
    include: {
      quiz: true
    },
    orderBy: { completedAt: 'desc' }
  });
  console.log(`\nQuiz Attempt: ${quizAttempt ? `Yes - Score: ${quizAttempt.score}%, Passed: ${quizAttempt.passed}` : 'No attempt found'}`);
}

check().catch(console.error).finally(() => prisma.$disconnect());
