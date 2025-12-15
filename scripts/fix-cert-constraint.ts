import prisma from '../src/lib/prisma';

async function fixConstraint() {
  console.log('Fixing Certificate table constraint...\n');

  try {
    // First, list existing constraints
    const constraints = await prisma.$queryRaw`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints
      WHERE table_name = 'Certificate' AND constraint_type = 'UNIQUE';
    `;
    console.log('Current UNIQUE constraints:', constraints);

    // Drop the old constraint if it exists (userId, courseId)
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Certificate" DROP CONSTRAINT IF EXISTS "Certificate_userId_courseId_key";
      `;
      console.log('Dropped old constraint: Certificate_userId_courseId_key');
    } catch (e: any) {
      console.log('Old constraint not found or already dropped');
    }

    // Check if the correct constraint exists
    const newConstraint = await prisma.$queryRaw`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'Certificate'
      AND constraint_name = 'Certificate_userId_courseId_moduleId_key';
    ` as any[];

    if (newConstraint.length === 0) {
      // Create the correct constraint
      await prisma.$executeRaw`
        ALTER TABLE "Certificate"
        ADD CONSTRAINT "Certificate_userId_courseId_moduleId_key"
        UNIQUE ("userId", "courseId", "moduleId");
      `;
      console.log('Created new constraint: Certificate_userId_courseId_moduleId_key');
    } else {
      console.log('Correct constraint already exists');
    }

    // Verify the fix
    const finalConstraints = await prisma.$queryRaw`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints
      WHERE table_name = 'Certificate' AND constraint_type = 'UNIQUE';
    `;
    console.log('\nFinal UNIQUE constraints:', finalConstraints);

    console.log('\nConstraint fix complete!');
  } catch (error) {
    console.error('Error:', error);
  }
}

fixConstraint().catch(console.error).finally(() => prisma.$disconnect());
