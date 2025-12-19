/**
 * Seed the Mini Diploma Course with 9 Lessons
 */

import prisma from "../src/lib/prisma";

async function seedMiniDiplomaCourse() {
  console.log("🎓 Seeding FM Mini Diploma Course...\n");

  // 1. Create or find the Mini Diploma category
  let category = await prisma.category.findFirst({
    where: { slug: "mini-diploma" },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: "Mini Diploma",
        slug: "mini-diploma",
        description: "Starter courses to learn the foundations",
        color: "#7c3aed",
        icon: "GraduationCap",
      },
    });
    console.log("✅ Created category: Mini Diploma");
  }

  // 2. Check if Mini Diploma course already exists
  let course = await prisma.course.findFirst({
    where: { slug: "fm-mini-diploma" },
  });

  if (course) {
    console.log("⚠️ FM Mini Diploma course already exists, using existing...");
  } else {
    // Create the Mini Diploma course
    course = await prisma.course.create({
      data: {
        title: "Integrative Health & Functional Medicine Mini Diploma",
        slug: "fm-mini-diploma",
        description: "Your 9-lesson introduction to Functional Medicine. Learn the frameworks, understand the body systems, and discover if this career path is right for you.",
        shortDescription: "9 lessons to discover Functional Medicine",
        thumbnail: "/images/courses/fm-mini-diploma-thumb.jpg",
        price: 7,
        difficulty: "BEGINNER",
        duration: 90, // minutes
        certificateType: "MINI_DIPLOMA",
        isPublished: true,
        isFeatured: true,
        categoryId: category.id,
      },
    });
    console.log("✅ Created course: FM Mini Diploma");
  }

  // 3. Create 3 Modules (Foundations, Core Systems, Your Path)
  const modules = [
    {
      title: "Module 1: Foundations",
      description: "Understanding what Functional Medicine is and why it matters",
      order: 0,
      lessons: [
        { title: "What is Functional Medicine?", order: 0, isFreePreview: true },
        { title: "The 7 Body Systems Model", order: 1, isFreePreview: false },
        { title: "Your Unfair Advantage", order: 2, isFreePreview: false },
      ],
    },
    {
      title: "Module 2: Core Systems",
      description: "Deep dives into gut health, hormones, and pattern recognition",
      order: 1,
      lessons: [
        { title: "The Gut-Health Connection", order: 0, isFreePreview: false },
        { title: "Hormones & Thyroid", order: 1, isFreePreview: false },
        { title: "Connecting the Dots", order: 2, isFreePreview: false },
      ],
    },
    {
      title: "Module 3: Your Path",
      description: "Practical application and your next steps",
      order: 2,
      lessons: [
        { title: "Working With Clients", order: 0, isFreePreview: false },
        { title: "Building Your Practice", order: 1, isFreePreview: false },
        { title: "Your Next Step", order: 2, isFreePreview: false },
      ],
    },
  ];

  let lessonNumber = 1;
  for (const moduleData of modules) {
    // Create or find module
    let module = await prisma.module.findFirst({
      where: {
        courseId: course.id,
        title: moduleData.title,
      },
    });

    if (!module) {
      module = await prisma.module.create({
        data: {
          courseId: course.id,
          title: moduleData.title,
          description: moduleData.description,
          order: moduleData.order,
          isPublished: true,
        },
      });
      console.log(`✅ Created module: ${moduleData.title}`);
    } else {
      console.log(`⏭️ Module exists: ${moduleData.title}`);
    }

    // Create lessons for this module
    for (const lessonData of moduleData.lessons) {
      const existingLesson = await prisma.lesson.findFirst({
        where: {
          moduleId: module.id,
          title: lessonData.title,
        },
      });

      if (!existingLesson) {
        await prisma.lesson.create({
          data: {
            moduleId: module.id,
            title: lessonData.title,
            description: `Lesson ${lessonNumber}: ${lessonData.title}`,
            content: JSON.stringify({
              type: "sarah-chat",
              lessonNumber,
              version: "v4",
            }),
            lessonType: "TEXT", // Sarah chat lessons (INTERACTIVE type)
            order: lessonData.order,
            isPublished: true,
            isFreePreview: lessonData.isFreePreview,
          },
        });
        console.log(`  ✅ Created lesson ${lessonNumber}: ${lessonData.title}`);
      } else {
        console.log(`  ⏭️ Lesson exists: ${lessonData.title}`);
      }
      lessonNumber++;
    }
  }

  // 4. Create course analytics
  await prisma.courseAnalytics.upsert({
    where: { courseId: course.id },
    update: {},
    create: {
      courseId: course.id,
      totalEnrolled: 0,
    },
  });

  console.log("\n🎉 FM Mini Diploma course seeded successfully!");
  console.log(`   Course ID: ${course.id}`);
  console.log(`   Slug: fm-mini-diploma`);
  console.log(`   Total lessons: 9`);
  console.log(`   Price: $7`);
}

seedMiniDiplomaCourse()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding Mini Diploma:", error);
    process.exit(1);
  });
