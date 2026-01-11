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
    const courseId = searchParams.get("courseId");

    if (!courseId) {
        return NextResponse.json({ error: "courseId required" }, { status: 400 });
    }

    const modules = await prisma.module.findMany({
        where: {
            courseId,
            isPublished: true
        },
        select: {
            id: true,
            title: true,
            order: true,
            _count: {
                select: { lessons: true }
            }
        },
        orderBy: { order: "asc" }
    });

    return NextResponse.json({ modules });
}
