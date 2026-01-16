import { prisma } from "../src/lib/prisma";
import { LessonType } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

// Module 1 lesson definitions (8 lessons) - CSS v6.0 Gold Standard upgrade
const module1Lessons = [
  {
    filename: "Lesson_1.1_Introduction_To_Functional_Medicine.html",
    title: "Introduction to Functional Medicine",
    description: "Discover the foundations of functional medicine, its history, core principles, and why this paradigm is essential for chronic health conditions.",
    order: 1,
    readTime: 15,
  },
  {
    filename: "Lesson_1.2_What_Is_Functional_Medicine_And_Why_It_Matters.html",
    title: "What Is Functional Medicine & Why It Matters",
    description: "Deep dive into functional medicine's core principles, the 5 IFM principles, and how this approach creates lasting health transformation.",
    order: 2,
    readTime: 15,
  },
  {
    filename: "Lesson_1.3_Systems_Biology_And_Root_Cause_Thinking.html",
    title: "Systems Biology & Root Cause Thinking",
    description: "Learn to see the body as an interconnected web, understand the seven core systems, and master upstream thinking with the 5 Whys technique.",
    order: 3,
    readTime: 15,
  },
  {
    filename: "Lesson_1.4_The_Functional_Medicine_Timeline.html",
    title: "The Functional Medicine Timeline",
    description: "Master your first investigative tool: building a chronological timeline to reveal patterns. Learn the ATM framework (Antecedents, Triggers, Mediators).",
    order: 4,
    readTime: 15,
  },
  {
    filename: "Lesson_1.5_The_Functional_Medicine_Matrix.html",
    title: "The Functional Medicine Matrix",
    description: "Understand how to organize clinical thinking using the FM Matrix. Learn to connect modifiable lifestyle factors to physiological systems.",
    order: 5,
    readTime: 15,
  },
  {
    filename: "Lesson_1.6_The_Power_of_the_Patient_Story.html",
    title: "The Power of the Patient Story",
    description: "Learn why the patient's story is the most powerful diagnostic tool. Develop deep listening skills and understand the therapeutic value of being heard.",
    order: 6,
    readTime: 15,
  },
  {
    filename: "Lesson_1.7_Conventional_Vs_Functional_Approach.html",
    title: "Conventional vs. Functional Approach",
    description: "Compare the two paradigms, understand when each excels, and learn to integrate both approaches for optimal client outcomes.",
    order: 7,
    readTime: 15,
  },
  {
    filename: "Lesson_1.8_Case_Studies_Seeing_The_Whole_Picture.html",
    title: "Case Studies: Seeing the Whole Picture",
    description: "Apply everything you've learned to real-world case studies. Practice using the timeline, matrix, and systems thinking in complex scenarios.",
    order: 8,
    readTime: 15,
  },
];

// Extract CSS and body content from HTML - preserves full CSS v6.0 styling
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

  // Remove legacy elements if present
  bodyContent = bodyContent.replace(/<div class="brand-header"><\/div>/g, '');
  bodyContent = bodyContent.replace(/<div class="lesson-footer"><\/div>/g, '');

  // Combine CSS + HTML content
  const finalContent = `<style>${cssContent}</style>\n${bodyContent.trim()}`;

  return finalContent;
}

async function main() {
  // Path to the CSS v6.0 Gold Standard updated Module 1 files
  const modulePath = path.join(
    process.cwd(),
    "_Final_Template_Course_Generator/Master_Templates/FM_Complete_Certification_HTML/Module_01"
  );

  console.log("🚀 Starting Module 1 Import (CSS v6.0 Gold Standard)...\n");
  console.log(`📂 Source path: ${modulePath}\n`);

  // Verify folder exists
  if (!fs.existsSync(modulePath)) {
    console.log(`❌ Source folder not found: ${modulePath}`);
    return;
  }

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

  // Find Module 1 (Functional Medicine Foundations)
  let module1 = await prisma.module.findFirst({
    where: {
      courseId: course.id,
      OR: [
        { title: { contains: "Foundations" } },
        { title: { contains: "Module 1" } },
        { order: 1 }
      ]
    },
    include: {
      lessons: { select: { id: true, title: true, order: true } }
    }
  });

  if (!module1) {
    console.log("❌ Module 1 (Functional Medicine Foundations) not found in this course!");

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

  console.log(`📦 Found Module 1: ${module1.title} (${module1.id})`);
  console.log(`   Existing lessons: ${module1.lessons.length}\n`);

  // Update each lesson
  let updatedCount = 0;
  let createdCount = 0;

  for (const lessonDef of module1Lessons) {
    const filePath = path.join(modulePath, lessonDef.filename);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${lessonDef.filename}`);
      continue;
    }

    const htmlContent = fs.readFileSync(filePath, "utf-8");
    const lessonContent = extractContentWithStyles(htmlContent);

    // Find existing lesson by order
    const existingLesson = module1.lessons.find(l => l.order === lessonDef.order);

    if (existingLesson) {
      // Update existing lesson
      await prisma.lesson.update({
        where: { id: existingLesson.id },
        data: {
          title: lessonDef.title,
          description: lessonDef.description,
          content: lessonContent,
          isPublished: true,
        },
      });
      console.log(`   ✅ Updated Lesson ${lessonDef.order}: ${lessonDef.title}`);
      console.log(`      Content length: ${lessonContent.length.toLocaleString()} chars`);
      updatedCount++;
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
          isFreePreview: false,
          moduleId: module1.id,
        },
      });
      console.log(`   ✅ Created Lesson ${lessonDef.order}: ${lessonDef.title}`);
      console.log(`      Content length: ${lessonContent.length.toLocaleString()} chars`);
      createdCount++;
    }
  }

  // Verify the update
  const finalModule = await prisma.module.findUnique({
    where: { id: module1.id },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        select: { id: true, title: true, order: true },
      },
    },
  });

  console.log("\n📊 Update Summary:");
  console.log(`   Module: ${finalModule?.title}`);
  console.log(`   Total Lessons: ${finalModule?.lessons.length}`);
  console.log(`   Updated: ${updatedCount}`);
  console.log(`   Created: ${createdCount}`);
  console.log("\n   Lesson List:");
  finalModule?.lessons.forEach((l) => {
    console.log(`      ${l.order}. ${l.title}`);
  });

  console.log("\n✨ Module 1 CSS v6.0 Gold Standard import complete!");
  console.log("   Refresh your browser to see the beautiful new styling.");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
