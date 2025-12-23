import prisma from "../src/lib/prisma";

/**
 * Gut Health Practitioner Certification - Full Course Seed
 * 
 * Method: G.U.T.S. (Gather → Understand → Treat → Sustain)
 * 
 * Module 0: Welcome & Introduction
 */

// ============================================
// LESSON CONTENT - MODULE 0: WELCOME
// ============================================

const MODULE_0_LESSONS = [
  {
    title: "Welcome to Your Gut Health Journey",
    order: 0,
    lessonType: "TEXT" as const,
    content: `
<div class="lesson-container">
  <!-- Hero Welcome Section -->
  <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 16px; padding: 40px; margin-bottom: 32px; color: white; text-align: center;">
    <h1 style="font-size: 32px; margin-bottom: 16px; font-weight: 700;">🎉 Welcome, Future Gut Health Practitioner!</h1>
    <p style="font-size: 18px; opacity: 0.9; max-width: 600px; margin: 0 auto;">
      You're about to become a certified expert in one of the most in-demand health specialties. 
      The gut is the root of 80% of chronic conditions - and you'll learn how to heal it.
    </p>
  </div>

  <!-- What You'll Learn Preview -->
  <div style="background: #F0FDF4; border: 2px solid #10B981; border-radius: 16px; padding: 32px; margin-bottom: 32px;">
    <h2 style="color: #059669; margin-bottom: 24px; font-size: 24px;">📚 What You'll Master in This Certification</h2>
    
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
      <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="font-size: 32px; margin-bottom: 12px;">🔬</div>
        <h3 style="color: #1F2937; margin-bottom: 8px;">Microbiome Science</h3>
        <p style="color: #6B7280; font-size: 14px;">Understand the trillions of bacteria that control health and disease.</p>
      </div>
      
      <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="font-size: 32px; margin-bottom: 12px;">🩺</div>
        <h3 style="color: #1F2937; margin-bottom: 8px;">Clinical Assessment</h3>
        <p style="color: #6B7280; font-size: 14px;">Master symptom analysis, lab interpretation, and root cause identification.</p>
      </div>
      
      <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="font-size: 32px; margin-bottom: 12px;">💊</div>
        <h3 style="color: #1F2937; margin-bottom: 8px;">Healing Protocols</h3>
        <p style="color: #6B7280; font-size: 14px;">The 5R Protocol, SIBO treatment, leaky gut repair, and more.</p>
      </div>
      
      <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="font-size: 32px; margin-bottom: 12px;">💰</div>
        <h3 style="color: #1F2937; margin-bottom: 8px;">Practice Building</h3>
        <p style="color: #6B7280; font-size: 14px;">Launch a thriving gut health practice earning $70K-$180K annually.</p>
      </div>
    </div>
  </div>

  <!-- Instructor Introduction -->
  <div style="display: flex; gap: 24px; align-items: center; background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
    <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face" 
         style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #10B981;" />
    <div>
      <h3 style="color: #1F2937; margin-bottom: 8px; font-size: 20px;">Your Lead Instructor</h3>
      <p style="color: #059669; font-weight: 600; margin-bottom: 8px;">Dr. Sarah Mitchell, DCN, CNS, IFMCP</p>
      <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
        Board-certified clinical nutritionist with 15+ years specializing in digestive health. 
        She has helped over 3,000 patients reverse chronic gut conditions.
      </p>
    </div>
  </div>

  <!-- Quick Stats -->
  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px;">
    <div style="background: #ECFDF5; padding: 20px; border-radius: 12px; text-align: center;">
      <div style="font-size: 28px; font-weight: 700; color: #059669;">15</div>
      <div style="font-size: 12px; color: #6B7280;">Modules</div>
    </div>
    <div style="background: #ECFDF5; padding: 20px; border-radius: 12px; text-align: center;">
      <div style="font-size: 28px; font-weight: 700; color: #059669;">60+</div>
      <div style="font-size: 12px; color: #6B7280;">Lessons</div>
    </div>
    <div style="background: #ECFDF5; padding: 20px; border-radius: 12px; text-align: center;">
      <div style="font-size: 28px; font-weight: 700; color: #059669;">15</div>
      <div style="font-size: 12px; color: #6B7280;">Quizzes</div>
    </div>
    <div style="background: #ECFDF5; padding: 20px; border-radius: 12px; text-align: center;">
      <div style="font-size: 28px; font-weight: 700; color: #059669;">3</div>
      <div style="font-size: 12px; color: #6B7280;">Certificates</div>
    </div>
  </div>

  <!-- CTA -->
  <div style="text-align: center; padding: 24px; background: linear-gradient(135deg, #059669 0%, #10B981 100%); border-radius: 16px; color: white;">
    <h3 style="margin-bottom: 12px; font-size: 20px;">Ready to Begin?</h3>
    <p style="opacity: 0.9; margin-bottom: 16px;">Let's start with understanding the G.U.T.S. Method - your framework for gut healing mastery.</p>
    <p style="font-size: 14px; opacity: 0.8;">Click "Mark Complete" and proceed to the next lesson →</p>
  </div>
</div>
    `,
  },
  {
    title: "The G.U.T.S. Method Explained",
    order: 1,
    lessonType: "TEXT" as const,
    content: `
<div class="lesson-container">
  <!-- Method Introduction -->
  <div style="background: linear-gradient(135deg, #10B981 0%, #047857 100%); border-radius: 16px; padding: 40px; margin-bottom: 32px; color: white;">
    <h1 style="font-size: 28px; margin-bottom: 16px; text-align: center;">🔬 The G.U.T.S. Method™</h1>
    <p style="text-align: center; font-size: 18px; opacity: 0.9; max-width: 600px; margin: 0 auto;">
      Your proprietary 4-step framework for assessing and healing any gut condition.
    </p>
  </div>

  <!-- G -->
  <div style="display: flex; gap: 24px; align-items: flex-start; margin-bottom: 24px; background: white; border: 2px solid #10B981; border-radius: 16px; padding: 24px;">
    <div style="flex-shrink: 0; width: 80px; height: 80px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 36px; font-weight: 700;">G</div>
    <div style="flex: 1;">
      <h3 style="color: #059669; font-size: 22px; margin-bottom: 8px;">Gather <span style="color: #6B7280; font-weight: 400; font-size: 16px;">— Comprehensive History</span></h3>
      <p style="color: #4B5563; line-height: 1.7; margin-bottom: 12px;">
        Collect detailed symptom patterns, dietary history, stress levels, medication use, and timeline of health changes.
      </p>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        <span style="background: #ECFDF5; color: #059669; padding: 4px 12px; border-radius: 20px; font-size: 12px;">Intake Forms</span>
        <span style="background: #ECFDF5; color: #059669; padding: 4px 12px; border-radius: 20px; font-size: 12px;">Symptom Mapping</span>
        <span style="background: #ECFDF5; color: #059669; padding: 4px 12px; border-radius: 20px; font-size: 12px;">Timeline Analysis</span>
      </div>
    </div>
  </div>

  <!-- U -->
  <div style="display: flex; gap: 24px; align-items: flex-start; margin-bottom: 24px; background: white; border: 2px solid #10B981; border-radius: 16px; padding: 24px;">
    <div style="flex-shrink: 0; width: 80px; height: 80px; background: linear-gradient(135deg, #059669 0%, #047857 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 36px; font-weight: 700;">U</div>
    <div style="flex: 1;">
      <h3 style="color: #059669; font-size: 22px; margin-bottom: 8px;">Understand <span style="color: #6B7280; font-weight: 400; font-size: 16px;">— Root Cause Analysis</span></h3>
      <p style="color: #4B5563; line-height: 1.7; margin-bottom: 12px;">
        Interpret symptoms and lab results to identify the underlying dysfunction. Is it SIBO? Leaky gut? Dysbiosis?
      </p>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        <span style="background: #ECFDF5; color: #059669; padding: 4px 12px; border-radius: 20px; font-size: 12px;">Lab Interpretation</span>
        <span style="background: #ECFDF5; color: #059669; padding: 4px 12px; border-radius: 20px; font-size: 12px;">Pattern Recognition</span>
      </div>
    </div>
  </div>

  <!-- T -->
  <div style="display: flex; gap: 24px; align-items: flex-start; margin-bottom: 24px; background: white; border: 2px solid #10B981; border-radius: 16px; padding: 24px;">
    <div style="flex-shrink: 0; width: 80px; height: 80px; background: linear-gradient(135deg, #047857 0%, #065F46 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 36px; font-weight: 700;">T</div>
    <div style="flex: 1;">
      <h3 style="color: #059669; font-size: 22px; margin-bottom: 8px;">Treat <span style="color: #6B7280; font-weight: 400; font-size: 16px;">— Personalized Protocols</span></h3>
      <p style="color: #4B5563; line-height: 1.7; margin-bottom: 12px;">
        Design and implement evidence-based healing protocols using the 5R framework.
      </p>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        <span style="background: #ECFDF5; color: #059669; padding: 4px 12px; border-radius: 20px; font-size: 12px;">5R Protocol</span>
        <span style="background: #ECFDF5; color: #059669; padding: 4px 12px; border-radius: 20px; font-size: 12px;">Supplement Protocols</span>
      </div>
    </div>
  </div>

  <!-- S -->
  <div style="display: flex; gap: 24px; align-items: flex-start; margin-bottom: 24px; background: white; border: 2px solid #10B981; border-radius: 16px; padding: 24px;">
    <div style="flex-shrink: 0; width: 80px; height: 80px; background: linear-gradient(135deg, #065F46 0%, #064E3B 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 36px; font-weight: 700;">S</div>
    <div style="flex: 1;">
      <h3 style="color: #059669; font-size: 22px; margin-bottom: 8px;">Sustain <span style="color: #6B7280; font-weight: 400; font-size: 16px;">— Long-Term Maintenance</span></h3>
      <p style="color: #4B5563; line-height: 1.7; margin-bottom: 12px;">
        Create sustainable habits and prevent relapse. Gut healing isn't a one-time fix.
      </p>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        <span style="background: #ECFDF5; color: #059669; padding: 4px 12px; border-radius: 20px; font-size: 12px;">Habit Formation</span>
        <span style="background: #ECFDF5; color: #059669; padding: 4px 12px; border-radius: 20px; font-size: 12px;">Relapse Prevention</span>
      </div>
    </div>
  </div>
</div>
    `,
  },
  {
    title: "How to Succeed in This Course",
    order: 2,
    lessonType: "TEXT" as const,
    content: `
<div class="lesson-container">
  <!-- Success Mindset Header -->
  <div style="background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); border-radius: 16px; padding: 40px; margin-bottom: 32px; color: white; text-align: center;">
    <h1 style="font-size: 28px; margin-bottom: 16px;">🚀 Setting Yourself Up for Success</h1>
    <p style="font-size: 18px; opacity: 0.9; max-width: 600px; margin: 0 auto;">
      Students who follow these guidelines complete 3x faster and score 28% higher on exams.
    </p>
  </div>

  <!-- Success Tips Grid -->
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 32px;">
    <div style="background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px;">
      <div style="width: 48px; height: 48px; background: #EEF2FF; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
        <span style="font-size: 24px;">📅</span>
      </div>
      <h3 style="color: #1F2937; margin-bottom: 8px;">Schedule Dedicated Time</h3>
      <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
        Block 30-45 minutes daily. Most students complete in 6-8 weeks.
      </p>
    </div>

    <div style="background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px;">
      <div style="width: 48px; height: 48px; background: #ECFDF5; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
        <span style="font-size: 24px;">📝</span>
      </div>
      <h3 style="color: #1F2937; margin-bottom: 8px;">Take Notes Actively</h3>
      <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
        Use the built-in notes feature. Writing reinforces learning.
      </p>
    </div>

    <div style="background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px;">
      <div style="width: 48px; height: 48px; background: #FEF3C7; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
        <span style="font-size: 24px;">✅</span>
      </div>
      <h3 style="color: #1F2937; margin-bottom: 8px;">Complete Every Quiz</h3>
      <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
        Unlimited retakes. Aim for 100% before moving on.
      </p>
    </div>

    <div style="background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px;">
      <div style="width: 48px; height: 48px; background: #FCE7F3; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
        <span style="font-size: 24px;">💬</span>
      </div>
      <h3 style="color: #1F2937; margin-bottom: 8px;">Engage in Community</h3>
      <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
        Share insights, ask questions, help fellow students.
      </p>
    </div>
  </div>

  <!-- Ready to Start CTA -->
  <div style="text-align: center; padding: 32px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 16px; color: white;">
    <h3 style="margin-bottom: 12px; font-size: 24px;">🎯 You're Ready!</h3>
    <p style="opacity: 0.9;">Complete this lesson and take the Module 0 Quiz to earn your first badge.</p>
  </div>
</div>
    `,
  },
];

