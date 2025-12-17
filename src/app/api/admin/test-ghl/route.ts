import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Test endpoint to verify GHL webhook is working
 * GET /api/admin/test-ghl
 */
export async function GET() {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const webhookUrl = process.env.GHL_WEBHOOK_URL;

    if (!webhookUrl) {
        return NextResponse.json({
            success: false,
            error: "GHL_WEBHOOK_URL not configured in environment",
            envCheck: {
                hasWebhookUrl: false,
            }
        });
    }

    // Test payload matching GHL expected format
    const testPayload = {
        // Standard GHL contact fields
        first_name: "Test",
        last_name: "User",
        email: `test-${Date.now()}@accredipro.test`,
        phone: "+11234567890",

        // Source/tags
        source: "AccrediPro Mini Diploma Test",
        tags: "mini-diploma-lead,test",

        // Custom fields
        custom_field_mini_diploma: "true",
        custom_field_signup_date: new Date().toISOString(),
    };

    console.log("[GHL-TEST] Sending test payload:", JSON.stringify(testPayload, null, 2));
    console.log("[GHL-TEST] Webhook URL:", webhookUrl);

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(testPayload),
        });

        const responseText = await response.text();
        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch {
            responseData = responseText;
        }

        console.log("[GHL-TEST] Response status:", response.status);
        console.log("[GHL-TEST] Response body:", responseData);

        return NextResponse.json({
            success: response.ok,
            webhookUrl: webhookUrl.substring(0, 50) + "...",
            testPayload,
            response: {
                status: response.status,
                statusText: response.statusText,
                body: responseData,
            }
        });
    } catch (error) {
        console.error("[GHL-TEST] Error:", error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            webhookUrl: webhookUrl.substring(0, 50) + "...",
        });
    }
}
