import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Search students for coaches/admins to message
export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only coaches/admins can use this endpoint
    const isCoach = ["ADMIN", "INSTRUCTOR", "MENTOR"].includes(session.user.role as string);
    if (!isCoach) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "20");

    try {
        const students = await prisma.user.findMany({
            where: {
                role: "USER", // Only students
                isActive: true,
                OR: query ? [
                    { firstName: { contains: query, mode: "insensitive" } },
                    { lastName: { contains: query, mode: "insensitive" } },
                    { email: { contains: query, mode: "insensitive" } },
                ] : undefined,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                role: true,
                enrollments: {
                    select: {
                        id: true,
                        progress: true,
                        status: true,
                        course: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                            },
                        },
                    },
                    take: 3,
                    orderBy: { updatedAt: "desc" },
                },
            },
            take: limit,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ students });
    } catch (error) {
        console.error("Failed to search students:", error);
        return NextResponse.json({ error: "Failed to search", students: [] }, { status: 500 });
    }
}
