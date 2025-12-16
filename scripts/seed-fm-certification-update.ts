import prisma from "../src/lib/prisma";

/**
 * Seed script to update the main FM Certification course with:
 * 1. Updated module titles and descriptions based on FM-Update content
 * 2. Comprehensive quizzes for each module (5 questions each, 50% pass)
 * 3. Final Exam with 20 questions (70% pass)
 */

const COURSE_SLUG = "functional-medicine-complete-certification";

// Module data based on FM-Update folder structure
const MODULE_DATA = [
  {
    order: 0,
    title: "Module 0: Welcome & Orientation",
    description: "Welcome to your certification journey. Set yourself up for success with our learning roadmap and community.",
  },
  {
    order: 1,
    title: "Module 1: Functional Medicine Foundations",
    description: "Introduction to functional medicine, systems biology, the FM timeline, matrix, and the power of the patient story.",
  },
  {
    order: 2,
    title: "Module 2: Health Coaching Mastery",
    description: "Building trust, active listening, powerful questions, motivational interviewing, OARS, and the stages of change.",
  },
  {
    order: 3,
    title: "Module 3: Clinical Assessment",
    description: "Introduction to clinical assessment, health history intake, and functional medicine diagnostic tools.",
  },
  {
    order: 4,
    title: "Module 4: Professional Practice",
    description: "Ethics, scope of practice, documentation, and professional standards for health coaches.",
  },
  {
    order: 5,
    title: "Module 5: Functional Nutrition",
    description: "Macronutrients, blood sugar balance, anti-inflammatory eating, food sensitivities, and therapeutic diets.",
  },
  {
    order: 6,
    title: "Module 6: Gut Health",
    description: "The microbiome, gut-brain axis, leaky gut, SIBO, IBS, and the 5R protocol.",
  },
  {
    order: 7,
    title: "Module 7: Stress & Adrenal Health",
    description: "Understanding the stress response, HPA axis, cortisol patterns, and adrenal support strategies.",
  },
  {
    order: 8,
    title: "Module 8: Sleep & Circadian Rhythms",
    description: "Sleep architecture, circadian biology, sleep disorders, and sleep optimization protocols.",
  },
  {
    order: 9,
    title: "Module 9: Female Hormone Health",
    description: "The menstrual cycle, estrogen, progesterone, testosterone, and hormone balancing strategies.",
  },
  {
    order: 10,
    title: "Module 10: Perimenopause & Menopause",
    description: "Understanding perimenopause, symptom management, hormone therapy options, and thriving post-menopause.",
  },
  {
    order: 11,
    title: "Module 11: Thyroid Function",
    description: "Thyroid physiology, hypothyroidism, hyperthyroidism, Hashimoto's, and thyroid optimization.",
  },
  {
    order: 12,
    title: "Module 12: Metabolic Health",
    description: "Understanding metabolism, insulin resistance, metabolic syndrome, and weight management.",
  },
  {
    order: 13,
    title: "Module 13: Immune System Function",
    description: "Understanding immunity, autoimmunity, inflammation, and immune modulation strategies.",
  },
  {
    order: 14,
    title: "Module 14: Brain Health & Mood",
    description: "Neurotransmitters, mood disorders, cognitive function, and brain optimization.",
  },
  {
    order: 15,
    title: "Module 15: Cardiovascular Health",
    description: "Understanding CVD risk factors, lipid management, blood pressure, and heart-healthy protocols.",
  },
  {
    order: 16,
    title: "Module 16: Cellular Energy & Mitochondria",
    description: "ATP production, mitochondrial health, fatigue syndromes, and energy optimization.",
  },
  {
    order: 17,
    title: "Module 17: Detoxification & Environmental Toxins",
    description: "Phase I/II detox pathways, environmental toxin exposure, and detox support protocols.",
  },
  {
    order: 18,
    title: "Module 18: Functional Lab Testing",
    description: "Comprehensive lab panels, optimal ranges, GI-MAP, DUTCH, and organic acids testing.",
  },
  {
    order: 19,
    title: "Module 19: Protocol Building",
    description: "Building individualized protocols, supplement selection, and treatment plan development.",
  },
  {
    order: 20,
    title: "Module 20: Practice Building",
    description: "Defining your niche, creating packages, marketing, client enrollment, and sustainable growth.",
  },
  {
    order: 21,
    title: "Final Exam",
    description: "Comprehensive assessment covering all modules. 70% required to pass.",
  },
];

