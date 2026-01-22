/**
 * Seed Courses to Database (PARALLEL VERSION)
 * Reads course_blueprint.json and HTML lessons, creates Course/Module/Lesson records
 * Processes 5 courses concurrently for faster seeding
 * 
 * Usage: 
 *   npx tsx scripts/course-upload/seed-courses.ts              # Full run
 *   npx tsx scripts/course-upload/seed-courses.ts --start-from 14   # Resume from course 14
 *   npx tsx scripts/course-upload/seed-courses.ts --test        # Test mode (first course only)
 */

import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import pLimit from 'p-limit';

import {
    parseBlueprint,
    getAllCourseDirs,
    getTierSuffix,
    getTierFolder,
    getTierDisplayName,
    findLessonFiles,
    readLessonHtml,
    hasPdf,
} from './utils/parser';
import { getCoursePdfUrl, R2_CONFIG } from './utils/r2-client';
import { SOURCE_DIR, TIERS, COURSE_DEFAULTS } from './config';

// Concurrency limit - process 5 courses at once
const CONCURRENCY = 5;

// Initialize Prisma
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

interface SeedResult {
    courseSlug: string;
    tier: string;
    success: boolean;
    courseId?: string;
    modulesCreated?: number;
    lessonsCreated?: number;
    error?: string;
}

