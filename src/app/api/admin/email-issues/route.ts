import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { detectEmailTypo } from "@/lib/email-typo-detector";
import { verifyEmail } from "@/lib/neverbounce";

// GET /api/admin/email-issues - Get all email bounce issues
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get("status"); // pending, auto_fixed, needs_manual, etc.
        const limit = parseInt(searchParams.get("limit") || "50");

        const whereClause: Record<string, unknown> = {};
        if (status && status !== "all") {
            whereClause.status = status;
        }

        const bounces = await prisma.emailBounce.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: limit,
        });

        // Get summary counts
        const counts = await prisma.emailBounce.groupBy({
            by: ["status"],
            _count: { id: true },
        });

        const summary = {
            total: counts.reduce((acc, c) => acc + c._count.id, 0),
            pending: counts.find((c) => c.status === "pending")?._count.id || 0,
            auto_fixed: counts.find((c) => c.status === "auto_fixed")?._count.id || 0,
            needs_manual: counts.find((c) => c.status === "needs_manual")?._count.id || 0,
            no_suggestion: counts.find((c) => c.status === "no_suggestion")?._count.id || 0,
            ignored: counts.find((c) => c.status === "ignored")?._count.id || 0,
        };

        return NextResponse.json({ bounces, summary });
    } catch (error) {
        console.error("Failed to get email issues:", error);
        return NextResponse.json(
            { error: "Failed to get email issues" },
            { status: 500 }
        );
    }
}

// POST /api/admin/email-issues - Apply fix or take action
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { bounceId, action, newEmail } = body;

        if (!bounceId || !action) {
            return NextResponse.json(
                { error: "bounceId and action required" },
                { status: 400 }
            );
        }

        const bounce = await prisma.emailBounce.findUnique({
            where: { id: bounceId },
            include: { user: true },
        });

        if (!bounce) {
            return NextResponse.json({ error: "Bounce not found" }, { status: 404 });
        }

        switch (action) {
            case "apply_suggestion":
                // Apply the AI-suggested fix
                if (!bounce.suggestedEmail) {
                    return NextResponse.json(
                        { error: "No suggestion available" },
                        { status: 400 }
                    );
                }

                // Verify with NeverBounce first
                const verifyResult = await verifyEmail(bounce.suggestedEmail);
                if (!verifyResult.isValid) {
                    return NextResponse.json(
                        { error: `NeverBounce rejected: ${verifyResult.result}` },
                        { status: 400 }
                    );
                }

                // Update user email and remove suppression
                await prisma.user.update({
                    where: { id: bounce.userId },
                    data: { email: bounce.suggestedEmail },
                });

                // Remove suppression tag
                const suppressTag = await prisma.marketingTag.findUnique({
                    where: { slug: "suppress_bounced" },
                });
                if (suppressTag) {
                    await prisma.userMarketingTag.deleteMany({
                        where: { userId: bounce.userId, tagId: suppressTag.id },
                    });
                }

                // Update bounce record
                await prisma.emailBounce.update({
                    where: { id: bounceId },
                    data: {
                        status: "manual_fixed",
                        fixedAt: new Date(),
                        fixedBy: session.user.id,
                        neverBounceResult: verifyResult.result,
                        neverBounceCheckedAt: new Date(),
                    },
                });

                return NextResponse.json({
                    success: true,
                    message: `Email updated to ${bounce.suggestedEmail}`,
                });

            case "manual_fix":
                // Admin provides a custom email
                if (!newEmail) {
                    return NextResponse.json(
                        { error: "newEmail required for manual fix" },
                        { status: 400 }
                    );
                }

                // Verify with NeverBounce
                const manualVerify = await verifyEmail(newEmail);
                if (!manualVerify.isValid) {
                    return NextResponse.json(
                        { error: `NeverBounce rejected: ${manualVerify.result}` },
                        { status: 400 }
                    );
                }

                // Update user email
                await prisma.user.update({
                    where: { id: bounce.userId },
                    data: { email: newEmail },
                });

                // Remove suppression tag
                const manualSuppressTag = await prisma.marketingTag.findUnique({
                    where: { slug: "suppress_bounced" },
                });
                if (manualSuppressTag) {
                    await prisma.userMarketingTag.deleteMany({
                        where: { userId: bounce.userId, tagId: manualSuppressTag.id },
                    });
                }

                // Update bounce record
                await prisma.emailBounce.update({
                    where: { id: bounceId },
                    data: {
                        status: "manual_fixed",
                        suggestedEmail: newEmail,
                        fixedAt: new Date(),
                        fixedBy: session.user.id,
                        neverBounceResult: manualVerify.result,
                        neverBounceCheckedAt: new Date(),
                    },
                });

                return NextResponse.json({
                    success: true,
                    message: `Email updated to ${newEmail}`,
                });

            case "ignore":
                await prisma.emailBounce.update({
                    where: { id: bounceId },
                    data: {
                        status: "ignored",
                        fixedAt: new Date(),
                        fixedBy: session.user.id,
                    },
                });

                return NextResponse.json({
                    success: true,
                    message: "Bounce ignored",
                });

            case "retry_detection":
                // Run AI detection again
                const typoResult = await detectEmailTypo(bounce.originalEmail);

                await prisma.emailBounce.update({
                    where: { id: bounceId },
                    data: {
                        suggestedEmail: typoResult.suggestedEmail,
                        suggestionSource: typoResult.source,
                        suggestionConfidence: typoResult.confidence,
                        status: typoResult.hasSuggestion ? "pending" : "no_suggestion",
                    },
                });

                return NextResponse.json({
                    success: true,
                    suggestion: typoResult.suggestedEmail,
                    confidence: typoResult.confidence,
                });

            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error) {
        console.error("Failed to process email issue action:", error);
        return NextResponse.json(
            { error: "Failed to process action" },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/email-issues - Delete a user (with bounced email)
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const bounceId = searchParams.get("bounceId");

        if (!bounceId) {
            return NextResponse.json(
                { error: "bounceId required" },
                { status: 400 }
            );
        }

        const bounce = await prisma.emailBounce.findUnique({
            where: { id: bounceId },
        });

        if (!bounce) {
            return NextResponse.json({ error: "Bounce not found" }, { status: 404 });
        }

        // Delete the bounce record (user deletion can be separate)
        await prisma.emailBounce.delete({
            where: { id: bounceId },
        });

        return NextResponse.json({
            success: true,
            message: "Bounce record deleted",
        });
    } catch (error) {
        console.error("Failed to delete bounce record:", error);
        return NextResponse.json(
            { error: "Failed to delete" },
            { status: 500 }
        );
    }
}
