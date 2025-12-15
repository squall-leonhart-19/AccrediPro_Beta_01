import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, LessonType } from "@prisma/client";
import pg from "pg";
import * as fs from "fs";
import * as path from "path";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Module 0 lesson definitions
const module0Lessons = [
  {
    filename: "Lesson_0.1_Welcome_To_Your_Certification_Journey.html",
    title: "Welcome to Your Certification Journey",
    description: "Begin your transformative journey into functional medicine health coaching. Learn what this program offers and why the world needs qualified health coaches now more than ever.",
    order: 1,
    readTime: 10,
  },
  {
    filename: "Lesson_0.2_How_This_Program_Works.html",
    title: "How This Program Works",
    description: "Understand the program structure, phases, and what to expect as you progress through your certification. Learn the learning methodology and assessment approach.",
    order: 2,
    readTime: 12,
  },
  {
    filename: "Lesson_0.3_Setting_Up_For_Success.html",
    title: "Setting Up For Success",
    description: "Essential tips and strategies to maximize your learning experience. Create your optimal study environment and develop habits that support your certification journey.",
    order: 3,
    readTime: 10,
  },
  {
    filename: "Lesson_0.4_Your_Learning_Roadmap_And_Community.html",
    title: "Your Learning Roadmap & Community",
    description: "Navigate your certification path with confidence. Connect with the community and understand the support resources available to you throughout the program.",
    order: 4,
    readTime: 8,
  },
];

// Extract CSS and body content from HTML
function extractContentWithStyles(html: string): string {
  // Extract the CSS from <style> tag
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  let cssContent = styleMatch ? styleMatch[1].trim() : '';

  // Remove body styles (we don't want to affect the parent page)
  cssContent = cssContent.replace(/body\s*\{[^}]*\}/gi, '');

  // Remove the brand-header (logo placeholder)
  let content = html.replace(/<div class="brand-header">[\s\S]*?<\/div>/, '');

  // Extract body content
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    throw new Error("Could not find body content in HTML");
  }

  let bodyContent = bodyMatch[1].trim();

  // Keep the lesson-container div - the CSS needs it!

  // Remove the footer section (we'll handle navigation in React)
  bodyContent = bodyContent.replace(/<footer class="lesson-footer">[\s\S]*?<\/footer>/gi, '');

  // Remove the next-lesson navigation (we handle this in React)
  bodyContent = bodyContent.replace(/<div class="next-lesson">[\s\S]*?<\/div>/gi, '');

  // Combine CSS + HTML content
  const finalContent = `<style>${cssContent}</style>\n${bodyContent.trim()}`;

  return finalContent;
}

async function main() {
  const modulePath = path.join(process.cwd(), "newcourses/FM-Update/Module_00");

  console.log("🚀 Starting Module 0 Import for FM Test Course...\n");

  // Find FM Test course
  const course = await prisma.course.findFirst({
    where: { title: "FM Test" },
    select: { id: true, title: true, modules: { select: { id: true, title: true } } },
  });

  if (!course) {
    console.log("❌ FM Test course not found!");
    return;
  }

  console.log(`✅ Found course: ${course.title} (${course.id})`);
  console.log(`   Existing modules: ${course.modules.length}\n`);

  // Check if Module 0 already exists
  let module0 = await prisma.module.findFirst({
    where: {
      courseId: course.id,
      title: { contains: "Orientation" },
    },
  });

  if (module0) {
    console.log(`📦 Module 0 already exists (${module0.id}), updating lessons...\n`);

    // Delete existing lessons in this module
    await prisma.lesson.deleteMany({
      where: { moduleId: module0.id },
    });
    console.log("   Deleted existing lessons in Module 0");
  } else {
    // Create Module 0: Orientation
    module0 = await prisma.module.create({
      data: {
        title: "Module 0: Orientation",
        description: "Welcome to your Functional Medicine Health Coach Certification journey. This orientation module will prepare you for success.",
        order: 0, // First module
        isPublished: true,
        courseId: course.id,
      },
    });
    console.log(`📦 Created Module 0: Orientation (${module0.id})\n`);
  }

  // Import each lesson
  for (const lessonDef of module0Lessons) {
    const filePath = path.join(modulePath, lessonDef.filename);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${lessonDef.filename}`);
      continue;
    }

    const htmlContent = fs.readFileSync(filePath, "utf-8");
    const lessonContent = extractContentWithStyles(htmlContent);

    const lesson = await prisma.lesson.create({
      data: {
        title: lessonDef.title,
        description: lessonDef.description,
        content: lessonContent,
        order: lessonDef.order,
        lessonType: LessonType.TEXT,
        isPublished: true,
        isFreePreview: lessonDef.order === 1, // First lesson is free preview
        moduleId: module0.id,
      },
    });

    console.log(`   ✅ Lesson ${lessonDef.order}: ${lessonDef.title}`);
    console.log(`      Content length: ${lessonContent.length} chars`);
  }

  // Verify the import
  const finalModule = await prisma.module.findUnique({
    where: { id: module0.id },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        select: { id: true, title: true, order: true },
      },
    },
  });

  console.log("\n📊 Import Summary:");
  console.log(`   Module: ${finalModule?.title}`);
  console.log(`   Lessons imported: ${finalModule?.lessons.length}`);
  finalModule?.lessons.forEach((l) => {
    console.log(`      ${l.order}. ${l.title}`);
  });

  console.log("\n✨ Module 0 import complete!");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
