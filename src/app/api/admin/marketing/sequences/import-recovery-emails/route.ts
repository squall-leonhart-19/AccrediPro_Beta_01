import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
    NEVER_LOGGED_IN_EMAILS,
    NEVER_STARTED_EMAILS,
    ABANDONED_LEARNING_EMAILS,
} from "@/lib/recovery-emails";

// POST /api/admin/marketing/sequences/import-recovery-emails
// One-click migration of hardcoded recovery emails to database
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const results: { sequence: string; emails: number; error?: string }[] = [];
        let totalImported = 0;
        let totalEmails = 0;

        const sequenceConfigs = [
            { slug: "recovery-never-logged-in", name: "Recovery: Never Logged In", emails: NEVER_LOGGED_IN_EMAILS },
            { slug: "recovery-never-started", name: "Recovery: Never Started", emails: NEVER_STARTED_EMAILS },
            { slug: "recovery-abandoned-learning", name: "Recovery: Abandoned Learning", emails: ABANDONED_LEARNING_EMAILS },
        ];

        for (const config of sequenceConfigs) {
            try {
                // Check if sequence already exists
                const existingSequence = await prisma.sequence.findUnique({
                    where: { slug: config.slug },
                });

                if (existingSequence) {
                    results.push({
                        sequence: config.name,
                        emails: 0,
                        error: "Sequence already exists",
                    });
                    continue;
                }

                // Create the sequence
                const sequence = await prisma.sequence.create({
                    data: {
                        name: config.name,
                        slug: config.slug,
                        description: `Recovery sequence for ${config.name.replace("Recovery: ", "").toLowerCase()} users`,
                        triggerType: "MANUAL",
                        isActive: false, // Start inactive for review
                        isSystem: true,
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
                });
                totalImported++;
            } catch (error) {
                console.error(`Error importing ${config.slug}:`, error);
                results.push({
                    sequence: config.name,
                    emails: 0,
                    error: "Import failed",
                });
            }
        }

        return NextResponse.json({
            success: true,
            imported: totalImported,
            emails: totalEmails,
            results,
        });
    } catch (error) {
        console.error("Error importing recovery emails:", error);
        return NextResponse.json(
            { error: "Failed to import recovery emails" },
            { status: 500 }
        );
    }
}
