import { NextRequest, NextResponse } from "next/server";
import { verifyEmail, isValidEmailSyntax, isDisposableEmail } from "@/lib/neverbounce";

/**
 * PUBLIC API - Check email validity without creating account
 * Used for pre-validation before signup
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({
        isValid: false,
        result: "invalid",
        reason: "Please enter an email address.",
      });
    }

    const emailLower = email.toLowerCase().trim();

    // Quick syntax check
    if (!isValidEmailSyntax(emailLower)) {
      return NextResponse.json({
        isValid: false,
        result: "invalid",
        reason: "Please enter a valid email address.",
      });
    }

    // Quick disposable check (local, no API call)
    if (isDisposableEmail(emailLower)) {
      return NextResponse.json({
        isValid: false,
        result: "disposable",
        reason: "Temporary emails are not allowed. Please use a permanent email address.",
      });
    }

    // Full NeverBounce verification
    const verification = await verifyEmail(emailLower);

    return NextResponse.json({
      isValid: verification.isValid,
      result: verification.result,
      reason: verification.reason,
      suggestedEmail: verification.suggestedEmail,
    });
  } catch (error) {
    console.error("Check email error:", error);
    return NextResponse.json({
      isValid: false,
      result: "error",
      reason: "Could not verify email. Please try again.",
    });
  }
}