// ============================================
// QUIZ CONTENT - MODULE 0
// ============================================

const MODULE_0_QUIZ = {
  title: "Module 0: Welcome Quiz",
  passingScore: 70,
  questions: [
    {
      question: "What does G.U.T.S. stand for in the G.U.T.S. Method?",
      answers: [
        { answer: "Gut, Understand, Test, Supplement", isCorrect: false },
        { answer: "Gather, Understand, Treat, Sustain", isCorrect: true },
        { answer: "Growth, Unity, Therapy, Success", isCorrect: false },
        { answer: "Gastrointestinal, Upper, Tract, System", isCorrect: false },
      ],
      explanation: "G.U.T.S. stands for Gather (history), Understand (root cause), Treat (protocols), and Sustain (long-term maintenance)."
    },
    {
      question: "What percentage of chronic conditions are estimated to have gut-related roots?",
      answers: [
        { answer: "40%", isCorrect: false },
        { answer: "60%", isCorrect: false },
        { answer: "80%", isCorrect: true },
        { answer: "95%", isCorrect: false },
      ],
      explanation: "Research suggests approximately 80% of chronic conditions have connections to gut health."
    },
    {
      question: "What is the recommended study schedule for optimal completion?",
      answers: [
        { answer: "8 hours once a week", isCorrect: false },
        { answer: "30-45 minutes daily", isCorrect: true },
        { answer: "Study only on weekends", isCorrect: false },
        { answer: "Complete everything in one week", isCorrect: false },
      ],
      explanation: "Consistent daily study sessions lead to better retention than cramming."
    },
    {
      question: "How many modules are in this certification program?",
      answers: [
        { answer: "10 modules", isCorrect: false },
        { answer: "12 modules", isCorrect: false },
        { answer: "15 modules", isCorrect: true },
        { answer: "20 modules", isCorrect: false },
      ],
      explanation: "This certification contains 15 comprehensive modules."
    },
    {
      question: "What is the 'T' step of the G.U.T.S. Method focused on?",
      answers: [
        { answer: "Testing lab results", isCorrect: false },
        { answer: "Personalized treatment protocols", isCorrect: true },
        { answer: "Timeline analysis", isCorrect: false },
        { answer: "Teaching clients", isCorrect: false },
      ],
      explanation: "The Treat step involves designing personalized, evidence-based healing protocols."
    }
  ]
};

