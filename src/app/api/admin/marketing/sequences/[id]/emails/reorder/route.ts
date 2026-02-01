import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/admin/marketing/sequences/[id]/emails/reorder - Reorder emails
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: sequenceId } = await params;
        const body = await request.json();
        const { emailOrders } = body; // Array of { id: string, order: number }

        if (!Array.isArray(emailOrders)) {
            return NextResponse.json(
                { error: "emailOrders array is required" },
                { status: 400 }
            );
        }

        // Verify sequence exists
        const sequence = await prisma.sequence.findUnique({
            where: { id: sequenceId },
        });

        if (!sequence) {
            return NextResponse.json({ error: "Sequence not found" }, { status: 404 });
        }

        // Update all email orders in a transaction
        await prisma.$transaction(
            emailOrders.map(({ id, order }: { id: string; order: number }) =>
                prisma.sequenceEmail.update({
                    where: { id },
                    data: { order },
                })
            )
        );

        // Fetch updated emails
        const emails = await prisma.sequenceEmail.findMany({
            where: { sequenceId },
            orderBy: { order: "asc" },
        });

        return NextResponse.json({ success: true, emails });
    } catch (error) {
        console.error("Error reordering emails:", error);
        return NextResponse.json(
            { error: "Failed to reorder emails" },
            { status: 500 }
        );
    }
}
