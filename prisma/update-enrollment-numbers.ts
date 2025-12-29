/**
 * Script to update course analytics with random enrollment numbers
 * Run with: npx tsx prisma/update-enrollment-numbers.ts
 */

import prisma from '../src/lib/prisma';

// Generate random number between min and max (inclusive)
function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function updateEnrollmentNumbers() {
    console.log('📊 Updating course enrollment numbers...\n');

    try {
        // Get all published certification courses
        const courses = await prisma.course.findMany({
            where: {
                isPublished: true,
                certificateType: { not: 'MINI_DIPLOMA' },
            },
            select: {
                id: true,
                slug: true,
                title: true,
                analytics: { select: { id: true, totalEnrolled: true } },
            },
        });

        console.log(`Found ${courses.length} certification courses\n`);

        for (const course of courses) {
            const randomEnrolled = randomInt(500, 997);

            if (course.analytics) {
                // Update existing analytics
                await prisma.courseAnalytics.update({
                    where: { id: course.analytics.id },
                    data: { totalEnrolled: randomEnrolled },
                });
                console.log(`✅ Updated: ${course.title}`);
                console.log(`   ${course.analytics.totalEnrolled} → ${randomEnrolled} enrolled\n`);
            } else {
                // Create new analytics
                await prisma.courseAnalytics.create({
                    data: {
                        courseId: course.id,
                        totalEnrolled: randomEnrolled,
                        avgRating: 4.8, // Default rating
                    },
                });
                console.log(`✅ Created analytics: ${course.title}`);
                console.log(`   ${randomEnrolled} enrolled (new)\n`);
            }
        }

        console.log('\n✨ All enrollment numbers updated!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

updateEnrollmentNumbers();
