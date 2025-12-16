import { PrismaClient, CertificateType, LessonType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const MINI_DIPLOMA_DIR = path.join(process.cwd(), "Mini_Diploma");

async function main() {
  console.log("Seeding Functional Medicine Mini Diploma...");

  // Get or create the functional-medicine category
  let category = await prisma.category.findFirst({
    where: { slug: "functional-medicine" },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: "Functional Medicine",
        slug: "functional-medicine",
        description: "Learn the foundations of functional medicine",
      },
    });
    console.log("Created category:", category.name);
  }

  // Get coach Sarah (or admin if Sarah doesn't exist)
  let coach = await prisma.user.findFirst({
    where: {
      OR: [
        { email: "sarah@accredipro.com" },
        { email: "admin@accredipro-certificate.com" },
      ],
    },
  });

  // Check if mini diploma course already exists
  const existingCourse = await prisma.course.findFirst({
    where: { slug: "functional-medicine-mini-diploma" },
  });

  if (existingCourse) {
    console.log("Mini diploma course already exists. Updating...");
    // Delete existing modules and lessons to recreate
    await prisma.lesson.deleteMany({
      where: { module: { courseId: existingCourse.id } },
    });
    await prisma.module.deleteMany({
      where: { courseId: existingCourse.id },
    });
    await prisma.course.delete({
      where: { id: existingCourse.id },
    });
    console.log("Deleted existing course data");
  }

  // Read HTML content files
  const module0Content = fs.readFileSync(
    path.join(MINI_DIPLOMA_DIR, "Module_0_Welcome.html"),
    "utf-8"
  );
  const module1Content = fs.readFileSync(
    path.join(MINI_DIPLOMA_DIR, "Module_1_Root_Cause_Framework.html"),
    "utf-8"
  );
  const module2Content = fs.readFileSync(
    path.join(MINI_DIPLOMA_DIR, "Module_2_Case_Study_Michelle.html"),
    "utf-8"
  );
  const module3Content = fs.readFileSync(
    path.join(MINI_DIPLOMA_DIR, "Module_3_Your_Path_Forward.html"),
    "utf-8"
  );

  // Create the course
  const course = await prisma.course.create({
    data: {
      title: "Functional Medicine Mini Diploma",
      slug: "functional-medicine-mini-diploma",
      description:
        "Discover why you've been feeling tired, gaining weight, and struggling with symptoms your doctors can't explain. This free mini diploma introduces the 7 Body Systems Model and shows you exactly how functional medicine finds root causes that conventional medicine misses. Complete all modules and pass the final exam to earn your Mini Diploma certificate.",
      thumbnail: "/images/courses/mini-diploma-thumb.jpg",
      price: 0,
      isPublished: true,
      isFeatured: false,
      certificateType: CertificateType.MINI_DIPLOMA,
      categoryId: category.id,
      coachId: coach?.id,
      modules: {
        create: [
          {
            title: "Welcome: Your New Beginning",
            description: "Introduction to the course, meet Sarah, her personal story of burnout and recovery, what to expect from the mini diploma",
            order: 0,
            isPublished: true,
            lessons: {
              create: [
                {
                  title: "Welcome: Your New Beginning",
                  description: "Your first step toward root-cause healing. Meet Sarah and learn what to expect.",
                  content: module0Content,
                  lessonType: LessonType.TEXT,
                  order: 0,
                  isPublished: true,
                  isFreePreview: true,
                },
              ],
            },
          },
          {
            title: "The Root-Cause Framework",
            description: "The 7 Body Systems Model and Root-Cause Pyramid - understanding how the body works as an interconnected system",
            order: 1,
            isPublished: true,
            lessons: {
              create: [
                {
                  title: "The Root-Cause Framework",
                  description: "Learn the 7 Body Systems Model and why treating root causes beats treating symptoms.",
                  content: module1Content,
                  lessonType: LessonType.TEXT,
                  order: 0,
                  isPublished: true,
                  isFreePreview: false,
                },
              ],
            },
          },
          {
            title: "Case Study: Michelle",
            description: "Real case study of a 42-year-old working mom with multiple symptoms - showing how functional medicine connects the dots",
            order: 2,
            isPublished: true,
            lessons: {
              create: [
                {
                  title: "Case Study: Michelle",
                  description: "See exactly how functional medicine found the root causes that 3 doctors missed.",
                  content: module2Content,
                  lessonType: LessonType.TEXT,
                  order: 0,
                  isPublished: true,
                  isFreePreview: false,
                },
              ],
            },
          },
          {
            title: "Your Path Forward",
            description: "Two paths - personal transformation or helping others heal. Introduction to becoming a certified practitioner",
            order: 3,
            isPublished: true,
            lessons: {
              create: [
                {
                  title: "Your Path Forward",
                  description: "Decide your next steps: personal healing or becoming a certified practitioner.",
                  content: module3Content,
                  lessonType: LessonType.TEXT,
                  order: 0,
                  isPublished: true,
                  isFreePreview: false,
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      modules: {
        include: {
          lessons: true,
        },
      },
    },
  });

  console.log(`Created course: ${course.title}`);
  console.log(`Course ID: ${course.id}`);
  console.log(`Modules created: ${course.modules.length}`);

  for (const mod of course.modules) {
    console.log(`  - ${mod.title}: ${mod.lessons.length} lesson(s)`);
  }

  // Auto-enroll users who have miniDiplomaCategory set
  const usersWithMiniDiploma = await prisma.user.findMany({
    where: {
      miniDiplomaCategory: "functional-medicine",
    },
  });

  console.log(`\nFound ${usersWithMiniDiploma.length} users with functional-medicine mini diploma access`);

  for (const user of usersWithMiniDiploma) {
    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: course.id,
      },
    });

    if (!existingEnrollment) {
      await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: course.id,
          status: "ACTIVE",
          progress: 0,
        },
      });
      console.log(`  Enrolled: ${user.firstName} ${user.lastName} (${user.email})`);
    } else {
      console.log(`  Already enrolled: ${user.firstName} ${user.lastName}`);
    }
  }

  console.log("\nMini Diploma seeding complete!");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
