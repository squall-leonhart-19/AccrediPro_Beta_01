import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import { COACH_PERSONAS, getPersonaByKey } from "@/config/coach-personas";
import { sendEmail, emailWrapper } from "@/lib/email";

// Map persona keys to coach emails
const PERSONA_EMAILS: Record<keyof typeof COACH_PERSONAS, string> = {
    "fm-health": "sarah@accredipro-certificate.com",
    "mental-health": "olivia@accredipro-certificate.com",
    "life-coaching": "marcus@accredipro-certificate.com",
    "spiritual": "luna@accredipro-certificate.com",
    "herbalism": "sage@accredipro-certificate.com",
    "yoga-movement": "maya@accredipro-certificate.com",
    "pet": "bella@accredipro-certificate.com",
    "parenting": "emma@accredipro-certificate.com",
    "faith": "grace@accredipro-certificate.com",
    "business": "david@accredipro-certificate.com",
};

// Helper to map page URLs/slugs to Persona Keys
function detectPersona(page: string | null): keyof typeof COACH_PERSONAS {
    if (!page) return "fm-health"; // Default to Sarah

    const p = page.toLowerCase().trim();

    // 🌸 WOMEN'S HEALTH (Sarah - with WH-specific context)
    if (p.includes("womens-health") || p.includes("women-health") || p.includes("hormone") ||
        p.includes("menopause") || p.includes("fertility") || p.includes("prenatal") ||
        p.includes("pcos") || p.includes("thyroid")) return "fm-health";

    // 🏆 EXACT MATCHES (High Traffic Sales Pages)
    // These must NEVER be mis-identified.
    if (p === "fm-course-certification" || p === "fm-certification") return "fm-health";
    if (p === "hn-course-certification") return "fm-health";

    // 🧠 MENTAL HEALTH (Olivia)
    if (p.includes("narcissistic") || p.includes("trauma") || p.includes("abuse") || p.includes("grief") || p.includes("addiction") || p.includes("neuro") || p.includes("adhd") || p.includes("autism") || p.includes("anxiety") || p.includes("depression")) return "mental-health";

    // 🎯 LIFE COACHING (Marcus)
    if (p.includes("life-coach") || p.includes("career") || p.includes("finance") || p.includes("money") || p.includes("habit") || p.includes("success") || p.includes("confidence")) return "life-coaching";

    // 🔮 SPIRITUAL (Luna)
    if (p.includes("spiritual") || p.includes("energy") || p.includes("reiki") || p.includes("chakra") || p.includes("crystal") || p.includes("tarot") || p.includes("astrology") || p.includes("sacred") || p.includes("manifest")) return "spiritual";

    // 🌿 HERBALISM (Sage)
    if (p.includes("herbal") || p.includes("plant") || p.includes("ayurveda") || p.includes("tcm") || p.includes("chinese") || p.includes("naturopath")) return "herbalism";

    // 🧘 YOGA/MOVEMENT (Maya)
    if (p.includes("yoga") || p.includes("somatic") || p.includes("movement") || p.includes("breath") || p.includes("sound") || p.includes("music") || p.includes("meditation")) return "yoga-movement";

    // 🐾 PET (Bella)
    if (p.includes("pet-") || p.includes("animal") || p.includes("equine") || p.includes("canine") || p.includes("feline")) return "pet";

    // 👨‍👩‍👧 PARENTING (Emma)
    if (p.includes("parent") || p.includes("family") || p.includes("kid") || p.includes("teen") || p.includes("couple")) return "parenting";

    // 🙏 FAITH (Grace)
    if (p.includes("christian") || p.includes("faith") || p.includes("biblical") || p.includes("ministry") || p.includes("jesus")) return "faith";

    // 💼 BUSINESS (David)
    if (p.includes("business") || p.includes("marketing") || p.includes("practice-building")) return "business";

    // 🏥 DEFAULT: FM/HEALTH (Sarah)
    // Covers: fm-course-certification, hn-course-certification, women, hormone, gut, fitness, etc.
    return "fm-health";
}

