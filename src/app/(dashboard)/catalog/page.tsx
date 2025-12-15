import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CourseCatalogFilters } from "@/components/courses/course-catalog-filters";

async function getCourses() {
  return prisma.course.findMany({
    where: { isPublished: true },
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
    orderBy: [{ isFeatured: "desc" }, { price: "desc" }, { createdAt: "desc" }],
  });
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

async function getUserEnrollments(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    select: { courseId: true, status: true, progress: true },
  });
}

async function getActiveSpecialOffers() {
  const now = new Date();
  return prisma.specialOffer.findMany({
    where: {
      isActive: true,
      isFeatured: true,
      startsAt: { lte: now },
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: now } },
      ],
    },
    include: {
      courses: {
        select: { courseId: true },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });
}

async function getUserWishlist(userId: string) {
  return prisma.wishlist.findMany({
    where: { userId },
    select: { courseId: true },
  });
}

export default async function CoursesPage() {
  const session = await getServerSession(authOptions);
  const [courses, categories, enrollments, specialOffers, wishlist] = await Promise.all([
    getCourses(),
    getCategories(),
    session?.user?.id ? getUserEnrollments(session.user.id) : [],
    getActiveSpecialOffers(),
    session?.user?.id ? getUserWishlist(session.user.id) : [],
  ]);

  // Transform the data for the client component
  const coursesData = courses.map((course) => ({
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    shortDescription: course.shortDescription,
    thumbnail: course.thumbnail,
    difficulty: course.difficulty,
    duration: course.duration,
    isFeatured: course.isFeatured,
    isFree: course.isFree,
    price: course.price ? Number(course.price) : null,
    certificateType: course.certificateType,
    category: course.category
      ? { id: course.category.id, name: course.category.name }
      : null,
    coach: course.coach
      ? {
          id: course.coach.id,
          name: `${course.coach.firstName} ${course.coach.lastName}`,
          avatar: course.coach.avatar,
          title: course.coach.bio,
        }
      : null,
    modules: course.modules.map((m) => ({
      lessons: m.lessons.map((l) => ({ id: l.id })),
    })),
    _count: course._count,
    analytics: course.analytics
      ? {
          totalEnrolled: course.analytics.totalEnrolled,
          avgRating: Number(course.analytics.avgRating),
        }
      : null,
  }));

  const categoriesData = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

  const enrollmentsData = enrollments.map((e) => ({
    courseId: e.courseId,
    status: e.status,
    progress: Number(e.progress),
  }));

  const specialOffersData = specialOffers.map((offer) => ({
    id: offer.id,
    title: offer.title,
    discount: Number(offer.discountValue),
    expiresAt: offer.expiresAt,
    courses: offer.courses.map((c) => c.courseId),
  }));

  const wishlistIds = wishlist.map((w) => w.courseId);

  return (
    <div className="animate-fade-in">
      <CourseCatalogFilters
        courses={coursesData}
        categories={categoriesData}
        enrollments={enrollmentsData}
        specialOffers={specialOffersData}
        wishlistIds={wishlistIds}
        isLoggedIn={!!session?.user?.id}
      />
    </div>
  );
}
