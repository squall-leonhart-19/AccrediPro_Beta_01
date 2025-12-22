import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CourseEditor } from "@/components/admin/courses/course-editor";

interface AdminCoursePageProps {
    params: {
        courseId: string;
    };
}

export default async function AdminCoursePage({ params }: AdminCoursePageProps) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    const { courseId } = params;

    const [course, categories, offers] = await Promise.all([
        prisma.course.findUnique({
            where: { id: courseId },
            include: {
                category: true,
                tags: { include: { tag: true } },
                offers: { include: { offer: true } },
                _count: {
                    select: {
                        enrollments: true,
                        modules: true,
                        certificates: true,
                    },
                },
                modules: {
                    include: {
                        lessons: {
                            orderBy: { order: "asc" },
                        },
                        _count: { select: { lessons: true } },
                    },
                    orderBy: { order: "asc" },
                },
            },
        }),
        prisma.category.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
        }),
        prisma.specialOffer.findMany({
            where: { isActive: true },
            orderBy: { usedCount: "desc" }
        }),
    ]);

    if (!course) {
        redirect("/admin/courses");
    }

    // Serialize dates for client component
    const serializedCourse = {
        ...course,
        price: course.price ? Number(course.price) : undefined,
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
        offers: course.offers.map(o => ({
            ...o,
            offer: {
                ...o.offer,
                discountValue: Number(o.offer.discountValue),
                minPurchase: o.offer.minPurchase ? Number(o.offer.minPurchase) : undefined,
                createdAt: o.offer.createdAt.toISOString(),
                updatedAt: o.offer.updatedAt.toISOString(),
                startsAt: o.offer.startsAt.toISOString(),
                expiresAt: o.offer.expiresAt?.toISOString() || null,
            }
        }))
    };

    const serializedOffers = offers.map(o => ({
        ...o,
        discountValue: Number(o.discountValue),
        minPurchase: o.minPurchase ? Number(o.minPurchase) : undefined,
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
        startsAt: o.startsAt.toISOString(),
        expiresAt: o.expiresAt?.toISOString() || null,
    }));

    return (
        <CourseEditor
            course={serializedCourse as any}
            categories={categories}
            availableOffers={serializedOffers}
        />
    );
}
