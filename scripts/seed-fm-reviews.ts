import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Diverse review content with different lengths and styles
const reviewContents = [
  {
    title: "Life-changing program!",
    content: "This certification has completely transformed my practice. The depth of knowledge about functional medicine principles, root cause analysis, and holistic approaches to patient care is exceptional. I've already started implementing these protocols with my clients and seeing remarkable results. Highly recommend for any health professional looking to expand their expertise.",
    rating: 5
  },
  {
    title: "Excellent curriculum",
    content: "Very comprehensive and well-structured. The modules cover everything from gut health to hormone balance to detoxification pathways. Each lesson builds on the previous one, making complex concepts easy to understand. The case studies were particularly helpful.",
    rating: 5
  },
  {
    title: "Worth every penny",
    content: "As a practicing nurse, I was skeptical at first. But this program exceeded all my expectations. The evidence-based approach combined with practical applications makes it invaluable. I can now confidently discuss integrative approaches with patients.",
    rating: 5
  },
  {
    title: "Finally found what I was looking for",
    content: "After years of searching for the right functional medicine training, I found this gem. The accreditation gives it credibility, and the content is top-notch. Dr. Sarah's explanations are clear and engaging. I've recommended this to several colleagues already.",
    rating: 5
  },
  {
    title: "Incredibly thorough",
    content: "The attention to detail in this course is impressive. Every topic is covered comprehensively with the latest research. The downloadable resources are a bonus - I use them daily in my practice.",
    rating: 5
  },
  {
    title: "Great for career advancement",
    content: "This certification opened new doors for my career. I'm now offering functional medicine consultations alongside my traditional practice. The ROI has been incredible - both professionally and financially.",
    rating: 5
  },
  {
    title: "Perfect balance of theory and practice",
    content: "What sets this apart is how it balances scientific theory with real-world application. The protocols are immediately usable, and the community support is amazing. Connected with so many like-minded practitioners.",
    rating: 5
  },
  {
    title: "Changed how I approach patient care",
    content: "Before this course, I was treating symptoms. Now I understand how to identify and address root causes. My patients are getting better faster and staying well longer. This knowledge should be required for all healthcare providers.",
    rating: 5
  },
  {
    title: "Solid foundation in functional medicine",
    content: "Provides an excellent foundation for anyone new to functional medicine. The pace is manageable even with a busy schedule. Some advanced topics could go deeper, but overall very satisfied with the content.",
    rating: 4
  },
  {
    title: "Highly recommended",
    content: "Great course with comprehensive material. The video quality is excellent and the instructors are clearly experts in their field. Would love to see more case study examples, but that's a minor point. Definitely worth your investment.",
    rating: 4
  },
  {
    title: "Game-changer for my practice",
    content: "I've taken several functional medicine courses over the years, and this one stands out. The accreditation, the quality of instruction, and the practical protocols make it the best I've experienced. Already seeing better outcomes with clients.",
    rating: 5
  },
  {
    title: "Exceeded expectations",
    content: "Started this course with high expectations and it still managed to exceed them. The blend of nutrition, lifestyle medicine, and functional testing is perfectly balanced. My confidence in recommending integrative approaches has skyrocketed.",
    rating: 5
  },
  {
    title: "Essential training for modern practitioners",
    content: "In today's healthcare landscape, understanding functional medicine isn't optional - it's essential. This course provides everything you need to integrate these principles into your practice. The support from the AccrediPro team is also fantastic.",
    rating: 5
  },
  {
    title: "Well worth the investment",
    content: "Quality education at a fair price. The certification has given me credibility with patients who are seeking integrative care. The course material is constantly updated which shows the commitment to excellence.",
    rating: 5
  },
  {
    title: "Comprehensive and practical",
    content: "Loved how practical this course is. Not just theory but actual protocols I can use. The module on hormone health alone was worth the entire investment. Already recommending to colleagues.",
    rating: 5
  },
  {
    title: "Best investment in my education",
    content: "I've spent thousands on continuing education over my career. This program delivers more value than courses costing twice as much. The knowledge I've gained has helped me serve my clients better and grow my practice substantially.",
    rating: 5
  },
  {
    title: "Transformed my understanding of health",
    content: "As a physical therapist, I thought I understood the body well. This course opened my eyes to how interconnected everything is. The functional medicine lens has made me a much more effective practitioner.",
    rating: 5
  },
  {
    title: "Clear, organized, and actionable",
    content: "Dr. Sarah presents complex information in such an accessible way. The course is well-organized, easy to follow, and most importantly - actionable. I was implementing what I learned within the first week.",
    rating: 5
  },
  {
    title: "Finally, a credible FM certification",
    content: "I was wary of online certifications but the accreditation and quality of this program convinced me. It's rigorous, comprehensive, and professionally presented. My patients take me more seriously now.",
    rating: 5
  },
  {
    title: "Perfect for busy professionals",
    content: "The self-paced format was perfect for my hectic schedule. I could learn during lunch breaks and evenings. The material is engaging enough to keep you motivated even when tired.",
    rating: 5
  },
  {
    title: "A must for integrative practitioners",
    content: "Whether you're a doctor, nurse, nutritionist, or health coach - this certification is essential. The breadth and depth of content ensures you'll be well-equipped to help clients achieve optimal health.",
    rating: 5
  },
  {
    title: "Surpassed my expectations",
    content: "I enrolled hoping to learn a few new things. What I got was a complete paradigm shift in how I approach health and healing. The community of fellow practitioners is an added bonus.",
    rating: 5
  },
  {
    title: "Quality content, great presentation",
    content: "The production quality is professional and the content is clearly well-researched. Each module builds nicely on the previous one. Minor suggestion: would love more downloadable PDFs.",
    rating: 4
  },
  {
    title: "Revolutionary approach to medicine",
    content: "Functional medicine is the future of healthcare and this course prepares you well for that future. The focus on root causes rather than symptoms resonates with how I want to practice.",
    rating: 5
  }
];

