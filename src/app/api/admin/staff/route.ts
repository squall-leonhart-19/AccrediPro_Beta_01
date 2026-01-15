import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Cache staff list for 5 minutes (rarely changes)
export const revalidate = 300;

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const staff = await prisma.user.findMany({
            where: {
                role: { in: ["ADMIN", "INSTRUCTOR", "MENTOR"] },
                isActive: true,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                avatar: true,
            },
            orderBy: { firstName: "asc" },
        });

        const response = NextResponse.json({ staff });
        response.headers.set(
            "Cache-Control",
            "private, s-maxage=300, stale-while-revalidate=600"
        );
        return response;
    } catch (error) {
        console.error("Failed to fetch staff:", error);
        return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
    }
}
