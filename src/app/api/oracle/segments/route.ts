import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
    classifyUser,
    classifyAllUsers,
    getSegmentStats,
    getUsersBySegment,
    getAtRiskUsers
} from "@/lib/oracle/classifier";

// GET - Get segments or classify users
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const view = searchParams.get("view");
        const segment = searchParams.get("segment");
        const userId = searchParams.get("userId");

        // Get stats overview
        if (view === "stats") {
            const stats = await getSegmentStats();
            return NextResponse.json(stats);
        }

        // Get at-risk users
        if (view === "at-risk") {
            const minRisk = parseInt(searchParams.get("minRisk") || "50");
            const users = await getAtRiskUsers(minRisk);
            return NextResponse.json({ users });
        }

        // Get users in a segment
        if (segment) {
            const users = await getUsersBySegment(segment as any);
            return NextResponse.json({ users });
        }

        // Classify single user
        if (userId) {
            const result = await classifyUser(userId);
            return NextResponse.json({ segment: result });
        }

        // Default: return segment stats
        const stats = await getSegmentStats();
        return NextResponse.json(stats);
    } catch (error) {
        console.error("Error with segments:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}

// POST - Trigger batch classification
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { userId, batchAll } = body;

        if (batchAll) {
            const results = await classifyAllUsers({ limit: body.limit || 500 });
            return NextResponse.json(results);
        }

        if (userId) {
            const result = await classifyUser(userId);
            return NextResponse.json({ segment: result });
        }

        return NextResponse.json(
            { error: "userId or batchAll required" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error classifying:", error);
        return NextResponse.json(
            { error: "Failed to classify" },
            { status: 500 }
        );
    }
}
