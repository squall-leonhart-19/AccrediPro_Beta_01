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
        const formattedMessages = messages.map((msg) => ({
            id: msg.id,
            role: msg.isFromVisitor ? "user" : "bot",
            text: msg.message,
            createdAt: msg.createdAt.toISOString(),
            isAdmin: !msg.isFromVisitor && msg.repliedBy !== null,
        }));

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