// Comprehensive quiz questions for each module
const MODULE_QUIZZES: Record<number, {
  title: string;
  questions: Array<{
    question: string;
    explanation: string;
    answers: Array<{ answer: string; isCorrect: boolean }>;
  }>;
}> = {
  1: {
    title: "Functional Medicine Foundations Assessment",
    questions: [
      {
        question: "What is the key question that differentiates functional medicine from conventional medicine?",
        explanation: "Functional medicine asks 'Why does this person have these symptoms?' rather than just 'What disease does this person have?'",
        answers: [
          { answer: "Why does this person have these symptoms, and what needs to change?", isCorrect: true },
          { answer: "What medication treats this disease?", isCorrect: false },
          { answer: "Which specialist should this patient see?", isCorrect: false },
          { answer: "What is the diagnostic code for billing?", isCorrect: false },
        ],
      },
      {
        question: "Who founded the Institute for Functional Medicine (IFM) and when?",
        explanation: "Dr. Jeffrey Bland, a nutritional biochemist, founded the IFM in 1991.",
        answers: [
          { answer: "Dr. Jeffrey Bland in 1991", isCorrect: true },
          { answer: "Dr. Mark Hyman in 2005", isCorrect: false },
          { answer: "Dr. Andrew Weil in 1985", isCorrect: false },
          { answer: "Dr. David Perlmutter in 2000", isCorrect: false },
        ],
      },
      {
        question: "What does the ATM framework stand for in functional medicine?",
        explanation: "ATM stands for Antecedents (predisposing factors), Triggers (initiating events), and Mediators (perpetuating factors).",
        answers: [
          { answer: "Antecedents, Triggers, and Mediators", isCorrect: true },
          { answer: "Assessment, Treatment, and Monitoring", isCorrect: false },
          { answer: "Analysis, Testing, and Management", isCorrect: false },
          { answer: "Acute, Transitional, and Maintenance", isCorrect: false },
        ],
      },
      {
        question: "Which of the following is a core principle of functional medicine?",
        explanation: "Biochemical individuality means each person is genetically and biochemically unique, requiring personalized interventions.",
        answers: [
          { answer: "Biochemical individuality - each person requires personalized care", isCorrect: true },
          { answer: "One-size-fits-all treatment protocols", isCorrect: false },
          { answer: "Specialization by organ system only", isCorrect: false },
          { answer: "Symptom suppression as the primary goal", isCorrect: false },
        ],
      },
      {
        question: "Why is the health coach role essential in functional medicine?",
        explanation: "Physicians have limited time and health coaches provide the sustained support that turns treatment plans into actual behavior change.",
        answers: [
          { answer: "To provide sustained support and accountability for behavior change", isCorrect: true },
          { answer: "To replace the physician's diagnostic role", isCorrect: false },
          { answer: "To prescribe supplements and medications", isCorrect: false },
          { answer: "To perform lab testing", isCorrect: false },
        ],
      },
    ],
  },
  2: {
    title: "Health Coaching Mastery Assessment",
    questions: [
      {
        question: "What does OARS stand for in motivational interviewing?",
        explanation: "OARS is a foundational skill set: Open-ended questions, Affirmations, Reflective listening, and Summarizing.",
        answers: [
          { answer: "Open-ended questions, Affirmations, Reflective listening, Summarizing", isCorrect: true },
          { answer: "Observation, Assessment, Recommendations, Solutions", isCorrect: false },
          { answer: "Outcomes, Actions, Results, Strategies", isCorrect: false },
          { answer: "Openness, Acceptance, Respect, Support", isCorrect: false },
        ],
      },
      {
        question: "According to the Stages of Change model, what stage comes after Contemplation?",
        explanation: "The stages are: Precontemplation → Contemplation → Preparation → Action → Maintenance.",
        answers: [
          { answer: "Preparation", isCorrect: true },
          { answer: "Action", isCorrect: false },
          { answer: "Maintenance", isCorrect: false },
          { answer: "Precontemplation", isCorrect: false },
        ],
      },
      {
        question: "What is the primary goal of active listening in health coaching?",
        explanation: "Active listening helps clients feel truly heard and creates space for self-discovery and motivation.",
        answers: [
          { answer: "To help clients feel heard and create space for self-discovery", isCorrect: true },
          { answer: "To gather information for diagnosis", isCorrect: false },
          { answer: "To prepare your next response", isCorrect: false },
          { answer: "To identify problems to fix", isCorrect: false },
        ],
      },
      {
        question: "What makes a coaching question 'powerful'?",
        explanation: "Powerful questions are open-ended, thought-provoking, and help clients explore their own wisdom.",
        answers: [
          { answer: "It's open-ended and helps clients explore their own insights", isCorrect: true },
          { answer: "It can be answered with yes or no", isCorrect: false },
          { answer: "It tells the client what to do", isCorrect: false },
          { answer: "It provides the coach's solution", isCorrect: false },
        ],
      },
      {
        question: "Why is building rapport essential before diving into health recommendations?",
        explanation: "Trust and rapport create psychological safety, making clients more open to change and honest about struggles.",
        answers: [
          { answer: "Trust creates psychological safety for honest communication and openness to change", isCorrect: true },
          { answer: "It's only necessary for billing purposes", isCorrect: false },
          { answer: "Rapport is optional if you have good protocols", isCorrect: false },
          { answer: "It's just a formality before the real work", isCorrect: false },
        ],
      },
    ],
  },
  3: {
    title: "Clinical Assessment Assessment",
    questions: [
      {
        question: "What is the purpose of the Functional Medicine Timeline?",
        explanation: "The timeline reveals when health shifted and what preceded symptoms, connecting life events to health changes.",
        answers: [
          { answer: "To map life events chronologically and identify when health changes occurred", isCorrect: true },
          { answer: "To track medication schedules", isCorrect: false },
          { answer: "To record only childhood illnesses", isCorrect: false },
          { answer: "To document insurance information", isCorrect: false },
        ],
      },
      {
        question: "What does the Functional Medicine Matrix help practitioners do?",
        explanation: "The Matrix organizes symptoms across physiological systems to reveal patterns and connections.",
        answers: [
          { answer: "Organize symptoms across body systems to reveal interconnected patterns", isCorrect: true },
          { answer: "Calculate billing codes", isCorrect: false },
          { answer: "List medications alphabetically", isCorrect: false },
          { answer: "Track appointment schedules", isCorrect: false },
        ],
      },
      {
        question: "Which of the following is NOT typically included in a comprehensive health history intake?",
        explanation: "While many factors are assessed, specific stock portfolio information is not part of health assessment.",
        answers: [
          { answer: "Stock portfolio details", isCorrect: true },
          { answer: "Family medical history", isCorrect: false },
          { answer: "Dietary patterns", isCorrect: false },
          { answer: "Sleep quality", isCorrect: false },
        ],
      },
      {
        question: "What should a health coach do if a client reports symptoms requiring urgent medical attention?",
        explanation: "Coaches must recognize scope of practice and refer urgent symptoms to qualified medical providers.",
        answers: [
          { answer: "Refer immediately to appropriate medical care", isCorrect: true },
          { answer: "Suggest supplements to address the symptoms", isCorrect: false },
          { answer: "Wait to see if symptoms improve on their own", isCorrect: false },
          { answer: "Recommend they try relaxation techniques", isCorrect: false },
        ],
      },
      {
        question: "Why is it important to ask about a client's 'why' during assessment?",
        explanation: "Understanding motivation helps tailor coaching approaches and sustain behavior change.",
        answers: [
          { answer: "It reveals their core motivation which sustains behavior change", isCorrect: true },
          { answer: "It's required for insurance documentation", isCorrect: false },
          { answer: "It helps diagnose their condition", isCorrect: false },
          { answer: "It's just a conversation filler", isCorrect: false },
        ],
      },
    ],
  },
  4: {
    title: "Professional Practice Assessment",
    questions: [
      {
        question: "What is the scope of practice for a health coach?",
        explanation: "Health coaches support lifestyle change and behavior modification, not diagnosis or treatment of disease.",
        answers: [
          { answer: "Supporting lifestyle change and behavior modification within their training", isCorrect: true },
          { answer: "Diagnosing medical conditions", isCorrect: false },
          { answer: "Prescribing medications", isCorrect: false },
          { answer: "Ordering and interpreting lab tests independently", isCorrect: false },
        ],
      },
      {
        question: "Why is documentation important in health coaching practice?",
        explanation: "Documentation protects both coach and client, tracks progress, and maintains professional standards.",
        answers: [
          { answer: "It protects both parties, tracks progress, and maintains professional standards", isCorrect: true },
          { answer: "It's only needed if you plan to be sued", isCorrect: false },
          { answer: "Documentation is optional for wellness professionals", isCorrect: false },
          { answer: "It's only required by insurance companies", isCorrect: false },
        ],
      },
      {
        question: "Which of the following would be OUTSIDE a health coach's scope of practice?",
        explanation: "Diagnosing conditions is a medical act that requires a licensed healthcare provider.",
        answers: [
          { answer: "Diagnosing a client with hypothyroidism", isCorrect: true },
          { answer: "Discussing the importance of thyroid function", isCorrect: false },
          { answer: "Helping a client implement a doctor's thyroid protocol", isCorrect: false },
          { answer: "Educating about thyroid-supportive foods", isCorrect: false },
        ],
      },
      {
        question: "What should a health coach do when working with a client who has a chronic disease?",
        explanation: "Coaches should collaborate with the healthcare team and support the treatment plan.",
        answers: [
          { answer: "Collaborate with the client's healthcare team and support their treatment plan", isCorrect: true },
          { answer: "Replace the physician's recommendations with coaching protocols", isCorrect: false },
          { answer: "Advise the client to stop their medications", isCorrect: false },
          { answer: "Take over primary care responsibilities", isCorrect: false },
        ],
      },
      {
        question: "Which ethical principle requires health coaches to maintain client confidentiality?",
        explanation: "Confidentiality is fundamental to building trust and is an ethical obligation in coaching practice.",
        answers: [
          { answer: "Privacy and confidentiality as part of professional ethics", isCorrect: true },
          { answer: "Marketing requirements", isCorrect: false },
          { answer: "Social media guidelines", isCorrect: false },
          { answer: "Client preference only", isCorrect: false },
        ],
      },
    ],
  },
  5: {
    title: "Functional Nutrition Assessment",
    questions: [
      {
        question: "What are the three macronutrients?",
        explanation: "The three macronutrients are carbohydrates, proteins, and fats - each providing energy and essential functions.",
        answers: [
          { answer: "Carbohydrates, proteins, and fats", isCorrect: true },
          { answer: "Vitamins, minerals, and water", isCorrect: false },
          { answer: "Fiber, cholesterol, and sodium", isCorrect: false },
          { answer: "Glucose, amino acids, and fatty acids", isCorrect: false },
        ],
      },
      {
        question: "What is the primary goal of blood sugar balance?",
        explanation: "Stable blood sugar prevents energy crashes, reduces inflammation, and supports metabolic health.",
        answers: [
          { answer: "Prevent energy crashes, reduce inflammation, and support metabolic health", isCorrect: true },
          { answer: "Eliminate all carbohydrates from the diet", isCorrect: false },
          { answer: "Maximize glucose for brain function", isCorrect: false },
          { answer: "Increase insulin production", isCorrect: false },
        ],
      },
      {
        question: "Which dietary approach is commonly used to identify food sensitivities?",
        explanation: "An elimination diet removes suspected triggers then reintroduces them systematically to identify reactions.",
        answers: [
          { answer: "Elimination diet with systematic reintroduction", isCorrect: true },
          { answer: "Eating everything in moderation", isCorrect: false },
          { answer: "Blood type diet", isCorrect: false },
          { answer: "Random food rotation", isCorrect: false },
        ],
      },
      {
        question: "What are key components of an anti-inflammatory diet?",
        explanation: "Anti-inflammatory eating emphasizes omega-3s, colorful vegetables, and whole foods while limiting processed foods.",
        answers: [
          { answer: "Omega-3 fatty acids, colorful vegetables, whole foods, limited processed foods", isCorrect: true },
          { answer: "High sugar, refined grains, and seed oils", isCorrect: false },
          { answer: "Protein bars and meal replacements", isCorrect: false },
          { answer: "Low-fat processed foods", isCorrect: false },
        ],
      },
      {
        question: "Why is individualized nutrition important in functional medicine?",
        explanation: "Each person has unique genetics, gut microbiome, and health history requiring personalized approaches.",
        answers: [
          { answer: "Each person has unique needs based on genetics, microbiome, and health history", isCorrect: true },
          { answer: "The same diet works for everyone", isCorrect: false },
          { answer: "Nutrition recommendations should be standardized", isCorrect: false },
          { answer: "Individual preferences don't matter for health outcomes", isCorrect: false },
        ],
      },
    ],
  },
  6: {
    title: "Gut Health Assessment",
    questions: [
      {
        question: "What is the gut microbiome?",
        explanation: "The microbiome is the community of trillions of microorganisms living in the digestive tract.",
        answers: [
          { answer: "The community of trillions of microorganisms in the digestive tract", isCorrect: true },
          { answer: "The lining of the stomach only", isCorrect: false },
          { answer: "The enzymes that digest food", isCorrect: false },
          { answer: "The nerve cells in the gut", isCorrect: false },
        ],
      },
      {
        question: "What is 'leaky gut' (intestinal permeability)?",
        explanation: "Leaky gut occurs when the intestinal barrier becomes compromised, allowing substances to pass into bloodstream.",
        answers: [
          { answer: "Compromised intestinal barrier allowing substances to pass into the bloodstream", isCorrect: true },
          { answer: "A hole in the stomach lining", isCorrect: false },
          { answer: "Excessive stomach acid production", isCorrect: false },
          { answer: "Normal digestive function", isCorrect: false },
        ],
      },
      {
        question: "What does SIBO stand for?",
        explanation: "SIBO is Small Intestinal Bacterial Overgrowth - bacteria growing in the wrong location.",
        answers: [
          { answer: "Small Intestinal Bacterial Overgrowth", isCorrect: true },
          { answer: "Stomach Inflammation and Bacterial Overload", isCorrect: false },
          { answer: "Systemic Intestinal Breakdown Occurrence", isCorrect: false },
          { answer: "Small Intestine Bile Obstruction", isCorrect: false },
        ],
      },
      {
        question: "What are the 5Rs of gut restoration?",
        explanation: "The 5R protocol: Remove, Replace, Reinoculate, Repair, and Rebalance.",
        answers: [
          { answer: "Remove, Replace, Reinoculate, Repair, Rebalance", isCorrect: true },
          { answer: "Rest, Recover, Rebuild, Restore, Return", isCorrect: false },
          { answer: "Reduce, Restrict, Replenish, Regulate, Review", isCorrect: false },
          { answer: "Recognize, Remedy, Rehabilitate, Renew, Rethink", isCorrect: false },
        ],
      },
      {
        question: "How does gut health affect the brain (gut-brain axis)?",
        explanation: "The gut produces neurotransmitters, communicates via the vagus nerve, and affects mood and cognition.",
        answers: [
          { answer: "Through neurotransmitter production, vagus nerve signaling, and immune modulation", isCorrect: true },
          { answer: "The gut has no connection to the brain", isCorrect: false },
          { answer: "Only through nutrient absorption", isCorrect: false },
          { answer: "The brain controls the gut with no feedback", isCorrect: false },
        ],
      },
    ],
  },
  7: {
    title: "Stress & Adrenal Health Assessment",
    questions: [
      {
        question: "What is the HPA axis?",
        explanation: "The Hypothalamic-Pituitary-Adrenal axis is the body's central stress response system.",
        answers: [
          { answer: "Hypothalamic-Pituitary-Adrenal axis - the body's central stress response system", isCorrect: true },
          { answer: "Heart-Pancreas-Arteries system", isCorrect: false },
          { answer: "Hormone Production Area", isCorrect: false },
          { answer: "High Performance Activation", isCorrect: false },
        ],
      },
      {
        question: "What happens to cortisol in healthy circadian rhythm?",
        explanation: "Cortisol should be highest in the morning and gradually decline throughout the day.",
        answers: [
          { answer: "Highest in morning, gradually declining through the day", isCorrect: true },
          { answer: "Constant throughout the day", isCorrect: false },
          { answer: "Highest at night for sleep", isCorrect: false },
          { answer: "Peaks randomly based on stress", isCorrect: false },
        ],
      },
      {
        question: "What is 'adrenal fatigue' more accurately called in functional medicine?",
        explanation: "The more accurate term is HPA axis dysfunction, as the adrenals themselves don't 'fatigue.'",
        answers: [
          { answer: "HPA axis dysfunction", isCorrect: true },
          { answer: "Adrenal insufficiency", isCorrect: false },
          { answer: "Addison's disease", isCorrect: false },
          { answer: "Cortisol resistance", isCorrect: false },
        ],
      },
      {
        question: "Which lifestyle factor is most important for supporting healthy stress response?",
        explanation: "Quality sleep is foundational for HPA axis recovery and stress resilience.",
        answers: [
          { answer: "Quality sleep, as it's foundational for HPA axis recovery", isCorrect: true },
          { answer: "Intense daily exercise", isCorrect: false },
          { answer: "Caffeine for energy", isCorrect: false },
          { answer: "Working longer hours", isCorrect: false },
        ],
      },
      {
        question: "How does chronic stress affect other body systems?",
        explanation: "Chronic stress impairs digestion, immunity, hormone balance, and cognitive function.",
        answers: [
          { answer: "Impairs digestion, immunity, hormone balance, and cognitive function", isCorrect: true },
          { answer: "Only affects mental health", isCorrect: false },
          { answer: "Has no effect on physical health", isCorrect: false },
          { answer: "Improves metabolism and energy", isCorrect: false },
        ],
      },
    ],
  },
  8: {
    title: "Sleep & Circadian Rhythms Assessment",
    questions: [
      {
        question: "What is the circadian rhythm?",
        explanation: "The circadian rhythm is the body's internal 24-hour clock regulating sleep-wake cycles and physiology.",
        answers: [
          { answer: "The body's internal 24-hour clock regulating sleep-wake cycles", isCorrect: true },
          { answer: "The heart rate during sleep", isCorrect: false },
          { answer: "The number of sleep cycles per night", isCorrect: false },
          { answer: "The time it takes to fall asleep", isCorrect: false },
        ],
      },
      {
        question: "What are the main stages of sleep?",
        explanation: "Sleep consists of light sleep (N1, N2), deep sleep (N3/slow-wave), and REM sleep.",
        answers: [
          { answer: "Light sleep, deep sleep (slow-wave), and REM sleep", isCorrect: true },
          { answer: "Just deep sleep and light sleep", isCorrect: false },
          { answer: "Conscious and unconscious sleep", isCorrect: false },
          { answer: "Morning sleep and night sleep", isCorrect: false },
        ],
      },
      {
        question: "How does blue light exposure affect sleep?",
        explanation: "Blue light suppresses melatonin production, disrupting the natural sleep-wake cycle.",
        answers: [
          { answer: "It suppresses melatonin production, disrupting the sleep-wake cycle", isCorrect: true },
          { answer: "Blue light improves sleep quality", isCorrect: false },
          { answer: "It has no effect on sleep", isCorrect: false },
          { answer: "It only affects eye health, not sleep", isCorrect: false },
        ],
      },
      {
        question: "What role does melatonin play in sleep?",
        explanation: "Melatonin signals the body that it's time to sleep and helps regulate the sleep-wake cycle.",
        answers: [
          { answer: "It signals the body it's time to sleep and regulates the sleep-wake cycle", isCorrect: true },
          { answer: "It provides energy for sleeping", isCorrect: false },
          { answer: "It only affects dream quality", isCorrect: false },
          { answer: "Melatonin is only important for jet lag", isCorrect: false },
        ],
      },
      {
        question: "Why is consistent sleep timing important?",
        explanation: "Consistent timing reinforces circadian rhythms, improving sleep quality and daytime alertness.",
        answers: [
          { answer: "It reinforces circadian rhythms for better sleep quality and alertness", isCorrect: true },
          { answer: "Only the total hours matter, not timing", isCorrect: false },
          { answer: "Varying sleep times is actually healthier", isCorrect: false },
          { answer: "Consistent timing is only important for children", isCorrect: false },
        ],
      },
    ],
  },
  9: {
    title: "Female Hormone Health Assessment",
    questions: [
      {
        question: "What are the main phases of the menstrual cycle?",
        explanation: "The cycle has four phases: Menstrual, Follicular, Ovulatory, and Luteal.",
        answers: [
          { answer: "Menstrual, Follicular, Ovulatory, and Luteal", isCorrect: true },
          { answer: "Early, Middle, and Late", isCorrect: false },
          { answer: "Growth and Shedding only", isCorrect: false },
          { answer: "Hormone and Non-hormone phases", isCorrect: false },
        ],
      },
      {
        question: "Which hormone is dominant in the follicular phase?",
        explanation: "Estrogen rises and dominates during the follicular phase, preparing for ovulation.",
        answers: [
          { answer: "Estrogen", isCorrect: true },
          { answer: "Progesterone", isCorrect: false },
          { answer: "Testosterone", isCorrect: false },
          { answer: "Cortisol", isCorrect: false },
        ],
      },
      {
        question: "What happens during the luteal phase?",
        explanation: "After ovulation, the corpus luteum produces progesterone to support potential pregnancy.",
        answers: [
          { answer: "The corpus luteum produces progesterone after ovulation", isCorrect: true },
          { answer: "Estrogen reaches its peak levels", isCorrect: false },
          { answer: "Menstruation begins", isCorrect: false },
          { answer: "The follicle matures", isCorrect: false },
        ],
      },
      {
        question: "What is estrogen dominance?",
        explanation: "Estrogen dominance is an imbalance where estrogen is high relative to progesterone.",
        answers: [
          { answer: "An imbalance where estrogen is high relative to progesterone", isCorrect: true },
          { answer: "Having too little estrogen", isCorrect: false },
          { answer: "Normal estrogen levels during ovulation", isCorrect: false },
          { answer: "Estrogen replacement therapy", isCorrect: false },
        ],
      },
      {
        question: "How do lifestyle factors affect hormone balance?",
        explanation: "Diet, stress, sleep, and toxin exposure all significantly impact hormone production and metabolism.",
        answers: [
          { answer: "Diet, stress, sleep, and toxins significantly impact hormone balance", isCorrect: true },
          { answer: "Lifestyle has minimal effect on hormones", isCorrect: false },
          { answer: "Only medications affect hormone levels", isCorrect: false },
          { answer: "Hormones are entirely genetic", isCorrect: false },
        ],
      },
    ],
  },
  10: {
    title: "Perimenopause & Menopause Assessment",
    questions: [
      {
        question: "What is perimenopause?",
        explanation: "Perimenopause is the transitional period before menopause when hormones fluctuate significantly.",
        answers: [
          { answer: "The transitional period before menopause when hormones fluctuate", isCorrect: true },
          { answer: "The first year after menopause", isCorrect: false },
          { answer: "The teenage hormonal transition", isCorrect: false },
          { answer: "A hormone disorder requiring treatment", isCorrect: false },
        ],
      },
      {
        question: "At what average age does menopause occur?",
        explanation: "The average age of menopause is 51, defined as 12 months without a menstrual period.",
        answers: [
          { answer: "Around age 51 (12 months without a period)", isCorrect: true },
          { answer: "Age 40", isCorrect: false },
          { answer: "Age 60", isCorrect: false },
          { answer: "Age 35", isCorrect: false },
        ],
      },
      {
        question: "What are common symptoms of perimenopause?",
        explanation: "Common symptoms include hot flashes, sleep disturbances, mood changes, and irregular periods.",
        answers: [
          { answer: "Hot flashes, sleep disturbances, mood changes, irregular periods", isCorrect: true },
          { answer: "Improved energy and mood stability", isCorrect: false },
          { answer: "Increased fertility", isCorrect: false },
          { answer: "No noticeable symptoms", isCorrect: false },
        ],
      },
      {
        question: "What lifestyle modifications can help manage menopausal symptoms?",
        explanation: "Regular exercise, stress management, optimal nutrition, and good sleep hygiene all help.",
        answers: [
          { answer: "Regular exercise, stress management, optimal nutrition, and sleep hygiene", isCorrect: true },
          { answer: "Avoiding all physical activity", isCorrect: false },
          { answer: "Increasing caffeine and alcohol intake", isCorrect: false },
          { answer: "Lifestyle changes have no effect", isCorrect: false },
        ],
      },
      {
        question: "What is the role of hormone therapy in menopause management?",
        explanation: "HRT can relieve symptoms and protect bone/cardiovascular health when appropriately prescribed.",
        answers: [
          { answer: "To relieve symptoms and potentially protect bone and cardiovascular health", isCorrect: true },
          { answer: "It is always required for all menopausal women", isCorrect: false },
          { answer: "It only treats hot flashes", isCorrect: false },
          { answer: "Hormone therapy is never appropriate", isCorrect: false },
        ],
      },
    ],
  },
  11: {
    title: "Thyroid Function Assessment",
    questions: [
      {
        question: "What hormones does the thyroid produce?",
        explanation: "The thyroid produces T4 (thyroxine) and T3 (triiodothyronine), with T3 being the active form.",
        answers: [
          { answer: "T4 (thyroxine) and T3 (triiodothyronine)", isCorrect: true },
          { answer: "TSH and TRH only", isCorrect: false },
          { answer: "Estrogen and progesterone", isCorrect: false },
          { answer: "Cortisol and adrenaline", isCorrect: false },
        ],
      },
      {
        question: "What is hypothyroidism?",
        explanation: "Hypothyroidism is an underactive thyroid producing insufficient thyroid hormones.",
        answers: [
          { answer: "Underactive thyroid producing insufficient thyroid hormones", isCorrect: true },
          { answer: "Overactive thyroid producing too many hormones", isCorrect: false },
          { answer: "Normal thyroid function", isCorrect: false },
          { answer: "Thyroid inflammation only", isCorrect: false },
        ],
      },
      {
        question: "What is the most common cause of hypothyroidism in developed countries?",
        explanation: "Hashimoto's thyroiditis, an autoimmune condition, is the most common cause.",
        answers: [
          { answer: "Hashimoto's thyroiditis (autoimmune)", isCorrect: true },
          { answer: "Iodine deficiency", isCorrect: false },
          { answer: "Thyroid cancer", isCorrect: false },
          { answer: "Medication side effects", isCorrect: false },
        ],
      },
      {
        question: "Which nutrients are essential for thyroid function?",
        explanation: "Iodine, selenium, zinc, and tyrosine are key nutrients for thyroid hormone production.",
        answers: [
          { answer: "Iodine, selenium, zinc, and tyrosine", isCorrect: true },
          { answer: "Only iodine", isCorrect: false },
          { answer: "Calcium and vitamin D", isCorrect: false },
          { answer: "Iron and vitamin B12 only", isCorrect: false },
        ],
      },
      {
        question: "What is the optimal TSH range in functional medicine?",
        explanation: "Functional medicine often considers optimal TSH to be 1-2 mIU/L rather than just 'normal.'",
        answers: [
          { answer: "1-2 mIU/L is often considered optimal", isCorrect: true },
          { answer: "Anything under 10 is fine", isCorrect: false },
          { answer: "TSH doesn't matter, only T3", isCorrect: false },
          { answer: "There is no optimal range", isCorrect: false },
        ],
      },
    ],
  },
  12: {
    title: "Metabolic Health Assessment",
    questions: [
      {
        question: "What is insulin resistance?",
        explanation: "Insulin resistance is when cells don't respond effectively to insulin, causing blood sugar dysregulation.",
        answers: [
          { answer: "When cells don't respond effectively to insulin, causing blood sugar issues", isCorrect: true },
          { answer: "The inability to produce insulin", isCorrect: false },
          { answer: "Normal metabolic function", isCorrect: false },
          { answer: "Allergic reaction to insulin", isCorrect: false },
        ],
      },
      {
        question: "What are the criteria for metabolic syndrome?",
        explanation: "Metabolic syndrome includes central obesity, high triglycerides, low HDL, high blood pressure, and elevated fasting glucose.",
        answers: [
          { answer: "Central obesity, high triglycerides, low HDL, high BP, elevated fasting glucose", isCorrect: true },
          { answer: "Only high cholesterol", isCorrect: false },
          { answer: "Being overweight by any amount", isCorrect: false },
          { answer: "High blood pressure only", isCorrect: false },
        ],
      },
      {
        question: "How does chronic stress affect metabolism?",
        explanation: "Chronic stress elevates cortisol, which promotes fat storage and insulin resistance.",
        answers: [
          { answer: "Elevates cortisol, promoting fat storage and insulin resistance", isCorrect: true },
          { answer: "Stress improves metabolism", isCorrect: false },
          { answer: "Stress has no metabolic effects", isCorrect: false },
          { answer: "Only acute stress affects metabolism", isCorrect: false },
        ],
      },
      {
        question: "What is the role of muscle mass in metabolic health?",
        explanation: "Muscle is metabolically active tissue that improves insulin sensitivity and glucose disposal.",
        answers: [
          { answer: "Muscle improves insulin sensitivity and glucose disposal", isCorrect: true },
          { answer: "Muscle mass has no effect on metabolism", isCorrect: false },
          { answer: "More muscle means higher blood sugar", isCorrect: false },
          { answer: "Muscle only matters for athletes", isCorrect: false },
        ],
      },
      {
        question: "Which dietary strategy best supports metabolic health?",
        explanation: "Balanced meals with protein, fiber, and healthy fats help stabilize blood sugar.",
        answers: [
          { answer: "Balanced meals with protein, fiber, and healthy fats", isCorrect: true },
          { answer: "Very low calorie diets", isCorrect: false },
          { answer: "High sugar, low fat diet", isCorrect: false },
          { answer: "Eating one meal per day", isCorrect: false },
        ],
      },
    ],
  },
  13: {
    title: "Immune System Function Assessment",
    questions: [
      {
        question: "What is the difference between innate and adaptive immunity?",
        explanation: "Innate immunity is the first-line general defense; adaptive immunity creates specific, targeted responses.",
        answers: [
          { answer: "Innate is first-line general defense; adaptive creates specific targeted responses", isCorrect: true },
          { answer: "They are the same thing", isCorrect: false },
          { answer: "Innate immunity only fights viruses", isCorrect: false },
          { answer: "Adaptive immunity doesn't require previous exposure", isCorrect: false },
        ],
      },
      {
        question: "What is autoimmunity?",
        explanation: "Autoimmunity occurs when the immune system mistakenly attacks the body's own tissues.",
        answers: [
          { answer: "When the immune system mistakenly attacks the body's own tissues", isCorrect: true },
          { answer: "A weakened immune system", isCorrect: false },
          { answer: "Immunity acquired through vaccination", isCorrect: false },
          { answer: "Normal immune function", isCorrect: false },
        ],
      },
      {
        question: "How does gut health affect immunity?",
        explanation: "70-80% of immune cells reside in the gut, making gut health critical for immune function.",
        answers: [
          { answer: "70-80% of immune cells are in the gut, making gut health critical", isCorrect: true },
          { answer: "Gut health has no effect on immunity", isCorrect: false },
          { answer: "Only probiotics affect immunity", isCorrect: false },
          { answer: "The gut only affects digestion", isCorrect: false },
        ],
      },
      {
        question: "What role does chronic inflammation play in disease?",
        explanation: "Chronic low-grade inflammation underlies many chronic diseases including heart disease, diabetes, and autoimmunity.",
        answers: [
          { answer: "It underlies heart disease, diabetes, autoimmunity, and other chronic conditions", isCorrect: true },
          { answer: "Chronic inflammation is always protective", isCorrect: false },
          { answer: "Only acute inflammation causes problems", isCorrect: false },
          { answer: "Inflammation has no role in chronic disease", isCorrect: false },
        ],
      },
      {
        question: "Which lifestyle factors most support immune health?",
        explanation: "Adequate sleep, stress management, whole foods diet, and regular movement support immunity.",
        answers: [
          { answer: "Adequate sleep, stress management, whole foods, and regular movement", isCorrect: true },
          { answer: "High sugar diet and minimal sleep", isCorrect: false },
          { answer: "Avoiding all physical activity", isCorrect: false },
          { answer: "Taking antibiotics preventively", isCorrect: false },
        ],
      },
    ],
  },
  14: {
    title: "Brain Health & Mood Assessment",
    questions: [
      {
        question: "What are the main neurotransmitters that affect mood?",
        explanation: "Serotonin, dopamine, GABA, and norepinephrine are key mood-regulating neurotransmitters.",
        answers: [
          { answer: "Serotonin, dopamine, GABA, and norepinephrine", isCorrect: true },
          { answer: "Only serotonin", isCorrect: false },
          { answer: "Insulin and glucagon", isCorrect: false },
          { answer: "Estrogen and progesterone only", isCorrect: false },
        ],
      },
      {
        question: "Where is most serotonin produced in the body?",
        explanation: "Approximately 90% of serotonin is produced in the gut, highlighting the gut-brain connection.",
        answers: [
          { answer: "In the gut (approximately 90%)", isCorrect: true },
          { answer: "Only in the brain", isCorrect: false },
          { answer: "In the liver", isCorrect: false },
          { answer: "In the heart", isCorrect: false },
        ],
      },
      {
        question: "How does inflammation affect brain function?",
        explanation: "Neuroinflammation impairs neurotransmitter function and is linked to depression and cognitive decline.",
        answers: [
          { answer: "It impairs neurotransmitter function and contributes to depression and cognitive decline", isCorrect: true },
          { answer: "Inflammation improves brain function", isCorrect: false },
          { answer: "The brain is not affected by inflammation", isCorrect: false },
          { answer: "Only traumatic inflammation affects the brain", isCorrect: false },
        ],
      },
      {
        question: "Which nutrients are important for brain health?",
        explanation: "Omega-3s, B vitamins, magnesium, and vitamin D are essential for brain function.",
        answers: [
          { answer: "Omega-3s, B vitamins, magnesium, and vitamin D", isCorrect: true },
          { answer: "Only glucose", isCorrect: false },
          { answer: "Sodium and chloride", isCorrect: false },
          { answer: "Fiber only", isCorrect: false },
        ],
      },
      {
        question: "What is neuroplasticity?",
        explanation: "Neuroplasticity is the brain's ability to form new neural connections and adapt throughout life.",
        answers: [
          { answer: "The brain's ability to form new connections and adapt throughout life", isCorrect: true },
          { answer: "The brain's fixed structure after childhood", isCorrect: false },
          { answer: "Brain deterioration with age", isCorrect: false },
          { answer: "Nerve damage from injury", isCorrect: false },
        ],
      },
    ],
  },
  15: {
    title: "Cardiovascular Health Assessment",
    questions: [
      {
        question: "What are the major risk factors for cardiovascular disease?",
        explanation: "Major risk factors include hypertension, dyslipidemia, diabetes, smoking, obesity, and inflammation.",
        answers: [
          { answer: "Hypertension, dyslipidemia, diabetes, smoking, obesity, and inflammation", isCorrect: true },
          { answer: "Only high cholesterol", isCorrect: false },
          { answer: "Age and genetics only", isCorrect: false },
          { answer: "Diet has no effect", isCorrect: false },
        ],
      },
      {
        question: "What is the functional medicine perspective on cholesterol?",
        explanation: "FM looks at lipid particle size, oxidation, and inflammation rather than just total cholesterol.",
        answers: [
          { answer: "Considers particle size, oxidation, and inflammation, not just total numbers", isCorrect: true },
          { answer: "Only total cholesterol matters", isCorrect: false },
          { answer: "All cholesterol is harmful", isCorrect: false },
          { answer: "Cholesterol is irrelevant to heart health", isCorrect: false },
        ],
      },
      {
        question: "How does chronic stress affect cardiovascular health?",
        explanation: "Chronic stress elevates blood pressure, promotes inflammation, and increases CVD risk.",
        answers: [
          { answer: "Elevates blood pressure, promotes inflammation, and increases CVD risk", isCorrect: true },
          { answer: "Stress protects the heart", isCorrect: false },
          { answer: "Only severe stress affects the heart", isCorrect: false },
          { answer: "Stress has no cardiovascular effects", isCorrect: false },
        ],
      },
      {
        question: "What role does inflammation play in atherosclerosis?",
        explanation: "Chronic inflammation drives the development of arterial plaque formation.",
        answers: [
          { answer: "Chronic inflammation drives arterial plaque formation", isCorrect: true },
          { answer: "Inflammation protects arteries", isCorrect: false },
          { answer: "Only cholesterol causes plaque", isCorrect: false },
          { answer: "Inflammation has no role in atherosclerosis", isCorrect: false },
        ],
      },
      {
        question: "Which dietary approaches best support heart health?",
        explanation: "Mediterranean diet, whole foods, omega-3s, and limiting processed foods support heart health.",
        answers: [
          { answer: "Mediterranean diet, whole foods, omega-3s, limited processed foods", isCorrect: true },
          { answer: "Low-fat processed foods", isCorrect: false },
          { answer: "High sugar diet", isCorrect: false },
          { answer: "Unlimited red meat", isCorrect: false },
        ],
      },
    ],
  },
  16: {
    title: "Cellular Energy & Mitochondria Assessment",
    questions: [
      {
        question: "What are mitochondria?",
        explanation: "Mitochondria are the 'powerhouses' of cells, producing ATP energy through cellular respiration.",
        answers: [
          { answer: "The 'powerhouses' of cells that produce ATP energy", isCorrect: true },
          { answer: "The cell's nucleus", isCorrect: false },
          { answer: "Storage units for fat", isCorrect: false },
          { answer: "Protein factories only", isCorrect: false },
        ],
      },
      {
        question: "What is ATP?",
        explanation: "ATP (adenosine triphosphate) is the primary energy currency of the cell.",
        answers: [
          { answer: "Adenosine triphosphate - the primary energy currency of cells", isCorrect: true },
          { answer: "A type of protein", isCorrect: false },
          { answer: "A hormone", isCorrect: false },
          { answer: "A vitamin", isCorrect: false },
        ],
      },
      {
        question: "What factors damage mitochondria?",
        explanation: "Oxidative stress, toxins, poor nutrition, and chronic inflammation damage mitochondria.",
        answers: [
          { answer: "Oxidative stress, toxins, poor nutrition, and chronic inflammation", isCorrect: true },
          { answer: "Exercise damages mitochondria", isCorrect: false },
          { answer: "Mitochondria cannot be damaged", isCorrect: false },
          { answer: "Only aging affects mitochondria", isCorrect: false },
        ],
      },
      {
        question: "Which nutrients support mitochondrial function?",
        explanation: "CoQ10, B vitamins, magnesium, and alpha-lipoic acid support mitochondrial health.",
        answers: [
          { answer: "CoQ10, B vitamins, magnesium, and alpha-lipoic acid", isCorrect: true },
          { answer: "Only vitamin C", isCorrect: false },
          { answer: "Sodium and chloride", isCorrect: false },
          { answer: "Calcium only", isCorrect: false },
        ],
      },
      {
        question: "How does mitochondrial dysfunction relate to fatigue?",
        explanation: "Impaired mitochondria produce less ATP, directly causing cellular and physical fatigue.",
        answers: [
          { answer: "Impaired mitochondria produce less ATP, causing cellular fatigue", isCorrect: true },
          { answer: "Mitochondria don't affect energy levels", isCorrect: false },
          { answer: "Fatigue is only psychological", isCorrect: false },
          { answer: "Mitochondria only affect muscles", isCorrect: false },
        ],
      },
    ],
  },
  17: {
    title: "Detoxification Assessment",
    questions: [
      {
        question: "What are Phase I and Phase II detoxification?",
        explanation: "Phase I activates toxins (cytochrome P450); Phase II conjugates them for elimination.",
        answers: [
          { answer: "Phase I activates toxins; Phase II conjugates them for elimination", isCorrect: true },
          { answer: "Phase I and II are the same process", isCorrect: false },
          { answer: "Phase I eliminates toxins directly", isCorrect: false },
          { answer: "Only Phase I matters for detox", isCorrect: false },
        ],
      },
      {
        question: "What role does the liver play in detoxification?",
        explanation: "The liver is the primary detoxification organ, processing toxins through both phases.",
        answers: [
          { answer: "It's the primary detox organ, processing toxins through both phases", isCorrect: true },
          { answer: "The liver only produces bile", isCorrect: false },
          { answer: "The kidneys do all detoxification", isCorrect: false },
          { answer: "The liver stores toxins permanently", isCorrect: false },
        ],
      },
      {
        question: "What are common environmental toxins affecting health?",
        explanation: "Heavy metals, pesticides, plastics, and industrial chemicals are common toxin sources.",
        answers: [
          { answer: "Heavy metals, pesticides, plastics, and industrial chemicals", isCorrect: true },
          { answer: "Only lead and mercury", isCorrect: false },
          { answer: "Toxins are not a real concern", isCorrect: false },
          { answer: "Only air pollution matters", isCorrect: false },
        ],
      },
      {
        question: "Which foods support detoxification?",
        explanation: "Cruciferous vegetables, glutathione precursors, and fiber support detox pathways.",
        answers: [
          { answer: "Cruciferous vegetables, glutathione precursors, and fiber", isCorrect: true },
          { answer: "Processed foods and sugar", isCorrect: false },
          { answer: "Only water is needed", isCorrect: false },
          { answer: "Alcohol supports detox", isCorrect: false },
        ],
      },
      {
        question: "What is glutathione's role in detoxification?",
        explanation: "Glutathione is the body's master antioxidant and key Phase II conjugation molecule.",
        answers: [
          { answer: "It's the master antioxidant and key Phase II conjugation molecule", isCorrect: true },
          { answer: "Glutathione is not important for detox", isCorrect: false },
          { answer: "It only protects the skin", isCorrect: false },
          { answer: "Glutathione increases toxin absorption", isCorrect: false },
        ],
      },
    ],
  },
  18: {
    title: "Functional Lab Testing Assessment",
    questions: [
      {
        question: "What is the difference between 'normal' and 'optimal' lab ranges?",
        explanation: "Normal ranges include the average population; optimal ranges reflect ideal health values.",
        answers: [
          { answer: "Normal is the average population; optimal reflects ideal health values", isCorrect: true },
          { answer: "They are the same thing", isCorrect: false },
          { answer: "Optimal is less strict than normal", isCorrect: false },
          { answer: "Only conventional ranges matter", isCorrect: false },
        ],
      },
      {
        question: "What does a GI-MAP test assess?",
        explanation: "GI-MAP assesses gut microbiome composition, pathogens, digestion markers, and inflammation.",
        answers: [
          { answer: "Gut microbiome, pathogens, digestion markers, and inflammation", isCorrect: true },
          { answer: "Only bacteria levels", isCorrect: false },
          { answer: "Stomach acid only", isCorrect: false },
          { answer: "Colon cancer screening", isCorrect: false },
        ],
      },
      {
        question: "What does DUTCH testing measure?",
        explanation: "DUTCH (Dried Urine Test for Comprehensive Hormones) measures hormones and their metabolites.",
        answers: [
          { answer: "Hormones and their metabolites via dried urine", isCorrect: true },
          { answer: "Only estrogen levels", isCorrect: false },
          { answer: "Blood sugar levels", isCorrect: false },
          { answer: "Kidney function", isCorrect: false },
        ],
      },
      {
        question: "When would you use organic acids testing?",
        explanation: "OAT assesses metabolism, nutrient status, neurotransmitters, and detox capacity.",
        answers: [
          { answer: "To assess metabolism, nutrients, neurotransmitters, and detox capacity", isCorrect: true },
          { answer: "Only for food sensitivities", isCorrect: false },
          { answer: "To diagnose cancer", isCorrect: false },
          { answer: "For cardiac assessment only", isCorrect: false },
        ],
      },
      {
        question: "What comprehensive thyroid panel should include?",
        explanation: "Full panel: TSH, free T4, free T3, reverse T3, TPO antibodies, thyroglobulin antibodies.",
        answers: [
          { answer: "TSH, free T4, free T3, reverse T3, TPO and Tg antibodies", isCorrect: true },
          { answer: "TSH only", isCorrect: false },
          { answer: "T4 only", isCorrect: false },
          { answer: "Only antibodies", isCorrect: false },
        ],
      },
    ],
  },
  19: {
    title: "Protocol Building Assessment",
    questions: [
      {
        question: "What is the first step in building a client protocol?",
        explanation: "Comprehensive assessment to understand the whole person and identify root causes.",
        answers: [
          { answer: "Comprehensive assessment to understand the person and identify root causes", isCorrect: true },
          { answer: "Prescribe supplements immediately", isCorrect: false },
          { answer: "Start with the most popular protocol", isCorrect: false },
          { answer: "Copy another client's plan", isCorrect: false },
        ],
      },
      {
        question: "Why is prioritization important in protocol development?",
        explanation: "Addressing too many things at once is overwhelming; prioritization creates sustainable change.",
        answers: [
          { answer: "Too many changes at once is overwhelming; prioritization creates sustainable change", isCorrect: true },
          { answer: "Prioritization doesn't matter", isCorrect: false },
          { answer: "Everything should be fixed at once", isCorrect: false },
          { answer: "Clients prefer no prioritization", isCorrect: false },
        ],
      },
      {
        question: "How should supplement protocols be developed?",
        explanation: "Based on individual assessment, addressing specific deficiencies and imbalances identified.",
        answers: [
          { answer: "Based on individual assessment, addressing specific deficiencies identified", isCorrect: true },
          { answer: "Same supplements for everyone", isCorrect: false },
          { answer: "Whatever is on sale", isCorrect: false },
          { answer: "Maximum doses of everything", isCorrect: false },
        ],
      },
      {
        question: "What role does lifestyle play in protocols?",
        explanation: "Lifestyle is foundational; supplements and other interventions support lifestyle changes.",
        answers: [
          { answer: "Lifestyle is foundational; other interventions support lifestyle changes", isCorrect: true },
          { answer: "Lifestyle is optional", isCorrect: false },
          { answer: "Supplements replace lifestyle changes", isCorrect: false },
          { answer: "Lifestyle only matters for weight loss", isCorrect: false },
        ],
      },
      {
        question: "How often should protocols be reassessed?",
        explanation: "Regular reassessment allows for adjustments based on progress and changing needs.",
        answers: [
          { answer: "Regularly, to adjust based on progress and changing needs", isCorrect: true },
          { answer: "Never, protocols are permanent", isCorrect: false },
          { answer: "Only if the client complains", isCorrect: false },
          { answer: "Once per year maximum", isCorrect: false },
        ],
      },
    ],
  },
  20: {
    title: "Practice Building Assessment",
    questions: [
      {
        question: "Why is defining a niche important for health coaches?",
        explanation: "A niche allows you to become known as an expert and attract ideal clients effectively.",
        answers: [
          { answer: "To become known as an expert and attract ideal clients effectively", isCorrect: true },
          { answer: "To limit potential clients", isCorrect: false },
          { answer: "Niche doesn't matter", isCorrect: false },
          { answer: "To charge less for services", isCorrect: false },
        ],
      },
      {
        question: "What should coaching packages include?",
        explanation: "Packages should include clear deliverables, session frequency, support between sessions, and pricing.",
        answers: [
          { answer: "Clear deliverables, session frequency, support between sessions, and pricing", isCorrect: true },
          { answer: "Only hourly rates", isCorrect: false },
          { answer: "Unlimited everything for one price", isCorrect: false },
          { answer: "Vague promises of results", isCorrect: false },
        ],
      },
      {
        question: "What is the purpose of a discovery call?",
        explanation: "To understand the potential client's needs and determine if there's a good fit.",
        answers: [
          { answer: "To understand client needs and determine if there's mutual fit", isCorrect: true },
          { answer: "To sell as hard as possible", isCorrect: false },
          { answer: "To give away free coaching", isCorrect: false },
          { answer: "Discovery calls aren't necessary", isCorrect: false },
        ],
      },
      {
        question: "How can health coaches build referral networks?",
        explanation: "Through relationships with complementary practitioners and providing excellent client results.",
        answers: [
          { answer: "Through relationships with complementary practitioners and excellent results", isCorrect: true },
          { answer: "Referrals happen automatically", isCorrect: false },
          { answer: "Only paid advertising works", isCorrect: false },
          { answer: "Referral networks aren't important", isCorrect: false },
        ],
      },
      {
        question: "What is essential for sustainable practice growth?",
        explanation: "Systems, boundaries, continuing education, and self-care prevent burnout and enable growth.",
        answers: [
          { answer: "Systems, boundaries, continuing education, and self-care", isCorrect: true },
          { answer: "Working as many hours as possible", isCorrect: false },
          { answer: "Taking every client regardless of fit", isCorrect: false },
          { answer: "Avoiding any business structure", isCorrect: false },
        ],
      },
    ],
  },
};

