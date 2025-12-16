import { PrismaClient, CertificateType, LessonType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const MINI_DIPLOMA_DIR = path.join(process.cwd(), "Mini_Diploma");

async function main() {
  console.log("Seeding NEW Functional Medicine Mini Diploma v2.0...");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

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
    console.log("✓ Created category:", category.name);
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
    include: {
      modules: {
        include: {
          quiz: true,
        },
      },
    },
  });

  if (existingCourse) {
    console.log("⚠ Mini diploma course already exists. Deleting for fresh start...");

    // Delete quizzes first
    for (const mod of existingCourse.modules) {
      if (mod.quiz) {
        await prisma.quizQuestion.deleteMany({ where: { quizId: mod.quiz.id } });
        await prisma.moduleQuiz.delete({ where: { id: mod.quiz.id } });
      }
    }

    await prisma.lesson.deleteMany({
      where: { module: { courseId: existingCourse.id } },
    });
    await prisma.module.deleteMany({
      where: { courseId: existingCourse.id },
    });
    await prisma.course.delete({
      where: { id: existingCourse.id },
    });
    console.log("✓ Deleted existing course data\n");
  }

  // Read HTML content files
  console.log("Loading lesson content files...");

  // Module 1 lessons
  const m1l1Content = fs.readFileSync(path.join(MINI_DIPLOMA_DIR, "M1_L1_Sick_Care_Crisis.html"), "utf-8");
  const m1l2Content = fs.readFileSync(path.join(MINI_DIPLOMA_DIR, "M1_L2_Functional_Medicine.html"), "utf-8");
  const m1l3Content = fs.readFileSync(path.join(MINI_DIPLOMA_DIR, "M1_L3_You_Are_Solution.html"), "utf-8");

  // Module 2 lessons
  const m2l1Content = fs.readFileSync(path.join(MINI_DIPLOMA_DIR, "M2_L1_Meet_Michelle.html"), "utf-8");
  const m2l2Content = fs.readFileSync(path.join(MINI_DIPLOMA_DIR, "M2_L2_Turning_Point.html"), "utf-8");
  const m2l3Content = fs.readFileSync(path.join(MINI_DIPLOMA_DIR, "M2_L3_First_Client_Win.html"), "utf-8");

  // Module 3 lessons
  const m3l1Content = fs.readFileSync(path.join(MINI_DIPLOMA_DIR, "M3_L1_Conventional_Problem.html"), "utf-8");
  const m3l2Content = fs.readFileSync(path.join(MINI_DIPLOMA_DIR, "M3_L2_Functional_Timeline.html"), "utf-8");
  const m3l3Content = fs.readFileSync(path.join(MINI_DIPLOMA_DIR, "M3_L3_Your_Turn.html"), "utf-8");

  console.log("✓ All lesson content loaded\n");

  // Create the course with 3 modules, 3 lessons each
  const course = await prisma.course.create({
    data: {
      title: "Functional Medicine Mini Diploma",
      slug: "functional-medicine-mini-diploma",
      description: "Discover how to escape the broken healthcare system and build a $100k+ practice helping people actually heal — in just 9 lessons. Learn why 40+ women with life experience are the PERFECT candidates for this $5.6 trillion industry.",
      thumbnail: "/images/courses/mini-diploma-thumb.jpg",
      price: 0,
      isPublished: true,
      isFeatured: false,
      certificateType: CertificateType.MINI_DIPLOMA,
      categoryId: category.id,
      coachId: coach?.id,
      modules: {
        create: [
          // MODULE 1: The 'Sick Care' Crisis & Your Second Act
          {
            title: "The 'Sick Care' Crisis & Your Second Act",
            description: "Discover why the healthcare system is failing — and why YOUR life experience is the solution.",
            order: 0,
            isPublished: true,
            lessons: {
              create: [
                {
                  title: "The Sick Care Crisis",
                  description: "Understand 'moral injury' in healthcare, the shocking statistics about chronic disease, and the difference between 'Sick Care' and healthcare.",
                  content: m1l1Content,
                  lessonType: LessonType.TEXT,
                  order: 0,
                  isPublished: true,
                  isFreePreview: true,
                },
                {
                  title: "The Rise of Functional Medicine",
                  description: "Define Functional Medicine and its core principles, learn the 7 Body Systems Model, and understand why root-cause medicine works.",
                  content: m1l2Content,
                  lessonType: LessonType.TEXT,
                  order: 1,
                  isPublished: true,
                  isFreePreview: false,
                },
                {
                  title: "Why YOU Are the Solution",
                  description: "Recognize your life experience as an asset, understand the $5.6 trillion wellness market opportunity, and see the income potential ($100-300/hour).",
                  content: m1l3Content,
                  lessonType: LessonType.TEXT,
                  order: 2,
                  isPublished: true,
                  isFreePreview: false,
                },
              ],
            },
          },
          // MODULE 2: The Proof: Michelle's Story
          {
            title: "The Proof: Michelle's Story",
            description: "Meet a nurse who escaped the system and now earns $144k/year working 3 days a week.",
            order: 1,
            isPublished: true,
            lessons: {
              create: [
                {
                  title: "Meet Michelle",
                  description: "Understand the 'Sunday Night Dread' phenomenon, recognize the signs of burnout in healthcare, and connect emotionally with a relatable story.",
                  content: m2l1Content,
                  lessonType: LessonType.TEXT,
                  order: 0,
                  isPublished: true,
                  isFreePreview: false,
                },
                {
                  title: "The Turning Point",
                  description: "Identify common fears that hold people back, learn how Michelle discovered Functional Medicine, and understand that fears are real but not the truth.",
                  content: m2l2Content,
                  lessonType: LessonType.TEXT,
                  order: 1,
                  isPublished: true,
                  isFreePreview: false,
                },
                {
                  title: "The First Client Win",
                  description: "See a real case study (Susan's migraines), understand Michelle's current income ($96k-$144k), and recognize that this path is replicable.",
                  content: m2l3Content,
                  lessonType: LessonType.TEXT,
                  order: 2,
                  isPublished: true,
                  isFreePreview: false,
                },
              ],
            },
          },
          // MODULE 3: The Education: The Functional Timeline
          {
            title: "The Education: The Functional Timeline",
            description: "Learn the #1 clinical tool that separates root-cause practitioners from symptom-chasers.",
            order: 2,
            isPublished: true,
            lessons: {
              create: [
                {
                  title: "The Problem with Conventional Medicine",
                  description: "Contrast symptom-focused vs story-focused approaches, understand why symptoms are the END of a story, and learn the 'magic question' practitioners ask.",
                  content: m3l1Content,
                  lessonType: LessonType.TEXT,
                  order: 0,
                  isPublished: true,
                  isFreePreview: false,
                },
                {
                  title: "The Functional Timeline",
                  description: "Master the 3 elements: Antecedents, Triggers, Mediators. Apply the framework to Susan's case study and understand how to find root causes.",
                  content: m3l2Content,
                  lessonType: LessonType.TEXT,
                  order: 1,
                  isPublished: true,
                  isFreePreview: false,
                },
                {
                  title: "Your Turn: Create Your Timeline",
                  description: "Create your own Functional Timeline, experience the 'aha moment' of root-cause thinking, and prepare for the final exam.",
                  content: m3l3Content,
                  lessonType: LessonType.TEXT,
                  order: 2,
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
        orderBy: { order: "asc" },
      },
    },
  });

  console.log(`✓ Created course: ${course.title}`);
  console.log(`  Course ID: ${course.id}`);
  console.log(`  Modules: ${course.modules.length}\n`);

  for (const mod of course.modules) {
    console.log(`  📚 ${mod.title}: ${mod.lessons.length} lessons`);
    for (const lesson of mod.lessons) {
      console.log(`     └─ ${lesson.title}`);
    }
  }

  // ============ CREATE MODULE QUIZZES ============
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Creating module quizzes...\n");

  // MODULE 1 QUIZ
  const module1 = course.modules.find(m => m.order === 0)!;
  const quiz1 = await prisma.moduleQuiz.create({
    data: {
      moduleId: module1.id,
      title: "Module 1 Quiz: The Sick Care Crisis",
      description: "Test your understanding of why the healthcare system is failing and why Functional Medicine offers a solution.",
      passingScore: 67,
      isRequired: true,
      isPublished: true,
      showCorrectAnswers: true,
      questions: {
        create: [
          {
            question: "What term describes the emotional harm healthcare workers experience when forced to act against their values within a broken system?",
            explanation: "Moral injury is the clinical term for what happens when you're forced to act against your own values—when you KNOW there's a better way, but the system won't let you pursue it.",
            order: 0,
            points: 1,
            answers: {
              create: [
                { answer: "Compassion fatigue", isCorrect: false, order: 0 },
                { answer: "Burnout syndrome", isCorrect: false, order: 1 },
                { answer: "Moral injury", isCorrect: true, order: 2 },
                { answer: "Clinical depression", isCorrect: false, order: 3 },
              ],
            },
          },
          {
            question: "According to the 7 Body Systems Model, what percentage of your immune system is housed in your gut?",
            explanation: "The gut houses 70-80% of your immune system, which is why Functional Medicine practitioners always start with gut health. Fix the gut, and many other problems often resolve.",
            order: 1,
            points: 1,
            answers: {
              create: [
                { answer: "30-40%", isCorrect: false, order: 0 },
                { answer: "50-60%", isCorrect: false, order: 1 },
                { answer: "70-80%", isCorrect: true, order: 2 },
                { answer: "90-100%", isCorrect: false, order: 3 },
              ],
            },
          },
          {
            question: "The global wellness market is currently valued at approximately how much?",
            explanation: "The wellness industry is a $5.6 trillion global market growing at 10% annually—making it one of the fastest-growing industries in the world. This represents a massive opportunity for trained Functional Medicine practitioners.",
            order: 2,
            points: 1,
            answers: {
              create: [
                { answer: "$1.2 trillion", isCorrect: false, order: 0 },
                { answer: "$3.4 trillion", isCorrect: false, order: 1 },
                { answer: "$5.6 trillion", isCorrect: true, order: 2 },
                { answer: "$8.9 trillion", isCorrect: false, order: 3 },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`✓ Created Quiz 1: ${quiz1.title} (3 questions)`);

  // MODULE 2 QUIZ
  const module2 = course.modules.find(m => m.order === 1)!;
  const quiz2 = await prisma.moduleQuiz.create({
    data: {
      moduleId: module2.id,
      title: "Module 2 Quiz: Michelle's Story",
      description: "Test your understanding of Michelle's transformation and what made her successful.",
      passingScore: 67,
      isRequired: true,
      isPublished: true,
      showCorrectAnswers: true,
      questions: {
        create: [
          {
            question: "What was the recurring weekly experience Michelle described that signaled her unhappiness in nursing?",
            explanation: "Michelle described the 'Sunday Night Dread'—a physical knot in her stomach starting around 4pm on Sundays as she anticipated returning to work. This is a common experience for healthcare workers trapped in broken systems.",
            order: 0,
            points: 1,
            answers: {
              create: [
                { answer: "Monday morning meetings", isCorrect: false, order: 0 },
                { answer: "The Sunday Night Dread", isCorrect: true, order: 1 },
                { answer: "Friday exhaustion", isCorrect: false, order: 2 },
                { answer: "Wednesday burnout", isCorrect: false, order: 3 },
              ],
            },
          },
          {
            question: "What was the key question that Michelle learned to ask clients that conventional doctors typically ignore?",
            explanation: "This 'magic question' is the foundation of the Functional Timeline approach. It shifts focus from current symptoms to the story and triggers that initiated the illness.",
            order: 1,
            points: 1,
            answers: {
              create: [
                { answer: '"What medications are you taking?"', isCorrect: false, order: 0 },
                { answer: '"When was the last time you felt truly healthy—and what happened next?"', isCorrect: true, order: 1 },
                { answer: '"What are your symptoms today?"', isCorrect: false, order: 2 },
                { answer: '"Do you have a family history of this condition?"', isCorrect: false, order: 3 },
              ],
            },
          },
          {
            question: "After becoming a Functional Medicine Practitioner, what is Michelle's approximate annual income range while working only 3 days per week?",
            explanation: "Michelle earns $96,000 - $144,000 per year working only 3 days per week—significantly more than her hospital nursing salary while working half the hours and actually watching her clients get better.",
            order: 2,
            points: 1,
            answers: {
              create: [
                { answer: "$48,000 - $72,000", isCorrect: false, order: 0 },
                { answer: "$72,000 - $84,000", isCorrect: false, order: 1 },
                { answer: "$96,000 - $144,000", isCorrect: true, order: 2 },
                { answer: "$150,000 - $200,000", isCorrect: false, order: 3 },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`✓ Created Quiz 2: ${quiz2.title} (3 questions)`);

  // MODULE 3 QUIZ
  const module3 = course.modules.find(m => m.order === 2)!;
  const quiz3 = await prisma.moduleQuiz.create({
    data: {
      moduleId: module3.id,
      title: "Module 3 Quiz: The Functional Timeline",
      description: "Test your understanding of the Functional Timeline and root-cause thinking.",
      passingScore: 67,
      isRequired: true,
      isPublished: true,
      showCorrectAnswers: true,
      questions: {
        create: [
          {
            question: "What is the fundamental difference between Conventional Medicine and Functional Medicine in their diagnostic approach?",
            explanation: "Conventional medicine focuses on present symptoms in a 7-minute appointment. Functional Medicine asks 'What is your STORY?' to understand the full timeline of events leading to current health issues.",
            order: 0,
            points: 1,
            answers: {
              create: [
                { answer: 'Conventional asks "What is the root cause?" / Functional asks "What are the symptoms?"', isCorrect: false, order: 0 },
                { answer: 'Conventional asks "What are your symptoms right now?" / Functional asks "What is your STORY?"', isCorrect: true, order: 1 },
                { answer: 'Conventional takes 90 minutes / Functional takes 7 minutes', isCorrect: false, order: 2 },
                { answer: 'Conventional is personalized / Functional is one-size-fits-all', isCorrect: false, order: 3 },
              ],
            },
          },
          {
            question: 'In the Functional Timeline, what are "TRIGGERS"?',
            explanation: "Triggers are the 'spark'—the straw that broke the camel's back. Examples include infections, trauma, major life stress, medications (like antibiotics), or hormonal shifts. Finding the trigger reveals the trail to follow.",
            order: 1,
            points: 1,
            answers: {
              create: [
                { answer: "Factors that predispose a person to illness before disease develops", isCorrect: false, order: 0 },
                { answer: "The specific event or exposure that initiated the disease process", isCorrect: true, order: 1 },
                { answer: "Factors that perpetuate the disease and keep you sick", isCorrect: false, order: 2 },
                { answer: "The current symptoms the patient is experiencing", isCorrect: false, order: 3 },
              ],
            },
          },
          {
            question: "In Susan's case study, what combination of events in 2015 triggered her chronic migraines?",
            explanation: "Susan's migraines began in 2015 when her mother passed away (major grief/stress) and she took three rounds of antibiotics for sinus infections. The grief suppressed immunity while the antibiotics destroyed gut microbiome—together creating chronic inflammation that manifested as migraines.",
            order: 2,
            points: 1,
            answers: {
              create: [
                { answer: "Car accident + surgery", isCorrect: false, order: 0 },
                { answer: "Job loss + moving to a new city", isCorrect: false, order: 1 },
                { answer: "Mother's death (grief) + multiple rounds of antibiotics", isCorrect: true, order: 2 },
                { answer: "Pregnancy + hormonal changes", isCorrect: false, order: 3 },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`✓ Created Quiz 3: ${quiz3.title} (3 questions)`);

  // ============ CREATE FINAL EXAM ============
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Creating Final Exam...\n");

  // Create a special "Final Exam" module
  const finalExamModule = await prisma.module.create({
    data: {
      courseId: course.id,
      title: "Final Exam",
      description: "Complete the final exam to earn your Mini Diploma certificate. You need 70% (7/10) to pass.",
      order: 3,
      isPublished: true,
      lessons: {
        create: [
          {
            title: "Mini Diploma Final Exam",
            description: "Answer all 10 questions to test your understanding and unlock your Mini Diploma certificate.",
            content: "<div style='padding: 20px; text-align: center;'><h2>Ready for your Final Exam?</h2><p>Complete the quiz below to earn your Mini Diploma certificate.</p></div>",
            lessonType: LessonType.TEXT,
            order: 0,
            isPublished: true,
            isFreePreview: false,
          },
        ],
      },
    },
  });

  const finalExam = await prisma.moduleQuiz.create({
    data: {
      moduleId: finalExamModule.id,
      title: "Mini Diploma Final Exam",
      description: "Answer all 10 questions. You need 70% (7/10) to pass and earn your Mini Diploma certificate.",
      passingScore: 70,
      isRequired: true,
      isPublished: true,
      showCorrectAnswers: true,
      questions: {
        create: [
          // Question 1
          {
            question: "What percentage of Americans currently have at least one chronic disease?",
            explanation: "60% of Americans have at least one chronic disease, and 40% have two or more. This epidemic is driven by a healthcare system designed for acute care, not chronic disease management.",
            order: 0,
            points: 1,
            answers: {
              create: [
                { answer: "40%", isCorrect: false, order: 0 },
                { answer: "50%", isCorrect: false, order: 1 },
                { answer: "60%", isCorrect: true, order: 2 },
                { answer: "70%", isCorrect: false, order: 3 },
              ],
            },
          },
          // Question 2
          {
            question: 'In Functional Medicine, what does "Sick Care" refer to?',
            explanation: '"Sick Care" is the term used to describe the conventional medical model that asks "what are your symptoms?" and prescribes treatments to suppress those symptoms—without ever asking "why" the person is unwell.',
            order: 1,
            points: 1,
            answers: {
              create: [
                { answer: "Emergency room treatment", isCorrect: false, order: 0 },
                { answer: "Traditional medicine that suppresses symptoms without addressing root causes", isCorrect: true, order: 1 },
                { answer: "Care for terminally ill patients", isCorrect: false, order: 2 },
                { answer: "Preventive health screenings", isCorrect: false, order: 3 },
              ],
            },
          },
          // Question 3
          {
            question: 'Which body system produces 90% of your serotonin (the "happiness" chemical)?',
            explanation: "The gut produces 90% of your serotonin and houses 70-80% of your immune system. This is why Functional Medicine always starts with gut health—it's the foundation of both mental and physical wellbeing.",
            order: 2,
            points: 1,
            answers: {
              create: [
                { answer: "Brain", isCorrect: false, order: 0 },
                { answer: "Gut", isCorrect: true, order: 1 },
                { answer: "Adrenal glands", isCorrect: false, order: 2 },
                { answer: "Thyroid", isCorrect: false, order: 3 },
              ],
            },
          },
          // Question 4
          {
            question: "How many patients did Michelle typically see per shift as a hospital nurse?",
            explanation: "Michelle described seeing 30 patients per shift, with only 7 minutes (sometimes 5) per person. This impossible patient load is a key driver of moral injury in healthcare workers.",
            order: 3,
            points: 1,
            answers: {
              create: [
                { answer: "10 patients", isCorrect: false, order: 0 },
                { answer: "20 patients", isCorrect: false, order: 1 },
                { answer: "30 patients", isCorrect: true, order: 2 },
                { answer: "40 patients", isCorrect: false, order: 3 },
              ],
            },
          },
          // Question 5
          {
            question: "What was the root cause of Susan's 10-year migraine condition?",
            explanation: "Susan's migraines weren't a 'brain problem'—they were the end result of systemic inflammation triggered by her mother's death (grief/stress) combined with antibiotics destroying her gut microbiome.",
            order: 4,
            points: 1,
            answers: {
              create: [
                { answer: "Genetic predisposition to migraines", isCorrect: false, order: 0 },
                { answer: "Chronic inflammation from grief-induced stress and antibiotic-damaged gut", isCorrect: true, order: 1 },
                { answer: "Undiagnosed brain tumor", isCorrect: false, order: 2 },
                { answer: "Caffeine addiction", isCorrect: false, order: 3 },
              ],
            },
          },
          // Question 6
          {
            question: "How long did it take for Susan to experience significant improvement in her migraines after working with Michelle?",
            explanation: 'Three weeks after starting Michelle\'s protocol (gut repair, stress support, anti-inflammatory nutrition), Susan texted: "I haven\'t had a headache in 7 days." This demonstrated the power of addressing root causes.',
            order: 5,
            points: 1,
            answers: {
              create: [
                { answer: "1 week", isCorrect: false, order: 0 },
                { answer: "3 weeks", isCorrect: true, order: 1 },
                { answer: "3 months", isCorrect: false, order: 2 },
                { answer: "6 months", isCorrect: false, order: 3 },
              ],
            },
          },
          // Question 7
          {
            question: "What are the three key elements of the Functional Timeline?",
            explanation: "The Functional Timeline organizes health history into Antecedents (predisposing factors), Triggers (the spark that initiated illness), and Mediators (factors that perpetuate the disease). This framework reveals connections invisible to symptom-focused medicine.",
            order: 6,
            points: 1,
            answers: {
              create: [
                { answer: "Symptoms, Labs, Diagnosis", isCorrect: false, order: 0 },
                { answer: "Antecedents, Triggers, Mediators", isCorrect: true, order: 1 },
                { answer: "Past, Present, Future", isCorrect: false, order: 2 },
                { answer: "Genetics, Environment, Lifestyle", isCorrect: false, order: 3 },
              ],
            },
          },
          // Question 8
          {
            question: 'What are "Mediators" in the Functional Timeline framework?',
            explanation: 'Mediators are the "logs on the fire"—factors like poor diet, chronic stress, inadequate sleep, or toxin exposure that keep the disease process active even after the trigger is gone. Remove them, and the body can finally heal.',
            order: 7,
            points: 1,
            answers: {
              create: [
                { answer: "Genetic predispositions inherited from parents", isCorrect: false, order: 0 },
                { answer: "The specific event that initiated the disease", isCorrect: false, order: 1 },
                { answer: "Factors that perpetuate the disease and keep you sick", isCorrect: true, order: 2 },
                { answer: "Medications prescribed by doctors", isCorrect: false, order: 3 },
              ],
            },
          },
          // Question 9
          {
            question: "What is the typical hourly rate range for trained Functional Medicine practitioners?",
            explanation: "Trained Functional Medicine practitioners typically charge $100-300/hour, with 3-month programs ranging from $1,000-$3,000+. This represents a significant income opportunity while working fewer hours than traditional healthcare roles.",
            order: 8,
            points: 1,
            answers: {
              create: [
                { answer: "$25-50/hour", isCorrect: false, order: 0 },
                { answer: "$50-75/hour", isCorrect: false, order: 1 },
                { answer: "$100-300/hour", isCorrect: true, order: 2 },
                { answer: "$400-600/hour", isCorrect: false, order: 3 },
              ],
            },
          },
          // Question 10
          {
            question: 'What is the "magic question" that forms the foundation of the Functional Timeline approach?',
            explanation: "This question shifts the focus from current symptoms to the patient's full health story. It helps identify the trigger that initiated the illness and reveals the timeline of events conventional medicine ignores.",
            order: 9,
            points: 1,
            answers: {
              create: [
                { answer: '"What medications are you currently taking?"', isCorrect: false, order: 0 },
                { answer: '"What are your symptoms today?"', isCorrect: false, order: 1 },
                { answer: '"When was the last time you felt truly healthy—and what happened next?"', isCorrect: true, order: 2 },
                { answer: '"Do you have health insurance?"', isCorrect: false, order: 3 },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`✓ Created Final Exam: ${finalExam.title} (10 questions, 70% to pass)\n`);

  // ============ AUTO-ENROLL EXISTING USERS ============
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Auto-enrolling users...\n");

  const usersWithMiniDiploma = await prisma.user.findMany({
    where: {
      miniDiplomaCategory: "functional-medicine",
    },
  });

  console.log(`Found ${usersWithMiniDiploma.length} users with functional-medicine mini diploma access`);

  for (const user of usersWithMiniDiploma) {
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
      console.log(`  ✓ Enrolled: ${user.firstName} ${user.lastName} (${user.email})`);
    } else {
      console.log(`  ⏭ Already enrolled: ${user.firstName} ${user.lastName}`);
    }
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ Mini Diploma v2.0 seeding complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("Summary:");
  console.log(`  📚 3 Modules with 3 lessons each (9 total lessons)`);
  console.log(`  📝 3 Module Quizzes (3 questions each, 67% to pass)`);
  console.log(`  🎓 1 Final Exam (10 questions, 70% to pass)`);
  console.log(`  👥 ${usersWithMiniDiploma.length} users auto-enrolled\n`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
