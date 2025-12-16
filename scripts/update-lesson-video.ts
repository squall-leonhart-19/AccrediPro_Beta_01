/**
 * Update a lesson with a Wistia video ID
 * Run with: npx tsx scripts/update-lesson-video.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🎬 Updating lesson with Wistia video ID...\n");

  // Your Wistia video ID from the URL: https://digitalseeduae-2.wistia.com/medias/3go641tx38
  const wistiaVideoId = "3go641tx38";

  // Get the first lesson of the FM course
  const fmCourse = await prisma.course.findFirst({
    where: { slug: "functional-medicine-complete-certification" },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            take: 1, // Get first lesson only
          },
        },
        take: 1, // Get first module only
      },
    },
  });

  if (!fmCourse) {
    console.error("❌ FM course not found!");
    return;
  }

  const firstModule = fmCourse.modules[0];
  const firstLesson = firstModule?.lessons[0];

  if (!firstLesson) {
    console.error("❌ No lessons found in FM course!");
    return;
  }

  console.log(`📚 Course: ${fmCourse.title}`);
  console.log(`📖 Module: ${firstModule.title}`);
  console.log(`📝 Lesson: ${firstLesson.title}`);
  console.log(`🎬 Video ID: ${wistiaVideoId}\n`);

  // Update the lesson with the Wistia video ID
  await prisma.lesson.update({
    where: { id: firstLesson.id },
    data: {
      videoId: wistiaVideoId,
      videoDuration: 600, // 10 minutes placeholder - Wistia will track actual
    },
  });

  console.log("✅ Lesson updated successfully!");
  console.log(`\n🔗 Test it at: /learning/${fmCourse.slug}/${firstLesson.id}`);
  console.log("\n========================================");
  console.log("📋 NEXT STEPS:");
  console.log("========================================");
  console.log("1. Update .env with your Wistia API token:");
  console.log('   WISTIA_API_TOKEN="11e3d7090614f92fe38318b0924b19f8086e56054d952d91c772e2bfcf40f78d"');
  console.log("\n2. Make sure you're enrolled in the course to view the video");
  console.log("\n3. The video player will:");
  console.log("   - Auto-save progress every 30 seconds");
  console.log("   - Save position when you pause");
  console.log("   - Mark lesson complete at 90% watched");
  console.log("   - Resume from where you left off");
  console.log("========================================\n");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
