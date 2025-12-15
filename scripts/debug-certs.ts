import prisma from '../src/lib/prisma';

async function debug() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@accredipro-certificate.com' },
    select: { id: true }
  });

  if (!user) {
    console.log('User not found');
    return;
  }

  console.log('User ID:', user.id);

  // Get all certificates for this user without any filters
  const allCerts = await prisma.certificate.findMany({
    where: { userId: user.id }
  });
  console.log('\nAll certificates (raw):', allCerts.length);
  allCerts.forEach(c => {
    console.log(`  ${c.id}: moduleId=${c.moduleId}, courseId=${c.courseId}, type=${c.type}`);
  });

  // Try to find Module 1 certificate specifically
  const module1 = await prisma.module.findFirst({
    where: { order: 1 }
  });

  if (module1) {
    console.log('\nModule 1 ID:', module1.id);

    const cert1 = await prisma.certificate.findFirst({
      where: {
        userId: user.id,
        moduleId: module1.id
      }
    });
    console.log('Module 1 certificate:', cert1);

    // Check if constraint would fail
    const existingCheck = await prisma.certificate.findFirst({
      where: {
        userId: user.id,
        courseId: module1.courseId,
        moduleId: module1.id
      }
    });
    console.log('Existing check result:', existingCheck);
  }

  // Let's see the raw count
  const count = await prisma.certificate.count({
    where: { userId: user.id }
  });
  console.log('\nTotal certificate count for user:', count);
}

debug().catch(console.error).finally(() => prisma.$disconnect());
