import { NextRequest, NextResponse } from "next/server";

const NEVERBOUNCE_API_KEY = "private_24348c043e976eac7dda9ab312bf63a4"; // Ideally this should be in .env

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ valid: false, message: "Email is required" }, { status: 400 });
        }

        // Call NeverBounce Single Verification API
        // https://developers.neverbounce.com/docs/single-validation
        const response = await fetch(`https://api.neverbounce.com/v4/single/check?key=${NEVERBOUNCE_API_KEY}&email=${encodeURIComponent(email)}`);
        const data = await response.json();

        // Valid statuses: 'valid', 'catchall', 'unknown' (we usually accept unknown to avoid blocking real people if API fails)
        // Invalid statuses: 'invalid', 'disposable'
        const isValid = data.result === "valid" || data.result === "catchall" || data.result === "unknown";

        if (!isValid) {
            return NextResponse.json({
                valid: false,
                message: "Please provide a valid email address.",
                result: data.result
            });
        }

        return NextResponse.json({ valid: true, result: data.result });

    } catch (error) {
        console.error("NeverBounce API Error:", error);
        // Fallback: allow the user if verification fails (fail open)
        return NextResponse.json({ valid: true, message: "Verification skipped due to error" });
    }
}
