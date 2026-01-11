import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { trackEvent, getUserEvents, getRecentEvents, getTodayEventStats } from "@/lib/oracle";

// POST - Track a new event
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, event, metadata, source, sessionId } = body;

        if (!userId || !event) {
            return NextResponse.json(
                { error: "userId and event are required" },
                { status: 400 }
            );
        }

        const oracleEvent = await trackEvent({
            userId,
            event,
            metadata,
            source,
            sessionId,
        });

        return NextResponse.json({ success: true, event: oracleEvent });
    } catch (error) {
        console.error("Error tracking event:", error);
        return NextResponse.json(
            { error: "Failed to track event" },
            { status: 500 }
        );
    }
}

// GET - Get events (admin only)
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const limit = parseInt(searchParams.get("limit") || "50");
        const view = searchParams.get("view"); // "feed" for live feed

        if (view === "feed") {
            const events = await getRecentEvents(limit);
            return NextResponse.json({ events });
        }

        if (view === "stats") {
            const stats = await getTodayEventStats();
            return NextResponse.json({ stats });
        }

        if (userId) {
            const events = await getUserEvents(userId, { limit });
            return NextResponse.json({ events });
        }

        // Default: recent events
        const events = await getRecentEvents(limit);
        return NextResponse.json({ events });
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json(
            { error: "Failed to fetch events" },
            { status: 500 }
        );
    }
}
