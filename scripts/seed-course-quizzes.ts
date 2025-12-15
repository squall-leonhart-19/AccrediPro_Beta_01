import prisma from "../src/lib/prisma";

async function seedCourseQuizzes(courseSlug?: string) {
  console.log("Seeding quizzes for course...\n");

  // Get course(s) with modules
  const whereClause = courseSlug ? { slug: courseSlug } : {};

  const courses = await prisma.course.findMany({
    where: whereClause,
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          quiz: true,
        },
      },
    },
  });

  if (courses.length === 0) {
    console.error("No courses found!");
    process.exit(1);
  }

  let totalCreated = 0;
  let totalSkipped = 0;

  for (const course of courses) {
    console.log(`\nProcessing: ${course.title} (${course.slug})`);
    console.log(`Total modules: ${course.modules.length}`);

    for (const mod of course.modules) {
      if (mod.quiz) {
        console.log(`  Module ${mod.order}: ${mod.title} - Already has quiz`);
        totalSkipped++;
        continue;
      }

      console.log(`  Module ${mod.order}: ${mod.title} - Creating quiz...`);

      // Create assessment quiz for module
      await prisma.moduleQuiz.create({
        data: {
          moduleId: mod.id,
          title: `${mod.title} - Assessment`,
          description: `Complete this assessment to earn your mini-diploma for ${mod.title}`,
          passingScore: 70,
          maxAttempts: null, // Unlimited attempts
          isRequired: true,
          isPublished: true,
          showCorrectAnswers: true,
          questions: {
            create: [
              {
                question: `Which statement best describes the core focus of "${mod.title}"?`,
                explanation: "Review the module introduction for the key themes.",
                questionType: "MULTIPLE_CHOICE",
                order: 1,
                points: 1,
                answers: {
                  create: [
                    { answer: `Understanding and applying the principles of ${mod.title.toLowerCase()}`, isCorrect: true, order: 1 },
                    { answer: "Memorizing facts without application", isCorrect: false, order: 2 },
                    { answer: "Skipping to the next module quickly", isCorrect: false, order: 3 },
                    { answer: "None of the above", isCorrect: false, order: 4 },
                  ],
                },
              },
              {
                question: "What is the most important takeaway from this module for your practice?",
                explanation: "Reflect on how you can apply what you learned.",
                questionType: "MULTIPLE_CHOICE",
                order: 2,
                points: 1,
                answers: {
                  create: [
                    { answer: "Practical application of the concepts with clients", isCorrect: true, order: 1 },
                    { answer: "Theoretical knowledge only", isCorrect: false, order: 2 },
                    { answer: "Nothing useful", isCorrect: false, order: 3 },
                    { answer: "I did not complete the lessons", isCorrect: false, order: 4 },
                  ],
                },
              },
              {
                question: "How confident are you in applying the concepts from this module?",
                explanation: "Self-assessment is key to growth.",
                questionType: "MULTIPLE_CHOICE",
                order: 3,
                points: 1,
                answers: {
                  create: [
                    { answer: "Very confident - I can apply these concepts immediately", isCorrect: true, order: 1 },
                    { answer: "Confident - With some review I'll be ready", isCorrect: true, order: 2 },
                    { answer: "Not yet confident - I need to review more", isCorrect: false, order: 3 },
                    { answer: "I skipped the material", isCorrect: false, order: 4 },
                  ],
                },
              },
            ],
          },
        },
      });
      totalCreated++;
    }
  }

  console.log(`\n✅ Done! Created ${totalCreated} quizzes, skipped ${totalSkipped} existing.`);
}

// Get course slug from command line args
const courseSlug = process.argv[2];

seedCourseQuizzes(courseSlug)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
