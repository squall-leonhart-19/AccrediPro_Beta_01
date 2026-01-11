import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateMessage, generateMorningCheckIn } from "@/lib/oracle/ai-client";
import { prisma } from "@/lib/prisma";

// POST - Generate AI content
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { type, userId, context, template } = body;

        if (!userId || !type) {
            return NextResponse.json(
                { error: "userId and type required" },
                { status: 400 }
            );
        }

        // Generate content based on type
        if (type === "morning_checkin") {
            const message = await generateMorningCheckIn(userId);
            return NextResponse.json({ content: message });
        }

        // Generate message (dm, email, push)
        const result = await generateMessage({
            userId,
            type,
            context: context || "General check-in",
            template,
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error generating content:", error);
        return NextResponse.json(
            { error: "Failed to generate content" },
            { status: 500 }
        );
    }
}

// GET - Generate quick preview
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const type = searchParams.get("type") as "dm" | "email" | "push";

        if (!userId || !type) {
            return NextResponse.json(
                { error: "userId and type required" },
                { status: 400 }
            );
        }

        const result = await generateMessage({
            userId,
            type,
            context: "Quick preview",
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error generating preview:", error);
        return NextResponse.json(
            { error: "Failed to generate preview" },
            { status: 500 }
        );
    }
}
