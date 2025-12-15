import prisma from "../src/lib/prisma";

async function seedModule0Quiz() {
  // Get Module 0 for Foundational Mastery
  const module = await prisma.module.findFirst({
    where: {
      course: { slug: "fm-test" },
      order: 0,
    },
    include: {
      course: { select: { id: true, title: true } },
      lessons: { select: { id: true, title: true }, orderBy: { order: "asc" } },
    },
  });

  if (!module) {
    console.error("Module 0 not found for Foundational Mastery course");
    process.exit(1);
  }

  console.log("Found module:", module.title);
  console.log("Lessons:", module.lessons.map((l) => l.title).join(", "));

  // Check if quiz already exists
  const existingQuiz = await prisma.moduleQuiz.findUnique({
    where: { moduleId: module.id },
  });

  if (existingQuiz) {
    console.log("Quiz already exists for this module. Deleting and recreating...");
    await prisma.moduleQuiz.delete({ where: { id: existingQuiz.id } });
  }

  // Create quiz with questions based on Module 0 content
  const quiz = await prisma.moduleQuiz.create({
    data: {
      moduleId: module.id,
      title: "Module 0: Welcome & Orientation Quiz",
      description:
        "Test your understanding of the program structure, community guidelines, and how to get the most out of your certification journey.",
      passingScore: 70,
      maxAttempts: 3,
      isRequired: true,
      isPublished: true,
      showCorrectAnswers: true,
      questions: {
        create: [
          {
            question:
              "What is the primary goal of the Foundational Mastery certification?",
            explanation:
              "The program is designed to build your core coaching skills and give you a solid foundation for your practice.",
            questionType: "MULTIPLE_CHOICE",
            order: 1,
            points: 1,
            answers: {
              create: [
                { answer: "To learn advanced marketing techniques", isCorrect: false, order: 1 },
                { answer: "To build core coaching skills and foundations", isCorrect: true, order: 2 },
                { answer: "To get as many clients as possible", isCorrect: false, order: 3 },
                { answer: "To compete with other coaches", isCorrect: false, order: 4 },
              ],
            },
          },
          {
            question:
              "How should you approach the community and support resources?",
            explanation:
              "The community is here to support your growth. Active participation and asking questions helps everyone learn.",
            questionType: "MULTIPLE_CHOICE",
            order: 2,
            points: 1,
            answers: {
              create: [
                { answer: "Only observe, never participate", isCorrect: false, order: 1 },
                { answer: "Ask questions and actively participate", isCorrect: true, order: 2 },
                { answer: "Wait until you finish the program to engage", isCorrect: false, order: 3 },
                { answer: "Only post about your successes", isCorrect: false, order: 4 },
              ],
            },
          },
          {
            question:
              "Which of the following are key components of this certification program? (Select all that apply)",
            explanation:
              "The program combines video lessons, practical exercises, community support, and assessments for comprehensive learning.",
            questionType: "MULTI_SELECT",
            order: 3,
            points: 2,
            answers: {
              create: [
                { answer: "Video lessons and training content", isCorrect: true, order: 1 },
                { answer: "Community support and discussions", isCorrect: true, order: 2 },
                { answer: "Automated client acquisition", isCorrect: false, order: 3 },
                { answer: "Practical exercises and worksheets", isCorrect: true, order: 4 },
              ],
            },
          },
          {
            question:
              "True or False: You must complete all lessons in a module before moving to the next one.",
            explanation:
              "Sequential learning ensures you build skills progressively and don't miss foundational concepts.",
            questionType: "TRUE_FALSE",
            order: 4,
            points: 1,
            answers: {
              create: [
                { answer: "True", isCorrect: true, order: 1 },
                { answer: "False", isCorrect: false, order: 2 },
              ],
            },
          },
          {
            question:
              "What is the best approach when you encounter a challenging concept?",
            explanation:
              "Reaching out for help is a sign of commitment to learning, not weakness. Use all available resources.",
            questionType: "MULTIPLE_CHOICE",
            order: 5,
            points: 1,
            answers: {
              create: [
                { answer: "Skip it and move on", isCorrect: false, order: 1 },
                { answer: "Give up on the program", isCorrect: false, order: 2 },
                { answer: "Review the material and ask for help in the community", isCorrect: true, order: 3 },
                { answer: "Pretend you understand it", isCorrect: false, order: 4 },
              ],
            },
          },
        ],
      },
    },
    include: {
      questions: {
        include: { answers: true },
      },
    },
  });

  console.log("\n✅ Quiz created successfully!");
  console.log(`   Quiz ID: ${quiz.id}`);
  console.log(`   Title: ${quiz.title}`);
  console.log(`   Questions: ${quiz.questions.length}`);
  console.log(`   Passing Score: ${quiz.passingScore}%`);
  console.log(`   Max Attempts: ${quiz.maxAttempts}`);
  console.log("\n📝 Questions:");
  quiz.questions.forEach((q, i) => {
    console.log(`   ${i + 1}. ${q.question.substring(0, 60)}...`);
    console.log(`      Type: ${q.questionType}, Points: ${q.points}`);
  });

  console.log("\n🔗 Quiz URL: /courses/fm-test/quiz/" + module.id);
}

seedModule0Quiz()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
