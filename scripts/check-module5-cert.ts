import prisma from '../src/lib/prisma';

async function check() {
  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: 'admin@accredipro-certificate.com' },
    select: { id: true, firstName: true, lastName: true }
  });
  console.log('User:', user);

  if (!user) {
    console.log('User not found');
    return;
  }

  // Check quiz attempts
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id },
    include: {
      quiz: {
        include: {
          module: true
        }
      }
    },
    orderBy: { completedAt: 'desc' },
    take: 10
  });
  console.log('\nRecent Quiz Attempts:');
  attempts.forEach(a => {
    console.log(`  - Quiz: ${a.quiz.title}, Module: ${a.quiz.module?.title} (order: ${a.quiz.module?.order}), Score: ${a.score}%, Passed: ${a.passed}, CompletedAt: ${a.completedAt}`);
  });

  // Check certificates
  const certs = await prisma.certificate.findMany({
    where: { userId: user.id },
    include: {
      module: true,
      course: true
    }
  });
  console.log('\nCertificates:');
  if (certs.length === 0) {
    console.log('  No certificates found');
  } else {
    certs.forEach(c => {
      console.log(`  - ${c.certificateNumber}: ${c.module?.title || c.course.title} (type: ${c.type}, moduleOrder: ${c.module?.order})`);
    });
  }

  // Check module progress
  const progress = await prisma.moduleProgress.findMany({
    where: { userId: user.id, isCompleted: true },
    include: { module: true },
    orderBy: { completedAt: 'desc' },
    take: 10
  });
  console.log('\nCompleted Modules:');
  if (progress.length === 0) {
    console.log('  No completed modules found');
  } else {
    progress.forEach(p => {
      console.log(`  - ${p.module.title} (order: ${p.module.order})`);
    });
  }

  // Check if Module 5 exists and has a quiz
  const module5 = await prisma.module.findFirst({
    where: { order: 5 },
    include: {
      quiz: true,
      course: true
    }
  });
  console.log('\nModule 5 Info:');
  if (module5) {
    console.log(`  Title: ${module5.title}`);
    console.log(`  Course: ${module5.course.title}`);
    console.log(`  Has Quiz: ${module5.quiz ? 'Yes' : 'No'}`);
    if (module5.quiz) {
      console.log(`  Quiz ID: ${module5.quiz.id}`);
    }
  } else {
    console.log('  Module 5 not found');
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
