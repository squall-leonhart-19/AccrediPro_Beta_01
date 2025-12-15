import prisma from '../src/lib/prisma';

async function createCerts() {
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

  console.log('Creating certificates...\n');

  for (const attempt of passedAttempts) {
    const module = attempt.quiz.module;
    if (!module) continue;

    // Skip Module 0
    if (module.order === 0) {
      console.log(`Skipping Module 0: ${module.title}`);
      continue;
    }

    // Check if certificate already exists
    const existing = await prisma.certificate.findFirst({
      where: {
        userId: user.id,
        moduleId: module.id
      }
    });

    if (existing) {
      console.log(`Certificate already exists for: ${module.title}`);
      continue;
    }

    // Generate certificate number
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const certificateNumber = `MD-${timestamp}-${random}`;

    try {
      const cert = await prisma.certificate.create({
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
      console.error(`Error creating certificate for ${module.title}:`, error.message);
      console.error('Error code:', error.code);
    }
  }

  console.log('\nDone! Verifying...');

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

createCerts().catch(console.error).finally(() => prisma.$disconnect());
