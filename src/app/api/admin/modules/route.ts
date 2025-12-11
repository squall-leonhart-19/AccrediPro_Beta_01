import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const moduleSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    courseId: z.string(),
    order: z.number().optional(),
});

// GET - List modules for a course
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get("courseId");

        if (!courseId) {
            return NextResponse.json({ error: "Course ID required" }, { status: 400 });
        }

        const modules = await prisma.module.findMany({
            where: { courseId },
            include: {
                lessons: {
                    orderBy: { order: "asc" },
                    select: {
                        id: true,
                        title: true,
                        order: true,
                        isPublished: true,
                        lessonType: true,
                        videoDuration: true,
                    },
                },
                _count: { select: { lessons: true } },
            },
            orderBy: { order: "asc" },
        });

        return NextResponse.json({ modules });
    } catch (error) {
        console.error("Get modules error:", error);
        return NextResponse.json({ error: "Failed to fetch modules" }, { status: 500 });
    }
}

// POST - Create module
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const data = moduleSchema.parse(body);

        // Get max order
        const maxOrder = await prisma.module.findFirst({
            where: { courseId: data.courseId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const module = await prisma.module.create({
            data: {
                title: data.title,
                description: data.description,
                courseId: data.courseId,
                order: (maxOrder?.order ?? -1) + 1,
                isPublished: true,
            },
            include: {
                lessons: true,
                _count: { select: { lessons: true } },
            },
        });

        return NextResponse.json({ module });
    } catch (error) {
        console.error("Create module error:", error);
        return NextResponse.json({ error: "Failed to create module" }, { status: 500 });
    }
}

// PATCH - Update module
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ error: "Module ID required" }, { status: 400 });
        }

        const module = await prisma.module.update({
            where: { id },
            data: updateData,
            include: {
                lessons: true,
                _count: { select: { lessons: true } },
            },
        });

        return NextResponse.json({ module });
    } catch (error) {
        console.error("Update module error:", error);
        return NextResponse.json({ error: "Failed to update module" }, { status: 500 });
    }
}

// DELETE - Delete module
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Module ID required" }, { status: 400 });
        }

        await prisma.module.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete module error:", error);
        return NextResponse.json({ error: "Failed to delete module" }, { status: 500 });
    }
}
