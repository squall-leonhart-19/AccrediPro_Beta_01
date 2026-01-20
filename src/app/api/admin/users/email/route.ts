import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * PATCH /api/admin/users/email
 * Change a user's email address (admin only)
 */
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Write operation - SUPPORT cannot modify user data
        if (!session?.user || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userId, newEmail } = await request.json();

        if (!userId || !newEmail) {
            return NextResponse.json(
                { error: "User ID and new email are required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Check if email is already in use
        const existingUser = await prisma.user.findUnique({
            where: { email: newEmail.toLowerCase() },
        });

        if (existingUser && existingUser.id !== userId) {
            return NextResponse.json(
                { error: "Email is already in use by another user" },
                { status: 400 }
            );
        }

        // Get current user for logging
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });

        if (!currentUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Update email
        await prisma.user.update({
            where: { id: userId },
            data: { email: newEmail.toLowerCase() },
        });

        console.log(`[ADMIN] Email changed for user ${userId}: ${currentUser.email} -> ${newEmail}`);

        return NextResponse.json({
            success: true,
            message: "Email updated successfully",
            oldEmail: currentUser.email,
            newEmail: newEmail.toLowerCase(),
        });
    } catch (error) {
        console.error("Error changing email:", error);
        return NextResponse.json(
            { error: "Failed to change email" },
            { status: 500 }
        );
    }
}
