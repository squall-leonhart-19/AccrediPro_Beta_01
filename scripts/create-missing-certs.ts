import prisma from '../src/lib/prisma';

async function createMissingCerts() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@accredipro-certificate.com' },
    select: { id: true }
  });

  if (!user) {
    console.log('User not found');
    return;
  }

  // Get all completed modules with quiz attempts that passed
  const passedAttempts = await prisma.quizAttempt.findMany({
    where: {
      userId: user.id,
      passed: true
    },
    include: {
      quiz: {
        include: {
          module: {
            include: {
              course: true
            }
          }
        }
      }
    },
    orderBy: { completedAt: 'asc' }
  });

  // Get existing certificates
  const existingCerts = await prisma.certificate.findMany({
    where: { userId: user.id },
    select: { moduleId: true, courseId: true }
  });

  const existingModuleIds = new Set(existingCerts.filter(c => c.moduleId).map(c => c.moduleId));

  console.log('Creating missing certificates...\n');

  for (const attempt of passedAttempts) {
    const module = attempt.quiz.module;
    if (!module) continue;

    // Skip Module 0
    if (module.order === 0) {
      console.log(`Skipping Module 0: ${module.title}`);
      continue;
    }

    // Skip if certificate already exists
    if (existingModuleIds.has(module.id)) {
      console.log(`Certificate already exists for: ${module.title}`);
      continue;
    }

    // Generate certificate number
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const certificateNumber = `MD-${timestamp}-${random}`;

    try {
      await prisma.certificate.create({
        data: {
          certificateNumber,
          userId: user.id,
          courseId: module.courseId,
          moduleId: module.id,
          type: 'MINI_DIPLOMA',
          score: attempt.score,
        }
      });
      console.log(`✓ Created certificate for: ${module.title} (${certificateNumber})`);
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`Certificate already exists (constraint) for: ${module.title}`);
      } else {
        console.error(`Error creating certificate for ${module.title}:`, error);
      }
    }
  }

  console.log('\nDone!');

  // Show all certificates
  const allCerts = await prisma.certificate.findMany({
    where: { userId: user.id },
    include: { module: true },
    orderBy: { issuedAt: 'asc' }
  });
  console.log('\nAll Certificates:');
  allCerts.forEach(c => {
    console.log(`  - ${c.certificateNumber}: ${c.module?.title || 'Course Certificate'} (order: ${c.module?.order})`);
  });
}

createMissingCerts().catch(console.error).finally(() => prisma.$disconnect());