// Final Exam questions (20 questions covering all modules)
const FINAL_EXAM_QUESTIONS = [
  {
    question: "What is the foundational question that distinguishes functional medicine from conventional medicine?",
    explanation: "Functional medicine asks 'Why does this person have these symptoms?' focusing on root causes.",
    answers: [
      { answer: "Why does this person have these symptoms?", isCorrect: true },
      { answer: "What medication will treat the symptoms?", isCorrect: false },
      { answer: "Which specialist should see this patient?", isCorrect: false },
      { answer: "What is the billing code for this diagnosis?", isCorrect: false },
    ],
  },
  {
    question: "What does the OARS acronym represent in health coaching?",
    explanation: "OARS: Open-ended questions, Affirmations, Reflective listening, Summarizing.",
    answers: [
      { answer: "Open-ended questions, Affirmations, Reflective listening, Summarizing", isCorrect: true },
      { answer: "Observation, Assessment, Recommendations, Solutions", isCorrect: false },
      { answer: "Outcomes, Actions, Results, Strategies", isCorrect: false },
      { answer: "Organization, Analysis, Response, Summary", isCorrect: false },
    ],
  },
  {
    question: "What percentage of the immune system resides in the gut?",
    explanation: "70-80% of immune cells are located in the gut-associated lymphoid tissue.",
    answers: [
      { answer: "70-80%", isCorrect: true },
      { answer: "20-30%", isCorrect: false },
      { answer: "50%", isCorrect: false },
      { answer: "90%", isCorrect: false },
    ],
  },
  {
    question: "What are the 5Rs of the gut restoration protocol?",
    explanation: "Remove, Replace, Reinoculate, Repair, and Rebalance.",
    answers: [
      { answer: "Remove, Replace, Reinoculate, Repair, Rebalance", isCorrect: true },
      { answer: "Rest, Recover, Rebuild, Restore, Return", isCorrect: false },
      { answer: "Recognize, Remedy, Rehabilitate, Renew, Retain", isCorrect: false },
      { answer: "Remove, Reduce, Restore, Rebuild, Review", isCorrect: false },
    ],
  },
  {
    question: "Which hormone should be highest in the morning with a healthy circadian rhythm?",
    explanation: "Cortisol naturally peaks in the morning and should decline throughout the day.",
    answers: [
      { answer: "Cortisol", isCorrect: true },
      { answer: "Melatonin", isCorrect: false },
      { answer: "Insulin", isCorrect: false },
      { answer: "Growth hormone", isCorrect: false },
    ],
  },
  {
    question: "What are the four phases of the menstrual cycle?",
    explanation: "Menstrual, Follicular, Ovulatory, and Luteal phases.",
    answers: [
      { answer: "Menstrual, Follicular, Ovulatory, Luteal", isCorrect: true },
      { answer: "Early, Middle, Late, Final", isCorrect: false },
      { answer: "Growth, Peak, Decline, Rest", isCorrect: false },
      { answer: "Estrogen, Progesterone, LH, FSH", isCorrect: false },
    ],
  },
  {
    question: "What is the most common cause of hypothyroidism in developed countries?",
    explanation: "Hashimoto's thyroiditis, an autoimmune condition affecting the thyroid.",
    answers: [
      { answer: "Hashimoto's thyroiditis (autoimmune)", isCorrect: true },
      { answer: "Iodine deficiency", isCorrect: false },
      { answer: "Thyroid cancer", isCorrect: false },
      { answer: "Viral infection", isCorrect: false },
    ],
  },
  {
    question: "What is insulin resistance?",
    explanation: "When cells don't respond effectively to insulin, leading to blood sugar dysregulation.",
    answers: [
      { answer: "When cells don't respond effectively to insulin", isCorrect: true },
      { answer: "When the pancreas stops producing insulin", isCorrect: false },
      { answer: "An allergy to insulin", isCorrect: false },
      { answer: "Too much insulin production", isCorrect: false },
    ],
  },
  {
    question: "Where is approximately 90% of the body's serotonin produced?",
    explanation: "The gut produces about 90% of the body's serotonin, highlighting the gut-brain connection.",
    answers: [
      { answer: "In the gut", isCorrect: true },
      { answer: "In the brain", isCorrect: false },
      { answer: "In the liver", isCorrect: false },
      { answer: "In the adrenal glands", isCorrect: false },
    ],
  },
  {
    question: "What is the functional medicine perspective on cholesterol assessment?",
    explanation: "Look at particle size, oxidation, and inflammation rather than just total numbers.",
    answers: [
      { answer: "Consider particle size, oxidation, and inflammation, not just totals", isCorrect: true },
      { answer: "Only total cholesterol matters", isCorrect: false },
      { answer: "All cholesterol is harmful", isCorrect: false },
      { answer: "LDL is the only important marker", isCorrect: false },
    ],
  },
  {
    question: "What are mitochondria and their primary function?",
    explanation: "Mitochondria are cellular organelles that produce ATP, the cell's energy currency.",
    answers: [
      { answer: "Cellular 'powerhouses' that produce ATP energy", isCorrect: true },
      { answer: "The cell's nucleus", isCorrect: false },
      { answer: "Protein factories", isCorrect: false },
      { answer: "Fat storage units", isCorrect: false },
    ],
  },
  {
    question: "What are Phase I and Phase II detoxification?",
    explanation: "Phase I activates toxins (via cytochrome P450); Phase II conjugates them for elimination.",
    answers: [
      { answer: "Phase I activates toxins; Phase II conjugates for elimination", isCorrect: true },
      { answer: "Both phases do the same thing", isCorrect: false },
      { answer: "Phase I eliminates toxins directly", isCorrect: false },
      { answer: "Phase II activates toxins", isCorrect: false },
    ],
  },
  {
    question: "What is glutathione's role in the body?",
    explanation: "Glutathione is the body's master antioxidant and key Phase II detox molecule.",
    answers: [
      { answer: "Master antioxidant and key Phase II detoxification molecule", isCorrect: true },
      { answer: "A digestive enzyme", isCorrect: false },
      { answer: "A stress hormone", isCorrect: false },
      { answer: "A neurotransmitter", isCorrect: false },
    ],
  },
  {
    question: "What is the difference between 'normal' and 'optimal' lab ranges?",
    explanation: "Normal ranges represent averages; optimal ranges reflect ideal health values.",
    answers: [
      { answer: "Normal is average population; optimal reflects ideal health", isCorrect: true },
      { answer: "They mean the same thing", isCorrect: false },
      { answer: "Normal is stricter than optimal", isCorrect: false },
      { answer: "Optimal ranges don't exist", isCorrect: false },
    ],
  },
  {
    question: "What does DUTCH testing measure?",
    explanation: "DUTCH (Dried Urine Test for Comprehensive Hormones) measures hormones and metabolites.",
    answers: [
      { answer: "Hormones and their metabolites via dried urine samples", isCorrect: true },
      { answer: "Blood sugar levels", isCorrect: false },
      { answer: "Food sensitivities", isCorrect: false },
      { answer: "Vitamin levels only", isCorrect: false },
    ],
  },
  {
    question: "Why is defining a niche important for health coaching practice?",
    explanation: "A niche helps you become known as an expert and attract ideal clients effectively.",
    answers: [
      { answer: "To become a recognized expert and attract ideal clients", isCorrect: true },
      { answer: "To limit your potential earnings", isCorrect: false },
      { answer: "Niche doesn't matter for success", isCorrect: false },
      { answer: "To exclude clients who need help", isCorrect: false },
    ],
  },
  {
    question: "What is the scope of practice for a certified health coach?",
    explanation: "Health coaches support lifestyle change and behavior modification, not diagnosis or treatment.",
    answers: [
      { answer: "Supporting lifestyle change and behavior modification within training", isCorrect: true },
      { answer: "Diagnosing medical conditions", isCorrect: false },
      { answer: "Prescribing medications", isCorrect: false },
      { answer: "Ordering lab tests independently", isCorrect: false },
    ],
  },
  {
    question: "What characterizes autoimmunity?",
    explanation: "The immune system mistakenly attacks the body's own tissues.",
    answers: [
      { answer: "The immune system attacks the body's own tissues", isCorrect: true },
      { answer: "A weakened immune response", isCorrect: false },
      { answer: "Immunity from vaccines", isCorrect: false },
      { answer: "Enhanced immune function", isCorrect: false },
    ],
  },
  {
    question: "Which nutrients are essential for thyroid function?",
    explanation: "Iodine, selenium, zinc, and tyrosine are key for thyroid hormone production.",
    answers: [
      { answer: "Iodine, selenium, zinc, and tyrosine", isCorrect: true },
      { answer: "Only iodine", isCorrect: false },
      { answer: "Calcium and vitamin D only", isCorrect: false },
      { answer: "Protein only", isCorrect: false },
    ],
  },
  {
    question: "What is the average age of menopause and how is it defined?",
    explanation: "Average age 51, defined as 12 consecutive months without a menstrual period.",
    answers: [
      { answer: "Age 51, defined as 12 months without menstruation", isCorrect: true },
      { answer: "Age 40, defined as hormone decline", isCorrect: false },
      { answer: "Age 60, defined by hot flashes", isCorrect: false },
      { answer: "Age 35, defined by irregular periods", isCorrect: false },
    ],
  },
];

