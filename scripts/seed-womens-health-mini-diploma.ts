/**
 * Seed the Women's Health & Hormones Mini Diploma Course
 * FREE Lead Magnet - 3 Modules, 9 Lessons
 * Password for all: coach2026
 * 7-day access limit
 */

import prisma from "../src/lib/prisma";

async function seedWomensHealthMiniDiploma() {
  console.log("🌸 Seeding Women's Health & Hormones Mini Diploma...\n");

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
        color: "#ec4899", // pink for women's health
        icon: "Heart",
      },
    });
    console.log("✅ Created category: Mini Diploma");
  }

  // 2. Check if Women's Health Mini Diploma course already exists
  let course = await prisma.course.findFirst({
    where: { slug: "womens-health-mini-diploma" },
  });

  if (course) {
    console.log("⚠️ Women's Health Mini Diploma course already exists, updating...");
    course = await prisma.course.update({
      where: { id: course.id },
      data: {
        title: "Women's Health & Hormones Mini Diploma",
        description: "Your 9-lesson introduction to Women's Health & Hormone Balance. Learn the fundamentals of the female endocrine system, understand hormonal imbalances, and discover how to support women through every life stage.",
        shortDescription: "Master the foundations of women's hormonal health",
        price: 0, // FREE lead magnet
        isFree: true,
        isPublished: true,
        certificateType: "MINI_DIPLOMA",
      },
    });
  } else {
    // Create the Mini Diploma course
    course = await prisma.course.create({
      data: {
        title: "Women's Health & Hormones Mini Diploma",
        slug: "womens-health-mini-diploma",
        description: "Your 9-lesson introduction to Women's Health & Hormone Balance. Learn the fundamentals of the female endocrine system, understand hormonal imbalances, and discover how to support women through every life stage.",
        shortDescription: "Master the foundations of women's hormonal health",
        thumbnail: "/images/courses/womens-health-mini-diploma.jpg",
        price: 0, // FREE lead magnet
        isFree: true,
        difficulty: "BEGINNER",
        duration: 90, // minutes
        certificateType: "MINI_DIPLOMA",
        isPublished: true,
        isFeatured: true,
        categoryId: category.id,
        learningOutcomes: [
          "Understand the female hormonal system and its key players",
          "Identify common hormonal imbalances and their symptoms",
          "Learn nutrition and lifestyle strategies for hormone balance",
          "Support women through menstrual, fertility, and menopause stages",
          "Apply functional approaches to thyroid and adrenal health",
          "Build confidence to guide women on their health journey",
        ],
        targetAudience: "Health-conscious women, aspiring health coaches, nurses, and wellness practitioners who want to understand and support women's hormonal health.",
        estimatedWeeks: 1,
      },
    });
    console.log("✅ Created course: Women's Health & Hormones Mini Diploma");
  }

  // 3. Create 3 Modules with lessons
  const modules = [
    {
      title: "Module 1: Hormonal Foundations",
      description: "Understanding the female endocrine system and how hormones orchestrate health",
      order: 0,
      lessons: [
        {
          title: "Meet Your Hormones",
          order: 0,
          isFreePreview: true,
          description: "An introduction to the key hormones that govern women's health: estrogen, progesterone, testosterone, cortisol, and thyroid hormones."
        },
        {
          title: "The Monthly Dance",
          order: 1,
          isFreePreview: false,
          description: "Understanding the menstrual cycle phases and how hormone fluctuations affect mood, energy, and wellbeing."
        },
        {
          title: "When Hormones Go Rogue",
          order: 2,
          isFreePreview: false,
          description: "Recognizing signs of hormonal imbalance: PMS, PCOS, endometriosis, and estrogen dominance."
        },
      ],
    },
    {
      title: "Module 2: The Hormone-Body Connection",
      description: "How hormones interact with gut, thyroid, stress, and metabolism",
      order: 1,
      lessons: [
        {
          title: "Gut-Hormone Axis",
          order: 0,
          isFreePreview: false,
          description: "The estrobolome and how gut health directly impacts hormone balance and elimination."
        },
        {
          title: "Thyroid & Energy",
          order: 1,
          isFreePreview: false,
          description: "Understanding thyroid function, hypothyroidism, and the connection to weight, mood, and fertility."
        },
        {
          title: "Stress & Your Adrenals",
          order: 2,
          isFreePreview: false,
          description: "The cortisol-hormone connection and how chronic stress disrupts the entire hormonal cascade."
        },
      ],
    },
    {
      title: "Module 3: Heal & Thrive",
      description: "Practical strategies and your path forward as a women's health advocate",
      order: 2,
      lessons: [
        {
          title: "Food as Medicine",
          order: 0,
          isFreePreview: false,
          description: "Nutrition strategies for hormone balance: seed cycling, anti-inflammatory eating, and blood sugar management."
        },
        {
          title: "Life Stage Support",
          order: 1,
          isFreePreview: false,
          description: "Supporting women through fertility, pregnancy, postpartum, perimenopause, and menopause."
        },
        {
          title: "Your Next Step",
          order: 2,
          isFreePreview: false,
          description: "How to take your women's health knowledge further and make a real difference in women's lives."
        },
      ],
    },
  ];

  // Delete existing modules and lessons for this course to avoid duplicates
  await prisma.lesson.deleteMany({
    where: { module: { courseId: course.id } },
  });
  await prisma.module.deleteMany({
    where: { courseId: course.id },
  });
  console.log("🧹 Cleaned up existing modules and lessons");

  let lessonNumber = 1;
  for (const moduleData of modules) {
    // Create module
    const module = await prisma.module.create({
      data: {
        courseId: course.id,
        title: moduleData.title,
        description: moduleData.description,
        order: moduleData.order,
        isPublished: true,
      },
    });
    console.log(`✅ Created module: ${moduleData.title}`);

    // Create lessons for this module
    for (const lessonData of moduleData.lessons) {
      await prisma.lesson.create({
        data: {
          moduleId: module.id,
          title: lessonData.title,
          description: lessonData.description,
          content: JSON.stringify({
            type: "sarah-chat",
            lessonNumber,
            course: "womens-health",
            version: "v1",
          }),
          lessonType: "TEXT", // Sarah chat lessons
          order: lessonData.order,
          isPublished: true,
          isFreePreview: lessonData.isFreePreview,
          videoDuration: 6, // ~6 minutes per lesson
        },
      });
      console.log(`  ✅ Created lesson ${lessonNumber}: ${lessonData.title}`);
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

  console.log("\n🌸 Women's Health & Hormones Mini Diploma seeded successfully!");
  console.log(`   Course ID: ${course.id}`);
  console.log(`   Slug: womens-health-mini-diploma`);
  console.log(`   Total lessons: 9`);
  console.log(`   Price: FREE (Lead Magnet)`);
  console.log(`   Access: 7 days`);
}

seedWomensHealthMiniDiploma()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding Women's Health Mini Diploma:", error);
    process.exit(1);
  });
