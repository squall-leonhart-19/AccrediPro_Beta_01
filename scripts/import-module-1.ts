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

// Module 1 lesson definitions
const module1Lessons = [
  {
    filename: "Lesson_1.1_Introduction_To_Functional_Medicine.html",
    title: "Introduction to Functional Medicine",
    description: "Explore the foundations of functional medicine and understand how this patient-centered approach differs from conventional healthcare models.",
    order: 1,
    readTime: 12,
  },
  {
    filename: "Lesson_1.2_What_Is_Functional_Medicine_Why_It_Matters.html",
    title: "What Is Functional Medicine & Why It Matters",
    description: "Dive deeper into functional medicine principles and discover why this approach is revolutionizing healthcare outcomes for chronic conditions.",
    order: 2,
    readTime: 15,
  },
  {
    filename: "Lesson_1.3_Systems_Biology_Root_Cause_Thinking.html",
    title: "Systems Biology & Root Cause Thinking",
    description: "Learn how functional medicine uses systems biology to identify root causes of illness rather than just treating symptoms.",
    order: 3,
    readTime: 14,
  },
  {
    filename: "Lesson_1.4_The_Functional_Medicine_Timeline.html",
    title: "The Functional Medicine Timeline",
    description: "Master the functional medicine timeline tool for gathering comprehensive patient history and identifying key health triggers.",
    order: 4,
    readTime: 16,
  },
  {
    filename: "Lesson_1.5_The_Functional_Medicine_Matrix.html",
    title: "The Functional Medicine Matrix",
    description: "Understand the functional medicine matrix - a powerful organizational tool for connecting symptoms, triggers, and underlying imbalances.",
    order: 5,
    readTime: 18,
  },
  {
    filename: "Lesson_1.6_The_Power_of_the_Patient_Story.html",
    title: "The Power of the Patient Story",
    description: "Discover how to gather and interpret patient stories to create personalized, effective wellness plans.",
    order: 6,
    readTime: 12,
  },
  {
    filename: "Lesson_1.7_Conventional_Vs_Functional_Approach.html",
    title: "Conventional vs. Functional Approach",
    description: "Compare and contrast conventional and functional medicine approaches to understand when each is most appropriate.",
    order: 7,
    readTime: 14,
  },
  {
    filename: "Lesson_1.8_Case_Studies_Seeing_The_Whole_Picture.html",
    title: "Case Studies - Seeing the Whole Picture",
    description: "Apply your knowledge through real-world case studies that demonstrate functional medicine principles in action.",
    order: 8,
    readTime: 20,
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
  const modulePath = path.join(process.cwd(), "newcourses/FM-Update/Module_01");

  console.log("🚀 Starting Module 1 Import for FM Test Course...\n");

  // Find FM Test course
  const course = await prisma.course.findFirst({
    where: { title: "FM Test" },
    select: { id: true, title: true, modules: { select: { id: true, title: true, order: true } } },
  });

  if (!course) {
    console.log("❌ FM Test course not found!");
    return;
  }

  console.log(`✅ Found course: ${course.title} (${course.id})`);
  console.log(`   Existing modules: ${course.modules.length}\n`);

  // Check if Module 1 already exists
  let module1 = await prisma.module.findFirst({
    where: {
      courseId: course.id,
      OR: [
        { title: { contains: "Introduction to Functional Medicine" } },
        { title: { contains: "Module 1" } },
      ],
    },
  });

  if (module1) {
    console.log(`📦 Module 1 already exists (${module1.id}), updating lessons...\n`);

    // Delete existing lessons in this module
    await prisma.lesson.deleteMany({
      where: { moduleId: module1.id },
    });
    console.log("   Deleted existing lessons in Module 1");
  } else {
    // Create Module 1: Introduction to Functional Medicine
    module1 = await prisma.module.create({
      data: {
        title: "Module 1: Introduction to Functional Medicine",
        description: "Explore the foundational concepts of functional medicine, including systems biology, root cause analysis, and the powerful tools used to understand patient health.",
        order: 1, // After Module 0
        isPublished: true,
        courseId: course.id,
      },
    });
    console.log(`📦 Created Module 1: Introduction to Functional Medicine (${module1.id})\n`);
  }

  // Import each lesson
  for (const lessonDef of module1Lessons) {
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
        moduleId: module1.id,
      },
    });

    console.log(`   ✅ Lesson ${lessonDef.order}: ${lessonDef.title}`);
    console.log(`      Content length: ${lessonContent.length} chars`);
  }

  // Verify the import
  const finalModule = await prisma.module.findUnique({
    where: { id: module1.id },
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

  console.log("\n✨ Module 1 import complete!");
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
