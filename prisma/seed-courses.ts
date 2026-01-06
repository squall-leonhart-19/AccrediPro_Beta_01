// Auto-generated seed data for courses and tags
// Generated: 2026-01-05T08:45:26.469688
// Courses: 10

import { PrismaClient, TagCategory } from '@prisma/client';

const prisma = new PrismaClient();

// ========================================
// MARKETING TAGS (Purchase Tags)
// ========================================

const purchaseTags = [
  {
    name: "Certified Functional Medicine Practitioner™ - L1 Purchased",
    slug: "functional_medicine_practitioner_purchased",
    category: "SUPPRESS" as TagCategory,
    color: "#10B981",
    description: "User purchased Certified Functional Medicine Practitioner™",
    isSystem: true,
  },
  {
    name: "FM01 PRO Accelerator Purchased",
    slug: "fm01_pro_accelerator_purchased",
    category: "SUPPRESS" as TagCategory,
    color: "#8B5CF6",
    description: "User purchased PRO Accelerator for Certified Functional Medicine Practitioner™",
    isSystem: true,
  },
  {
    name: "Certified Holistic Nutrition Coach™ - L1 Purchased",
    slug: "holistic_nutrition_purchased",
    category: "SUPPRESS" as TagCategory,
    color: "#10B981",
    description: "User purchased Certified Holistic Nutrition Coach™",
    isSystem: true,
  },
  {
    name: "FM02 PRO Accelerator Purchased",
    slug: "fm02_pro_accelerator_purchased",
    category: "SUPPRESS" as TagCategory,
    color: "#8B5CF6",
    description: "User purchased PRO Accelerator for Certified Holistic Nutrition Coach™",
    isSystem: true,
  },
  {
    name: "Certified Women's Wellness Coach™ - L1 Purchased",
    slug: "womens_wellness_purchased",
    category: "SUPPRESS" as TagCategory,
    color: "#10B981",
    description: "User purchased Certified Women's Wellness Coach™",
    isSystem: true,
  },
  {
    name: "FM03 PRO Accelerator Purchased",
    slug: "fm03_pro_accelerator_purchased",
    category: "SUPPRESS" as TagCategory,
    color: "#8B5CF6",
    description: "User purchased PRO Accelerator for Certified Women's Wellness Coach™",
    isSystem: true,
  },
  {
    name: "Certified Men's Health Coach™ - L1 Purchased",
    slug: "mens_health_purchased",
    category: "SUPPRESS" as TagCategory,
    color: "#10B981",
    description: "User purchased Certified Men's Health Coach™",
    isSystem: true,
  },
  {
    name: "FM04 PRO Accelerator Purchased",
    slug: "fm04_pro_accelerator_purchased",
    category: "SUPPRESS" as TagCategory,
    color: "#8B5CF6",
    description: "User purchased PRO Accelerator for Certified Men's Health Coach™",
    isSystem: true,
  },
  {
    name: "Certified Longevity & Anti-Aging Coach™ - L1 Purchased",
    slug: "longevity_anti_aging_purchased",
    category: "SUPPRESS" as TagCategory,
    color: "#10B981",
    description: "User purchased Certified Longevity & Anti-Aging Coach™",
    isSystem: true,
  },
  {
    name: "FM05 PRO Accelerator Purchased",
    slug: "fm05_pro_accelerator_purchased",
    category: "SUPPRESS" as TagCategory,
    color: "#8B5CF6",
    description: "User purchased PRO Accelerator for Certified Longevity & Anti-Aging Coach™",
    isSystem: true,
  },
  {
    name: "Certified Women's Hormone Health Coach™ - L1 Purchased",
    slug: "womens_hormone_health_purchased",
    category: "SUPPRESS" as TagCategory,
    color: "#10B981",
    description: "User purchased Certified Women's Hormone Health Coach™",
    isSystem: true,
  },
  {
    name: "WH01 PRO Accelerator Purchased",
    slug: "wh01_pro_accelerator_purchased",
    category: "SUPPRESS" as TagCategory,
    color: "#8B5CF6",
    description: "User purchased PRO Accelerator for Certified Women's Hormone Health Coach™",
    isSystem: true,
  },
  {
    name: "Certified PMS & PMDD Support Coach™ - L1 Purchased",
    slug: "pms_pmdd_support_purchased",
    category: "SUPPRESS" as TagCategory,
    color: "#10B981",
    description: "User purchased Certified PMS & PMDD Support Coach™",
    isSystem: true,
  },
  {
    name: "WH02 PRO Accelerator Purchased",
    slug: "wh02_pro_accelerator_purchased",
    category: "SUPPRESS" as TagCategory,
    color: "#8B5CF6",
    description: "User purchased PRO Accelerator for Certified PMS & PMDD Support Coach™",
    isSystem: true,
  },
  {
    name: "Certified PCOS & Metabolic Health Coach™ - L1 Purchased",
    slug: "pcos_metabolic_health_purchased",
    category: "SUPPRESS" as TagCategory,
    color: "#10B981",
    description: "User purchased Certified PCOS & Metabolic Health Coach™",
    isSystem: true,
  },
  {
    name: "WH03 PRO Accelerator Purchased",
    slug: "wh03_pro_accelerator_purchased",
    category: "SUPPRESS" as TagCategory,
    color: "#8B5CF6",
    description: "User purchased PRO Accelerator for Certified PCOS & Metabolic Health Coach™",
    isSystem: true,
  },
  {
    name: "Certified Menopause & Perimenopause Coach™ - L1 Purchased",
    slug: "menopause_perimenopause_purchased",
    category: "SUPPRESS" as TagCategory,
    color: "#10B981",
    description: "User purchased Certified Menopause & Perimenopause Coach™",
    isSystem: true,
  },
  {
    name: "WH04 PRO Accelerator Purchased",
    slug: "wh04_pro_accelerator_purchased",
    category: "SUPPRESS" as TagCategory,
    color: "#8B5CF6",
    description: "User purchased PRO Accelerator for Certified Menopause & Perimenopause Coach™",
    isSystem: true,
  },
  {
    name: "Certified Women's Thyroid Health Specialist™ - L1 Purchased",
    slug: "womens_thyroid_health_specialist_purchased",
    category: "SUPPRESS" as TagCategory,
    color: "#10B981",
    description: "User purchased Certified Women's Thyroid Health Specialist™",
    isSystem: true,
  },
  {
    name: "WH05 PRO Accelerator Purchased",
    slug: "wh05_pro_accelerator_purchased",
    category: "SUPPRESS" as TagCategory,
    color: "#8B5CF6",
    description: "User purchased PRO Accelerator for Certified Women's Thyroid Health Specialist™",
    isSystem: true,
  },
];

