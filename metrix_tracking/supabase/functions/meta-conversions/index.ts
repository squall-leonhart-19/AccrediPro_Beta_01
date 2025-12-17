// ============================================
// META CONVERSIONS API - EDGE FUNCTION
// ============================================
// Deploy to Supabase: supabase functions deploy meta-conversions
// ============================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

// Environment variables (set in Supabase Dashboard → Edge Functions → Secrets)
const PIXEL_ID = Deno.env.get("META_PIXEL_ID");
const ACCESS_TOKEN = Deno.env.get("META_ACCESS_TOKEN");
const TEST_EVENT_CODE = Deno.env.get("META_TEST_EVENT_CODE"); // Optional: for testing

// Supported event names
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
  client_ip?: string;
  user_agent?: string;
  event_source_url?: string;
  value?: number;
  currency?: string;
  content_name?: string;
  external_id?: string;
}

// Hash function for PII (required by Meta)
async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Generate unique event ID for deduplication
function generateEventId(): string {
  return crypto.randomUUID();
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validate credentials
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.error("Missing META_PIXEL_ID or META_ACCESS_TOKEN");
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const payload: EventPayload = await req.json();
    const {
      event_name,
      email,
      phone,
      first_name,
      last_name,
      fbc,
      fbp,
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
      return new Response(
        JSON.stringify({ error: "event_name is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build user_data object with hashed PII
    const userData: Record<string, unknown> = {};

    if (email) {
      userData.em = [await hashData(email)];
    }
    if (phone) {
      // Remove non-digits and hash
      userData.ph = [await hashData(phone.replace(/\D/g, ""))];
    }
    if (first_name) {
      userData.fn = [await hashData(first_name)];
    }
    if (last_name) {
      userData.ln = [await hashData(last_name)];
    }
    if (fbc) {
      userData.fbc = fbc;
    }
    if (fbp) {
      userData.fbp = fbp;
    }
    if (client_ip) {
      userData.client_ip_address = client_ip;
    }
    if (user_agent) {
      userData.client_user_agent = user_agent;
    }
    if (external_id) {
      userData.external_id = [await hashData(external_id)];
    }

    // Generate unique event ID for deduplication
    const eventId = generateEventId();

    // Build the Meta API payload
    const metaPayload: Record<string, unknown> = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: event_source_url || "https://your-domain.com",
          action_source: "website",
          user_data: userData,
        },
      ],
    };

    // Add custom_data for purchase events
    if (value !== undefined || content_name) {
      const customData: Record<string, unknown> = {};
      if (value !== undefined) {
        customData.value = value;
        customData.currency = currency || "USD";
      }
      if (content_name) {
        customData.content_name = content_name;
      }
      (metaPayload.data as Record<string, unknown>[])[0].custom_data = customData;
    }

    // Add test event code if in test mode
    if (TEST_EVENT_CODE) {
      metaPayload.test_event_code = TEST_EVENT_CODE;
    }

    console.log("Sending to Meta:", JSON.stringify(metaPayload, null, 2));

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
    console.log("Meta response:", JSON.stringify(metaResult, null, 2));

    // Return response
    return new Response(
      JSON.stringify({
        success: metaResponse.ok,
        event_id: eventId,
        events_received: metaResult.events_received,
        messages: metaResult.messages,
        fbtrace_id: metaResult.fbtrace_id,
      }),
      {
        status: metaResponse.ok ? 200 : 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
