import { prisma } from "../src/lib/prisma";
import { LessonType } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

// Module 0 lesson definitions
const module0Lessons = [
  {
    filename: "Lesson_0.1_Welcome_To_Your_Certification_Journey.html",
    title: "Welcome to Your Certification Journey",
    description: "Begin your transformative journey into functional medicine health coaching with Sarah's personal welcome, income statistics, and your path to a $120K+ career.",
    order: 1,
    readTime: 12,
  },
  {
    filename: "Lesson_0.2_How_This_Program_Works.html",
    title: "How This Program Works",
    description: "Your complete roadmap to certification with income milestones at each phase. Learn the 5-phase journey and ASI credential system.",
    order: 2,
    readTime: 12,
  },
  {
    filename: "Lesson_0.3_Setting_Up_For_Success.html",
    title: "Setting Up For Success",
    description: "The habits that separate $10K/month coaches from everyone else. Practical setup strategies, time investment calculator, and success mindset.",
    order: 3,
    readTime: 12,
  },
  {
    filename: "Lesson_0.4_Your_Learning_Roadmap_And_Community.html",
    title: "Your Learning Roadmap & Community",
    description: "Your support system for building a $10K/month practice. Community resources, success stories, and your path forward.",
    order: 4,
    readTime: 12,
  },
];

// Extract CSS and body content from HTML
function extractContentWithStyles(html: string): string {
  // Extract the CSS from <style> tag
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  let cssContent = styleMatch ? styleMatch[1].trim() : '';

  // Remove body styles that might conflict with parent page
  cssContent = cssContent.replace(/body\s*\{[^}]*\}/gi, '');

  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    throw new Error("Could not find body content in HTML");
  }

  let bodyContent = bodyMatch[1].trim();

  // Remove legacy elements
  bodyContent = bodyContent.replace(/<div class="brand-header"><\/div>/g, '');
  bodyContent = bodyContent.replace(/<div class="lesson-footer"><\/div>/g, '');

  // Combine CSS + HTML content
  const finalContent = `<style>${cssContent}</style>\n${bodyContent.trim()}`;

  return finalContent;
}

async function main() {
  // Path to the updated Module 0 files
  const modulePath = path.join(process.cwd(), "FM/FM-Update/Module_00");

  console.log("🚀 Starting Module 0 Import (Updated Content)...\n");
  console.log(`📂 Source path: ${modulePath}\n`);

  // Find the FM Certification course
  const course = await prisma.course.findFirst({
    where: { slug: "functional-medicine-complete-certification" },
    select: { id: true, title: true, slug: true },
  });

  if (!course) {
    console.log("❌ Course 'functional-medicine-complete-certification' not found!");
    console.log("   Checking for other FM courses...");

    const courses = await prisma.course.findMany({
      where: {
        OR: [
          { title: { contains: "Functional Medicine" } },
          { title: { contains: "FM" } }
        ]
      },
      select: { id: true, title: true, slug: true },
    });

    console.log("   Found courses:", courses);
    return;
  }

  console.log(`✅ Found course: ${course.title}`);
  console.log(`   Slug: ${course.slug}`);
  console.log(`   ID: ${course.id}\n`);

  // Find Module 0 (Orientation module)
  let module0 = await prisma.module.findFirst({
    where: {
      courseId: course.id,
      OR: [
        { title: { contains: "Orientation" } },
        { title: { contains: "Module 0" } },
        { order: 0 }
      ]
    },
    include: {
      lessons: { select: { id: true, title: true, order: true } }
    }
  });

  if (!module0) {
    console.log("❌ Module 0 (Orientation) not found in this course!");

    // List all modules
    const modules = await prisma.module.findMany({
      where: { courseId: course.id },
      select: { id: true, title: true, order: true },
      orderBy: { order: "asc" }
    });

    console.log("   Existing modules:");
    modules.forEach(m => console.log(`      ${m.order}. ${m.title} (${m.id})`));
    return;
  }

  console.log(`📦 Found Module 0: ${module0.title} (${module0.id})`);
  console.log(`   Existing lessons: ${module0.lessons.length}\n`);

  // Update each lesson
  for (const lessonDef of module0Lessons) {
    const filePath = path.join(modulePath, lessonDef.filename);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${lessonDef.filename}`);
      continue;
    }

    const htmlContent = fs.readFileSync(filePath, "utf-8");
    const lessonContent = extractContentWithStyles(htmlContent);

    // Find existing lesson by order
    const existingLesson = module0.lessons.find(l => l.order === lessonDef.order);

    if (existingLesson) {
      // Update existing lesson
      await prisma.lesson.update({
        where: { id: existingLesson.id },
        data: {
          title: lessonDef.title,
          description: lessonDef.description,
          content: lessonContent,
        },
      });
      console.log(`   ✅ Updated Lesson ${lessonDef.order}: ${lessonDef.title}`);
    } else {
      // Create new lesson
      await prisma.lesson.create({
        data: {
          title: lessonDef.title,
          description: lessonDef.description,
          content: lessonContent,
          order: lessonDef.order,
          lessonType: LessonType.TEXT,
          isPublished: true,
          isFreePreview: lessonDef.order === 1,
          moduleId: module0.id,
        },
      });
      console.log(`   ✅ Created Lesson ${lessonDef.order}: ${lessonDef.title}`);
    }

    console.log(`      Content length: ${lessonContent.length} chars`);
  }

  // Verify the update
  const finalModule = await prisma.module.findUnique({
    where: { id: module0.id },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        select: { id: true, title: true, order: true },
      },
    },
  });

  console.log("\n📊 Update Summary:");
  console.log(`   Module: ${finalModule?.title}`);
  console.log(`   Lessons: ${finalModule?.lessons.length}`);
  finalModule?.lessons.forEach((l) => {
    console.log(`      ${l.order}. ${l.title} (${l.id})`);
  });

  console.log("\n✨ Module 0 content update complete!");
  console.log("   Refresh your browser to see the changes.");
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
