import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  sendWHReminderDay1Email,
  sendWHReminderDay3Email,
  sendWHReminderDay5Email,
  sendWHReminderDay6Email,
} from "@/lib/email";

/**
 * POST /api/admin/test-wh-emails
 *
 * Send all Women's Health reminder emails to a test address
 * Admin only endpoint for testing
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, firstName = "Test" } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

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
