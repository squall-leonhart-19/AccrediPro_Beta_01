/**
 * META CONVERSIONS API - Server-Side Event Sender
 *
 * Use this from API routes to send events directly to Meta CAPI.
 * This bypasses the need for an HTTP request to /api/meta-conversions.
 */

import crypto from "crypto";

const PIXEL_ID = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;

type MetaEventName =
    | "Lead"
    | "CompleteRegistration"
    | "StartMiniDiploma"
    | "CompleteMiniDiploma"
    | "InitiateCheckout"
    | "Purchase"
    | "ViewContent";

interface SendEventParams {
    eventName: MetaEventName;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    fbc?: string;
    fbp?: string;
    externalId?: string;
    clientIp?: string;
    userAgent?: string;
    eventSourceUrl?: string;
    value?: number;
    currency?: string;
    contentName?: string;
}

// Hash PII data as required by Meta
function hashData(data: string): string {
    return crypto
        .createHash("sha256")
        .update(data.toLowerCase().trim())
        .digest("hex");
}

// Generate unique event ID for deduplication
function generateEventId(): string {
    return crypto.randomUUID();
}

/**
 * Send an event to Meta Conversions API (server-side)
 * Call this directly from API routes without making HTTP request
 */
export async function sendMetaEvent(params: SendEventParams): Promise<{
    success: boolean;
    eventId?: string;
    eventsReceived?: number;
    error?: string;
}> {
    // Check if credentials are configured
    if (!PIXEL_ID || !ACCESS_TOKEN) {
        console.warn("[META CAPI] Skipping - credentials not configured");
        return { success: false, error: "Meta credentials not configured" };
    }

    const {
        eventName,
        email,
        phone,
        firstName,
        lastName,
        fbc,
        fbp,
        externalId,
        clientIp,
        userAgent,
        eventSourceUrl,
        value,
        currency,
        contentName,
    } = params;

    try {
        // Build user_data object with hashed PII
        const userData: Record<string, unknown> = {};

        if (email) {
            userData.em = [hashData(email)];
        }
        if (phone) {
            userData.ph = [hashData(phone.replace(/\D/g, ""))];
        }
        if (firstName) {
            userData.fn = [hashData(firstName)];
        }
        if (lastName) {
            userData.ln = [hashData(lastName)];
        }
        if (fbc) {
            userData.fbc = fbc;
        }
        if (fbp) {
            userData.fbp = fbp;
        }
        if (clientIp) {
            userData.client_ip_address = clientIp;
        }
        if (userAgent) {
            userData.client_user_agent = userAgent;
        }
        if (externalId) {
            userData.external_id = [hashData(externalId)];
        }

        const eventId = generateEventId();

        // Build the Meta API payload
        const eventData: Record<string, unknown> = {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            event_source_url: eventSourceUrl || "https://learn.accredipro.academy",
            action_source: "website",
            user_data: userData,
        };

        // Add custom_data for value/purchase events
        if (value !== undefined || contentName) {
            const customData: Record<string, unknown> = {};
            if (value !== undefined) {
                customData.value = value;
                customData.currency = currency || "USD";
            }
            if (contentName) {
                customData.content_name = contentName;
            }
            eventData.custom_data = customData;
        }

        const metaPayload: Record<string, unknown> = {
            data: [eventData],
        };

        // Add test event code if configured
        if (TEST_EVENT_CODE) {
            metaPayload.test_event_code = TEST_EVENT_CODE;
        }

        console.log(`[META CAPI] Sending ${eventName}:`, {
            event_id: eventId,
            email: email ? `${email.substring(0, 3)}***` : undefined,
            has_fbc: !!fbc,
            has_fbp: !!fbp,
        });

        // Send to Meta Conversions API
        const response = await fetch(
            `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(metaPayload),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.error("[META CAPI] API Error:", result);
            return {
                success: false,
                eventId,
                error: result.error?.message || "Meta API error",
            };
        }

        console.log(`[META CAPI] ✅ ${eventName} sent:`, {
            event_id: eventId,
            events_received: result.events_received,
        });

        return {
            success: true,
            eventId,
            eventsReceived: result.events_received,
        };
    } catch (error) {
        console.error("[META CAPI] Error:", error);
        return {
            success: false,
            error: String(error),
        };
    }
}

// Convenience functions for common events

export async function sendLeadEvent(params: {
    email: string;
    firstName?: string;
    lastName?: string;
    contentName?: string;
    clientIp?: string;
    userAgent?: string;
}) {
    return sendMetaEvent({
        eventName: "Lead",
        contentName: params.contentName || "Mini Diploma Sign Up",
        ...params,
    });
}

export async function sendCompleteRegistrationEvent(params: {
    email: string;
    firstName?: string;
    lastName?: string;
    clientIp?: string;
    userAgent?: string;
}) {
    return sendMetaEvent({
        eventName: "CompleteRegistration",
        contentName: "Account Created",
        ...params,
    });
}

export async function sendMiniDiplomaCompleteEvent(params: {
    email: string;
    firstName?: string;
    contentName?: string;
}) {
    return sendMetaEvent({
        eventName: "CompleteMiniDiploma",
        contentName: params.contentName || "Mini Diploma",
        ...params,
    });
}

export async function sendPurchaseEvent(params: {
    email: string;
    value: number;
    currency?: string;
    contentName?: string;
    firstName?: string;
    externalId?: string;
}) {
    return sendMetaEvent({
        eventName: "Purchase",
        currency: params.currency || "USD",
        ...params,
    });
}

export async function sendInitiateCheckoutEvent(params: {
    email: string;
    value: number;
    currency?: string;
    contentName?: string;
}) {
    return sendMetaEvent({
        eventName: "InitiateCheckout",
        currency: params.currency || "USD",
        ...params,
    });
}
