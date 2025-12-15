import prisma from '../src/lib/prisma';

async function dropConstraint() {
  console.log('Checking all constraints...\n');

  // Check ALL indexes (not just constraints)
  const indexes = await prisma.$queryRaw`
    SELECT indexname, indexdef
    FROM pg_indexes
    WHERE tablename = 'Certificate';
  `;
  console.log('All indexes on Certificate:');
  console.log(indexes);

  // Drop the old unique index/constraint
  console.log('\nDropping old constraint/index...');

  try {
    await prisma.$executeRaw`
      DROP INDEX IF EXISTS "Certificate_userId_courseId_key";
    `;
    console.log('Dropped index: Certificate_userId_courseId_key');
  } catch (e: any) {
    console.log('Could not drop as index:', e.message);
  }

  try {
    await prisma.$executeRaw`
      ALTER TABLE "Certificate" DROP CONSTRAINT IF EXISTS "Certificate_userId_courseId_key";
    `;
    console.log('Dropped constraint: Certificate_userId_courseId_key');
  } catch (e: any) {
    console.log('Could not drop as constraint:', e.message);
  }

  // Verify
  const indexesAfter = await prisma.$queryRaw`
    SELECT indexname, indexdef
    FROM pg_indexes
    WHERE tablename = 'Certificate';
  `;
  console.log('\nIndexes after cleanup:');
  console.log(indexesAfter);
}

dropConstraint().catch(console.error).finally(() => prisma.$disconnect());
