import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createAuditLogger, AuditAction } from "@/lib/audit";

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/admin/purchases/[id]/refund - Mark a payment as refunded
export async function POST(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const session = await getServerSession(authOptions);

        // Only ADMIN/SUPERUSER can process refunds
        if (!session?.user?.id || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;

        // Find the payment
        const payment = await prisma.payment.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, email: true, firstName: true, lastName: true }
                }
            }
        });

        if (!payment) {
            return NextResponse.json({ error: "Payment not found" }, { status: 404 });
        }

        if (payment.status !== "COMPLETED") {
            return NextResponse.json(
                { error: `Cannot refund payment with status: ${payment.status}` },
                { status: 400 }
            );
        }

        // Update the payment status to REFUNDED
        const updatedPayment = await prisma.payment.update({
            where: { id },
            data: {
                status: "REFUNDED",
                updatedAt: new Date(),
            },
        });

        // Log the refund action
        const audit = createAuditLogger(session as { user: { id: string; email?: string | null; role: string } });
        audit(AuditAction.STATUS_CHANGE, "payment", id, {
            previousStatus: "COMPLETED",
            newStatus: "REFUNDED",
            amount: Number(payment.amount),
            userId: payment.userId,
            userEmail: payment.user?.email,
            productName: payment.productName,
        });

        return NextResponse.json({
            success: true,
            message: "Payment marked as refunded",
            payment: updatedPayment,
        });
    } catch (error) {
        console.error("Error processing refund:", error);
        return NextResponse.json(
            { error: "Failed to process refund" },
            { status: 500 }
        );
    }
}
