import { NextRequest, NextResponse } from "next/server";

/**
 * RetellAI SMS Function Endpoint
 * 
 * Called by RetellAI during a call when Sarah triggers send_checkout_sms
 * Sends SMS with checkout link and coupon code
 */

// You can use Twilio, or any SMS provider
// For now, we'll log and return success (you can add Twilio later)

const CHECKOUT_URL = "https://sarah.accredipro.academy/checkout-fm-certification-program";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        console.log("[RetellAI SMS Function]", JSON.stringify(body, null, 2));

        // Extract from RetellAI function call
        const {
            args,  // Function arguments
            call,  // Call context with dynamic variables
        } = body;

        const couponCode = args?.coupon_code || "SCHOLARSHIP500";
        const finalAmount = args?.final_amount || "500";

        // Get phone from call context
        const phone = call?.retell_llm_dynamic_variables?.phone || "";
        const firstName = call?.retell_llm_dynamic_variables?.first_name || "there";

        if (!phone) {
            console.error("[RetellAI SMS] No phone number available");
            return NextResponse.json({
                success: false,
                message: "No phone number available"
            });
        }

        // Build SMS message
        const smsMessage = `🎉 ${firstName}! Your scholarship is APPROVED!

Pay only: $${finalAmount}
Code: ${couponCode}

Checkout now:
${CHECKOUT_URL}

⏰ Link expires in 10 min!
- Sarah`;

        console.log(`[RetellAI SMS] Sending to ${phone}:`);
        console.log(smsMessage);

        // TODO: Actually send SMS via Twilio
        // await sendTwilioSMS(phone, smsMessage);

        // For now, return success (RetellAI expects a response)
        return NextResponse.json({
            success: true,
            message: `SMS sent to ${phone}`,
            result: {
                checkout_url: CHECKOUT_URL,
                coupon_code: couponCode,
                amount: finalAmount
            }
        });

    } catch (error) {
        console.error("[RetellAI SMS Error]", error);
        return NextResponse.json({
            success: false,
            error: "Failed to send SMS"
        }, { status: 500 });
    }
}
