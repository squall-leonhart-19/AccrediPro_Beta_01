import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/admin/marketing/sequences/[id]/duplicate - Duplicate sequence with all emails
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Fetch original sequence with all emails
        const original = await prisma.sequence.findUnique({
            where: { id },
            include: {
                emails: {
                    orderBy: { order: "asc" },
                },
            },
        });

        if (!original) {
            return NextResponse.json({ error: "Sequence not found" }, { status: 404 });
        }

        // Generate unique slug
        const timestamp = Date.now();
        const newSlug = `${original.slug}-copy-${timestamp}`;

        // Create duplicated sequence with all emails in a transaction
        const duplicated = await prisma.$transaction(async (tx) => {
            // Create the new sequence
            const newSequence = await tx.sequence.create({
                data: {
                    name: `${original.name} (Copy)`,
                    slug: newSlug,
                    description: original.description,
                    triggerType: "MANUAL", // Reset to manual to avoid unwanted triggers
                    triggerTagId: null,
                    exitTagId: original.exitTagId,
                    exitOnReply: original.exitOnReply,
                    exitOnClick: original.exitOnClick,
                    priority: original.priority,
                    courseCategory: original.courseCategory,
                    isActive: false, // Always start inactive
                    isSystem: false,
                },
            });

            // Clone all emails if any exist
            if (original.emails.length > 0) {
                await tx.sequenceEmail.createMany({
                    data: original.emails.map((email) => ({
                        sequenceId: newSequence.id,
                        customSubject: email.customSubject,
                        customContent: email.customContent,
                        order: email.order,
                        delayDays: email.delayDays,
                        delayHours: email.delayHours,
                        sendAtHour: email.sendAtHour,
                        sendOnWeekends: email.sendOnWeekends,
                        requiresTagId: email.requiresTagId,
                        skipIfTagId: email.skipIfTagId,
                        isActive: email.isActive,
                        // Reset stats for new emails
                        sentCount: 0,
                        openCount: 0,
                        clickCount: 0,
                        replyCount: 0,
                    })),
                });
            }

            // Return the new sequence with emails
            return tx.sequence.findUnique({
                where: { id: newSequence.id },
                include: {
                    emails: {
                        orderBy: { order: "asc" },
                    },
                    triggerTag: true,
                    exitTag: true,
                },
            });
        });

        return NextResponse.json({
            sequence: duplicated,
            emailsCloned: original.emails.length,
        });
    } catch (error) {
        console.error("Error duplicating sequence:", error);
        return NextResponse.json(
            { error: "Failed to duplicate sequence" },
            { status: 500 }
        );
    }
}
