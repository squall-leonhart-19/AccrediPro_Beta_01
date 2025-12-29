import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        console.log("[DEBUG-LOGIN] Testing login for:", email);

        // 1. Find user
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                error: "USER_NOT_FOUND",
                message: "No user found with this email"
            }, { status: 404 });
        }

        console.log("[DEBUG-LOGIN] User found:", {
            id: user.id,
            email: user.email,
            hasPasswordHash: !!user.passwordHash,
            passwordHashLength: user.passwordHash?.length,
            isActive: user.isActive,
        });

        // 2. Check password hash exists
        if (!user.passwordHash) {
            return NextResponse.json({
                success: false,
                error: "NO_PASSWORD_HASH",
                message: "User has no password set"
            }, { status: 400 });
        }

        // 3. Check if active
        if (!user.isActive) {
            return NextResponse.json({
                success: false,
                error: "ACCOUNT_DEACTIVATED",
                message: "Account is deactivated"
            }, { status: 403 });
        }

        // 4. Test password comparison
        try {
            const isValid = await bcrypt.compare(password, user.passwordHash);

            if (isValid) {
                return NextResponse.json({
                    success: true,
                    message: "Password is CORRECT! Login should work.",
                    user: {
                        id: user.id,
                        email: user.email,
                        name: `${user.firstName} ${user.lastName}`,
                    }
                });
            } else {
                return NextResponse.json({
                    success: false,
                    error: "INVALID_PASSWORD",
                    message: "Password does not match"
                }, { status: 401 });
            }
        } catch (bcryptError) {
            console.error("[DEBUG-LOGIN] bcrypt.compare error:", bcryptError);
            return NextResponse.json({
                success: false,
                error: "BCRYPT_ERROR",
                message: "bcrypt.compare threw an error",
                details: String(bcryptError)
            }, { status: 500 });
        }

    } catch (error) {
        console.error("[DEBUG-LOGIN] General error:", error);
        return NextResponse.json({
            success: false,
            error: "GENERAL_ERROR",
            message: String(error)
        }, { status: 500 });
    }
}
