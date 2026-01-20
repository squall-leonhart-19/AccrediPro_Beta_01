import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * GET /api/admin/users/diagnose?email=xxx
 * Check user password hash status
 * 
 * POST /api/admin/users/diagnose
 * Force reset a user's password to a known value
 */

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        // Read operation - allow SUPPORT for read-only access
        if (!session?.user?.id || !["ADMIN", "SUPERUSER", "SUPPORT"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = request.nextUrl.searchParams.get("email");
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                passwordHash: true,
                isActive: true,
                createdAt: true,
                lastLoginAt: true,
                loginCount: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const hash = user.passwordHash;
        const diagnosis = {
            found: true,
            email: user.email,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            isActive: user.isActive,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt,
            loginCount: user.loginCount,
            passwordHash: {
                exists: !!hash,
                length: hash?.length || 0,
                prefix: hash?.substring(0, 10) || null,
                isValidBcrypt: hash ? /^\$2[aby]\$\d{2}\$/.test(hash) : false,
                format: hash?.startsWith("$2b$12$") ? "bcrypt-12" :
                    hash?.startsWith("$2a$") ? "bcrypt-a" :
                        hash?.startsWith("$2b$") ? "bcrypt-b" :
                            hash ? "unknown" : "none",
            }
        };

        return NextResponse.json(diagnosis);
    } catch (error) {
        console.error("Diagnose error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        // Write operation - SUPPORT cannot modify
        if (!session?.user?.id || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { email, newPassword } = body;

        if (!email || !newPassword) {
            return NextResponse.json({
                error: "Email and newPassword are required"
            }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Generate a fresh bcrypt hash
        const newHash = await bcrypt.hash(newPassword, 12);

        // Verify the hash works before saving
        const testVerify = await bcrypt.compare(newPassword, newHash);
        if (!testVerify) {
            return NextResponse.json({
                error: "Hash verification failed - bcrypt issue"
            }, { status: 500 });
        }

        // Update the user
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: newHash },
        });

        console.log(`[DIAGNOSE] Force reset password for ${email} by admin ${session.user.email}`);

        return NextResponse.json({
            success: true,
            message: `Password reset for ${email}`,
            hashPrefix: newHash.substring(0, 10),
            hashLength: newHash.length,
        });
    } catch (error) {
        console.error("Force reset error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
