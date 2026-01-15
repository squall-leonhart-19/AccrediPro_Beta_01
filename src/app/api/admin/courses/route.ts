import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const courseSchema = z.object({
    title: z.string().min(1).max(200),
    slug: z.string().min(1).max(200),
    description: z.string().min(1),
    shortDescription: z.string().optional().nullable(),
    thumbnail: z.string().optional().nullable(),
    price: z.number().optional().nullable(),
    isFree: z.boolean().optional(),
    isPublished: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).optional(),
    certificateType: z.enum(["COMPLETION", "CERTIFICATION", "MINI_DIPLOMA"]).optional(),
    categoryId: z.string().optional().nullable(),
    coachId: z.string().optional().nullable(),
    duration: z.number().optional().nullable(),
});

// GET - List all courses with pagination
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const search = searchParams.get("search") || "";
        const skip = (page - 1) * limit;

        // Build where clause for search
        const where = search
            ? {
                OR: [
                    { title: { contains: search, mode: "insensitive" as const } },
                    { slug: { contains: search, mode: "insensitive" as const } },
                ],
            }
            : {};

        // PERFORMANCE: Run count and fetch in parallel
        const [total, courses] = await Promise.all([
            prisma.course.count({ where }),
            prisma.course.findMany({
                where,
                include: {
                    category: true,
                    _count: {
                        select: {
                            enrollments: true,
                            modules: true,
                            certificates: true,
                        },
                    },
                    modules: {
                        include: {
                            _count: { select: { lessons: true } },
                        },
                        orderBy: { order: "asc" },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
        ]);

        return NextResponse.json({
            courses,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: skip + courses.length < total,
            },
        });
    } catch (error) {
        console.error("Get courses error:", error);
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
}

// POST - Create new course
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const data = courseSchema.parse(body);

        // Check if slug exists
        const existing = await prisma.course.findUnique({ where: { slug: data.slug } });
        if (existing) {
            return NextResponse.json({ error: "Course with this slug already exists" }, { status: 400 });
        }

        const course = await prisma.course.create({
            data: {
                title: data.title,
                slug: data.slug,
                description: data.description,
                shortDescription: data.shortDescription,
                thumbnail: data.thumbnail,
                price: data.price,
                isFree: data.isFree ?? true,
                isPublished: data.isPublished ?? false,
                isFeatured: data.isFeatured ?? false,
                difficulty: data.difficulty ?? "BEGINNER",
                certificateType: data.certificateType ?? "COMPLETION",
                categoryId: data.categoryId,
            },
            include: {
                category: true,
                _count: { select: { enrollments: true, modules: true } },
            },
        });

        return NextResponse.json({ course });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
        }
        console.error("Create course error:", error);
        return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
    }
}

// PATCH - Update course
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ error: "Course ID required" }, { status: 400 });
        }

        const course = await prisma.course.update({
            where: { id },
            data: updateData,
            include: {
                category: true,
                _count: { select: { enrollments: true, modules: true } },
            },
        });

        return NextResponse.json({ course });
    } catch (error) {
        console.error("Update course error:", error);
        return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
    }
}

// DELETE - Delete course
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Course ID required" }, { status: 400 });
        }

        await prisma.course.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete course error:", error);
        return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
    }
}