// Check for conversations that need auto-reply
export async function GET() {
    try {
        const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);

        // Get all conversations
        const messages = await prisma.salesChat.findMany({
            orderBy: { createdAt: "desc" },
            take: 500,
        });

        // Get optins for visitor info
        const optins = await prisma.chatOptin.findMany();
        const optinMap = new Map(optins.map((o) => [o.visitorId, o]));

        // Group messages by email/visitorId
        const conversationsMap = new Map<string, typeof messages>();

        messages.forEach((msg) => {
            const optin = optinMap.get(msg.visitorId);
            const email = optin?.email || msg.visitorEmail;
            const key = email ? `email:${email.toLowerCase()}` : `visitor:${msg.visitorId}`;

            if (!conversationsMap.has(key)) {
                conversationsMap.set(key, []);
            }
            conversationsMap.get(key)!.push(msg);
        });

        const repliesSent: Array<{ visitorId: string; messageCount: number; persona: string }> = [];

        // Check each conversation for auto-reply eligibility
        for (const [key, msgs] of conversationsMap.entries()) {
            const sortedMsgs = msgs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            const lastMsg = sortedMsgs[sortedMsgs.length - 1];

            // Only process if:
            // 1. Last message is from visitor
            // 2. Last message was >1 minute ago
            // 3. No admin reply exists yet
            // 4. NOT a scholarship chat (those require manual admin response)
            const isScholarshipChat = (lastMsg.page || "").toLowerCase().includes("scholarship");
            if (
                lastMsg.isFromVisitor &&
                lastMsg.createdAt < oneMinuteAgo &&
                !sortedMsgs.some((m) => !m.isFromVisitor && m.createdAt > lastMsg.createdAt) &&
                !isScholarshipChat
            ) {
                // Generate and send auto-reply
                try {
                    const personaKey = await sendAutoReply(sortedMsgs, lastMsg.visitorId);
                    if (personaKey) {
                        repliesSent.push({
                            visitorId: lastMsg.visitorId,
                            messageCount: sortedMsgs.length,
                            persona: personaKey
                        });
                    }
                } catch (error) {
                    console.error(`Failed to send auto-reply for ${lastMsg.visitorId}:`, error);
                }
            }
        }

        // ===== HORMOZI 5-STEP FOLLOW-UP SEQUENCE =====
        // Step 0: Immediate AI reply (handled above)
        // Step 1: 24h "Checking in" bump
        // Step 2: 48h Value drop (testimonial)
        // Step 3: 72h Scarcity ("discount ends soon")
        // Step 4: Day 7 Breakup email
        // STOP: No more follow-ups after step 4

        const followUpsSent: string[] = [];

        // Get all optins that might need follow-up (have email, not purchased, sequence not complete)
        const optinsForFollowUp = await prisma.chatOptin.findMany({
            where: {
                email: { not: null },
                emailsSent: { lt: 5 }, // Haven't completed sequence
            },
        });

        // Check which users have purchased (to exclude from follow-up)
        const optinEmails = optinsForFollowUp.map(o => o.email!.toLowerCase());
        const purchasedUsers = await prisma.user.findMany({
            where: {
                email: { in: optinEmails },
                OR: [
                    { enrollments: { some: {} } },
                    { payments: { some: { status: "COMPLETED" } } },
                ],
            },
            select: { email: true },
        });
        const purchasedEmailsSet = new Set(purchasedUsers.map(u => u.email!.toLowerCase()));

        const now = Date.now();

        for (const optin of optinsForFollowUp) {
            // Skip if they purchased
            if (purchasedEmailsSet.has(optin.email!.toLowerCase())) {
                // Mark as complete so we don't check again
                await prisma.chatOptin.update({
                    where: { id: optin.id },
                    data: { emailsSent: 5 },
                });
                continue;
            }

            const optinTime = optin.createdAt.getTime();
            const lastEmailTime = optin.lastEmailSentAt?.getTime() || optinTime;
            const hoursSinceOptin = (now - optinTime) / (1000 * 60 * 60);
            const hoursSinceLastEmail = (now - lastEmailTime) / (1000 * 60 * 60);

            let shouldSendStep: number | null = null;
            let minHoursRequired = 0;

            // Determine which step to send based on emailsSent and time
            switch (optin.emailsSent) {
                case 0:
                    // Step 1: 24h bump (only if AI already replied and 24h passed)
                    if (hoursSinceOptin >= 24) {
                        shouldSendStep = 1;
                        minHoursRequired = 24;
                    }
                    break;
                case 1:
                    // Step 2: 48h value drop
                    if (hoursSinceOptin >= 48 && hoursSinceLastEmail >= 20) {
                        shouldSendStep = 2;
                        minHoursRequired = 48;
                    }
                    break;
                case 2:
                    // Step 3: 72h scarcity
                    if (hoursSinceOptin >= 72 && hoursSinceLastEmail >= 20) {
                        shouldSendStep = 3;
                        minHoursRequired = 72;
                    }
                    break;
                case 3:
                    // Step 4: Day 7 breakup
                    if (hoursSinceOptin >= 168 && hoursSinceLastEmail >= 48) { // 168h = 7 days
                        shouldSendStep = 4;
                        minHoursRequired = 168;
                    }
                    break;
                case 4:
                    // Mark as complete
                    await prisma.chatOptin.update({
                        where: { id: optin.id },
                        data: { emailsSent: 5 },
                    });
                    break;
            }

            if (shouldSendStep !== null) {
                try {
                    await sendFollowUpEmail(optin, shouldSendStep);
                    await prisma.chatOptin.update({
                        where: { id: optin.id },
                        data: {
                            emailsSent: shouldSendStep,
                            lastEmailSentAt: new Date(),
                        },
                    });
                    followUpsSent.push(`${optin.email}:step${shouldSendStep}`);
                    console.log(`[FOLLOW-UP] ✅ Sent step ${shouldSendStep} to ${optin.email}`);
                } catch (error) {
                    console.error(`[FOLLOW-UP] ❌ Failed step ${shouldSendStep} for ${optin.email}:`, error);
                }
            }
        }

        return NextResponse.json({
            success: true,
            repliesSent: repliesSent.length,
            followUpsSent: followUpsSent.length,
            details: repliesSent,
            followUps: followUpsSent,
        });
    } catch (error) {
        console.error("Auto-reply check failed:", error);
        return NextResponse.json({ error: "Auto-reply check failed" }, { status: 500 });
    }
}

