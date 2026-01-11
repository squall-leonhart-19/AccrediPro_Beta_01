import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { analyzeUser, generateWeeklyReport } from "@/lib/oracle/ai-client";

// GET - Analyze user or generate report
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const view = searchParams.get("view");

        // Weekly report
        if (view === "weekly-report") {
            const report = await generateWeeklyReport();
            return NextResponse.json(report);
        }

        // User analysis
        if (userId) {
            const analysis = await analyzeUser(userId);
            return NextResponse.json(analysis);
        }

        return NextResponse.json(
            { error: "userId or view=weekly-report required" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error analyzing:", error);
        return NextResponse.json(
            { error: "Failed to analyze" },
            { status: 500 }
        );
    }
}

// POST - Trigger batch analysis
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json(
                { error: "userId required" },
                { status: 400 }
            );
        }

        const analysis = await analyzeUser(userId);

        return NextResponse.json({ success: true, analysis });
    } catch (error) {
        console.error("Error analyzing user:", error);
        return NextResponse.json(
            { error: "Failed to analyze user" },
            { status: 500 }
        );
    }
}
