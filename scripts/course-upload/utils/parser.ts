/**
 * Course Blueprint Parser
 * Parses course_blueprint.json files and extracts course/module/lesson data
 */

import * as fs from 'fs';
import * as path from 'path';

export interface LessonOutline {
    number: number;
    title: string;
    outline: string[];
}

export interface ModuleBlueprint {
    number: number;
    title: string;
    tier: string;
    has_quiz: boolean;
    lessons: LessonOutline[];
}

export interface CourseBlueprint {
    course_name: string;
    total_lessons: number;
    modules: ModuleBlueprint[];
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

export interface QuizData {
    moduleId: string;
    moduleTitle: string;
    passingScore: number;
    questions: QuizQuestion[];
}

/**
 * Read and parse course_blueprint.json
 */
export function parseBlueprint(coursePath: string): CourseBlueprint {
    const blueprintPath = path.join(coursePath, 'course_blueprint.json');
    const content = fs.readFileSync(blueprintPath, 'utf-8');
    return JSON.parse(content);
}

/**
 * Read quiz JSON file
 */
export function parseQuiz(quizPath: string): QuizData {
    const content = fs.readFileSync(quizPath, 'utf-8');
    return JSON.parse(content);
}

/**
 * Read HTML lesson content
 */
export function readLessonHtml(lessonPath: string): string {
    return fs.readFileSync(lessonPath, 'utf-8');
}

/**
 * Get all course directories from the source folder
 */
export function getAllCourseDirs(sourceDir: string): string[] {
    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
    return entries
        .filter(entry => entry.isDirectory() && entry.name.startsWith('certified-'))
        .map(entry => entry.name);
}

/**
 * Get tier suffix for slug
 */
export function getTierSuffix(tier: string): string {
    const suffixes: Record<string, string> = {
        'L1': '', // Main certification has no suffix
        'L2': '-advanced',
        'L3': '-master',
        'L4': '-practice',
    };
    return suffixes[tier] || '';
}

/**
 * Get tier folder name
 */
export function getTierFolder(tier: string): string {
    const folders: Record<string, string> = {
        'L1': 'L1_Main',
        'L2': 'L2_Advanced',
        'L3': 'L3_Master',
        'L4': 'L4_Practice',
    };
    return folders[tier] || 'L1_Main';
}

/**
 * Get tier display name
 */
export function getTierDisplayName(tier: string): string {
    const names: Record<string, string> = {
        'L1': 'Certification',
        'L2': 'Advanced',
        'L3': 'Master',
        'L4': 'Practice',
    };
    return names[tier] || 'Certification';
}

/**
 * Find all HTML lesson files in a module directory
 */
export function findLessonFiles(moduleDir: string): string[] {
    if (!fs.existsSync(moduleDir)) return [];

    const files = fs.readdirSync(moduleDir);
    return files
        .filter(f => f.endsWith('.html'))
        .sort((a, b) => {
            // Sort by lesson number (e.g., Lesson_1.1, Lesson_1.2)
            const numA = extractLessonNumber(a);
            const numB = extractLessonNumber(b);
            return numA - numB;
        });
}

/**
 * Extract lesson number from filename
 */
function extractLessonNumber(filename: string): number {
    const match = filename.match(/Lesson_(\d+)\.(\d+)/);
    if (match) {
        return parseFloat(`${match[1]}.${match[2]}`);
    }
    return 0;
}

/**
 * Find quiz file in module directory
 */
export function findQuizFile(moduleDir: string): string | null {
    if (!fs.existsSync(moduleDir)) return null;

    const files = fs.readdirSync(moduleDir);
    const quizFile = files.find(f => f.startsWith('quiz_') && f.endsWith('.json'));
    return quizFile ? path.join(moduleDir, quizFile) : null;
}

/**
 * Check if PDF exists for a course tier
 */
export function hasPdf(coursePath: string, tier: string): boolean {
    const pdfPath = path.join(coursePath, `${tier}-complete.pdf`);
    return fs.existsSync(pdfPath);
}

/**
 * Get PDF path for a course tier
 */
export function getPdfPath(coursePath: string, tier: string): string {
    return path.join(coursePath, `${tier}-complete.pdf`);
}
