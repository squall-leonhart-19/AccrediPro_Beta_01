import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Read the CSV file with accredipro academy avatars
  const csvPath = path.join(__dirname, "../student_avatars/students-profiles-imgs.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const avatarUrls = csvContent
    .split("\n")
    .slice(1) // Skip header
    .map((line) => line.trim())
    .filter((url) => url.startsWith("https://accredipro.academy/"));

  console.log(`Found ${avatarUrls.length} accredipro.academy avatar URLs`);

  // Get the FM Certification course
  const fmCourse = await prisma.course.findFirst({
    where: {
      slug: "functional-medicine-complete-certification",
    },
  });

  if (!fmCourse) {
    console.error("FM Certification course not found!");
    return;
  }

  console.log(`Found course: ${fmCourse.title}`);

  // Get all reviews for this course with their users
  const reviews = await prisma.courseReview.findMany({
    where: { courseId: fmCourse.id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
          isFakeProfile: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  console.log(`Found ${reviews.length} reviews to fix`);

  // Check current state
  const withUnsplash = reviews.filter(r => r.user.avatar?.includes("unsplash.com"));
  const withAccredipro = reviews.filter(r => r.user.avatar?.includes("accredipro.academy"));
  const withoutAvatar = reviews.filter(r => !r.user.avatar);

  console.log(`\nCurrent state:`);
  console.log(`- Reviews with Unsplash avatars: ${withUnsplash.length}`);
  console.log(`- Reviews with AccrediPro avatars: ${withAccredipro.length}`);
  console.log(`- Reviews without avatars: ${withoutAvatar.length}`);

  // Update each user's avatar if they don't have accredipro.academy avatar
  let avatarIndex = 0;
  const updatedUsers = new Set<string>();

  for (const review of reviews) {
    if (!review.user.avatar?.includes("accredipro.academy") && !updatedUsers.has(review.user.id)) {
      const newAvatar = avatarUrls[avatarIndex % avatarUrls.length];
      await prisma.user.update({
        where: { id: review.user.id },
        data: { avatar: newAvatar },
      });
      console.log(`Updated ${review.user.firstName} ${review.user.lastName} avatar to: ${newAvatar.slice(-30)}`);
      avatarIndex++;
      updatedUsers.add(review.user.id);
    }
  }

  console.log(`\n✅ Updated ${avatarIndex} users with accredipro.academy avatars`);

  // Verify final state
  const finalReviews = await prisma.courseReview.findMany({
    where: { courseId: fmCourse.id },
    include: {
      user: {
        select: {
          avatar: true,
        },
      },
    },
  });

  const finalWithAccredipro = finalReviews.filter(r => r.user.avatar?.includes("accredipro.academy"));
  const finalWithUnsplash = finalReviews.filter(r => r.user.avatar?.includes("unsplash.com"));

  console.log(`\nFinal state:`);
  console.log(`- Reviews with AccrediPro avatars: ${finalWithAccredipro.length}`);
  console.log(`- Reviews with Unsplash avatars: ${finalWithUnsplash.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
