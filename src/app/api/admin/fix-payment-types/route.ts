import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/admin/fix-payment-types
 * Backfill paymentType (FRONTEND, OTO, BUMP) for existing payments
 * Also deduplicates payments by keeping only the first one per transactionId
 */
export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // 1. BACKFILL PAYMENT TYPES
        const payments = await prisma.payment.findMany({
            where: { status: "COMPLETED" },
            select: { id: true, productName: true, amount: true, paymentType: true },
        });

        let updated = 0;
        let alreadySet = 0;

        for (const payment of payments) {
            // Skip if already set
            if (payment.paymentType && payment.paymentType !== 'FRONTEND') {
                alreadySet++;
                continue;
            }

            const nameLower = (payment.productName || "").toLowerCase();
            const amount = Number(payment.amount);
            let paymentType: 'FRONTEND' | 'OTO' | 'BUMP' = 'FRONTEND';

            // Detect OTO
            if (
                nameLower.includes('accelerator') ||
                nameLower.includes('guarantee') ||
                nameLower.includes('special offer') ||
                nameLower.includes('upgrade') ||
                nameLower.includes('done-for-you') ||
                nameLower.includes('dfy') ||
                nameLower.includes('oto') ||
                amount >= 297
            ) {
                paymentType = 'OTO';
            }

            // Detect BUMP
            if (
                nameLower.includes('bump') ||
                nameLower.includes('order bump') ||
                (amount <= 47 && nameLower.includes('bonus'))
            ) {
                paymentType = 'BUMP';
            }

            // Only update if different from FRONTEND default
            if (paymentType !== 'FRONTEND' || !payment.paymentType) {
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: { paymentType },
                });
                updated++;
            }
        }

        // 2. FIND AND REMOVE DUPLICATES
        // Get all transactionIds with duplicates
        const duplicates = await prisma.$queryRaw<{ transactionId: string; count: bigint }[]>`
            SELECT "transactionId", COUNT(*) as count 
            FROM "Payment" 
            WHERE "transactionId" IS NOT NULL 
            GROUP BY "transactionId" 
            HAVING COUNT(*) > 1
        `;

        let deduped = 0;

        for (const dup of duplicates) {
            // Get all payments with this transactionId, ordered by createdAt
            const dupPayments = await prisma.payment.findMany({
                where: { transactionId: dup.transactionId },
                orderBy: { createdAt: 'asc' },
            });

            // Keep the first one, delete the rest
            if (dupPayments.length > 1) {
                const toDelete = dupPayments.slice(1);
                for (const p of toDelete) {
                    try {
                        await prisma.payment.delete({ where: { id: p.id } });
                        deduped++;
                    } catch (delError) {
                        // Record may have already been deleted in another iteration
                        console.log(`[fix-payment-types] Skipped already-deleted: ${p.id}`);
                    }
                }
            }
        }

        return NextResponse.json({
            success: true,
            paymentTypesUpdated: updated,
            paymentTypesAlreadySet: alreadySet,
            duplicatesRemoved: deduped,
            totalPaymentsChecked: payments.length,
        });

    } catch (error) {
        console.error("[fix-payment-types] Error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
