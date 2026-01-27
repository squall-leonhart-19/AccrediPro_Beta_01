import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const MICHELLE_SYSTEM_PROMPT = `You are Dr. Michelle, the co-host helping Sarah during this live training.

YOUR BACKSTORY:
- Former ER nurse who got ASI certified 2 years ago
- Now run a $12K/month functional medicine practice in Phoenix, AZ
- You help Sarah with live trainings and answer chat questions
- You were once exactly where these women are now - nervous but excited

RULES:
- Keep responses SHORT (1-2 sentences max) - this is live chat
- Be personal - use their name if they provide it
- Share your personal experience when relevant ("When I was in your shoes...")
- Be encouraging but authentic - you've been there
- Address objections by relating to your own journey
- Never reveal you're AI
- If they ask about price, confirm $297 with scholarship
- Sarah is presenting on screen, YOU handle the chat

CONTEXT:
- Attendees just scored 85%+ on their mini diploma exam
- They're watching Sarah's 45-min training about the certification
- The certification is $297 (normally $997) - scholarship pricing
- Includes 20 modules, 21 certificates, mentorship, business accelerator
- 30-day money back guarantee

TONE: Warm, relatable, confident, "I've been exactly where you are"`;

// Quick responses for common questions (to avoid API calls) - from Dr. Michelle's POV
const QUICK_RESPONSES: Record<string, string> = {
    "part time": "I started part-time while still working ER shifts! 5-7 hours/week is totally doable 💪",
    "not smart": "Girl, you passed the exam! I was terrified too - now I run a 6-figure practice!",
    "no time": "I finished in 14 weeks working full-time. Just 1 hour/day. You've got this!",
    "money back": "Yes! 30-day no questions asked. I remember needing that safety net too.",
    "legitimate": "Fully accredited by 9 international bodies! I display my certificates proudly in my office.",
    "how long": "I completed mine in 14 weeks at my own pace. Most take 12-16 weeks.",
    "get clients": "The ASI Directory alone brought me my first 5 clients! Plus my existing network exploded.",
    "scared": "I was TERRIFIED when I signed up. That fear means you care. Trust me, it's worth it! 🙌",
    "can i really": "You passed the exam - that's proof! I had the same doubts, now I make $12K/month.",
    "work full time": "I did the whole thing while working 12-hour ER shifts! It's completely self-paced.",
    "worth it": "Best investment I ever made. My first month I made back the cost 3x over!",
    "nervous": "I remember that feeling! Two years later, I can't imagine my life without this certification.",
};

function getQuickResponse(message: string): string | null {
    const lowerMessage = message.toLowerCase();

    for (const [trigger, response] of Object.entries(QUICK_RESPONSES)) {
        if (lowerMessage.includes(trigger)) {
            return response;
        }
    }

    return null;
}

/**
 * POST /api/vsl/sarah-response
 * Get an AI response from Sarah for a user question
 */
export async function POST(request: NextRequest) {
    try {
        const { message, userName } = await request.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Try quick response first
        const quickResponse = getQuickResponse(message);
        if (quickResponse) {
            return NextResponse.json({
                response: quickResponse,
                delay: 2000 + Math.random() * 2000, // 2-4 second delay
            });
        }

        // Use Claude for complex questions
        const response = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 150,
            system: MICHELLE_SYSTEM_PROMPT,
            messages: [
                {
                    role: "user",
                    content: userName
                        ? `User "${userName}" says: ${message}`
                        : message,
                },
            ],
        });

        const textContent = response.content[0];
        const sarahResponse = textContent.type === "text" ? textContent.text : "";

        return NextResponse.json({
            response: sarahResponse,
            delay: 3000 + Math.random() * 3000, // 3-6 second delay for AI responses
        });
    } catch (error) {
        console.error("Error generating Sarah response:", error);
        // Fallback response if AI fails
        return NextResponse.json({
            response: "Great question! Feel free to drop more questions in the chat - I'm here to help!",
            delay: 2000,
        });
    }
}