async function main() {
  try {
    // Find FM Test course
    const course = await prisma.course.findFirst({
      where: { title: "FM Test" },
      select: { id: true, title: true }
    });

    if (!course) {
      console.log("FM Test course not found!");
      return;
    }

    console.log(`Found course: ${course.title} (${course.id})`);

    // Get fake profiles with avatars
    const fakeProfiles = await prisma.user.findMany({
      where: { isFakeProfile: true, avatar: { not: null } },
      select: { id: true, firstName: true, lastName: true, avatar: true },
      take: 15
    });

    console.log(`Found ${fakeProfiles.length} fake profiles with avatars`);

    // Delete existing reviews for this course
    const deleted = await prisma.courseReview.deleteMany({
      where: { courseId: course.id }
    });
    console.log(`Deleted ${deleted.count} existing reviews`);

    // Create new reviews from random fake profiles
    const reviews: Array<{
      courseId: string;
      userId: string;
      rating: number;
      title: string;
      content: string;
      isVerified: boolean;
      createdAt: Date;
    }> = [];
    const usedProfiles = new Set<string>();

    for (let i = 0; i < Math.min(reviewContents.length, fakeProfiles.length); i++) {
      // Pick a random profile that hasn't been used
      let profile;
      do {
        profile = fakeProfiles[Math.floor(Math.random() * fakeProfiles.length)];
      } while (usedProfiles.has(profile.id) && usedProfiles.size < fakeProfiles.length);

      usedProfiles.add(profile.id);

      const reviewContent = reviewContents[i];

      // Random date within last 6 months
      const daysAgo = Math.floor(Math.random() * 180);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      reviews.push({
        courseId: course.id,
        userId: profile.id,
        rating: reviewContent.rating,
        title: reviewContent.title,
        content: reviewContent.content,
        isVerified: true,
        createdAt
      });
    }

    // Insert reviews
    for (const review of reviews) {
      await prisma.courseReview.create({ data: review });
    }
    console.log(`Created ${reviews.length} new reviews`);

    // Calculate average rating
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    console.log(`Average rating: ${avgRating.toFixed(2)}`);

    // Update course analytics
    const analytics = await prisma.courseAnalytics.findFirst({
      where: { courseId: course.id }
    });

    if (analytics) {
      await prisma.courseAnalytics.update({
        where: { id: analytics.id },
        data: { avgRating: avgRating }
      });
    } else {
      await prisma.courseAnalytics.create({
        data: {
          courseId: course.id,
          avgRating: avgRating,
          totalEnrolled: 127
        }
      });
    }
    console.log("Updated course analytics");

    console.log("\n✅ Done! Reviews added successfully.");

  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
