
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { anthropic } from "@/lib/ai";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { ticketId } = await request.json();

        if (!ticketId) {
            return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
        }

        // Fetch ticket and messages
        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
            include: {
                messages: {
                    orderBy: { createdAt: "asc" },
                    include: { sentBy: { select: { firstName: true } } }
                },
            },
        });

        if (!ticket) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        // Construct conversation history for prompt
        const history = ticket.messages.map(m =>
            `${m.isFromCustomer ? "Customer" : "Support Agent"}: ${m.content}`
        ).join("\n\n");

        const prompt = `You are an expert support agent for AccrediPro LMS. Draft a helpful, professional, and concise reply to the customer based on the conversation history below.

Context:
- Customer Name: ${ticket.customerName}
- Ticket Subject: ${ticket.subject}
- Ticket Status: ${ticket.status}

Conversation History:
${history}

Draft Reply (only the text of the reply, no preamble):`;

        const response = await anthropic.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
        });

        const textBlock = response.content.find((block) => block.type === "text");
        const reply = textBlock?.type === "text" ? textBlock.text : "";

        if (!reply) {
            return NextResponse.json({ error: "Failed to generate reply" }, { status: 500 });
        }

        return NextResponse.json({ reply });

    } catch (error) {
        console.error("[AI Reply] Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
