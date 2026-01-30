import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/dfy/my-purchase - Get current user's pending DFY purchase
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find user's pending DFY purchase (not yet completed intake)
        const purchase = await prisma.dFYPurchase.findFirst({
            where: {
                userId: session.user.id,
                fulfillmentStatus: { in: ["PENDING", "INTAKE_RECEIVED"] },
            },
            orderBy: { purchasedAt: "desc" },
            select: {
                id: true,
                fulfillmentStatus: true,
                product: {
                    select: { name: true },
                },
            },
        });

        if (!purchase) {
            return NextResponse.json({ purchaseId: null });
        }

        return NextResponse.json({
            purchaseId: purchase.id,
            status: purchase.fulfillmentStatus,
            productName: purchase.product?.name,
        });
    } catch (error) {
        console.error("[GET /api/dfy/my-purchase] Error:", error);
        return NextResponse.json({ error: "Failed to fetch purchase" }, { status: 500 });
    }
}
