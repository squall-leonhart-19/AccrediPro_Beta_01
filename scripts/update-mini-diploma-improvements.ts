import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Updating Mini Diploma improvements...");

  // 1. Update Sarah's profile image to local file
  const sarah = await prisma.user.findFirst({
    where: { email: "sarah@accredipro-certificate.com" },
  });

  if (sarah) {
    await prisma.user.update({
      where: { id: sarah.id },
      data: {
        avatar: "/coaches/sarah-coach.webp",
        bio: "Your dedicated Functional Medicine Coach. After 12 years as an ICU nurse, burnout led me to discover Functional Medicine - and it saved my life. Now I'm here to guide you every step of the way on your healing journey!",
      },
    });
    console.log("✅ Updated Sarah's profile image to /coaches/sarah-coach.webp");
  }

  // 2. Update the mini diploma course description
  const course = await prisma.course.findFirst({
    where: { slug: "functional-medicine-mini-diploma" },
  });

  if (course) {
    await prisma.course.update({
      where: { id: course.id },
      data: {
        description: `Discover why you've been feeling tired, gaining weight, and struggling with symptoms your doctors can't explain.

This free mini diploma introduces you to the 7 Body Systems Model — the same framework used by certified Functional Medicine practitioners to find root causes that conventional medicine misses.

By the end, you'll understand your body better than 90% of doctors ever explained it. And if you're ready to go deeper, this mini diploma makes you eligible to enroll in our full Functional Medicine Practitioner Certification.

✓ Learn the root-cause framework
✓ See it applied to a real case study
✓ Discover your path forward
✓ Earn your Mini Diploma certificate`,
      },
    });
    console.log("✅ Updated course description");
  }

  // 3. Update quizzes to remove passing score display (set isRequired to false for module quizzes)
  // The UI will handle not showing the percentage
  const moduleQuizzes = await prisma.moduleQuiz.findMany({
    where: {
      module: {
        course: {
          slug: "functional-medicine-mini-diploma",
        },
      },
    },
  });

  for (const quiz of moduleQuizzes) {
    // Keep passing score low so everyone passes, but we won't show it in UI
    await prisma.moduleQuiz.update({
      where: { id: quiz.id },
      data: {
        passingScore: 1, // Minimum - essentially everyone passes
        isRequired: false, // Not required to progress
      },
    });
  }
  console.log(`✅ Updated ${moduleQuizzes.length} quizzes to be non-blocking`);

  console.log("\n✨ All improvements complete!");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
