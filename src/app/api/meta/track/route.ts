import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Meta Conversions API Tracking Endpoint
 *
 * Sends server-side events to Meta for better attribution.
 * Supports: PageView, AddToCart, Lead, InitiateCheckout
 *
 * URL: /api/meta/track
 * Method: POST
 */

const META_PIXEL_ID = process.env.META_PURCHASE_PIXEL_ID || "1287915349067829";
const META_ACCESS_TOKEN = process.env.META_PURCHASE_ACCESS_TOKEN || "EAAHMlaRKtUoBQBe0ZAFZBQPlRv3xujHeDw0y8kGmRewZA9jaqkbnZA5mJxndHZCNmalSrGmr9DlTbNewOdu4INw4xRRZCE4vC0mSvnWsV17sIvklD9X4PbttSgp2lVIOZBQxG9Uq8UVljCsqZA1LSqxlgjDQ1qIN6PctDh3M5LmJBKkqQa0FDQAIoBN1AAIVqwZDZD";
const META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE || "";

// Hash PII for Meta CAPI
function hashForMeta(data: string): string {
  return crypto.createHash("sha256").update(data.toLowerCase().trim()).digest("hex");
}

// Supported event types
type EventType = "PageView" | "AddToCart" | "Lead" | "InitiateCheckout" | "ViewContent";

interface TrackRequest {
  eventType: EventType;
  sourceUrl: string;
  email?: string;
  firstName?: string;
  value?: number;
  currency?: string;
  contentName?: string;
  contentId?: string;
  userAgent?: string;
  clientIpAddress?: string;
  fbc?: string; // Facebook click ID
  fbc?: string; // Facebook click ID
  fbp?: string; // Facebook browser ID
  pixelId?: string; // Override pixel ID
}

async function sendEventToMeta(params: TrackRequest): Promise<{ success: boolean; eventId?: string; error?: string }> {
  const {
    eventType,
    sourceUrl,
    email,
    firstName,
    value,
    currency = "USD",
    contentName,
    contentId,
    userAgent,
    clientIpAddress,
    fbc,
    fbp,
    pixelId,
  } = params;

  // Use override if provided, otherwise default to env var or fallback
  const targetPixelId = pixelId || META_PIXEL_ID;

  const eventId = crypto.randomUUID();

  // Build user data - only include what we have
  const userData: Record<string, unknown> = {};
  if (email) userData.em = [hashForMeta(email)];
  if (firstName) userData.fn = [hashForMeta(firstName)];
  if (clientIpAddress) userData.client_ip_address = clientIpAddress;
  if (userAgent) userData.client_user_agent = userAgent;
  if (fbc) userData.fbc = fbc;
  if (fbp) userData.fbp = fbp;

  // Build custom data based on event type
  const customData: Record<string, unknown> = {};
  if (contentName) customData.content_name = contentName;
  if (contentId) customData.content_ids = [contentId];
  if (value !== undefined) {
    customData.value = value;
    customData.currency = currency;
  }

  const eventData = {
    event_name: eventType,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    event_source_url: sourceUrl,
    action_source: "website",
    user_data: userData,
    ...(Object.keys(customData).length > 0 && { custom_data: customData }),
  };

  try {
    const requestBody: { data: typeof eventData[]; test_event_code?: string } = {
      data: [eventData],
    };
    if (META_TEST_EVENT_CODE) {
      requestBody.test_event_code = META_TEST_EVENT_CODE;
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${targetPixelId}/events?access_token=${META_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(`[Meta CAPI] ${eventType} Error:`, result);
      return { success: false, eventId, error: result.error?.message };
    }

    console.log(`[Meta CAPI] ✅ ${eventType} sent: ${contentName || sourceUrl}`, { event_id: eventId });
    return { success: true, eventId };
  } catch (error) {
    console.error(`[Meta CAPI] ${eventType} Exception:`, error);
    return { success: false, error: String(error) };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, sourceUrl, email, firstName, value, currency, contentName, contentId, fbc, fbp, pixelId } = body;

    // Validate required fields
    if (!eventType || !sourceUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: eventType, sourceUrl" },
        { status: 400 }
      );
    }

    // Validate event type
    const validEvents: EventType[] = ["PageView", "AddToCart", "Lead", "InitiateCheckout", "ViewContent"];
    if (!validEvents.includes(eventType)) {
      return NextResponse.json(
        { success: false, error: `Invalid eventType. Must be one of: ${validEvents.join(", ")}` },
        { status: 400 }
      );
    }

    // Get client info from headers
    const userAgent = request.headers.get("user-agent") || undefined;
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIpAddress = forwardedFor?.split(",")[0].trim() || request.headers.get("x-real-ip") || undefined;

    const result = await sendEventToMeta({
      eventType,
      sourceUrl,
      email,
      firstName,
      value,
      currency,
      contentName,
      contentId,
      userAgent,
      clientIpAddress,
      fbc,
      fbp,
      pixelId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Meta Track] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process tracking request" },
      { status: 500 }
    );
  }
}
