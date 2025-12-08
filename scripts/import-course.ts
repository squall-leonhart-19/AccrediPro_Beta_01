import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs/promises";
import path from "path";
import "dotenv/config";

// Create Prisma client with adapter
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

interface CourseModule {
  module_number: number;
  title: string;
  folder_name: string;
  lessons: number;
  description: string;
  lesson_titles: string[];
}

interface CourseData {
  course_title: string;
  course_description: string;
  difficulty_level: string;
  total_duration_hours: string;
  modules: CourseModule[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function importCourse() {
  const courseFolderPath = "/Users/pochitino/Desktop/accredipro-lms/Functional Medicine Certification";
  const categoryName = "Functional Medicine";
  const price = 997;
  const certificateType = "CERTIFICATION";
  const coachName = "Sarah";

  console.log("Starting course import...");

  // Read course_data.json
  const jsonPath = path.join(courseFolderPath, "course_data.json");
  const jsonContent = await fs.readFile(jsonPath, "utf-8");
  const courseData: CourseData = JSON.parse(jsonContent);

  console.log(`Course: ${courseData.course_title}`);

  // Get or create category
  let category = await prisma.category.findFirst({
    where: { name: { equals: categoryName, mode: "insensitive" } },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: categoryName,
        slug: slugify(categoryName),
        description: `Courses related to ${categoryName}`,
        isActive: true,
      },
    });
    console.log(`Created category: ${categoryName}`);
  }

  // Get coach by name
  const coach = await prisma.user.findFirst({
    where: { firstName: { equals: coachName, mode: "insensitive" } },
  });

  // Create the course
  const courseSlug = slugify(courseData.course_title);

  // Check if course already exists
  const existingCourse = await prisma.course.findUnique({
    where: { slug: courseSlug },
  });

  if (existingCourse) {
    console.log(`Course "${courseSlug}" already exists. Deleting and recreating...`);
    await prisma.course.delete({ where: { slug: courseSlug } });
  }

  // Calculate estimated duration
  const totalLessons = courseData.modules.reduce((acc, m) => acc + m.lessons, 0);
  const estimatedDuration = totalLessons * 30; // 30 min per lesson

  const course = await prisma.course.create({
    data: {
      title: courseData.course_title,
      slug: courseSlug,
      description: courseData.course_description,
      shortDescription: courseData.course_description.substring(0, 200) + "...",
      price: price,
      isFree: false,
      isPublished: true,
      isFeatured: true,
      difficulty: "INTERMEDIATE",
      duration: estimatedDuration,
      certificateType: certificateType as "CERTIFICATION" | "COMPLETION" | "MINI_DIPLOMA",
      categoryId: category.id,
      coachId: coach?.id || null,
      publishedAt: new Date(),
    },
  });

  console.log(`Created course: ${course.title} (ID: ${course.id})`);

  // Create modules and lessons
  const modulesPath = path.join(courseFolderPath, "Modules");
  let totalLessonsCreated = 0;
  let modulesCreated = 0;

  for (const moduleData of courseData.modules) {
    // Create module
    const module = await prisma.module.create({
      data: {
        title: `Module ${moduleData.module_number}: ${moduleData.title}`,
        description: moduleData.description,
        order: moduleData.module_number,
        isPublished: true,
        courseId: course.id,
      },
    });
    modulesCreated++;
    console.log(`  Created module: ${module.title}`);

    // Get HTML files in module folder
    const moduleFolderPath = path.join(modulesPath, moduleData.folder_name);

    let lessonFiles: string[] = [];
    try {
      const files = await fs.readdir(moduleFolderPath);
      lessonFiles = files.filter((f) => f.endsWith(".html")).sort();
    } catch {
      console.log(`    Warning: Module folder not found: ${moduleFolderPath}`);
    }

    // Create lessons
    for (let lessonIndex = 0; lessonIndex < moduleData.lesson_titles.length; lessonIndex++) {
      const lessonTitle = moduleData.lesson_titles[lessonIndex];

      // Try to find matching HTML file
      let htmlContent = "";
      const lessonNum = `${moduleData.module_number}.${lessonIndex + 1}`;
      const matchedFile = lessonFiles.find((f) => f.includes(`Lesson_${lessonNum}_`));

      if (matchedFile) {
        try {
          const htmlPath = path.join(moduleFolderPath, matchedFile);
          htmlContent = await fs.readFile(htmlPath, "utf-8");
        } catch {
          console.log(`    Warning: Could not read ${matchedFile}`);
        }
      } else if (lessonFiles[lessonIndex]) {
        // Fallback to positional match
        try {
          const htmlPath = path.join(moduleFolderPath, lessonFiles[lessonIndex]);
          htmlContent = await fs.readFile(htmlPath, "utf-8");
        } catch {
          console.log(`    Warning: Could not read positional file`);
        }
      }

      // Create lesson
      await prisma.lesson.create({
        data: {
          title: lessonTitle,
          description: `${moduleData.title} - ${lessonTitle}`,
          content: htmlContent || `<div style="padding: 20px; font-family: Georgia, serif;"><h1>${lessonTitle}</h1><p>Content coming soon...</p></div>`,
          order: lessonIndex,
          isPublished: true,
          isFreePreview: moduleData.module_number === 0 && lessonIndex === 0,
          lessonType: "TEXT",
          moduleId: module.id,
        },
      });
      totalLessonsCreated++;
    }
    console.log(`    Created ${moduleData.lesson_titles.length} lessons`);
  }

  // Create course analytics record
  await prisma.courseAnalytics.create({
    data: {
      courseId: course.id,
      totalEnrolled: 0,
      totalCompleted: 0,
      avgProgress: 0,
      avgRating: 0,
      totalRevenue: 0,
    },
  });

  console.log("\n=== Import Complete ===");
  console.log(`Course ID: ${course.id}`);
  console.log(`Course Slug: ${course.slug}`);
  console.log(`Modules Created: ${modulesCreated}`);
  console.log(`Lessons Created: ${totalLessonsCreated}`);
  console.log(`Category: ${category.name}`);
  console.log(`Price: $${price}`);
}

importCourse()
  .then(() => {
    console.log("\nDone!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Import failed:", error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
