import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/admin/users/[userId]/mark-disputed
// Marks a user as having filed a dispute (chargeback)
// This triggers: email suppression, access block
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user || !["ADMIN"].includes((session.user as any).role)) {
        return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 401 });
    }

    const { userId } = await params;

    try {
        const body = await request.json();
        const { reason, chargebackId, amount } = body;

        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, firstName: true, lastName: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if already marked as disputed
        const existingDisputeTag = await prisma.userTag.findUnique({
            where: { userId_tag: { userId, tag: "dispute_filed" } },
        });

        if (existingDisputeTag) {
            return NextResponse.json({
                error: "User already marked as disputed",
                disputedAt: existingDisputeTag.createdAt
            }, { status: 400 });
        }

        // Add dispute tags
        await prisma.userTag.createMany({
            data: [
                {
                    userId,
                    tag: "dispute_filed",
                    value: JSON.stringify({
                        filedAt: new Date().toISOString(),
                        reason: reason || "Chargeback filed",
                        chargebackId,
                        amount,
                        markedBy: session.user.email,
                    })
                },
                {
                    userId,
                    tag: "email_suppressed",
                    value: "dispute"
                },
                {
                    userId,
                    tag: "access_blocked",
                    value: "dispute"
                },
            ],
            skipDuplicates: true,
        });

        // Deactivate user account
        await prisma.user.update({
            where: { id: userId },
            data: { isActive: false },
        });

        // Log the action
        await prisma.userActivity.create({
            data: {
                userId,
                action: "marked_as_disputed",
                metadata: {
                    reason: reason || "Chargeback filed",
                    chargebackId,
                    amount,
                    markedBy: session.user.email,
                    markedAt: new Date().toISOString(),
                },
            },
        });

        console.log(`⚠️ User ${user.email} marked as disputed by ${session.user.email}`);

        return NextResponse.json({
            success: true,
            message: `User ${user.email} marked as disputed`,
            effects: [
                "All emails suppressed",
                "Account access blocked",
                "Account deactivated",
            ],
        });
    } catch (error) {
        console.error("Error marking user as disputed:", error);
        return NextResponse.json(
            { error: "Failed to mark user as disputed" },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/users/[userId]/mark-disputed
// Removes dispute status (if resolved in customer's favor or error)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user || !["ADMIN"].includes((session.user as any).role)) {
        return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 401 });
    }

    const { userId } = await params;

    try {
        // Remove dispute-related tags
        await prisma.userTag.deleteMany({
            where: {
                userId,
                tag: { in: ["dispute_filed", "email_suppressed", "access_blocked"] },
            },
        });

        // Reactivate user
        await prisma.user.update({
            where: { id: userId },
            data: { isActive: true },
        });

        // Log the action
        await prisma.userActivity.create({
            data: {
                userId,
                action: "dispute_resolved",
                metadata: {
                    resolvedBy: session.user.email,
                    resolvedAt: new Date().toISOString(),
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: "Dispute status removed, user reactivated",
        });
    } catch (error) {
        console.error("Error removing dispute status:", error);
        return NextResponse.json(
            { error: "Failed to remove dispute status" },
            { status: 500 }
        );
    }
}
