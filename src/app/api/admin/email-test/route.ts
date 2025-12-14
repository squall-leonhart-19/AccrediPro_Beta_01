import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import NeverBounce from "neverbounce";

// Local validation functions (copied from neverbounce.ts to show both checks)
function isValidEmailSyntax(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

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

function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.includes(domain);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Admin only
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // Run local checks
    const syntaxValid = isValidEmailSyntax(emailLower);
    const isDisposable = isDisposableEmail(emailLower);

    // Check if NeverBounce is configured
    const apiKey = process.env.NEVERBOUNCE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        result: {
          isValid: syntaxValid && !isDisposable,
          result: "unknown",
          reason: "NeverBounce API key not configured - only local checks performed",
          localChecks: {
            syntaxValid,
            isDisposable,
          },
        },
      });
    }

    // Call NeverBounce API
    console.log(`[EMAIL-TEST] Testing email: ${emailLower}`);
    console.log(`[EMAIL-TEST] API Key exists: ${!!apiKey}, Key starts with: ${apiKey.substring(0, 15)}...`);

    try {
      const client = new NeverBounce({ apiKey });
      const response = await client.single.check(emailLower);

      console.log(`[EMAIL-TEST] NeverBounce response:`, JSON.stringify(response, null, 2));

      // NeverBounce API returns nested response object
      // Structure: { response: { status, result, flags, suggested_correction, execution_time } }
      const apiResult = (response as { response?: { result?: string | number; suggested_correction?: string } }).response;
      const rawResult = apiResult?.result ?? response.result;

      // Result can be numeric (0-4) or string ("valid", "invalid", etc.)
      let resultType: string;
      if (typeof rawResult === "number") {
        const resultMap: Record<number, string> = {
          0: "valid",
          1: "invalid",
          2: "disposable",
          3: "catchall",
          4: "unknown",
        };
        resultType = resultMap[rawResult] || "unknown";
      } else if (typeof rawResult === "string") {
        resultType = rawResult;
      } else {
        resultType = "unknown";
      }

      const suggestedEmail = apiResult?.suggested_correction || response.suggested_correction || undefined;

      // Determine if email is acceptable
      const isValid = ["valid", "catchall", "unknown"].includes(resultType);

      let reason: string | undefined;
      if (resultType === "invalid") {
        reason = "This email address appears to be invalid. Please check for typos.";
      } else if (resultType === "disposable") {
        reason = "Temporary/disposable emails are not allowed. Please use a permanent email address.";
      }

      return NextResponse.json({
        success: true,
        result: {
          isValid,
          result: resultType,
          suggestedEmail,
          reason,
          localChecks: {
            syntaxValid,
            isDisposable,
          },
          apiResponse: response,
        },
      });
    } catch (apiError) {
      console.error("[EMAIL-TEST] NeverBounce API error:", apiError);

      return NextResponse.json({
        success: true,
        result: {
          isValid: syntaxValid && !isDisposable,
          result: "unknown",
          reason: `NeverBounce API error: ${apiError instanceof Error ? apiError.message : "Unknown error"}`,
          localChecks: {
            syntaxValid,
            isDisposable,
          },
          apiResponse: { error: apiError instanceof Error ? apiError.message : "Unknown error" },
        },
      });
    }
  } catch (error) {
    console.error("Email test error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to test email" },
      { status: 500 }
    );
  }
}
