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

// Course thumbnail mappings - using WordPress CDN
const thumbnailMappings: Record<string, string> = {
  "FM Test": "https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/fm-certification/FunctionalMedicinePractictioner-scaled.jpeg",
  "Functional Medicine Mini Diploma": "/courses/test01_img.jpeg",
  "Functional Medicine Certification": "https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/fm-certification/FunctionalMedicinePractictioner-scaled.jpeg",
  "Functional Medicine Complete Certification": "https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/fm-certification/FunctionalMedicinePractictioner-scaled.jpeg",
};

async function main() {
  console.log("Updating course thumbnails...\n");

  for (const [courseTitle, thumbnailPath] of Object.entries(thumbnailMappings)) {
    const course = await prisma.course.findFirst({
      where: { title: courseTitle },
      select: { id: true, title: true, thumbnail: true }
    });

    if (!course) {
      console.log(`Course "${courseTitle}" not found, skipping...`);
      continue;
    }

    await prisma.course.update({
      where: { id: course.id },
      data: { thumbnail: thumbnailPath }
    });

    console.log(`✅ Updated "${courseTitle}": ${thumbnailPath}`);
  }

  // List all courses with their thumbnails
  console.log("\nAll courses with thumbnails:");
  const allCourses = await prisma.course.findMany({
    select: { title: true, thumbnail: true },
    orderBy: { title: "asc" }
  });

  for (const course of allCourses) {
    const hasThumb = course.thumbnail ? "✓" : "✗";
    console.log(`  ${hasThumb} ${course.title}: ${course.thumbnail || "(no thumbnail)"}`);
  }

  await prisma.$disconnect();
  console.log("\n✅ Done!");
}

main();
