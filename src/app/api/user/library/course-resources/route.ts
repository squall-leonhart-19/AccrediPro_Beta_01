import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch course resources for user's enrolled courses
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const resourceType = searchParams.get("type"); // Optional filter: PDF, DOCUMENT, etc.

        // Get user's enrollments with course resources
        const enrollments = await prisma.enrollment.findMany({
            where: {
                userId: session.user.id,
                status: { in: ["ACTIVE", "COMPLETED"] }
            },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        thumbnail: true,
                        modules: {
                            where: { isPublished: true },
                            orderBy: { order: "asc" },
                            select: {
                                id: true,
                                title: true,
                                lessons: {
                                    where: { isPublished: true },
                                    orderBy: { order: "asc" },
                                    select: {
                                        id: true,
                                        title: true,
                                        resources: {
                                            where: resourceType ? {
                                                type: resourceType as any
                                            } : undefined,
                                            select: {
                                                id: true,
                                                title: true,
                                                type: true,
                                                url: true,
                                                size: true,
                                                createdAt: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Flatten resources with course/module/lesson context
        const resources: Array<{
            id: string;
            title: string;
            type: string;
            url: string;
            size: number | null;
            courseName: string;
            courseSlug: string;
            courseThumbnail: string | null;
            moduleName: string;
            lessonName: string;
            createdAt: Date;
        }> = [];

        for (const enrollment of enrollments) {
            const course = enrollment.course;
            for (const module of course.modules) {
                for (const lesson of module.lessons) {
                    for (const resource of lesson.resources) {
                        resources.push({
                            id: resource.id,
                            title: resource.title,
                            type: resource.type,
                            url: resource.url,
                            size: resource.size,
                            courseName: course.title,
                            courseSlug: course.slug,
                            courseThumbnail: course.thumbnail,
                            moduleName: module.title,
                            lessonName: lesson.title,
                            createdAt: resource.createdAt
                        });
                    }
                }
            }
        }

        // Sort by most recent first
        resources.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json({
            success: true,
            resources,
            count: resources.length
        });

    } catch (error) {
        console.error("Error fetching course resources:", error);
        return NextResponse.json(
            { error: "Failed to fetch course resources" },
            { status: 500 }
        );
    }
}
