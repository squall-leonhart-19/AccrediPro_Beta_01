import { NextRequest, NextResponse } from "next/server";

/**
 * RetellAI Webhook Handler
 * 
 * Receives events from RetellAI:
 * - call_started
 * - call_ended
 * - call_analyzed
 * 
 * On call_ended → Triggers GHL workflow to send SMS
 */

const CHECKOUT_URL = "https://sarah.accredipro.academy/checkout-fm-certification-program";

// GHL Webhook URL - create a workflow in GHL that sends SMS
const GHL_WEBHOOK_URL = process.env.GHL_RETELLAI_WEBHOOK || "";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        console.log("[RetellAI Webhook]", JSON.stringify(body, null, 2));

        const { event, call } = body;

        if (event === "call_ended" || event === "call_analyzed") {
            const {
                call_id,
                call_status,
                recording_url,
                retell_llm_dynamic_variables,
            } = call || {};

            // Get lead info
            const firstName = retell_llm_dynamic_variables?.first_name || "there";
            const lastName = retell_llm_dynamic_variables?.last_name || "";
            const email = retell_llm_dynamic_variables?.email || "";
            const phone = retell_llm_dynamic_variables?.phone || "";
            const specialization = retell_llm_dynamic_variables?.specialization || "";

            console.log(`[RetellAI] Call ended: ${firstName} ${lastName} (${phone})`);

            // Trigger GHL workflow to send SMS
            if (GHL_WEBHOOK_URL && phone) {
                try {
                    await fetch(GHL_WEBHOOK_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            first_name: firstName,
                            last_name: lastName,
                            email,
                            phone,
                            specialization,
                            checkout_url: CHECKOUT_URL,
                            coupon_code: "SCHOLARSHIP500",
                            call_id,
                            call_status,
                            recording_url,
                        }),
                    });
                    console.log(`[RetellAI] Triggered GHL workflow for ${phone}`);
                } catch (ghlError) {
                    console.error("[RetellAI] GHL webhook failed:", ghlError);
                }
            }
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("[RetellAI Webhook Error]", error);
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ status: "RetellAI webhook active" });
}
