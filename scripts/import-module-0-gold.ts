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
  },
  {
    filename: "Lesson_0.2_How_This_Program_Works.html",
    title: "How This Program Works",
    description: "Your complete roadmap to certification with income milestones at each phase. Learn the 5-phase journey and ASI credential system.",
    order: 2,
  },
  {
    filename: "Lesson_0.3_Setting_Up_For_Success.html",
    title: "Setting Up For Success",
    description: "The habits that separate $10K/month coaches from everyone else. Practical setup strategies, time investment calculator, and success mindset.",
    order: 3,
  },
  {
    filename: "Lesson_0.4_Your_Learning_Roadmap_And_Community.html",
    title: "Your Learning Roadmap & Community",
    description: "Your support system for building a $10K/month practice. Community resources, success stories, and your path forward.",
    order: 4,
  },
];

// Extract the FULL HTML as lesson content (CSS + Body)
function extractFullContent(html: string): string {
  // Extract the CSS from <style> tag - get EVERYTHING
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const cssContent = styleMatch ? styleMatch[1].trim() : '';

  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    throw new Error("Could not find body content in HTML");
  }

  const bodyContent = bodyMatch[1].trim();

  // Return combined CSS + HTML (the lesson player will render this)
  return `<style>${cssContent}</style>\n${bodyContent}`;
}

async function main() {
  // Use FM-Update which has the original Gold Standard files
  const modulePath = path.join(process.cwd(), "FM/FM-Update/Module_00");

  console.log("🚀 Importing Module 0 (Gold Standard from FM-Update)...\n");
  console.log(`📂 Source: ${modulePath}\n`);

  // Find the FM Certification course
  const course = await prisma.course.findFirst({
    where: { slug: "functional-medicine-complete-certification" },
    select: { id: true, title: true },
  });

  if (!course) {
    console.log("❌ Course not found!");
    return;
  }

  console.log(`✅ Course: ${course.title}\n`);

  // Find Module 0
  const module0 = await prisma.module.findFirst({
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
    console.log("❌ Module 0 not found!");
    return;
  }

  console.log(`📦 Module: ${module0.title}`);
  console.log(`   ID: ${module0.id}`);
  console.log(`   Existing lessons: ${module0.lessons.length}\n`);

  // Update each lesson
  for (const lessonDef of module0Lessons) {
    const filePath = path.join(modulePath, lessonDef.filename);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Missing: ${lessonDef.filename}`);
      continue;
    }

    const htmlContent = fs.readFileSync(filePath, "utf-8");
    const lessonContent = extractFullContent(htmlContent);

    // Find existing lesson
    const existingLesson = module0.lessons.find(l => l.order === lessonDef.order);

    if (existingLesson) {
      await prisma.lesson.update({
        where: { id: existingLesson.id },
        data: {
          title: lessonDef.title,
          description: lessonDef.description,
          content: lessonContent,
        },
      });
      console.log(`✅ Updated: Lesson ${lessonDef.order} - ${lessonDef.title}`);
      console.log(`   Size: ${(lessonContent.length / 1024).toFixed(1)} KB`);
      console.log(`   CSS included: ${lessonContent.includes('.module-header-card') ? 'YES' : 'NO'}`);
      console.log(`   Coach tips: ${(lessonContent.match(/coach-tip/g) || []).length}`);
    } else {
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
      console.log(`✨ Created: Lesson ${lessonDef.order} - ${lessonDef.title}`);
    }
  }

  console.log("\n🎉 Module 0 import complete!");
  console.log("   Refresh your browser to see changes.");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
