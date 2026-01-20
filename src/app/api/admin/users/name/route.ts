import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * PATCH /api/admin/users/name
 * Change a user's first and last name (admin only)
 */
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Write operation - SUPPORT cannot modify user data
        if (!session?.user || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userId, firstName, lastName } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        if (!firstName?.trim() && !lastName?.trim()) {
            return NextResponse.json(
                { error: "At least first name or last name is required" },
                { status: 400 }
            );
        }

        // Get current user for logging
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { firstName: true, lastName: true, email: true },
        });

        if (!currentUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Update name
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName: firstName?.trim() || null,
                lastName: lastName?.trim() || null,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
            },
        });

        console.log(`[ADMIN] Name changed for user ${userId} (${currentUser.email}): "${currentUser.firstName} ${currentUser.lastName}" -> "${updatedUser.firstName} ${updatedUser.lastName}"`);

        return NextResponse.json({
            success: true,
            message: "Name updated successfully",
            oldName: `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim(),
            newName: `${updatedUser.firstName || ""} ${updatedUser.lastName || ""}`.trim(),
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error changing name:", error);
        return NextResponse.json(
            { error: "Failed to change name" },
            { status: 500 }
        );
    }
}
