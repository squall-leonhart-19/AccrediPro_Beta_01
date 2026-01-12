import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Board member personas
const BOARD_MEMBERS = {
    zuckerberg: {
        name: "Mark Zuckerberg",
        role: "Scale & Network Effects",
        system: `You are Mark Zuckerberg, CEO of Meta. You think in terms of:
- Scale and network effects
- Community building and engagement loops
- Social proof and viral growth
- Platform ecosystems and interconnections
- Long-term market dominance through network lock-in

Be direct, data-driven, and focused on how to make things scale exponentially. Always ask: how can we get 10x more users engaged?`
    },
    bezos: {
        name: "Jeff Bezos",
        role: "Customer Obsession",
        system: `You are Jeff Bezos, founder of Amazon. You think in terms of:
- Customer obsession above all else
- Working backwards from the customer outcome
- Long-term thinking over short-term gains
- Flywheel effects and compounding advantages
- Operational excellence and continuous improvement

Be methodical, customer-focused, and think in flywheels. Start every answer by considering what the customer truly needs.`
    },
    musk: {
        name: "Elon Musk",
        role: "First Principles",
        system: `You are Elon Musk, CEO of Tesla and SpaceX. You think in terms of:
- First principles reasoning - break down to fundamental truths
- Radical innovation and questioning assumptions
- 10x improvements, not incremental
- Speed of execution and iteration
- Physics-based thinking about what's actually possible

Be bold, unconventional, and challenge every assumption. Ask: what would this look like if we rebuilt it from scratch?`
    },
    altman: {
        name: "Sam Altman",
        role: "AI & Future Trends",
        system: `You are Sam Altman, CEO of OpenAI. You think in terms of:
- AI-first approaches to every problem
- Exponential technology curves
- Future trends and timing
- Developer ecosystems and platforms
- Responsible scaling and alignment

Be thoughtful about AI implications, optimistic about technology, and focused on how AI can accelerate everything.`
    }
};

// POST - Run board debate
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { problem } = body;

        if (!problem || typeof problem !== "string") {
            return NextResponse.json(
                { error: "Problem description required" },
                { status: 400 }
            );
        }

        // Get responses from each board member
        const responses = await Promise.all(
            Object.entries(BOARD_MEMBERS).map(async ([key, member]) => {
                const response = await anthropic.messages.create({
                    model: "claude-haiku-4-5-20251001",
                    max_tokens: 200,
                    messages: [
                        {
                            role: "user",
                            content: `${member.system}\n\nThe CEO has presented this business problem:\n\n"${problem}"\n\nProvide your perspective in 2-3 sentences. Be direct and actionable. Stay in character.`
                        }
                    ],
                });

                const opinion = response.content[0]?.type === "text"
                    ? response.content[0].text
                    : "No response";

                return {
                    member: member.name,
                    role: member.role,
                    opinion
                };
            })
        );

        // Generate consensus
        const consensusPrompt = `Based on these perspectives from a board meeting:

${responses.map(r => `${r.member} (${r.role}): ${r.opinion}`).join('\n\n')}

The original problem was: "${problem}"

Synthesize these perspectives into a single, actionable CONSENSUS recommendation. Be specific and practical. Start with "CONSENSUS:" and keep it to 2-3 sentences.`;

        const consensusResponse = await anthropic.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 150,
            messages: [{ role: "user", content: consensusPrompt }],
        });

        const consensus = consensusResponse.content[0]?.type === "text"
            ? consensusResponse.content[0].text
            : "CONSENSUS: Review the individual perspectives and prioritize based on your specific context.";

        return NextResponse.json({
            success: true,
            problem,
            responses,
            consensus,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Board room error:", error);
        return NextResponse.json(
            { error: "Failed to run board debate" },
            { status: 500 }
        );
    }
}
