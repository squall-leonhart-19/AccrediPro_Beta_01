import { PrismaClient, Difficulty, TagCategory, LessonType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/**
 * FM Certification Launch Seed Script
 *
 * Creates:
 * 1. FM Certification course (full 12 modules - $197 Christmas offer)
 * 2. FM Pro Accelerator course (OTO1 - $397)
 * 3. FM 10-Client Guarantee course (OTO2 - $297)
 * 4. Marketing tags for all products
 */

// FM Certification - 12 Modules (simplified from 21 for launch)
const FM_CERTIFICATION_MODULES = [
    {
        title: 'Module 0: Welcome & Orientation',
        description: 'Your journey to becoming a certified FM practitioner',
        lessons: [
            { title: 'Welcome to FM Certification', desc: 'Program overview and your path to certification', duration: 600 },
            { title: 'How to Use This Platform', desc: 'Navigating your learning dashboard', duration: 300 },
            { title: 'Meet Your Instructor', desc: 'About Sarah Mitchell and the AccrediPro team', duration: 480 },
        ]
    },
    {
        title: 'Module 1: Foundations of Functional Medicine',
        description: 'Core philosophy and principles of functional medicine',
        lessons: [
            { title: 'What is Functional Medicine?', desc: 'The systems-based approach to health', duration: 900 },
            { title: 'The FM Model vs Conventional Medicine', desc: 'Key differences and integration points', duration: 720 },
            { title: 'The 5 Pillars of FM Coaching', desc: 'Framework for client transformation', duration: 840 },
            { title: 'Root Cause Thinking', desc: 'Finding the "why" behind symptoms', duration: 780 },
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
        title: 'Module 3: Client Assessment Framework',
        description: 'Comprehensive client evaluation techniques',
        lessons: [
            { title: 'The Functional Medicine Matrix', desc: 'Using the FM matrix for assessment', duration: 1200 },
            { title: 'Creating Client Timelines', desc: 'Mapping health history chronologically', duration: 900 },
            { title: 'Intake Forms & Questionnaires', desc: 'Essential assessment tools', duration: 720 },
            { title: 'The Discovery Consultation', desc: 'Conducting effective first appointments', duration: 840 },
        ]
    },
    {
        title: 'Module 4: Gut Health & Microbiome',
        description: 'The foundation of whole-body health',
        lessons: [
            { title: 'The Gut Microbiome', desc: 'Introduction to gut flora and diversity', duration: 1080 },
            { title: 'Leaky Gut Syndrome', desc: 'Intestinal permeability explained', duration: 960 },
            { title: 'The Gut-Brain Connection', desc: 'How gut health affects mood and cognition', duration: 900 },
            { title: 'The 5R Protocol', desc: 'Remove, Replace, Reinoculate, Repair, Rebalance', duration: 1200 },
        ]
    },
    {
        title: 'Module 5: Hormonal Balance',
        description: 'Comprehensive endocrine system understanding',
        lessons: [
            { title: 'Thyroid Dysfunction', desc: 'Hypothyroid, hyperthyroid, and Hashimoto\'s', duration: 1200 },
            { title: 'Adrenal Health', desc: 'Adrenal fatigue and HPA axis dysregulation', duration: 1080 },
            { title: 'Female Hormone Balance', desc: 'Estrogen, progesterone, and menstrual health', duration: 1140 },
            { title: 'Male Hormone Optimization', desc: 'Testosterone and male vitality', duration: 900 },
        ]
    },
    {
        title: 'Module 6: Metabolic Health & Energy',
        description: 'Blood sugar, weight, and energy optimization',
        lessons: [
            { title: 'Insulin Resistance', desc: 'The metabolic root of modern disease', duration: 1080 },
            { title: 'Metabolic Syndrome', desc: 'Assessment and reversal protocols', duration: 960 },
            { title: 'Energy Production', desc: 'Mitochondrial function and fatigue', duration: 900 },
            { title: 'Weight Management', desc: 'Beyond calories: hormones and metabolism', duration: 840 },
        ]
    },
    {
        title: 'Module 7: Immune System & Inflammation',
        description: 'Understanding immunity and autoimmunity',
        lessons: [
            { title: 'Immune System Basics', desc: 'Innate vs adaptive immunity', duration: 900 },
            { title: 'Autoimmune Conditions', desc: 'Why the body attacks itself', duration: 1200 },
            { title: 'Immune Modulation', desc: 'Balancing rather than boosting immunity', duration: 1020 },
            { title: 'Anti-Inflammatory Protocols', desc: 'Diet and lifestyle for reducing inflammation', duration: 1080 },
        ]
    },
    {
        title: 'Module 8: Detoxification & Environmental Health',
        description: 'Supporting the body\'s natural detox systems',
        lessons: [
            { title: 'Liver Detoxification Pathways', desc: 'Phase 1, 2, and 3 detox', duration: 1080 },
            { title: 'Environmental Toxin Exposure', desc: 'Common toxins and sources', duration: 960 },
            { title: 'Safe Detox Protocols', desc: 'Evidence-based detoxification support', duration: 1020 },
            { title: 'Reducing Toxic Load', desc: 'Practical strategies for clients', duration: 840 },
        ]
    },
    {
        title: 'Module 9: Nutritional Interventions',
        description: 'Evidence-based dietary approaches',
        lessons: [
            { title: 'Anti-Inflammatory Nutrition', desc: 'Foods that heal vs foods that harm', duration: 1080 },
            { title: 'Elimination Diets', desc: 'Identifying food sensitivities', duration: 900 },
            { title: 'Therapeutic Diets', desc: 'Keto, paleo, Mediterranean, and more', duration: 1020 },
            { title: 'Supplementation Protocols', desc: 'Strategic use of supplements', duration: 960 },
        ]
    },
    {
        title: 'Module 10: Lifestyle Medicine',
        description: 'Sleep, stress, and movement interventions',
        lessons: [
            { title: 'Sleep Optimization', desc: 'The foundation of health restoration', duration: 1020 },
            { title: 'Stress Management', desc: 'Practical stress reduction techniques', duration: 960 },
            { title: 'Movement & Exercise', desc: 'Exercise prescription for chronic conditions', duration: 900 },
            { title: 'Mind-Body Practices', desc: 'Meditation, breathwork, and nervous system regulation', duration: 840 },
        ]
    },
    {
        title: 'Module 11: Treatment Planning & Case Studies',
        description: 'Creating comprehensive client protocols',
        lessons: [
            { title: 'Protocol Design Principles', desc: 'Building effective treatment plans', duration: 1080 },
            { title: 'Case Study: Autoimmune', desc: 'Reversing Hashimoto\'s thyroiditis', duration: 1200 },
            { title: 'Case Study: Digestive', desc: 'Healing IBS and gut issues', duration: 1140 },
            { title: 'Case Study: Hormonal', desc: 'Balancing PCOS naturally', duration: 1080 },
        ]
    },
    {
        title: 'Module 12: Certification & Business Launch',
        description: 'Complete your certification and launch your practice',
        lessons: [
            { title: 'Final Assessment Preparation', desc: 'Review and exam prep', duration: 900 },
            { title: 'Building Your FM Practice', desc: 'Business models and positioning', duration: 1080 },
            { title: 'Getting Clients', desc: 'Marketing and client acquisition', duration: 960 },
            { title: 'Certification Completion', desc: 'Your certificate and next steps', duration: 600 },
        ]
    },
];

// OTO1: Pro Accelerator - 4 Modules
const PRO_ACCELERATOR_MODULES = [
    {
        title: 'Module 1: Advanced Client Acquisition',
        description: 'Master client attraction strategies',
        lessons: [
            { title: 'The $10K Client System', desc: 'Attracting high-ticket clients consistently', duration: 1200 },
            { title: 'Discovery Call Mastery', desc: 'Converting prospects to paying clients', duration: 1080 },
            { title: 'Pricing Your Services', desc: 'Premium pricing strategies that work', duration: 900 },
        ]
    },
    {
        title: 'Module 2: Group Coaching Mastery',
        description: 'Scale your impact with group programs',
        lessons: [
            { title: 'Designing Group Programs', desc: 'Creating transformational group experiences', duration: 1080 },
            { title: 'Launching Your First Group', desc: 'Step-by-step launch blueprint', duration: 1200 },
            { title: 'Managing Group Dynamics', desc: 'Facilitating powerful group sessions', duration: 960 },
        ]
    },
    {
        title: 'Module 3: Systems & Automation',
        description: 'Build a business that runs without you',
        lessons: [
            { title: 'Client Management Systems', desc: 'CRM and workflow automation', duration: 1020 },
            { title: 'Onboarding Automation', desc: 'Seamless client onboarding', duration: 840 },
            { title: 'Content & Marketing Systems', desc: 'Automated content delivery', duration: 960 },
        ]
    },
    {
        title: 'Module 4: Scaling to 6 Figures',
        description: 'The roadmap to $100K and beyond',
        lessons: [
            { title: 'The 6-Figure Business Model', desc: 'Revenue streams and offer stack', duration: 1080 },
            { title: 'Team Building Basics', desc: 'Your first hires and delegation', duration: 900 },
            { title: 'Maintaining Work-Life Balance', desc: 'Scaling sustainably', duration: 720 },
        ]
    },
];

// OTO2: 10-Client Guarantee - 3 Modules
const CLIENT_GUARANTEE_MODULES = [
    {
        title: 'Module 1: Client Attraction Accelerator',
        description: 'Get your first 10 clients in 90 days',
        lessons: [
            { title: 'The 10-Client Blueprint', desc: 'Your step-by-step action plan', duration: 1200 },
            { title: 'Ideal Client Identification', desc: 'Finding clients who need you most', duration: 960 },
            { title: 'Outreach Strategies', desc: 'Proactive client acquisition methods', duration: 1080 },
        ]
    },
    {
        title: 'Module 2: Social Proof & Referrals',
        description: 'Build a referral-based practice',
        lessons: [
            { title: 'Getting Testimonials', desc: 'Turn results into social proof', duration: 900 },
            { title: 'Referral Systems', desc: 'Create a stream of warm referrals', duration: 1020 },
            { title: 'Case Study Development', desc: 'Documenting client transformations', duration: 840 },
        ]
    },
    {
        title: 'Module 3: Weekly Accountability',
        description: 'Stay on track with weekly check-ins',
        lessons: [
            { title: 'Weekly Action Planning', desc: 'Focus on high-impact activities', duration: 600 },
            { title: 'Tracking Your Progress', desc: 'Metrics that matter', duration: 480 },
            { title: 'Troubleshooting Common Blocks', desc: 'Overcoming obstacles', duration: 720 },
        ]
    },
];

async function seedFMCertificationLaunch() {
    console.log('🚀 Seeding FM Certification Launch...\n');

    // 1. Create FM Certification course
    console.log('📦 Creating FM Certification course...');
    let fmCertCourse = await prisma.course.findFirst({ where: { slug: 'fm-certification' } });

    if (!fmCertCourse) {
        fmCertCourse = await prisma.course.create({
            data: {
                slug: 'fm-certification',
                title: 'Functional Medicine Certification',
                description: 'Complete FM Certification Program with 12 comprehensive modules. Become a certified Functional Medicine practitioner and transform your coaching career.',
                shortDescription: 'Full FM Certification - 12 Modules with Accreditation',
                thumbnail: '/courses/fm-certification-thumb.jpg',
                duration: 2400, // ~40 hours
                difficulty: Difficulty.INTERMEDIATE,
                price: 197, // Christmas offer
                isFree: false,
                isPublished: true,
                isFeatured: true,
            }
        });

        // Create modules and lessons
        for (let moduleIndex = 0; moduleIndex < FM_CERTIFICATION_MODULES.length; moduleIndex++) {
            const moduleData = FM_CERTIFICATION_MODULES[moduleIndex];
            const module = await prisma.module.create({
                data: {
                    courseId: fmCertCourse.id,
                    title: moduleData.title,
                    description: moduleData.description,
                    order: moduleIndex,
                    isPublished: true,
                }
            });

            for (let lessonIndex = 0; lessonIndex < moduleData.lessons.length; lessonIndex++) {
                const lessonData = moduleData.lessons[lessonIndex];
                await prisma.lesson.create({
                    data: {
                        moduleId: module.id,
                        title: lessonData.title,
                        description: lessonData.desc,
                        content: `<p>${lessonData.desc}</p>`,
                        lessonType: LessonType.VIDEO,
                        videoDuration: lessonData.duration,
                        order: lessonIndex,
                        isPublished: true,
                        isFreePreview: moduleIndex < 2, // Module 0 & 1 are free preview
                    }
                });
            }
        }

        await prisma.courseAnalytics.create({
            data: { courseId: fmCertCourse.id, totalEnrolled: 0, totalCompleted: 0, avgProgress: 0, avgRating: 0 }
        });

        console.log(`   ✅ Created: ${fmCertCourse.title} (${FM_CERTIFICATION_MODULES.length} modules)`);
    } else {
        console.log(`   ⏭️  Already exists: ${fmCertCourse.title}`);
    }

    // 2. Create Pro Accelerator course (OTO1)
    console.log('\n📦 Creating Pro Accelerator course (OTO1)...');
    let proAccCourse = await prisma.course.findFirst({ where: { slug: 'fm-pro-accelerator' } });

    if (!proAccCourse) {
        proAccCourse = await prisma.course.create({
            data: {
                slug: 'fm-pro-accelerator',
                title: 'FM Pro Accelerator',
                description: 'Advanced business training to scale your FM practice to 6 figures. Includes client acquisition, group coaching, and automation systems.',
                shortDescription: 'Scale your FM practice to 6 figures',
                thumbnail: '/courses/fm-pro-accelerator-thumb.jpg',
                duration: 600, // ~10 hours
                difficulty: Difficulty.ADVANCED,
                price: 397,
                isFree: false,
                isPublished: true,
                isFeatured: false,
            }
        });

        for (let moduleIndex = 0; moduleIndex < PRO_ACCELERATOR_MODULES.length; moduleIndex++) {
            const moduleData = PRO_ACCELERATOR_MODULES[moduleIndex];
            const module = await prisma.module.create({
                data: {
                    courseId: proAccCourse.id,
                    title: moduleData.title,
                    description: moduleData.description,
                    order: moduleIndex,
                    isPublished: true,
                }
            });

            for (let lessonIndex = 0; lessonIndex < moduleData.lessons.length; lessonIndex++) {
                const lessonData = moduleData.lessons[lessonIndex];
                await prisma.lesson.create({
                    data: {
                        moduleId: module.id,
                        title: lessonData.title,
                        description: lessonData.desc,
                        content: `<p>${lessonData.desc}</p>`,
                        lessonType: LessonType.VIDEO,
                        videoDuration: lessonData.duration,
                        order: lessonIndex,
                        isPublished: true,
                    }
                });
            }
        }

        await prisma.courseAnalytics.create({
            data: { courseId: proAccCourse.id, totalEnrolled: 0, totalCompleted: 0, avgProgress: 0, avgRating: 0 }
        });

        console.log(`   ✅ Created: ${proAccCourse.title} (${PRO_ACCELERATOR_MODULES.length} modules)`);
    } else {
        console.log(`   ⏭️  Already exists: ${proAccCourse.title}`);
    }

    // 3. Create 10-Client Guarantee course (OTO2)
    console.log('\n📦 Creating 10-Client Guarantee course (OTO2)...');
    let clientGuaranteeCourse = await prisma.course.findFirst({ where: { slug: 'fm-client-guarantee' } });

    if (!clientGuaranteeCourse) {
        clientGuaranteeCourse = await prisma.course.create({
            data: {
                slug: 'fm-client-guarantee',
                title: 'FM 10-Client Guarantee',
                description: 'Get your first 10 paying clients in 90 days or your money back. Includes weekly accountability and proven client acquisition systems.',
                shortDescription: '10 clients in 90 days guaranteed',
                thumbnail: '/courses/fm-client-guarantee-thumb.jpg',
                duration: 360, // ~6 hours
                difficulty: Difficulty.BEGINNER,
                price: 297,
                isFree: false,
                isPublished: true,
                isFeatured: false,
            }
        });

        for (let moduleIndex = 0; moduleIndex < CLIENT_GUARANTEE_MODULES.length; moduleIndex++) {
            const moduleData = CLIENT_GUARANTEE_MODULES[moduleIndex];
            const module = await prisma.module.create({
                data: {
                    courseId: clientGuaranteeCourse.id,
                    title: moduleData.title,
                    description: moduleData.description,
                    order: moduleIndex,
                    isPublished: true,
                }
            });

            for (let lessonIndex = 0; lessonIndex < moduleData.lessons.length; lessonIndex++) {
                const lessonData = moduleData.lessons[lessonIndex];
                await prisma.lesson.create({
                    data: {
                        moduleId: module.id,
                        title: lessonData.title,
                        description: lessonData.desc,
                        content: `<p>${lessonData.desc}</p>`,
                        lessonType: LessonType.VIDEO,
                        videoDuration: lessonData.duration,
                        order: lessonIndex,
                        isPublished: true,
                    }
                });
            }
        }

        await prisma.courseAnalytics.create({
            data: { courseId: clientGuaranteeCourse.id, totalEnrolled: 0, totalCompleted: 0, avgProgress: 0, avgRating: 0 }
        });

        console.log(`   ✅ Created: ${clientGuaranteeCourse.title} (${CLIENT_GUARANTEE_MODULES.length} modules)`);
    } else {
        console.log(`   ⏭️  Already exists: ${clientGuaranteeCourse.title}`);
    }

    // 4. Create marketing tags
    console.log('\n🏷️  Creating marketing tags...');

    const tags = [
        { name: 'FM Certification Purchased', slug: 'fm_certification_purchased', category: TagCategory.STAGE },
        { name: 'FM Pro Accelerator Purchased', slug: 'fm_pro_accelerator_purchased', category: TagCategory.STAGE },
        { name: 'FM Client Guarantee Purchased', slug: 'fm_client_guarantee_purchased', category: TagCategory.STAGE },
        { name: 'FM Certification Optin', slug: 'fm_certification_optin', category: TagCategory.STAGE },
        { name: 'FM Mini Diploma Purchased', slug: 'fm_mini_diploma_purchased', category: TagCategory.STAGE },
        { name: 'ClickFunnels Purchase', slug: 'clickfunnels_purchase', category: TagCategory.SOURCE },
    ];

    for (const tag of tags) {
        await prisma.marketingTag.upsert({
            where: { slug: tag.slug },
            update: {},
            create: {
                name: tag.name,
                slug: tag.slug,
                category: tag.category,
                description: `Auto-applied for ${tag.name}`,
            }
        });
        console.log(`   ✅ Tag: ${tag.slug}`);
    }

    console.log('\n🎉 FM Certification Launch seeding complete!');
    console.log('\nCourses created:');
    console.log(`   • fm-certification (${FM_CERTIFICATION_MODULES.length} modules, $197)`);
    console.log(`   • fm-pro-accelerator (${PRO_ACCELERATOR_MODULES.length} modules, $397)`);
    console.log(`   • fm-client-guarantee (${CLIENT_GUARANTEE_MODULES.length} modules, $297)`);
    console.log('\nSKUs for ClickFunnels:');
    console.log('   • fm-certification');
    console.log('   • fm-pro-accelerator');
    console.log('   • fm-client-guarantee');
}

seedFMCertificationLaunch()
    .catch((error) => {
        console.error('Error seeding:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
