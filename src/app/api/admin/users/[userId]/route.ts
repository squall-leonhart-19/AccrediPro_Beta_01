import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        // Allow read access for ADMIN, SUPERUSER, INSTRUCTOR, SUPPORT (read-only)
        if (!session?.user || !["ADMIN", "SUPERUSER", "INSTRUCTOR", "SUPPORT"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = params.userId;
        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                createdAt: true,
                role: true,
                tags: {
                    select: {
                        id: true,
                        tag: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
                enrollments: {
                    select: {
                        id: true,
                        progress: true,
                        course: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Format tags for display
        const formattedTags = user.tags.map(t => ({
            id: t.id,
            name: t.tag.replace(/_/g, ' ').replace(/-/g, ' '),
        }));

        return NextResponse.json({
            user: {
                ...user,
                tags: formattedTags,
            },
        });
    } catch (error) {
        console.error("[GET /api/admin/users/[userId]] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