// ============================================
// MAIN SEED FUNCTION
// ============================================

async function seedGutHealthCourse() {
  console.log("🌱 Starting Gut Health Course seed...\n");

  // 1. Create the Course
  const course = await prisma.course.upsert({
    where: { slug: "gut-health-practitioner-certification" },
    update: {},
    create: {
      slug: "gut-health-practitioner-certification",
      title: "Certified Gut Health Practitioner",
      description: "Become a certified expert in gut health with our comprehensive 15-module certification. Learn to assess, treat, and support clients with digestive issues using the proprietary G.U.T.S. Method (Gather, Understand, Treat, Sustain). This science-based program covers microbiome science, SIBO, leaky gut, food sensitivities, and practice building.",
      shortDescription: "Master the G.U.T.S. Method™ for healing digestive conditions",
      thumbnail: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800",
      difficulty: "INTERMEDIATE",
      price: 197,
      isFeatured: true,
      isPublished: true,
      duration: 2700, // 45 hours in minutes
      certificateType: "CERTIFICATION",
    },
  });

  console.log(`✅ Course created: ${course.title}`);

  // 2. Create Module 0: Welcome
  const module0 = await prisma.module.create({
    data: {
      courseId: course.id,
      title: "Welcome & Introduction",
      description: "Get started with your gut health certification journey. Learn about the G.U.T.S. Method and how to succeed.",
      order: 0,
      isPublished: true,
    },
  });

  console.log(`✅ Module created: ${module0.title}`);

  // 3. Create Lessons for Module 0
  for (const lessonData of MODULE_0_LESSONS) {
    const lesson = await prisma.lesson.create({
      data: {
        moduleId: module0.id,
        title: lessonData.title,
        content: lessonData.content,
        order: lessonData.order,
        lessonType: lessonData.lessonType,
        isPublished: true,
        isFreePreview: lessonData.order === 0, // First lesson is free preview
      },
    });
    console.log(`  📖 Lesson created: ${lesson.title}`);
  }

  // 4. Create Quiz for Module 0
  const quiz = await prisma.moduleQuiz.create({
    data: {
      moduleId: module0.id,
      title: MODULE_0_QUIZ.title,
      passingScore: MODULE_0_QUIZ.passingScore,
      timeLimit: 15, // 15 minutes
      isPublished: true,
    },
  });

  console.log(`✅ Quiz created: ${quiz.title}`);

  // 5. Create Quiz Questions with Answers
  for (let i = 0; i < MODULE_0_QUIZ.questions.length; i++) {
    const q = MODULE_0_QUIZ.questions[i];

    const question = await prisma.quizQuestion.create({
      data: {
        quizId: quiz.id,
        question: q.question,
        explanation: q.explanation,
        order: i,
        points: 20, // 5 questions * 20 points = 100 total
      },
    });

    // Create answers for this question
    for (let j = 0; j < q.answers.length; j++) {
      const a = q.answers[j];
      await prisma.quizAnswer.create({
        data: {
          questionId: question.id,
          answer: a.answer,
          isCorrect: a.isCorrect,
          order: j,
        },
      });
    }
  }

  console.log(`  ❓ Created ${MODULE_0_QUIZ.questions.length} quiz questions with answers`);

  console.log("\n✅ Gut Health Course Module 0 seeded successfully!");
  console.log(`\n📊 Summary:`);
  console.log(`   - Course: ${course.title}`);
  console.log(`   - Module: ${module0.title}`);
  console.log(`   - Lessons: ${MODULE_0_LESSONS.length}`);
  console.log(`   - Quiz Questions: ${MODULE_0_QUIZ.questions.length}`);
}

// Run the seed
seedGutHealthCourse()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
