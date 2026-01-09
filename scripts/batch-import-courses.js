#!/usr/bin/env node
/**
 * FAST Batch Course Import Script v2
 * Uses createMany for 10x faster imports
 * Creates 4 separate courses per folder (L1, L2, L3, L4)
 * 
 * Expected: 17 folders × 4 tiers = 68 courses
 */

require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const fs = require('fs');
const path = require('path');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SOURCE_DIR = path.join(__dirname, '..', 'corsi 3');
const IMAGES_DIR = '/courses/images';

// Tier configurations
const TIER_CONFIG = {
    'L1_Main': {
        suffix: '',
        priceSuffix: '',
        price: 297,
        regularPrice: 997,
        difficulty: 'BEGINNER',
    },
    'L2_Advanced': {
        suffix: ' - Advanced',
        priceSuffix: '_advanced',
        price: 497,
        regularPrice: 1497,
        difficulty: 'INTERMEDIATE',
    },
    'L3_Master': {
        suffix: ' - Master',
        priceSuffix: '_master',
        price: 697,
        regularPrice: 1997,
        difficulty: 'ADVANCED',
    },
    'L4_Practice': {
        suffix: ' Practice Path',
        priceSuffix: '_practice',
        price: 497,
        regularPrice: 1297,
        difficulty: 'INTERMEDIATE',
    },
};

// Category mapping
const CATEGORY_MAPPING = {
    'astronomy': 'Spiritual & Energy',
    'autism': 'Mental Health',
    'neurodiversity': 'Mental Health',
    'birth': 'Women\'s Health',
    'doula': 'Women\'s Health',
    'christian': 'Spiritual & Energy',
    'herbalist': 'Health & Wellness',
    'parenting': 'Family & Parenting',
    'eft': 'Therapy & Bodywork',
    'tapping': 'Therapy & Bodywork',
    'energy': 'Spiritual & Energy',
    'healing': 'Spiritual & Energy',
    'functional-medicine': 'Health & Wellness',
    'gestalt': 'Therapy & Bodywork',
    'grief': 'Mental Health',
    'loss': 'Mental Health',
    'integrative': 'Health & Wellness',
    'lgbtq': 'Mental Health',
    'narcissistic': 'Mental Health',
    'abuse': 'Mental Health',
    'pet': 'Pet & Animal',
    'wellness': 'Health & Wellness',
    'sex': 'Therapy & Bodywork',
    'hormone': 'Women\'s Health',
    'women': 'Women\'s Health',
};

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[™®©]/g, '')
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function getCategoryFromCourseName(courseName) {
    const lowerName = courseName.toLowerCase();
    for (const [keyword, category] of Object.entries(CATEGORY_MAPPING)) {
        if (lowerName.includes(keyword)) {
            return category;
        }
    }
    return 'Health & Wellness';
}

// Cache for categories and coach
const categoryCache = new Map();
let coachId = null;

async function getOrCreateCategory(categoryName) {
    if (categoryCache.has(categoryName)) {
        return categoryCache.get(categoryName);
    }

    let category = await prisma.category.findUnique({
        where: { name: categoryName },
        select: { id: true }
    });

    if (!category) {
        category = await prisma.category.create({
            data: {
                name: categoryName,
                slug: slugify(categoryName),
                isActive: true,
            },
            select: { id: true }
        });
        console.log(`  📁 Created category: ${categoryName}`);
    }

    categoryCache.set(categoryName, category);
    return category;
}

async function getCoachId() {
    if (coachId) return coachId;

    const coach = await prisma.user.findUnique({
        where: { email: 'sarah@accredipro.academy' },
        select: { id: true }
    });
    coachId = coach?.id || null;
    return coachId;
}

