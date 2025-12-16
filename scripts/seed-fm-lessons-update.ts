import prisma from "../src/lib/prisma";

/**
 * Seed script to update FM Certification lessons to match FM-Update content
 * Each module has 8 lessons (except Module 0 with 4)
 */

const COURSE_SLUG = "functional-medicine-complete-certification";

// Lesson titles based on FM-Update folder structure
const LESSON_DATA: Record<number, string[]> = {
  0: [
    "Welcome To Your Certification Journey",
    "How This Program Works",
    "Setting Up For Success",
    "Your Learning Roadmap And Community",
  ],
  1: [
    "Introduction To Functional Medicine",
    "What Is Functional Medicine And Why It Matters",
    "Systems Biology And Root Cause Thinking",
    "The Functional Medicine Timeline",
    "The Functional Medicine Matrix",
    "The Power of the Patient Story",
    "Conventional Vs Functional Approach",
    "Case Studies: Seeing The Whole Picture",
  ],
  2: [
    "Introduction To Health Coaching",
    "Building Trust And Rapport",
    "Active Listening And Presence",
    "The Art Of Powerful Questions",
    "Motivational Interviewing And OARS",
    "Stages Of Change And Behavior Science",
    "Goal Setting And Action Planning",
    "Case Studies: Coaching In Action",
  ],
  3: [
    "Introduction To Clinical Assessment",
    "Conducting A Comprehensive Health History",
    "Building The Functional Medicine Timeline",
    "Symptom Clustering And Pattern Recognition",
    "Red Flags: When To Refer",
    "Structuring Your First Session",
    "Documentation And Follow-Up Systems",
    "Case Studies: Intake Mastery",
  ],
  4: [
    "Introduction To Professional Practice",
    "Understanding Your Scope Of Practice",
    "Legal Considerations For Health Coaches",
    "Ethical Guidelines And Boundaries",
    "Working With Healthcare Providers",
    "Confidentiality And Client Rights",
    "Building A Referral Network",
    "Case Studies: Navigating Ethical Dilemmas",
  ],
  5: [
    "Introduction To Functional Nutrition",
    "Macronutrients Demystified",
    "Blood Sugar Balance And Metabolic Health",
    "Anti-Inflammatory Eating",
    "Food Sensitivities And Elimination Diets",
    "Therapeutic Diets In Functional Medicine",
    "Practical Nutrition Coaching Strategies",
    "Case Studies: Nutrition In Action",
  ],
  6: [
    "Introduction To Gut Health",
    "The Microbiome: Your Inner Ecosystem",
    "The 5R Protocol For Gut Restoration",
    "Leaky Gut & Intestinal Permeability",
    "SIBO And Digestive Dysfunction",
    "Supporting Digestion Naturally",
    "The Gut-Brain Connection",
    "Case Studies: Gut Healing In Action",
  ],
  7: [
    "Introduction To Stress And The Stress Response",
    "The HPA Axis And Cortisol Patterns",
    "The Autonomic Nervous System",
    "Practical Stress Management Strategies",
    "Adrenal Support And HPA Axis Recovery",
    "The Stress-Hormone Connection",
    "Building Stress Resilience Over Time",
    "Case Studies: Stress And Adrenal Health",
  ],
  8: [
    "Introduction To Sleep And Circadian Rhythms",
    "Common Sleep Disruptors",
    "Sleep Hygiene Foundations",
    "Nutritional Support For Sleep",
    "Sleep And Hormones",
    "Cognitive Behavioral Strategies For Sleep",
    "Special Populations And Sleep Challenges",
    "Case Studies: Sleep Transformation",
  ],
  9: [
    "Introduction To Female Hormones",
    "The Menstrual Cycle Decoded",
    "Common Hormonal Imbalances",
    "PMS And PMDD",
    "PCOS: A Functional Medicine Approach",
    "Supporting Estrogen Balance",
    "Natural Progesterone Support",
    "Case Studies: Women's Hormone Health",
  ],
  10: [
    "Understanding Perimenopause",
    "The Symptom Spectrum Of Perimenopause",
    "Lifestyle Foundations For The Menopausal Transition",
    "Supplements For Perimenopausal Support",
    "Understanding Hormone Therapy Options",
    "Postmenopause: Thriving In The Next Chapter",
    "Special Considerations In Menopause",
    "Case Studies: Menopause",
  ],
  11: [
    "Introduction To Thyroid Function",
    "Common Thyroid Disorders",
    "Thyroid Testing And Interpretation",
    "Root Causes Of Thyroid Dysfunction",
    "Nutrition For Thyroid Health",
    "Lifestyle Strategies For Thyroid Support",
    "Working With Thyroid Medication",
    "Case Studies: Thyroid Health",
  ],
  12: [
    "Understanding Metabolism",
    "Insulin Resistance And Blood Sugar Regulation",
    "Root Causes Of Weight Gain",
    "Sustainable Approaches To Weight Management",
    "Dietary Approaches For Metabolic Health",
    "Body Composition And Movement",
    "Medications And Supplements For Metabolic Health",
    "Case Studies: Metabolic Health",
  ],
  13: [
    "Understanding The Immune System",
    "Common Autoimmune Conditions",
    "Root Causes Of Immune Dysfunction",
    "Anti-Inflammatory Nutrition",
    "Lifestyle Strategies For Immune Balance",
    "Gut Health And Autoimmunity",
    "Supplements For Immune Support",
    "Case Studies: Autoimmunity",
  ],
  14: [
    "The Brain-Body Connection",
    "Neurotransmitters And Brain Chemistry",
    "Anxiety And Depression: Root Causes",
    "Cognitive Function And Brain Fog",
    "Sleep And Mental Health",
    "Nutrition For Brain Health",
    "Lifestyle Medicine For Mental Wellness",
    "Case Studies: Mental Health",
  ],
  15: [
    "Understanding Cardiovascular Disease",
    "Blood Pressure And Vascular Health",
    "Cholesterol And Lipids: Beyond The Basics",
    "Blood Sugar And Diabetes Prevention",
    "Nutrition For Heart Health",
    "Exercise And Cardiovascular Fitness",
    "Stress, Sleep And Heart Health",
    "Case Studies: Cardiometabolic Health",
  ],
  16: [
    "Understanding Cellular Energy Production",
    "The Fatigue Epidemic",
    "Nutrition For Optimal Energy",
    "Exercise And Mitochondrial Biogenesis",
    "Sleep And Cellular Restoration",
    "Stress, Cortisol And Energy Depletion",
    "Supplements For Mitochondrial Support",
    "Case Studies: Energy And Mitochondrial Health",
  ],
  17: [
    "Understanding Environmental Toxins",
    "The Body's Detoxification Systems",
    "Nutrition For Detoxification Support",
    "Reducing Toxic Exposures In Daily Life",
    "Lifestyle Practices That Support Detoxification",
    "Supplements For Detoxification Support",
    "Mold Illness And Environmental Sensitivity",
    "Case Studies: Detoxification",
  ],
  18: [
    "Introduction To Functional Lab Testing",
    "Blood Chemistry Basics",
    "Complete Blood Count Interpretation",
    "Thyroid Testing",
    "Lipid Panels And Cardiovascular Markers",
    "Hormone Testing",
    "Gut And Microbiome Testing",
    "Case Studies In Lab Interpretation",
  ],
  19: [
    "Introduction To Protocol Building",
    "Client Assessment And Goal Setting",
    "Nutrition Protocol Design",
    "Lifestyle Protocol Design",
    "Supplement Guidance Within Scope",
    "Program Sequencing And Phasing",
    "Tracking Progress And Adjusting",
    "Case Studies: Protocol Building",
  ],
  20: [
    "Introduction To Practice Building",
    "Defining Your Niche And Ideal Client",
    "Creating Coaching Packages And Pricing",
    "Marketing Foundations And Client Attraction",
    "Consultation Process And Client Enrollment",
    "Practice Systems And Operations",
    "Building Referral Networks",
    "Sustainable Growth And Practice Evolution",
  ],
};

