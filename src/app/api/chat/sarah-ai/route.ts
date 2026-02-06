import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildAnthropicMessages } from "@/config/sarah-knowledge";

/**
 * Sarah AI Chat API
 * 
 * Uses Claude Sonnet 4.5 to answer follow-up questions as Sarah Mitchell.
 * Called after the scholarship autopilot has completed (approval sent).
 * Implements Hormozi closer framework for maximum conversion.
 */

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            message,
            chatHistory = [],
            firstName,
            amount,
            couponCode,
            checkoutUrl,
        } = body;

        if (!message || !firstName) {
            return NextResponse.json(
                { error: "message and firstName are required" },
                { status: 400 }
            );
        }

        // Build messages for Anthropic
        const { system, messages: historyMessages } = buildAnthropicMessages(
            chatHistory,
            { firstName, amount, couponCode, checkoutUrl }
        );

        // Add the current user message
        const allMessages = [
            ...historyMessages,
            { role: "user" as const, content: message },
        ];

        // Dedupe: ensure no consecutive same-role messages
        const dedupedMessages: { role: "user" | "assistant"; content: string }[] = [];
        for (const msg of allMessages) {
            if (dedupedMessages.length > 0 && dedupedMessages[dedupedMessages.length - 1].role === msg.role) {
                // Merge with previous
                dedupedMessages[dedupedMessages.length - 1].content += "\n" + msg.content;
            } else {
                dedupedMessages.push({ ...msg });
            }
        }

        // Ensure first message is from user
        if (dedupedMessages.length > 0 && dedupedMessages[0].role !== "user") {
            dedupedMessages.shift();
        }

        // Ensure last message is from user
        if (dedupedMessages.length > 0 && dedupedMessages[dedupedMessages.length - 1].role !== "user") {
            dedupedMessages.pop();
        }

        console.log(`[Sarah AI] Processing message from ${firstName}: "${message.substring(0, 50)}..."`);

        const response = await anthropic.messages.create({
            model: "claude-sonnet-4-5-20250929",
            max_tokens: 300,
            system,
            messages: dedupedMessages,
        });

        const aiResponse = response.content[0].type === "text"
            ? response.content[0].text
            : "";

        console.log(`[Sarah AI] Response: "${aiResponse.substring(0, 80)}..."`);

        return NextResponse.json({
            success: true,
            response: aiResponse,
        });

    } catch (error) {
        console.error("[Sarah AI] Error:", error);
        return NextResponse.json(
            { error: "Failed to generate response", success: false },
            { status: 500 }
        );
    }
}
