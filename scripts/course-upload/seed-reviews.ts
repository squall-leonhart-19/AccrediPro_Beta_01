/**
 * Seed Reviews to Database
 * Reads reviews.json and creates fake users + CourseReview records
 * 
 * Usage: npx tsx scripts/course-upload/seed-reviews.ts --test
 */

import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

import { getAllCourseDirs, getTierSuffix } from './utils/parser';
import { SOURCE_DIR, TIERS } from './config';

// Initialize Prisma
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

interface ReviewData {
    id: string;
    user_id: string;
    rating: number;
    focus_type: string;
    review_text: string;
    date: string;
    verified_purchase: boolean;
    helpful_count: number;
}

interface ReviewsFile {
    course_name: string;
    niche: string;
    total_reviews: number;
    average_rating: number;
    distribution: {
        '5_star': number;
        '4_star': number;
        '3_star': number;
        '2_star': number;
        '1_star': number;
    };
    reviews: ReviewData[];
}

// Female first names for fake profiles
const FIRST_NAMES = [
    'Sarah', 'Jessica', 'Jennifer', 'Elizabeth', 'Maria', 'Linda', 'Susan', 'Karen',
    'Ashley', 'Michelle', 'Amanda', 'Emily', 'Nicole', 'Stephanie', 'Angela', 'Melissa',
    'Rebecca', 'Heather', 'Rachel', 'Laura', 'Sharon', 'Cynthia', 'Kathleen', 'Amy',
    'Christine', 'Deborah', 'Carolyn', 'Janet', 'Catherine', 'Diane', 'Victoria', 'Andrea',
    'Patricia', 'Samantha', 'Kimberly', 'Nancy', 'Margaret', 'Lisa', 'Betty', 'Dorothy',
];

const LAST_NAMES = [
    'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez',
    'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker',
    'Young', 'King', 'Wright', 'Hill', 'Green', 'Adams', 'Baker', 'Nelson', 'Carter', 'Mitchell',
];

async function getOrCreateFakeUser(userId: string, courseSlug: string): Promise<string> {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
        where: {
            email: `review_${userId}@fake.accredipro.academy`,
        },
    });

    if (existingUser) {
        return existingUser.id;
    }

    // Create fake user
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

    const user = await prisma.user.create({
        data: {
            email: `review_${userId}@fake.accredipro.academy`,
            firstName,
            lastName,
            isFakeProfile: true,
            isActive: true,
        },
    });

    return user.id;
}

async function seedReviewsForCourse(courseDir: string) {
    const coursePath = path.join(SOURCE_DIR, courseDir);
    const reviewsPath = path.join(coursePath, 'reviews.json');

    if (!fs.existsSync(reviewsPath)) {
        console.log(`   ⏭️  No reviews.json found`);
        return { success: false, reviewsCreated: 0 };
    }

    const reviewsData: ReviewsFile = JSON.parse(fs.readFileSync(reviewsPath, 'utf-8'));

    // Only seed reviews for L1 (main certification)
    const courseSlug = courseDir;
    const course = await prisma.course.findUnique({
        where: { slug: courseSlug },
    });

    if (!course) {
        console.log(`   ⏭️  Course not found: ${courseSlug}`);
        return { success: false, reviewsCreated: 0 };
    }

    let reviewsCreated = 0;

    for (const review of reviewsData.reviews) {
        try {
            // Get or create fake user
            const userId = await getOrCreateFakeUser(review.user_id, courseSlug);

            // Check if review already exists
            const existingReview = await prisma.courseReview.findUnique({
                where: {
                    userId_courseId: {
                        userId,
                        courseId: course.id,
                    },
                },
            });

            if (existingReview) {
                continue; // Skip existing
            }

            // Create review
            await prisma.courseReview.create({
                data: {
                    userId,
                    courseId: course.id,
                    rating: review.rating,
                    content: review.review_text,
                    isPublic: true,
                    isVerified: review.verified_purchase,
                    createdAt: new Date(review.date),
                },
            });

            reviewsCreated++;
        } catch (error) {
            // Skip duplicates or errors
        }
    }

    return { success: true, reviewsCreated };
}

async function main() {
    console.log('🚀 Starting Review Seeding');
    console.log('📁 Source:', SOURCE_DIR);
    console.log('');

    const courseDirs = getAllCourseDirs(SOURCE_DIR);
    console.log(`📚 Found ${courseDirs.length} course directories`);

    const testMode = process.argv.includes('--test');
    const coursesToProcess = testMode ? courseDirs.slice(0, 1) : courseDirs;

    if (testMode) {
        console.log('⚠️  TEST MODE: Processing only first course');
    }

    let totalReviews = 0;

    for (const courseDir of coursesToProcess) {
        console.log(`\n📦 ${courseDir}`);
        const result = await seedReviewsForCourse(courseDir);

        if (result.success) {
            console.log(`   ✅ ${result.reviewsCreated} reviews created`);
            totalReviews += result.reviewsCreated;
        }
    }

    console.log('\n');
    console.log('═'.repeat(50));
    console.log('📊 Review Seeding Summary');
    console.log('═'.repeat(50));
    console.log(`✅ Total Reviews: ${totalReviews}`);

    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
