/**
 * Certification Seeder - Seeds a certification from config + generated files
 * 
 * Usage: npx ts-node prisma/seed-certification.ts narc-recovery-coach
 */

import { PrismaClient, Difficulty, CertificateType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load config
const CONFIG_PATH = path.join(__dirname, '../docs/launch_steps/certifications.json');

interface CertConfig {
    name: string;
    short_name: string;
    methodology: {
        acronym: string;
        full_name: string;
        letters: { letter: string; meaning: string }[];
    };
    pixel: string;
    category: string;
    products: {
        certification: {
            sku: string;
            slug: string;
            price: number;
            tag: string;
        };
        pro_accelerator: {
            sku: string;
            price: number;
            tag: string;
            courses: { slug: string; tier: string; folder: string }[];
        };
    };
    folder: string;
}

async function loadConfig(certSlug: string): Promise<CertConfig | null> {
    const configData = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    return configData.certifications[certSlug] || null;
}

async function getOrCreateCategory(categoryName: string): Promise<string> {
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) return existing.id;

    const created = await prisma.category.create({
        data: {
            name: categoryName,
            slug,
            description: `${categoryName} certifications and courses`,
        },
    });

    console.log(`✅ Created category: ${categoryName}`);
    return created.id;
}

async function countLessonsInFolder(folderPath: string): Promise<number> {
    if (!fs.existsSync(folderPath)) return 0;

    let count = 0;
    const items = fs.readdirSync(folderPath);

    for (const item of items) {
        const itemPath = path.join(folderPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory() && item.startsWith('Module_')) {
            const htmlFiles = fs.readdirSync(itemPath).filter(f => f.endsWith('.html'));
            count += htmlFiles.length;
        }
    }

    return count;
}

async function seedCourse(
    slug: string,
    title: string,
    description: string,
    categoryId: string,
    certificateType: CertificateType,
    folderPath: string,
    tierFolder?: string
): Promise<string> {
    const forceReseed = process.argv.includes('--force');

    // Check if course exists
    const existing = await prisma.course.findUnique({ where: { slug } });
    if (existing) {
        if (forceReseed) {
            console.log(`🗑️ Force mode: Deleting existing course: ${slug}`);
            await prisma.course.delete({ where: { slug } });
        } else {
            console.log(`⚠️ Course already exists: ${slug} (use --force to reseed)`);
            return existing.id;
        }
    }

    // For main cert (no tierFolder), modules are at root level
    // For Pro courses (with tierFolder), modules are in subfolder
    const fullPath = tierFolder
        ? path.join(process.cwd(), folderPath, tierFolder)
        : path.join(process.cwd(), folderPath);  // L1 modules at root

    const lessonCount = await countLessonsInFolder(fullPath);

    // Create course
    const course = await prisma.course.create({
        data: {
            title,
            slug,
            description,
            shortDescription: description.substring(0, 150),
            categoryId,
            difficulty: Difficulty.INTERMEDIATE,
            certificateType,
            isPublished: true,
            isFeatured: certificateType === 'CERTIFICATION',
            duration: lessonCount * 15, // 15 min per lesson
        },
    });

    console.log(`✅ Created course: ${title} (${lessonCount} lessons expected)`);

    // Seed modules and lessons
    await seedModulesAndLessons(course.id, fullPath);

    return course.id;
}

async function seedModulesAndLessons(courseId: string, folderPath: string): Promise<void> {
    if (!fs.existsSync(folderPath)) {
        console.log(`⚠️ Folder not found: ${folderPath}`);
        return;
    }

    const items = fs.readdirSync(folderPath).filter(f => f.startsWith('Module_')).sort();
    let moduleOrder = 0;

    for (const moduleDir of items) {
        const modulePath = path.join(folderPath, moduleDir);
        const moduleNum = parseInt(moduleDir.split('_')[1]);

        // Create module
        const module = await prisma.module.create({
            data: {
                title: `Module ${moduleNum}`,
                description: `Module ${moduleNum} content`,
                order: moduleOrder++,
                courseId,
                isPublished: true,
            },
        });

        // Get lessons
        const htmlFiles = fs.readdirSync(modulePath)
            .filter(f => f.endsWith('.html'))
            .sort();

        let lessonOrder = 0;
        for (const htmlFile of htmlFiles) {
            // Parse title from filename: Lesson_1.1_Title_Here.html
            const match = htmlFile.match(/Lesson_[\d.]+_(.+)\.html$/);
            const title = match ? match[1].replace(/_/g, ' ') : htmlFile;

            await prisma.lesson.create({
                data: {
                    title,
                    lessonType: 'TEXT',
                    content: `<iframe src="/courses/${path.basename(path.dirname(folderPath))}/${moduleDir}/${htmlFile}" />`,
                    order: lessonOrder++,
                    moduleId: module.id,
                    isPublished: true,
                },
            });
        }

        console.log(`   📦 Module ${moduleNum}: ${htmlFiles.length} lessons`);
    }
}

async function seedCertification(certSlug: string): Promise<void> {
    console.log(`\n🚀 Seeding certification: ${certSlug}\n`);

    const config = await loadConfig(certSlug);
    if (!config) {
        console.error(`❌ Config not found for: ${certSlug}`);
        console.log('\nAvailable certifications:');
        const configData = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
        Object.keys(configData.certifications).forEach(k => console.log(`  - ${k}`));
        return;
    }

    // Get or create category
    const categoryId = await getOrCreateCategory(config.category);

    // 1. Seed main certification course
    console.log('\n📘 Seeding main certification...');
    await seedCourse(
        config.products.certification.slug,
        config.name,
        `Become a ${config.name} with the ${config.methodology.full_name}. This comprehensive certification program covers everything you need to start your practice.`,
        categoryId,
        'CERTIFICATION',
        config.folder
    );

    // 2. Seed pro accelerator courses
    console.log('\n📗 Seeding Pro Accelerator courses...');
    for (const proCourse of config.products.pro_accelerator.courses) {
        const tierName = proCourse.tier === 'L2' ? 'Advanced Clinical'
            : proCourse.tier === 'L3' ? 'Master Depth'
                : 'Practice Path';

        await seedCourse(
            proCourse.slug,
            `${config.short_name} Pro: ${tierName}`,
            `${tierName} training for ${config.short_name} practitioners.`,
            categoryId,
            'COMPLETION',
            config.folder,
            proCourse.folder
        );
    }

    console.log('\n✅ Seeding complete!');
    console.log(`\n📊 Summary:`);
    console.log(`   Main cert: ${config.products.certification.slug}`);
    console.log(`   Pro courses: ${config.products.pro_accelerator.courses.length}`);
    console.log(`   Tags: ${config.products.certification.tag}, ${config.products.pro_accelerator.tag}`);
}

async function main() {
    const certSlug = process.argv[2];

    if (!certSlug) {
        console.log('Usage: npx ts-node prisma/seed-certification.ts <cert-slug>');
        console.log('\nExample: npx ts-node prisma/seed-certification.ts narc-recovery-coach');
        console.log('\nAvailable certifications:');
        const configData = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
        Object.keys(configData.certifications).forEach(k => console.log(`  - ${k}`));
        return;
    }

    try {
        await seedCertification(certSlug);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
