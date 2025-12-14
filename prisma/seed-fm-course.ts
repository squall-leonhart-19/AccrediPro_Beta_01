import { PrismaClient, Difficulty, CertificateType, LessonType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// 21 Modules for comprehensive Functional Medicine Certification
const FM_MODULES = [
  {
    title: 'Module 1: Introduction to Functional Medicine',
    description: 'Understand the core philosophy and principles of functional medicine',
    lessons: [
      { title: 'Welcome & Program Overview', desc: 'Your journey to becoming a certified practitioner', duration: 600, free: true },
      { title: 'The Functional Medicine Model', desc: 'Understanding the systems-based approach', duration: 900 },
      { title: 'Functional vs Conventional Medicine', desc: 'Key differences and when to integrate both', duration: 720 },
      { title: 'The Patient-Practitioner Partnership', desc: 'Building therapeutic relationships', duration: 600 },
    ]
  },
  {
    title: 'Module 2: The 5 Root Causes of Disease',
    description: 'Master the five underlying causes of chronic conditions',
    lessons: [
      { title: 'Root Cause #1: Inflammation', desc: 'Silent inflammation and chronic disease', duration: 1080 },
      { title: 'Root Cause #2: Toxicity', desc: 'Environmental toxins and detoxification', duration: 960 },
      { title: 'Root Cause #3: Infections', desc: 'Hidden infections and immune burden', duration: 900 },
      { title: 'Root Cause #4: Stress Response', desc: 'HPA axis dysfunction and chronic stress', duration: 840 },
      { title: 'Root Cause #5: Nutritional Deficiencies', desc: 'Micronutrient insufficiencies', duration: 780 },
    ]
  },
  {
    title: 'Module 3: Patient Assessment & Timeline',
    description: 'Comprehensive patient evaluation techniques',
    lessons: [
      { title: 'The Functional Medicine Matrix', desc: 'Using the FM matrix for assessment', duration: 1200 },
      { title: 'Creating Patient Timelines', desc: 'Mapping health history chronologically', duration: 900 },
      { title: 'Intake Forms & Questionnaires', desc: 'Essential assessment tools', duration: 720 },
      { title: 'The Discovery Consultation', desc: 'Conducting effective first appointments', duration: 840 },
    ]
  },
  {
    title: 'Module 4: The Gut-Brain Connection',
    description: 'Understanding the microbiome and mental health link',
    lessons: [
      { title: 'The Gut Microbiome', desc: 'Introduction to gut flora and diversity', duration: 1080 },
      { title: 'Leaky Gut Syndrome', desc: 'Intestinal permeability explained', duration: 960 },
      { title: 'The Vagus Nerve Connection', desc: 'How gut health affects mood', duration: 900 },
      { title: 'Gut-Brain Protocols', desc: 'Healing the gut to heal the mind', duration: 1020 },
    ]
  },
  {
    title: 'Module 5: Digestive Health',
    description: 'Mastering GI assessment and treatment',
    lessons: [
      { title: 'Upper GI Function', desc: 'Stomach acid, enzymes, and digestion', duration: 960 },
      { title: 'Small Intestine Health', desc: 'SIBO, malabsorption, and leaky gut', duration: 1080 },
      { title: 'Large Intestine & Colon Health', desc: 'Constipation, IBS, and microbiome balance', duration: 900 },
      { title: 'The 5R Protocol', desc: 'Remove, Replace, Reinoculate, Repair, Rebalance', duration: 1200 },
    ]
  },
  {
    title: 'Module 6: Hormonal Balance',
    description: 'Comprehensive endocrine system understanding',
    lessons: [
      { title: 'Thyroid Dysfunction', desc: 'Hypothyroid, hyperthyroid, and Hashimoto\'s', duration: 1200 },
      { title: 'Adrenal Health', desc: 'Adrenal fatigue and HPA axis dysregulation', duration: 1080 },
      { title: 'Female Hormone Balance', desc: 'Estrogen, progesterone, and menstrual health', duration: 1140 },
      { title: 'Male Hormone Optimization', desc: 'Testosterone and male vitality', duration: 900 },
    ]
  },
  {
    title: 'Module 7: Metabolic Health',
    description: 'Blood sugar, weight, and energy optimization',
    lessons: [
      { title: 'Insulin Resistance', desc: 'The metabolic root of modern disease', duration: 1080 },
      { title: 'Metabolic Syndrome', desc: 'Assessment and reversal protocols', duration: 960 },
      { title: 'Weight Management', desc: 'Beyond calories: hormones and metabolism', duration: 840 },
      { title: 'Energy Production', desc: 'Mitochondrial function and fatigue', duration: 900 },
    ]
  },
  {
    title: 'Module 8: Immune System Function',
    description: 'Understanding immunity and autoimmunity',
    lessons: [
      { title: 'Immune System Basics', desc: 'Innate vs adaptive immunity', duration: 900 },
      { title: 'Autoimmune Conditions', desc: 'Why the body attacks itself', duration: 1200 },
      { title: 'Immune Modulation', desc: 'Balancing rather than boosting immunity', duration: 1020 },
      { title: 'Autoimmune Protocols', desc: 'AIP and elimination strategies', duration: 1080 },
    ]
  },
  {
    title: 'Module 9: Detoxification Pathways',
    description: 'Supporting the body\'s natural detox systems',
    lessons: [
      { title: 'Phase 1 & 2 Liver Detox', desc: 'Understanding hepatic biotransformation', duration: 1080 },
      { title: 'Phase 3: Elimination', desc: 'Bile, bowel, and kidney pathways', duration: 900 },
      { title: 'Environmental Toxin Exposure', desc: 'Common toxins and sources', duration: 960 },
      { title: 'Safe Detox Protocols', desc: 'Evidence-based detoxification support', duration: 1020 },
    ]
  },
  {
    title: 'Module 10: Functional Lab Testing',
    description: 'Comprehensive lab interpretation skills',
    lessons: [
      { title: 'Blood Chemistry Analysis', desc: 'Optimal ranges vs standard ranges', duration: 1500 },
      { title: 'Hormone Testing', desc: 'DUTCH, saliva, and serum hormone panels', duration: 1200 },
      { title: 'Gut Testing', desc: 'GI-MAP, SIBO breath tests, and more', duration: 1080 },
      { title: 'Genetic Testing', desc: 'SNPs, methylation, and personalized medicine', duration: 1020 },
    ]
  },
  {
    title: 'Module 11: Nutritional Interventions',
    description: 'Evidence-based dietary approaches',
    lessons: [
      { title: 'Anti-Inflammatory Nutrition', desc: 'Foods that heal vs foods that harm', duration: 1080 },
      { title: 'Elimination Diets', desc: 'Identifying food sensitivities', duration: 900 },
      { title: 'Therapeutic Diets', desc: 'Keto, paleo, Mediterranean, and more', duration: 1020 },
      { title: 'Meal Planning for Clients', desc: 'Creating sustainable nutrition plans', duration: 840 },
    ]
  },
  {
    title: 'Module 12: Supplementation Protocols',
    description: 'Strategic use of nutritional supplements',
    lessons: [
      { title: 'Core Supplements', desc: 'Foundation supplements for everyone', duration: 960 },
      { title: 'Targeted Protocols', desc: 'Condition-specific supplementation', duration: 1080 },
      { title: 'Quality & Sourcing', desc: 'Choosing professional-grade supplements', duration: 720 },
      { title: 'Dosing & Safety', desc: 'Safe and effective dosing strategies', duration: 840 },
    ]
  },
  {
    title: 'Module 13: Lifestyle Medicine',
    description: 'Sleep, stress, and movement interventions',
    lessons: [
      { title: 'Sleep Optimization', desc: 'The foundation of health restoration', duration: 1020 },
      { title: 'Stress Management', desc: 'Practical stress reduction techniques', duration: 960 },
      { title: 'Movement & Exercise', desc: 'Exercise prescription for chronic conditions', duration: 900 },
      { title: 'Mind-Body Practices', desc: 'Meditation, breathwork, and nervous system regulation', duration: 840 },
    ]
  },
  {
    title: 'Module 14: Mental & Emotional Health',
    description: 'The functional approach to mental wellness',
    lessons: [
      { title: 'Anxiety & Depression', desc: 'Root causes beyond neurotransmitters', duration: 1140 },
      { title: 'Brain Health & Cognition', desc: 'Optimizing brain function naturally', duration: 1020 },
      { title: 'Trauma & Chronic Illness', desc: 'The mind-body connection', duration: 960 },
      { title: 'Supporting Mental Wellness', desc: 'Nutritional psychiatry approaches', duration: 900 },
    ]
  },
  {
    title: 'Module 15: Women\'s Health Specialization',
    description: 'Female-specific health concerns',
    lessons: [
      { title: 'Menstrual Health', desc: 'Optimizing the monthly cycle', duration: 1080 },
      { title: 'PCOS & Endometriosis', desc: 'Functional approaches to common conditions', duration: 1140 },
      { title: 'Perimenopause & Menopause', desc: 'Navigating hormonal transitions', duration: 1020 },
      { title: 'Fertility Optimization', desc: 'Preparing the body for pregnancy', duration: 960 },
    ]
  },
  {
    title: 'Module 16: Cardiovascular Health',
    description: 'Heart health from a functional perspective',
    lessons: [
      { title: 'Beyond Cholesterol', desc: 'Advanced cardiovascular risk markers', duration: 1080 },
      { title: 'Blood Pressure Optimization', desc: 'Natural approaches to hypertension', duration: 900 },
      { title: 'Heart-Healthy Protocols', desc: 'Diet, supplements, and lifestyle for heart health', duration: 960 },
      { title: 'Cardiovascular Testing', desc: 'Advanced cardiac lab panels', duration: 840 },
    ]
  },
  {
    title: 'Module 17: Pain & Inflammation',
    description: 'Managing chronic pain naturally',
    lessons: [
      { title: 'Chronic Pain Mechanisms', desc: 'Understanding pain pathways', duration: 960 },
      { title: 'Anti-Inflammatory Protocols', desc: 'Reducing systemic inflammation', duration: 1020 },
      { title: 'Joint & Musculoskeletal Health', desc: 'Arthritis and mobility optimization', duration: 900 },
      { title: 'Fibromyalgia & Chronic Fatigue', desc: 'Complex multi-system conditions', duration: 1080 },
    ]
  },
  {
    title: 'Module 18: Case Study Analysis',
    description: 'Real-world clinical reasoning',
    lessons: [
      { title: 'Case Study 1: Autoimmune', desc: 'Reversing Hashimoto\'s thyroiditis', duration: 1200 },
      { title: 'Case Study 2: Digestive', desc: 'Healing severe IBS and SIBO', duration: 1140 },
      { title: 'Case Study 3: Hormonal', desc: 'Balancing PCOS naturally', duration: 1080 },
      { title: 'Case Study 4: Metabolic', desc: 'Reversing type 2 diabetes', duration: 1020 },
    ]
  },
  {
    title: 'Module 19: Treatment Plan Development',
    description: 'Creating comprehensive client protocols',
    lessons: [
      { title: 'Protocol Design Principles', desc: 'Building effective treatment plans', duration: 1080 },
      { title: 'Prioritization Strategies', desc: 'What to address first', duration: 900 },
      { title: 'Follow-Up & Adjustments', desc: 'Monitoring progress and adapting plans', duration: 840 },
      { title: 'Client Education & Compliance', desc: 'Ensuring clients follow through', duration: 780 },
    ]
  },
  {
    title: 'Module 20: Practice Building',
    description: 'Building a successful functional medicine practice',
    lessons: [
      { title: 'Practice Models', desc: 'Virtual, in-person, and hybrid options', duration: 900 },
      { title: 'Pricing & Packages', desc: 'Creating sustainable pricing structures', duration: 840 },
      { title: 'Client Acquisition', desc: 'Marketing your practice ethically', duration: 960 },
      { title: 'Systems & Workflows', desc: 'Efficient practice management', duration: 780 },
    ]
  },
  {
    title: 'Module 21: Certification & Beyond',
    description: 'Completing your certification and next steps',
    lessons: [
      { title: 'Certification Review', desc: 'Comprehensive program review', duration: 1200 },
      { title: 'Final Assessment Preparation', desc: 'Preparing for your certification exam', duration: 900 },
      { title: 'Final Certification Exam', desc: 'Complete your certification assessment', duration: 0, type: LessonType.QUIZ },
      { title: 'Your Next Steps', desc: 'What comes after certification', duration: 600 },
    ]
  }
];

async function main() {
  console.log('🌱 Creating comprehensive 21-module Functional Medicine Certification...');

  // Get the Functional Medicine category
  const fmCategory = await prisma.category.findFirst({
    where: { slug: 'functional-medicine' }
  });

  if (!fmCategory) {
    console.log('❌ Functional Medicine category not found. Please run the main seed first.');
    return;
  }

  // Get the coach
  const coach = await prisma.user.findFirst({
    where: { email: 'coach@accredipro-certificate.com' }
  });

  // Check if course already exists
  const existingCourse = await prisma.course.findFirst({
    where: { slug: 'functional-medicine-complete-certification' }
  });

  if (existingCourse) {
    console.log('⚠️ Course already exists. Deleting and recreating...');
    await prisma.lesson.deleteMany({ where: { module: { courseId: existingCourse.id } } });
    await prisma.module.deleteMany({ where: { courseId: existingCourse.id } });
    await prisma.course.delete({ where: { id: existingCourse.id } });
  }

  // Create the comprehensive course
  const course = await prisma.course.create({
    data: {
      title: 'Functional Medicine Complete Certification',
      slug: 'functional-medicine-complete-certification',
      description: `The complete Functional Medicine Certification. 21 modules covering root cause analysis, gut health, hormones, lab interpretation, protocols, and practice building. Everything you need to become a confident, certified FM practitioner.`,
      shortDescription: '21 modules • 85 lessons • 60 hours • Complete FM certification',
      price: 1997,
      isFree: false,
      isPublished: true,
      isFeatured: true,
      difficulty: Difficulty.INTERMEDIATE,
      duration: 3600, // 60 hours
      certificateType: CertificateType.CERTIFICATION,
      categoryId: fmCategory.id,
      coachId: coach?.id,
      publishedAt: new Date(),
    },
  });

  console.log(`✅ Created course: ${course.title}`);

  // Create modules and lessons
  let totalLessons = 0;
  for (let i = 0; i < FM_MODULES.length; i++) {
    const moduleData = FM_MODULES[i];

    const module = await prisma.module.create({
      data: {
        title: moduleData.title,
        description: moduleData.description,
        order: i + 1,
        isPublished: true,
        courseId: course.id,
      },
    });

    // Create lessons for this module
    const lessons = moduleData.lessons.map((lesson, idx) => ({
      title: lesson.title,
      description: lesson.desc,
      order: idx + 1,
      isPublished: true,
      isFreePreview: lesson.free || false,
      lessonType: lesson.type || LessonType.VIDEO,
      videoDuration: lesson.duration || 0,
      moduleId: module.id,
    }));

    await prisma.lesson.createMany({
      data: lessons,
    });

    totalLessons += lessons.length;
    console.log(`   📚 Module ${i + 1}: ${moduleData.title} (${lessons.length} lessons)`);
  }

  // Create course analytics
  await prisma.courseAnalytics.create({
    data: {
      courseId: course.id,
      totalEnrolled: 347,
      totalCompleted: 89,
      avgProgress: 45,
      avgRating: 4.9,
    },
  });

  console.log('');
  console.log('🎉 Comprehensive Functional Medicine Certification Created!');
  console.log(`   📖 Total Modules: ${FM_MODULES.length}`);
  console.log(`   📝 Total Lessons: ${totalLessons}`);
  console.log(`   💰 Price: $1,997`);
  console.log(`   🔗 Slug: functional-medicine-complete-certification`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
