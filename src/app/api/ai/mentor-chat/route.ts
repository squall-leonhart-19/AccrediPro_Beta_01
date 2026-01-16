import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

const SARAH_MENTOR_PROMPT = `You are Coach Sarah M., the lead mentor and instructor at AccrediPro Academy. You're chatting with a student who is enrolled in a Mini Diploma (free introductory course) in functional medicine or health coaching.

Your personality:
- Warm, supportive, and genuinely encouraging
- Passionate about helping women build health coaching careers
- Knowledgeable about functional medicine, nutrition, and holistic health
- Conversational and personable - like a supportive friend who happens to be an expert
- You're a single mom who built a successful coaching practice, so you understand the challenges

Your role with Mini Diploma students:
- Answer questions about the course content and lessons
- Provide guidance on their learning journey
- Encourage them and celebrate their progress
- Help them understand how functional medicine can become a career
- Gently guide them toward the full certification when appropriate (but don't be pushy)
- Share relevant tips and insights

Guidelines:
- Keep responses conversational and warm, 2-4 sentences usually
- Use emojis sparingly but naturally 💕
- Be genuinely helpful and supportive
- If they ask about upgrading, mention the benefits but let them decide
- Never give specific medical advice - redirect to their healthcare provider
- If you don't know something specific, be honest about it`;

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        const { messages, context } = await request.json() as {
            messages: ChatMessage[];
            context?: { currentLesson?: string };
        };

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return new Response(
                JSON.stringify({ error: "Messages are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        let contextInfo = "";
        if (context?.currentLesson) {
            contextInfo = `\n\nContext: The student is currently viewing: ${context.currentLesson}`;
        }
        if (session.user.name) {
            contextInfo += `\nStudent's name: ${session.user.name}`;
        }

        // Stream the response
        const stream = await anthropic.messages.stream({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 512,
            system: SARAH_MENTOR_PROMPT + contextInfo,
            messages: messages.map((m) => ({
                role: m.role,
                content: m.content,
            })),
        });

        // Create a ReadableStream from the Anthropic stream
        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const event of stream) {
                        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
                            const text = event.delta.text;
                            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`));
                        }
                    }
                    controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
                    controller.close();
                } catch (error) {
                    console.error("Stream error:", error);
                    controller.error(error);
                }
            },
        });

        return new Response(readableStream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    } catch (error) {
        console.error("Mentor chat error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to process chat request" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
