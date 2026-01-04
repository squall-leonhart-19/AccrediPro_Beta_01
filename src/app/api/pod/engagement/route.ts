import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/pod/engagement - Log engagement event
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { eventType, metadata } = body;

        // Validate event type
        const validEventTypes = ['visit', 'message', 'reaction', 'dfy_click', 'educational_view', 'milestone'];
        if (!validEventTypes.includes(eventType)) {
            return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
        }

        // Create engagement record
        const engagement = await prisma.podEngagement.create({
            data: {
                userId: session.user.id,
                eventType,
                metadata: metadata || {},
            },
        });

        return NextResponse.json({ success: true, id: engagement.id });
    } catch (error) {
        console.error("[Pod Engagement] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
