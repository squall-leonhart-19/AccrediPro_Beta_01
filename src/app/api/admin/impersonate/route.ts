import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createAuditLogger, AuditAction } from "@/lib/audit";

// POST /api/admin/impersonate - Start or stop impersonation
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { action, userId } = body;

        // For starting impersonation, check if the current user (or original admin) is allowed
        const currentRole = session.user.isImpersonating
            ? "ADMIN" // If already impersonating, they must have been admin/superuser
            : session.user.role;

        if (!["ADMIN", "SUPERUSER"].includes(currentRole)) {
            return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
        }

        if (action === "start") {
            if (!userId) {
                return NextResponse.json({ error: "User ID is required" }, { status: 400 });
            }

            // Get the user to impersonate
            const targetUser = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                },
            });

            if (!targetUser) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            // Don't allow impersonating other admins/superusers
            if (["ADMIN", "SUPERUSER"].includes(targetUser.role)) {
                return NextResponse.json(
                    { error: "Cannot impersonate admin users" },
                    { status: 403 }
                );
            }

            // Log the impersonation start
            const audit = createAuditLogger(session as { user: { id: string; email?: string | null; role: string } });
            audit(AuditAction.IMPERSONATE_START, "user", userId, {
                targetUserEmail: targetUser.email,
                targetUserName: `${targetUser.firstName || ""} ${targetUser.lastName || ""}`.trim(),
            });

            // Return the user data needed for session update
            return NextResponse.json({
                success: true,
                action: "start",
                user: {
                    id: targetUser.id,
                    email: targetUser.email,
                    firstName: targetUser.firstName,
                    lastName: targetUser.lastName,
                    role: targetUser.role,
                },
            });
        }

        if (action === "stop") {
            // Log the impersonation stop
            const audit = createAuditLogger(session as { user: { id: string; email?: string | null; role: string } });
            audit(AuditAction.IMPERSONATE_STOP, "user", session.user.id, {
                originalAdminId: session.user.originalAdminId,
            });

            return NextResponse.json({
                success: true,
                action: "stop",
            });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("Error in impersonation:", error);
        return NextResponse.json({ error: "Failed to process impersonation" }, { status: 500 });
    }
}

// GET /api/admin/impersonate - Get impersonation status
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({
            isImpersonating: session.user.isImpersonating || false,
            originalAdminId: session.user.originalAdminId,
            originalAdminName: session.user.originalAdminName,
            currentUser: {
                id: session.user.id,
                firstName: session.user.firstName,
                lastName: session.user.lastName,
                role: session.user.role,
            },
        });
    } catch (error) {
        console.error("Error getting impersonation status:", error);
        return NextResponse.json({ error: "Failed to get status" }, { status: 500 });
    }
}
