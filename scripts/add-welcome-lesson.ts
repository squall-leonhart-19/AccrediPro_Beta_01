/**
 * Script to add Welcome Lesson (Lesson 0) to Mini Diploma
 * 
 * This creates a welcome/orientation lesson at the start of the mini diploma
 * to set expectations and build rapport before Module 1.
 */

import { PrismaClient, LessonType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const WELCOME_LESSON_CONTENT = `
<div style="max-width: 800px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif;">
  <!-- Hero Section -->
  <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); border-radius: 16px; padding: 40px 30px; text-align: center; color: white; margin-bottom: 32px;">
    <div style="font-size: 48px; margin-bottom: 16px;">🎓</div>
    <h1 style="margin: 0 0 12px; font-size: 28px; font-weight: 800;">Welcome to Your Mini Diploma!</h1>
    <p style="margin: 0; opacity: 0.9; font-size: 16px;">You're about to discover the power of root-cause healing</p>
  </div>

  <!-- Welcome Message -->
  <div style="background: #FBF4F4; border-left: 4px solid #722F37; padding: 24px; border-radius: 0 12px 12px 0; margin-bottom: 32px;">
    <p style="margin: 0 0 16px; font-size: 18px; color: #333; line-height: 1.6;">
      <strong>Hey there! 👋</strong>
    </p>
    <p style="margin: 0 0 16px; font-size: 16px; color: #555; line-height: 1.7;">
      I'm Sarah, and I'll be your guide for the next 3 days. Whether you're a nurse feeling burnt out, a health enthusiast looking to turn your passion into a career, or someone who's struggled with their own health issues — <strong>you're in the right place.</strong>
    </p>
    <p style="margin: 0; font-size: 16px; color: #555; line-height: 1.7;">
      This Mini Diploma will give you a solid foundation in Functional Medicine — the root-cause approach that's transforming healthcare. And the best part? <strong>No medical degree required.</strong>
    </p>
  </div>

  <!-- What You'll Learn -->
  <div style="background: white; border: 2px solid #ECE8E2; border-radius: 16px; padding: 28px; margin-bottom: 32px;">
    <h2 style="margin: 0 0 20px; color: #722F37; font-size: 20px; font-weight: 700;">📚 What You'll Learn</h2>
    
    <div style="display: grid; gap: 16px;">
      <div style="display: flex; align-items: flex-start; gap: 16px; padding: 16px; background: #F9F9F9; border-radius: 12px;">
        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #722F37, #8B3A42); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; flex-shrink: 0;">1</div>
        <div>
          <h3 style="margin: 0 0 4px; font-size: 16px; color: #333; font-weight: 600;">Day 1: The Foundations</h3>
          <p style="margin: 0; font-size: 14px; color: #666;">Understand why conventional medicine misses the mark — and how Functional Medicine fills the gap.</p>
        </div>
      </div>
      
      <div style="display: flex; align-items: flex-start; gap: 16px; padding: 16px; background: #F9F9F9; border-radius: 12px;">
        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #722F37, #8B3A42); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; flex-shrink: 0;">2</div>
        <div>
          <h3 style="margin: 0 0 4px; font-size: 16px; color: #333; font-weight: 600;">Day 2: The 7 Body Systems</h3>
          <p style="margin: 0; font-size: 14px; color: #666;">Learn the framework that connects all health issues to their root causes.</p>
        </div>
      </div>
      
      <div style="display: flex; align-items: flex-start; gap: 16px; padding: 16px; background: #F9F9F9; border-radius: 12px;">
        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #722F37, #8B3A42); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; flex-shrink: 0;">3</div>
        <div>
          <h3 style="margin: 0 0 4px; font-size: 16px; color: #333; font-weight: 600;">Day 3: Your Path Forward</h3>
          <p style="margin: 0; font-size: 14px; color: #666;">See real case studies and discover how to turn this knowledge into a fulfilling career.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- How to Succeed -->
  <div style="background: linear-gradient(145deg, #FFFEF8, #FFF9E8); border: 2px solid #C9A14E; border-radius: 16px; padding: 28px; margin-bottom: 32px;">
    <h2 style="margin: 0 0 20px; color: #8B6914; font-size: 20px; font-weight: 700;">⭐ How to Get the Most Out of This</h2>
    
    <ul style="margin: 0; padding: 0; list-style: none;">
      <li style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; font-size: 15px; color: #555;">
        <span style="color: #C9A14E; font-weight: 800;">✓</span>
        <span><strong>Watch in order</strong> — each lesson builds on the last</span>
      </li>
      <li style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; font-size: 15px; color: #555;">
        <span style="color: #C9A14E; font-weight: 800;">✓</span>
        <span><strong>Complete in 90 minutes</strong> — or spread it over 3 days</span>
      </li>
      <li style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; font-size: 15px; color: #555;">
        <span style="color: #C9A14E; font-weight: 800;">✓</span>
        <span><strong>Take the quizzes</strong> — they help you retain what you learn</span>
      </li>
      <li style="display: flex; align-items: flex-start; gap: 12px; font-size: 15px; color: #555;">
        <span style="color: #C9A14E; font-weight: 800;">✓</span>
        <span><strong>Pass the final exam</strong> — and earn your official Mini Diploma certificate!</span>
      </li>
    </ul>
  </div>

  <!-- Ready CTA -->
  <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); border-radius: 16px; padding: 32px; text-align: center; color: white;">
    <h2 style="margin: 0 0 12px; font-size: 22px; font-weight: 800;">Ready to Begin?</h2>
    <p style="margin: 0 0 20px; opacity: 0.9; font-size: 15px;">Click "Complete & Continue" below to start Day 1</p>
    <div style="display: inline-block; background: white; color: #722F37; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px;">
      Let's do this! 🚀
    </div>
  </div>
</div>
`;

async function main() {
    console.log("🎓 Adding Welcome Lesson to Mini Diploma...\n");

    // Find the mini diploma course
    const course = await prisma.course.findFirst({
        where: { slug: "functional-medicine-mini-diploma" },
        include: {
            modules: {
                orderBy: { order: "asc" },
                include: {
                    lessons: {
                        orderBy: { order: "asc" },
                    },
                },
            },
        },
    });

    if (!course) {
        console.error("❌ Mini diploma course not found!");
        return;
    }

    console.log(`Found course: ${course.title}`);
    console.log(`Current modules: ${course.modules.length}`);

    // Check if welcome module already exists (order 0 or title contains "Welcome")
    const existingWelcome = course.modules.find(
        (m) => m.order === 0 || m.title.toLowerCase().includes("welcome")
    );

    if (existingWelcome) {
        console.log(`\n⚠️ Welcome module already exists: "${existingWelcome.title}"`);
        console.log("Updating its content...\n");

        // Update the existing welcome lesson
        const welcomeLesson = existingWelcome.lessons[0];
        if (welcomeLesson) {
            await prisma.lesson.update({
                where: { id: welcomeLesson.id },
                data: {
                    title: "Welcome to Your Mini Diploma",
                    content: WELCOME_LESSON_CONTENT,
                    order: 0,
                },
            });
            console.log(`✅ Updated welcome lesson: ${welcomeLesson.id}`);
        }
        return;
    }

    // Shift all existing modules up by 1 to make room for Module 0
    console.log("\nShifting existing modules...");
    for (const module of course.modules) {
        await prisma.module.update({
            where: { id: module.id },
            data: { order: module.order + 1 },
        });
        console.log(`  Moved "${module.title}" to order ${module.order + 1}`);
    }

    // Create the Welcome module at order 0
    console.log("\nCreating Welcome module...");
    const welcomeModule = await prisma.module.create({
        data: {
            title: "Welcome & Orientation",
            description: "Get ready for your Functional Medicine journey",
            order: 0,
            isPublished: true,
            courseId: course.id,
        },
    });
    console.log(`✅ Created module: ${welcomeModule.id}`);

    // Create the welcome lesson
    console.log("Creating Welcome lesson...");
    const welcomeLesson = await prisma.lesson.create({
        data: {
            title: "Welcome to Your Mini Diploma",
            content: WELCOME_LESSON_CONTENT,
            order: 0,
            type: LessonType.TEXT,
            isPublished: true,
            moduleId: welcomeModule.id,
        },
    });
    console.log(`✅ Created lesson: ${welcomeLesson.id}`);

    console.log("\n🎉 Welcome lesson added successfully!");
    console.log(`\nNew course structure:`);

    // Show new structure
    const updatedCourse = await prisma.course.findFirst({
        where: { slug: "functional-medicine-mini-diploma" },
        include: {
            modules: {
                orderBy: { order: "asc" },
                include: {
                    lessons: {
                        orderBy: { order: "asc" },
                    },
                },
            },
        },
    });

    if (updatedCourse) {
        for (const mod of updatedCourse.modules) {
            console.log(`  Module ${mod.order}: ${mod.title} (${mod.lessons.length} lessons)`);
        }
    }
}

main()
    .catch((e) => {
        console.error("Error:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
