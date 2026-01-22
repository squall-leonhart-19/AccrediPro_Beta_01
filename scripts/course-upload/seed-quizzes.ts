/**
 * Seed Quizzes to Database (PARALLEL VERSION)
 * Reads quiz JSON files and creates ModuleQuiz/QuizQuestion/QuizAnswer records
 * Processes 5 courses concurrently for faster seeding
 * 
 * Usage: npx tsx scripts/course-upload/seed-quizzes.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import pLimit from 'p-limit';

import {
    getAllCourseDirs,
    getTierFolder,
    getTierSuffix,
    parseQuiz,
    findQuizFile,
} from './utils/parser';
import { SOURCE_DIR, TIERS, QUIZ_DEFAULTS } from './config';

// Concurrency limit - process 5 courses at once
const CONCURRENCY = 5;

// Initialize Prisma
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

interface QuizResult {
    courseSlug: string;
    moduleNum: number;
    success: boolean;
    questionsCreated?: number;
    error?: string;
}

async function seedQuizForModule(
    courseSlug: string,
    moduleNum: number,
    quizPath: string
): Promise<QuizResult> {
    try {
        const quizData = parseQuiz(quizPath);

        // Find the module in the database
        const course = await prisma.course.findUnique({
            where: { slug: courseSlug },
            include: {
                modules: {
                    where: { order: moduleNum },
                },
            },
        });

        if (!course || course.modules.length === 0) {
            return {
                courseSlug,
                moduleNum,
                success: false,
                error: `Module not found: ${courseSlug} module ${moduleNum}`,
            };
        }

        const module = course.modules[0];

        // Check if quiz already exists
        const existingQuiz = await prisma.moduleQuiz.findUnique({
            where: { moduleId: module.id },
        });

        // Delete existing quiz if present (to refresh)
        if (existingQuiz) {
            await prisma.moduleQuiz.delete({
                where: { id: existingQuiz.id },
            });
        }

        // Create new quiz
        const quiz = await prisma.moduleQuiz.create({
            data: {
                moduleId: module.id,
                title: `${quizData.moduleTitle} Quiz`,
                description: `Test your knowledge of ${quizData.moduleTitle}`,
                passingScore: quizData.passingScore || QUIZ_DEFAULTS.passingScore,
                maxAttempts: QUIZ_DEFAULTS.maxAttempts,
                timeLimit: QUIZ_DEFAULTS.timeLimit,
                isRequired: QUIZ_DEFAULTS.isRequired,
                showCorrectAnswers: QUIZ_DEFAULTS.showCorrectAnswers,
                isPublished: false,
            },
        });

        // Create questions and answers
        for (let i = 0; i < quizData.questions.length; i++) {
            const q = quizData.questions[i];

            const question = await prisma.quizQuestion.create({
                data: {
                    quizId: quiz.id,
                    question: q.question,
                    explanation: q.explanation,
                    questionType: 'MULTIPLE_CHOICE',
                    order: i,
                    points: 1,
                },
            });

            // Create answers
            for (let j = 0; j < q.options.length; j++) {
                await prisma.quizAnswer.create({
                    data: {
                        questionId: question.id,
                        answer: q.options[j],
                        isCorrect: j === q.correctAnswer,
                        order: j,
                    },
                });
            }
        }

        return {
            courseSlug,
            moduleNum,
            success: true,
            questionsCreated: quizData.questions.length,
        };

    } catch (error) {
        return {
            courseSlug,
            moduleNum,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

async function main() {
    console.log('🚀 Starting Quiz Seeding');
    console.log('📁 Source:', SOURCE_DIR);
    console.log('');

    const courseDirs = getAllCourseDirs(SOURCE_DIR);
    console.log(`📚 Found ${courseDirs.length} course directories`);

    const results: QuizResult[] = [];
    let success = 0;
    let failed = 0;

    // Process single course for testing first
    const testMode = process.argv.includes('--test');
    const coursesToProcess = testMode ? courseDirs.slice(0, 1) : courseDirs;

    if (testMode) {
        console.log('⚠️  TEST MODE: Processing only first course');
    }

    for (const courseDir of coursesToProcess) {
        const coursePath = path.join(SOURCE_DIR, courseDir);

        for (const tier of TIERS) {
            const tierFolder = getTierFolder(tier);
            const tierPath = path.join(coursePath, tierFolder);

            if (!fs.existsSync(tierPath)) continue;

            const courseSlug = `${courseDir}${getTierSuffix(tier)}`;

            // Find all module directories
            const entries = fs.readdirSync(tierPath, { withFileTypes: true });
            const moduleDirs = entries
                .filter(e => e.isDirectory() && e.name.startsWith('Module_'))
                .sort((a, b) => a.name.localeCompare(b.name));

            for (const moduleEntry of moduleDirs) {
                const moduleDir = path.join(tierPath, moduleEntry.name);
                const quizFile = findQuizFile(moduleDir);

                if (!quizFile) continue;

                // Extract module number
                const moduleMatch = moduleEntry.name.match(/Module_(\d+)/);
                const moduleNum = moduleMatch ? parseInt(moduleMatch[1]) : 0;

                console.log(`📝 ${courseSlug} - Module ${moduleNum}`);

                const result = await seedQuizForModule(courseSlug, moduleNum, quizFile);
                results.push(result);

                if (result.success) {
                    success++;
                    console.log(`   ✅ ${result.questionsCreated} questions`);
                } else {
                    failed++;
                    console.log(`   ❌ ${result.error}`);
                }
            }
        }
    }

    // Summary
    console.log('\n');
    console.log('═'.repeat(50));
    console.log('📊 Quiz Seeding Summary');
    console.log('═'.repeat(50));
    console.log(`✅ Success: ${success}`);
    console.log(`❌ Failed: ${failed}`);

    const totalQuestions = results.filter(r => r.success).reduce((sum, r) => sum + (r.questionsCreated || 0), 0);
    console.log(`❓ Questions: ${totalQuestions}`);

    // Save results
    const resultsPath = path.join(__dirname, 'quiz-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 Results saved: ${resultsPath}`);

    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
