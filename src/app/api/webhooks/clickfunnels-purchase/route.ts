import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

// ClickFunnels webhook secret for purchase tracking (separate from other CF webhooks)
const CF_WEBHOOK_SECRET = process.env.CLICKFUNNELS_PURCHASE_WEBHOOK_SECRET || "4f1d4d3794136660e793fb28cfaa22bec461ff3c3adbbedb66bb0eb10ed6ca02";

// NEW Pixel for purchase tracking (separate from lead pixel)
const PURCHASE_PIXEL_ID = process.env.META_PURCHASE_PIXEL_ID || "1287915349067829";
const PURCHASE_ACCESS_TOKEN = process.env.META_PURCHASE_ACCESS_TOKEN || "EAAHMlaRKtUoBQBe0ZAFZBQPlRv3xujHeDw0y8kGmRewZA9jaqkbnZA5mJxndHZCNmalSrGmr9DlTbNewOdu4INw4xRRZCE4vC0mSvnWsV17sIvklD9X4PbttSgp2lVIOZBQxG9Uq8UVljCsqZA1LSqxlgjDQ1qIN6PctDh3M5LmJBKkqQa0FDQAIoBN1AAIVqwZDZD";

// Hash PII for Meta
function hashData(data: string): string {
    return crypto.createHash("sha256").update(data.toLowerCase().trim()).digest("hex");
}

// Send Purchase event to Meta CAPI with specific pixel
async function sendPurchaseToMeta(params: {
    email: string;
    value: number;
    currency?: string;
    contentName: string;
    firstName?: string;
    externalId?: string;
}): Promise<{ success: boolean; eventId?: string; error?: string }> {
    const { email, value, currency = "USD", contentName, firstName, externalId } = params;

    const eventId = crypto.randomUUID();

    const userData: Record<string, unknown> = {
        em: [hashData(email)],
    };
    if (firstName) userData.fn = [hashData(firstName)];
    if (externalId) userData.external_id = [hashData(externalId)];

    const eventData = {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: "https://sarah.accredipro.academy/fm-mini-diploma-access",
        action_source: "website",
        user_data: userData,
        custom_data: {
            value,
            currency,
            content_name: contentName,
        },
    };

    try {
        const response = await fetch(
            `https://graph.facebook.com/v18.0/${PURCHASE_PIXEL_ID}/events?access_token=${PURCHASE_ACCESS_TOKEN}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: [eventData] }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.error("[Meta CAPI Purchase] Error:", result);
            return { success: false, eventId, error: result.error?.message };
        }

        console.log(`[Meta CAPI Purchase] ✅ Sent: ${contentName} = $${value}`, { event_id: eventId });
        return { success: true, eventId };
    } catch (error) {
        console.error("[Meta CAPI Purchase] Exception:", error);
        return { success: false, error: String(error) };
    }
}

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
 * Handles Mini Diploma ($27) and any bump/OTO purchases.
 *
 * 1. Receives purchase data from CF webhook
 * 2. Finds user by email in our database
 * 3. Sends SEPARATE Purchase events for each product to Meta CAPI
 * 4. Updates user status / adds tags
 *
 * ClickFunnels webhook payload typically includes:
 * - contact.email
 * - contact.first_name
 * - contact.last_name
 * - purchase.amount (total)
 * - purchase.products[].name
 * - purchase.products[].amount
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
        const email = body.contact?.email || body.email || body.purchase?.contact?.email;
        const firstName = body.contact?.first_name || body.first_name || body.contact?.firstName;
        const lastName = body.contact?.last_name || body.last_name || body.contact?.lastName;
        const totalAmount = body.purchase?.amount || body.amount || body.total || 27;

        // Get products array - may have multiple (main + bump + OTOs)
        const products = body.purchase?.products || body.products || [];

        if (!email) {
            console.error("[CF Webhook] No email in payload");
            return NextResponse.json(
                { error: "No email provided in webhook payload" },
                { status: 400 }
            );
        }

        console.log(`[CF Webhook] Processing purchase for: ${email}, total: $${totalAmount}, products: ${products.length}`);

        // 1. Find user in our database
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
            },
        });

        // 2. Send Purchase events to Meta CAPI (one per product for better optimization)
        const metaResults: Array<{ product: string; success: boolean; eventId?: string }> = [];

        if (products.length > 0) {
            // Fire separate event for each product
            for (const product of products) {
                const productName = product.name || product.title || "FM Mini Diploma";
                const productAmount = parseFloat(product.amount || product.price) || 27;

                const result = await sendPurchaseToMeta({
                    email: email.toLowerCase().trim(),
                    value: productAmount,
                    contentName: productName,
                    firstName: firstName || user?.firstName || undefined,
                    externalId: user?.id,
                });

                metaResults.push({ product: productName, success: result.success, eventId: result.eventId });
            }
        } else {
            // Fallback: single product purchase
            const productName = body.product_name || "FM Mini Diploma";
            const result = await sendPurchaseToMeta({
                email: email.toLowerCase().trim(),
                value: parseFloat(totalAmount) || 27,
                contentName: productName,
                firstName: firstName || user?.firstName || undefined,
                externalId: user?.id,
            });

            metaResults.push({ product: productName, success: result.success, eventId: result.eventId });
        }

        console.log("[CF Webhook] Meta CAPI results:", metaResults);

        // 3. Update user status if user exists
        if (user) {
            // Add purchase tag for mini diploma
            await prisma.userTag.upsert({
                where: { userId_tag: { userId: user.id, tag: "fm_mini_diploma_purchased" } },
                update: {},
                create: { userId: user.id, tag: "fm_mini_diploma_purchased" },
            });

            // Add marketing tag for purchase tracking
            await prisma.userMarketingTag.create({
                data: {
                    userId: user.id,
                    tag: `purchase_${Math.round(totalAmount)}`,
                    source: "clickfunnels",
                    metadata: {
                        amount: totalAmount,
                        products: products.map((p: { name?: string; amount?: number }) => ({
                            name: p.name,
                            amount: p.amount,
                        })),
                        purchasedAt: new Date().toISOString(),
                    },
                },
            }).catch(() => {
                // Ignore if duplicate
            });

            console.log(`[CF Webhook] ✅ User ${email} updated with purchase tags`);
        } else {
            console.log(`[CF Webhook] User ${email} not found in database - Meta events still sent`);
        }

        return NextResponse.json({
            success: true,
            message: "Purchase processed",
            email,
            totalAmount,
            productsCount: products.length || 1,
            metaEvents: metaResults,
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
