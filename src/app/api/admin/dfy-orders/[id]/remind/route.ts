import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendDFYIntakeReminderEmail } from "@/lib/email";

// POST send intake form reminder email
export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "SUPERUSER", "INSTRUCTOR"].includes(session.user.role || "")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const order = await prisma.dFYPurchase.findUnique({
            where: { id: params.id },
            include: {
                user: { select: { email: true, firstName: true } },
                product: { select: { title: true } },
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (order.fulfillmentStatus !== "PENDING") {
            return NextResponse.json({ error: "Order already has intake form completed" }, { status: 400 });
        }

        // Send reminder email
        const intakeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://learn.accredipro.academy"}/dfy-intake?purchaseId=${order.id}`;

        await sendDFYIntakeReminderEmail({
            to: order.user.email!,
            firstName: order.user.firstName || "there",
            productName: order.product.title,
            intakeUrl,
        });

        console.log(`[DFY Reminder] Sent to ${order.user.email} for order ${order.id}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[DFY Reminder] Error:", error);
        return NextResponse.json({ error: "Failed to send reminder" }, { status: 500 });
    }
}
