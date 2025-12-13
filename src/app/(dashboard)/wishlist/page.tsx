import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { WishlistContent } from "./wishlist-content";

async function getWishlist(userId: string) {
    return prisma.wishlist.findMany({
        where: { userId },
        include: {
            course: {
                include: {
                    category: true,
                    coach: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            avatar: true,
                            bio: true,
                        },
                    },
                    modules: {
                        where: { isPublished: true },
                        include: {
                            lessons: { where: { isPublished: true }, select: { id: true } },
                        },
                    },
                    _count: {
                        select: { enrollments: true, reviews: true },
                    },
                    analytics: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

async function getUserEnrollments(userId: string) {
    return prisma.enrollment.findMany({
        where: { userId },
        select: { courseId: true, status: true, progress: true },
    });
}

export default async function WishlistPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const [wishlist, enrollments] = await Promise.all([
        getWishlist(session.user.id),
        getUserEnrollments(session.user.id),
    ]);

    const wishlistData = wishlist.map((item) => ({
        id: item.id,
        courseId: item.courseId,
        addedAt: item.createdAt,
        course: {
            id: item.course.id,
            slug: item.course.slug,
            title: item.course.title,
            description: item.course.description,
            shortDescription: item.course.shortDescription,
            thumbnail: item.course.thumbnail,
            difficulty: item.course.difficulty,
            duration: item.course.duration,
            isFeatured: item.course.isFeatured,
            isFree: item.course.isFree,
            price: item.course.price ? Number(item.course.price) : null,
            certificateType: item.course.certificateType,
            category: item.course.category
                ? { id: item.course.category.id, name: item.course.category.name }
                : null,
            coach: item.course.coach
                ? {
                    id: item.course.coach.id,
                    name: `${item.course.coach.firstName} ${item.course.coach.lastName}`,
                    avatar: item.course.coach.avatar,
                    title: item.course.coach.bio,
                }
                : null,
            modules: item.course.modules.map((m) => ({
                lessons: m.lessons.map((l) => ({ id: l.id })),
            })),
            _count: item.course._count,
            analytics: item.course.analytics
                ? {
                    totalEnrolled: item.course.analytics.totalEnrolled,
                    avgRating: Number(item.course.analytics.avgRating),
                }
                : null,
        },
    }));

    const enrollmentsData = enrollments.map((e) => ({
        courseId: e.courseId,
        status: e.status,
        progress: Number(e.progress),
    }));

    return <WishlistContent wishlist={wishlistData} enrollments={enrollmentsData} />;
}
