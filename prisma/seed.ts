import { PrismaClient, UserRole, Difficulty, CertificateType, LessonType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed for Functional Medicine courses...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.userBadge.deleteMany({});
  await prisma.userStreak.deleteMany({});
  await prisma.badge.deleteMany({});
  await prisma.courseReview.deleteMany({});
  await prisma.moduleProgress.deleteMany({});
  await prisma.courseTag.deleteMany({});
  await prisma.lessonProgress.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.module.deleteMany({});
  await prisma.courseAnalytics.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.postComment.deleteMany({});
  await prisma.communityPost.deleteMany({});

  // Create Admin User
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@accredipro-certificate.com' },
    update: {},
    create: {
      email: 'admin@accredipro-certificate.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'AccrediPro',
      role: UserRole.ADMIN,
      emailVerified: new Date(),
      isActive: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create Coach (for 1:1 mentorship)
  const coachPassword = await bcrypt.hash('Coach123!', 12);
  const coach = await prisma.user.upsert({
    where: { email: 'coach@accredipro-certificate.com' },
    update: {
      firstName: 'Dr. Sarah',
      lastName: 'Mitchell',
      bio: 'Board-certified Functional Medicine practitioner with 15+ years experience. Passionate about helping health professionals integrate functional medicine into their practice.',
    },
    create: {
      email: 'coach@accredipro-certificate.com',
      passwordHash: coachPassword,
      firstName: 'Dr. Sarah',
      lastName: 'Mitchell',
      role: UserRole.MENTOR,
      emailVerified: new Date(),
      isActive: true,
      bio: 'Board-certified Functional Medicine practitioner with 15+ years experience. Passionate about helping health professionals integrate functional medicine into their practice.',
    },
  });
  console.log('✅ Coach created:', coach.email);

  // Create Instructor
  const instructorPassword = await bcrypt.hash('Instructor123!', 12);
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@accredipro-certificate.com' },
    update: {
      firstName: 'Dr. Emily',
      lastName: 'Chen',
      bio: 'Leading expert in Functional Medicine education. Author of "The Functional Approach" and founder of the Institute for Integrative Health.',
    },
    create: {
      email: 'instructor@accredipro-certificate.com',
      passwordHash: instructorPassword,
      firstName: 'Dr. Emily',
      lastName: 'Chen',
      role: UserRole.INSTRUCTOR,
      emailVerified: new Date(),
      isActive: true,
      bio: 'Leading expert in Functional Medicine education. Author of "The Functional Approach" and founder of the Institute for Integrative Health.',
    },
  });
  console.log('✅ Instructor created:', instructor.email);

  // Create Demo Student
  const studentPassword = await bcrypt.hash('Student123!', 12);
  const student = await prisma.user.upsert({
    where: { email: 'student@accredipro-certificate.com' },
    update: {},
    create: {
      email: 'student@accredipro-certificate.com',
      passwordHash: studentPassword,
      firstName: 'Jennifer',
      lastName: 'Smith',
      role: UserRole.STUDENT,
      emailVerified: new Date(),
      isActive: true,
    },
  });
  console.log('✅ Student created:', student.email);

  // Create Functional Medicine Category
  const fmCategory = await prisma.category.upsert({
    where: { slug: 'functional-medicine' },
    update: {},
    create: {
      name: 'Functional Medicine',
      slug: 'functional-medicine',
      description: 'Comprehensive functional medicine education and certifications',
      icon: '🩺',
      color: '#722F37',
      order: 1,
    },
  });
  console.log('✅ Category created');

  // Create Tags
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { slug: 'certification' }, update: {}, create: { name: 'Certification', slug: 'certification' } }),
    prisma.tag.upsert({ where: { slug: 'mini-diploma' }, update: {}, create: { name: 'Mini Diploma', slug: 'mini-diploma' } }),
    prisma.tag.upsert({ where: { slug: 'popular' }, update: {}, create: { name: 'Popular', slug: 'popular' } }),
    prisma.tag.upsert({ where: { slug: 'featured' }, update: {}, create: { name: 'Featured', slug: 'featured' } }),
  ]);
  console.log('✅ Tags created');

  // ===============================
  // COURSE 1: Functional Medicine Certification
  // ===============================
  const course1 = await prisma.course.create({
    data: {
      title: 'Functional Medicine Certification',
      slug: 'functional-medicine-certification',
      description: `Transform your healthcare practice with our comprehensive Functional Medicine Certification program.

This certification program covers:
• Root Cause Analysis - Learn to identify underlying causes of chronic conditions
• Systems Biology Approach - Understand the interconnected nature of body systems
• Personalized Treatment Plans - Develop individualized protocols for patients
• Nutritional Interventions - Master evidence-based nutritional strategies
• Lifestyle Medicine Integration - Incorporate sleep, stress, and movement protocols
• Lab Interpretation - Advanced functional medicine testing and analysis

Upon completion, you'll earn the AccrediPro Functional Medicine Certification, recognized by leading healthcare institutions.

This certification is ideal for:
- Healthcare practitioners seeking to expand their practice
- Nurses and health coaches wanting specialized knowledge
- Wellness professionals looking for evidence-based credentials`,
      shortDescription: 'Become a certified Functional Medicine practitioner with our comprehensive certification program.',
      price: 997,
      isFree: false,
      isPublished: true,
      isFeatured: true,
      difficulty: Difficulty.INTERMEDIATE,
      duration: 2400, // 40 hours
      certificateType: CertificateType.CERTIFICATION,
      category: { connect: { id: fmCategory.id } },
      coach: { connect: { id: coach.id } },
      publishedAt: new Date(),
    },
  });

  // Module 1: Foundations
  const module1_1 = await prisma.module.create({
    data: {
      title: 'Module 1: Foundations of Functional Medicine',
      description: 'Understanding the core principles and philosophy of functional medicine',
      order: 1,
      isPublished: true,
      courseId: course1.id,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        title: 'Welcome to Functional Medicine',
        description: 'Introduction to the certification program and your learning journey.',
        order: 1,
        isPublished: true,
        isFreePreview: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 600,
        moduleId: module1_1.id,
      },
      {
        title: 'The Functional Medicine Model',
        description: 'Understanding the FM model vs conventional medicine approach.',
        order: 2,
        isPublished: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 900,
        moduleId: module1_1.id,
      },
      {
        title: 'The 5 Root Causes of Disease',
        description: 'Deep dive into the five main root causes: inflammation, toxicity, infections, stress, and nutritional deficiencies.',
        order: 3,
        isPublished: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 1200,
        moduleId: module1_1.id,
      },
      {
        title: 'Patient Timeline Development',
        description: 'Learn to create comprehensive patient timelines for root cause analysis.',
        order: 4,
        isPublished: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 720,
        moduleId: module1_1.id,
      },
      {
        title: 'Module 1 Assessment',
        description: 'Test your understanding of functional medicine foundations.',
        order: 5,
        isPublished: true,
        lessonType: LessonType.QUIZ,
        moduleId: module1_1.id,
      },
    ],
  });

  // Module 2: Systems Biology
  const module1_2 = await prisma.module.create({
    data: {
      title: 'Module 2: Systems Biology & Interconnections',
      description: 'Understanding how body systems interact and influence each other',
      order: 2,
      isPublished: true,
      courseId: course1.id,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        title: 'The Gut-Brain Connection',
        description: 'Understanding the microbiome and its impact on mental health.',
        order: 1,
        isPublished: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 1080,
        moduleId: module1_2.id,
      },
      {
        title: 'Hormonal Balance & Metabolism',
        description: 'The interconnected endocrine system and metabolic health.',
        order: 2,
        isPublished: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 960,
        moduleId: module1_2.id,
      },
      {
        title: 'Immune System Regulation',
        description: 'Understanding autoimmunity and immune modulation.',
        order: 3,
        isPublished: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 900,
        moduleId: module1_2.id,
      },
      {
        title: 'Detoxification Pathways',
        description: 'Liver detox phases and supporting natural detoxification.',
        order: 4,
        isPublished: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 840,
        moduleId: module1_2.id,
      },
    ],
  });

  // Module 3: Clinical Application
  const module1_3 = await prisma.module.create({
    data: {
      title: 'Module 3: Clinical Application & Protocols',
      description: 'Practical application and treatment protocols',
      order: 3,
      isPublished: true,
      courseId: course1.id,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        title: 'Functional Lab Testing',
        description: 'Comprehensive guide to functional medicine lab panels.',
        order: 1,
        isPublished: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 1200,
        moduleId: module1_3.id,
      },
      {
        title: 'Creating Treatment Protocols',
        description: 'Step-by-step guide to developing personalized protocols.',
        order: 2,
        isPublished: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 1080,
        moduleId: module1_3.id,
      },
      {
        title: 'Nutritional Interventions',
        description: 'Evidence-based nutritional protocols for common conditions.',
        order: 3,
        isPublished: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 960,
        moduleId: module1_3.id,
      },
      {
        title: 'Case Study Analysis',
        description: 'Real-world case studies and clinical reasoning.',
        order: 4,
        isPublished: true,
        lessonType: LessonType.TEXT,
        moduleId: module1_3.id,
      },
      {
        title: 'Final Certification Exam',
        description: 'Complete your certification with the final assessment.',
        order: 5,
        isPublished: true,
        lessonType: LessonType.QUIZ,
        moduleId: module1_3.id,
      },
    ],
  });

  console.log('✅ Functional Medicine Certification course created');

  // ===============================
  // COURSE 2: Functional Medicine Mini Diploma
  // ===============================
  const course2 = await prisma.course.create({
    data: {
      title: 'Functional Medicine Mini Diploma',
      slug: 'functional-medicine-mini-diploma',
      description: `Earn your Mini Diploma in Functional Medicine - a comprehensive program designed for healthcare professionals seeking advanced credentials.

This advanced program covers:
• Advanced Diagnostics - Complex case analysis and differential diagnosis
• Specialized Protocols - Condition-specific treatment approaches
• Practice Integration - Implementing FM in clinical settings
• Research & Evidence - Staying current with latest research
• Business of FM - Building a successful functional medicine practice

The Mini Diploma represents mastery of functional medicine principles and clinical application.

Prerequisites:
- Functional Medicine Certification (recommended)
- Healthcare background or equivalent experience`,
      shortDescription: 'Advanced Mini Diploma program for mastering Functional Medicine practice.',
      price: 1497,
      isFree: false,
      isPublished: true,
      isFeatured: true,
      difficulty: Difficulty.ADVANCED,
      duration: 4800, // 80 hours
      certificateType: CertificateType.MINI_DIPLOMA,
      category: { connect: { id: fmCategory.id } },
      coach: { connect: { id: coach.id } },
      publishedAt: new Date(),
    },
  });

  // Module 1: Advanced Diagnostics
  const module2_1 = await prisma.module.create({
    data: {
      title: 'Module 1: Advanced Diagnostic Methods',
      description: 'Master complex diagnostic techniques and interpretation',
      order: 1,
      isPublished: true,
      courseId: course2.id,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        title: 'Welcome to the Mini Diploma',
        description: 'Program overview and advanced learning objectives.',
        order: 1,
        isPublished: true,
        isFreePreview: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 480,
        moduleId: module2_1.id,
      },
      {
        title: 'Advanced Lab Interpretation',
        description: 'Complex patterns and multi-system analysis.',
        order: 2,
        isPublished: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 1500,
        moduleId: module2_1.id,
      },
      {
        title: 'Genetic Testing & SNPs',
        description: 'Understanding methylation and genetic predispositions.',
        order: 3,
        isPublished: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 1200,
        moduleId: module2_1.id,
      },
      {
        title: 'Microbiome Analysis',
        description: 'GI mapping and comprehensive stool analysis interpretation.',
        order: 4,
        isPublished: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 1080,
        moduleId: module2_1.id,
      },
    ],
  });

  // Module 2: Specialized Protocols
  const module2_2 = await prisma.module.create({
    data: {
      title: 'Module 2: Specialized Treatment Protocols',
      description: 'Condition-specific advanced treatment approaches',
      order: 2,
      isPublished: true,
      courseId: course2.id,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        title: 'Autoimmune Protocols',
        description: 'Managing autoimmune conditions with functional approaches.',
        order: 1,
        isPublished: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 1320,
        moduleId: module2_2.id,
      },
      {
        title: 'Metabolic Syndrome & Diabetes',
        description: 'Reversing metabolic dysfunction naturally.',
        order: 2,
        isPublished: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 1200,
        moduleId: module2_2.id,
      },
      {
        title: 'Hormonal Restoration',
        description: 'Advanced hormone balancing protocols.',
        order: 3,
        isPublished: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 1140,
        moduleId: module2_2.id,
      },
      {
        title: 'Neurological Conditions',
        description: 'Brain health and cognitive optimization.',
        order: 4,
        isPublished: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 1080,
        moduleId: module2_2.id,
      },
    ],
  });

  // Module 3: Practice Building
  const module2_3 = await prisma.module.create({
    data: {
      title: 'Module 3: Building Your FM Practice',
      description: 'Business and practice development',
      order: 3,
      isPublished: true,
      courseId: course2.id,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        title: 'Practice Models & Setup',
        description: 'Different practice models and getting started.',
        order: 1,
        isPublished: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 900,
        moduleId: module2_3.id,
      },
      {
        title: 'Patient Journey & Experience',
        description: 'Creating exceptional patient experiences.',
        order: 2,
        isPublished: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 720,
        moduleId: module2_3.id,
      },
      {
        title: 'Marketing Your Practice',
        description: 'Ethical marketing for functional medicine practices.',
        order: 3,
        isPublished: true,
        lessonType: LessonType.VIDEO,
        videoDuration: 840,
        moduleId: module2_3.id,
      },
      {
        title: 'Final Diploma Project',
        description: 'Submit your comprehensive case study for diploma completion.',
        order: 4,
        isPublished: true,
        lessonType: LessonType.ASSIGNMENT,
        moduleId: module2_3.id,
      },
    ],
  });

  console.log('✅ Functional Medicine Mini Diploma course created');

  // Add course tags
  const certTag = tags.find(t => t.slug === 'certification');
  const diplomaTag = tags.find(t => t.slug === 'mini-diploma');
  const popularTag = tags.find(t => t.slug === 'popular');
  const featuredTag = tags.find(t => t.slug === 'featured');

  await prisma.courseTag.createMany({
    data: [
      { courseId: course1.id, tagId: certTag!.id },
      { courseId: course1.id, tagId: popularTag!.id },
      { courseId: course1.id, tagId: featuredTag!.id },
      { courseId: course2.id, tagId: diplomaTag!.id },
      { courseId: course2.id, tagId: popularTag!.id },
      { courseId: course2.id, tagId: featuredTag!.id },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Course tags assigned');

  // Enroll demo student in certification course
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course1.id,
      progress: 25,
    },
  });

  console.log('✅ Demo student enrolled');

  // Create a welcome community post
  await prisma.communityPost.create({
    data: {
      title: 'Welcome to the Functional Medicine Community!',
      content: `Welcome to the AccrediPro Functional Medicine Community!

This is your space to connect with fellow practitioners, share insights, and support each other on your functional medicine journey.

Here you can:
- Share clinical insights and case discussions
- Ask questions and get peer support
- Network with other functional medicine practitioners
- Stay updated on the latest research and protocols

We're excited to have you here. Feel free to introduce yourself and let us know what brought you to functional medicine!

To your health and success,
The AccrediPro Team`,
      isPinned: true,
      authorId: admin.id,
    },
  });

  console.log('✅ Welcome community post created');

  // Create course analytics with requested 870 enrollments
  await Promise.all([
    prisma.courseAnalytics.create({
      data: {
        courseId: course1.id,
        totalEnrolled: 870,
        totalCompleted: 743,
        avgProgress: 85.4,
        avgRating: 4.9,
        totalRevenue: 867390,
      },
    }),
    prisma.courseAnalytics.create({
      data: {
        courseId: course2.id,
        totalEnrolled: 412,
        totalCompleted: 298,
        avgProgress: 72.5,
        avgRating: 4.8,
        totalRevenue: 616764,
      },
    }),
  ]);

  console.log('✅ Course analytics created');

  // ===============================
  // CREATE BADGES
  // ===============================
  const badges = await Promise.all([
    prisma.badge.upsert({
      where: { slug: 'first-lesson' },
      update: {},
      create: {
        name: 'First Step',
        slug: 'first-lesson',
        description: 'Complete your first lesson',
        icon: '🎯',
        color: '#10B981',
        criteria: 'complete_1_lesson',
        points: 10,
      },
    }),
    prisma.badge.upsert({
      where: { slug: 'module_master' },
      update: {},
      create: {
        name: 'Module Master',
        slug: 'module_master',
        description: 'Complete an entire module',
        icon: '📚',
        color: '#6366F1',
        criteria: 'complete_module',
        points: 50,
      },
    }),
    prisma.badge.upsert({
      where: { slug: 'course_graduate' },
      update: {},
      create: {
        name: 'Course Graduate',
        slug: 'course_graduate',
        description: 'Complete an entire course',
        icon: '🎓',
        color: '#722F37',
        criteria: 'complete_course',
        points: 200,
      },
    }),
    prisma.badge.upsert({
      where: { slug: 'week_warrior' },
      update: {},
      create: {
        name: 'Week Warrior',
        slug: 'week_warrior',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        color: '#EF4444',
        criteria: '7_day_streak',
        points: 75,
      },
    }),
    prisma.badge.upsert({
      where: { slug: 'monthly_master' },
      update: {},
      create: {
        name: 'Monthly Master',
        slug: 'monthly_master',
        description: 'Maintain a 30-day learning streak',
        icon: '⭐',
        color: '#D4AF37',
        criteria: '30_day_streak',
        points: 300,
      },
    }),
    prisma.badge.upsert({
      where: { slug: 'early-bird' },
      update: {},
      create: {
        name: 'Early Bird',
        slug: 'early-bird',
        description: 'Be among the first 100 to enroll',
        icon: '🌅',
        color: '#F59E0B',
        criteria: 'first_100_enrollment',
        points: 50,
      },
    }),
    prisma.badge.upsert({
      where: { slug: 'community-contributor' },
      update: {},
      create: {
        name: 'Community Contributor',
        slug: 'community-contributor',
        description: 'Make 5 community posts',
        icon: '💬',
        color: '#8B5CF6',
        criteria: '5_community_posts',
        points: 25,
      },
    }),
    prisma.badge.upsert({
      where: { slug: 'knowledge-seeker' },
      update: {},
      create: {
        name: 'Knowledge Seeker',
        slug: 'knowledge-seeker',
        description: 'Complete 25 lessons',
        icon: '📖',
        color: '#0EA5E9',
        criteria: 'complete_25_lessons',
        points: 100,
      },
    }),
  ]);

  console.log('✅ Badges created');

  // ===============================
  // CREATE SAMPLE STUDENTS FOR REVIEWS
  // ===============================
  const reviewerNames = [
    { first: 'Dr. Michael', last: 'Anderson', email: 'michael.anderson@example.com' },
    { first: 'Dr. Lisa', last: 'Thompson', email: 'lisa.thompson@example.com' },
    { first: 'Dr. James', last: 'Wilson', email: 'james.wilson@example.com' },
    { first: 'Dr. Patricia', last: 'Garcia', email: 'patricia.garcia@example.com' },
    { first: 'Dr. Robert', last: 'Martinez', email: 'robert.martinez@example.com' },
    { first: 'Sarah', last: 'Johnson, NP', email: 'sarah.johnson@example.com' },
    { first: 'Dr. Emily', last: 'Brown', email: 'emily.brown@example.com' },
    { first: 'Dr. David', last: 'Lee', email: 'david.lee@example.com' },
    { first: 'Michelle', last: 'Davis, RN', email: 'michelle.davis@example.com' },
    { first: 'Dr. Jennifer', last: 'Taylor', email: 'jennifer.taylor@example.com' },
  ];

  const samplePassword = await bcrypt.hash('Sample123!', 12);
  const reviewers = await Promise.all(
    reviewerNames.map((name) =>
      prisma.user.upsert({
        where: { email: name.email },
        update: {},
        create: {
          email: name.email,
          passwordHash: samplePassword,
          firstName: name.first,
          lastName: name.last,
          role: UserRole.STUDENT,
          emailVerified: new Date(),
          isActive: true,
        },
      })
    )
  );

  console.log('✅ Sample reviewers created');

  // ===============================
  // CREATE COURSE REVIEWS (4.9 stars average)
  // ===============================
  const reviews = [
    {
      rating: 5,
      title: 'Life-Changing Certification',
      content: 'This certification completely transformed my practice. The depth of knowledge and practical application is unmatched. Dr. Mitchell\'s coaching was invaluable throughout the journey. I\'ve already implemented several protocols with amazing patient outcomes.',
    },
    {
      rating: 5,
      title: 'Exceeded All Expectations',
      content: 'As a traditional medicine practitioner for 20 years, I was skeptical about functional medicine. This course opened my eyes to a whole new approach. The evidence-based curriculum and real-world case studies made the learning practical and applicable.',
    },
    {
      rating: 5,
      title: 'Best Investment in My Career',
      content: 'The ROI on this certification has been incredible. Within 3 months of completing the program, I\'ve attracted new patients specifically seeking functional medicine approaches. The content is comprehensive and the support is outstanding.',
    },
    {
      rating: 5,
      title: 'Comprehensive and Practical',
      content: 'I\'ve taken many online courses, but AccrediPro stands out for its quality. The video lessons are professionally produced, the materials are thorough, and the community support is genuine. Highly recommend for any healthcare professional.',
    },
    {
      rating: 4,
      title: 'Excellent Content, Great Support',
      content: 'The course material is excellent and well-structured. The only reason for 4 stars instead of 5 is I wish there were more live Q&A sessions. That said, the 1:1 coaching more than makes up for it. Great program overall!',
    },
    {
      rating: 5,
      title: 'Gold Standard in FM Education',
      content: 'After researching multiple functional medicine certifications, I chose AccrediPro and couldn\'t be happier. The curriculum is evidence-based, the instructors are world-class, and the certification is recognized in the industry.',
    },
    {
      rating: 5,
      title: 'Transformed My Patient Outcomes',
      content: 'Since completing this certification, my patient outcomes have dramatically improved. The root cause analysis approach taught in this course has helped me identify issues I was previously missing. My patients are healthier and more satisfied.',
    },
    {
      rating: 5,
      title: 'Worth Every Penny',
      content: 'I was hesitant about the investment, but this certification has paid for itself many times over. The knowledge, credentials, and ongoing support have elevated my practice to a new level. Thank you, AccrediPro!',
    },
    {
      rating: 5,
      title: 'Perfect for Nurses & Health Coaches',
      content: 'As a nurse practitioner, this certification gave me the specialized knowledge I needed to offer functional medicine services. The curriculum is accessible yet thorough, and the credential has boosted my credibility significantly.',
    },
    {
      rating: 5,
      title: 'Outstanding Learning Experience',
      content: 'The platform is easy to use, the content is engaging, and the pace is perfect for working professionals. I completed the certification while maintaining my full patient load. The flexibility and quality are unmatched.',
    },
  ];

  await Promise.all(
    reviews.map((review, index) =>
      prisma.courseReview.create({
        data: {
          userId: reviewers[index].id,
          courseId: course1.id,
          rating: review.rating,
          title: review.title,
          content: review.content,
          isPublic: true,
          isVerified: true,
        },
      })
    )
  );

  // Add some reviews for the Mini Diploma too
  const miniDiplomaReviews = [
    {
      rating: 5,
      title: 'Advanced Knowledge, Expert Delivery',
      content: 'After completing the certification, the Mini Diploma took my skills to the next level. The advanced protocols and genetic testing modules were particularly valuable for my practice.',
    },
    {
      rating: 5,
      title: 'Perfect Follow-Up to Certification',
      content: 'The Mini Diploma builds perfectly on the certification foundation. The business building module alone was worth the investment. I\'ve significantly grown my practice since completing the program.',
    },
    {
      rating: 5,
      title: 'Expert-Level Content',
      content: 'This program delivers on its promise of advanced education. The autoimmune protocols and neurological modules have been game-changers for my complex cases.',
    },
    {
      rating: 4,
      title: 'Challenging but Rewarding',
      content: 'Be prepared to work hard - this isn\'t a casual course. The depth of material requires dedication, but the expertise you gain is invaluable. My diagnostic accuracy has improved dramatically.',
    },
    {
      rating: 5,
      title: 'The Ultimate FM Credential',
      content: 'The Mini Diploma credential has opened doors I didn\'t know existed. Speaking invitations, partnership opportunities, and patient referrals have all increased since earning this diploma.',
    },
  ];

  await Promise.all(
    miniDiplomaReviews.map((review, index) =>
      prisma.courseReview.create({
        data: {
          userId: reviewers[index].id,
          courseId: course2.id,
          rating: review.rating,
          title: review.title,
          content: review.content,
          isPublic: true,
          isVerified: true,
        },
      })
    )
  );

  console.log('✅ Course reviews created');

  // Give demo student some badges and streak
  await prisma.userStreak.create({
    data: {
      userId: student.id,
      currentStreak: 5,
      longestStreak: 12,
      totalPoints: 185,
      lastActiveAt: new Date(),
    },
  });

  const firstLessonBadge = badges.find(b => b.slug === 'first-lesson');
  const moduleMasterBadge = badges.find(b => b.slug === 'module_master');

  if (firstLessonBadge && moduleMasterBadge) {
    await prisma.userBadge.createMany({
      data: [
        { userId: student.id, badgeId: firstLessonBadge.id },
        { userId: student.id, badgeId: moduleMasterBadge.id },
      ],
    });
  }

  console.log('✅ Demo student gamification setup complete');

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('📋 Login Credentials:');
  console.log('─────────────────────────────────────────');
  console.log('Admin:      admin@accredipro-certificate.com / Admin123!');
  console.log('Coach:      coach@accredipro-certificate.com / Coach123!');
  console.log('Instructor: instructor@accredipro-certificate.com / Instructor123!');
  console.log('Student:    student@accredipro-certificate.com / Student123!');
  console.log('─────────────────────────────────────────\n');
  console.log('📚 Courses Created:');
  console.log('1. Functional Medicine Certification ($997)');
  console.log('2. Functional Medicine Mini Diploma ($1,497)');
  console.log('─────────────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
