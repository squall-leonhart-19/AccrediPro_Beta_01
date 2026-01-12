import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Mini diploma slugs - users with ONLY these should go to messages instead
const MINI_DIPLOMA_SLUGS = [
  "womens-health-mini-diploma",
  "functional-medicine-mini-diploma",
  "gut-health-mini-diploma",
  "health-coach-mini-diploma",
  "holistic-nutrition-mini-diploma",
  "hormone-health-mini-diploma",
  "nurse-coach-mini-diploma",
];
import { CourseCatalogFilters } from "@/components/courses/course-catalog-filters";

// Fallback Unsplash images for courses without thumbnails
const FALLBACK_THUMBNAILS: Record<string, string> = {
  // Health & Wellness
  "functional-medicine": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
  "health": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
  "wellness": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop",
  "nutrition": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop",
  "gut": "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&h=400&fit=crop",
  "hormone": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
  "thyroid": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
  "stress": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop",
  "sleep": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=400&fit=crop",
  "weight": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=400&fit=crop",
  "metabolic": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=400&fit=crop",
  "autoimmune": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
  "mental": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=400&fit=crop",
  "brain": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=400&fit=crop",
  "detox": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop",
  "energy": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop",
  "menopause": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
  "perimenopause": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
  "women": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
  "integrative": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
  "holistic": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop",
  "plant": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=400&fit=crop",
  "vegan": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=400&fit=crop",
  "pediatric": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=400&fit=crop",
  "child": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=400&fit=crop",
  "parenting": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=400&fit=crop",
  "grief": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&h=400&fit=crop",
  "trauma": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&h=400&fit=crop",
  "anxiety": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=400&fit=crop",
  "coach": "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=400&fit=crop",
  "default": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
};

// Get fallback thumbnail based on course title/slug
function getFallbackThumbnail(title: string, slug: string): string {
  const searchText = `${title} ${slug}`.toLowerCase();
  for (const [keyword, url] of Object.entries(FALLBACK_THUMBNAILS)) {
    if (keyword !== "default" && searchText.includes(keyword)) {
      return url;
    }
  }
  return FALLBACK_THUMBNAILS.default;
}

// Courses to hide from catalog (not ready for public or internal only)
const HIDDEN_COURSE_SLUGS = [
  // NARC courses - not ready
  "narc-recovery-coach-certification",
  "narcissistic-abuse-recovery-coach",
  "anrc-certification",
  // Pro Accelerator courses - OTO only, not for public catalog
  "fm-pro-advanced-clinical",
  "fm-pro-master-depth",
  "fm-pro-practice-path",
];

async function getCourses() {
  return prisma.course.findMany({
    where: {
      isPublished: true,
      certificateType: { not: 'MINI_DIPLOMA' },
      // Hide specific courses that are not ready
      slug: { notIn: HIDDEN_COURSE_SLUGS },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      shortDescription: true,
      thumbnail: true,
      difficulty: true,
      duration: true,
      isFeatured: true,
      isFree: true,
      price: true,
      certificateType: true,
      // Social Proof fields
      displayReviews: true,
      displayEnrollments: true,
      displayRating: true,
      socialProofEnabled: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
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
        select: {
          id: true,
          lessons: {
            where: { isPublished: true },
            select: { id: true }
          },
        },
      },
      _count: {
        select: { enrollments: true, reviews: true },
      },
      analytics: {
        select: {
          totalEnrolled: true,
          avgRating: true,
        },
      },
    },
    orderBy: [{ isFeatured: 'desc' }, { title: 'asc' }],
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

async function getUserGraduateStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      miniDiplomaCompletedAt: true,
      accessExpiresAt: true,
    },
  });

  // Check if user has active graduate access (30-day window)
  const now = new Date();
  const hasGraduateAccess = user?.accessExpiresAt && user.accessExpiresAt > now;

  return {
    miniDiplomaCompletedAt: user?.miniDiplomaCompletedAt || null,
    accessExpiresAt: hasGraduateAccess ? user?.accessExpiresAt : null,
    isGraduate: hasGraduateAccess,
  };
}

export default async function CoursesPage() {
  // Redirect ALL users from /catalog to /messages (catalog page deprecated)
  redirect("/messages");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const session = await getServerSession(authOptions);

  const [courses, categories, enrollments, specialOffers, wishlist, graduateStatus] = await Promise.all([
    getCourses(),
    getCategories(),
    session?.user?.id ? getUserEnrollments(session.user.id) : [],
    getActiveSpecialOffers(),
    session?.user?.id ? getUserWishlist(session.user.id) : [],
    session?.user?.id ? getUserGraduateStatus(session.user.id) : { miniDiplomaCompletedAt: null, accessExpiresAt: null, isGraduate: false },
  ]);

  // Transform the data for the client component
  const coursesData = courses.map((course) => ({
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    shortDescription: course.shortDescription,
    thumbnail: (course.thumbnail && course.thumbnail.trim() !== "")
      ? course.thumbnail
      : getFallbackThumbnail(course.title, course.slug),
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
    // Social Proof - use display values if enabled, otherwise fall back to real counts
    socialProof: (course as any).socialProofEnabled !== false ? {
      reviews: (course as any).displayReviews || course._count.reviews || 0,
      enrollments: (course as any).displayEnrollments || course._count.enrollments || 0,
      rating: (course as any).displayRating ? Number((course as any).displayRating) : 4.8,
    } : {
      reviews: course._count.reviews || 0,
      enrollments: course._count.enrollments || 0,
      rating: course.analytics ? Number(course.analytics.avgRating) : 0,
    },
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
        miniDiplomaCompletedAt={graduateStatus.miniDiplomaCompletedAt?.toISOString() || null}
        graduateAccessExpiresAt={graduateStatus.accessExpiresAt?.toISOString() || null}
        isGraduate={!!graduateStatus.isGraduate}
      />
    </div>
  );
}
