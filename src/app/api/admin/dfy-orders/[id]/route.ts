import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendDFYDeliveryEmail } from "@/lib/email";

// GET single DFY order details
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "SUPERUSER", "CUSTOMER_CARE"].includes(session.user.role || "")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const order = await prisma.dFYPurchase.findUnique({
            where: { id: params.id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        createdAt: true,
                    },
                },
                product: true,
                assignedTo: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error("[DFY Order] Error:", error);
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
    }
}

// PATCH update order status/notes
export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "SUPERUSER", "CUSTOMER_CARE"].includes(session.user.role || "")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { fulfillmentStatus, notes, assignedToId } = body;

        // Get current order for email notification
        const currentOrder = await prisma.dFYPurchase.findUnique({
            where: { id: params.id },
            include: {
                user: { select: { email: true, firstName: true } },
                product: { select: { title: true } },
            },
        });

        if (!currentOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Build update data
        const updateData: any = {};
        if (fulfillmentStatus) {
            updateData.fulfillmentStatus = fulfillmentStatus;

            // Set deliveredAt when marking as delivered
            if (fulfillmentStatus === "DELIVERED") {
                updateData.deliveredAt = new Date();
            }
        }
        if (notes !== undefined) {
            updateData.notes = notes;
        }
        if (assignedToId !== undefined) {
            updateData.assignedToId = assignedToId || null;
        }

        const order = await prisma.dFYPurchase.update({
            where: { id: params.id },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                product: { select: { title: true } },
            },
        });

        // Send delivery email when status changes to DELIVERED
        if (fulfillmentStatus === "DELIVERED" && currentOrder.fulfillmentStatus !== "DELIVERED") {
            try {
                await sendDFYDeliveryEmail({
                    to: order.user.email!,
                    firstName: order.user.firstName || "there",
                    productName: order.product.title,
                });
                console.log(`[DFY] Delivery email sent to ${order.user.email}`);
            } catch (emailError) {
                console.error("[DFY] Delivery email failed:", emailError);
            }

            // Add tag
            await prisma.userTag.upsert({
                where: { userId_tag: { userId: order.user.id, tag: "dfy_delivered" } },
                update: {},
                create: { userId: order.user.id, tag: "dfy_delivered" },
            });
        }

        return NextResponse.json({ order, success: true });
    } catch (error) {
        console.error("[DFY Order Update] Error:", error);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}
