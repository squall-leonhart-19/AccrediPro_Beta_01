import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import * as bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from "@/lib/email";

const sendLoginSchema = z.object({
    userId: z.string(),
    email: z.string().email().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Only admins/superusers can perform this action - SUPPORT cannot send login emails
        if (!session?.user?.id || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const data = sendLoginSchema.parse(body);

        // Fetch existing user to check current email
        const existingUser = await prisma.user.findUnique({
            where: { id: data.userId },
            select: { id: true, email: true },
        });

        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        let updatedEmail = existingUser.email;

        // 1. Update Email if provided and different
        if (data.email && (!existingUser.email || data.email.toLowerCase() !== existingUser.email.toLowerCase())) {
            const emailCollision = await prisma.user.findUnique({
                where: { email: data.email.toLowerCase() },
                select: { id: true },
            });

            if (emailCollision) {
                return NextResponse.json(
                    { error: "Email already in use by another user" },
                    { status: 400 }
                );
            }

            updatedEmail = data.email.toLowerCase();
        }

        // 2. Reset Password to default "Futurecoach2025"
        // We do this EVERY time this button is clicked to ensure the credentials sent work
        const defaultPassword = "Futurecoach2025";
        const passwordHash = await bcrypt.hash(defaultPassword, 12);

        // Perform updates
        const updatedUser = await prisma.user.update({
            where: { id: data.userId },
            data: {
                email: updatedEmail,
                passwordHash: passwordHash,
            },
            select: {
                firstName: true,
                email: true,
            }
        });

        // 3. Send the Welcome Email
        if (updatedUser.email) {
            await sendWelcomeEmail(updatedUser.email, updatedUser.firstName || "Student");
        }

        return NextResponse.json({
            success: true,
            message: `Login credentials sent to ${updatedUser.email}`,
            user: updatedUser,
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            );
        }

        console.error("Send login email error:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}
