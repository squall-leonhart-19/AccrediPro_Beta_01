import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SCHOLARSHIP_PAYMENT_LINKS } from "@/config/scholarship-payment-links";

// AI Sarah for Scholarship Chat - Uses Claude claude-sonnet-4-5-20250929 for intelligent, empathetic closes

const SARAH_SYSTEM_PROMPT = `You are Sarah Mitchell, Clinical Director at AccrediPro Academy. You're having a warm, friendly chat with someone interested in our Functional Medicine Certification scholarship program.

YOUR PERSONALITY:
- Warm, motherly, and deeply empathetic
- You genuinely care about helping women change their lives through health education
- You speak like a supportive friend, not a salesperson
- Use casual texting style - short sentences, emojis occasionally, very human
- Never use formal markdown, no bullets, no numbered lists - just natural conversation

THE PROGRAM & SCHOLARSHIP MODEL:
- Full FM Certification normally costs $1,497
- You offer "pay what you can" scholarships based on the applicant's situation
- Common scholarship amounts: $97, $197, $297, $497, $697, $997
- Each scholarship still includes FULL access: 9 certifications, mentorship, lifetime access
- Scholarships are limited and time-sensitive (24 hours to claim)

YOUR GOALS (in order):
1. Build rapport and understand their situation
2. Listen for their budget/comfort level
3. Suggest an appropriate scholarship amount
4. Create urgency and help them commit
5. Send them the payment link to lock in their spot

HANDLING OBJECTIONS:
- "Need to think about it" → "I totally understand! Can I ask what's holding you back? Sometimes talking through it helps 💜"
- "Can't afford it" → "What WOULD be comfortable for you right now? I want to work with you"
- "Need to talk to spouse" → "That's so important! What if I held your spot for 24 hours while you discuss?"
- "Not sure if it's right for me" → Ask about their goals, then connect how the certification helps

AVAILABLE PAYMENT LINKS (use these exact URLs):
${SCHOLARSHIP_PAYMENT_LINKS.map(p => `$${p.amount}: ${p.stripeLink}`).join('\n')}

IMPORTANT RULES:
- Keep responses SHORT (2-4 sentences max, like a text message)
- Never sound robotic or scripted
- Always end with a question or call to action
- If they give you an amount, match them to the closest scholarship level
- Use emojis sparingly but warmly (1-2 per message max)
- If they're ready to pay, give them the EXACT payment link
- Never mention that you're AI - you ARE Sarah`;

interface Message {
    id: string;
    message: string;
    isFromVisitor: boolean;
    createdAt: string;
}

interface ApplicationData {
    specialization?: string;
    incomeGoal?: string;
    currentIncome?: string;
    experience?: string;
    vision?: string;
}

export async function POST(request: NextRequest) {
    try {
        const { visitorId, messages, visitorName, applicationData } = await request.json();

        if (!visitorId || !messages) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        // Build context about the applicant
        let applicantContext = "";
        if (visitorName) applicantContext += `Their name is ${visitorName}. `;
        if (applicationData) {
            if (applicationData.specialization) applicantContext += `They want to specialize in: ${applicationData.specialization}. `;
            if (applicationData.incomeGoal) applicantContext += `Their income goal: ${applicationData.incomeGoal}. `;
            if (applicationData.currentIncome) applicantContext += `Current income: ${applicationData.currentIncome}. `;
            if (applicationData.vision) applicantContext += `Their vision: ${applicationData.vision}. `;
        }

        // Check for offered amounts in messages
        const offeredAmounts: number[] = [];
        messages.forEach((m: Message) => {
            if (m.isFromVisitor) {
                const matches = m.message.match(/\$?(\d{1,3}(?:,?\d{3})*)/g);
                if (matches) {
                    matches.forEach(match => {
                        const num = parseInt(match.replace(/[$,]/g, ''));
                        if (num >= 10 && num <= 2000) offeredAmounts.push(num);
                    });
                }
            }
        });

        if (offeredAmounts.length > 0) {
            applicantContext += `They've mentioned these amounts: ${offeredAmounts.map(a => `$${a}`).join(', ')}. `;
        }

        // Format conversation history
        const conversationHistory = messages
            .filter((m: Message) => !m.message.includes("SCHOLARSHIP APPLICATION"))
            .map((m: Message) => ({
                role: m.isFromVisitor ? "user" as const : "assistant" as const,
                content: m.message,
            }));

        // Generate AI response
        const response = await anthropic.messages.create({
            model: "claude-sonnet-4-5-20250929",
            max_tokens: 500,
            system: `${SARAH_SYSTEM_PROMPT}\n\n--- ABOUT THIS APPLICANT ---\n${applicantContext || "No additional info available."}`,
            messages: conversationHistory.length > 0
                ? conversationHistory
                : [{ role: "user" as const, content: "Hi, I'm interested in the scholarship" }],
        });

        const textBlock = response.content.find((block) => block.type === "text");
        const aiReply = textBlock?.type === "text"
            ? textBlock.text
            : "Hey! Thanks for reaching out about the scholarship. What brings you to functional medicine? 💜";

        return NextResponse.json({
            success: true,
            reply: aiReply,
            offeredAmounts,
            model: "claude-sonnet-4-5-20250929",
        });

    } catch (error) {
        console.error("[AI-REPLY] Error:", error);
        return NextResponse.json(
            { error: "Failed to generate AI reply" },
            { status: 500 }
        );
    }
}