async function seedFMLessonsUpdate() {
  console.log("🌱 Starting FM Certification Lessons Update...\n");

  // Find the course
  const course = await prisma.course.findFirst({
    where: { slug: COURSE_SLUG },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
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

  let totalLessonsUpdated = 0;
  let totalLessonsCreated = 0;
  let totalLessonsDeleted = 0;

  for (const module of course.modules) {
    // Skip Final Exam module (21) - it has no lessons, just a quiz
    if (module.order === 21) {
      console.log(`\n📝 Module ${module.order}: ${module.title} (Final Exam - skipping lessons)`);
      continue;
    }

    const lessonTitles = LESSON_DATA[module.order];
    if (!lessonTitles) {
      console.log(`\n⚠️ No lesson data for Module ${module.order}`);
      continue;
    }

    console.log(`\n📝 Module ${module.order}: ${module.title}`);
    console.log(`   Target lessons: ${lessonTitles.length}, Current lessons: ${module.lessons.length}`);

    // Update existing lessons or create new ones
    for (let i = 0; i < lessonTitles.length; i++) {
      const order = i + 1;
      const title = lessonTitles[i];
      const existingLesson = module.lessons.find((l) => l.order === order);

      if (existingLesson) {
        // Update existing lesson
        await prisma.lesson.update({
          where: { id: existingLesson.id },
          data: {
            title,
            isPublished: true,
          },
        });
        console.log(`   ✅ Updated lesson ${order}: ${title}`);
        totalLessonsUpdated++;
      } else {
        // Create new lesson
        await prisma.lesson.create({
          data: {
            moduleId: module.id,
            title,
            order,
            lessonType: "TEXT",
            isPublished: true,
            isFreePreview: module.order === 0 || (module.order === 1 && order === 1),
          },
        });
        console.log(`   ➕ Created lesson ${order}: ${title}`);
        totalLessonsCreated++;
      }
    }

    // Delete extra lessons beyond the target count
    const extraLessons = module.lessons.filter((l) => l.order > lessonTitles.length);
    for (const lesson of extraLessons) {
      await prisma.lesson.delete({
        where: { id: lesson.id },
      });
      console.log(`   🗑️ Deleted extra lesson ${lesson.order}: ${lesson.title}`);
      totalLessonsDeleted++;
    }
  }

  console.log("\n✨ FM Certification Lessons Update complete!");
  console.log(`   Updated: ${totalLessonsUpdated} lessons`);
  console.log(`   Created: ${totalLessonsCreated} lessons`);
  console.log(`   Deleted: ${totalLessonsDeleted} lessons`);

  // Calculate totals
  const totalLessons = Object.values(LESSON_DATA).reduce((sum, lessons) => sum + lessons.length, 0);
  console.log(`\n📊 Total lessons in course: ${totalLessons}`);
}

seedFMLessonsUpdate()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