async function importTierAsCourse(courseDir, tierName, blueprint, dirName) {
    const tierDir = path.join(courseDir, tierName);
    if (!fs.existsSync(tierDir)) {
        return null;
    }

    const config = TIER_CONFIG[tierName];
    const baseName = blueprint.course_name;

    // Build course name based on tier
    let courseName, courseSlug;
    if (tierName === 'L1_Main') {
        courseName = baseName;
        courseSlug = slugify(baseName);
    } else {
        // Remove "Certified" prefix for non-L1 tiers and add suffix
        const cleanName = baseName.replace('Certified ', '').replace('™', '');
        courseName = cleanName + config.suffix;
        courseSlug = slugify(courseName);
    }

    // Check if already exists
    const existing = await prisma.course.findUnique({
        where: { slug: courseSlug },
        select: { id: true }
    });

    if (existing) {
        console.log(`    ⏭️ ${tierName}: Already exists`);
        return existing;
    }

    // Get category and coach
    const categoryName = getCategoryFromCourseName(baseName);
    const category = await getOrCreateCategory(categoryName);
    const coach = await getCoachId();

    // Find tier-specific image
    const imageBaseName = dirName.replace(/-/g, '-');
    const tierSuffix = tierName.toLowerCase().replace('_', '').replace('main', '1').replace('advanced', '2').replace('master', '3').replace('practice', '4');
    const imagePath = `${IMAGES_DIR}/${imageBaseName}_l${tierSuffix.slice(-1)}.webp`;

    // Count lessons for duration estimate
    let totalLessons = 0;
    const moduleEntries = fs.readdirSync(tierDir, { withFileTypes: true })
        .filter(e => e.isDirectory() && e.name.startsWith('Module_'));

    for (const me of moduleEntries) {
        const modDir = path.join(tierDir, me.name);
        totalLessons += fs.readdirSync(modDir).filter(f => f.endsWith('.html') && f.startsWith('Lesson_')).length;
    }

    // Create course
    const course = await prisma.course.create({
        data: {
            title: courseName,
            slug: courseSlug,
            description: `${tierName === 'L1_Main' ? 'Comprehensive certification' : 'Advanced'} program: ${courseName}. Professional curriculum from foundational concepts to practical application.`,
            shortDescription: `${courseName} - Professional certification program.`,
            thumbnail: imagePath,
            price: config.price,
            regularPrice: config.regularPrice,
            isFree: false,
            isPublished: true,
            isFeatured: tierName === 'L1_Main',
            difficulty: config.difficulty,
            duration: totalLessons * 15,
            certificateType: 'CERTIFICATION',
            estimatedWeeks: Math.ceil(totalLessons / 15),
            categoryId: category.id,
            coachId: coach,
            learningOutcomes: [
                'Master core principles and methodologies',
                'Develop practical skills for real-world application',
                'Learn to work with diverse client populations',
                'Build a professional practice foundation',
                'Earn a recognized certification credential',
            ],
            targetAudience: 'Aspiring practitioners, healthcare professionals, and passionate individuals.',
        },
        select: { id: true }
    });

    // Prepare bulk data for modules, lessons, quizzes
    const modulesData = [];
    const lessonsData = [];
    const quizzesData = [];

    // Sort modules
    const sortedModules = moduleEntries.sort((a, b) => {
        const numA = parseInt(a.name.split('_')[1]);
        const numB = parseInt(b.name.split('_')[1]);
        return numA - numB;
    });

    let moduleOrder = 0;
    for (const moduleEntry of sortedModules) {
        const moduleDir = path.join(tierDir, moduleEntry.name);
        const moduleNum = parseInt(moduleEntry.name.split('_')[1]);

        // Get module title from blueprint
        const blueprintModule = blueprint.modules?.find(m => m.number === moduleNum);
        const moduleTitle = blueprintModule?.title || `Module ${moduleNum}`;

        // Create module and get ID
        const module = await prisma.module.create({
            data: {
                courseId: course.id,
                title: moduleTitle,
                order: moduleOrder++,
                isPublished: true,
            },
            select: { id: true }
        });

        // Collect lessons for bulk insert
        const lessonFiles = fs.readdirSync(moduleDir)
            .filter(f => f.endsWith('.html') && f.startsWith('Lesson_'))
            .sort();

        let lessonOrder = 0;
        for (const lessonFile of lessonFiles) {
            const lessonPath = path.join(moduleDir, lessonFile);
            const lessonHtml = fs.readFileSync(lessonPath, 'utf8');
            const lessonTitle = lessonFile
                .replace('.html', '')
                .replace(/^Lesson_\d+\.\d+_/, '')
                .replace(/_/g, ' ')
                .substring(0, 100);

            lessonsData.push({
                moduleId: module.id,
                title: lessonTitle,
                content: lessonHtml,
                order: lessonOrder++,
                isPublished: true,
                lessonType: 'TEXT',
            });
        }

        // Handle quiz
        const quizFile = fs.readdirSync(moduleDir).find(f => f.startsWith('quiz_') && f.endsWith('.json'));
        if (quizFile) {
            const quizPath = path.join(moduleDir, quizFile);
            const quizData = JSON.parse(fs.readFileSync(quizPath, 'utf8'));
            quizzesData.push({ moduleId: module.id, quizData });
        }
    }

    // BULK INSERT lessons
    if (lessonsData.length > 0) {
        await prisma.lesson.createMany({ data: lessonsData });
    }

    // Import quizzes (still need individual for relations)
    for (const { moduleId, quizData } of quizzesData) {
        const quiz = await prisma.moduleQuiz.create({
            data: {
                moduleId,
                title: quizData.moduleTitle || 'Module Quiz',
                passingScore: quizData.passingScore || 80,
                isRequired: true,
                isPublished: true,
                showCorrectAnswers: true,
            },
            select: { id: true }
        });

        // Bulk insert questions
        const questionsToCreate = quizData.questions.map((q, i) => ({
            quizId: quiz.id,
            question: q.question,
            explanation: q.explanation || null,
            questionType: 'MULTIPLE_CHOICE',
            order: i,
            points: 1,
        }));

        await prisma.quizQuestion.createMany({ data: questionsToCreate });

        // Get created questions for answers
        const createdQuestions = await prisma.quizQuestion.findMany({
            where: { quizId: quiz.id },
            select: { id: true, order: true },
            orderBy: { order: 'asc' }
        });

        // Bulk insert answers
        const answersToCreate = [];
        for (let i = 0; i < quizData.questions.length; i++) {
            const q = quizData.questions[i];
            const questionId = createdQuestions[i].id;

            for (let j = 0; j < q.options.length; j++) {
                answersToCreate.push({
                    questionId,
                    answer: q.options[j],
                    isCorrect: j === q.correctAnswer,
                    order: j,
                });
            }
        }

        if (answersToCreate.length > 0) {
            await prisma.quizAnswer.createMany({ data: answersToCreate });
        }
    }

    // Import Final Exam if exists (only for L1)
    if (tierName === 'L1_Main') {
        const finalExamPath = path.join(courseDir, 'Final_Exam', 'final_exam.json');
        if (fs.existsSync(finalExamPath)) {
            const finalExamData = JSON.parse(fs.readFileSync(finalExamPath, 'utf8'));

            const examModule = await prisma.module.create({
                data: {
                    courseId: course.id,
                    title: 'Final Certification Exam',
                    description: 'Complete this exam to earn your certification.',
                    order: moduleOrder++,
                    isPublished: true,
                },
                select: { id: true }
            });

            const examQuiz = await prisma.moduleQuiz.create({
                data: {
                    moduleId: examModule.id,
                    title: finalExamData.examTitle || 'Final Exam',
                    passingScore: finalExamData.passingScore || 80,
                    timeLimit: finalExamData.timeLimit || 60,
                    isRequired: true,
                    isPublished: true,
                    showCorrectAnswers: true,
                },
                select: { id: true }
            });

            const examQuestions = finalExamData.questions.map((q, i) => ({
                quizId: examQuiz.id,
                question: q.question,
                explanation: q.explanation || null,
                questionType: 'MULTIPLE_CHOICE',
                order: i,
                points: 1,
            }));

            await prisma.quizQuestion.createMany({ data: examQuestions });

            const createdExamQs = await prisma.quizQuestion.findMany({
                where: { quizId: examQuiz.id },
                select: { id: true, order: true },
                orderBy: { order: 'asc' }
            });

            const examAnswers = [];
            for (let i = 0; i < finalExamData.questions.length; i++) {
                const q = finalExamData.questions[i];
                const qId = createdExamQs[i].id;
                for (let j = 0; j < q.options.length; j++) {
                    examAnswers.push({
                        questionId: qId,
                        answer: q.options[j],
                        isCorrect: j === q.correctAnswer,
                        order: j,
                    });
                }
            }

            if (examAnswers.length > 0) {
                await prisma.quizAnswer.createMany({ data: examAnswers });
            }
        }
    }

    console.log(`    ✅ ${tierName}: ${courseName} (${moduleOrder} modules, ${lessonsData.length} lessons)`);
    return course;
}

