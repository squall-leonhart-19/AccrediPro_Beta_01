import { PrismaClient, Difficulty, LessonType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// FM Preview course - Module 0 & 1 only (free lead magnet from exit popup)
const FM_PREVIEW_MODULES = [
    {
        title: 'Module 0: Welcome & Foundations',
        description: 'Get oriented with the FM Certification program and understand the functional medicine framework',
        lessons: [
            { title: 'Welcome to FM Certification', desc: 'Your journey to becoming a certified FM coach', duration: 600, type: 'VIDEO' as LessonType },
            { title: 'What is Functional Medicine?', desc: 'Understanding the root-cause approach to health', duration: 720, type: 'VIDEO' as LessonType },
            { title: 'The FM Coach Mindset', desc: 'How to think like a functional medicine practitioner', duration: 480, type: 'VIDEO' as LessonType },
        ]
    },
    {
        title: 'Module 1: Core FM Principles',
        description: 'Master the 5 pillars of Functional Medicine coaching and learn how to apply them with clients',
        lessons: [
            { title: 'The 5 Pillars Overview', desc: 'Introduction to the foundational FM principles', duration: 900, type: 'VIDEO' as LessonType },
            { title: 'Systems Thinking in Health', desc: 'How body systems interconnect and influence each other', duration: 720, type: 'VIDEO' as LessonType },
            { title: 'Root Cause Analysis Framework', desc: 'The methodology for identifying underlying causes', duration: 1080, type: 'VIDEO' as LessonType },
            { title: 'Client-Centered Assessment', desc: 'Conducting effective discovery conversations', duration: 840, type: 'VIDEO' as LessonType },
            { title: 'Creating Action Plans', desc: 'Building personalized protocols for clients', duration: 960, type: 'VIDEO' as LessonType },
        ]
    },
];

async function seedFMPreview() {
    console.log('🌱 Seeding FM Preview course...');

    // Check if FM Preview course already exists
    const existing = await prisma.course.findFirst({
        where: { slug: 'fm-preview' }
    });

    if (existing) {
        console.log('✅ FM Preview course already exists, skipping...');
        return;
    }

    // Create the FM Preview course
    const course = await prisma.course.create({
        data: {
            slug: 'fm-preview',
            title: 'FM Certification Preview',
            description: 'Get a taste of the full Functional Medicine Certification with free access to the first two modules. Complete these modules to see if FM coaching is right for you.',
            shortDescription: 'Preview the FM Certification with Module 0 & 1 free',
            thumbnail: '/courses/fm-preview-thumb.jpg',
            duration: 100, // ~100 minutes total
            difficulty: Difficulty.BEGINNER,
            price: 0, // Free
            isFree: true,
            isPublished: true,
            isFeatured: false,
        }
    });

    console.log(`✅ Created course: ${course.title} (${course.slug})`);

    // Create modules and lessons
    for (let moduleIndex = 0; moduleIndex < FM_PREVIEW_MODULES.length; moduleIndex++) {
        const moduleData = FM_PREVIEW_MODULES[moduleIndex];

        const module = await prisma.module.create({
            data: {
                courseId: course.id,
                title: moduleData.title,
                description: moduleData.description,
                order: moduleIndex,
                isPublished: true,
            }
        });

        console.log(`  📦 Created module: ${module.title}`);

        // Create lessons for this module
        for (let lessonIndex = 0; lessonIndex < moduleData.lessons.length; lessonIndex++) {
            const lessonData = moduleData.lessons[lessonIndex];

            const lesson = await prisma.lesson.create({
                data: {
                    moduleId: module.id,
                    title: lessonData.title,
                    description: lessonData.desc,
                    content: `<p>Lesson content for: ${lessonData.title}</p><p>${lessonData.desc}</p>`,
                    lessonType: lessonData.type,
                    videoDuration: lessonData.duration,
                    order: lessonIndex,
                    isPublished: true,
                    isFreePreview: true, // All lessons are free in preview
                }
            });

            console.log(`    📝 Created lesson: ${lesson.title}`);
        }
    }

    // Create marketing tag for FM Preview optin
    await prisma.marketingTag.upsert({
        where: { slug: 'fm_preview_optin' },
        update: {},
        create: {
            name: 'FM Preview Optin',
            slug: 'fm_preview_optin',
            description: 'User opted in to FM Preview (Module 0 & 1) via exit popup',
        }
    });

    console.log('✅ Created marketing tag: fm_preview_optin');

    // Create course analytics entry
    await prisma.courseAnalytics.create({
        data: {
            courseId: course.id,
            totalEnrolled: 0,
            totalCompleted: 0,
            avgProgress: 0,
            avgRating: 0,
        }
    });

    console.log('✅ Created course analytics');

    console.log('\n🎉 FM Preview course seeded successfully!');
    console.log(`\nCourse ID: ${course.id}`);
    console.log(`Course Slug: ${course.slug}`);
    console.log(`Total Modules: ${FM_PREVIEW_MODULES.length}`);
    console.log(`Total Lessons: ${FM_PREVIEW_MODULES.reduce((sum, m) => sum + m.lessons.length, 0)}`);
}

seedFMPreview()
    .catch((error) => {
        console.error('Error seeding FM Preview:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
