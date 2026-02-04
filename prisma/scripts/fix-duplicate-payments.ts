/**
 * Fix Duplicate Payments & Misclassified PaymentTypes
 *
 * Run with: npx tsx prisma/scripts/fix-duplicate-payments.ts
 *
 * This script:
 * 1. Finds duplicate payments (same transactionId) and deletes extras
 * 2. Fixes paymentType on misclassified records (OTOs marked as FRONTEND)
 * 3. Shows before/after stats
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  PAYMENT CLEANUP SCRIPT");
  console.log("═══════════════════════════════════════════════════════\n");

  // ─── STEP 0: Before Stats ─────────────────────────────────────
  const beforeTotal = await prisma.payment.aggregate({
    where: { status: "COMPLETED" },
    _sum: { amount: true },
    _count: true,
  });
  const beforeFrontend = await prisma.payment.aggregate({
    where: { status: "COMPLETED", paymentType: "FRONTEND" },
    _sum: { amount: true },
    _count: true,
  });

  console.log("BEFORE CLEANUP:");
  console.log(`  Total records: ${beforeTotal._count}`);
  console.log(`  Total revenue: $${Number(beforeTotal._sum.amount || 0).toLocaleString()}`);
  console.log(`  Frontend orders: ${beforeFrontend._count}`);
  console.log(`  Frontend revenue: $${Number(beforeFrontend._sum.amount || 0).toLocaleString()}`);
  console.log("");

  // ─── STEP 1: Find & Remove Duplicate Payments ─────────────────
  console.log("STEP 1: Finding duplicate transactionIds...\n");

  // Get all payments with non-null transactionIds, ordered by createdAt
  const allPayments = await prisma.payment.findMany({
    where: {
      transactionId: { not: null },
      status: "COMPLETED",
    },
    orderBy: { createdAt: "asc" }, // Keep the FIRST one (oldest)
    select: {
      id: true,
      transactionId: true,
      amount: true,
      productName: true,
      paymentType: true,
      createdAt: true,
      billingEmail: true,
      billingName: true,
    },
  });

  // Group by transactionId
  const txMap = new Map<string, typeof allPayments>();
  for (const p of allPayments) {
    const txId = p.transactionId!;
    if (!txMap.has(txId)) {
      txMap.set(txId, []);
    }
    txMap.get(txId)!.push(p);
  }

  // Find duplicates
  const duplicateGroups = Array.from(txMap.entries()).filter(([, records]) => records.length > 1);

  let deletedCount = 0;
  let deletedRevenue = 0;
  const idsToDelete: string[] = [];

  if (duplicateGroups.length === 0) {
    console.log("  No duplicates found.\n");
  } else {
    console.log(`  Found ${duplicateGroups.length} duplicate transaction groups:\n`);

    for (const [txId, records] of duplicateGroups) {
      const keep = records[0]; // Keep the first (oldest)
      const dupes = records.slice(1); // Delete the rest

      console.log(`  TxID: ${txId}`);
      console.log(`    KEEP:   ${keep.id} | $${Number(keep.amount)} | ${keep.paymentType} | ${keep.productName} | ${keep.billingEmail}`);
      for (const dupe of dupes) {
        console.log(`    DELETE: ${dupe.id} | $${Number(dupe.amount)} | ${dupe.paymentType} | ${dupe.productName} | ${dupe.billingEmail}`);
        idsToDelete.push(dupe.id);
        deletedRevenue += Number(dupe.amount);
      }
      console.log("");
      deletedCount += dupes.length;
    }

    // Actually delete the duplicates
    if (idsToDelete.length > 0) {
      const result = await prisma.payment.deleteMany({
        where: { id: { in: idsToDelete } },
      });
      console.log(`  ✅ Deleted ${result.count} duplicate payment records ($${deletedRevenue.toLocaleString()} removed)\n`);
    }
  }

  // ─── STEP 2: Fix PaymentType on Misclassified Records ────────
  console.log("STEP 2: Fixing misclassified paymentTypes...\n");

  // Find all FRONTEND payments that should be OTO
  const misclassifiedOTO = await prisma.payment.findMany({
    where: {
      status: "COMPLETED",
      paymentType: "FRONTEND",
      OR: [
        { productName: { contains: "Accelerator", mode: "insensitive" } },
        { productName: { contains: "Advanced", mode: "insensitive" } },
        { productName: { contains: "Master", mode: "insensitive" } },
        { productName: { contains: "Practice Path", mode: "insensitive" } },
        { productName: { contains: "Guarantee", mode: "insensitive" } },
        { productName: { contains: "DFY", mode: "insensitive" } },
        { productName: { contains: "Done For You", mode: "insensitive" } },
        { productName: { contains: "Done-For-You", mode: "insensitive" } },
        { productName: { contains: "Upgrade", mode: "insensitive" } },
        { productName: { contains: "Upsell", mode: "insensitive" } },
        { productName: { contains: "OTO", mode: "insensitive" } },
        // Also catch by price: $297+ is OTO territory (base certs are $27-$164)
        { amount: { gte: 297 } },
      ],
    },
    select: {
      id: true,
      amount: true,
      productName: true,
      paymentType: true,
      billingEmail: true,
    },
  });

  // But exclude actual frontend products that happen to be $297+
  // (there shouldn't be any, but let's be safe)
  const actualOTOs = misclassifiedOTO.filter(p => {
    const name = (p.productName || "").toLowerCase();
    // If it's a base certification product, keep as FRONTEND even if $297+
    // (Base products: mini diploma, fm certification, holistic nutrition cert, etc.)
    const isBaseCert = (
      (name.includes("certification") || name.includes("mini diploma") || name.includes("roots")) &&
      !name.includes("accelerator") &&
      !name.includes("advanced") &&
      !name.includes("master") &&
      !name.includes("practice path") &&
      !name.includes("pro ")
    );
    return !isBaseCert;
  });

  if (actualOTOs.length === 0) {
    console.log("  No misclassified OTOs found.\n");
  } else {
    console.log(`  Found ${actualOTOs.length} FRONTEND records that should be OTO:\n`);
    for (const p of actualOTOs) {
      console.log(`    ${p.id} | $${Number(p.amount)} | "${p.productName}" | ${p.billingEmail}`);
    }
    console.log("");

    // Update them to OTO
    const otoResult = await prisma.payment.updateMany({
      where: { id: { in: actualOTOs.map(p => p.id) } },
      data: { paymentType: "OTO" },
    });
    console.log(`  ✅ Reclassified ${otoResult.count} payments from FRONTEND → OTO\n`);
  }

  // Also check for BUMP misclassifications
  const misclassifiedBump = await prisma.payment.findMany({
    where: {
      status: "COMPLETED",
      paymentType: "FRONTEND",
      OR: [
        { productName: { contains: "bump", mode: "insensitive" } },
        { productName: { contains: "order bump", mode: "insensitive" } },
      ],
    },
    select: { id: true, amount: true, productName: true, billingEmail: true },
  });

  if (misclassifiedBump.length > 0) {
    console.log(`  Found ${misclassifiedBump.length} FRONTEND records that should be BUMP:\n`);
    for (const p of misclassifiedBump) {
      console.log(`    ${p.id} | $${Number(p.amount)} | "${p.productName}" | ${p.billingEmail}`);
    }
    const bumpResult = await prisma.payment.updateMany({
      where: { id: { in: misclassifiedBump.map(p => p.id) } },
      data: { paymentType: "BUMP" },
    });
    console.log(`\n  ✅ Reclassified ${bumpResult.count} payments from FRONTEND → BUMP\n`);
  }

  // ─── STEP 3: After Stats ──────────────────────────────────────
  const afterTotal = await prisma.payment.aggregate({
    where: { status: "COMPLETED" },
    _sum: { amount: true },
    _count: true,
  });
  const afterFrontend = await prisma.payment.aggregate({
    where: { status: "COMPLETED", paymentType: "FRONTEND" },
    _sum: { amount: true },
    _count: true,
  });
  const afterOTO = await prisma.payment.aggregate({
    where: { status: "COMPLETED", paymentType: "OTO" },
    _sum: { amount: true },
    _count: true,
  });
  const afterBump = await prisma.payment.aggregate({
    where: { status: "COMPLETED", paymentType: "BUMP" },
    _sum: { amount: true },
    _count: true,
  });

  // Today-specific stats (Alaska time = UTC-9)
  const alaskaOffsetMs = -9 * 60 * 60 * 1000;
  const alaskaTime = new Date(Date.now() + alaskaOffsetMs);
  const alaskaMidnight = new Date(Date.UTC(alaskaTime.getUTCFullYear(), alaskaTime.getUTCMonth(), alaskaTime.getUTCDate(), 0, 0, 0, 0));
  const todayStartUTC = new Date(alaskaMidnight.getTime() + (9 * 60 * 60 * 1000));

  const todayTotal = await prisma.payment.aggregate({
    where: { status: "COMPLETED", createdAt: { gte: todayStartUTC } },
    _sum: { amount: true },
    _count: true,
  });
  const todayFrontend = await prisma.payment.aggregate({
    where: { status: "COMPLETED", paymentType: "FRONTEND", createdAt: { gte: todayStartUTC } },
    _sum: { amount: true },
    _count: true,
  });
  const todayOTO = await prisma.payment.aggregate({
    where: { status: "COMPLETED", paymentType: "OTO", createdAt: { gte: todayStartUTC } },
    _sum: { amount: true },
    _count: true,
  });

  console.log("═══════════════════════════════════════════════════════");
  console.log("  AFTER CLEANUP:");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Total records:    ${afterTotal._count}`);
  console.log(`  Total revenue:    $${Number(afterTotal._sum.amount || 0).toLocaleString()}`);
  console.log(`  Frontend orders:  ${afterFrontend._count} ($${Number(afterFrontend._sum.amount || 0).toLocaleString()})`);
  console.log(`  OTO orders:       ${afterOTO._count} ($${Number(afterOTO._sum.amount || 0).toLocaleString()})`);
  console.log(`  Bump orders:      ${afterBump._count} ($${Number(afterBump._sum.amount || 0).toLocaleString()})`);
  console.log("");
  console.log("  TODAY (Alaska Time):");
  console.log(`    Total revenue:   $${Number(todayTotal._sum.amount || 0).toLocaleString()}`);
  console.log(`    Total txns:      ${todayTotal._count}`);
  console.log(`    Customers:       ${todayFrontend._count} (frontend orders)`);
  console.log(`    OTO revenue:     $${Number(todayOTO._sum.amount || 0).toLocaleString()} (${todayOTO._count} OTOs)`);
  console.log("");
  console.log("  CHANGES MADE:");
  console.log(`    Duplicates deleted:     ${deletedCount}`);
  console.log(`    Revenue removed:        $${deletedRevenue.toLocaleString()}`);
  console.log(`    OTOs reclassified:      ${actualOTOs.length}`);
  console.log(`    Bumps reclassified:     ${misclassifiedBump.length}`);
  console.log("═══════════════════════════════════════════════════════\n");

  // ─── STEP 4: Check for null transactionIds ────────────────────
  const nullTxCount = await prisma.payment.count({
    where: { transactionId: null, status: "COMPLETED" },
  });
  if (nullTxCount > 0) {
    console.log(`  ⚠️  Warning: ${nullTxCount} payments have NULL transactionId (can't dedup these).`);
    console.log("     These need manual review or a fallback transactionId.\n");

    // Generate unique transactionIds for null records to allow the @unique migration
    const nullTxPayments = await prisma.payment.findMany({
      where: { transactionId: null },
      select: { id: true, createdAt: true, billingEmail: true, amount: true },
    });

    console.log("  Generating unique transactionIds for null records...\n");
    for (const p of nullTxPayments) {
      const fallbackTxId = `legacy_${p.id}`;
      await prisma.payment.update({
        where: { id: p.id },
        data: { transactionId: fallbackTxId },
      });
    }
    console.log(`  ✅ Generated transactionIds for ${nullTxPayments.length} records (prefix: legacy_)\n`);
  }

  // ─── STEP 5: Final duplicate check ────────────────────────────
  const remainingDupes = await prisma.$queryRawUnsafe(`
    SELECT "transactionId", COUNT(*) as cnt
    FROM "Payment"
    WHERE "transactionId" IS NOT NULL
    GROUP BY "transactionId"
    HAVING COUNT(*) > 1
  `) as Array<{ transactionId: string; cnt: bigint }>;

  if (remainingDupes.length > 0) {
    console.log(`  ⚠️  ${remainingDupes.length} duplicate transactionIds still remain:`);
    for (const d of remainingDupes) {
      console.log(`    ${d.transactionId}: ${d.cnt} records`);
    }
    console.log("\n  Cannot apply @unique constraint until these are resolved.\n");
  } else {
    console.log("  ✅ No duplicate transactionIds remain — safe to apply @unique constraint.\n");
    console.log("  Next step: run `npx prisma db push` to apply the schema change.\n");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