// ========================================
// COURSES
// ========================================

const courses = [
  {
    title: "Certified Functional Medicine Practitioner™",
    slug: "functional-medicine-practitioner",
    description: "Become a Certified Functional Medicine Practitioner™ and transform lives with evidence-based training.",
    shortDescription: "Professional certification in FUNCTIONAL MEDICINE",
    price: 97,
    regularPrice: 197,
    isFree: false,
    isPublished: false,
    isFeatured: false,
    difficulty: "BEGINNER" as const,
    certificateType: "CERTIFICATION" as const,
    learningOutcomes: [
      "Master foundational concepts",
      "Apply practical techniques with clients",
      "Earn professional certification",
      "Build your practice"
    ],
  },
  {
    title: "Certified Holistic Nutrition Coach™",
    slug: "holistic-nutrition",
    description: "Become a Certified Holistic Nutrition Coach™ and transform lives with evidence-based training.",
    shortDescription: "Professional certification in FUNCTIONAL MEDICINE",
    price: 97,
    regularPrice: 197,
    isFree: false,
    isPublished: false,
    isFeatured: false,
    difficulty: "BEGINNER" as const,
    certificateType: "CERTIFICATION" as const,
    learningOutcomes: [
      "Master foundational concepts",
      "Apply practical techniques with clients",
      "Earn professional certification",
      "Build your practice"
    ],
  },
  {
    title: "Certified Women's Wellness Coach™",
    slug: "womens-wellness",
    description: "Become a Certified Women's Wellness Coach™ and transform lives with evidence-based training.",
    shortDescription: "Professional certification in FUNCTIONAL MEDICINE",
    price: 97,
    regularPrice: 197,
    isFree: false,
    isPublished: false,
    isFeatured: false,
    difficulty: "BEGINNER" as const,
    certificateType: "CERTIFICATION" as const,
    learningOutcomes: [
      "Master foundational concepts",
      "Apply practical techniques with clients",
      "Earn professional certification",
      "Build your practice"
    ],
  },
  {
    title: "Certified Men's Health Coach™",
    slug: "mens-health",
    description: "Become a Certified Men's Health Coach™ and transform lives with evidence-based training.",
    shortDescription: "Professional certification in FUNCTIONAL MEDICINE",
    price: 97,
    regularPrice: 197,
    isFree: false,
    isPublished: false,
    isFeatured: false,
    difficulty: "BEGINNER" as const,
    certificateType: "CERTIFICATION" as const,
    learningOutcomes: [
      "Master foundational concepts",
      "Apply practical techniques with clients",
      "Earn professional certification",
      "Build your practice"
    ],
  },
  {
    title: "Certified Longevity & Anti-Aging Coach™",
    slug: "longevity-anti-aging",
    description: "Become a Certified Longevity & Anti-Aging Coach™ and transform lives with evidence-based training.",
    shortDescription: "Professional certification in FUNCTIONAL MEDICINE",
    price: 97,
    regularPrice: 197,
    isFree: false,
    isPublished: false,
    isFeatured: false,
    difficulty: "BEGINNER" as const,
    certificateType: "CERTIFICATION" as const,
    learningOutcomes: [
      "Master foundational concepts",
      "Apply practical techniques with clients",
      "Earn professional certification",
      "Build your practice"
    ],
  },
  {
    title: "Certified Women's Hormone Health Coach™",
    slug: "womens-hormone-health",
    description: "Become a Certified Women's Hormone Health Coach™ and transform lives with evidence-based training.",
    shortDescription: "Professional certification in WOMEN'S HEALTH & HORMONES",
    price: 97,
    regularPrice: 197,
    isFree: false,
    isPublished: false,
    isFeatured: false,
    difficulty: "BEGINNER" as const,
    certificateType: "CERTIFICATION" as const,
    learningOutcomes: [
      "Master foundational concepts",
      "Apply practical techniques with clients",
      "Earn professional certification",
      "Build your practice"
    ],
  },
  {
    title: "Certified PMS & PMDD Support Coach™",
    slug: "pms-pmdd-support",
    description: "Become a Certified PMS & PMDD Support Coach™ and transform lives with evidence-based training.",
    shortDescription: "Professional certification in WOMEN'S HEALTH & HORMONES",
    price: 97,
    regularPrice: 197,
    isFree: false,
    isPublished: false,
    isFeatured: false,
    difficulty: "BEGINNER" as const,
    certificateType: "CERTIFICATION" as const,
    learningOutcomes: [
      "Master foundational concepts",
      "Apply practical techniques with clients",
      "Earn professional certification",
      "Build your practice"
    ],
  },
  {
    title: "Certified PCOS & Metabolic Health Coach™",
    slug: "pcos-metabolic-health",
    description: "Become a Certified PCOS & Metabolic Health Coach™ and transform lives with evidence-based training.",
    shortDescription: "Professional certification in WOMEN'S HEALTH & HORMONES",
    price: 97,
    regularPrice: 197,
    isFree: false,
    isPublished: false,
    isFeatured: false,
    difficulty: "BEGINNER" as const,
    certificateType: "CERTIFICATION" as const,
    learningOutcomes: [
      "Master foundational concepts",
      "Apply practical techniques with clients",
      "Earn professional certification",
      "Build your practice"
    ],
  },
  {
    title: "Certified Menopause & Perimenopause Coach™",
    slug: "menopause-perimenopause",
    description: "Become a Certified Menopause & Perimenopause Coach™ and transform lives with evidence-based training.",
    shortDescription: "Professional certification in WOMEN'S HEALTH & HORMONES",
    price: 97,
    regularPrice: 197,
    isFree: false,
    isPublished: false,
    isFeatured: false,
    difficulty: "BEGINNER" as const,
    certificateType: "CERTIFICATION" as const,
    learningOutcomes: [
      "Master foundational concepts",
      "Apply practical techniques with clients",
      "Earn professional certification",
      "Build your practice"
    ],
  },
  {
    title: "Certified Women's Thyroid Health Specialist™",
    slug: "womens-thyroid-health-specialist",
    description: "Become a Certified Women's Thyroid Health Specialist™ and transform lives with evidence-based training.",
    shortDescription: "Professional certification in WOMEN'S HEALTH & HORMONES",
    price: 97,
    regularPrice: 197,
    isFree: false,
    isPublished: false,
    isFeatured: false,
    difficulty: "BEGINNER" as const,
    certificateType: "CERTIFICATION" as const,
    learningOutcomes: [
      "Master foundational concepts",
      "Apply practical techniques with clients",
      "Earn professional certification",
      "Build your practice"
    ],
  },
];

// ========================================
// SEED FUNCTIONS
// ========================================

async function seedTags() {
  console.log('🏷️  Seeding MarketingTags...');
  
  for (const tag of purchaseTags) {
    await prisma.marketingTag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }
  
  console.log(`✅ Created/updated ${purchaseTags.length} marketing tags`);
}

async function seedCourses() {
  console.log('📚 Seeding Courses...');
  
  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: course,
    });
  }
  
  console.log(`✅ Created/updated ${courses.length} courses`);
}

async function main() {
  console.log('\n🌱 Starting seed...\n');
  
  await seedTags();
  await seedCourses();
  
  console.log('\n✨ Seed complete!\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
