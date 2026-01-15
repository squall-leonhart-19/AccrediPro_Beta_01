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

// Module 1 lesson definitions
const module1Lessons = [
  {
    filename: "Lesson_1.1_Introduction_To_Functional_Medicine.html",
    title: "Introduction to Functional Medicine",
    description: "Discover the paradigm-shifting approach that treats root causes, not just symptoms. Learn how functional medicine is transforming healthcare.",
    order: 1,
    readTime: 15,
  },
  {
    filename: "Lesson_1.2_What_Is_Functional_Medicine_And_Why_It_Matters.html",
    title: "What Is Functional Medicine & Why It Matters",
    description: "Deep dive into the functional medicine model and its core philosophy of patient-centered, systems-based care.",
    order: 2,
    readTime: 15,
  },
  {
    filename: "Lesson_1.3_Systems_Biology_And_Root_Cause_Thinking.html",
    title: "Systems Biology & Root Cause Thinking",
    description: "Master the systems-based approach to health. Learn to connect the dots between symptoms and underlying imbalances.",
    order: 3,
    readTime: 18,
  },
  {
    filename: "Lesson_1.4_The_Functional_Medicine_Timeline.html",
    title: "The Functional Medicine Timeline",
    description: "Learn to map a client's health journey from antecedents to triggers to mediators using the powerful FM Timeline tool.",
    order: 4,
    readTime: 15,
  },
  {
    filename: "Lesson_1.5_The_Functional_Medicine_Matrix.html",
    title: "The Functional Medicine Matrix",
    description: "Master the Matrix - the central organizing framework that connects all body systems and guides clinical thinking.",
    order: 5,
    readTime: 20,
  },
  {
    filename: "Lesson_1.6_The_Power_of_the_Patient_Story.html",
    title: "The Power of the Patient Story",
    description: "Transform from information-gatherer to story-listener. The patient narrative is your most powerful diagnostic tool.",
    order: 6,
    readTime: 15,
  },
  {
    filename: "Lesson_1.7_Conventional_Vs_Functional_Approach.html",
    title: "Conventional vs Functional Approach",
    description: "See the dramatic difference between disease-centered and patient-centered medicine through real case comparisons.",
    order: 7,
    readTime: 15,
  },
  {
    filename: "Lesson_1.8_Case_Studies_Seeing_The_Whole_Picture.html",
    title: "Case Studies: Seeing The Whole Picture",
    description: "Apply your learning with comprehensive case studies that demonstrate the functional medicine approach in action.",
    order: 8,
    readTime: 20,
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

async function updateModule(
  courseId: string,
  moduleSearchCriteria: { contains?: string; order?: number },
  modulePath: string,
  lessonDefs: typeof module0Lessons,
  moduleLabel: string
) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing ${moduleLabel}...`);
  console.log(`${'='.repeat(60)}`);

  // Find the module
  const module = await prisma.module.findFirst({
    where: {
      courseId: courseId,
      OR: [
        moduleSearchCriteria.contains ? { title: { contains: moduleSearchCriteria.contains } } : {},
        moduleSearchCriteria.order !== undefined ? { order: moduleSearchCriteria.order } : {}
      ].filter(o => Object.keys(o).length > 0)
    },
    include: {
      lessons: { select: { id: true, title: true, order: true } }
    }
  });

  if (!module) {
    console.log(`❌ ${moduleLabel} not found!`);
    return false;
  }

  console.log(`📦 Found: ${module.title} (${module.id})`);
  console.log(`   Existing lessons: ${module.lessons.length}\n`);

  let updated = 0;
  let created = 0;
  let errors = 0;

  // Update each lesson
  for (const lessonDef of lessonDefs) {
    const filePath = path.join(modulePath, lessonDef.filename);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${lessonDef.filename}`);
      errors++;
      continue;
    }

    try {
      const htmlContent = fs.readFileSync(filePath, "utf-8");
      const lessonContent = extractContentWithStyles(htmlContent);

      // Find existing lesson by order
      const existingLesson = module.lessons.find(l => l.order === lessonDef.order);

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
        console.log(`   ✅ Updated: ${lessonDef.title}`);
        console.log(`      Content: ${(lessonContent.length / 1024).toFixed(1)} KB`);
        updated++;
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
            moduleId: module.id,
          },
        });
        console.log(`   ✨ Created: ${lessonDef.title}`);
        console.log(`      Content: ${(lessonContent.length / 1024).toFixed(1)} KB`);
        created++;
      }
    } catch (err) {
      console.log(`   ❌ Error processing ${lessonDef.filename}: ${err}`);
      errors++;
    }
  }

  console.log(`\n   Summary: ${updated} updated, ${created} created, ${errors} errors`);
  return true;
}

async function main() {
  const basePath = path.join(process.cwd(), "FM/FM-Transformed");

  console.log("🚀 Starting Modules 0-1 Import (Gold Standard Transformed)...\n");
  console.log(`📂 Source path: ${basePath}\n`);

  // Find the FM Certification course
  const course = await prisma.course.findFirst({
    where: { slug: "functional-medicine-complete-certification" },
    select: { id: true, title: true, slug: true },
  });

  if (!course) {
    console.log("❌ Course 'functional-medicine-complete-certification' not found!");

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
  console.log(`   ID: ${course.id}`);

  // Update Module 0
  await updateModule(
    course.id,
    { contains: "Orientation", order: 0 },
    path.join(basePath, "Module_00"),
    module0Lessons,
    "Module 0 (Orientation)"
  );

  // Update Module 1
  await updateModule(
    course.id,
    { contains: "Functional Medicine Foundations", order: 1 },
    path.join(basePath, "Module_01"),
    module1Lessons,
    "Module 1 (Functional Medicine Foundations)"
  );

  // Final summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 Import Complete!");
  console.log("=".repeat(60));
  console.log("\n📋 What was updated:");
  console.log("   - Module 0: 4 lessons with Gold Standard styling");
  console.log("   - Module 1: 8 lessons with Gold Standard styling");
  console.log("\n✨ Refresh your browser to see the changes!");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
