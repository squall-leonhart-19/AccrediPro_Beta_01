import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/retellai/send-checkout-sms
 * 
 * Called by RetellAI Custom Function to send checkout SMS via GHL Workflow Webhook
 * This triggers the GHL workflow which:
 * 1. Creates/updates the contact
 * 2. Sends the SMS with scholarship details
 */

// GHL Workflow Webhook URL
const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/3gemMXNZH9zb1geLk03w/webhook-trigger/0a04ae14-c773-4b44-b16b-736f1a3487d6";

// Scholarship code mapping
const SCHOLARSHIP_CODES: Record<string, string> = {
    "100": "SCHOLARSHIP100",
    "150": "SCHOLARSHIP150",
    "200": "SCHOLARSHIP200",
    "300": "SCHOLARSHIP300",
    "400": "SCHOLARSHIP400",
    "500": "SCHOLARSHIP500",
    "600": "SCHOLARSHIP600",
    "700": "SCHOLARSHIP700",
    "800": "SCHOLARSHIP800",
    "900": "SCHOLARSHIP900",
    "1000": "SCHOLARSHIP1000",
    "1200": "SCHOLARSHIP1200",
    "1500": "SCHOLARSHIP1500",
};

export async function POST(req: NextRequest) {
    try {
        // Get query params
        const searchParams = req.nextUrl.searchParams;
        const queryPhone = searchParams.get("phone");

        const body = await req.json();

        // Log full request for debugging
        console.log("[SMS API] Full request body:", JSON.stringify(body, null, 2));

        // RetellAI sends args in the body, also check call metadata
        const args = body.args || body;
        const callData = body.call || {};

        // Try multiple sources for phone: query params, args, call metadata
        const phone = queryPhone || args.phone || callData.to_number || callData.from_number || "";
        const first_name = args.first_name || callData.retell_llm_dynamic_variables?.first_name || "";
        const amount = args.amount || "";
        const email = args.email || callData.retell_llm_dynamic_variables?.email || "";
        const last_name = args.last_name || callData.retell_llm_dynamic_variables?.last_name || "";
        const call_id = callData.call_id || "";

        console.log("[SMS API] Extracted values:", { phone, first_name, amount });

        if (!phone || !amount) {
            console.error("[SMS API] Missing required fields:", { phone, amount });
            return NextResponse.json(
                { error: "Missing phone or amount", success: false },
                { status: 400 }
            );
        }

        // Clean the amount (remove $, commas, spaces)
        const cleanAmount = amount.toString().replace(/[^0-9]/g, "");

        // Get scholarship code
        const scholarshipCode = SCHOLARSHIP_CODES[cleanAmount] || `SCHOLARSHIP${cleanAmount}`;
        const checkoutUrl = "https://learn.accredipro.academy/checkout/scholarship";

        // Call GHL Workflow Webhook
        const ghlResponse = await fetch(GHL_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                first_name: first_name || "Friend",
                last_name: last_name || "",
                email: email || "",
                phone: phone,
                checkout_url: checkoutUrl,
                coupon_code: scholarshipCode,
                final_amount: cleanAmount,
                call_id: call_id,
            }),
        });

        if (!ghlResponse.ok) {
            const errorText = await ghlResponse.text();
            console.error("[SMS API] GHL Webhook Error:", errorText);

            // Return success anyway so the call continues
            return NextResponse.json({
                success: false,
                error: "Webhook failed",
                code: scholarshipCode,
            });
        }

        console.log("[SMS API] GHL Webhook triggered successfully:", {
            phone,
            code: scholarshipCode,
            amount: cleanAmount,
        });

        return NextResponse.json({
            success: true,
            code: scholarshipCode,
            message: "SMS workflow triggered successfully",
        });

    } catch (error) {
        console.error("[SMS API] Error:", error);
        return NextResponse.json(
            { error: "Internal server error", success: false },
            { status: 500 }
        );
    }
}

