import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { MiniDiplomaClient } from "@/components/freebie/mini-diploma-client";

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";

export default async function MyMiniDiplomaPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    // Get user with mini diploma info
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            firstName: true,
            miniDiplomaCategory: true,
            miniDiplomaCompletedAt: true,
        },
    });

    // If user doesn't have a mini diploma, redirect to courses
    if (!user?.miniDiplomaCategory) {
        redirect("/courses");
    }

    // If already completed, redirect to celebration page
    if (user.miniDiplomaCompletedAt) {
        redirect("/my-mini-diploma/complete");
    }

    // Find the mini diploma course for this category
    // Handle variants like "functional-medicine-general" -> search for "functional-medicine"
    const baseCategory = user.miniDiplomaCategory?.replace(/-general$/, '').replace(/-clinician$/, '') || "";

    const miniDiplomaCourse = await prisma.course.findFirst({
        where: {
            certificateType: "MINI_DIPLOMA",
            isPublished: true,
            OR: [
                { slug: { contains: baseCategory } },
                { slug: { contains: "mini-diploma" } },
                { category: { slug: baseCategory } },
            ],
        },
        include: {
            modules: {
                where: { isPublished: true },
                orderBy: { order: "asc" },
                include: {
                    lessons: {
                        where: { isPublished: true },
                        orderBy: { order: "asc" },
                    },
                },
            },
            category: true,
        },
    });

    // Get user's enrollment and progress if course exists
    let enrollment = null;
    let lessonProgress: string[] = [];

    if (miniDiplomaCourse) {
        enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: miniDiplomaCourse.id,
                },
            },
        });

        const progress = await prisma.lessonProgress.findMany({
            where: {
                userId: user.id,
                lesson: { module: { courseId: miniDiplomaCourse.id } },
                isCompleted: true,
            },
            select: { lessonId: true },
        });
        lessonProgress = progress.map(p => p.lessonId);
    }

    return (
        <MiniDiplomaClient
            user={{
                firstName: user.firstName || "Student",
                miniDiplomaCategory: user.miniDiplomaCategory!,
            }}
            course={miniDiplomaCourse ? {
                ...miniDiplomaCourse,
                price: miniDiplomaCourse.price ? Number(miniDiplomaCourse.price) : null,
            } : null}
            enrollment={enrollment}
            completedLessonIds={lessonProgress}
        />
    );
}
