/**
 * META TRACKING - Client-side utility
 *
 * Captures fbclid, fbc, fbp for server-side conversion tracking.
 * Use with /api/meta-conversions endpoint.
 */

export interface MetaTrackingData {
  fbclid?: string;
  fbc?: string;
  fbp?: string;
  event_source_url: string;
  user_agent: string;
}

const STORAGE_KEY = "meta_tracking";

/**
 * Initialize Meta tracking - call on page load
 * Captures fbclid from URL and reads existing cookies
 */
export function initMetaTracking(): void {
  if (typeof window === "undefined") return;

  const params = captureFromUrl();
  const cookies = captureFromCookies();

  const existing = getStoredData();
  const merged = {
    ...existing,
    ...cookies,
    ...(params.fbclid ? params : {}),
    captured_at: new Date().toISOString(),
  };

  storeData(merged);
}

/**
 * Capture fbclid from URL parameters
 */
function captureFromUrl(): { fbclid?: string } {
  if (typeof window === "undefined") return {};
  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get("fbclid");
  return fbclid ? { fbclid } : {};
}

/**
 * Capture _fbc and _fbp cookies set by Meta Pixel
 */
function captureFromCookies(): { fbc?: string; fbp?: string } {
  if (typeof document === "undefined") return {};

  const getCookie = (name: string): string | undefined => {
    const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
    return match ? match.pop() : undefined;
  };

  return {
    fbc: getCookie("_fbc"),
    fbp: getCookie("_fbp"),
  };
}

/**
 * Store tracking data in localStorage
 */
function storeData(data: Record<string, unknown>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage might be unavailable
  }
}

/**
 * Get stored tracking data
 */
function getStoredData(): Record<string, unknown> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Get all tracking data needed for API calls
 */
export function getMetaTrackingData(): MetaTrackingData {
  if (typeof window === "undefined") {
    return {
      event_source_url: "",
      user_agent: "",
    };
  }

  const stored = getStoredData();
  const cookies = captureFromCookies();

  return {
    fbclid: stored.fbclid as string | undefined,
    fbc: cookies.fbc || (stored.fbc as string | undefined),
    fbp: cookies.fbp || (stored.fbp as string | undefined),
    event_source_url: window.location.href,
    user_agent: navigator.userAgent,
  };
}

// ============================================
// EVENT TRACKING FUNCTIONS
// ============================================

interface TrackOptions {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  external_id?: string;
  value?: number;
  currency?: string;
  content_name?: string;
}

async function sendMetaEvent(
  eventName: string,
  options: TrackOptions = {}
): Promise<{ success: boolean; event_id?: string; error?: string }> {
  try {
    const trackingData = getMetaTrackingData();

    const response = await fetch("/api/meta-conversions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: eventName,
        ...options,
        ...trackingData,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("[MetaTracking] Error:", result);
      return { success: false, error: result.error };
    }

    console.log(`[MetaTracking] ✅ ${eventName} sent`);
    return { success: true, event_id: result.event_id };
  } catch (error) {
    console.error("[MetaTracking] Failed:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Track Lead - when user submits optin form
 */
export async function trackLead(email: string, options: Omit<TrackOptions, "email"> = {}) {
  return sendMetaEvent("Lead", { email, ...options });
}

/**
 * Track CompleteRegistration - when user creates account
 */
export async function trackCompleteRegistration(
  email: string,
  options: Omit<TrackOptions, "email"> = {}
) {
  return sendMetaEvent("CompleteRegistration", { email, ...options });
}

/**
 * Track StartMiniDiploma - when user starts free mini diploma
 */
export async function trackStartMiniDiploma(
  email: string,
  options: Omit<TrackOptions, "email"> = {}
) {
  return sendMetaEvent("StartMiniDiploma", {
    email,
    content_name: "Mini Diploma",
    ...options,
  });
}

/**
 * Track CompleteMiniDiploma - when user finishes mini diploma
 */
export async function trackCompleteMiniDiploma(
  email: string,
  options: Omit<TrackOptions, "email"> = {}
) {
  return sendMetaEvent("CompleteMiniDiploma", {
    email,
    content_name: "Mini Diploma",
    ...options,
  });
}

/**
 * Track InitiateCheckout - when user views checkout page
 */
export async function trackInitiateCheckout(
  email: string,
  value: number,
  options: Omit<TrackOptions, "email" | "value"> = {}
) {
  return sendMetaEvent("InitiateCheckout", {
    email,
    value,
    currency: options.currency || "USD",
    ...options,
  });
}

/**
 * Track Purchase - when payment is successful
 */
export async function trackPurchase(
  email: string,
  value: number,
  options: Omit<TrackOptions, "email" | "value"> = {}
) {
  return sendMetaEvent("Purchase", {
    email,
    value,
    currency: options.currency || "USD",
    content_name: options.content_name || "Certification Course",
    ...options,
  });
}
