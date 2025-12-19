import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendPurchaseEvent } from "@/lib/meta-capi";

// ClickFunnels webhook secret for purchase tracking (separate from other CF webhooks)
const CF_WEBHOOK_SECRET = process.env.CLICKFUNNELS_PURCHASE_WEBHOOK_SECRET || "4f1d4d3794136660e793fb28cfaa22bec461ff3c3adbbedb66bb0eb10ed6ca02";

/**
 * Verify ClickFunnels webhook signature
 */
function verifySignature(payload: string, signature: string | null): boolean {
    if (!signature) return false;

    const expectedSignature = crypto
        .createHmac("sha256", CF_WEBHOOK_SECRET)
        .update(payload)
        .digest("hex");

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

/**
 * POST /api/webhooks/clickfunnels-purchase
 *
 * Webhook endpoint for ClickFunnels purchases.
 * When a user buys the $997 certification on ClickFunnels:
 * 1. Receives purchase data from CF webhook
 * 2. Finds user by email in our database
 * 3. Sends Purchase event to Meta CAPI (server-side tracking)
 * 4. Updates user status / enrolls them in the full course
 *
 * ClickFunnels webhook payload typically includes:
 * - contact.email
 * - contact.first_name
 * - contact.last_name
 * - purchase.amount
 * - purchase.products[].name
 */
export async function POST(request: NextRequest) {
    try {
        // Get raw body for signature verification
        const rawBody = await request.text();
        const signature = request.headers.get("x-clickfunnels-webhook-signature")
            || request.headers.get("x-cf-signature");

        // Verify signature if provided (ClickFunnels sends this header)
        if (signature && !verifySignature(rawBody, signature)) {
            console.error("[CF Webhook] Invalid signature");
            return NextResponse.json(
                { error: "Invalid webhook signature" },
                { status: 401 }
            );
        }

        const body = JSON.parse(rawBody);

        console.log("[CF Webhook] Received purchase webhook:", JSON.stringify(body, null, 2));

        // Extract data from ClickFunnels payload
        // CF webhook structure can vary - handle common formats
        const email = body.contact?.email || body.email || body.purchase?.contact?.email;
        const firstName = body.contact?.first_name || body.first_name || body.contact?.firstName;
        const lastName = body.contact?.last_name || body.last_name || body.contact?.lastName;
        const amount = body.purchase?.amount || body.amount || body.total || 997;
        const productName = body.purchase?.products?.[0]?.name || body.product_name || "Full Certification";

        if (!email) {
            console.error("[CF Webhook] No email in payload");
            return NextResponse.json(
                { error: "No email provided in webhook payload" },
                { status: 400 }
            );
        }

        console.log(`[CF Webhook] Processing purchase for: ${email}, amount: $${amount}`);

        // 1. Find user in our database
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                fbclid: true,
                fbc: true,
                fbp: true,
            },
        });

        // 2. Send Purchase event to Meta CAPI
        const metaResult = await sendPurchaseEvent({
            email: email.toLowerCase().trim(),
            value: parseFloat(amount) || 997,
            currency: "USD",
            contentName: productName,
            firstName: firstName || user?.firstName || undefined,
            externalId: user?.id,
        });

        console.log("[CF Webhook] Meta CAPI result:", metaResult);

        // 3. Update user status if user exists
        if (user) {
            // Get the full certification course
            const fullCertCourse = await prisma.course.findFirst({
                where: {
                    OR: [
                        { slug: "functional-medicine-certification" },
                        { slug: "fm-certification" },
                        { title: { contains: "Functional Medicine Certification" } },
                    ],
                },
            });

            if (fullCertCourse) {
                // Create enrollment in full certification
                await prisma.enrollment.upsert({
                    where: {
                        userId_courseId: {
                            userId: user.id,
                            courseId: fullCertCourse.id,
                        },
                    },
                    update: {
                        status: "ACTIVE",
                        lastAccessedAt: new Date(),
                    },
                    create: {
                        userId: user.id,
                        courseId: fullCertCourse.id,
                        status: "ACTIVE",
                        progress: 0,
                    },
                });

                console.log(`[CF Webhook] Enrolled user ${email} in ${fullCertCourse.title}`);
            }

            // Add purchase tag
            await prisma.userTag.upsert({
                where: { userId_tag: { userId: user.id, tag: "fm_certification_purchased" } },
                update: {},
                create: { userId: user.id, tag: "fm_certification_purchased" },
            });

            // Add marketing tag for purchase tracking
            await prisma.userMarketingTag.create({
                data: {
                    userId: user.id,
                    tag: "purchase_997",
                    source: "clickfunnels",
                    metadata: {
                        amount: amount,
                        productName: productName,
                        purchasedAt: new Date().toISOString(),
                    },
                },
            }).catch(() => {
                // Ignore if duplicate
            });

            console.log(`[CF Webhook] ✅ User ${email} updated with purchase tags`);
        } else {
            console.log(`[CF Webhook] User ${email} not found in database - Meta event still sent`);
        }

        return NextResponse.json({
            success: true,
            message: "Purchase processed",
            email,
            amount,
            metaEventSent: metaResult.success,
            metaEventId: metaResult.eventId,
            userFound: !!user,
        });

    } catch (error) {
        console.error("[CF Webhook] Error processing purchase:", error);
        return NextResponse.json(
            { error: "Failed to process purchase webhook" },
            { status: 500 }
        );
    }
}

// Also support GET for webhook verification (some platforms ping the URL first)
export async function GET() {
    return NextResponse.json({
        status: "ok",
        endpoint: "clickfunnels-purchase",
        message: "Webhook endpoint is active",
    });
}
