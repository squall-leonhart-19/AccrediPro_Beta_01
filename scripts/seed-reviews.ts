import prisma from "../src/lib/prisma";
import { UserRole } from "@prisma/client";

// Use existing fake profiles from database - these already have AccrediPro avatars
const REVIEWS = [
  {
    firstName: "Tiffany",
    lastName: "Rodriguez",
    rating: 5,
    comment: "This certification completely transformed my practice! The functional medicine framework is exactly what I needed to help my clients achieve real, lasting results. Sarah's teaching style makes complex concepts easy to understand.",
    avatar: "https://accredipro.academy/wp-content/uploads/2025/12/1000009537.jpg"
  },
  {
    firstName: "Addison",
    lastName: "Torres",
    rating: 5,
    comment: "I was skeptical at first, but this program exceeded all my expectations. The depth of content, the practical case studies, and the ongoing support from the mentors have been invaluable. I'm now confidently running my own practice.",
    avatar: "https://accredipro.academy/wp-content/uploads/2025/12/linkedin-2024.jpg"
  },
  {
    firstName: "Martha",
    lastName: "Walker",
    rating: 5,
    comment: "Worth every penny! The certification opened so many doors for me. Within 3 months of completing the program, I had my first 10 paying clients. The business modules alone are worth the investment.",
    avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_3542-Profile-Picture-Updated.jpg"
  },
  {
    firstName: "Teresa",
    lastName: "Lewis",
    rating: 5,
    comment: "As a health professional looking to specialize in functional medicine, this course gave me the confidence and credentials I needed. The 9x accreditations made it easy to gain trust with my clients.",
    avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1335.jpeg"
  },
  {
    firstName: "Emilia",
    lastName: "Foster",
    rating: 5,
    comment: "The community support is incredible. Even after completing the certification, I still have access to the mentors and fellow practitioners. It's like joining a family of health professionals.",
    avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1235.jpeg"
  },
  {
    firstName: "Janet",
    lastName: "Howard",
    rating: 5,
    comment: "I've taken many online courses, but this one stands out. The quality of video content, the interactive quizzes, and the practical assignments ensure you really learn and retain the material.",
    avatar: "https://accredipro.academy/wp-content/uploads/2025/12/89C2493E-DCEC-43FB-9A61-1FB969E45B6F_1_105_c.jpeg"
  },
  {
    firstName: "Ashley",
    lastName: "Edwards",
    rating: 5,
    comment: "The root cause approach taught in this program has helped me solve health issues that conventional medicine couldn't. My clients are seeing remarkable improvements!",
    avatar: "https://accredipro.academy/wp-content/uploads/2025/12/Cover-photo-for-Functional-Wellness.jpg"
  },
  {
    firstName: "Jade",
    lastName: "Perez",
    rating: 4,
    comment: "Excellent program with comprehensive content. The only reason I'm not giving 5 stars is that I wish there were more live sessions. But the recorded content is top-notch.",
    avatar: "https://accredipro.academy/wp-content/uploads/2025/12/Integrative-Health.jpeg"
  },
  {
    firstName: "Caroline",
    lastName: "Jackson",
    rating: 5,
    comment: "I completed this certification while working full-time. The self-paced format made it possible, and the support team was always there when I had questions.",
    avatar: "https://accredipro.academy/wp-content/uploads/2025/12/AI_Headshot_Generator-13.jpg"
  },
  {
    firstName: "Janet",
    lastName: "Taylor",
    rating: 5,
    comment: "This certification gave me the scientific foundation I was missing. Now I can explain to my clients exactly why the protocols work. It's made all the difference in client retention.",
    avatar: "https://accredipro.academy/wp-content/uploads/2025/12/LeezaRhttilthead.jpg"
  },
  {
    firstName: "Samantha",
    lastName: "King",
    rating: 5,
    comment: "I've already referred three of my colleagues to this program. The combination of theory and practical application is perfect for anyone serious about becoming a functional medicine practitioner.",
    avatar: "https://accredipro.academy/wp-content/uploads/2025/12/Head-shot-dark-background-1.jpg"
  },
  {
    firstName: "Sandra",
    lastName: "Martinez",
    rating: 5,
    comment: "The certificate has given me credibility in a crowded market. Clients specifically seek me out because of my AccrediPro certification. Best investment in my career!",
    avatar: "https://accredipro.academy/wp-content/uploads/2025/12/Head-shot-dark-background-1.jpg"
  }
];

async function main() {
  // Get all published courses (excluding mini diploma)
  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
      certificateType: { not: "MINI_DIPLOMA" }
    },
    select: { id: true, title: true }
  });

  console.log(`Found ${courses.length} courses to add reviews to:`);
  courses.forEach(c => console.log(`  - ${c.title}`));

  // Create fake users for reviews (or find existing ones)
  for (const course of courses) {
    console.log(`\nAdding reviews for: ${course.title}`);

    for (const review of REVIEWS) {
      // Check if a user with this name exists, or create one
      let user = await prisma.user.findFirst({
        where: {
          firstName: review.firstName,
          lastName: review.lastName
        },
        select: { id: true, avatar: true }
      });

      if (!user) {
        // Create a fake user for this review
        user = await prisma.user.create({
          data: {
            email: `${review.firstName.toLowerCase()}.${review.lastName.toLowerCase()}@example.com`,
            firstName: review.firstName,
            lastName: review.lastName,
            passwordHash: "not-a-real-user",
            role: UserRole.USER,
            isFakeProfile: true,
            avatar: review.avatar
          }
        });
        console.log(`  Created user: ${review.firstName} ${review.lastName}`);
      } else if (!user.avatar && review.avatar) {
        // Update existing user with avatar if missing
        await prisma.user.update({
          where: { id: user.id },
          data: { avatar: review.avatar }
        });
        console.log(`  Updated avatar for: ${review.firstName} ${review.lastName}`);
      }

      // Check if review already exists
      const existingReview = await prisma.courseReview.findFirst({
        where: {
          courseId: course.id,
          userId: user.id
        }
      });

      if (existingReview) {
        console.log(`  Review already exists from ${review.firstName}`);
        continue;
      }

      // Create the review
      await prisma.courseReview.create({
        data: {
          courseId: course.id,
          userId: user.id,
          rating: review.rating,
          content: review.comment,
          isPublic: true
        }
      });
      console.log(`  Added review from ${review.firstName} (${review.rating} stars)`);
    }

    // Update course analytics
    const allReviews = await prisma.courseReview.findMany({
      where: { courseId: course.id, isPublic: true },
      select: { rating: true }
    });

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.courseAnalytics.upsert({
      where: { courseId: course.id },
      update: {
        avgRating: Math.round(avgRating * 10) / 10
      },
      create: {
        courseId: course.id,
        avgRating: Math.round(avgRating * 10) / 10,
        totalEnrolled: 47,
        totalCompleted: 23,
        avgProgress: 67.5
      }
    });
    console.log(`  Updated analytics: ${avgRating.toFixed(1)} avg rating, ${allReviews.length} reviews`);
  }

  console.log("\nDone! Reviews seeded successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
