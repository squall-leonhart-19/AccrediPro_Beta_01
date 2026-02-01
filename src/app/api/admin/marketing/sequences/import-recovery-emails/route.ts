import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
    RECOVERY_SEQUENCES,
    RecoverySequenceType
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

        // Process each recovery sequence
        const sequenceTypes: RecoverySequenceType[] = [
            "never_logged_in",
            "never_started",
            "abandoned_learning",
        ];

        for (const type of sequenceTypes) {
            const recoverySequence = RECOVERY_SEQUENCES[type];
            if (!recoverySequence) continue;

            try {
                // Check if sequence already exists
                const existingSequence = await prisma.sequence.findFirst({
                    where: {
                        OR: [
                            { slug: type.replace(/_/g, "-") },
                            { name: { contains: type.replace(/_/g, " "), mode: "insensitive" } },
                        ],
                    },
                });

                if (existingSequence) {
                    results.push({
                        sequence: recoverySequence.name,
                        emails: 0,
                        error: "Sequence already exists",
                    });
                    continue;
                }

                // Create the sequence
                const sequence = await prisma.sequence.create({
                    data: {
                        name: recoverySequence.name,
                        slug: type.replace(/_/g, "-"),
                        description: `Recovery sequence for ${type.replace(/_/g, " ")} users`,
                        triggerType: "TAG_ADDED",
                        isActive: false, // Start inactive for review
                        isSystem: true,
                    },
                });

                // Create emails for this sequence
                let emailOrder = 0;
                for (const email of recoverySequence.emails) {
                    await prisma.sequenceEmail.create({
                        data: {
                            sequenceId: sequence.id,
                            customSubject: email.subject,
                            customContent: email.htmlContent,
                            delayDays: email.sendAfterDays,
                            delayHours: 0,
                            delayMinutes: 0,
                            order: emailOrder,
                            isActive: true,
                        },
                    });
                    emailOrder++;
                    totalEmails++;
                }

                results.push({
                    sequence: recoverySequence.name,
                    emails: recoverySequence.emails.length,
                });
                totalImported++;
            } catch (error) {
                console.error(`Error importing ${type}:`, error);
                results.push({
                    sequence: type,
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
