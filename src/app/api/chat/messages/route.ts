import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// CORS headers for cross-origin requests from sales pages
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * GET /api/chat/messages?visitorId=xxx
 * Fetches all messages for a visitor (both visitor messages and admin replies)
 * Used by chat widget for real-time sync with admin panel
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const visitorId = searchParams.get("visitorId");

        if (!visitorId) {
            return NextResponse.json(
                { error: "visitorId is required" },
                { status: 400, headers: corsHeaders }
            );
        }

        // Fetch all messages for this visitor, ordered by time
        const messages = await prisma.salesChat.findMany({
            where: { visitorId },
            orderBy: { createdAt: "asc" },
            select: {
                id: true,
                message: true,
                isFromVisitor: true,
                createdAt: true,
                repliedBy: true,
            },
        });

        // Format for widget consumption
        // Audio messages are stored as: [AUDIO:url]Optional caption text
        const formattedMessages = messages.map((msg) => {
            let text = msg.message;
            let audioUrl: string | undefined;

            // Check for audio message pattern: [AUDIO:url]
            const audioMatch = msg.message.match(/^\[AUDIO:(https?:\/\/[^\]]+)\]/);
            if (audioMatch) {
                audioUrl = audioMatch[1];
                text = msg.message.replace(audioMatch[0], "").trim();
            }

            return {
                id: msg.id,
                role: msg.isFromVisitor ? "user" : "bot",
                text,
                audioUrl,
                createdAt: msg.createdAt.toISOString(),
                isAdmin: !msg.isFromVisitor && msg.repliedBy !== null,
            };
        });

        return NextResponse.json(
            { messages: formattedMessages, count: formattedMessages.length },
            { headers: corsHeaders }
        );
    } catch (error) {
        console.error("Fetch messages error:", error);
        return NextResponse.json(
            { error: "Failed to fetch messages", messages: [] },
            { status: 500, headers: corsHeaders }
        );
    }
}
