import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🗑️ Deleting FM test course...");

  // Delete fm-test course and all related data
  const fmTest = await prisma.course.findFirst({
    where: { slug: "fm-test" }
  });

  if (fmTest) {
    // Delete in correct order due to foreign keys
    await prisma.lessonProgress.deleteMany({
      where: { lesson: { module: { courseId: fmTest.id } } }
    });
    await prisma.lessonResource.deleteMany({
      where: { lesson: { module: { courseId: fmTest.id } } }
    });
    await prisma.lesson.deleteMany({
      where: { module: { courseId: fmTest.id } }
    });
    await prisma.module.deleteMany({
      where: { courseId: fmTest.id }
    });
    await prisma.enrollment.deleteMany({
      where: { courseId: fmTest.id }
    });
    await prisma.course.delete({
      where: { id: fmTest.id }
    });
    console.log("✅ FM test course deleted");
  } else {
    console.log("ℹ️ FM test course not found, skipping deletion");
  }

  console.log("\n📚 Creating test_001_beta course...");

  // Get or create a category
  let category = await prisma.category.findFirst({
    where: { slug: "functional-medicine" }
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: "Functional Medicine",
        slug: "functional-medicine",
        description: "Functional Medicine certifications"
      }
    });
  }

  // Get coach (admin user)
  const coach = await prisma.user.findFirst({
    where: { role: "ADMIN" }
  });

  // Create the course
  const course = await prisma.course.create({
    data: {
      title: "Test Course Beta 001",
      slug: "test_001_beta",
      description: "This is a test course to verify the new /learning section functionality. It contains 2 modules with 2 lessons each.",
      shortDescription: "Test course for learning section verification",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
      difficulty: "BEGINNER",
      duration: 60,
      price: 0,
      isFree: true,
      isPublished: true,
      certificateType: "COMPLETION",
      categoryId: category.id,
      coachId: coach?.id || null,
    }
  });

  console.log("✅ Course created: " + course.title + " (" + course.slug + ")");

  // Create Module 1
  const module1 = await prisma.module.create({
    data: {
      title: "Module 1: Getting Started",
      description: "Introduction to the course and foundational concepts",
      order: 1,
      isPublished: true,
      courseId: course.id,
    }
  });

  // Create Module 2
  const module2 = await prisma.module.create({
    data: {
      title: "Module 2: Advanced Topics",
      description: "Diving deeper into advanced concepts and practical applications",
      order: 2,
      isPublished: true,
      courseId: course.id,
    }
  });

  console.log("✅ Modules created");

  // Create lessons for Module 1
  const lesson1_1 = await prisma.lesson.create({
    data: {
      title: "Welcome to the Course",
      description: "An introduction to what you'll learn in this course",
      content: "<h2>Welcome to Test Course Beta 001!</h2><p>We're thrilled to have you here. This course is designed to test and demonstrate the new learning section functionality.</p><h3>What You'll Learn</h3><ul><li>How to navigate the learning interface</li><li>Understanding the sidebar navigation</li><li>Tracking your progress through modules</li><li>Completing lessons and earning achievements</li></ul><h3>Course Structure</h3><p>This course consists of <strong>2 modules</strong> with <strong>2 lessons each</strong>. Each lesson builds upon the previous one, so we recommend completing them in order.</p><blockquote><p>\"The beginning is the most important part of the work.\" - Plato</p></blockquote><h3>Getting Started</h3><p>Simply mark this lesson as complete when you're ready, and proceed to the next lesson. Your progress will be saved automatically.</p><p>Let's begin this learning journey together! 🎓</p>",
      lessonType: "TEXT",
      videoDuration: 300,
      order: 1,
      isPublished: true,
      moduleId: module1.id,
    }
  });

  const lesson1_2 = await prisma.lesson.create({
    data: {
      title: "Understanding the Basics",
      description: "Core concepts you need to know before moving forward",
      content: "<h2>Understanding the Basics</h2><p>Now that you've been introduced to the course, let's dive into some foundational concepts.</p><h3>Key Concepts</h3><h4>1. Progressive Learning</h4><p>This learning platform uses a progressive unlock system. You must complete each lesson before moving to the next one. This ensures you build a solid foundation.</p><h4>2. Module Quizzes</h4><p>At the end of each module, you may encounter a quiz to test your knowledge. Don't worry - you can retake quizzes if needed!</p><h4>3. Tracking Progress</h4><p>Your progress is automatically saved. You can see your overall course progress in the sidebar, as well as individual module progress.</p><h3>The Sidebar</h3><p>The sidebar on the right shows:</p><ul><li><strong>Overall Progress</strong> - A percentage of how far you've come</li><li><strong>Module List</strong> - All modules with their completion status</li><li><strong>Lesson List</strong> - Individual lessons within each module</li><li><strong>Lock Status</strong> - Which lessons are unlocked or locked</li></ul><h3>Navigation</h3><p>Use the <strong>Previous</strong> and <strong>Next</strong> buttons at the bottom of the page to navigate between lessons. You can also click on any unlocked lesson in the sidebar.</p><p>Ready to continue? Mark this lesson complete and let's move to Module 2! 🚀</p>",
      lessonType: "TEXT",
      videoDuration: 420,
      order: 2,
      isPublished: true,
      moduleId: module1.id,
    }
  });

  // Create lessons for Module 2
  const lesson2_1 = await prisma.lesson.create({
    data: {
      title: "Advanced Features",
      description: "Exploring the advanced features of the learning platform",
      content: "<h2>Advanced Features</h2><p>Congratulations on completing Module 1! You're now in Module 2, where we'll explore more advanced features.</p><h3>Gamification Elements</h3><p>This platform includes several gamification features to keep you motivated:</p><h4>🔥 Streaks</h4><p>Log in and complete lessons on consecutive days to build your streak. The longer your streak, the more impressive!</p><h4>🏆 Achievements</h4><p>Earn badges and achievements for various milestones:</p><ul><li><strong>First Step</strong> - Complete your first lesson</li><li><strong>Milestone Badges</strong> - Every 5 lessons completed</li><li><strong>Progress Badges</strong> - At 25%, 50%, and 75% completion</li><li><strong>Course Mastery</strong> - Complete an entire course</li></ul><h4>⭐ XP Points</h4><p>Earn 25 XP for each lesson you complete. Watch your total grow!</p><h3>Notes Feature</h3><p>Click the \"Notes\" button to add personal notes to any lesson. Your notes are saved automatically and can be reviewed anytime.</p><h3>Coach Support</h3><p>Need help? Use the \"Ask a Question\" button to message your course coach directly. They're here to support your learning journey.</p><p>One more lesson to go! You're almost there! 💪</p>",
      lessonType: "TEXT",
      videoDuration: 360,
      order: 1,
      isPublished: true,
      moduleId: module2.id,
    }
  });

  const lesson2_2 = await prisma.lesson.create({
    data: {
      title: "Course Completion",
      description: "Final lesson - wrapping up and next steps",
      content: "<h2>Congratulations! 🎉</h2><p>You've reached the final lesson of Test Course Beta 001!</p><h3>What You've Accomplished</h3><p>In this course, you've learned about:</p><ul><li>✅ The course structure and navigation</li><li>✅ Progressive learning and module quizzes</li><li>✅ Tracking your progress</li><li>✅ Gamification features (streaks, achievements, XP)</li><li>✅ Notes and coach support features</li></ul><h3>Your Certificate</h3><p>Once you mark this lesson as complete, you'll have finished the entire course! You may receive a certificate of completion that you can download and share.</p><h3>What's Next?</h3><p>Now that you understand how the learning platform works, you're ready to tackle more advanced courses. Check out the course catalog to find your next learning adventure!</p><h3>Feedback</h3><p>We'd love to hear your thoughts on the learning experience. Feel free to message your coach with any feedback or suggestions.</p><hr/><p style=\"text-align: center; font-size: 1.2em; margin-top: 2em;\"><strong>🎓 Thank you for completing this test course!</strong></p><p style=\"text-align: center;\">Mark this lesson complete to finish the course and see the celebration!</p>",
      lessonType: "TEXT",
      videoDuration: 300,
      order: 2,
      isPublished: true,
      moduleId: module2.id,
    }
  });

  console.log("✅ Lessons created");

  // Auto-enroll the admin user
  if (coach) {
    await prisma.enrollment.create({
      data: {
        userId: coach.id,
        courseId: course.id,
        status: "ACTIVE",
        progress: 0,
      }
    });
    console.log("✅ Admin user enrolled");
  }

  // Get first lesson ID for the URL
  console.log("\n📋 Summary:");
  console.log("   Course: " + course.title);
  console.log("   Slug: " + course.slug);
  console.log("   Modules: 2");
  console.log("   Lessons: 4");
  console.log("\n🔗 Test URL: http://localhost:3000/learning/" + course.slug + "/" + lesson1_1.id);
  console.log("\n✅ Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
