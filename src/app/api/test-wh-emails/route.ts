import { NextRequest, NextResponse } from "next/server";
import {
  sendWHReminderDay1Email,
  sendWHReminderDay3Email,
  sendWHReminderDay5Email,
  sendWHReminderDay6Email,
} from "@/lib/email";

// One-time test token - delete this file after testing!
const TEST_TOKEN = "wh-test-2026-alessio";

/**
 * GET /api/test-wh-emails?token=xxx&email=xxx
 *
 * Send all Women's Health reminder emails to a test address
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email") || "at.seed019@gmail.com";
    const firstName = searchParams.get("firstName") || "Alessio";

    if (token !== TEST_TOKEN) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.log(`[TEST-WH-EMAILS] Sending test emails to ${email}`);

    const results: { day: string; success: boolean; error?: string }[] = [];

    // Day 1
    const day1 = await sendWHReminderDay1Email(email, firstName);
    results.push({ day: "Day 1 (not started)", success: day1.success, error: day1.error });

    // Day 3 (3 lessons)
    const day3 = await sendWHReminderDay3Email(email, firstName, 3);
    results.push({ day: "Day 3 (3/9 lessons)", success: day3.success, error: day3.error });

    // Day 5 (5 lessons)
    const day5 = await sendWHReminderDay5Email(email, firstName, 5);
    results.push({ day: "Day 5 (5/9 lessons)", success: day5.success, error: day5.error });

    // Day 6 (8 lessons - so close!)
    const day6 = await sendWHReminderDay6Email(email, firstName, 8);
    results.push({ day: "Day 6 (8/9 lessons)", success: day6.success, error: day6.error });

    return NextResponse.json({
      success: true,
      message: `Sent 4 test emails to ${email}`,
      results,
    });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { error: "Failed to send test emails" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const url = new URL(request.url);
  url.searchParams.set("token", body.token || body.secret);
  url.searchParams.set("email", body.email);
  url.searchParams.set("firstName", body.firstName);

  return GET(new NextRequest(url, { method: "GET" }));
}
