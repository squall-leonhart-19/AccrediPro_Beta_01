import { NextRequest, NextResponse } from "next/server";
import { processScheduledMessages } from "@/lib/auto-messages";

/**
 * POST /api/cron/process-scheduled-messages
 *
 * Processes pending scheduled voice messages (Sarah's welcome messages).
 * Should be called by a cron job every minute.
 *
 * Vercel cron configured in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/process-scheduled-messages",
 *     "schedule": "* * * * *"
 *   }]
 * }
 */
export async function POST(request: NextRequest) {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // In production, require secret. In dev, allow without.
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        console.log(`[CRON] Processing scheduled messages at ${new Date().toISOString()}`);
        await processScheduledMessages();

        return NextResponse.json({
            success: true,
            message: "Scheduled messages processed",
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error("[CRON] Error:", error);
        return NextResponse.json(
            { error: "Failed to process scheduled messages" },
            { status: 500 }
        );
    }
}

// Also allow GET for manual testing
export async function GET(request: NextRequest) {
    return POST(request);
}
