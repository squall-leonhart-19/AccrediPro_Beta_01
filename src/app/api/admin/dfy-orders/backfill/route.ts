import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/admin/dfy-orders/backfill
 *
 * Finds users who have DFY-related tags (fm_pro_advanced_clinical_purchased from wrong webhook)
 * but no DFYPurchase record, and creates the missing records.
 *
 * Also looks for users with "business accelerator" in their purchase history
 * who are missing DFYPurchase records.
 */
export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "SUPERUSER"].includes(session.user.role || "")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find Jessica (DFY specialist)
        const jessica = await prisma.user.findFirst({
            where: { email: "jessica@accredipro-certificate.com" },
            select: { id: true },
        });

        // Find or create DFY product record
        let dfyProduct = await prisma.dFYProduct.findFirst({
            where: { slug: "dfy-program-ds" },
        });

        if (!dfyProduct) {
            dfyProduct = await prisma.dFYProduct.create({
                data: {
                    slug: "dfy-program-ds",
                    title: "Done For You Website Package",
                    description: "Complete coaching website setup",
                    price: 297,
                    productType: "CORE_PROGRAM",
                    category: "functional-medicine",
                    isActive: true,
                },
            });
        }

        // Strategy 1: Find users with webhook events mentioning DFY/business accelerator
        const dfyWebhookEvents = await prisma.webhookEvent.findMany({
            where: {
                eventType: "clickfunnels.purchase",
                OR: [
                    { payload: { path: ["productName"], string_contains: "Business Accelerator" } },
                    { payload: { path: ["productName"], string_contains: "Done-For-You" } },
                    { payload: { path: ["productName"], string_contains: "Done For You" } },
                    { payload: { path: ["productName"], string_contains: "DFY" } },
                    { payload: { path: ["productId"], string_contains: "dfy" } },
                ],
            },
            orderBy: { createdAt: "desc" },
        });

        // Strategy 2: Find users with payment records mentioning DFY
        const dfyPayments = await prisma.payment.findMany({
            where: {
                OR: [
                    { productName: { contains: "Business Accelerator", mode: "insensitive" } },
                    { productName: { contains: "Done-For-You", mode: "insensitive" } },
                    { productName: { contains: "Done For You", mode: "insensitive" } },
                    { productName: { contains: "DFY", mode: "insensitive" } },
                    { productSku: { contains: "dfy", mode: "insensitive" } },
                ],
            },
            select: {
                userId: true,
                amount: true,
                createdAt: true,
                productName: true,
            },
        });

        const backfilledUsers: { email: string | null; userId: string; source: string }[] = [];
        const processedUserIds = new Set<string>();

        // Process webhook events
        for (const event of dfyWebhookEvents) {
            const payload = event.payload as Record<string, unknown>;
            const email = (payload.email as string)?.toLowerCase();
            if (!email) continue;

            const user = await prisma.user.findUnique({
                where: { email },
                select: { id: true, email: true },
            });
            if (!user || processedUserIds.has(user.id)) continue;
            processedUserIds.add(user.id);

            // Check if DFYPurchase already exists
            const existing = await prisma.dFYPurchase.findFirst({
                where: { userId: user.id, productId: dfyProduct.id },
            });
            if (existing) continue;

            // Create DFYPurchase
            await prisma.dFYPurchase.create({
                data: {
                    userId: user.id,
                    productId: dfyProduct.id,
                    purchasePrice: (payload.amount as number) || 297,
                    status: "COMPLETED",
                    fulfillmentStatus: "PENDING",
                    assignedToId: jessica?.id || null,
                },
            });

            // Add dfy_purchased tag
            await prisma.userTag.upsert({
                where: { userId_tag: { userId: user.id, tag: "dfy_purchased" } },
                update: {},
                create: { userId: user.id, tag: "dfy_purchased" },
            });

            backfilledUsers.push({ email: user.email, userId: user.id, source: "webhook_event" });
        }

        // Process payment records
        for (const payment of dfyPayments) {
            if (!payment.userId || processedUserIds.has(payment.userId)) continue;
            processedUserIds.add(payment.userId);

            const user = await prisma.user.findUnique({
                where: { id: payment.userId },
                select: { id: true, email: true },
            });
            if (!user) continue;

            // Check if DFYPurchase already exists
            const existing = await prisma.dFYPurchase.findFirst({
                where: { userId: user.id, productId: dfyProduct.id },
            });
            if (existing) continue;

            // Create DFYPurchase
            await prisma.dFYPurchase.create({
                data: {
                    userId: user.id,
                    productId: dfyProduct.id,
                    purchasePrice: payment.amount || 297,
                    status: "COMPLETED",
                    fulfillmentStatus: "PENDING",
                    assignedToId: jessica?.id || null,
                },
            });

            // Add dfy_purchased tag
            await prisma.userTag.upsert({
                where: { userId_tag: { userId: user.id, tag: "dfy_purchased" } },
                update: {},
                create: { userId: user.id, tag: "dfy_purchased" },
            });

            backfilledUsers.push({
                email: user.email,
                userId: user.id,
                source: `payment: ${payment.productName}`,
            });
        }

        return NextResponse.json({
            success: true,
            backfilledCount: backfilledUsers.length,
            backfilledUsers,
            dfyProductId: dfyProduct.id,
        });
    } catch (error) {
        console.error("[DFY Backfill] Error:", error);
        return NextResponse.json({ error: "Backfill failed", details: String(error) }, { status: 500 });
    }
}
