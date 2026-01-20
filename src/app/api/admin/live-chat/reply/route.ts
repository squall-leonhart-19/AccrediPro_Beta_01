import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import { sendEmail, emailWrapper } from "@/lib/email";
import { COACH_PERSONAS, getPersonaByKey } from "@/config/coach-personas";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://sarah.accredipro.academy",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Map page slugs to persona keys and coach emails
function detectPersonaAndCoach(page: string | null): { personaKey: keyof typeof COACH_PERSONAS; coachEmail: string } {
  if (!page) return { personaKey: "fm-health", coachEmail: "sarah@accredipro-certificate.com" };

  const p = page.toLowerCase().trim();

  // Women's Health Mini Diploma (Sarah WH - SEPARATE from FM Sarah)
  if (p.includes("womens-health") || p.includes("women-health") || p.includes("hormone") ||
    p.includes("menopause") || p.includes("fertility") || p.includes("prenatal") ||
    p.includes("pcos") || p.includes("thyroid")) {
    return { personaKey: "fm-health", coachEmail: "sarah_womenhealth@accredipro-certificate.com" };
  }

  // FM/Health (Sarah FM)
  if (p === "fm-course-certification" || p === "fm-certification" || p === "hn-course-certification") {
    return { personaKey: "fm-health", coachEmail: "sarah@accredipro-certificate.com" };
  }

  // Mental Health (Olivia)
  if (p.includes("narcissistic") || p.includes("trauma") || p.includes("abuse") || p.includes("grief") ||
    p.includes("addiction") || p.includes("neuro") || p.includes("adhd") || p.includes("autism") ||
    p.includes("anxiety") || p.includes("depression")) {
    return { personaKey: "mental-health", coachEmail: "olivia@accredipro-certificate.com" };
  }

  // Life Coaching (Marcus)
  if (p.includes("life-coach") || p.includes("career") || p.includes("finance") || p.includes("money") ||
    p.includes("habit") || p.includes("success") || p.includes("confidence")) {
    return { personaKey: "life-coaching", coachEmail: "marcus@accredipro-certificate.com" };
  }

  // Spiritual (Luna)
  if (p.includes("spiritual") || p.includes("energy") || p.includes("reiki") || p.includes("chakra") ||
    p.includes("crystal") || p.includes("tarot") || p.includes("astrology") || p.includes("sacred") ||
    p.includes("manifest")) {
    return { personaKey: "spiritual", coachEmail: "luna@accredipro-certificate.com" };
  }

  // Herbalism (Sage)
  if (p.includes("herbal") || p.includes("plant") || p.includes("ayurveda") || p.includes("tcm") ||
    p.includes("chinese") || p.includes("naturopath")) {
    return { personaKey: "herbalism", coachEmail: "sage@accredipro-certificate.com" };
  }

  // Yoga/Movement (Maya)
  if (p.includes("yoga") || p.includes("somatic") || p.includes("movement") || p.includes("breath") ||
    p.includes("sound") || p.includes("music") || p.includes("meditation")) {
    return { personaKey: "yoga-movement", coachEmail: "maya@accredipro-certificate.com" };
  }

  // Pet (Bella)
  if (p.includes("pet-") || p.includes("animal") || p.includes("equine") || p.includes("canine") ||
    p.includes("feline")) {
    return { personaKey: "pet", coachEmail: "bella@accredipro-certificate.com" };
  }

  // Parenting (Emma)
  if (p.includes("parent") || p.includes("family") || p.includes("kid") || p.includes("teen") ||
    p.includes("couple")) {
    return { personaKey: "parenting", coachEmail: "emma@accredipro-certificate.com" };
  }

  // Faith (Grace)
  if (p.includes("christian") || p.includes("faith") || p.includes("biblical") || p.includes("ministry") ||
    p.includes("jesus")) {
    return { personaKey: "faith", coachEmail: "grace@accredipro-certificate.com" };
  }

  // Business (David)
  if (p.includes("business") || p.includes("marketing") || p.includes("practice-building")) {
    return { personaKey: "business", coachEmail: "david@accredipro-certificate.com" };
  }

  // Default: FM/Health (Sarah)
  return { personaKey: "fm-health", coachEmail: "sarah@accredipro-certificate.com" };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Write operation - SUPPORT cannot reply to chats
    if (!session?.user || !["ADMIN", "SUPERUSER", "INSTRUCTOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const { visitorId, message, useAI, page } = await request.json();

    if (!visitorId) {
      return NextResponse.json({ error: "Visitor ID is required" }, { status: 400, headers: corsHeaders });
    }

    let replyMessage = message;

    if (useAI) {
      // Get conversation history for context
      const history = await prisma.salesChat.findMany({
        where: { visitorId },
        orderBy: { createdAt: "asc" },
        take: 10,
      });

      // Detect which page/persona this is for
      const chatPage = page || history[0]?.page || "fm-certification";
      const { personaKey, coachEmail } = detectPersonaAndCoach(chatPage);
      const persona = getPersonaByKey(personaKey);

      // Get coach's knowledge base from database
      const coach = await prisma.user.findFirst({
        where: { email: coachEmail },
        select: { knowledgeBase: true, firstName: true }
      });

      const messages = history.map((msg) => ({
        role: msg.isFromVisitor ? "user" as const : "assistant" as const,
        content: msg.message,
      }));

      // Get the last visitor message to respond to
      const lastVisitorMessage = history.filter(m => m.isFromVisitor).pop();

      if (lastVisitorMessage) {
        // Build system prompt from persona + knowledge base
        const systemPrompt = `You are ${persona.name}, ${persona.role} at AccrediPro Academy.

PERSONALITY & TONE:
${persona.tone}

YOUR EXPERTISE:
${persona.knowledgeBase}

${coach?.knowledgeBase ? `
SPECIFIC KNOWLEDGE BASE (Use this for current offers, pricing, FAQs):
${coach.knowledgeBase}
` : ''}

INSTRUCTIONS:
- Keep responses conversational, warm, and helpful
- 2-4 sentences max - sound like a real person texting
- Use the knowledge base to answer specific questions about pricing, curriculum, etc.
- NEVER use markdown formatting (no bold, italics, bullets). Plain text only.
- NEVER refer to yourself as AI, bot, or automated. You are a real instructor.
- If they seem ready to buy, share the checkout link from your knowledge base
- Be encouraging but not pushy`;

        const response = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 300,
          system: systemPrompt,
          messages: messages.length > 0 ? messages : [{ role: "user", content: lastVisitorMessage.message }],
        });

        const textBlock = response.content.find((block) => block.type === "text");
        replyMessage = textBlock?.type === "text" ? textBlock.text : "Thanks for your question! How can I help you today?";
      } else {
        replyMessage = "Hey! Thanks for reaching out. What can I help you with today?";
      }
    }

    if (!replyMessage) {
      return NextResponse.json({ error: "Message is required" }, { status: 400, headers: corsHeaders });
    }

    // Save the reply
    await prisma.salesChat.create({
      data: {
        visitorId,
        page: page || "fm-certification",
        message: replyMessage,
        isFromVisitor: false,
        repliedBy: session.user.id,
      },
    });

    // Mark visitor messages as read
    await prisma.salesChat.updateMany({
      where: {
        visitorId,
        isFromVisitor: true,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    // ===== SEND EMAIL NOTIFICATION =====
    // Look up the visitor's email from ChatOptin
    const optin = await prisma.chatOptin.findUnique({
      where: { visitorId },
    });

    console.log(`[CHAT] Looking up optin for visitor ${visitorId}:`, optin ? { email: optin.email, name: optin.name } : "NOT FOUND");

    if (optin?.email) {
      // Check if email should be suppressed (bounced, complained, or unsubscribed)
      const suppressedUser = await prisma.user.findFirst({
        where: {
          email: optin.email.toLowerCase(),
          marketingTags: {
            some: {
              tag: {
                slug: {
                  in: ["suppress_bounced", "suppress_complained", "suppress_unsubscribed", "suppress_do_not_contact"]
                }
              }
            }
          }
        },
        select: { id: true, email: true }
      });

      if (suppressedUser) {
        console.log(`[CHAT] ⚠️ Email suppressed for ${optin.email} - user has suppression tag`);
      } else {
        // Send email notification with reply-to for threading
        const emailContent = `
          <h2 style="color: #722F37; margin-bottom: 20px;">You have a new message from Sarah!</h2>
          <div style="background: #f8f4f4; padding: 20px; border-radius: 8px; border-left: 4px solid #722F37; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333;">
              "${replyMessage}"
            </p>
          </div>
          <div style="background: #f0f7f0; padding: 15px 20px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0; font-size: 15px; color: #333;">
              <strong>💬 To reply:</strong> Just reply to this email! Your message will be sent directly to Sarah.
            </p>
          </div>
          <p style="color: #999; font-size: 13px; margin-top: 30px;">
            Or <a href="https://sarah.accredipro.academy/checkout-fm-certification" style="color: #722F37;">visit our sales page</a> to continue the conversation.
          </p>
        `;

        try {
          console.log(`[CHAT] Attempting to send email to ${optin.email}...`);
          await sendEmail({
            to: optin.email,
            subject: `Sarah replied to your message`,
            html: emailWrapper(emailContent, "Sarah from AccrediPro has replied to your message"),
            replyTo: "chat@accredipro-certificate.com", // Inbound email address for replies
          });
          console.log(`[CHAT] ✅ Email notification sent to ${optin.email} for visitor ${visitorId}`);
        } catch (emailError) {
          console.error(`[CHAT] ❌ Failed to send email notification to ${optin.email}:`, emailError);
          // Don't fail the whole request if email fails
        }
      }
    } else {
      console.log(`[CHAT] ⚠️ No email found for visitor ${visitorId} - cannot send notification`);
    }

    return NextResponse.json({ success: true, message: replyMessage }, { headers: corsHeaders });
  } catch (error) {
    console.error("Failed to send reply:", error);
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500, headers: corsHeaders });
  }
}
