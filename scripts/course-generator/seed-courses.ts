import { PrismaClient, Difficulty, CertificateType, LessonType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs/promises';
import * as path from 'path';
import 'dotenv/config';
import { generateEnhancedLessonContent } from './lesson-content-generator';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

interface GeneratedCourse {
    level: string;
    course: {
        title: string;
        slug: string;
        description: string;
        shortDescription: string;
        price: number;
        duration: number;
    };
    modules: Array<{
        title: string;
        description: string;
        lessons: Array<{
            title: string;
            description: string;
            duration: number;
            isFreePreview?: boolean;
            lessonType?: string;
        }>;
    }>;
    niche: {
        name: string;
        slug: string;
        category: string;
        categorySlug: string;
        targetAudience?: string;
        keyBenefit?: string;
        primaryProblem?: string;
    };
}

function getDifficulty(level: string): Difficulty {
    switch (level) {
        case 'mini-diploma': return Difficulty.BEGINNER;
        case 'foundation': return Difficulty.INTERMEDIATE;
        case 'practitioner-bundle': return Difficulty.ADVANCED;
        case 'income-accelerator': return Difficulty.INTERMEDIATE;
        default: return Difficulty.INTERMEDIATE;
    }
}

function getCertificateType(level: string): CertificateType {
    switch (level) {
        case 'mini-diploma': return CertificateType.MINI_DIPLOMA;
        default: return CertificateType.CERTIFICATION;
    }
}

function getLessonType(type?: string): LessonType {
    if (type === 'QUIZ') return LessonType.QUIZ;
    return LessonType.TEXT;
}

async function deleteCourseIfExists(slug: string): Promise<void> {
    const existingCourse = await prisma.course.findUnique({
        where: { slug },
        include: { modules: { include: { lessons: true } } }
    });

    if (existingCourse) {
        console.log(`   🗑️ Deleting existing course: ${slug}`);
        // Delete in order: lessons -> modules -> analytics -> course
        for (const module of existingCourse.modules) {
            await prisma.lesson.deleteMany({ where: { moduleId: module.id } });
        }
        await prisma.module.deleteMany({ where: { courseId: existingCourse.id } });
        await prisma.courseAnalytics.deleteMany({ where: { courseId: existingCourse.id } });
        await prisma.course.delete({ where: { id: existingCourse.id } });
    }
}

async function seedCourse(courseData: GeneratedCourse, forceRecreate = false): Promise<void> {
    const { course, modules, niche, level } = courseData;

    console.log(`\n📚 Seeding: ${course.title}`);

    // Get or create category
    let category = await prisma.category.findFirst({
        where: { slug: niche.categorySlug },
    });

    if (!category) {
        category = await prisma.category.create({
            data: {
                name: niche.category,
                slug: niche.categorySlug,
                description: `Courses related to ${niche.category}`,
                isActive: true,
            },
        });
        console.log(`   ✅ Created category: ${category.name}`);
    }

    // Get coach
    const coach = await prisma.user.findFirst({
        where: { email: 'coach@accredipro-certificate.com' },
    });

    // Handle existing course
    if (forceRecreate) {
        await deleteCourseIfExists(course.slug);
    } else {
        const existingCourse = await prisma.course.findUnique({
            where: { slug: course.slug },
        });
        if (existingCourse) {
            console.log(`   ⚠️ Course "${course.slug}" already exists. Use --force to recreate.`);
            return;
        }
    }

    // Create course
    const createdCourse = await prisma.course.create({
        data: {
            title: course.title,
            slug: course.slug,
            description: course.description,
            shortDescription: course.shortDescription,
            price: course.price,
            isFree: course.price === 0,
            isPublished: true,
            isFeatured: level === 'foundation',
            difficulty: getDifficulty(level),
            duration: Math.floor(course.duration / 60),
            certificateType: getCertificateType(level),
            categoryId: category.id,
            coachId: coach?.id,
            publishedAt: new Date(),
        },
    });

    console.log(`   ✅ Created course: ${createdCourse.title}`);

    // Niche defaults for content generation
    const targetAudience = niche.targetAudience || 'women seeking transformation';
    const keyBenefit = niche.keyBenefit || 'improved health and wellbeing';
    const primaryProblem = niche.primaryProblem || 'health challenges';

    // Create modules and lessons
    let totalLessons = 0;
    for (let i = 0; i < modules.length; i++) {
        const moduleData = modules[i];

        const createdModule = await prisma.module.create({
            data: {
                title: moduleData.title,
                description: moduleData.description,
                order: i + 1,
                isPublished: true,
                courseId: createdCourse.id,
            },
        });

        // Create lessons with enhanced content
        for (let j = 0; j < moduleData.lessons.length; j++) {
            const lessonData = moduleData.lessons[j];
            const isFirstLesson = i === 0 && j === 0;
            const isQuiz = lessonData.lessonType === 'QUIZ';

            // Generate enhanced content
            const content = generateEnhancedLessonContent({
                lessonTitle: lessonData.title,
                lessonDescription: lessonData.description,
                nicheName: niche.name,
                moduleNumber: i + 1,
                lessonNumber: j + 1,
                targetAudience,
                keyBenefit,
                primaryProblem,
                isFirstLesson,
                isQuiz,
            });

            await prisma.lesson.create({
                data: {
                    title: lessonData.title,
                    description: lessonData.description,
                    content,
                    order: j + 1,
                    isPublished: true,
                    isFreePreview: lessonData.isFreePreview || false,
                    lessonType: getLessonType(lessonData.lessonType),
                    videoDuration: lessonData.duration,
                    moduleId: createdModule.id,
                },
            });
            totalLessons++;
        }

        console.log(`   📖 Module ${i + 1}: ${moduleData.title} (${moduleData.lessons.length} lessons)`);
    }

    // Create course analytics
    await prisma.courseAnalytics.create({
        data: {
            courseId: createdCourse.id,
            totalEnrolled: Math.floor(Math.random() * 200) + 50,
            totalCompleted: Math.floor(Math.random() * 30) + 5,
            avgProgress: Math.floor(Math.random() * 30) + 20,
            avgRating: 4.5 + Math.random() * 0.5,
        },
    });

    console.log(`   ✅ Total lessons: ${totalLessons}`);
}

async function main() {
    const args = process.argv.slice(2);
    const inputArg = args.find(a => a.startsWith('--input='))?.split('=')[1];
    const forceRecreate = args.includes('--force');

    if (!inputArg) {
        console.log('Usage: npx tsx seed-courses.ts --input=./output/gut-health-mini-diploma.json [--force]');
        console.log('       npx tsx seed-courses.ts --input=./output --force  (recreate all courses)');
        process.exit(1);
    }

    const inputPath = path.resolve(process.cwd(), inputArg);
    const stat = await fs.stat(inputPath);

    let files: string[];

    if (stat.isDirectory()) {
        const allFiles = await fs.readdir(inputPath);
        files = allFiles.filter(f => f.endsWith('.json')).map(f => path.join(inputPath, f));
    } else {
        files = [inputPath];
    }

    console.log(`\n🌱 Seeding ${files.length} course(s) to database...${forceRecreate ? ' (force recreate)' : ''}\n`);

    for (const file of files) {
        try {
            const content = await fs.readFile(file, 'utf-8');
            const courseData: GeneratedCourse = JSON.parse(content);
            await seedCourse(courseData, forceRecreate);
        } catch (error) {
            console.error(`Error seeding ${file}:`, error);
        }
    }

    console.log('\n✅ Seeding complete!\n');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
