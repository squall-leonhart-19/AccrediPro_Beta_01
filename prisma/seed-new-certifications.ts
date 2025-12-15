/**
 * Seed New Certifications
 * - Women's Hormone Health Coach ($997)
 * - Gut Health & Digestive Wellness Coach ($997)
 * Run with: npx tsx prisma/seed-new-certifications.ts
 */

import { PrismaClient, Difficulty, CertificateType, LessonType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ==================== WOMEN'S HORMONE HEALTH COACH ====================
const HORMONE_MODULES = [
  {
    title: 'Module 1: Introduction to Women\'s Hormone Health',
    description: 'Foundation principles of female endocrinology and hormone coaching',
    lessons: [
      { title: 'Welcome & Program Overview', desc: 'Your journey to becoming a hormone health specialist', duration: 600, free: true },
      { title: 'The Female Endocrine System', desc: 'Understanding the hormonal orchestra', duration: 1080 },
      { title: 'The Role of a Hormone Health Coach', desc: 'Scope of practice and ethical guidelines', duration: 720 },
      { title: 'Building Your Assessment Framework', desc: 'Creating comprehensive client evaluations', duration: 840 },
    ]
  },
  {
    title: 'Module 2: The Menstrual Cycle Deep Dive',
    description: 'Master the intricacies of the monthly hormonal rhythm',
    lessons: [
      { title: 'The Four Phases of the Cycle', desc: 'Menstrual, follicular, ovulatory, and luteal phases', duration: 1200 },
      { title: 'Estrogen Throughout the Cycle', desc: 'Understanding estrogen\'s role and fluctuations', duration: 960 },
      { title: 'Progesterone: The Calming Hormone', desc: 'Why progesterone matters for women', duration: 900 },
      { title: 'Cycle Syncing Strategies', desc: 'Optimizing nutrition and lifestyle by phase', duration: 1080 },
    ]
  },
  {
    title: 'Module 3: Estrogen Dominance & Detoxification',
    description: 'Address the most common hormonal imbalance',
    lessons: [
      { title: 'What is Estrogen Dominance?', desc: 'Symptoms, causes, and risk factors', duration: 1080 },
      { title: 'Estrogen Metabolism Pathways', desc: 'The 2, 4, and 16 hydroxylation pathways', duration: 1140 },
      { title: 'Supporting Estrogen Detoxification', desc: 'Liver support and DIM/I3C protocols', duration: 960 },
      { title: 'Environmental Estrogens', desc: 'Xenoestrogens and endocrine disruptors', duration: 840 },
    ]
  },
  {
    title: 'Module 4: Low Progesterone & Luteal Phase Defects',
    description: 'Restore the balance with progesterone support',
    lessons: [
      { title: 'Signs of Low Progesterone', desc: 'Identifying progesterone deficiency', duration: 900 },
      { title: 'Causes of Progesterone Insufficiency', desc: 'Stress, anovulation, and nutrient deficiencies', duration: 1020 },
      { title: 'Natural Progesterone Support', desc: 'Vitex, nutrients, and lifestyle interventions', duration: 1080 },
      { title: 'Bioidentical Progesterone', desc: 'When to consider and what to know', duration: 780 },
    ]
  },
  {
    title: 'Module 5: PCOS Mastery',
    description: 'Comprehensive approach to polycystic ovary syndrome',
    lessons: [
      { title: 'Understanding PCOS', desc: 'Rotterdam criteria and PCOS phenotypes', duration: 1200 },
      { title: 'Insulin Resistance in PCOS', desc: 'The metabolic root of many cases', duration: 1080 },
      { title: 'Androgen Excess Management', desc: 'Addressing high testosterone naturally', duration: 1020 },
      { title: 'PCOS Nutrition & Supplements', desc: 'Evidence-based protocols for PCOS', duration: 1140 },
    ]
  },
  {
    title: 'Module 6: Thyroid & Female Hormones',
    description: 'The crucial thyroid-ovarian connection',
    lessons: [
      { title: 'Thyroid Basics for Hormone Coaches', desc: 'TSH, T4, T3, and thyroid antibodies', duration: 1080 },
      { title: 'Hypothyroidism & Menstrual Health', desc: 'How low thyroid affects cycles', duration: 960 },
      { title: 'Hashimoto\'s & Autoimmunity', desc: 'The autoimmune thyroid epidemic', duration: 1020 },
      { title: 'Supporting Thyroid Naturally', desc: 'Nutrients, herbs, and lifestyle factors', duration: 900 },
    ]
  },
  {
    title: 'Module 7: Adrenal Health & Cortisol',
    description: 'Master the stress-hormone connection',
    lessons: [
      { title: 'The HPA Axis Explained', desc: 'Understanding the stress response system', duration: 1080 },
      { title: 'Cortisol\'s Impact on Female Hormones', desc: 'How stress steals progesterone', duration: 960 },
      { title: 'Adrenal Fatigue Protocols', desc: 'Supporting exhausted adrenals', duration: 1020 },
      { title: 'Adaptogens for Women', desc: 'Ashwagandha, rhodiola, and more', duration: 840 },
    ]
  },
  {
    title: 'Module 8: Perimenopause Navigation',
    description: 'Guide women through the transition years',
    lessons: [
      { title: 'What is Perimenopause?', desc: 'The 5-15 year transition explained', duration: 1080 },
      { title: 'Common Perimenopause Symptoms', desc: 'Irregular cycles, hot flashes, mood changes', duration: 960 },
      { title: 'Hormone Testing in Perimenopause', desc: 'What tests to order and when', duration: 900 },
      { title: 'Supporting the Perimenopause Journey', desc: 'Protocols for symptom relief', duration: 1140 },
    ]
  },
  {
    title: 'Module 9: Menopause & Beyond',
    description: 'Thriving in the post-reproductive years',
    lessons: [
      { title: 'Defining Menopause', desc: 'The one-year mark and what changes', duration: 900 },
      { title: 'Long-Term Health Considerations', desc: 'Bone health, heart health, and brain health', duration: 1080 },
      { title: 'HRT: The Complete Picture', desc: 'Benefits, risks, and who it\'s right for', duration: 1200 },
      { title: 'Natural Menopause Support', desc: 'Phytoestrogens, herbs, and lifestyle', duration: 1020 },
    ]
  },
  {
    title: 'Module 10: Fertility Optimization',
    description: 'Support clients on their conception journey',
    lessons: [
      { title: 'Female Fertility Foundations', desc: 'What needs to be in place for conception', duration: 1080 },
      { title: 'Optimizing Egg Quality', desc: 'The 90-day window and what matters', duration: 1140 },
      { title: 'Cycle Tracking for Conception', desc: 'BBT, OPKs, and fertile window identification', duration: 960 },
      { title: 'Supporting Male Partners', desc: 'Sperm health and what he can do', duration: 840 },
    ]
  },
  {
    title: 'Module 11: Hormone Testing & Interpretation',
    description: 'Master functional hormone testing',
    lessons: [
      { title: 'Serum Hormone Testing', desc: 'What to order and when in the cycle', duration: 1080 },
      { title: 'DUTCH Testing Mastery', desc: 'Comprehensive hormone metabolite analysis', duration: 1320 },
      { title: 'Interpreting Results', desc: 'Patterns and what they mean clinically', duration: 1140 },
      { title: 'Creating Protocols from Labs', desc: 'Translating results into action plans', duration: 1020 },
    ]
  },
  {
    title: 'Module 12: Nutrition for Hormone Balance',
    description: 'Food as medicine for hormones',
    lessons: [
      { title: 'Macronutrients for Hormones', desc: 'Protein, fats, and carbs for hormone health', duration: 1080 },
      { title: 'Key Micronutrients', desc: 'Zinc, B6, magnesium, and more', duration: 960 },
      { title: 'Seed Cycling & Phytoestrogens', desc: 'Using food to balance hormones', duration: 840 },
      { title: 'Meal Plans for Hormone Clients', desc: 'Practical nutrition planning', duration: 900 },
    ]
  },
  {
    title: 'Module 13: Supplement Protocols',
    description: 'Evidence-based supplementation for hormones',
    lessons: [
      { title: 'Core Hormone Support Supplements', desc: 'Foundations everyone needs', duration: 960 },
      { title: 'Condition-Specific Protocols', desc: 'PCOS, PMS, perimenopause stacks', duration: 1140 },
      { title: 'Herbs for Hormone Balance', desc: 'Vitex, maca, black cohosh, and more', duration: 1020 },
      { title: 'Quality & Dosing Guidelines', desc: 'Choosing and dosing supplements safely', duration: 780 },
    ]
  },
  {
    title: 'Module 14: Practice Building & Certification',
    description: 'Launch your hormone health coaching practice',
    lessons: [
      { title: 'Defining Your Hormone Niche', desc: 'Finding your specialty area', duration: 840 },
      { title: 'Client Acquisition Strategies', desc: 'Marketing to your ideal clients', duration: 960 },
      { title: 'Creating Signature Programs', desc: 'Packaging your services', duration: 900 },
      { title: 'Certification Review & Exam', desc: 'Final assessment and certification', duration: 0, type: LessonType.QUIZ },
    ]
  },
];

// ==================== GUT HEALTH & DIGESTIVE WELLNESS COACH ====================
const GUT_MODULES = [
  {
    title: 'Module 1: Introduction to Gut Health Coaching',
    description: 'Foundation of digestive wellness and the gut health coaching role',
    lessons: [
      { title: 'Welcome & Program Overview', desc: 'Your journey to becoming a gut health specialist', duration: 600, free: true },
      { title: 'The Digestive System Overview', desc: 'From mouth to microbiome', duration: 1080 },
      { title: 'The Role of a Gut Health Coach', desc: 'Scope, ethics, and referral guidelines', duration: 720 },
      { title: 'Assessment & Intake Protocols', desc: 'Comprehensive digestive health evaluation', duration: 900 },
    ]
  },
  {
    title: 'Module 2: The Microbiome Revolution',
    description: 'Understanding the gut ecosystem',
    lessons: [
      { title: 'What is the Microbiome?', desc: 'Trillions of organisms living within us', duration: 1080 },
      { title: 'Beneficial vs Pathogenic Bacteria', desc: 'The good, the bad, and the opportunistic', duration: 960 },
      { title: 'Factors That Shape the Microbiome', desc: 'Diet, antibiotics, birth, and environment', duration: 1020 },
      { title: 'Microbiome Testing Basics', desc: 'GI-MAP and stool testing overview', duration: 1140 },
    ]
  },
  {
    title: 'Module 3: The Gut-Brain Axis',
    description: 'Master the bidirectional communication highway',
    lessons: [
      { title: 'The Enteric Nervous System', desc: 'Your second brain in the gut', duration: 1080 },
      { title: 'Vagus Nerve Function', desc: 'The gut-brain superhighway', duration: 960 },
      { title: 'Neurotransmitters in the Gut', desc: 'Serotonin, GABA, and dopamine production', duration: 1020 },
      { title: 'Mood, Anxiety & the Gut', desc: 'Supporting mental health through digestion', duration: 1140 },
    ]
  },
  {
    title: 'Module 4: Leaky Gut Syndrome',
    description: 'Understanding and healing intestinal permeability',
    lessons: [
      { title: 'What is Leaky Gut?', desc: 'Intestinal permeability explained', duration: 1080 },
      { title: 'Causes of Leaky Gut', desc: 'Gluten, stress, medications, and more', duration: 960 },
      { title: 'Testing for Intestinal Permeability', desc: 'Zonulin, LPS antibodies, and food sensitivity testing', duration: 900 },
      { title: 'The Gut Repair Protocol', desc: 'Step-by-step healing strategy', duration: 1200 },
    ]
  },
  {
    title: 'Module 5: SIBO & IMO Mastery',
    description: 'Small intestinal bacterial and methanogen overgrowth',
    lessons: [
      { title: 'Understanding SIBO', desc: 'What happens when bacteria are in the wrong place', duration: 1200 },
      { title: 'SIBO Types: Hydrogen, Methane & Hydrogen Sulfide', desc: 'Different types, different symptoms', duration: 1080 },
      { title: 'SIBO Testing', desc: 'Breath testing interpretation', duration: 960 },
      { title: 'SIBO Treatment Protocols', desc: 'Antimicrobials, prokinetics, and prevention', duration: 1320 },
    ]
  },
  {
    title: 'Module 6: IBS & Functional GI Disorders',
    description: 'Comprehensive IBS management',
    lessons: [
      { title: 'Understanding IBS', desc: 'Rome IV criteria and IBS subtypes', duration: 1080 },
      { title: 'Root Causes of IBS', desc: 'Post-infectious, stress, dysbiosis, and more', duration: 1020 },
      { title: 'The Low FODMAP Diet', desc: 'Implementation and reintroduction protocol', duration: 1140 },
      { title: 'Beyond FODMAPs: Other IBS Strategies', desc: 'Stress reduction, prokinetics, and more', duration: 960 },
    ]
  },
  {
    title: 'Module 7: Food Sensitivities & Elimination Diets',
    description: 'Identify and address food reactions',
    lessons: [
      { title: 'Allergy vs Sensitivity vs Intolerance', desc: 'Understanding different food reactions', duration: 1080 },
      { title: 'Common Food Sensitivities', desc: 'Gluten, dairy, eggs, soy, and more', duration: 960 },
      { title: 'Testing for Food Sensitivities', desc: 'IgG, MRT, and elimination diets', duration: 1020 },
      { title: 'Implementing Elimination Diets', desc: 'Step-by-step elimination and reintroduction', duration: 1140 },
    ]
  },
  {
    title: 'Module 8: Upper GI Health',
    description: 'Stomach acid, enzymes, and early digestion',
    lessons: [
      { title: 'Stomach Acid Function', desc: 'The importance of HCl', duration: 1020 },
      { title: 'Low Stomach Acid (Hypochlorhydria)', desc: 'Symptoms, causes, and solutions', duration: 960 },
      { title: 'GERD & Reflux', desc: 'Root causes beyond "too much acid"', duration: 1080 },
      { title: 'Digestive Enzyme Support', desc: 'When and how to supplement', duration: 840 },
    ]
  },
  {
    title: 'Module 9: Gut Infections & Pathogens',
    description: 'Identify and address gut infections',
    lessons: [
      { title: 'H. Pylori', desc: 'Testing, symptoms, and eradication', duration: 1200 },
      { title: 'Parasites & Worms', desc: 'Common parasitic infections', duration: 1080 },
      { title: 'Candida Overgrowth', desc: 'Yeast in the gut and beyond', duration: 1020 },
      { title: 'Antimicrobial Protocols', desc: 'Natural and pharmaceutical options', duration: 1140 },
    ]
  },
  {
    title: 'Module 10: The 5R Protocol',
    description: 'The gold standard gut healing framework',
    lessons: [
      { title: 'Remove: Eliminating Triggers', desc: 'Foods, pathogens, and stressors', duration: 1080 },
      { title: 'Replace: Digestive Support', desc: 'HCl, enzymes, and bile support', duration: 960 },
      { title: 'Reinoculate: Probiotics & Prebiotics', desc: 'Restoring beneficial bacteria', duration: 1020 },
      { title: 'Repair & Rebalance', desc: 'Gut lining support and lifestyle factors', duration: 1140 },
    ]
  },
  {
    title: 'Module 11: Gut Testing Mastery',
    description: 'Comprehensive stool and functional testing',
    lessons: [
      { title: 'GI-MAP Interpretation', desc: 'Deep dive into stool PCR testing', duration: 1320 },
      { title: 'Other Stool Tests', desc: 'GI Effects, CDSA, and more', duration: 1080 },
      { title: 'SIBO Breath Test Analysis', desc: 'Reading and interpreting breath tests', duration: 960 },
      { title: 'Creating Protocols from Test Results', desc: 'Translating data into action', duration: 1140 },
    ]
  },
  {
    title: 'Module 12: Nutrition for Gut Health',
    description: 'Food-first approaches to digestive wellness',
    lessons: [
      { title: 'Gut-Healing Foods', desc: 'Bone broth, fermented foods, and more', duration: 1020 },
      { title: 'Prebiotic & Probiotic Foods', desc: 'Feeding and seeding the microbiome', duration: 960 },
      { title: 'Therapeutic Diets', desc: 'SCD, GAPS, AIP, and more', duration: 1080 },
      { title: 'Meal Planning for Gut Clients', desc: 'Practical nutrition implementation', duration: 900 },
    ]
  },
  {
    title: 'Module 13: Supplement Protocols',
    description: 'Evidence-based gut supplements',
    lessons: [
      { title: 'Probiotics: Strains & Dosing', desc: 'Choosing the right probiotics', duration: 1080 },
      { title: 'Gut Repair Supplements', desc: 'L-glutamine, zinc carnosine, and more', duration: 1020 },
      { title: 'Antimicrobial Supplements', desc: 'Berberine, oregano, allicin, and others', duration: 1140 },
      { title: 'Digestive Support Stack', desc: 'HCl, enzymes, bile, and bitters', duration: 900 },
    ]
  },
  {
    title: 'Module 14: Practice Building & Certification',
    description: 'Launch your gut health coaching practice',
    lessons: [
      { title: 'Defining Your Gut Health Niche', desc: 'Finding your specialty area', duration: 840 },
      { title: 'Client Attraction Strategies', desc: 'Marketing to those with gut issues', duration: 960 },
      { title: 'Creating Your Signature Protocol', desc: 'Developing your unique approach', duration: 900 },
      { title: 'Certification Review & Exam', desc: 'Final assessment and certification', duration: 0, type: LessonType.QUIZ },
    ]
  },
];

async function main() {
  console.log('🌱 Creating new certifications...\n');

  // Get the Functional Medicine category (both courses will use this)
  const fmCategory = await prisma.category.findFirst({
    where: { slug: 'functional-medicine' }
  });

  if (!fmCategory) {
    console.log('❌ Functional Medicine category not found. Please run the main seed first.');
    return;
  }
  console.log(`✅ Found category: ${fmCategory.name}`);

  // Get the coach
  const coach = await prisma.user.findFirst({
    where: { email: 'coach@accredipro-certificate.com' }
  });
  console.log(`✅ Found coach: ${coach?.firstName || 'N/A'}`);

  // ==================== CREATE WOMEN'S HORMONE HEALTH COACH ====================
  console.log('\n📝 Creating Women\'s Hormone Health Coach certification...');

  // Check if course already exists
  const existingHormone = await prisma.course.findFirst({
    where: { slug: 'womens-hormone-health-coach' }
  });

  if (existingHormone) {
    console.log('⚠️ Hormone course exists. Deleting and recreating...');
    await prisma.lesson.deleteMany({ where: { module: { courseId: existingHormone.id } } });
    await prisma.module.deleteMany({ where: { courseId: existingHormone.id } });
    await prisma.courseAnalytics.deleteMany({ where: { courseId: existingHormone.id } });
    await prisma.course.delete({ where: { id: existingHormone.id } });
  }

  const hormoneCourse = await prisma.course.create({
    data: {
      title: "Women's Hormone Health Coach Certification",
      slug: 'womens-hormone-health-coach',
      description: `Become a certified Women's Hormone Health Coach. Master the female endocrine system, menstrual health, PCOS, perimenopause, menopause, fertility, and hormone testing. 14 comprehensive modules covering everything you need to support women through every hormonal stage of life.

**What You'll Master:**
• The complete female hormonal system and menstrual cycle optimization
• PCOS, endometriosis, and hormonal imbalances
• Perimenopause and menopause support protocols
• Fertility optimization and preconception care
• DUTCH testing and hormone lab interpretation
• Evidence-based supplement and nutrition protocols

**Included with Your Certification:**
✅ 14 in-depth modules with 56 video lessons
✅ Hormone health assessment templates
✅ DUTCH test interpretation guides
✅ Client protocol templates
✅ Access to Coach Sarah in the community
✅ 9 Accreditations recognized worldwide`,
      shortDescription: '14 modules • 56 lessons • 40+ hours • Hormone Health certification',
      price: 997,
      isFree: false,
      isPublished: true,
      isFeatured: true,
      difficulty: Difficulty.INTERMEDIATE,
      duration: 2400, // 40 hours
      certificateType: CertificateType.CERTIFICATION,
      categoryId: fmCategory.id,
      coachId: coach?.id,
      publishedAt: new Date(),
    },
  });

  console.log(`✅ Created course: ${hormoneCourse.title}`);

  // Create modules and lessons for hormone course
  let hormoneLessons = 0;
  for (let i = 0; i < HORMONE_MODULES.length; i++) {
    const moduleData = HORMONE_MODULES[i];

    const module = await prisma.module.create({
      data: {
        title: moduleData.title,
        description: moduleData.description,
        order: i + 1,
        isPublished: true,
        courseId: hormoneCourse.id,
      },
    });

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

    await prisma.lesson.createMany({ data: lessons });
    hormoneLessons += lessons.length;
    console.log(`   📚 Module ${i + 1}: ${moduleData.title} (${lessons.length} lessons)`);
  }

  // Create course analytics
  await prisma.courseAnalytics.create({
    data: {
      courseId: hormoneCourse.id,
      totalEnrolled: 234,
      totalCompleted: 67,
      avgProgress: 52,
      avgRating: 4.9,
    },
  });

  // ==================== CREATE GUT HEALTH & DIGESTIVE WELLNESS COACH ====================
  console.log('\n📝 Creating Gut Health & Digestive Wellness Coach certification...');

  // Check if course already exists
  const existingGut = await prisma.course.findFirst({
    where: { slug: 'gut-health-digestive-wellness-coach' }
  });

  if (existingGut) {
    console.log('⚠️ Gut health course exists. Deleting and recreating...');
    await prisma.lesson.deleteMany({ where: { module: { courseId: existingGut.id } } });
    await prisma.module.deleteMany({ where: { courseId: existingGut.id } });
    await prisma.courseAnalytics.deleteMany({ where: { courseId: existingGut.id } });
    await prisma.course.delete({ where: { id: existingGut.id } });
  }

  const gutCourse = await prisma.course.create({
    data: {
      title: "Gut Health & Digestive Wellness Coach Certification",
      slug: 'gut-health-digestive-wellness-coach',
      description: `Become a certified Gut Health & Digestive Wellness Coach. Master the microbiome, gut-brain connection, leaky gut, SIBO, IBS, and comprehensive gut healing protocols. 14 in-depth modules covering everything you need to help clients transform their digestive health.

**What You'll Master:**
• The microbiome and gut ecosystem optimization
• The gut-brain axis and mental health connection
• Leaky gut syndrome and intestinal permeability healing
• SIBO, IMO, and IBS comprehensive protocols
• Food sensitivities and elimination diets
• GI-MAP and gut testing interpretation

**Included with Your Certification:**
✅ 14 comprehensive modules with 56 video lessons
✅ GI-MAP interpretation guide
✅ 5R Protocol implementation templates
✅ SIBO treatment flowcharts
✅ Client meal planning resources
✅ Access to Coach Sarah in the community
✅ 9 Accreditations recognized worldwide`,
      shortDescription: '14 modules • 56 lessons • 40+ hours • Gut Health certification',
      price: 997,
      isFree: false,
      isPublished: true,
      isFeatured: true,
      difficulty: Difficulty.INTERMEDIATE,
      duration: 2400, // 40 hours
      certificateType: CertificateType.CERTIFICATION,
      categoryId: fmCategory.id,
      coachId: coach?.id,
      publishedAt: new Date(),
    },
  });

  console.log(`✅ Created course: ${gutCourse.title}`);

  // Create modules and lessons for gut course
  let gutLessons = 0;
  for (let i = 0; i < GUT_MODULES.length; i++) {
    const moduleData = GUT_MODULES[i];

    const module = await prisma.module.create({
      data: {
        title: moduleData.title,
        description: moduleData.description,
        order: i + 1,
        isPublished: true,
        courseId: gutCourse.id,
      },
    });

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

    await prisma.lesson.createMany({ data: lessons });
    gutLessons += lessons.length;
    console.log(`   📚 Module ${i + 1}: ${moduleData.title} (${lessons.length} lessons)`);
  }

  // Create course analytics
  await prisma.courseAnalytics.create({
    data: {
      courseId: gutCourse.id,
      totalEnrolled: 289,
      totalCompleted: 78,
      avgProgress: 48,
      avgRating: 4.8,
    },
  });

  // Final summary
  console.log('\n========================================');
  console.log('🎉 NEW CERTIFICATIONS CREATED!');
  console.log('========================================');
  console.log(`\n📖 Women's Hormone Health Coach:`);
  console.log(`   Modules: ${HORMONE_MODULES.length}`);
  console.log(`   Lessons: ${hormoneLessons}`);
  console.log(`   Price: $997 (was $1,997) - Graduated Special Price`);
  console.log(`   Slug: womens-hormone-health-coach`);
  console.log(`\n📖 Gut Health & Digestive Wellness Coach:`);
  console.log(`   Modules: ${GUT_MODULES.length}`);
  console.log(`   Lessons: ${gutLessons}`);
  console.log(`   Price: $997 (was $1,997) - Graduated Special Price`);
  console.log(`   Slug: gut-health-digestive-wellness-coach`);
  console.log('========================================\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
