import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/retellai/send-checkout-sms
 * 
 * Called by RetellAI Custom Function to send checkout SMS via GHL
 * Sends the proper scholarship code based on investment amount
 */

const GHL_API_KEY = process.env.GHL_API_KEY || "";
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || "";

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
        // Verify API key (optional security)
        const apiKey = req.headers.get("x-api-key");
        if (apiKey && apiKey !== process.env.RETELL_WEBHOOK_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get query params
        const searchParams = req.nextUrl.searchParams;
        const queryPhone = searchParams.get("phone");

        const body = await req.json();

        // Log full request for debugging
        console.log("[SMS API] Full request body:", JSON.stringify(body, null, 2));
        console.log("[SMS API] Query params phone:", queryPhone);

        // RetellAI sends args in the body, also check call metadata
        const args = body.args || body;
        const callData = body.call || {};

        // Try multiple sources for phone: query params, args, call metadata
        const phone = queryPhone || args.phone || callData.to_number || callData.from_number || "";
        const first_name = args.first_name || callData.retell_llm_dynamic_variables?.first_name || "there";
        const amount = args.amount || "";

        console.log("[SMS API] Extracted values:", { phone, first_name, amount });

        if (!phone || !amount) {
            console.error("[SMS API] Missing required fields:", { phone, amount });
            return NextResponse.json(
                [{ error: "1", success: false }, "Missing phone or amount"],
                { status: 400 }
            );
        }

        // Clean the amount (remove $, commas, spaces)
        const cleanAmount = amount.toString().replace(/[^0-9]/g, "");

        // Get scholarship code
        const scholarshipCode = SCHOLARSHIP_CODES[cleanAmount] || `SCHOLARSHIP${cleanAmount}`;

        // Build the SMS message
        const message = `🎓 AccrediPro Scholarship APPROVED!

Hi ${first_name || "there"}! Your scholarship has been approved by Dr. Martinez.

✅ Checkout Link:
https://learn.accredipro.academy/checkout/scholarship

🎟️ Your Code: ${scholarshipCode}

⏰ This link expires in 10 minutes.

Welcome to the program!
- Dr. Elena Martinez
AccrediPro Institute`;

        // Send via GHL API
        const ghlResponse = await fetch(
            `https://services.leadconnectorhq.com/conversations/messages`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${GHL_API_KEY}`,
                    "Content-Type": "application/json",
                    "Version": "2021-07-28",
                },
                body: JSON.stringify({
                    type: "SMS",
                    locationId: GHL_LOCATION_ID,
                    phone: phone,
                    message: message,
                }),
            }
        );

        if (!ghlResponse.ok) {
            const errorText = await ghlResponse.text();
            console.error("GHL SMS Error:", errorText);

            // Return success anyway so the call continues
            return NextResponse.json({
                success: false,
                error: "SMS failed to send",
                code: scholarshipCode,
            });
        }

        const ghlData = await ghlResponse.json();

        console.log("SMS sent successfully:", {
            phone,
            code: scholarshipCode,
            messageId: ghlData.id,
        });

        return NextResponse.json({
            success: true,
            code: scholarshipCode,
            message: "SMS sent successfully",
        });

    } catch (error) {
        console.error("Send checkout SMS error:", error);
        return NextResponse.json(
            { error: "Internal server error", success: false },
            { status: 500 }
        );
    }
}
