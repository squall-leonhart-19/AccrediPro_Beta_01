import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendDFYDeliveryEmail } from "@/lib/email";

// Update DFY order status
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { purchaseId, status } = body;

        if (!purchaseId || !status) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validate status
        const validStatuses = ["PENDING", "INTAKE_RECEIVED", "IN_PROGRESS", "DELIVERED"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
            );
        }

        // Get purchase with user details
        const purchase = await prisma.dFYPurchase.findUnique({
            where: { id: purchaseId },
            include: {
                user: true,
                product: true,
            },
        });

        if (!purchase) {
            return NextResponse.json(
                { error: "Purchase not found" },
                { status: 404 }
            );
        }

        // Update status
        const updateData: any = {
            fulfillmentStatus: status,
            updatedAt: new Date(),
        };

        if (status === "DELIVERED") {
            updateData.deliveredAt = new Date();
        }

        await prisma.dFYPurchase.update({
            where: { id: purchaseId },
            data: updateData,
        });

        // Add status tag to user
        const existingTags = purchase.user.tags || [];
        const tagToAdd = status === "DELIVERED" ? "dfy_delivered" :
            status === "IN_PROGRESS" ? "dfy_in_progress" : null;

        if (tagToAdd && !existingTags.includes(tagToAdd)) {
            await prisma.user.update({
                where: { id: purchase.userId },
                data: {
                    tags: [...existingTags, tagToAdd],
                },
            });
        }

        // Find Jessica for DMs
        const jessica = await prisma.user.findFirst({
            where: { email: "jessica@accredipro-certificate.com" },
            select: { id: true },
        });

        // Send appropriate communication based on status
        if (status === "IN_PROGRESS" && jessica) {
            // Send "started work" DM
            await prisma.message.create({
                data: {
                    senderId: jessica.id,
                    receiverId: purchase.userId,
                    content: `Quick update! 🚀 I've started working on your ${purchase.product.title}. Making great progress and you'll have everything soon!`,
                    messageType: "DIRECT",
                },
            });
        }

        if (status === "DELIVERED") {
            // Send delivery email
            if (purchase.user.email) {
                const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://learn.accredipro.academy"}/my-courses`;

                await sendDFYDeliveryEmail({
                    to: purchase.user.email,
                    firstName: purchase.user.firstName || "there",
                    productName: purchase.product.title,
                    dashboardUrl,
                });
            }

            // Send delivery DM from Jessica
            if (jessica) {
                await prisma.message.create({
                    data: {
                        senderId: jessica.id,
                        receiverId: purchase.userId,
                        content: `Great news, ${purchase.user.firstName}! 🎁\n\nYour ${purchase.product.title} is complete and waiting in your dashboard! Everything has been customized based on your intake form.\n\nLet me know if you need any tweaks or have questions. I'm here to help!`,
                        messageType: "DIRECT",
                    },
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[DFY Update Status] Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