async function seedFMCertificationUpdate() {
  console.log("🌱 Starting FM Certification Update Seed...\n");

  // Find the course
  const course = await prisma.course.findFirst({
    where: { slug: COURSE_SLUG },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          quiz: {
            include: {
              questions: {
                include: { answers: true }
              }
            }
          },
        },
      },
    },
  });

  if (!course) {
    console.error(`❌ Course not found: ${COURSE_SLUG}`);
    process.exit(1);
  }

  console.log(`📚 Found course: ${course.title} (${course.modules.length} modules)\n`);

  // Update module titles and descriptions
  console.log("📝 Updating module titles and descriptions...\n");
  for (const modData of MODULE_DATA) {
    const existingModule = course.modules.find((m) => m.order === modData.order);
    if (existingModule) {
      await prisma.module.update({
        where: { id: existingModule.id },
        data: {
          title: modData.title,
          description: modData.description,
        },
      });
      console.log(`  ✅ Updated Module ${modData.order}: ${modData.title}`);
    } else {
      console.log(`  ⚠️ Module ${modData.order} not found, skipping...`);
    }
  }

  // Create or update quizzes for modules 1-20
  console.log("\n📝 Creating module quizzes (5 questions each, 50% pass)...\n");

  for (const [moduleOrder, quizData] of Object.entries(MODULE_QUIZZES)) {
    const order = parseInt(moduleOrder);
    const existingModule = course.modules.find((m) => m.order === order);

    if (!existingModule) {
      console.log(`  ⚠️ Module ${order} not found, skipping quiz...`);
      continue;
    }

    // Delete existing quiz if present
    if (existingModule.quiz) {
      await prisma.moduleQuiz.delete({
        where: { id: existingModule.quiz.id },
      });
      console.log(`  🗑️ Deleted existing quiz for Module ${order}`);
    }

    // Create new quiz
    await prisma.moduleQuiz.create({
      data: {
        moduleId: existingModule.id,
        title: quizData.title,
        description: `Complete this assessment to earn your certification for ${existingModule.title}`,
        passingScore: 50, // 50% for module quizzes
        maxAttempts: null, // Unlimited attempts
        isRequired: true,
        isPublished: true,
        showCorrectAnswers: true,
        questions: {
          create: quizData.questions.map((q, idx) => ({
            question: q.question,
            explanation: q.explanation,
            questionType: "MULTIPLE_CHOICE",
            order: idx + 1,
            points: 1,
            answers: {
              create: q.answers.map((a, aIdx) => ({
                answer: a.answer,
                isCorrect: a.isCorrect,
                order: aIdx + 1,
              })),
            },
          })),
        },
      },
    });
    console.log(`  ✅ Created quiz for Module ${order}: ${quizData.title}`);
  }

  // Create Final Exam (Module 21)
  console.log("\n📝 Creating Final Exam (20 questions, 70% pass)...\n");

  const finalExamModule = course.modules.find((m) => m.order === 21);
  if (finalExamModule) {
    // Delete existing quiz if present
    if (finalExamModule.quiz) {
      await prisma.moduleQuiz.delete({
        where: { id: finalExamModule.quiz.id },
      });
      console.log("  🗑️ Deleted existing Final Exam");
    }

    // Create Final Exam
    await prisma.moduleQuiz.create({
      data: {
        moduleId: finalExamModule.id,
        title: "Final Certification Exam",
        description: "Comprehensive assessment covering all modules. 70% required to pass and earn your certification.",
        passingScore: 70, // 70% for final exam
        maxAttempts: null, // Unlimited attempts
        isRequired: true,
        isPublished: true,
        showCorrectAnswers: true,
        questions: {
          create: FINAL_EXAM_QUESTIONS.map((q, idx) => ({
            question: q.question,
            explanation: q.explanation,
            questionType: "MULTIPLE_CHOICE",
            order: idx + 1,
            points: 1,
            answers: {
              create: q.answers.map((a, aIdx) => ({
                answer: a.answer,
                isCorrect: a.isCorrect,
                order: aIdx + 1,
              })),
            },
          })),
        },
      },
    });
    console.log("  ✅ Created Final Exam with 20 questions");
  } else {
    console.log("  ⚠️ Final Exam module (order 21) not found!");
  }

  console.log("\n✨ FM Certification Update complete!");
  console.log("  - Updated 22 module titles and descriptions");
  console.log("  - Created 20 module quizzes (5 questions each, 50% pass)");
  console.log("  - Created 1 Final Exam (20 questions, 70% pass)");
}

seedFMCertificationUpdate()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
