import prisma from "../src/lib/prisma";

/**
 * Seed 10 reviews for FM Certification course using zombie profiles
 * 9 x 5 stars, 1 x 4 stars
 */

const COURSE_SLUG = "functional-medicine-complete-certification";

const reviews = [
  {
    title: "Life-changing program!",
    content: "This certification has completely transformed my practice. The depth of knowledge about functional medicine principles, root cause analysis, and holistic approaches to patient care is exceptional. I've already started implementing these protocols with my clients and seeing remarkable results. Highly recommend for any health professional looking to expand their expertise.",
    rating: 5,
  },
  {
    title: "Excellent curriculum and support",
    content: "Very comprehensive and well-structured. The modules cover everything from gut health to hormone balance to detoxification pathways. Each lesson builds on the previous one, making complex concepts easy to understand. The case studies were particularly helpful in applying what I learned.",
    rating: 5,
  },
  {
    title: "Worth every penny",
    content: "As a practicing nurse, I was skeptical at first. But this program exceeded all my expectations. The evidence-based approach combined with practical applications makes it invaluable. I can now confidently discuss integrative approaches with patients and see better outcomes.",
    rating: 5,
  },
  {
    title: "Finally found what I was looking for",
    content: "After years of searching for the right functional medicine training, I found this gem. The accreditation gives it credibility, and the content is top-notch. The explanations are clear and engaging. I've recommended this to several colleagues already.",
    rating: 5,
  },
  {
    title: "Incredibly thorough training",
    content: "The attention to detail in this course is impressive. Every topic is covered comprehensively with the latest research. The downloadable resources are a bonus - I use them daily in my practice. This is exactly what modern healthcare practitioners need.",
    rating: 5,
  },
  {
    title: "Great for career advancement",
    content: "This certification opened new doors for my career. I'm now offering functional medicine consultations alongside my traditional practice. The ROI has been incredible - both professionally and financially. My patients appreciate the holistic approach.",
    rating: 5,
  },
  {
    title: "Perfect balance of theory and practice",
    content: "What sets this apart is how it balances scientific theory with real-world application. The protocols are immediately usable, and the community support is amazing. Connected with so many like-minded practitioners through the program.",
    rating: 5,
  },
  {
    title: "Changed how I approach patient care",
    content: "Before this course, I was treating symptoms. Now I understand how to identify and address root causes. My patients are getting better faster and staying well longer. This knowledge should be required for all healthcare providers.",
    rating: 5,
  },
  {
    title: "Solid foundation in functional medicine",
    content: "Provides an excellent foundation for anyone new to functional medicine. The pace is manageable even with a busy schedule. Some advanced topics could go deeper, but overall very satisfied with the content and presentation quality.",
    rating: 4,
  },
  {
    title: "Highly recommended certification",
    content: "Great course with comprehensive material. The video quality is excellent and the instructors are clearly experts in their field. The certification has given me credibility with patients seeking integrative care. Definitely worth your investment.",
    rating: 5,
  },
];

async function seedFMCertificationReviews() {
  console.log("🌱 Seeding FM Certification Reviews...\n");

  // Find the FM Certification course
  const course = await prisma.course.findFirst({
    where: { slug: COURSE_SLUG },
    select: { id: true, title: true },
  });

  if (!course) {
    console.error(`❌ Course not found: ${COURSE_SLUG}`);
    process.exit(1);
  }

  console.log(`📚 Found course: ${course.title} (${course.id})\n`);

  // Get zombie profiles with avatars
  const zombieProfiles = await prisma.user.findMany({
    where: {
      isFakeProfile: true,
      avatar: { not: null },
    },
    select: { id: true, firstName: true, lastName: true, avatar: true },
    take: 15,
  });

  console.log(`👤 Found ${zombieProfiles.length} zombie profiles with avatars\n`);

  if (zombieProfiles.length < 10) {
    console.error("❌ Not enough zombie profiles. Need at least 10.");
    process.exit(1);
  }

  // Delete existing reviews for this course
  const deleted = await prisma.courseReview.deleteMany({
    where: { courseId: course.id },
  });
  console.log(`🗑️  Deleted ${deleted.count} existing reviews\n`);

  // Shuffle profiles and pick 10
  const shuffled = zombieProfiles.sort(() => Math.random() - 0.5).slice(0, 10);

  // Create reviews
  let totalRating = 0;
  for (let i = 0; i < reviews.length; i++) {
    const profile = shuffled[i];
    const reviewData = reviews[i];

    // Random date within last 6 months
    const daysAgo = Math.floor(Math.random() * 180);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    await prisma.courseReview.create({
      data: {
        courseId: course.id,
        userId: profile.id,
        rating: reviewData.rating,
        title: reviewData.title,
        content: reviewData.content,
        isVerified: true,
        isPublic: true,
        createdAt,
      },
    });

    totalRating += reviewData.rating;
    console.log(`✅ Review ${i + 1}: "${reviewData.title}" (${reviewData.rating}⭐) by ${profile.firstName} ${profile.lastName}`);
  }

  const avgRating = totalRating / reviews.length;
  console.log(`\n📊 Average rating: ${avgRating.toFixed(2)}`);

  // Update or create course analytics
  const existingAnalytics = await prisma.courseAnalytics.findUnique({
    where: { courseId: course.id },
  });

  if (existingAnalytics) {
    await prisma.courseAnalytics.update({
      where: { courseId: course.id },
      data: { avgRating },
    });
  } else {
    await prisma.courseAnalytics.create({
      data: {
        courseId: course.id,
        avgRating,
        totalEnrolled: 1447,
      },
    });
  }

  console.log("\n✨ FM Certification Reviews seeded successfully!");
  console.log(`   Total reviews: 10 (9 x 5⭐, 1 x 4⭐)`);
  console.log(`   Average rating: ${avgRating.toFixed(1)}/5`);
}

seedFMCertificationReviews()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
