import { PrismaClient, Difficulty, LessonType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

/**
 * Pro Accelerator Course Seeder
 * 
 * Creates 3 courses from the fm-pro-accelerator content:
 * 1. Advanced Clinical DEPTH (Modules 22-29)
 * 2. Master DEPTH (Modules 30-35)
 * 3. Practice Path (Modules 36-42)
 * 
 * All 3 courses are enrolled when user purchases fm-pro-accelerator OTO1
 */

const COURSES_BASE_PATH = './courses/fm-pro-accelerator';

// Course definitions
const PRO_ACCELERATOR_COURSES = [
    {
        slug: 'fm-pro-advanced-clinical',
        title: 'Advanced Clinical DEPTH',
        description: 'Deep clinical application of the DEPTH Model, advanced pattern recognition, complex case analysis.',
        folder: '01_Advanced_Clinical_DEPTH',
        moduleRange: [22, 29],
        color: '#1565C0', // Blue
    },
    {
        slug: 'fm-pro-master-depth',
        title: 'Master DEPTH',
        description: 'Advanced clinical mastery, case analysis expertise, professional authority, specialty development.',
        folder: '02_Master_DEPTH',
        moduleRange: [30, 35],
        color: '#6A1B9A', // Purple
    },
    {
        slug: 'fm-pro-practice-path',
        title: 'Practice Path',
        description: 'Practice operations, clinical protocols, case applications, business building, growth strategies.',
        folder: '03_Practice_Path',
        moduleRange: [36, 42],
        color: '#2E7D32', // Green
    },
];

// Module titles for each course
const MODULE_TITLES: Record<number, string> = {
    // Advanced Clinical DEPTH (22-29)
    22: 'Multi-System Assessment',
    23: 'Advanced Lab Interpretation',
    24: 'The 7 Master Patterns - Foundations',
    25: 'Pattern Stacking & Prioritization',
    26: 'Treatment Protocol Foundations',
    27: 'Advanced Treatment Strategies',
    28: 'Client Management Excellence',
    29: 'Clinical Integration & Transition',
    // Master DEPTH (30-35)
    30: 'Case Analysis Mastery',
    31: 'Clinical Authority Building',
    32: 'Professional Excellence',
    33: 'Specialty Practice Development',
    34: 'Deep Clinical Patterns',
    35: 'Systems Integration & Mastery',
    // Practice Path (36-42)
    36: 'Practice Foundations',
    37: 'Clinical Protocols',
    38: 'Case Applications',
    39: 'Business Building',
    40: 'Growth & Scaling',
    41: 'Advanced Specialization',
    42: 'Certification Capstone',
};

function getModuleFolders(basePath: string): string[] {
    try {
        const folders = fs.readdirSync(basePath);
        return folders
            .filter(f => f.startsWith('Module_'))
            .sort((a, b) => {
                const numA = parseInt(a.replace('Module_', ''));
                const numB = parseInt(b.replace('Module_', ''));
                return numA - numB;
            });
    } catch {
        return [];
    }
}

function getLessonFiles(modulePath: string): string[] {
    try {
        const files = fs.readdirSync(modulePath);
        return files
            .filter(f => f.startsWith('Lesson_') && f.endsWith('.html'))
            .sort((a, b) => {
                // Sort by lesson number (e.g., Lesson_22.1 before Lesson_22.2)
                const matchA = a.match(/Lesson_(\d+)\.(\d+)/);
                const matchB = b.match(/Lesson_(\d+)\.(\d+)/);
                if (matchA && matchB) {
                    const lessonA = parseFloat(`${matchA[1]}.${matchA[2]}`);
                    const lessonB = parseFloat(`${matchB[1]}.${matchB[2]}`);
                    return lessonA - lessonB;
                }
                return a.localeCompare(b);
            });
    } catch {
        return [];
    }
}

function extractLessonTitle(filename: string): string {
    // Extract title from filename like "Lesson_22.1_Multi_System_Client_Assessment.html"
    const match = filename.match(/Lesson_\d+\.\d+_(.+)\.html/);
    if (match) {
        return match[1].replace(/_/g, ' ');
    }
    return filename.replace('.html', '').replace(/_/g, ' ');
}

async function seedProAcceleratorCourses() {
    console.log('🚀 Starting Pro Accelerator Course Seeder...\n');

    for (const courseConfig of PRO_ACCELERATOR_COURSES) {
        console.log(`\n📚 Creating course: ${courseConfig.title}`);
        console.log(`   Slug: ${courseConfig.slug}`);
        console.log(`   Folder: ${courseConfig.folder}`);
        console.log(`   Modules: ${courseConfig.moduleRange[0]}-${courseConfig.moduleRange[1]}`);

        // Check if course already exists
        const existingCourse = await prisma.course.findUnique({
            where: { slug: courseConfig.slug },
        });

        if (existingCourse) {
            console.log(`   ⚠️  Course already exists, skipping...`);
            continue;
        }

        // Create the course
        const course = await prisma.course.create({
            data: {
                title: courseConfig.title,
                slug: courseConfig.slug,
                description: courseConfig.description,
                difficulty: Difficulty.ADVANCED,
                duration: 2400, // 40 hours
                isPublished: true,
                isFeatured: false,
                price: 0, // Part of bundle
                thumbnail: `/images/courses/${courseConfig.slug}.jpg`,
                previewVideo: null,
            },
        });

        console.log(`   ✅ Course created: ${course.id}`);

        // Create course analytics
        await prisma.courseAnalytics.create({
            data: {
                courseId: course.id,
                totalEnrolled: 0,
            },
        });

        // Get module folders
        const trackPath = path.join(COURSES_BASE_PATH, courseConfig.folder);
        const moduleFolders = getModuleFolders(trackPath);

        console.log(`   📁 Found ${moduleFolders.length} module folders`);

        let moduleOrder = 0;
        let totalLessons = 0;

        for (const moduleFolder of moduleFolders) {
            const moduleNum = parseInt(moduleFolder.replace('Module_', ''));

            // Skip if not in range for this course
            if (moduleNum < courseConfig.moduleRange[0] || moduleNum > courseConfig.moduleRange[1]) {
                continue;
            }

            const moduleTitle = MODULE_TITLES[moduleNum] || `Module ${moduleNum}`;
            const modulePath = path.join(trackPath, moduleFolder);

            console.log(`      📂 Module ${moduleNum}: ${moduleTitle}`);

            // Create module
            const module = await prisma.module.create({
                data: {
                    courseId: course.id,
                    title: `Module ${moduleNum}: ${moduleTitle}`,
                    description: `Advanced training in ${moduleTitle.toLowerCase()}`,
                    order: moduleOrder,
                    isPublished: true,
                },
            });

            // Get lesson files
            const lessonFiles = getLessonFiles(modulePath);
            console.log(`         Found ${lessonFiles.length} lessons`);

            let lessonOrder = 0;

            for (const lessonFile of lessonFiles) {
                const lessonTitle = extractLessonTitle(lessonFile);
                const lessonPath = path.join(modulePath, lessonFile);

                // Read HTML content
                let htmlContent = '';
                try {
                    htmlContent = fs.readFileSync(lessonPath, 'utf-8');
                } catch (e) {
                    console.error(`         ❌ Could not read: ${lessonFile}`);
                    continue;
                }

                // Create lesson
                await prisma.lesson.create({
                    data: {
                        moduleId: module.id,
                        title: lessonTitle,
                        description: `Lesson ${moduleNum}.${lessonOrder + 1}`,
                        order: lessonOrder,
                        lessonType: LessonType.TEXT,
                        content: htmlContent,
                        isPublished: true,
                        isFreePreview: false,
                    },
                });

                lessonOrder++;
                totalLessons++;
            }

            moduleOrder++;
        }

        console.log(`   ✅ Created ${moduleOrder} modules with ${totalLessons} lessons`);
    }

    // Create the bundle tag mapping
    console.log('\n🏷️  Creating Pro Accelerator tag...');

    await prisma.tag.upsert({
        where: { slug: 'fm_pro_accelerator_purchased' },
        update: {},
        create: {
            name: 'FM Pro Accelerator Purchased',
            slug: 'fm_pro_accelerator_purchased',
        },
    });

    console.log('\n✅ Pro Accelerator seeding complete!');
    console.log('\n📋 Summary:');
    console.log('   - fm-pro-advanced-clinical (Modules 22-29)');
    console.log('   - fm-pro-master-depth (Modules 30-35)');
    console.log('   - fm-pro-practice-path (Modules 36-42)');
    console.log('\n⚠️  Remember to update the webhook to enroll in all 3 courses!');
}

seedProAcceleratorCourses()
    .catch((error) => {
        console.error('Error seeding:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