async function importCourseFolder(courseDir) {
    const dirName = path.basename(courseDir);
    const blueprintPath = path.join(courseDir, 'course_blueprint.json');

    if (!fs.existsSync(blueprintPath)) {
        console.log(`  ⚠️ Skipping ${dirName}: No blueprint`);
        return 0;
    }

    const blueprint = JSON.parse(fs.readFileSync(blueprintPath, 'utf8'));
    console.log(`\n📂 ${blueprint.course_name}`);

    let imported = 0;
    for (const tier of ['L1_Main', 'L2_Advanced', 'L3_Master', 'L4_Practice']) {
        const result = await importTierAsCourse(courseDir, tier, blueprint, dirName);
        if (result) imported++;
    }

    return imported;
}

async function main() {
    console.log('🚀 FAST Batch Course Import v2');
    console.log('='.repeat(60));
    console.log('Strategy: createMany for bulk inserts (10x faster)\n');

    const startTime = Date.now();

    const entries = fs.readdirSync(SOURCE_DIR, { withFileTypes: true });
    const courseDirectories = entries
        .filter(entry => entry.isDirectory() && entry.name !== '.DS_Store')
        .map(entry => path.join(SOURCE_DIR, entry.name));

    console.log(`📦 Found ${courseDirectories.length} folders = ${courseDirectories.length * 4} potential courses\n`);

    let totalImported = 0;

    for (const courseDir of courseDirectories) {
        totalImported += await importCourseFolder(courseDir);
    }

    const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

    console.log('\n' + '='.repeat(60));
    console.log('📊 IMPORT COMPLETE');
    console.log('='.repeat(60));
    console.log(`✅ Courses imported: ${totalImported}`);
    console.log(`⏱️ Time elapsed: ${elapsed} minutes`);
    console.log('='.repeat(60));

    await prisma.$disconnect();
}

main().catch(async (error) => {
    console.error('Fatal error:', error);
    await prisma.$disconnect();
    process.exit(1);
});
