import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { CourseBuilder } from "@/components/admin/course-builder";

interface PageProps {
    params: Promise<{ courseId: string }>;
}

async function getCourseData(courseId: string) {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            category: true,
            modules: {
                include: {
                    lessons: {
                        orderBy: { order: "asc" },
                    },
                },
                orderBy: { order: "asc" },
            },
            _count: {
                select: { enrollments: true, certificates: true },
            },
        },
    });
    return course;
}

export default async function CourseBuilderPage({ params }: PageProps) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    const { courseId } = await params;
    const course = await getCourseData(courseId);

    if (!course) {
        notFound();
    }

    // Serialize for client
    const serializedCourse = {
        ...course,
        price: course.price ? Number(course.price) : null,
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),
        publishedAt: course.publishedAt?.toISOString() || null,
        modules: course.modules.map(m => ({
            ...m,
            createdAt: m.createdAt.toISOString(),
            updatedAt: m.updatedAt.toISOString(),
            lessons: m.lessons.map(l => ({
                ...l,
                createdAt: l.createdAt.toISOString(),
                updatedAt: l.updatedAt.toISOString(),
            })),
        })),
    };

    return <CourseBuilder course={serializedCourse as any} />;
}
