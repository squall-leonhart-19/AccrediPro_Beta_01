import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const newReviews = [
  {
    title: "Best investment I've ever made",
    content: "I was skeptical at first, but this certification completely changed my career. Within 3 months of completing the course, I landed my first paying client at $150/hour. Now I'm fully booked and earning more than I ever did as a nurse. The curriculum is thorough, science-backed, and practical. Sarah's teaching style makes complex topics easy to understand.",
    rating: 5,
  },
  {
    title: "From corporate burnout to thriving practice",
    content: "After 15 years in corporate finance, I was burnt out and searching for purpose. This course gave me everything I needed to start fresh. The business modules alone are worth the investment. I launched my practice 4 months ago and just hit $8K in monthly revenue. If you're serious about helping people and building a real business, this is for you.",
    rating: 5,
  },
  {
    title: "Finally, a certification that delivers",
    content: "I've tried other health coaching programs before—they were surface-level and left me unprepared. This is different. The depth of knowledge here rivals what I learned in nursing school, but it's actually applicable to real client work. My confidence skyrocketed after completing this. I now charge premium rates and my clients get real results.",
    rating: 5,
  },
  {
    title: "Life-changing knowledge, incredible support",
    content: "The course content is exceptional, but what really sets this apart is the community and support. Whenever I had questions, the team responded within hours. I've made connections with practitioners worldwide who refer clients to each other. This isn't just a course—it's a complete ecosystem for building your career in functional medicine.",
    rating: 5,
  },
  {
    title: "Replaced my full-time income in 6 months",
    content: "I started this course while still working my 9-5. By month 4, I had enough clients to go part-time. By month 6, I quit my job entirely. Now I work 25 hours a week, set my own schedule, and actually enjoy what I do. The step-by-step business guidance made it possible. Don't wait like I did—just start.",
    rating: 5,
  },
  {
    title: "Worth every penny and then some",
    content: "I'll be honest—I hesitated because of the investment. Best decision I made was to just go for it. The ROI has been incredible. I've earned back the course fee ten times over in my first year of practice. The protocols, the client scripts, the business templates—everything is laid out for you. Just follow the system.",
    rating: 5,
  },
  {
    title: "Transformed my approach to health",
    content: "As a personal trainer for 12 years, I thought I knew nutrition. This course showed me how much I was missing. Now I can actually help clients with hormonal issues, gut problems, and chronic fatigue—things I used to refer out. My retention rate doubled because clients finally see real progress. Game changer.",
    rating: 5,
  },
  {
    title: "The real deal for serious practitioners",
    content: "Don't expect fluff here. This is rigorous, evidence-based education that prepares you to work with complex cases. I came from a medical background and was impressed by the scientific depth. The case studies and clinical protocols are what you'd expect from a graduate program, not an online course. Highly recommend for healthcare professionals.",
    rating: 5,
  },
  {
    title: "Started my dream career at 52",
    content: "I thought I was too old to change careers. This course proved me wrong. The self-paced format worked perfectly around my life. At 52, I launched my functional medicine practice and now specialize in helping women navigate menopause. It's never too late. If I can do it, so can you. Just take the first step.",
    rating: 5,
  },
  {
    title: "Solid course, exceeded expectations",
    content: "The course material is comprehensive and well-organized. I especially appreciated the hormone and gut health modules—they gave me practical tools I use daily with clients. Only giving 4 stars because I wish there were more live Q&A sessions, but overall this is an excellent program that delivers on its promises.",
    rating: 4,
  },
];

async function main() {
  const fmCourse = await prisma.course.findFirst({
    where: { slug: "functional-medicine-complete-certification" },
  });

  if (!fmCourse) {
    console.error("Course not found!");
    return;
  }

  console.log(`Found course: ${fmCourse.title}`);

  // Get existing reviews
  const existingReviews = await prisma.courseReview.findMany({
    where: { courseId: fmCourse.id },
    orderBy: { createdAt: "asc" },
    take: 10,
  });

  console.log(`Found ${existingReviews.length} reviews to update`);

  // Update first 10 reviews
  for (let i = 0; i < Math.min(existingReviews.length, newReviews.length); i++) {
    const review = existingReviews[i];
    const newData = newReviews[i];

    await prisma.courseReview.update({
      where: { id: review.id },
      data: {
        title: newData.title,
        content: newData.content,
        rating: newData.rating,
      },
    });

    console.log(`✅ Updated review ${i + 1}: "${newData.title}"`);
  }

  console.log(`\n✅ Successfully updated ${Math.min(existingReviews.length, newReviews.length)} reviews`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
