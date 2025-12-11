import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

// POST - Track a download or resource access
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { resourceType, resourceId, resourceName, action = "download" } = body;

        if (!resourceType || !resourceName) {
            return NextResponse.json({ error: "Resource type and name required" }, { status: 400 });
        }

        // Get IP and user agent for tracking
        let ipAddress: string | null = null;
        let userAgent: string | null = null;
        try {
            const headersList = await headers();
            ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] ||
                headersList.get("x-real-ip") || null;
            userAgent = headersList.get("user-agent");
        } catch {
            // Headers might not be available
        }

        // Create activity log entry
        const activity = await prisma.userActivity.create({
            data: {
                userId: session.user.id,
                action: action,
                metadata: {
                    resourceType,
                    resourceId,
                    resourceName,
                    timestamp: new Date().toISOString(),
                },
                ipAddress,
                userAgent,
            },
        });

        return NextResponse.json({ success: true, activityId: activity.id });
    } catch (error) {
        console.error("Track activity error:", error);
        return NextResponse.json({ error: "Failed to track activity" }, { status: 500 });
    }
}
