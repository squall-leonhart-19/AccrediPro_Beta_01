import { prisma } from "../src/lib/prisma";

async function seedFMQuizzes() {
  console.log("Seeding quizzes for Functional Medicine course...\n");

  // Get the FM course with all modules
  const course = await prisma.course.findFirst({
    where: { slug: "functional-medicine-complete-certification" },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { select: { id: true, title: true }, orderBy: { order: "asc" } },
          quiz: true,
        },
      },
    },
  });

  if (!course) {
    console.error("FM course not found!");
    process.exit(1);
  }

  console.log(`Found course: ${course.title}`);
  console.log(`Total modules: ${course.modules.length}\n`);

  // Quiz templates for each module
  const quizTemplates: Record<number, { title: string; questions: any[] }> = {
    0: {
      title: "Module 0: Orientation Quiz",
      questions: [
        {
          question: "What is the primary goal of this certification program?",
          type: "MULTIPLE_CHOICE",
          answers: [
            { text: "To memorize medical terminology", correct: false },
            { text: "To become a certified Functional Medicine Health Coach", correct: true },
            { text: "To replace your doctor", correct: false },
            { text: "To diagnose medical conditions", correct: false },
          ],
        },
        {
          question: "How should you approach the learning materials in this program?",
          type: "MULTIPLE_CHOICE",
          answers: [
            { text: "Rush through as quickly as possible", correct: false },
            { text: "Skip the modules you think you know", correct: false },
            { text: "Complete each module sequentially and take notes", correct: true },
            { text: "Only watch the videos without doing exercises", correct: false },
          ],
        },
        {
          question: "Which resources are available to support your learning?",
          type: "MULTI_SELECT",
          answers: [
            { text: "Video lessons", correct: true },
            { text: "Community support", correct: true },
            { text: "Personal coach access", correct: true },
            { text: "Unlimited free consultations", correct: false },
          ],
        },
      ],
    },
    1: {
      title: "Module 1: Functional Medicine Foundations Quiz",
      questions: [
        {
          question: "What distinguishes Functional Medicine from conventional medicine?",
          type: "MULTIPLE_CHOICE",
          answers: [
            { text: "It uses only herbal remedies", correct: false },
            { text: "It focuses on root causes rather than just symptoms", correct: true },
            { text: "It rejects all modern medical treatments", correct: false },
            { text: "It is faster than conventional medicine", correct: false },
          ],
        },
        {
          question: "The Functional Medicine model emphasizes which approach?",
          type: "MULTIPLE_CHOICE",
          answers: [
            { text: "One-size-fits-all protocols", correct: false },
            { text: "Personalized, patient-centered care", correct: true },
            { text: "Quick fixes for symptoms", correct: false },
            { text: "Isolation of body systems", correct: false },
          ],
        },
        {
          question: "True or False: Functional Medicine practitioners work with patients as partners in their health journey.",
          type: "TRUE_FALSE",
          answers: [
            { text: "True", correct: true },
            { text: "False", correct: false },
          ],
        },
      ],
    },
    2: {
      title: "Module 2: Root Causes of Disease Quiz",
      questions: [
        {
          question: "Which is considered a major root cause of chronic disease?",
          type: "MULTIPLE_CHOICE",
          answers: [
            { text: "Inflammation", correct: true },
            { text: "Tall height", correct: false },
            { text: "Eye color", correct: false },
            { text: "Hair texture", correct: false },
          ],
        },
        {
          question: "Toxicity as a root cause can come from which sources?",
          type: "MULTI_SELECT",
          answers: [
            { text: "Environmental pollutants", correct: true },
            { text: "Heavy metals", correct: true },
            { text: "Positive thoughts", correct: false },
            { text: "Processed foods", correct: true },
          ],
        },
        {
          question: "Chronic stress affects the body primarily through which system?",
          type: "MULTIPLE_CHOICE",
          answers: [
            { text: "The digestive system only", correct: false },
            { text: "The HPA axis and hormonal balance", correct: true },
            { text: "The skeletal system only", correct: false },
            { text: "The circulatory system only", correct: false },
          ],
        },
      ],
    },
  };

  // Create quizzes for modules that don't have them
  let created = 0;
  let skipped = 0;

  for (const mod of course.modules) {
    if (mod.quiz) {
      console.log(`  Module ${mod.order}: ${mod.title} - Already has quiz, skipping`);
      skipped++;
      continue;
    }

    const template = quizTemplates[mod.order];
    if (!template) {
      // Create a generic quiz for modules without templates
      console.log(`  Module ${mod.order}: ${mod.title} - Creating generic quiz`);

      await prisma.moduleQuiz.create({
        data: {
          moduleId: mod.id,
          title: `${mod.title} - Assessment`,
          description: `Test your understanding of ${mod.title}`,
          passingScore: 70,
          maxAttempts: 3,
          isRequired: true,
          isPublished: true,
          showCorrectAnswers: true,
          questions: {
            create: [
              {
                question: `What was the most important concept you learned in ${mod.title}?`,
                explanation: "Reflect on the key takeaways from this module.",
                questionType: "MULTIPLE_CHOICE",
                order: 1,
                points: 1,
                answers: {
                  create: [
                    { answer: "The foundational principles covered in this module", isCorrect: true, order: 1 },
                    { answer: "Nothing was important", isCorrect: false, order: 2 },
                    { answer: "I skipped this module", isCorrect: false, order: 3 },
                    { answer: "I don't remember", isCorrect: false, order: 4 },
                  ],
                },
              },
              {
                question: "How confident do you feel applying the concepts from this module?",
                explanation: "Self-assessment helps track your learning progress.",
                questionType: "MULTIPLE_CHOICE",
                order: 2,
                points: 1,
                answers: {
                  create: [
                    { answer: "Very confident - I understand the material well", isCorrect: true, order: 1 },
                    { answer: "Somewhat confident - I need more practice", isCorrect: true, order: 2 },
                    { answer: "Not confident - I should review the material", isCorrect: false, order: 3 },
                    { answer: "I didn't complete the lessons", isCorrect: false, order: 4 },
                  ],
                },
              },
            ],
          },
        },
      });
      created++;
      continue;
    }

    // Create quiz from template
    console.log(`  Module ${mod.order}: ${mod.title} - Creating quiz from template`);

    await prisma.moduleQuiz.create({
      data: {
        moduleId: mod.id,
        title: template.title,
        description: `Test your understanding of ${mod.title}`,
        passingScore: 70,
        maxAttempts: 3,
        isRequired: true,
        isPublished: true,
        showCorrectAnswers: true,
        questions: {
          create: template.questions.map((q, i) => ({
            question: q.question,
            explanation: "Review the module content if you got this wrong.",
            questionType: q.type,
            order: i + 1,
            points: q.type === "MULTI_SELECT" ? 2 : 1,
            answers: {
              create: q.answers.map((a: any, j: number) => ({
                answer: a.text,
                isCorrect: a.correct,
                order: j + 1,
              })),
            },
          })),
        },
      },
    });
    created++;
  }

  console.log(`\n✅ Done! Created ${created} quizzes, skipped ${skipped} existing.`);
}

seedFMQuizzes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
