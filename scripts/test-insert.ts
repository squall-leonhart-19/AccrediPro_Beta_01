import prisma from '../src/lib/prisma';

async function testInsert() {
  const userId = 'cmj3ni94n0000436vi9m6iyyy';
  const courseId = 'cmj44v05f00000i6vihj6l5a7';

  // Get Module 1 ID
  const module1 = await prisma.module.findFirst({
    where: { order: 1 }
  });

  if (!module1) {
    console.log('Module 1 not found');
    return;
  }

  console.log('Module 1 ID:', module1.id);
  console.log('Attempting to insert...');

  try {
    const result = await prisma.$executeRaw`
      INSERT INTO "Certificate" (id, "certificateNumber", "userId", "courseId", "moduleId", type, "issuedAt")
      VALUES (
        'test-cert-1234',
        'MD-TEST-1234',
        ${userId},
        ${courseId},
        ${module1.id},
        'MINI_DIPLOMA',
        NOW()
      )
    `;
    console.log('Insert result:', result);
  } catch (error: any) {
    console.error('Insert error:', error.message);
    console.error('Error code:', error.code);
  }

  // Check if it was inserted
  const check = await prisma.$queryRaw`
    SELECT * FROM "Certificate" WHERE "certificateNumber" = 'MD-TEST-1234'
  `;
  console.log('Check result:', check);
}

testInsert().catch(console.error).finally(() => prisma.$disconnect());