async function seedCourse(
    courseDir: string,
    tier: typeof TIERS[number]
): Promise<SeedResult> {
    const coursePath = path.join(SOURCE_DIR, courseDir);
    const tierFolder = getTierFolder(tier);
    const tierPath = path.join(coursePath, tierFolder);

    // Check if tier folder exists
    if (!fs.existsSync(tierPath)) {
        return {
            courseSlug: courseDir,
            tier,
            success: false,
            error: `Tier folder not found: ${tierFolder}`,
        };
    }

    try {
        // Parse blueprint
        const blueprint = parseBlueprint(coursePath);

        // Filter modules for this tier
        const tierModules = blueprint.modules.filter(m => m.tier === tier);

        if (tierModules.length === 0) {
            return {
                courseSlug: courseDir,
                tier,
                success: false,
                error: `No modules found for tier ${tier}`,
            };
        }

        // Generate slug
        const baseSlug = courseDir;
        const tierSuffix = getTierSuffix(tier);
        const courseSlug = `${baseSlug}${tierSuffix}`;

        // Generate title
        const tierName = getTierDisplayName(tier);
        const courseTitle = tier === 'L1'
            ? blueprint.course_name
            : `${blueprint.course_name} - ${tierName}`;

        // Check if PDF exists and get URL
        const pdfUrl = hasPdf(coursePath, tier)
            ? getCoursePdfUrl(courseDir, tier)
            : null;

        // Check for actual thumbnail image
        const thumbnailPath = path.join(tierPath, `${courseDir}_${tier.toLowerCase()}.png`);
        const thumbnailUrl = fs.existsSync(thumbnailPath)
            ? `${R2_CONFIG.publicUrl}/courses/${courseDir}/${tier.toLowerCase()}-thumbnail.png`
            : null;

        // Upsert course
        const course = await prisma.course.upsert({
            where: { slug: courseSlug },
            create: {
                title: courseTitle,
                slug: courseSlug,
                description: `${tierName} level of the ${blueprint.course_name} certification program. This comprehensive course covers ${tierModules.length} modules with ${tierModules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons.`,
                shortDescription: `${tierName} certification: ${tierModules.length} modules`,
                thumbnail: thumbnailUrl, // Use actual thumbnail if exists
                ...COURSE_DEFAULTS,
                certificateType: tier === 'L1' ? 'CERTIFICATION' : 'COMPLETION',
            },
            update: {
                title: courseTitle,
                description: `${tierName} level of the ${blueprint.course_name} certification program. This comprehensive course covers ${tierModules.length} modules with ${tierModules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons.`,
                isPublished: COURSE_DEFAULTS.isPublished,
            },
        });

        let modulesCreated = 0;
        let lessonsCreated = 0;

        // Create modules and lessons
        for (const moduleData of tierModules) {
            const moduleDir = path.join(tierPath, `Module_${String(moduleData.number).padStart(2, '0')}`);

            // Upsert module
            const existingModule = await prisma.module.findFirst({
                where: {
                    courseId: course.id,
                    order: moduleData.number,
                },
            });

            const module = existingModule
                ? await prisma.module.update({
                    where: { id: existingModule.id },
                    data: {
                        title: moduleData.title,
                        isPublished: COURSE_DEFAULTS.isPublished,
                    },
                })
                : await prisma.module.create({
                    data: {
                        courseId: course.id,
                        title: moduleData.title,
                        order: moduleData.number,
                        isPublished: COURSE_DEFAULTS.isPublished,
                    },
                });

            modulesCreated++;

            // Find and create lessons
            const lessonFiles = findLessonFiles(moduleDir);

            for (let i = 0; i < lessonFiles.length; i++) {
                const lessonFile = lessonFiles[i];
                const lessonPath = path.join(moduleDir, lessonFile);
                const htmlContent = readLessonHtml(lessonPath);

                // Extract title from filename
                const titleMatch = lessonFile.match(/Lesson_\d+\.\d+_(.+)\.html$/);
                const lessonTitle = titleMatch
                    ? titleMatch[1].replace(/_/g, ' ')
                    : `Lesson ${i + 1}`;

                // Upsert lesson
                const existingLesson = await prisma.lesson.findFirst({
                    where: {
                        moduleId: module.id,
                        order: i,
                    },
                });

                if (existingLesson) {
                    await prisma.lesson.update({
                        where: { id: existingLesson.id },
                        data: {
                            title: lessonTitle,
                            content: htmlContent,
                            isPublished: COURSE_DEFAULTS.isPublished,
                            lessonType: 'TEXT',
                        },
                    });
                } else {
                    await prisma.lesson.create({
                        data: {
                            moduleId: module.id,
                            title: lessonTitle,
                            content: htmlContent,
                            order: i,
                            isPublished: COURSE_DEFAULTS.isPublished,
                            lessonType: 'TEXT',
                        },
                    });
                }

                lessonsCreated++;
            }
        }

        return {
            courseSlug,
            tier,
            success: true,
            courseId: course.id,
            modulesCreated,
            lessonsCreated,
        };

    } catch (error) {
        return {
            courseSlug: courseDir,
            tier,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// Process all tiers for a single course
async function processCourse(courseDir: string, index: number, total: number): Promise<SeedResult[]> {
    console.log(`\n📦 [${index + 1}/${total}] Processing: ${courseDir}`);

    const results: SeedResult[] = [];

    for (const tier of TIERS) {
        const result = await seedCourse(courseDir, tier);
        results.push(result);

        if (result.success) {
            console.log(`   ✅ ${tier}: ${result.modulesCreated} modules, ${result.lessonsCreated} lessons`);
        } else {
            console.log(`   ⏭️  ${tier}: ${result.error}`);
        }
    }

    return results;
}

async function main() {
    console.log('🚀 Starting Course Seeding (PARALLEL MODE)');
    console.log(`⚡ Concurrency: ${CONCURRENCY} courses at once`);
    console.log('📁 Source:', SOURCE_DIR);
    console.log('');

    const courseDirs = getAllCourseDirs(SOURCE_DIR);
    console.log(`📚 Found ${courseDirs.length} course directories`);

    // Parse --start-from flag
    const startFromArg = process.argv.find(arg => arg.startsWith('--start-from'));
    let startFrom = 0;
    if (startFromArg) {
        const match = startFromArg.match(/--start-from[=\s]?(\d+)/);
        if (match) {
            startFrom = parseInt(match[1]);
        } else {
            const nextArg = process.argv[process.argv.indexOf('--start-from') + 1];
            if (nextArg && !isNaN(parseInt(nextArg))) {
                startFrom = parseInt(nextArg);
            }
        }
    }

    // Process single course for testing first (can be changed to all)
    const testMode = process.argv.includes('--test');
    let coursesToProcess = testMode ? courseDirs.slice(0, 1) : courseDirs;

    if (startFrom > 0) {
        coursesToProcess = coursesToProcess.slice(startFrom);
        console.log(`⏩ Skipping first ${startFrom} courses, starting from: ${coursesToProcess[0]}`);
    }

    if (testMode) {
        console.log('⚠️  TEST MODE: Processing only first course');
    }

    const startTime = Date.now();
    const limit = pLimit(CONCURRENCY);

    // Process courses in parallel with concurrency limit
    const allResults = await Promise.all(
        coursesToProcess.map((courseDir, idx) =>
            limit(() => processCourse(courseDir, startFrom + idx, courseDirs.length))
        )
    );

    // Flatten results
    const results = allResults.flat();
    const success = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

    // Summary
    console.log('\n');
    console.log('═'.repeat(50));
    console.log('📊 Seeding Summary');
    console.log('═'.repeat(50));
    console.log(`✅ Success: ${success}`);
    console.log(`❌ Failed/Skipped: ${failed}`);
    console.log(`⏱️  Duration: ${duration} minutes`);

    const totalModules = results.filter(r => r.success).reduce((sum, r) => sum + (r.modulesCreated || 0), 0);
    const totalLessons = results.filter(r => r.success).reduce((sum, r) => sum + (r.lessonsCreated || 0), 0);
    console.log(`📦 Modules: ${totalModules}`);
    console.log(`📄 Lessons: ${totalLessons}`);

    // Save results
    const resultsPath = path.join(__dirname, 'seed-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 Results saved: ${resultsPath}`);

    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});

