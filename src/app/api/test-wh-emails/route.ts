import { NextRequest, NextResponse } from "next/server";
import {
  sendWHReminderDay1Email,
  sendWHReminderDay2Email,
  sendWHReminderDay3Email,
  sendWHReminderDay5Email,
  sendWHReminderDay6Email,
  sendWHExpiredEmail,
  sendWHGraduateWelcomeEmail,
} from "@/lib/email";

// One-time test token - delete this file after testing!
const TEST_TOKEN = "wh-test-2026-alessio";

/**
 * POST /api/test-wh-emails
 *
 * Send all Women's Health emails to a test address
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, email = "at.seed019@gmail.com", firstName = "Alessio" } = body;

    if (token !== TEST_TOKEN) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.log(`[TEST-WH-EMAILS] Sending all test emails to ${email}`);

    const results: { email: string; success: boolean; error?: string }[] = [];
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Day 1 - Not started
    const day1 = await sendWHReminderDay1Email(email, firstName);
    results.push({ email: "Day 1 (not started)", success: day1.success, error: day1.error });
    await delay(1000);

    // Day 2 - Not started (soft nudge)
    const day2a = await sendWHReminderDay2Email(email, firstName, 0);
    results.push({ email: "Day 2 (0 lessons)", success: day2a.success, error: day2a.error });
    await delay(1000);

    // Day 2 - Started (2 lessons)
    const day2b = await sendWHReminderDay2Email(email, firstName, 2);
    results.push({ email: "Day 2 (2 lessons)", success: day2b.success, error: day2b.error });
    await delay(1000);

    // Day 3 - Progress (3 lessons)
    const day3 = await sendWHReminderDay3Email(email, firstName, 3);
    results.push({ email: "Day 3 (3 lessons)", success: day3.success, error: day3.error });
    await delay(1000);

    // Day 5 - Urgency (5 lessons)
    const day5 = await sendWHReminderDay5Email(email, firstName, 5);
    results.push({ email: "Day 5 (5 lessons)", success: day5.success, error: day5.error });
    await delay(1000);

    // Day 6 - Final (8 lessons - so close!)
    const day6 = await sendWHReminderDay6Email(email, firstName, 8);
    results.push({ email: "Day 6 (8 lessons)", success: day6.success, error: day6.error });
    await delay(1000);

    // Expired - Never started
    const exp0 = await sendWHExpiredEmail(email, firstName, 0);
    results.push({ email: "Expired (0 lessons)", success: exp0.success, error: exp0.error });
    await delay(1000);

    // Expired - Partial (6 lessons)
    const exp6 = await sendWHExpiredEmail(email, firstName, 6);
    results.push({ email: "Expired (6 lessons)", success: exp6.success, error: exp6.error });
    await delay(1000);

    // Graduate Welcome
    const grad = await sendWHGraduateWelcomeEmail(email, firstName);
    results.push({ email: "Graduate Welcome", success: grad.success, error: grad.error });

    const successCount = results.filter(r => r.success).length;

    return NextResponse.json({
      success: true,
      message: `Sent ${successCount}/${results.length} test emails to ${email}`,
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email") || "at.seed019@gmail.com";
  const firstName = searchParams.get("firstName") || "Alessio";

  return POST(new NextRequest(request.url, {
    method: "POST",
    body: JSON.stringify({ token, email, firstName }),
    headers: { "Content-Type": "application/json" },
  }));
}
