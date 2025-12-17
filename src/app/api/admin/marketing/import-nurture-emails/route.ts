import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NURTURE_EMAILS } from "@/lib/nurture-emails";

/**
 * POST /api/admin/marketing/import-nurture-emails
 * 
 * Imports the 17 nurture emails from the shared template into SequenceEmail table.
 * Uses NURTURE_EMAILS from @/lib/nurture-emails as single source of truth.
 */

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find the nurture sequence
        const sequence = await prisma.sequence.findFirst({
            where: {
                OR: [
                    { name: { contains: "Nurture" } },
                    { name: { contains: "Mini Diploma" } },
                ],
            },
        });

        if (!sequence) {
            return NextResponse.json({ error: "Nurture sequence not found" }, { status: 404 });
        }

        console.log(`[IMPORT] Importing emails into sequence: ${sequence.name} (${sequence.id})`);

        // Delete existing emails for this sequence
        await prisma.sequenceEmail.deleteMany({
            where: { sequenceId: sequence.id },
        });

        // Insert new emails
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const createdEmails: any[] = [];
        for (const email of NURTURE_EMAILS) {
            const created = await prisma.sequenceEmail.create({
                data: {
                    sequenceId: sequence.id,
                    order: email.order,
                    customSubject: email.subject,
                    customContent: email.content,
                    delayDays: email.delayDays,
                    delayHours: email.delayHours,
                    isActive: true,
                },
            });
            createdEmails.push(created);
        }

        // Update sequence total emails
        await prisma.sequence.update({
            where: { id: sequence.id },
            data: { totalEmails: createdEmails.length },
        });

        return NextResponse.json({
            success: true,
            message: `Imported ${createdEmails.length} emails into sequence "${sequence.name}"`,
            sequenceId: sequence.id,
            emails: createdEmails.map(e => ({ order: e.order, subject: e.customSubject })),
        });
    } catch (error) {
        console.error("[IMPORT] Error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
