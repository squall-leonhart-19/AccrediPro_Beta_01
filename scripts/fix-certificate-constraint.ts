import prisma from "../src/lib/prisma";

async function main() {
  console.log("Step 1: Checking existing unique constraints on Certificate table...");

  try {
    const constraints = await prisma.$queryRaw<{ conname: string }[]>`
      SELECT conname
      FROM pg_constraint
      WHERE conrelid = 'public."Certificate"'::regclass
      AND contype = 'u'
    `;
    console.log("Current unique constraints:", constraints);

    // Step 2: Check for duplicate rows that would violate the new constraint
    console.log("\nStep 2: Checking for potential duplicate rows...");
    const duplicates = await prisma.$queryRaw<{ userId: string; courseId: string; moduleId: string | null; count: bigint }[]>`
      SELECT "userId", "courseId", "moduleId", COUNT(*) as count
      FROM public."Certificate"
      GROUP BY "userId", "courseId", "moduleId"
      HAVING COUNT(*) > 1
    `;

    if (duplicates.length > 0) {
      console.log("WARNING: Found duplicate rows that would violate the new constraint:", duplicates);
      console.log("Please resolve these duplicates before proceeding.");
      return;
    }
    console.log("No duplicates found. Safe to proceed.");

    // Step 3: Drop old constraint if it exists (userId, courseId only)
    const oldConstraint = constraints.find(c =>
      c.conname === 'Certificate_userId_courseId_key' ||
      c.conname.includes('userId_courseId') && !c.conname.includes('moduleId')
    );

    if (oldConstraint) {
      console.log(`\nStep 3: Dropping old constraint: ${oldConstraint.conname}`);
      await prisma.$executeRawUnsafe(`ALTER TABLE public."Certificate" DROP CONSTRAINT IF EXISTS "${oldConstraint.conname}"`);
      console.log("Old constraint dropped successfully.");
    } else {
      console.log("\nStep 3: No old (userId, courseId) constraint found to drop.");
    }

    // Step 4: Check if new constraint already exists
    const newConstraintExists = constraints.find(c => c.conname === 'Certificate_userId_courseId_moduleId_key');

    if (!newConstraintExists) {
      console.log("\nStep 4: Creating new unique constraint (userId, courseId, moduleId)...");
      await prisma.$executeRaw`
        ALTER TABLE public."Certificate"
        ADD CONSTRAINT "Certificate_userId_courseId_moduleId_key"
        UNIQUE ("userId", "courseId", "moduleId")
      `;
      console.log("New constraint created successfully.");
    } else {
      console.log("\nStep 4: New constraint already exists.");
    }

    // Step 5: Verify final state
    console.log("\nStep 5: Verifying final constraints...");
    const finalConstraints = await prisma.$queryRaw<{ conname: string }[]>`
      SELECT conname
      FROM pg_constraint
      WHERE conrelid = 'public."Certificate"'::regclass
      AND contype = 'u'
    `;
    console.log("Final unique constraints:", finalConstraints);

    console.log("\n✅ Database constraint update complete!");

  } catch (error) {
    console.error("Error:", error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
