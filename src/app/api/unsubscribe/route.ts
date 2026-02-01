
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // 1. Find user to get ID (if exists)
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            select: { id: true }
        });

        if (user) {
            // 2. Add suppression tag to UserTag (for robust checking)
            // We use 'email_suppressed' as the general tag, and a specific one for granularity if needed
            // But based on email.ts, we check for 'suppress_unsubscribed' in marketingTags OR 'email_suppressed' in UserTags.
            // Let's add BOTH to be safe.

            // A. UserTag 'email_suppressed'
            await prisma.userTag.upsert({
                where: { userId_tag: { userId: user.id, tag: "email_suppressed" } },
                update: {},
                create: { userId: user.id, tag: "email_suppressed" }
            });

            // B. Marketing Tag 'suppress_unsubscribed'
            // First ensure the tag exists
            let suppressionTag = await prisma.tag.findUnique({ where: { slug: "suppress_unsubscribed" } });
            if (!suppressionTag) {
                suppressionTag = await prisma.tag.create({
                    data: { name: "Suppressed: Unsubscribed", slug: "suppress_unsubscribed" }
                });
            }

            // Link tag to user
            await prisma.userMarketingTag.upsert({
                where: { userId_tagId: { userId: user.id, tagId: suppressionTag.id } },
                update: {},
                create: { userId: user.id, tagId: suppressionTag.id }
            });

            // Also mark any active sequence enrollments as EXITED to stop immediate sends
            await prisma.sequenceEnrollment.updateMany({
                where: {
                    userId: user.id,
                    status: "ACTIVE"
                },
                data: {
                    status: "EXITED",
                    exitReason: "User unsubscribed",
                    exitedAt: new Date()
                }
            });

            console.log(`[UNSUBSCRIBE] User ${user.id} (${normalizedEmail}) unsubscribed successfully.`);
        } else {
            // If user doesn't exist, we might want to add to a "suppression list" table if we had one.
            // For now, we just return success so the UI shows confirmation (security practice: don't reveal user existence).
            console.log(`[UNSUBSCRIBE] Non-existent user ${normalizedEmail} requested unsubscribe.`);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("[UNSUBSCRIBE] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
