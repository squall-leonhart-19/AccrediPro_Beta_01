import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
    getAllNicheIds,
    getSequenceImportConfigs,
} from "@/lib/niche-email-sequences";

// POST /api/admin/marketing/sequences/import-niche-emails
// One-click import of niche-specific email sequences to Sequence HQ
//
// Body (optional): { "nicheId": "spiritual-healing" }
// If no nicheId provided, imports ALL niches
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (
            !session?.user ||
            !["ADMIN", "SUPERUSER"].includes(session.user.role as string)
        ) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json().catch(() => ({}));
        const targetNiches = body.nicheId
            ? [body.nicheId]
            : getAllNicheIds();

        const results: {
            sequence: string;
            emails: number;
            nicheId: string;
            error?: string;
        }[] = [];
        let totalSequences = 0;
        let totalEmails = 0;

        for (const nicheId of targetNiches) {
            const configs = getSequenceImportConfigs(nicheId);

            for (const config of configs) {
                try {
                    // Check if sequence already exists
                    const existing = await prisma.sequence.findUnique({
                        where: { slug: config.slug },
                    });

                    if (existing) {
                        results.push({
                            sequence: config.name,
                            emails: 0,
                            nicheId,
                            error: "Sequence already exists — delete first to re-import",
                        });
                        continue;
                    }

                    // Create the sequence
                    const sequence = await prisma.sequence.create({
                        data: {
                            name: config.name,
                            slug: config.slug,
                            description: config.description,
                            triggerType: config.triggerType,
                            courseCategory: config.courseCategory,
                            isActive: false, // Start inactive for review
                            isSystem: false,
                        },
                    });

                    // Create emails for this sequence
                    for (const email of config.emails) {
                        await prisma.sequenceEmail.create({
                            data: {
                                sequenceId: sequence.id,
                                customSubject: email.subject,
                                customContent: email.content,
                                delayDays: email.delayDays,
                                delayHours: email.delayHours,
                                order: email.order,
                                isActive: true,
                            },
                        });
                        totalEmails++;
                    }

                    results.push({
                        sequence: config.name,
                        emails: config.emails.length,
                        nicheId,
                    });
                    totalSequences++;
                } catch (error) {
                    console.error(
                        `Error importing ${config.slug}:`,
                        error
                    );
                    results.push({
                        sequence: config.name,
                        emails: 0,
                        nicheId,
                        error: "Import failed",
                    });
                }
            }
        }

        return NextResponse.json({
            success: true,
            sequences: totalSequences,
            emails: totalEmails,
            results,
        });
    } catch (error) {
        console.error("Error importing niche emails:", error);
        return NextResponse.json(
            { error: "Failed to import niche emails" },
            { status: 500 }
        );
    }
}
