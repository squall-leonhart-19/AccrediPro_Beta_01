import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/pod/message - Save user message to database
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { content, daysSinceEnrollment, aiResponderName, aiResponse } = body;

        if (!content || typeof daysSinceEnrollment !== "number") {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Save message to database
        const message = await prisma.podUserMessage.create({
            data: {
                userId: session.user.id,
                content: content.substring(0, 5000), // Limit content length
                daysSinceEnrollment,
                aiResponderName: aiResponderName || null,
                aiResponse: aiResponse?.substring(0, 5000) || null,
            },
        });

        return NextResponse.json({ success: true, id: message.id });
    } catch (error) {
        console.error("[Pod Message] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
