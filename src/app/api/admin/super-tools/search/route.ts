import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify Admin
    const adminUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    if (adminUser?.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const userId = searchParams.get("userId");

    try {
        let whereClause = {};

        if (userId) {
            whereClause = { id: userId };
        } else if (query) {
            whereClause = {
                OR: [
                    { email: { contains: query, mode: "insensitive" } },
                    { firstName: { contains: query, mode: "insensitive" } },
                    { lastName: { contains: query, mode: "insensitive" } },
                ],
            };
        } else {
            return NextResponse.json({ users: [] });
        }

        const users = await prisma.user.findMany({
            where: whereClause,
            take: 20,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
                role: true,
                enrollments: {
                    select: {
                        id: true,
                        courseId: true,
                        progress: true,
                        status: true,
                        course: {
                            select: {
                                title: true,
                                slug: true,
                            },
                        },
                    },
                },
                podMemberships: {
                    select: {
                        id: true,
                        role: true,
                        joinedAt: true,
                        pod: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error("Super Tools Search Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

