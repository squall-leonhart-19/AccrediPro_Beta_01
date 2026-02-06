import { NextRequest, NextResponse } from "next/server";

/**
 * RetellAI Webhook Handler
 * 
 * POST /api/retellai/webhook
 * 
 * Receives webhook events from RetellAI when calls end.
 * When Sarah's call ends, triggers Dr. Martinez's call after a delay.
 */

const RETELL_API_KEY = process.env.RETELL_API_KEY || "";
const RETELL_MARTINEZ_AGENT_ID = process.env.RETELL_MARTINEZ_AGENT_ID || "";
const RETELL_MARTINEZ_FROM_NUMBER = process.env.RETELL_MARTINEZ_FROM_NUMBER || "+16463621121";

// In-memory store for call data (in production, use a database)
// Maps Sarah's call_id to the user data needed for Martinez call
const pendingMartinezCalls: Map<string, {
    phone: string;
    firstName: string;
    investmentAmount: string;
    timestamp: number;
}> = new Map();

// Export for use by other routes
export function scheduleMartinezCall(sarahCallId: string, data: {
    phone: string;
    firstName: string;
    investmentAmount: string;
}) {
    pendingMartinezCalls.set(sarahCallId, {
        ...data,
        timestamp: Date.now(),
    });
    console.log(`[Webhook] Scheduled Martinez call for after Sarah call ${sarahCallId}`);
}

async function triggerMartinezCall(phone: string, firstName: string, investmentAmount: string) {
    console.log(`[Webhook] Triggering Dr. Martinez call to ${phone}`);

    const response = await fetch("https://api.retellai.com/v2/create-phone-call", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${RETELL_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from_number: RETELL_MARTINEZ_FROM_NUMBER,
            to_number: phone,
            agent_id: RETELL_MARTINEZ_AGENT_ID,
            retell_llm_dynamic_variables: {
                first_name: firstName,
                investment_amount: investmentAmount || "your amount",
                scholarship_code: `SCHOLARSHIP${investmentAmount || ""}`,
            },
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`RetellAI API error: ${errorText}`);
    }

    return response.json();
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        console.log("[Webhook] Received event:", JSON.stringify(body, null, 2));

        // RetellAI sends call_ended event when call completes
        if (body.event === "call_ended" || body.event === "call_analyzed") {
            const callId = body.call?.call_id || body.call_id;
            const agentId = body.call?.agent_id || body.agent_id;

            console.log(`[Webhook] Call ended: ${callId}, Agent: ${agentId}`);

            // Check if this was Sarah's call and we have pending Martinez data
            const pendingData = pendingMartinezCalls.get(callId);
            if (pendingData) {
                console.log(`[Webhook] Found pending Martinez call for ${pendingData.firstName}`);

                // Wait 45 seconds before calling Martinez
                setTimeout(async () => {
                    try {
                        const result = await triggerMartinezCall(
                            pendingData.phone,
                            pendingData.firstName,
                            pendingData.investmentAmount
                        );
                        console.log("[Webhook] Martinez call triggered:", result);
                    } catch (error) {
                        console.error("[Webhook] Failed to trigger Martinez call:", error);
                    }

                    // Clean up
                    pendingMartinezCalls.delete(callId);
                }, 45000); // 45 second delay

                return NextResponse.json({
                    success: true,
                    message: "Martinez call scheduled for 45 seconds"
                });
            }
        }

        return NextResponse.json({ success: true, message: "Webhook received" });

    } catch (error) {
        console.error("[Webhook Error]", error);
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}
