import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const mentors = await prisma.user.findMany({
            where: {
                role: { in: ["MENTOR", "INSTRUCTOR", "ADMIN"] },
                isActive: true,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                role: true,
                bio: true,
            },
            take: 10,
        });

        return NextResponse.json({ mentors });
    } catch (error) {
        console.error("Failed to fetch mentors:", error);
        return NextResponse.json({ error: "Failed to fetch", mentors: [] }, { status: 500 });
    }
}
