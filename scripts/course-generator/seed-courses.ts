/**
 * Seed Courses to Database
 * Takes generated course JSON files and creates database entries
 */

import { PrismaClient, Difficulty, CertificateType, LessonType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs/promises';
import * as path from 'path';
import 'dotenv/config';

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

async function seedCourse(courseData: GeneratedCourse): Promise<void> {
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

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
        where: { slug: course.slug },
    });

    if (existingCourse) {
        console.log(`   ⚠️ Course "${course.slug}" already exists. Skipping...`);
        return;
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
            duration: Math.floor(course.duration / 60), // Convert to minutes
            certificateType: getCertificateType(level),
            categoryId: category.id,
            coachId: coach?.id,
            publishedAt: new Date(),
        },
    });

    console.log(`   ✅ Created course: ${createdCourse.title}`);

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

        // Create lessons
        for (let j = 0; j < moduleData.lessons.length; j++) {
            const lessonData = moduleData.lessons[j];

            await prisma.lesson.create({
                data: {
                    title: lessonData.title,
                    description: lessonData.description,
                    content: generateLessonContent(lessonData.title, lessonData.description, niche.name),
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

function generateLessonContent(title: string, description: string, nicheName: string): string {
    // Generate basic placeholder HTML content
    // In production, this could be enhanced with AI-generated content
    return `
<div class="lesson-content" style="font-family: Georgia, serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.8; color: #333;">
  <h1 style="color: #722F37; font-size: 2.5em; margin-bottom: 10px;">${title}</h1>
  <p style="color: #666; font-size: 1.1em; margin-bottom: 30px; border-left: 4px solid #722F37; padding-left: 15px;">${description}</p>
  
  <div style="background: linear-gradient(135deg, #f8f4f0 0%, #fff 100%); padding: 30px; border-radius: 12px; margin-bottom: 30px;">
    <h2 style="color: #722F37; margin-top: 0;">Welcome to This Lesson</h2>
    <p>In this lesson, you'll learn about ${title.toLowerCase()} and how it applies to your ${nicheName} practice.</p>
    <p>By the end of this lesson, you'll have a solid understanding of the key concepts and be able to apply them with your clients.</p>
  </div>

  <h2 style="color: #722F37;">Key Learning Objectives</h2>
  <ul style="list-style-type: none; padding: 0;">
    <li style="padding: 10px 0; border-bottom: 1px solid #eee;">✅ Understand the core principles of ${title.toLowerCase()}</li>
    <li style="padding: 10px 0; border-bottom: 1px solid #eee;">✅ Learn practical applications for your ${nicheName} practice</li>
    <li style="padding: 10px 0; border-bottom: 1px solid #eee;">✅ Gain confidence in explaining these concepts to clients</li>
  </ul>

  <div style="background: #722F37; color: white; padding: 20px 30px; border-radius: 8px; margin-top: 40px;">
    <h3 style="margin: 0 0 10px 0; color: white;">📝 Key Takeaway</h3>
    <p style="margin: 0; opacity: 0.95;">${description}</p>
  </div>
</div>
  `.trim();
}

async function main() {
    const args = process.argv.slice(2);
    const inputArg = args.find(a => a.startsWith('--input='))?.split('=')[1];

    if (!inputArg) {
        console.log('Usage: npx tsx seed-courses.ts --input=./output/gut-health-mini-diploma.json');
        console.log('       npx tsx seed-courses.ts --input=./output  (seeds all JSON files in directory)');
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

    console.log(`\n🌱 Seeding ${files.length} course(s) to database...\n`);

    for (const file of files) {
        try {
            const content = await fs.readFile(file, 'utf-8');
            const courseData: GeneratedCourse = JSON.parse(content);
            await seedCourse(courseData);
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
