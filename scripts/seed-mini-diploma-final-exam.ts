import { PrismaClient, QuestionType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Mini Diploma Final Exam...");

  // Find the mini diploma course
  const course = await prisma.course.findFirst({
    where: { slug: "functional-medicine-mini-diploma" },
    include: {
      modules: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) {
    console.error("Mini diploma course not found!");
    return;
  }

  console.log(`Found course: ${course.title}`);

  // Create a "Final Exam" module if it doesn't exist
  let finalExamModule = course.modules.find(m => m.title.toLowerCase().includes("final exam"));

  if (!finalExamModule) {
    finalExamModule = await prisma.module.create({
      data: {
        title: "Final Exam",
        description: "Complete this 10-question exam to earn your Mini Diploma certificate",
        order: 99, // Put it at the end
        isPublished: true,
        courseId: course.id,
      },
    });
    console.log("Created Final Exam module");
  }

  // Delete existing quiz for final exam module
  const existingQuiz = await prisma.moduleQuiz.findFirst({
    where: { moduleId: finalExamModule.id },
  });
  if (existingQuiz) {
    await prisma.quizAnswer.deleteMany({
      where: { question: { quizId: existingQuiz.id } },
    });
    await prisma.quizQuestion.deleteMany({
      where: { quizId: existingQuiz.id },
    });
    await prisma.moduleQuiz.delete({
      where: { id: existingQuiz.id },
    });
    console.log("Deleted existing final exam quiz");
  }

  // Create Final Exam Quiz (10 questions covering all modules)
  await prisma.moduleQuiz.create({
    data: {
      title: "Functional Medicine Mini Diploma — Final Exam",
      description: "Complete this 10-question exam to earn your Mini Diploma certificate",
      moduleId: finalExamModule.id,
      passingScore: 60,
      isRequired: true,
      showCorrectAnswers: true,
      questions: {
        create: [
          // Q1 - Module 0: Sarah's story
          {
            question: "What led Sarah to discover Functional Medicine?",
            questionType: QuestionType.MULTIPLE_CHOICE,
            order: 0,
            points: 1,
            explanation: "After 12 years as an ICU nurse, Sarah experienced burnout, hormonal collapse, digestive issues, and was dismissed by doctors who said her 'labs are normal.'",
            answers: {
              create: [
                { answer: "She read about it in a magazine", isCorrect: false, order: 0 },
                { answer: "Burnout as an ICU nurse, health collapse, and being dismissed by conventional doctors", isCorrect: true, order: 1 },
                { answer: "A friend recommended it", isCorrect: false, order: 2 },
                { answer: "She wanted to make more money", isCorrect: false, order: 3 },
              ],
            },
          },
          // Q2 - Module 1: Core concept
          {
            question: "What is the MAIN difference between conventional medicine and Functional Medicine?",
            questionType: QuestionType.MULTIPLE_CHOICE,
            order: 1,
            points: 1,
            explanation: "Conventional medicine treats symptoms with medications. Functional Medicine treats the underlying root causes by addressing body systems.",
            answers: {
              create: [
                { answer: "Conventional medicine is free, Functional Medicine costs money", isCorrect: false, order: 0 },
                { answer: "Conventional medicine treats symptoms, Functional Medicine treats root causes and systems", isCorrect: true, order: 1 },
                { answer: "There is no real difference", isCorrect: false, order: 2 },
                { answer: "Functional Medicine only uses supplements", isCorrect: false, order: 3 },
              ],
            },
          },
          // Q3 - Module 1: 7 Systems - Gut importance
          {
            question: "Why is the gut called 'foundational' in Functional Medicine?",
            questionType: QuestionType.MULTIPLE_CHOICE,
            order: 2,
            points: 1,
            explanation: "The gut controls 70-80% of immunity, 90% of serotonin production, nutrient absorption, detox pathways, and hormone processing.",
            answers: {
              create: [
                { answer: "Because it's the first organ to develop", isCorrect: false, order: 0 },
                { answer: "Because it controls immunity, serotonin, nutrients, detox, and hormones — if it's broken, nothing works", isCorrect: true, order: 1 },
                { answer: "Because gut problems are most common", isCorrect: false, order: 2 },
                { answer: "Because it's easy to test", isCorrect: false, order: 3 },
              ],
            },
          },
          // Q4 - Module 1: Root-Cause Pyramid
          {
            question: "According to the Root-Cause Pyramid, when should you address hormones?",
            questionType: QuestionType.MULTIPLE_CHOICE,
            order: 3,
            points: 1,
            explanation: "The healing order is: Foundations → Gut → Stress → Detox → THEN Hormones. Most people fail because they try to fix hormones first.",
            answers: {
              create: [
                { answer: "First — hormones control everything", isCorrect: false, order: 0 },
                { answer: "AFTER foundations, gut, stress, and detox are addressed", isCorrect: true, order: 1 },
                { answer: "At the same time as gut healing", isCorrect: false, order: 2 },
                { answer: "It doesn't matter what order", isCorrect: false, order: 3 },
              ],
            },
          },
          // Q5 - Module 1: Serotonin
          {
            question: "What percentage of serotonin (your 'happy chemical') is produced in the gut?",
            questionType: QuestionType.MULTIPLE_CHOICE,
            order: 4,
            points: 1,
            explanation: "90% of serotonin is produced in the gut, which explains why gut issues often cause mood problems, anxiety, and depression.",
            answers: {
              create: [
                { answer: "10%", isCorrect: false, order: 0 },
                { answer: "50%", isCorrect: false, order: 1 },
                { answer: "70%", isCorrect: false, order: 2 },
                { answer: "90%", isCorrect: true, order: 3 },
              ],
            },
          },
          // Q6 - Module 2: Michelle's gut findings
          {
            question: "What gut issues did Functional Medicine discover in Michelle's case?",
            questionType: QuestionType.MULTIPLE_CHOICE,
            order: 5,
            points: 1,
            explanation: "Michelle had low stomach acid (food wasn't digesting), SIBO (bacterial overgrowth), and leaky gut (causing inflammation).",
            answers: {
              create: [
                { answer: "Stomach ulcers and acid reflux", isCorrect: false, order: 0 },
                { answer: "Low stomach acid, SIBO, and leaky gut", isCorrect: true, order: 1 },
                { answer: "Celiac disease", isCorrect: false, order: 2 },
                { answer: "Irritable bowel syndrome only", isCorrect: false, order: 3 },
              ],
            },
          },
          // Q7 - Module 2: Michelle's cortisol/stress
          {
            question: "What was causing Michelle's 3am wake-ups, anxiety, and midsection weight?",
            questionType: QuestionType.MULTIPLE_CHOICE,
            order: 6,
            points: 1,
            explanation: "Michelle had cortisol dysregulation with high morning cortisol, 3am spikes, and HPA axis dysfunction — her stress response was stuck.",
            answers: {
              create: [
                { answer: "Eating too late at night", isCorrect: false, order: 0 },
                { answer: "Too much caffeine", isCorrect: false, order: 1 },
                { answer: "Cortisol dysregulation and HPA axis dysfunction", isCorrect: true, order: 2 },
                { answer: "Low blood sugar", isCorrect: false, order: 3 },
              ],
            },
          },
          // Q8 - Module 2: Michelle's results
          {
            question: "What were Michelle's results after 12 weeks of the Functional Medicine protocol?",
            questionType: QuestionType.MULTIPLE_CHOICE,
            order: 7,
            points: 1,
            explanation: "Michelle lost 15 lbs, anxiety reduced 80% (off medication), bloating gone, hair stopped falling out, sleeping through the night.",
            answers: {
              create: [
                { answer: "No improvement — she needed medication", isCorrect: false, order: 0 },
                { answer: "Slight improvement in energy only", isCorrect: false, order: 1 },
                { answer: "Lost 15 lbs, 80% anxiety reduction, no more bloating, sleeping through the night", isCorrect: true, order: 2 },
                { answer: "Symptoms got worse before getting better", isCorrect: false, order: 3 },
              ],
            },
          },
          // Q9 - Module 3: Qualifications
          {
            question: "What does Sarah say about needing a medical background to become a health coach?",
            questionType: QuestionType.MULTIPLE_CHOICE,
            order: 8,
            points: 1,
            explanation: "Sarah says 'Your struggle is your qualification. Your experience is your credibility. Your healing journey is your training ground.'",
            answers: {
              create: [
                { answer: "You must have a nursing or medical degree", isCorrect: false, order: 0 },
                { answer: "You need at least 5 years of healthcare experience", isCorrect: false, order: 1 },
                { answer: "Your lived experience and healing journey ARE your qualifications", isCorrect: true, order: 2 },
                { answer: "Only certified nutritionists can help people", isCorrect: false, order: 3 },
              ],
            },
          },
          // Q10 - Module 3: Being 'fixed'
          {
            question: "According to Sarah, do you need to be completely healthy before helping others?",
            questionType: QuestionType.MULTIPLE_CHOICE,
            order: 9,
            points: 1,
            explanation: "Sarah says 'You don't need to be fixed to help others. You just need to be a few steps ahead — and willing to walk beside them.'",
            answers: {
              create: [
                { answer: "Yes, you must be 100% healed first", isCorrect: false, order: 0 },
                { answer: "No — you just need to be a few steps ahead and willing to walk beside them", isCorrect: true, order: 1 },
                { answer: "Yes, otherwise clients won't trust you", isCorrect: false, order: 2 },
                { answer: "Only if you want to charge for services", isCorrect: false, order: 3 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Created Final Exam with 10 questions!");
  console.log("\nFinal exam seeding complete!");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
