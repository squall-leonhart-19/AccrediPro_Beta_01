import { prisma } from "../src/lib/prisma";
import * as fs from "fs";
import * as path from "path";

const FM_UPDATE_PATH = path.join(process.cwd(), "newcourses/FM-Update");

// Helper to read HTML file content (just the body content, not full HTML)
function extractBodyContent(htmlFile: string): string {
  const content = fs.readFileSync(htmlFile, "utf-8");

  // Extract just the lesson-container content or body content
  const lessonContainerMatch = content.match(/<div class="lesson-container">([\s\S]*?)<\/div>\s*<\/body>/);
  if (lessonContainerMatch) {
    // Return the inner content of lesson-container
    return `<div class="lesson-container">${lessonContainerMatch[1]}</div>`;
  }

  // Fallback: extract body content
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    return bodyMatch[1].trim();
  }

  // If no body tag, return entire content minus doctype and html tags
  return content
    .replace(/<!DOCTYPE[^>]*>/i, "")
    .replace(/<html[^>]*>/i, "")
    .replace(/<\/html>/i, "")
    .replace(/<head>[\s\S]*?<\/head>/i, "")
    .trim();
}

// Parse lesson filename to get order and title
function parseLessonFilename(filename: string): { order: number; title: string } | null {
  // Pattern: Lesson_X.Y_Title_With_Underscores.html
  const match = filename.match(/Lesson_(\d+)\.(\d+)_(.+)\.html$/);
  if (!match) return null;

  const [, moduleNum, lessonNum, titleRaw] = match;
  const title = titleRaw.replace(/_/g, " ");
  const order = parseInt(lessonNum, 10);

  return { order, title };
}

async function main() {
  console.log("📚 Importing HTML content from FM-Update folder...\n");

  // Get the FM course
  const course = await prisma.course.findFirst({
    where: { slug: "functional-medicine-complete-certification" },
  });

  if (!course) {
    console.error("❌ FM course not found!");
    return;
  }

  console.log(`Found course: ${course.title} (${course.id})\n`);

  // Get all modules from FM-Update folder
  const moduleFolders = fs.readdirSync(FM_UPDATE_PATH)
    .filter(f => f.startsWith("Module_"))
    .sort((a, b) => {
      const numA = parseInt(a.replace("Module_", ""), 10);
      const numB = parseInt(b.replace("Module_", ""), 10);
      return numA - numB;
    });

  console.log(`Found ${moduleFolders.length} module folders\n`);

  // Process Module_00 first (Orientation) - this needs to be added
  const module00Folder = moduleFolders.find(f => f === "Module_00");
  if (module00Folder) {
    console.log("🆕 Processing Module 0 (Orientation)...");

    // Check if Module 0 already exists
    let module0 = await prisma.module.findFirst({
      where: {
        courseId: course.id,
        title: { contains: "Orientation" }
      }
    });

    if (!module0) {
      // Update all existing modules to shift their order by 1
      await prisma.module.updateMany({
        where: { courseId: course.id },
        data: { order: { increment: 1 } }
      });

      // Create Module 0
      module0 = await prisma.module.create({
        data: {
          title: "Module 0: Orientation",
          description: "Welcome to your certification journey. Learn how this program works and set yourself up for success.",
          order: 0,
          isPublished: true,
          courseId: course.id,
        }
      });
      console.log(`  ✅ Created Module 0: ${module0.title}`);
    } else {
      console.log(`  ℹ️ Module 0 already exists: ${module0.title}`);
    }

    // Import lessons for Module 0
    const module00Path = path.join(FM_UPDATE_PATH, module00Folder);
    const lessonFiles = fs.readdirSync(module00Path)
      .filter(f => f.endsWith(".html"))
      .sort();

    for (const lessonFile of lessonFiles) {
      const parsed = parseLessonFilename(lessonFile);
      if (!parsed) {
        console.log(`  ⚠️ Could not parse: ${lessonFile}`);
        continue;
      }

      const htmlContent = extractBodyContent(path.join(module00Path, lessonFile));

      // Check if lesson exists
      const existingLesson = await prisma.lesson.findFirst({
        where: {
          moduleId: module0.id,
          order: parsed.order
        }
      });

      if (existingLesson) {
        // Update content
        await prisma.lesson.update({
          where: { id: existingLesson.id },
          data: {
            content: htmlContent,
            lessonType: "TEXT"
          }
        });
        console.log(`    📝 Updated lesson ${parsed.order}: ${parsed.title}`);
      } else {
        // Create new lesson
        await prisma.lesson.create({
          data: {
            title: parsed.title,
            description: `Lesson ${parsed.order} of Module 0`,
            content: htmlContent,
            lessonType: "TEXT",
            order: parsed.order,
            isPublished: true,
            moduleId: module0.id,
            videoDuration: 600, // 10 min read time estimate
          }
        });
        console.log(`    ✅ Created lesson ${parsed.order}: ${parsed.title}`);
      }
    }
  }

  // Process Module 1 - Update existing content
  const module01Folder = moduleFolders.find(f => f === "Module_01");
  if (module01Folder) {
    console.log("\n📝 Processing Module 1 (Updating existing)...");

    // Get the first module (should be Module 1 after we shifted)
    const module1 = await prisma.module.findFirst({
      where: {
        courseId: course.id,
        order: 1
      },
      include: {
        lessons: { orderBy: { order: "asc" } }
      }
    });

    if (module1) {
      const module01Path = path.join(FM_UPDATE_PATH, module01Folder);
      const lessonFiles = fs.readdirSync(module01Path)
        .filter(f => f.endsWith(".html") && f.includes("Lesson_1."))
        .sort();

      // Match first few lessons
      for (let i = 0; i < Math.min(lessonFiles.length, 2); i++) {
        const lessonFile = lessonFiles[i];
        const parsed = parseLessonFilename(lessonFile);
        if (!parsed) continue;

        const htmlContent = extractBodyContent(path.join(module01Path, lessonFile));

        // Find lesson by order
        const existingLesson = module1.lessons.find(l => l.order === parsed.order);
        if (existingLesson) {
          await prisma.lesson.update({
            where: { id: existingLesson.id },
            data: {
              content: htmlContent,
              // Keep VIDEO type but add HTML content for supplementary reading
            }
          });
          console.log(`    📝 Added HTML content to lesson ${parsed.order}: ${existingLesson.title}`);
        }
      }
    }
  }

  console.log("\n✅ Import complete!");

  // Show summary
  const updatedCourse = await prisma.course.findFirst({
    where: { id: course.id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        take: 3,
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: { id: true, title: true, order: true, lessonType: true }
          }
        }
      }
    }
  });

  console.log("\n📋 Summary of first 3 modules:");
  updatedCourse?.modules.forEach(m => {
    console.log(`  Module ${m.order}: ${m.title}`);
    m.lessons.forEach(l => {
      console.log(`    Lesson ${l.order}: ${l.title} (${l.lessonType})`);
    });
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
