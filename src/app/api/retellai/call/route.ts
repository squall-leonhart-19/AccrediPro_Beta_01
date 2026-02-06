import { NextRequest, NextResponse } from "next/server";

/**
 * RetellAI Two-Call Flow API
 * 
 * POST /api/retellai/call
 * 
 * Triggers the two-call scholarship flow:
 * 1. Sarah (Qualifier) calls immediately
 * 2. Dr. Martinez (Closer) calls after a delay (triggered by webhook)
 */

const RETELL_API_KEY = process.env.RETELL_API_KEY || "";
const RETELL_SARAH_AGENT_ID = process.env.RETELL_SARAH_AGENT_ID || "";
const RETELL_MARTINEZ_AGENT_ID = process.env.RETELL_MARTINEZ_AGENT_ID || "";
const RETELL_SARAH_FROM_NUMBER = process.env.RETELL_SARAH_FROM_NUMBER || "+16466240621";
const RETELL_MARTINEZ_FROM_NUMBER = process.env.RETELL_MARTINEZ_FROM_NUMBER || "+16463621121";

interface CallRequest {
    phone: string;
    firstName: string;
    lastName?: string;
    email?: string;
    specialization?: string;
    incomeGoal?: string;
    currentIncome?: string;
    background?: string;
    experience?: string;
    commitment?: string;
    startTimeline?: string;
    agent?: "sarah" | "martinez"; // Which agent to call
    investmentAmount?: string; // For Martinez call - the amount they committed
}

// Helper to trigger a RetellAI call
async function triggerRetellCall(
    toNumber: string,
    fromNumber: string,
    agentId: string,
    variables: Record<string, string>
) {
    const response = await fetch("https://api.retellai.com/v2/create-phone-call", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${RETELL_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from_number: fromNumber,
            to_number: toNumber,
            agent_id: agentId,
            retell_llm_dynamic_variables: variables,
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
        const body: CallRequest = await req.json();

        const {
            phone,
            firstName,
            lastName = "",
            email = "",
            specialization = "functional medicine",
            incomeGoal = "5000 per month",
            currentIncome = "not specified",
            background = "healthcare professional",
            experience = "some experience",
            commitment = "ready to start",
            startTimeline = "soon",
            agent = "sarah", // Default to Sarah (first call)
            investmentAmount = "",
        } = body;

        // Validate required fields
        if (!phone || !firstName) {
            return NextResponse.json(
                { error: "phone and firstName are required" },
                { status: 400 }
            );
        }

        // Format phone number (ensure it starts with +1 for US)
        let formattedPhone = phone.replace(/\D/g, "");
        if (formattedPhone.length === 10) {
            formattedPhone = "+1" + formattedPhone;
        } else if (!formattedPhone.startsWith("+")) {
            formattedPhone = "+" + formattedPhone;
        }

        // Determine which agent to call
        if (agent === "martinez") {
            // Dr. Martinez call (Call 2)
            console.log(`[RetellAI] Triggering Dr. Martinez call to ${formattedPhone} for ${firstName}`);

            const retellData = await triggerRetellCall(
                formattedPhone,
                RETELL_MARTINEZ_FROM_NUMBER,
                RETELL_MARTINEZ_AGENT_ID,
                {
                    first_name: firstName,
                    phone: formattedPhone, // Pass phone so SMS function can use it
                    user_number: formattedPhone, // Also as user_number
                    investment_amount: investmentAmount || "your amount",
                    scholarship_code: `SCHOLARSHIP${investmentAmount || ""}`,
                }
            );

            console.log("[RetellAI] Dr. Martinez call initiated:", retellData);

            return NextResponse.json({
                success: true,
                agent: "martinez",
                message: `Dr. Martinez call initiated to ${formattedPhone}`,
                callId: retellData.call_id,
            });

        } else {
            // Sarah call (Call 1 - default)
            console.log(`[RetellAI] Triggering Sarah call to ${formattedPhone} for ${firstName}`);

            const retellData = await triggerRetellCall(
                formattedPhone,
                RETELL_SARAH_FROM_NUMBER,
                RETELL_SARAH_AGENT_ID,
                {
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone: formattedPhone,
                    specialization: specialization,
                    income_goal: incomeGoal,
                    current_income: currentIncome,
                    background: background,
                    experience: experience,
                    commitment: commitment,
                    start_timeline: startTimeline,
                }
            );

            console.log("[RetellAI] Sarah call initiated:", retellData);

            return NextResponse.json({
                success: true,
                agent: "sarah",
                message: `Sarah call initiated to ${formattedPhone}`,
                callId: retellData.call_id,
            });
        }

    } catch (error) {
        console.error("[RetellAI Call Error]", error);
        return NextResponse.json(
            { error: "Failed to trigger call", details: String(error) },
            { status: 500 }
        );
    }
}
