import { PrismaClient, QuestionType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Mini Diploma Quizzes...");

  // Find the mini diploma course
  const course = await prisma.course.findFirst({
    where: { slug: "functional-medicine-mini-diploma" },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: true },
      },
    },
  });

  if (!course) {
    console.error("Mini diploma course not found!");
    return;
  }

  console.log(`Found course: ${course.title}`);

  // Delete existing quizzes for this course
  for (const module of course.modules) {
    const existingQuiz = await prisma.moduleQuiz.findFirst({
      where: { moduleId: module.id },
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
      console.log(`Deleted existing quiz for module: ${module.title}`);
    }
  }

  // Module 0: Welcome Quiz (3 questions) - Based on Sarah's story and mini diploma overview
  const module0 = course.modules.find(m => m.order === 0);
  if (module0) {
    await prisma.moduleQuiz.create({
      data: {
        title: "Welcome Check-In",
        description: "Quick reflection on what brought you here",
        moduleId: module0.id,
        passingScore: 60,
        isRequired: false,
        showCorrectAnswers: true,
        questions: {
          create: [
            {
              question: "What was Sarah's profession before discovering Functional Medicine?",
              questionType: QuestionType.MULTIPLE_CHOICE,
              order: 0,
              points: 1,
              explanation: "Sarah worked as an ICU nurse for 12 years before burnout led her to discover Functional Medicine.",
              answers: {
                create: [
                  { answer: "Personal Trainer", isCorrect: false, order: 0 },
                  { answer: "ICU Nurse for 12 years", isCorrect: true, order: 1 },
                  { answer: "Nutritionist", isCorrect: false, order: 2 },
                  { answer: "Yoga Instructor", isCorrect: false, order: 3 },
                ],
              },
            },
            {
              question: "According to Sarah, what did she experience that led her to Functional Medicine?",
              questionType: QuestionType.MULTIPLE_CHOICE,
              order: 1,
              points: 1,
              explanation: "Sarah experienced complete burnout, hormonal collapse, digestive issues, and her doctors told her 'labs are normal.'",
              answers: {
                create: [
                  { answer: "She won the lottery and wanted a career change", isCorrect: false, order: 0 },
                  { answer: "Burnout, collapsed hormones, digestion problems — while doctors said 'labs are normal'", isCorrect: true, order: 1 },
                  { answer: "She was bored with her previous job", isCorrect: false, order: 2 },
                  { answer: "Her family asked her to change careers", isCorrect: false, order: 3 },
                ],
              },
            },
            {
              question: "What does Sarah say about people who discover Functional Medicine?",
              questionType: QuestionType.MULTIPLE_CHOICE,
              order: 2,
              points: 1,
              explanation: "Sarah says 'People don't discover Functional Medicine by accident. They find it when they're ready for healing.'",
              answers: {
                create: [
                  { answer: "They find it randomly through social media", isCorrect: false, order: 0 },
                  { answer: "They discover it by accident", isCorrect: false, order: 1 },
                  { answer: "They find it when they're ready for healing", isCorrect: true, order: 2 },
                  { answer: "Their doctors recommend it", isCorrect: false, order: 3 },
                ],
              },
            },
          ],
        },
      },
    });
    console.log("Created quiz for Module 0: Welcome");
  }

  // Module 1: Root-Cause Framework Quiz (3 questions) - Based on 7 Body Systems and Root-Cause Pyramid
  const module1 = course.modules.find(m => m.order === 1);
  if (module1) {
    await prisma.moduleQuiz.create({
      data: {
        title: "The 7 Body Systems Quiz",
        description: "Test your understanding of the root-cause framework",
        moduleId: module1.id,
        passingScore: 60,
        isRequired: false,
        showCorrectAnswers: true,
        questions: {
          create: [
            {
              question: "According to the 7 Body Systems Model, why do we 'always start with the gut'?",
              questionType: QuestionType.MULTIPLE_CHOICE,
              order: 0,
              points: 1,
              explanation: "The gut controls 70-80% of immunity, 90% of serotonin, nutrient absorption, detox pathways, and hormone processing.",
              answers: {
                create: [
                  { answer: "Because gut issues are the easiest to fix", isCorrect: false, order: 0 },
                  { answer: "Because it controls immunity, serotonin, nutrients, detox, and hormones — everything else depends on it", isCorrect: true, order: 1 },
                  { answer: "Because it's the largest organ", isCorrect: false, order: 2 },
                  { answer: "Because doctors always check it first", isCorrect: false, order: 3 },
                ],
              },
            },
            {
              question: "What percentage of your serotonin ('happy chemical') is produced in your gut?",
              questionType: QuestionType.MULTIPLE_CHOICE,
              order: 1,
              points: 1,
              explanation: "90% of serotonin is produced in the gut, explaining the gut-brain connection.",
              answers: {
                create: [
                  { answer: "10%", isCorrect: false, order: 0 },
                  { answer: "50%", isCorrect: false, order: 1 },
                  { answer: "70%", isCorrect: false, order: 2 },
                  { answer: "90%", isCorrect: true, order: 3 },
                ],
              },
            },
            {
              question: "According to the Root-Cause Pyramid, what is the CORRECT healing order?",
              questionType: QuestionType.MULTIPLE_CHOICE,
              order: 2,
              points: 1,
              explanation: "The correct order is: 1) Foundations, 2) Gut, 3) Stress, 4) Detox, 5) Hormones, 6) Advanced protocols.",
              answers: {
                create: [
                  { answer: "Hormones first, then everything else", isCorrect: false, order: 0 },
                  { answer: "Detox first, then gut, then stress", isCorrect: false, order: 1 },
                  { answer: "Foundations → Gut → Stress → Detox → Hormones", isCorrect: true, order: 2 },
                  { answer: "Start anywhere, order doesn't matter", isCorrect: false, order: 3 },
                ],
              },
            },
          ],
        },
      },
    });
    console.log("Created quiz for Module 1: Root-Cause Framework");
  }

  // Module 2: Case Study Michelle Quiz (3 questions) - Based on actual findings and results
  const module2 = course.modules.find(m => m.order === 2);
  if (module2) {
    await prisma.moduleQuiz.create({
      data: {
        title: "Michelle's Transformation Quiz",
        description: "Test your understanding of how root-cause medicine works",
        moduleId: module2.id,
        passingScore: 60,
        isRequired: false,
        showCorrectAnswers: true,
        questions: {
          create: [
            {
              question: "What did Functional Medicine find was causing Michelle's bloating and food sensitivities?",
              questionType: QuestionType.MULTIPLE_CHOICE,
              order: 0,
              points: 1,
              explanation: "Michelle had low stomach acid, SIBO (bacterial overgrowth), and leaky gut causing her digestive symptoms.",
              answers: {
                create: [
                  { answer: "She was eating too much", isCorrect: false, order: 0 },
                  { answer: "Low stomach acid, SIBO, and leaky gut", isCorrect: true, order: 1 },
                  { answer: "A food allergy to gluten only", isCorrect: false, order: 2 },
                  { answer: "She wasn't exercising enough", isCorrect: false, order: 3 },
                ],
              },
            },
            {
              question: "What was causing Michelle's 3am wake-ups and midsection weight gain?",
              questionType: QuestionType.MULTIPLE_CHOICE,
              order: 1,
              points: 1,
              explanation: "Michelle had cortisol dysregulation — high morning cortisol, 3am spikes, and HPA axis dysfunction.",
              answers: {
                create: [
                  { answer: "Eating too late at night", isCorrect: false, order: 0 },
                  { answer: "Not enough sleep", isCorrect: false, order: 1 },
                  { answer: "Cortisol dysregulation and HPA axis dysfunction", isCorrect: true, order: 2 },
                  { answer: "Drinking too much coffee", isCorrect: false, order: 3 },
                ],
              },
            },
            {
              question: "After 12 weeks, how much did Michelle's anxiety reduce?",
              questionType: QuestionType.MULTIPLE_CHOICE,
              order: 2,
              points: 1,
              explanation: "Michelle's anxiety reduced by 80% and she was able to get off her anxiety medication.",
              answers: {
                create: [
                  { answer: "20%", isCorrect: false, order: 0 },
                  { answer: "50%", isCorrect: false, order: 1 },
                  { answer: "80%", isCorrect: true, order: 2 },
                  { answer: "100%", isCorrect: false, order: 3 },
                ],
              },
            },
          ],
        },
      },
    });
    console.log("Created quiz for Module 2: Case Study Michelle");
  }

  // Module 3: Your Path Forward Quiz (3 questions) - Based on two paths and mindset
  const module3 = course.modules.find(m => m.order === 3);
  if (module3) {
    await prisma.moduleQuiz.create({
      data: {
        title: "Your Path Forward Quiz",
        description: "Reflection on your next steps",
        moduleId: module3.id,
        passingScore: 60,
        isRequired: false,
        showCorrectAnswers: true,
        questions: {
          create: [
            {
              question: "What are the TWO paths forward after completing this Mini Diploma?",
              questionType: QuestionType.MULTIPLE_CHOICE,
              order: 0,
              points: 1,
              explanation: "Path 1: Use this knowledge for personal transformation. Path 2: Become certified to help others heal.",
              answers: {
                create: [
                  { answer: "Buy supplements or see a doctor", isCorrect: false, order: 0 },
                  { answer: "Personal Transformation OR Help Others Heal (become certified)", isCorrect: true, order: 1 },
                  { answer: "Wait and see what happens", isCorrect: false, order: 2 },
                  { answer: "Take another free course", isCorrect: false, order: 3 },
                ],
              },
            },
            {
              question: "What does Sarah say about needing a medical degree to become a health coach?",
              questionType: QuestionType.MULTIPLE_CHOICE,
              order: 1,
              points: 1,
              explanation: "Sarah says 'Your struggle is your qualification. Your experience is your credibility. Your healing journey is your training ground.'",
              answers: {
                create: [
                  { answer: "You absolutely need a nursing or medical degree", isCorrect: false, order: 0 },
                  { answer: "You need at least 5 years of healthcare experience", isCorrect: false, order: 1 },
                  { answer: "Your struggle is your qualification — lived experience matters most", isCorrect: true, order: 2 },
                  { answer: "Only doctors can help with health issues", isCorrect: false, order: 3 },
                ],
              },
            },
            {
              question: "According to Sarah, do you need to be completely 'fixed' before you can help others?",
              questionType: QuestionType.MULTIPLE_CHOICE,
              order: 2,
              points: 1,
              explanation: "Sarah says 'You don't need to be fixed to help others. You just need to be a few steps ahead — and willing to walk beside them.'",
              answers: {
                create: [
                  { answer: "Yes, you must be 100% healthy first", isCorrect: false, order: 0 },
                  { answer: "No — you just need to be a few steps ahead and willing to walk beside them", isCorrect: true, order: 1 },
                  { answer: "Yes, clients won't trust you otherwise", isCorrect: false, order: 2 },
                  { answer: "Only if you have a certification", isCorrect: false, order: 3 },
                ],
              },
            },
          ],
        },
      },
    });
    console.log("Created quiz for Module 3: Your Path Forward");
  }

  console.log("\nAll module quizzes created successfully!");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