async function sendAutoReply(conversationMsgs: any[], visitorId: string): Promise<string | null> {
    // Lazy initialize Anthropic only when needed
    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Determine Persona
    const firstMsg = conversationMsgs[0];
    const personaKey = detectPersona(firstMsg.page);
    const persona = getPersonaByKey(personaKey);

    // WH pages use separate Sarah account
    const page = (firstMsg.page || "").toLowerCase();
    const isWH = page.includes("womens-health") || page.includes("women-health") ||
        page.includes("hormone") || page.includes("menopause") ||
        page.includes("fertility") || page.includes("prenatal") ||
        page.includes("pcos") || page.includes("thyroid");
    const coachEmail = isWH ? "sarah@accredipro-certificate.com" : PERSONA_EMAILS[personaKey];

    // Fetch coach's knowledge base AND ID from database
    const coach = await prisma.user.findFirst({
        where: { email: coachEmail },
        select: { knowledgeBase: true, id: true }
    });

    if (!coach) {
        console.error(`[AUTO-REPLY] ❌ Coach not found for email ${coachEmail} - skipping reply`);
        return null;
    }

    // Build conversation history for AI
    const messages = conversationMsgs.map((m) => ({
        role: m.isFromVisitor ? ("user" as const) : ("assistant" as const),
        content: m.message,
    }));

    // System prompt construction - prioritize database knowledge base if available
    const systemPrompt = `You are ${persona.name}, ${persona.role} at AccrediPro Academy.

PERSONALITY & TONE:
${persona.tone}

YOUR EXPERTISE:
${persona.knowledgeBase}

${coach.knowledgeBase ? `
SPECIFIC KNOWLEDGE BASE (Use this for current offers, pricing, FAQs, testimonials):
${coach.knowledgeBase}
` : ''}

INSTRUCTIONS:
- Keep responses conversational, warm, and helpful
- 2-4 sentences max - sound like a real person texting
- Use the knowledge base to answer specific questions about pricing, curriculum, etc.
- NEVER use markdown formatting (no bold, italics, bullets). Plain text only.
- NEVER refer to yourself as AI, bot, or automated. You are a real instructor.
- If they seem ready to buy, share the checkout link from your knowledge base
- Be encouraging but not pushy`.trim();

    const response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001", // Or standard Haiku if this ID is internal
        max_tokens: 400,
        system: systemPrompt,
        messages: messages.length > 0 ? messages : [{ role: "user", content: "Hi" }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const aiReply = textBlock?.type === "text" ? textBlock.text : "Thanks for reaching out! How can I help you today?";

    // Save AI reply to database
    await prisma.salesChat.create({
        data: {
            visitorId,
            visitorName: firstMsg.visitorName,
            visitorEmail: firstMsg.visitorEmail,
            page: firstMsg.page,
            message: aiReply,
            isFromVisitor: false,
            isRead: true,
            repliedBy: coach.id, // Use valid User ID
        },
    });

    // Mark all visitor messages as read
    await prisma.salesChat.updateMany({
        where: {
            visitorId,
            isFromVisitor: true,
            isRead: false,
        },
        data: { isRead: true },
    });

    console.log(`[AUTO-REPLY] ✅ Sent reply to visitor ${visitorId} as ${persona.name} (User ID: ${coach.id})`);

    // ===== SEND EMAIL NOTIFICATION =====
    // Look up for email to send notification
    try {
        const optin = await prisma.chatOptin.findUnique({ where: { visitorId } });

        if (optin?.email) {
            // Check for suppression
            const suppressedUser = await prisma.user.findFirst({
                where: {
                    email: optin.email.toLowerCase(),
                    marketingTags: { some: { tag: { slug: { in: ["suppress_bounced", "suppress_complained", "suppress_unsubscribed", "suppress_do_not_contact"] } } } }
                },
                select: { id: true }
            });

            if (!suppressedUser) {
                const emailContent = `
                  <h2 style="color: #722F37; margin-bottom: 20px;">You have a new message from ${persona.name}!</h2>
                  <div style="background: #f8f4f4; padding: 20px; border-radius: 8px; border-left: 4px solid #722F37; margin: 20px 0;">
                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333;">
                      "${aiReply}"
                    </p>
                  </div>
                  <div style="background: #f0f7f0; padding: 15px 20px; border-radius: 8px; margin: 25px 0;">
                    <p style="margin: 0; font-size: 15px; color: #333;">
                      <strong>💬 To reply:</strong> Just reply to this email! Your message will be sent directly to ${persona.name}.
                    </p>
                  </div>
                  <p style="color: #999; font-size: 13px; margin-top: 30px;">
                    Or <a href="https://sarah.accredipro.academy/checkout-fm-certification" style="color: #722F37;">visit our sales page</a> to continue the conversation.
                  </p>
                `;

                await sendEmail({
                    to: optin.email,
                    subject: `${persona.name} replied to your message`,
                    html: emailWrapper(emailContent, `${persona.name} from AccrediPro has replied to your message`),
                    replyTo: "chat@accredipro-certificate.com",
                });
                console.log(`[AUTO-REPLY] 📧 Email notification sent to ${optin.email}`);
            }
        }
    } catch (e) {
        console.error(`[AUTO-REPLY] ❌ Failed to send email to visitor ${visitorId}:`, e);
    }

    return personaKey;
}

// Hormozi 5-Step Follow-up Email Templates
async function sendFollowUpEmail(optin: { email: string | null; name: string; page: string }, step: number): Promise<void> {
    if (!optin.email) return;

    // Check suppression
    const suppressedUser = await prisma.user.findFirst({
        where: {
            email: optin.email.toLowerCase(),
            marketingTags: { some: { tag: { slug: { in: ["suppress_bounced", "suppress_complained", "suppress_unsubscribed", "suppress_do_not_contact"] } } } }
        },
        select: { id: true }
    });

    if (suppressedUser) return;

    const firstName = optin.name || "there";
    const personaKey = detectPersona(optin.page);
    const persona = getPersonaByKey(personaKey);

    let subject = "";
    let emailContent = "";

    switch (step) {
        case 1:
            // 24h Bump - "Checking in"
            subject = `${firstName}, quick question...`;
            emailContent = `
                <h2 style="color: #722F37; margin-bottom: 20px;">Hey ${firstName}! 👋</h2>
                <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 20px;">
                    I noticed we were chatting yesterday but didn't get to finish our conversation.
                </p>
                <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 20px;">
                    Did you have any other questions about getting certified? I'm here if you need me!
                </p>
                <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 25px;">
                    No pressure - just wanted to make sure you didn't miss anything. 😊
                </p>
                <div style="background: #f0f7f0; padding: 15px 20px; border-radius: 8px; margin: 25px 0;">
                    <p style="margin: 0; font-size: 15px; color: #333;">
                        <strong>💬 To reply:</strong> Just reply to this email!
                    </p>
                </div>
                <p style="color: #999; font-size: 13px;">- ${persona.name}</p>
            `;
            break;

        case 2:
            // 48h Value Drop - Testimonial
            subject = `This woman went from skeptical to certified in 8 weeks`;
            emailContent = `
                <h2 style="color: #722F37; margin-bottom: 20px;">Hey ${firstName},</h2>
                <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 20px;">
                    I wanted to share something with you that I think you'll find valuable...
                </p>
                <div style="background: #f8f4f4; padding: 20px; border-radius: 8px; border-left: 4px solid #722F37; margin: 20px 0;">
                    <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6; color: #333; font-style: italic;">
                        "I was SO skeptical at first. I'd looked at other certifications that cost $3,000-$5,000 and weren't even accredited. Then I found AccrediPro..."
                    </p>
                    <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6; color: #333; font-style: italic;">
                        "8 weeks later, I'm certified, I've already helped 3 paying clients, and I finally feel confident charging what I'm worth."
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #666;">
                        — Jennifer M., Certified Functional Medicine Practitioner
                    </p>
                </div>
                <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 20px;">
                    Jennifer started exactly where you are now. Curious but unsure.
                </p>
                <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 25px;">
                    If you have any questions about the program, just reply to this email. I read every single one.
                </p>
                <p style="color: #999; font-size: 13px;">- ${persona.name}</p>
            `;
            break;

        case 3:
            // 72h Scarcity
            subject = `[Reminder] The 80% discount ends soon`;
            emailContent = `
                <h2 style="color: #722F37; margin-bottom: 20px;">Hey ${firstName},</h2>
                <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 20px;">
                    I wanted to give you a quick heads up...
                </p>
                <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 20px;">
                    The <strong>80% enrollment discount</strong> we discussed is ending soon. I'd hate for you to miss it if you were still thinking about joining.
                </p>
                <div style="background: #fff3cd; padding: 15px 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
                    <p style="margin: 0; font-size: 15px; color: #856404;">
                        ⏰ Regular price: <strike>$1,497</strike> → Your price: <strong>$297</strong>
                    </p>
                </div>
                <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 20px;">
                    This includes:
                </p>
                <ul style="font-size: 15px; line-height: 1.8; color: #333; margin-bottom: 25px;">
                    <li>Full accredited certification</li>
                    <li>50+ CEU hours</li>
                    <li>1-on-1 onboarding call</li>
                    <li>Lifetime access + updates</li>
                </ul>
                <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 25px;">
                    If you have any last questions, just reply. Otherwise, <a href="https://sarah.accredipro.academy/checkout-fm-certification" style="color: #722F37; font-weight: bold;">click here to lock in your spot</a>.
                </p>
                <p style="color: #999; font-size: 13px;">- ${persona.name}</p>
            `;
            break;

        case 4:
            // Day 7 Breakup
            subject = `Closing your file, ${firstName}`;
            emailContent = `
                <h2 style="color: #722F37; margin-bottom: 20px;">Hey ${firstName},</h2>
                <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 20px;">
                    I wanted to reach out one last time.
                </p>
                <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 20px;">
                    It looks like now might not be the right time for you to pursue certification, and that's completely okay. I get it - life gets busy, priorities shift.
                </p>
                <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 20px;">
                    I'm going to close your file for now, but I want you to know: <strong>the door is always open.</strong>
                </p>
                <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 20px;">
                    If things change and you decide you want to help people transform their health through root-cause medicine, just reply to any of my emails. I'll be here.
                </p>
                <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 25px;">
                    Wishing you all the best, whatever path you choose. 💛
                </p>
                <p style="color: #999; font-size: 13px;">- ${persona.name}</p>
            `;
            break;

        default:
            return;
    }

    await sendEmail({
        to: optin.email,
        subject,
        html: emailWrapper(emailContent, subject),
        replyTo: "chat@accredipro-certificate.com",
    });

    console.log(`[FOLLOW-UP] 📧 Sent step ${step} email to ${optin.email}`);
}
