import prisma from '../src/lib/prisma';

async function rawCheck() {
  // Check all rows in Certificate table
  const certs = await prisma.$queryRaw`
    SELECT id, "certificateNumber", "userId", "courseId", "moduleId", type
    FROM "Certificate"
  `;
  console.log('All certificates (raw SQL):');
  console.log(certs);

  // Check actual constraint definition
  const constraintDef = await prisma.$queryRaw`
    SELECT pg_get_constraintdef(oid) as definition
    FROM pg_constraint
    WHERE conname = 'Certificate_userId_courseId_moduleId_key';
  `;
  console.log('\nConstraint definition:');
  console.log(constraintDef);

  // Check ALL constraints on Certificate table
  const allConstraints = await prisma.$queryRaw`
    SELECT conname, pg_get_constraintdef(oid) as definition
    FROM pg_constraint
    WHERE conrelid = 'public."Certificate"'::regclass;
  `;
  console.log('\nAll constraints on Certificate:');
  console.log(allConstraints);
}

rawCheck().catch(console.error).finally(() => prisma.$disconnect());
