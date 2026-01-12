import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

/**
 * META CONVERSIONS API - Server-Side Tracking
 *
 * POST /api/meta-conversions
 *
 * Sends conversion events to Meta (Facebook) for accurate ad tracking.
 * Bypasses iOS 14.5+ restrictions and ad blockers.
 *
 * Events supported:
 * - Lead: Form optin
 * - CompleteRegistration: Account created
 * - StartMiniDiploma: Started free mini diploma
 * - CompleteMiniDiploma: Finished mini diploma
 * - InitiateCheckout: Viewing checkout page
 * - Purchase: Payment completed
 */

// Lead Pixel - for mini diploma optins (META_PIXEL_ID_2 to avoid Vercel conflict)
const PIXEL_ID = process.env.META_PIXEL_ID_2 || "1829815637745689";
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN_2 || "EAAHMlaRKtUoBQVDSsAADRPEPdwAYhmJ3fQvR4lmoIF3bKQkz1VvBxjKhbrkjmAlX4tDwti5SbswSO5E2JHG3BGIMX0yLo30FgFZByJwCnecampjjOL9urgrRJ1ziy3ZASZCGRQZBtnGZCvUAjTHnxXYynU7S1CClKeZBg2aMTc4v7UbkScUk3zD3ZAjZCMKnDAZDZD";
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE; // Optional: for testing

type MetaEventName =
  | "Lead"
  | "CompleteRegistration"
  | "StartMiniDiploma"
  | "CompleteMiniDiploma"
  | "InitiateCheckout"
  | "Purchase"
  | "ViewContent";

interface EventPayload {
  event_name: MetaEventName;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  fbc?: string;
  fbp?: string;
  fbclid?: string;
  client_ip?: string;
  user_agent?: string;
  event_source_url?: string;
  value?: number;
  currency?: string;
  content_name?: string;
  external_id?: string;
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

export async function POST(request: NextRequest) {
  // Validate credentials
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.error("[META] Missing META_PIXEL_ID or META_ACCESS_TOKEN");
    return NextResponse.json(
      { error: "Server configuration error - Meta credentials missing" },
      { status: 500 }
    );
  }

  try {
    const payload: EventPayload = await request.json();
    const {
      event_name,
      email,
      phone,
      first_name,
      last_name,
      fbc,
      fbp,
      fbclid,
      client_ip,
      user_agent,
      event_source_url,
      value,
      currency,
      content_name,
      external_id,
    } = payload;

    // Validate required fields
    if (!event_name) {
      return NextResponse.json(
        { error: "event_name is required" },
        { status: 400 }
      );
    }

    // Get client IP from headers if not provided
    const ip =
      client_ip ||
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "";

    // Get user agent from headers if not provided
    const ua = user_agent || request.headers.get("user-agent") || "";

    // Build user_data object with hashed PII
    const userData: Record<string, unknown> = {};

    if (email) {
      userData.em = [hashData(email)];
    }
    if (phone) {
      userData.ph = [hashData(phone.replace(/\D/g, ""))];
    }
    if (first_name) {
      userData.fn = [hashData(first_name)];
    }
    if (last_name) {
      userData.ln = [hashData(last_name)];
    }
    if (fbc) {
      userData.fbc = fbc;
    } else if (fbclid) {
      // Generate fbc from fbclid if not provided
      // Format: fb.1.{timestamp}.{fbclid}
      userData.fbc = `fb.1.${Date.now()}.${fbclid}`;
    }
    if (fbp) {
      userData.fbp = fbp;
    }
    if (ip) {
      userData.client_ip_address = ip;
    }
    if (ua) {
      userData.client_user_agent = ua;
    }
    if (external_id) {
      userData.external_id = [hashData(external_id)];
    }

    // Generate unique event ID for deduplication
    const eventId = generateEventId();

    // Build the Meta API payload
    const eventData: Record<string, unknown> = {
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      event_source_url: event_source_url || "https://learn.accredipro.academy",
      action_source: "website",
      user_data: userData,
    };

    // Add custom_data for value/purchase events
    if (value !== undefined || content_name) {
      const customData: Record<string, unknown> = {};
      if (value !== undefined) {
        customData.value = value;
        customData.currency = currency || "USD";
      }
      if (content_name) {
        customData.content_name = content_name;
      }
      eventData.custom_data = customData;
    }

    const metaPayload: Record<string, unknown> = {
      data: [eventData],
    };

    // Add test event code if in test mode
    if (TEST_EVENT_CODE) {
      metaPayload.test_event_code = TEST_EVENT_CODE;
    }

    console.log(`[META] Sending ${event_name} event:`, {
      event_id: eventId,
      email: email ? `${email.substring(0, 3)}***` : undefined,
      has_fbc: !!userData.fbc,
      has_fbp: !!fbp,
    });

    // Send to Meta Conversions API
    const metaResponse = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metaPayload),
      }
    );

    const metaResult = await metaResponse.json();

    if (!metaResponse.ok) {
      console.error("[META] API Error:", metaResult);
      return NextResponse.json(
        {
          success: false,
          error: metaResult.error?.message || "Meta API error",
          event_id: eventId,
        },
        { status: 400 }
      );
    }

    console.log(`[META] ✅ ${event_name} sent successfully:`, {
      event_id: eventId,
      events_received: metaResult.events_received,
    });

    // Log to database for tracking (optional)
    try {
      await prisma.metaEventLog.create({
        data: {
          eventName: event_name,
          eventId,
          userEmail: email,
          pixelId: PIXEL_ID,
          payload: metaPayload as object,
          response: metaResult as object,
          status: "success",
        },
      });
    } catch {
      // Table might not exist yet - that's OK
    }

    return NextResponse.json({
      success: true,
      event_id: eventId,
      events_received: metaResult.events_received,
      fbtrace_id: metaResult.fbtrace_id,
    });
  } catch (error) {
    console.error("[META] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
