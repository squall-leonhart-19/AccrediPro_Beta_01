import prisma from "../src/lib/prisma";

async function seedFinalExam() {
  const courseSlug = "fm-test";

  // Find the course
  const course = await prisma.course.findFirst({
    where: { slug: courseSlug },
    include: {
      modules: {
        orderBy: { order: "desc" },
        take: 1,
      },
    },
  });

  if (!course) {
    console.error("Course not found:", courseSlug);
    return;
  }

  console.log("Course found:", course.title);

  // Get the highest module order
  const highestOrder = course.modules[0]?.order ?? 0;
  const finalModuleOrder = highestOrder + 1;

  console.log("Creating Final Assessment module at order:", finalModuleOrder);

  // Create the Final Assessment module
  const finalModule = await prisma.module.create({
    data: {
      courseId: course.id,
      title: "Final Assessment",
      description:
        "Complete this comprehensive final exam to earn your course certificate. This exam covers all modules and requires a 70% passing score.",
      order: finalModuleOrder,
      isPublished: true,
    },
  });

  console.log("Created module:", finalModule.title, finalModule.id);

  // Create a single intro lesson
  const introLesson = await prisma.lesson.create({
    data: {
      moduleId: finalModule.id,
      title: "Final Exam Instructions",
      description: "Review the exam guidelines before starting your final assessment.",
      content: `
<h2>Congratulations on reaching the Final Assessment!</h2>

<p>You've completed all the course modules and are now ready to demonstrate your knowledge. This final exam will test your understanding of the key concepts covered throughout the course.</p>

<h3>Exam Guidelines:</h3>

<ul>
  <li><strong>20 Questions</strong> - Multiple choice questions covering all modules</li>
  <li><strong>70% to Pass</strong> - You need at least 14 correct answers</li>
  <li><strong>Unlimited Attempts</strong> - You can retake the exam if needed</li>
  <li><strong>No Time Limit</strong> - Take your time to answer carefully</li>
  <li><strong>Certificate</strong> - Upon passing, you'll receive your official course certificate</li>
</ul>

<h3>Tips for Success:</h3>

<ol>
  <li>Review your notes from each module before starting</li>
  <li>Read each question carefully before selecting your answer</li>
  <li>Trust your knowledge - you've learned a lot!</li>
</ol>

<p>When you're ready, mark this lesson complete and click "Start Final Exam" to begin.</p>

<p><strong>Good luck!</strong></p>
      `.trim(),
      lessonType: "TEXT",
      order: 0,
      isPublished: true,
      isFreePreview: false,
    },
  });

  console.log("Created intro lesson:", introLesson.title);

  // Create the Final Exam quiz with 20 questions
  const finalExamQuiz = await prisma.moduleQuiz.create({
    data: {
      moduleId: finalModule.id,
      title: "Final Certification Exam",
      description:
        "Complete this 20-question exam to earn your course certificate.",
      passingScore: 70, // 70% to pass
      maxAttempts: null, // Unlimited attempts
      timeLimit: null, // No time limit
      isPublished: true,
      isRequired: true,
      showCorrectAnswers: true,
    },
  });

  console.log("Created quiz:", finalExamQuiz.title);

  // 20 sample questions covering functional medicine topics
  const questions = [
    {
      question: "What is the primary focus of Functional Medicine?",
      answers: [
        { answer: "Treating symptoms with medication", isCorrect: false },
        { answer: "Addressing root causes of disease", isCorrect: true },
        { answer: "Performing surgical interventions", isCorrect: false },
        { answer: "Prescribing supplements only", isCorrect: false },
      ],
      explanation: "Functional Medicine focuses on identifying and addressing the root causes of disease rather than just treating symptoms.",
    },
    {
      question: "Which of the following is a key principle of Functional Medicine?",
      answers: [
        { answer: "One-size-fits-all treatment", isCorrect: false },
        { answer: "Patient-centered, individualized care", isCorrect: true },
        { answer: "Quick fixes for chronic conditions", isCorrect: false },
        { answer: "Ignoring patient history", isCorrect: false },
      ],
      explanation: "Functional Medicine emphasizes patient-centered, individualized care tailored to each person's unique needs.",
    },
    {
      question: "What does the Functional Medicine matrix help practitioners understand?",
      answers: [
        { answer: "Only the patient's symptoms", isCorrect: false },
        { answer: "The interconnections between body systems", isCorrect: true },
        { answer: "Insurance billing codes", isCorrect: false },
        { answer: "Medication dosages", isCorrect: false },
      ],
      explanation: "The FM matrix helps visualize how different body systems interconnect and influence each other.",
    },
    {
      question: "Which lifestyle factor is NOT typically addressed in Functional Medicine?",
      answers: [
        { answer: "Nutrition", isCorrect: false },
        { answer: "Sleep", isCorrect: false },
        { answer: "Stock market investments", isCorrect: true },
        { answer: "Stress management", isCorrect: false },
      ],
      explanation: "Functional Medicine addresses lifestyle factors like nutrition, sleep, and stress - not financial matters.",
    },
    {
      question: "What is the gut-brain axis?",
      answers: [
        { answer: "A type of supplement", isCorrect: false },
        { answer: "The bidirectional communication between gut and brain", isCorrect: true },
        { answer: "A surgical procedure", isCorrect: false },
        { answer: "A diagnostic test", isCorrect: false },
      ],
      explanation: "The gut-brain axis refers to the two-way communication between the gastrointestinal tract and the brain.",
    },
    {
      question: "Why is the patient timeline important in Functional Medicine?",
      answers: [
        { answer: "To bill insurance correctly", isCorrect: false },
        { answer: "To understand the progression of health issues over time", isCorrect: true },
        { answer: "To schedule appointments", isCorrect: false },
        { answer: "To order medications", isCorrect: false },
      ],
      explanation: "The timeline helps practitioners understand how a patient's health has evolved and identify key triggering events.",
    },
    {
      question: "What role does inflammation play in chronic disease?",
      answers: [
        { answer: "It has no role", isCorrect: false },
        { answer: "It's always beneficial", isCorrect: false },
        { answer: "Chronic inflammation contributes to many diseases", isCorrect: true },
        { answer: "It only affects joints", isCorrect: false },
      ],
      explanation: "Chronic, low-grade inflammation is recognized as a contributing factor in many chronic diseases.",
    },
    {
      question: "What is 'leaky gut' in Functional Medicine terminology?",
      answers: [
        { answer: "A hole in the stomach", isCorrect: false },
        { answer: "Increased intestinal permeability", isCorrect: true },
        { answer: "Excessive stomach acid", isCorrect: false },
        { answer: "A type of infection", isCorrect: false },
      ],
      explanation: "Leaky gut refers to increased intestinal permeability where the gut lining becomes more porous than normal.",
    },
    {
      question: "Which is a core clinical imbalance in Functional Medicine?",
      answers: [
        { answer: "Height imbalance", isCorrect: false },
        { answer: "Hormonal and neurotransmitter imbalance", isCorrect: true },
        { answer: "Financial imbalance", isCorrect: false },
        { answer: "Calendar imbalance", isCorrect: false },
      ],
      explanation: "Hormonal and neurotransmitter imbalances are one of the seven core clinical imbalances in Functional Medicine.",
    },
    {
      question: "What is the importance of the microbiome in health?",
      answers: [
        { answer: "It has no importance", isCorrect: false },
        { answer: "It only helps with digestion", isCorrect: false },
        { answer: "It influences immune function, mood, and overall health", isCorrect: true },
        { answer: "It's only relevant for skin health", isCorrect: false },
      ],
      explanation: "The microbiome plays crucial roles in immune function, mental health, metabolism, and much more.",
    },
    {
      question: "What is an elimination diet used for in Functional Medicine?",
      answers: [
        { answer: "Weight loss only", isCorrect: false },
        { answer: "Identifying food sensitivities and triggers", isCorrect: true },
        { answer: "Building muscle mass", isCorrect: false },
        { answer: "Increasing appetite", isCorrect: false },
      ],
      explanation: "Elimination diets help identify foods that may be causing adverse reactions or symptoms.",
    },
    {
      question: "How does stress affect the body according to Functional Medicine?",
      answers: [
        { answer: "It only affects mood", isCorrect: false },
        { answer: "It has no physical effects", isCorrect: false },
        { answer: "It can impact multiple body systems including immune and digestive", isCorrect: true },
        { answer: "It only affects sleep", isCorrect: false },
      ],
      explanation: "Chronic stress affects the HPA axis and can impact immune function, digestion, hormones, and more.",
    },
    {
      question: "What is the '5 Rs' protocol in gut health?",
      answers: [
        { answer: "A medication protocol", isCorrect: false },
        { answer: "Remove, Replace, Reinoculate, Repair, Rebalance", isCorrect: true },
        { answer: "A breathing exercise", isCorrect: false },
        { answer: "A billing system", isCorrect: false },
      ],
      explanation: "The 5R protocol (Remove, Replace, Reinoculate, Repair, Rebalance) is a systematic approach to gut restoration.",
    },
    {
      question: "Why is sleep important in Functional Medicine?",
      answers: [
        { answer: "It's only important for energy", isCorrect: false },
        { answer: "Sleep supports healing, hormone regulation, and detoxification", isCorrect: true },
        { answer: "It has minimal health impact", isCorrect: false },
        { answer: "Only children need adequate sleep", isCorrect: false },
      ],
      explanation: "Sleep is crucial for cellular repair, hormone regulation, memory consolidation, and detoxification processes.",
    },
    {
      question: "What is oxidative stress?",
      answers: [
        { answer: "Mental stress from work", isCorrect: false },
        { answer: "Imbalance between free radicals and antioxidants", isCorrect: true },
        { answer: "Exercise-related stress", isCorrect: false },
        { answer: "Financial stress", isCorrect: false },
      ],
      explanation: "Oxidative stress occurs when there's an imbalance between free radical production and antioxidant defenses.",
    },
    {
      question: "How does Functional Medicine view the relationship between genetics and disease?",
      answers: [
        { answer: "Genetics completely determine health outcomes", isCorrect: false },
        { answer: "Genetics play no role in health", isCorrect: false },
        { answer: "Genes load the gun, but lifestyle pulls the trigger", isCorrect: true },
        { answer: "Only rare diseases are genetic", isCorrect: false },
      ],
      explanation: "Functional Medicine recognizes that while genetics create predispositions, lifestyle and environment often determine outcomes.",
    },
    {
      question: "What is the role of mitochondria in health?",
      answers: [
        { answer: "They store vitamins", isCorrect: false },
        { answer: "They produce cellular energy (ATP)", isCorrect: true },
        { answer: "They digest food", isCorrect: false },
        { answer: "They have no important function", isCorrect: false },
      ],
      explanation: "Mitochondria are the powerhouses of cells, producing ATP which is essential for all cellular functions.",
    },
    {
      question: "What is a key difference between Functional Medicine and conventional medicine?",
      answers: [
        { answer: "FM uses only supplements", isCorrect: false },
        { answer: "FM spends more time understanding patient history and root causes", isCorrect: true },
        { answer: "FM doesn't use any tests", isCorrect: false },
        { answer: "FM only treats acute conditions", isCorrect: false },
      ],
      explanation: "Functional Medicine typically involves longer consultations focused on understanding the full patient story and root causes.",
    },
    {
      question: "What are 'modifiable lifestyle factors' in Functional Medicine?",
      answers: [
        { answer: "Age and genetics", isCorrect: false },
        { answer: "Diet, exercise, sleep, stress, and relationships", isCorrect: true },
        { answer: "Blood type and eye color", isCorrect: false },
        { answer: "Height and bone structure", isCorrect: false },
      ],
      explanation: "Modifiable lifestyle factors are things we can change - like diet, exercise, sleep habits, stress management, and social connections.",
    },
    {
      question: "What is the ultimate goal of Functional Medicine treatment?",
      answers: [
        { answer: "Lifelong medication dependence", isCorrect: false },
        { answer: "Quick symptom relief only", isCorrect: false },
        { answer: "Optimal function and vitality through addressing root causes", isCorrect: true },
        { answer: "Avoiding all conventional treatments", isCorrect: false },
      ],
      explanation: "Functional Medicine aims to restore optimal function and vitality by addressing the underlying causes of dysfunction.",
    },
  ];

  // Create questions with answers
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    const question = await prisma.quizQuestion.create({
      data: {
        quizId: finalExamQuiz.id,
        question: q.question,
        questionType: "MULTIPLE_CHOICE",
        order: i,
        points: 1,
        explanation: q.explanation,
      },
    });

    // Create answers
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

    console.log(`Created question ${i + 1}: ${q.question.substring(0, 50)}...`);
  }

  console.log("\n=== Final Exam Setup Complete ===");
  console.log("Module ID:", finalModule.id);
  console.log("Quiz ID:", finalExamQuiz.id);
  console.log("Total Questions:", questions.length);
  console.log("Passing Score: 70%");
}

seedFinalExam()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
