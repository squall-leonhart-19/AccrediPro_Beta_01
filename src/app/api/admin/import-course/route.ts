import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

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
  instructor: {
    name: string;
    credentials: string;
    story: string;
  };
  learning_outcomes: string[];
  accreditations: string[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function generateLessonFileName(moduleNumber: number, lessonIndex: number, lessonTitle: string): string {
  const moduleStr = moduleNumber.toString();
  const lessonNum = `${moduleStr}.${lessonIndex + 1}`;
  const titleSlug = lessonTitle
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("_")
    .replace(/[^a-zA-Z0-9_]/g, "");
  return `Lesson_${lessonNum}_${titleSlug}.html`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      courseFolderPath,
      categoryName,
      price,
      certificateType,
      coachEmail,
    } = body;

    // Validate required fields
    if (!courseFolderPath) {
      return NextResponse.json(
        { success: false, error: "Course folder path is required" },
        { status: 400 }
      );
    }

    // Read course_data.json
    const jsonPath = path.join(courseFolderPath, "course_data.json");
    const jsonContent = await fs.readFile(jsonPath, "utf-8");
    const courseData: CourseData = JSON.parse(jsonContent);

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
    }

    // Get coach by email if provided
    let coach = null;
    if (coachEmail) {
      coach = await prisma.user.findFirst({
        where: {
          OR: [
            { email: coachEmail },
            { firstName: { equals: coachEmail, mode: "insensitive" } },
          ],
        },
      });
    }

    // Create the course
    const courseSlug = slugify(courseData.course_title);

    // Check if course already exists
    const existingCourse = await prisma.course.findUnique({
      where: { slug: courseSlug },
    });

    if (existingCourse) {
      return NextResponse.json(
        { success: false, error: `Course with slug "${courseSlug}" already exists` },
        { status: 400 }
      );
    }

    // Calculate estimated duration (assume ~30 min per lesson)
    const totalLessons = courseData.modules.reduce((acc, m) => acc + m.lessons, 0);
    const estimatedDuration = totalLessons * 30; // minutes

    const course = await prisma.course.create({
      data: {
        title: courseData.course_title,
        slug: courseSlug,
        description: courseData.course_description,
        shortDescription: courseData.course_description.substring(0, 200) + "...",
        price: price ? parseFloat(price) : null,
        isFree: !price || parseFloat(price) === 0,
        isPublished: true,
        isFeatured: true,
        difficulty: courseData.difficulty_level.toUpperCase() === "INTERMEDIATE"
          ? "INTERMEDIATE"
          : courseData.difficulty_level.toUpperCase() === "ADVANCED"
          ? "ADVANCED"
          : "BEGINNER",
        duration: estimatedDuration,
        certificateType: certificateType || "CERTIFICATION",
        categoryId: category.id,
        coachId: coach?.id || null,
        publishedAt: new Date(),
      },
    });

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

      // Get all HTML files in the module folder
      const moduleFolderPath = path.join(modulesPath, moduleData.folder_name);

      let lessonFiles: string[] = [];
      try {
        const files = await fs.readdir(moduleFolderPath);
        lessonFiles = files.filter((f) => f.endsWith(".html")).sort();
      } catch {
        // If folder doesn't exist, continue with empty lessons
        console.log(`Module folder not found: ${moduleFolderPath}`);
      }

      // Create lessons
      for (let lessonIndex = 0; lessonIndex < moduleData.lesson_titles.length; lessonIndex++) {
        const lessonTitle = moduleData.lesson_titles[lessonIndex];

        // Try to find matching HTML file
        let htmlContent = "";
        const expectedFileName = generateLessonFileName(
          moduleData.module_number,
          lessonIndex,
          lessonTitle
        );

        // Try exact match first, then fuzzy match
        let matchedFile = lessonFiles.find((f) => f === expectedFileName);

        if (!matchedFile) {
          // Try to match by lesson number pattern
          const lessonNum = `${moduleData.module_number}.${lessonIndex + 1}`;
          matchedFile = lessonFiles.find((f) => f.includes(`Lesson_${lessonNum}_`));
        }

        if (!matchedFile && lessonFiles[lessonIndex]) {
          // Fall back to positional match
          matchedFile = lessonFiles[lessonIndex];
        }

        if (matchedFile) {
          try {
            const htmlPath = path.join(moduleFolderPath, matchedFile);
            htmlContent = await fs.readFile(htmlPath, "utf-8");
          } catch {
            console.log(`Could not read lesson file: ${matchedFile}`);
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

    return NextResponse.json({
      success: true,
      data: {
        courseId: course.id,
        courseSlug: course.slug,
        courseTitle: course.title,
        modulesCreated,
        lessonsCreated: totalLessonsCreated,
        categoryId: category.id,
        categoryName: category.name,
      },
    });
  } catch (error) {
    console.error("Course import error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to import course"
      },
      { status: 500 }
    );
  }
}
