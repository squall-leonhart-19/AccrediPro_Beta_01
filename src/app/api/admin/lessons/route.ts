import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const lessonSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    content: z.string().optional(),
    videoId: z.string().optional(),
    moduleId: z.string(),
    lessonType: z.enum(["VIDEO", "TEXT", "QUIZ", "ASSIGNMENT", "LIVE_SESSION"]).optional(),
    order: z.number().optional(),
});

// GET - List lessons for a module
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const moduleId = searchParams.get("moduleId");

        if (!moduleId) {
            return NextResponse.json({ error: "Module ID required" }, { status: 400 });
        }

        const lessons = await prisma.lesson.findMany({
            where: { moduleId },
            orderBy: { order: "asc" },
        });

        return NextResponse.json({ lessons });
    } catch (error) {
        console.error("Get lessons error:", error);
        return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 });
    }
}

// POST - Create lesson
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const data = lessonSchema.parse(body);

        // Get max order
        const maxOrder = await prisma.lesson.findFirst({
            where: { moduleId: data.moduleId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const lesson = await prisma.lesson.create({
            data: {
                title: data.title,
                description: data.description,
                content: data.content,
                videoId: data.videoId,
                moduleId: data.moduleId,
                lessonType: data.lessonType ?? "VIDEO",
                order: (maxOrder?.order ?? -1) + 1,
                isPublished: true,
            },
        });

        return NextResponse.json({ lesson });
    } catch (error) {
        console.error("Create lesson error:", error);
        return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 });
    }
}

// PATCH - Update lesson
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ error: "Lesson ID required" }, { status: 400 });
        }

        const lesson = await prisma.lesson.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ lesson });
    } catch (error) {
        console.error("Update lesson error:", error);
        return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 });
    }
}

// DELETE - Delete lesson
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Lesson ID required" }, { status: 400 });
        }

        await prisma.lesson.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete lesson error:", error);
        return NextResponse.json({ error: "Failed to delete lesson" }, { status: 500 });
    }
}
