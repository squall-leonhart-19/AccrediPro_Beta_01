/**
 * Fix Welcome Lesson Script
 * 
 * 1. Creates NEW Lesson 1.0 (Welcome) - does not replace existing
 * 2. Restores Lesson 1.1 original content
 * 3. Fixed styling: white header, no emoji, no CTA
 */

import { PrismaClient, LessonType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Fixed Welcome content: white header, no emoji, no CTA
const WELCOME_LESSON_CONTENT = `
<div style="max-width: 800px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif;">
  <!-- Hero Section - WHITE background -->
  <div style="background: white; border: 2px solid #722F37; border-radius: 16px; padding: 40px 30px; text-align: center; margin-bottom: 32px;">
    <h1 style="margin: 0 0 12px; font-size: 28px; font-weight: 800; color: #722F37;">Welcome to Your Mini Diploma!</h1>
    <p style="margin: 0; color: #666; font-size: 16px;">You're about to discover the power of root-cause healing</p>
  </div>

  <!-- Welcome Message -->
  <div style="background: #FBF4F4; border-left: 4px solid #722F37; padding: 24px; border-radius: 0 12px 12px 0; margin-bottom: 32px;">
    <p style="margin: 0 0 16px; font-size: 18px; color: #333; line-height: 1.6;">
      <strong>Hey there!</strong>
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
    <h2 style="margin: 0 0 20px; color: #722F37; font-size: 20px; font-weight: 700;">What You'll Learn</h2>
    
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
  <div style="background: linear-gradient(145deg, #FFFEF8, #FFF9E8); border: 2px solid #C9A14E; border-radius: 16px; padding: 28px;">
    <h2 style="margin: 0 0 20px; color: #8B6914; font-size: 20px; font-weight: 700;">How to Get the Most Out of This</h2>
    
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
</div>
`;

// Original Lesson 1.1 content needs to be restored
const LESSON_1_1_CONTENT = `
<div style="max-width: 800px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif;">
  <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); border-radius: 16px; padding: 40px 30px; text-align: center; color: white; margin-bottom: 32px;">
    <h1 style="margin: 0 0 12px; font-size: 28px; font-weight: 800;">The 'Sick Care' Crisis & Your Second Act</h1>
    <p style="margin: 0; opacity: 0.9; font-size: 16px;">Why the healthcare system is broken — and how you can be part of the solution</p>
  </div>

  <div style="background: white; border: 2px solid #ECE8E2; border-radius: 16px; padding: 28px; margin-bottom: 24px;">
    <h2 style="margin: 0 0 16px; color: #722F37; font-size: 20px; font-weight: 700;">The Problem with Modern Medicine</h2>
    <p style="margin: 0 0 16px; font-size: 16px; color: #555; line-height: 1.7;">
      Right now, millions of people are stuck in a healthcare system that treats symptoms, not causes. They bounce from doctor to doctor, getting prescriptions that mask their problems but never truly heal them.
    </p>
    <p style="margin: 0; font-size: 16px; color: #555; line-height: 1.7;">
      This is what we call <strong>"sick care"</strong> — a system designed to manage disease, not prevent or reverse it.
    </p>
  </div>

  <div style="background: #FBF4F4; border-left: 4px solid #722F37; padding: 24px; border-radius: 0 12px 12px 0; margin-bottom: 24px;">
    <p style="margin: 0; font-size: 16px; color: #555; line-height: 1.7;">
      <strong>The good news?</strong> There's a better way. Functional Medicine looks at the whole person — their genetics, environment, and lifestyle — to find and address the <span style="background: #fff3cd; padding: 2px 6px; border-radius: 4px; font-weight: 600;">root cause</span> of illness.
    </p>
  </div>

  <div style="background: white; border: 2px solid #ECE8E2; border-radius: 16px; padding: 28px;">
    <h2 style="margin: 0 0 16px; color: #722F37; font-size: 20px; font-weight: 700;">Your Second Act Starts Here</h2>
    <p style="margin: 0 0 16px; font-size: 16px; color: #555; line-height: 1.7;">
      Whether you're a nurse ready for a change, a health coach looking to level up, or someone who's healed themselves and wants to help others — Functional Medicine gives you the framework to make a real difference.
    </p>
    <p style="margin: 0; font-size: 16px; color: #555; line-height: 1.7;">
      In the next lesson, we'll dive into the 7 Body Systems framework that ties everything together.
    </p>
  </div>
</div>
`;

async function main() {
    console.log("🔧 Fixing Welcome Lesson (creating 1.0, restoring 1.1)...\n");

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

    // Get first module
    const firstModule = course.modules[0];
    if (!firstModule) {
        console.error("❌ No modules found!");
        return;
    }

    console.log(`First module: ${firstModule.title} (ID: ${firstModule.id})`);
    console.log(`Current lessons in module: ${firstModule.lessons.length}`);

    // Check current first lesson
    const currentFirstLesson = firstModule.lessons[0];
    if (currentFirstLesson) {
        console.log(`Current first lesson: "${currentFirstLesson.title}" (order: ${currentFirstLesson.order})`);
    }

    // Step 1: Shift all existing lessons by 1
    console.log("\nShifting existing lessons...");
    for (const lesson of firstModule.lessons) {
        await prisma.lesson.update({
            where: { id: lesson.id },
            data: { order: lesson.order + 1 },
        });
        console.log(`  Moved "${lesson.title}" to order ${lesson.order + 1}`);
    }

    // Step 2: Create new Welcome lesson at order 0
    console.log("\nCreating Welcome lesson at order 0...");
    const welcomeLesson = await prisma.lesson.create({
        data: {
            title: "Welcome to Your Mini Diploma",
            content: WELCOME_LESSON_CONTENT,
            order: 0,
            lessonType: LessonType.TEXT,
            isPublished: true,
            moduleId: firstModule.id,
        },
    });
    console.log(`✅ Created welcome lesson: ${welcomeLesson.id}`);

    // Step 3: Restore the original Lesson 1.1 content if it was overwritten
    if (currentFirstLesson && currentFirstLesson.title === "Welcome to Your Mini Diploma") {
        console.log("\nRestoring original Lesson 1.1 content...");
        await prisma.lesson.update({
            where: { id: currentFirstLesson.id },
            data: {
                title: "The 'Sick Care' Crisis & Your Second Act",
                content: LESSON_1_1_CONTENT,
            },
        });
        console.log(`✅ Restored lesson 1.1: ${currentFirstLesson.id}`);
    }

    // Show final structure
    console.log("\n📋 Final lesson structure:");
    const updatedModule = await prisma.module.findUnique({
        where: { id: firstModule.id },
        include: {
            lessons: {
                orderBy: { order: "asc" },
            },
        },
    });

    if (updatedModule) {
        for (const lesson of updatedModule.lessons) {
            console.log(`  Lesson ${lesson.order}: ${lesson.title}`);
        }
    }

    console.log("\n🎉 Done!");
}

main()
    .catch((e) => {
        console.error("Error:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
