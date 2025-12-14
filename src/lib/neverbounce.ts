import NeverBounce from "neverbounce";

/**
 * NeverBounce Email Verification Service
 *
 * Validates emails before registration to prevent:
 * - Fake/disposable emails
 * - Typos in email addresses
 * - Invalid mailboxes
 *
 * Result codes:
 * - valid: Email is valid and deliverable
 * - invalid: Email is invalid (bad syntax, domain doesn't exist, etc.)
 * - disposable: Temporary/disposable email (we reject these)
 * - catchall: Domain accepts all emails (risky but acceptable)
 * - unknown: Could not be verified (allow with caution)
 */

const API_KEY = process.env.NEVERBOUNCE_API_KEY;

// Initialize client only if API key exists
const getClient = () => {
  if (!API_KEY) {
    console.warn("[NEVERBOUNCE] API key not configured");
    return null;
  }
  return new NeverBounce({ apiKey: API_KEY });
};

export interface EmailVerificationResult {
  isValid: boolean;
  result: "valid" | "invalid" | "disposable" | "catchall" | "unknown";
  suggestedEmail?: string;
  reason?: string;
}

/**
 * Verify a single email address
 */
export async function verifyEmail(email: string): Promise<EmailVerificationResult> {
  const client = getClient();

  // If NeverBounce is not configured, allow all emails (graceful degradation)
  if (!client) {
    console.log(`[NEVERBOUNCE] Not configured, allowing email: ${email}`);
    return {
      isValid: true,
      result: "unknown",
      reason: "Email verification not configured",
    };
  }

  try {
    console.log(`[NEVERBOUNCE] Verifying email: ${email}`);

    const response = await client.single.check(email);

    console.log(`[NEVERBOUNCE] Raw response:`, JSON.stringify(response, null, 2));

    // NeverBounce API returns nested response object with string result
    // The response structure is: { response: { status, result, flags, suggested_correction, execution_time } }
    const apiResult = (response as { response?: { result?: string; suggested_correction?: string } }).response;

    // Result can be numeric (0-4) or string ("valid", "invalid", etc.)
    let result: EmailVerificationResult["result"];
    const rawResult = apiResult?.result ?? response.result;

    if (typeof rawResult === "number") {
      // Numeric result codes: 0 = valid, 1 = invalid, 2 = disposable, 3 = catchall, 4 = unknown
      const resultMap: Record<number, EmailVerificationResult["result"]> = {
        0: "valid",
        1: "invalid",
        2: "disposable",
        3: "catchall",
        4: "unknown",
      };
      result = resultMap[rawResult] || "unknown";
    } else if (typeof rawResult === "string") {
      // String result - use directly if valid
      const validResults = ["valid", "invalid", "disposable", "catchall", "unknown"];
      result = validResults.includes(rawResult) ? (rawResult as EmailVerificationResult["result"]) : "unknown";
    } else {
      result = "unknown";
    }

    const suggestedEmail = apiResult?.suggested_correction || response.suggested_correction || undefined;

    console.log(`[NEVERBOUNCE] Result for ${email}: ${result}${suggestedEmail ? ` (suggested: ${suggestedEmail})` : ""}`);

    // Determine if email is acceptable
    // We accept: valid, catchall, unknown
    // We reject: invalid, disposable
    const isValid = ["valid", "catchall", "unknown"].includes(result);

    let reason: string | undefined;
    if (result === "invalid") {
      reason = "This email address appears to be invalid. Please check for typos.";
    } else if (result === "disposable") {
      reason = "Temporary/disposable emails are not allowed. Please use a permanent email address.";
    }

    return {
      isValid,
      result,
      suggestedEmail,
      reason,
    };
  } catch (error) {
    console.error("[NEVERBOUNCE] Verification failed:", error);

    // On error, allow the email (don't block registration due to API issues)
    return {
      isValid: true,
      result: "unknown",
      reason: "Could not verify email, proceeding anyway",
    };
  }
}

/**
 * Quick check if email is obviously invalid (syntax check only)
 * Use this for instant feedback before calling the full API
 */
export function isValidEmailSyntax(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if email domain is a known disposable provider
 * Quick local check before API call
 */
const DISPOSABLE_DOMAINS = [
  "tempmail.com",
  "throwaway.email",
  "guerrillamail.com",
  "10minutemail.com",
  "mailinator.com",
  "yopmail.com",
  "temp-mail.org",
  "fakeinbox.com",
  "trashmail.com",
  "getairmail.com",
];

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.includes(domain);
}
