import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CoursesClient } from "./courses-client";

// Fallback Unsplash images for courses without thumbnails
const FALLBACK_THUMBNAILS: Record<string, string> = {
    "functional-medicine": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
    "health": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
    "wellness": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop",
    "nutrition": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop",
    "gut": "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&h=400&fit=crop",
    "hormone": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
    "coach": "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=400&fit=crop",
    "default": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
};

function getFallbackThumbnail(title: string, slug: string): string {
    const searchText = `${title} ${slug}`.toLowerCase();
    for (const [keyword, url] of Object.entries(FALLBACK_THUMBNAILS)) {
        if (keyword !== "default" && searchText.includes(keyword)) {
            return url;
        }
    }
    return FALLBACK_THUMBNAILS.default;
}

// Courses to hide from catalog
const HIDDEN_COURSE_SLUGS = [
    "narc-recovery-coach-certification",
    "narcissistic-abuse-recovery-coach",
    "anrc-certification",
    "fm-pro-advanced-clinical",
    "fm-pro-master-depth",
    "fm-pro-practice-path",
];

async function getCourses() {
    return prisma.course.findMany({
        where: {
            isPublished: true,
            certificateType: { not: 'MINI_DIPLOMA' },
            slug: { notIn: HIDDEN_COURSE_SLUGS },
        },
        select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            shortDescription: true,
            thumbnail: true,
            price: true,
            isFree: true,
            isFeatured: true,
            duration: true,
            certificateType: true,
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'asc' }],
    });
}

async function getUserEnrollments(userId: string) {
    return prisma.enrollment.findMany({
        where: { userId },
        select: {
            courseId: true,
            status: true,
            progress: true
        },
    });
}

export default async function CoursesPage() {
    const session = await getServerSession(authOptions);

    const [courses, enrollments] = await Promise.all([
        getCourses(),
        session?.user?.id ? getUserEnrollments(session.user.id) : [],
    ]);

    // Transform courses data
    const coursesData = courses.map((course) => ({
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        shortDescription: course.shortDescription,
        thumbnail: (course.thumbnail && course.thumbnail.trim() !== "")
            ? course.thumbnail
            : getFallbackThumbnail(course.title, course.slug),
        price: course.price ? Number(course.price) : null,
        isFree: course.isFree,
        isFeatured: course.isFeatured,
        duration: course.duration,
        certificateType: course.certificateType,
    }));

    // Transform enrollments data
    const enrollmentsData = enrollments.map((e) => ({
        courseId: e.courseId,
        status: e.status,
        progress: Number(e.progress),
    }));

    return (
        <div className="p-6 animate-fade-in">
            <CoursesClient
                courses={coursesData}
                enrollments={enrollmentsData}
            />
        </div>
    );
}
