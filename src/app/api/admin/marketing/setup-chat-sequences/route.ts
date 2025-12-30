import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CHAT_CONVERSION_EMAILS, OPTIN_ONLY_EMAILS } from "@/lib/chat-conversion-emails";

/**
 * POST /api/admin/marketing/setup-chat-sequences
 * 
 * Creates the chat_conversion and optin_only sequences in the database.
 * Imports the winning A-B-A-B-C email sequence.
 * 
 * Also creates necessary marketing tags:
 * - chat_lead: Applied when someone gives email in chat
 * - chat_purchased: Applied when chat lead becomes customer (exit trigger)
 * - optin_only: Applied when someone opts in but doesn't chat
 */

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const results = {
            tagsCreated: [] as string[],
            sequencesCreated: [] as string[],
            emailsImported: 0,
        };

        // Step 1: Create marketing tags if they don't exist
        const tagsToCreate = [
            { name: "chat_lead", description: "Lead who gave email in live chat" },
            { name: "chat_purchased", description: "Chat lead who converted to customer" },
            { name: "optin_only", description: "Opted in but never chatted" },
        ];

        for (const tagDef of tagsToCreate) {
            const existing = await prisma.marketingTag.findFirst({
                where: { name: tagDef.name }
            });
            if (!existing) {
                await prisma.marketingTag.create({
                    data: {
                        name: tagDef.name,
                        description: tagDef.description,
                        color: tagDef.name === "chat_purchased" ? "#10B981" : "#3B82F6",
                    }
                });
                results.tagsCreated.push(tagDef.name);
            }
        }

        // Get the tags for sequence setup
        const chatLeadTag = await prisma.marketingTag.findFirst({
            where: { name: "chat_lead" }
        });
        const chatPurchasedTag = await prisma.marketingTag.findFirst({
            where: { name: "chat_purchased" }
        });
        const optinOnlyTag = await prisma.marketingTag.findFirst({
            where: { name: "optin_only" }
        });

        // Step 2: Create Chat Conversion Sequence
        let chatSequence = await prisma.sequence.findFirst({
            where: { slug: "chat-conversion" }
        });

        if (!chatSequence) {
            chatSequence = await prisma.sequence.create({
                data: {
                    name: "Chat to Conversion",
                    slug: "chat-conversion",
                    description: "Follow-up sequence for leads who chatted but didn't purchase. Uses A-B-A-B-C winning combination.",
                    triggerType: "TAG_ADDED",
                    triggerTagId: chatLeadTag?.id || null,
                    exitTagId: chatPurchasedTag?.id || null,
                    exitOnReply: false,
                    exitOnClick: false,
                    isActive: false, // Start as inactive until tested
                    isSystem: true,
                    priority: 10,
                }
            });
            results.sequencesCreated.push("chat-conversion");
        }

        // Delete existing emails and reimport
        await prisma.sequenceEmail.deleteMany({
            where: { sequenceId: chatSequence.id }
        });

        // Import chat conversion emails
        for (const email of CHAT_CONVERSION_EMAILS) {
            await prisma.sequenceEmail.create({
                data: {
                    sequenceId: chatSequence.id,
                    order: email.order,
                    customSubject: email.subject,
                    customContent: email.content,
                    delayDays: email.delayDays,
                    delayHours: email.delayHours,
                    isActive: true,
                }
            });
            results.emailsImported++;
        }

        // Update email count
        await prisma.sequence.update({
            where: { id: chatSequence.id },
            data: { totalEmails: CHAT_CONVERSION_EMAILS.length }
        });

        // Step 3: Create Optin Only Sequence (empty scaffold)
        let optinSequence = await prisma.sequence.findFirst({
            where: { slug: "optin-only" }
        });

        if (!optinSequence) {
            optinSequence = await prisma.sequence.create({
                data: {
                    name: "Optin Only (No Chat)",
                    slug: "optin-only",
                    description: "Sequence for leads who opted in but never chatted. Emails to be added later.",
                    triggerType: "TAG_ADDED",
                    triggerTagId: optinOnlyTag?.id || null,
                    exitTagId: chatPurchasedTag?.id || null,
                    exitOnReply: false,
                    isActive: false,
                    isSystem: true,
                    priority: 5,
                }
            });
            results.sequencesCreated.push("optin-only");
        }

        // Import optin-only emails if any exist
        if (OPTIN_ONLY_EMAILS.length > 0) {
            await prisma.sequenceEmail.deleteMany({
                where: { sequenceId: optinSequence.id }
            });

            for (const email of OPTIN_ONLY_EMAILS) {
                await prisma.sequenceEmail.create({
                    data: {
                        sequenceId: optinSequence.id,
                        order: email.order,
                        customSubject: email.subject,
                        customContent: email.content,
                        delayDays: email.delayDays,
                        delayHours: email.delayHours,
                        isActive: true,
                    }
                });
            }

            await prisma.sequence.update({
                where: { id: optinSequence.id },
                data: { totalEmails: OPTIN_ONLY_EMAILS.length }
            });
        }

        console.log("[SETUP-CHAT-SEQUENCES] Complete:", results);

        return NextResponse.json({
            success: true,
            message: "Chat sequences setup complete",
            ...results,
            chatSequenceId: chatSequence.id,
            optinSequenceId: optinSequence.id,
        });

    } catch (error) {
        console.error("[SETUP-CHAT-SEQUENCES] Error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// GET - Check current status
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatSequence = await prisma.sequence.findFirst({
        where: { slug: "chat-conversion" },
        include: { emails: { select: { order: true, customSubject: true } } }
    });

    const optinSequence = await prisma.sequence.findFirst({
        where: { slug: "optin-only" },
        include: { emails: { select: { order: true, customSubject: true } } }
    });

    const tags = await prisma.marketingTag.findMany({
        where: { name: { in: ["chat_lead", "chat_purchased", "optin_only"] } }
    });

    return NextResponse.json({
        chatSequence: chatSequence ? {
            id: chatSequence.id,
            name: chatSequence.name,
            isActive: chatSequence.isActive,
            emailCount: chatSequence.emails.length,
            emails: chatSequence.emails.map(e => ({ order: e.order, subject: e.customSubject }))
        } : null,
        optinSequence: optinSequence ? {
            id: optinSequence.id,
            name: optinSequence.name,
            isActive: optinSequence.isActive,
            emailCount: optinSequence.emails.length,
        } : null,
        tags: tags.map(t => ({ name: t.name, id: t.id })),
    });
}
