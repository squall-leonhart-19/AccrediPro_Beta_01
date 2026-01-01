import { NextRequest, NextResponse } from "next/server";
import {
  sendWHReminderDay1Email,
  sendWHReminderDay3Email,
  sendWHReminderDay5Email,
  sendWHReminderDay6Email,
} from "@/lib/email";

/**
 * POST /api/test-wh-emails
 *
 * Send all Women's Health reminder emails to a test address
 * Protected by secret key
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName = "Test", secret } = body;

    // Simple secret protection
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log(`[TEST-WH-EMAILS] Sending test emails to ${email}`);

    const results: { day: string; success: boolean; error?: string }[] = [];

    // Day 1
    const day1 = await sendWHReminderDay1Email(email, firstName);
    results.push({ day: "Day 1 (not started)", success: day1.success, error: day1.error });
    console.log(`[TEST-WH-EMAILS] Day 1: ${day1.success ? "✅" : "❌"}`);

    // Day 3 (3 lessons)
    const day3 = await sendWHReminderDay3Email(email, firstName, 3);
    results.push({ day: "Day 3 (3/9 lessons)", success: day3.success, error: day3.error });
    console.log(`[TEST-WH-EMAILS] Day 3: ${day3.success ? "✅" : "❌"}`);

    // Day 5 (5 lessons)
    const day5 = await sendWHReminderDay5Email(email, firstName, 5);
    results.push({ day: "Day 5 (5/9 lessons)", success: day5.success, error: day5.error });
    console.log(`[TEST-WH-EMAILS] Day 5: ${day5.success ? "✅" : "❌"}`);

    // Day 6 (8 lessons - so close!)
    const day6 = await sendWHReminderDay6Email(email, firstName, 8);
    results.push({ day: "Day 6 (8/9 lessons)", success: day6.success, error: day6.error });
    console.log(`[TEST-WH-EMAILS] Day 6: ${day6.success ? "✅" : "❌"}`);

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
