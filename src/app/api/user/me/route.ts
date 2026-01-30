import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/user/me - Get current user info with tags
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ user: null });
        }

        // Get user with tags
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                avatar: true,
                tags: {
                    select: { tag: true },
                },
            },
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error("[GET /api/user/me] Error:", error);
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
