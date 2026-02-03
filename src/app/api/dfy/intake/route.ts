import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendDFYIntakeReceivedEmail } from "@/lib/email";
import { appendDFYOrderToSheet, isGoogleSheetsConfigured } from "@/lib/google-sheets";

// Submit DFY intake form
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { purchaseId, intakeData } = body;

        if (!purchaseId || !intakeData) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Verify the purchase belongs to this user
        const purchase = await prisma.dFYPurchase.findUnique({
            where: { id: purchaseId },
            include: { user: true, product: true },
        });

        if (!purchase || purchase.userId !== session.user.id) {
            return NextResponse.json(
                { error: "Purchase not found" },
                { status: 404 }
            );
        }

        // Find Jessica Parker (DFY specialist) to assign
        const jessica = await prisma.user.findFirst({
            where: { email: "jessica@accredipro-certificate.com" },
            select: { id: true },
        });

        // Update purchase with intake data and mark as received
        await prisma.dFYPurchase.update({
            where: { id: purchaseId },
            data: {
                intakeData,
                fulfillmentStatus: "INTAKE_RECEIVED",
                assignedToId: jessica?.id || null,
                updatedAt: new Date(),
            },
        });

        // Add dfy_intake_completed tag to user (using UserTag table)
        await prisma.userTag.upsert({
            where: {
                userId_tag: {
                    userId: purchase.userId,
                    tag: "dfy_intake_completed",
                }
            },
            update: {
                metadata: {
                    purchaseId,
                    productName: purchase.product.title,
                    submittedAt: new Date().toISOString(),
                }
            },
            create: {
                userId: purchase.userId,
                tag: "dfy_intake_completed",
                value: purchaseId,
                metadata: {
                    purchaseId,
                    productName: purchase.product.title,
                    submittedAt: new Date().toISOString(),
                }
            }
        });

        // Create admin notification
        await prisma.notification.create({
            data: {
                userId: jessica?.id || session.user.id,
                type: "DFY_INTAKE_RECEIVED",
                title: "New DFY Intake Received",
                message: `${purchase.user.firstName} submitted intake for ${purchase.product.title}`,
                data: { purchaseId, userId: purchase.userId },
            },
        });

        // Send DM from Jessica to student (confirmation)
        if (jessica) {
            await prisma.message.create({
                data: {
                    senderId: jessica.id,
                    receiverId: purchase.userId,
                    content: `Got your intake form! 🎉 I'm starting on your ${purchase.product.title} right now. You'll hear from me within 7 days with everything ready. Let me know if you have any questions in the meantime!`,
                    messageType: "DIRECT",
                },
            });

            // Send auto-DM from student TO Jessica (so Jessica sees it in her inbox)
            const customerName = `${purchase.user.firstName || ""} ${purchase.user.lastName || ""}`.trim() || "A customer";
            await prisma.message.create({
                data: {
                    senderId: purchase.userId,
                    receiverId: jessica.id,
                    content: `Hi Jessica! I just completed my intake form for ${purchase.product.title}. Looking forward to seeing the final result! 😊`,
                    messageType: "DIRECT",
                },
            });
            console.log(`[DFY Intake] ✅ Auto-DM sent from ${customerName} to Jessica`);
        }

        // Send email to Jessica with full intake details
        try {
            const customerName = `${purchase.user.firstName || ""} ${purchase.user.lastName || ""}`.trim() || "Customer";
            await sendDFYIntakeReceivedEmail({
                customerName,
                customerEmail: purchase.user.email || "",
                productName: purchase.product.title,
                intakeData,
                adminDashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "https://learn.accredipro.academy"}/admin/dfy-orders`,
            });
            console.log(`[DFY Intake] Email sent to Jessica for ${customerName}`);
        } catch (emailError) {
            console.error("[DFY Intake] Email to Jessica failed:", emailError);
            // Don't fail the request if email fails
        }

        // Sync to Google Sheets (auto-sync on submit)
        if (isGoogleSheetsConfigured()) {
            try {
                await appendDFYOrderToSheet({
                    id: purchase.id,
                    createdAt: purchase.createdAt,
                    userEmail: purchase.user.email || "",
                    firstName: purchase.user.firstName || "",
                    lastName: purchase.user.lastName || "",
                    productTitle: purchase.product.title,
                    purchasePrice: Number(purchase.purchasePrice),
                    fulfillmentStatus: "INTAKE_RECEIVED",
                    notes: purchase.notes,
                    intakeData,
                });
                console.log(`[DFY Intake] ✅ Google Sheets synced for ${purchase.user.email}`);
            } catch (sheetsError) {
                console.error("[DFY Intake] Google Sheets sync failed:", sheetsError);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[DFY Intake] Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
