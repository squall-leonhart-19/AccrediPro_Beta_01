import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/admin/marketing/backfill-chat-tags
 * 
 * Backfills chat_lead tags to historical chat optins that have matching User records.
 * Also applies optin_only tag to leads who opted in but never actually chatted.
 */

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const results = {
            chatLeadTagged: 0,
            optinOnlyTagged: 0,
            alreadyCustomer: 0,
            noUserRecord: 0,
            errors: [] as string[],
        };

        // Get the chat_lead and optin_only tags
        const chatLeadTag = await prisma.marketingTag.findFirst({
            where: { name: "chat_lead" }
        });
        const optinOnlyTag = await prisma.marketingTag.findFirst({
            where: { name: "optin_only" }
        });

        if (!chatLeadTag) {
            return NextResponse.json({
                error: "chat_lead tag not found. Run Setup Chat Sequences first."
            }, { status: 400 });
        }

        // Get all chat optins with emails
        const optins = await prisma.chatOptin.findMany({
            where: {
                email: { not: null },
            },
        });

        console.log(`[BACKFILL] Processing ${optins.length} chat optins...`);

        // Get all visitors who actually sent chat messages
        const chatters = await prisma.salesChat.findMany({
            where: { isFromVisitor: true },
            select: { visitorId: true },
            distinct: ['visitorId'],
        });
        const chatterIds = new Set(chatters.map(c => c.visitorId));

        for (const optin of optins) {
            if (!optin.email) continue;

            try {
                // Find matching User record
                const user = await prisma.user.findUnique({
                    where: { email: optin.email.toLowerCase() },
                    include: {
                        marketingTags: { select: { tagId: true } }
                    }
                });

                if (!user) {
                    results.noUserRecord++;
                    continue;
                }

                // Check if they've completed a course (already customer)
                const hasCompletedEnrollment = await prisma.enrollment.findFirst({
                    where: {
                        userId: user.id,
                        status: "COMPLETED"
                    }
                });

                if (hasCompletedEnrollment) {
                    results.alreadyCustomer++;
                    continue;
                }

                // Check if they actually chatted
                const didChat = chatterIds.has(optin.visitorId);
                const tagToApply = didChat ? chatLeadTag : optinOnlyTag;

                if (!tagToApply) {
                    continue;
                }

                // Check if tag already applied
                const hasTag = user.marketingTags.some(t => t.tagId === tagToApply.id);
                if (hasTag) {
                    continue;
                }

                // Apply the tag
                await prisma.userMarketingTag.create({
                    data: {
                        userId: user.id,
                        tagId: tagToApply.id,
                        source: "backfill",
                    }
                });

                if (didChat) {
                    results.chatLeadTagged++;
                    console.log(`[BACKFILL] ✅ Applied chat_lead to ${optin.email}`);
                } else {
                    results.optinOnlyTagged++;
                    console.log(`[BACKFILL] ✅ Applied optin_only to ${optin.email}`);
                }

            } catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                results.errors.push(`${optin.email}: ${errMsg}`);
            }
        }

        console.log("[BACKFILL] Complete:", results);

        return NextResponse.json({
            success: true,
            message: "Backfill complete",
            ...results,
            totalProcessed: optins.length,
        });

    } catch (error) {
        console.error("[BACKFILL] Error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

// GET - Show current stats
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Count optins with emails
    const optinsWithEmail = await prisma.chatOptin.count({
        where: { email: { not: null } }
    });

    // Count users with chat_lead tag
    const chatLeadTag = await prisma.marketingTag.findFirst({
        where: { name: "chat_lead" }
    });
    const optinOnlyTag = await prisma.marketingTag.findFirst({
        where: { name: "optin_only" }
    });

    const chatLeadCount = chatLeadTag ? await prisma.userMarketingTag.count({
        where: { tagId: chatLeadTag.id }
    }) : 0;

    const optinOnlyCount = optinOnlyTag ? await prisma.userMarketingTag.count({
        where: { tagId: optinOnlyTag.id }
    }) : 0;

    return NextResponse.json({
        optinsWithEmail,
        usersWithChatLeadTag: chatLeadCount,
        usersWithOptinOnlyTag: optinOnlyCount,
        tagsExist: {
            chat_lead: !!chatLeadTag,
            optin_only: !!optinOnlyTag,
        }
    });
}
