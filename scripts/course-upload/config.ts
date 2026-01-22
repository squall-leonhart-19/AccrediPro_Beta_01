/**
 * Course Upload Configuration
 */

import * as path from 'path';

// Source directory containing all course folders
export const SOURCE_DIR = path.resolve(__dirname, '../../Courses_Updated_New_Version');

// Tiers to process
export const TIERS = ['L1', 'L2', 'L3', 'L4'] as const;
export type Tier = typeof TIERS[number];

// DB configuration
export const DB_BATCH_SIZE = 50; // Process in batches to avoid memory issues

// Course defaults
export const COURSE_DEFAULTS = {
    isPublished: true, // Publish immediately so lessons are visible
    isFree: false,
    difficulty: 'BEGINNER' as const,
    certificateType: 'CERTIFICATION' as const,
};

// Quiz defaults
export const QUIZ_DEFAULTS = {
    passingScore: 80,
    maxAttempts: null, // Unlimited
    timeLimit: null, // No time limit
    isRequired: true,
    showCorrectAnswers: true,
};

console.log('📁 Source directory:', SOURCE_DIR);
