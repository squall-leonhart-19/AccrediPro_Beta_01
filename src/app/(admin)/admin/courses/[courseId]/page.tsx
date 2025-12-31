import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CourseEditor } from "@/components/admin/courses/course-editor";

interface AdminCoursePageProps {
    params: Promise<{
        courseId: string;
    }>;
}

export default async function AdminCoursePage({ params }: AdminCoursePageProps) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    const { courseId } = await params;

    const [course, categories, offers, coaches] = await Promise.all([
        prisma.course.findUnique({
            where: { id: courseId },
            include: {
                category: true,
                tags: { include: { tag: true } },
                offers: { include: { offer: true } },
                analytics: true,
                reviews: {
                    select: { rating: true },
                },
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
                            select: {
                                id: true,
                                title: true,
                                order: true,
                                isPublished: true,
                                lessonType: true,
                                duration: true,
                                createdAt: true,
                                updatedAt: true,
                            },
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
        // Fetch coaches (instructors and mentors)
        prisma.user.findMany({
            where: {
                role: { in: ["INSTRUCTOR", "MENTOR", "ADMIN"] },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
            },
            orderBy: { firstName: "asc" },
        }),
    ]);

    if (!course) {
        redirect("/admin/courses");
    }

    // Calculate analytics if not available
    const avgRating = course.reviews.length > 0
        ? course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length
        : 0;

    // Serialize dates for client component
    const serializedCourse = {
        ...course,
        price: course.price ? Number(course.price) : undefined,
        duration: course.duration || null,
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),
        publishedAt: course.publishedAt?.toISOString() || null,
        analytics: course.analytics ? {
            totalEnrolled: course.analytics.totalEnrolled,
            avgRating: Number(course.analytics.avgRating) || avgRating,
            completionRate: Number(course.analytics.avgProgress) || 0,
        } : {
            totalEnrolled: course._count.enrollments,
            avgRating: avgRating,
            completionRate: 0,
        },
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
            coaches={coaches}
            availableOffers={serializedOffers}
        />
    );
}
