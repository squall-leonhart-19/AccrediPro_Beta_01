import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { triggerAutoMessage } from "@/lib/auto-messages";

/**
 * POST /api/auto-message
 *
 * Triggers an auto-message for the current user.
 * Used by client components to trigger DMs on events like lesson completion.
 *
 * Body: { trigger: string, triggerValue?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { trigger, triggerValue } = body;

    if (!trigger) {
      return NextResponse.json({ error: "Trigger is required" }, { status: 400 });
    }

    // Trigger the auto-message
    await triggerAutoMessage({
      userId: session.user.id,
      trigger,
      triggerValue,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Auto-message error:", error);
    return NextResponse.json(
      { error: "Failed to trigger auto-message" },
      { status: 500 }
    );
  }
}
