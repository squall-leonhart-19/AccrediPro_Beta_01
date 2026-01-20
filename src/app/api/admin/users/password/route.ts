
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const passwordResetSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // 1. Verify Admin/Superuser Access - SUPPORT cannot modify
        if (!session?.user?.id || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
            return NextResponse.json(
                { error: "Unauthorized. Admin access required." },
                { status: 401 }
            );
        }

        const body = await request.json();

        // 2. Validate Input
        const validationResult = passwordResetSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const { userId, newPassword } = validationResult.data;

        // 3. Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // 4. Update the user
        await prisma.user.update({
            where: { id: userId },
            data: {
                passwordHash: hashedPassword,
                // Optionally clear any existing password reset tokens if you have them
            },
            select: { id: true },
        });

        // 5. Log the action (Optional but good practice)
        console.log(`Admin ${session.user.id} reset password for user ${userId}`);

        return NextResponse.json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error("Admin password reset error:", error);
        return NextResponse.json(
            { error: "Failed to reset password" },
            { status: 500 }
        );
    }
}
