import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/**
 * Backfill watchTime for completed lessons based on video duration
 * 
 * For completed lessons where watchTime=0, sets watchTime to the lesson's videoDuration
 * This provides retroactive learning time data for the credentials page
 */
async function backfillWatchTime() {
    console.log("🔍 Finding completed lessons with watchTime=0...\n");

    // Get completed lessons with no watchTime recorded
    const progressRecords = await prisma.lessonProgress.findMany({
        where: {
            isCompleted: true,
            watchTime: 0,
        },
        select: {
            id: true,
            userId: true,
            lessonId: true,
            watchTime: true,
        },
    });

    console.log(`Found ${progressRecords.length} completed lessons with watchTime=0\n`);

    if (progressRecords.length === 0) {
        console.log("Nothing to backfill!");
        return;
    }

    // Get unique lesson IDs
    const lessonIds = [...new Set(progressRecords.map((p) => p.lessonId))];

    // Fetch video durations for these lessons
    const lessons = await prisma.lesson.findMany({
        where: { id: { in: lessonIds } },
        select: { id: true, videoDuration: true, title: true },
    });

    const lessonDurationMap = new Map(
        lessons.map((l) => [l.id, l.videoDuration || 0])
    );

    console.log(`Found ${lessons.length} unique lessons with video durations\n`);

    // Update in batches
    let updated = 0;
    let skipped = 0;

    for (const progress of progressRecords) {
        const duration = lessonDurationMap.get(progress.lessonId);

        if (duration && duration > 0) {
            await prisma.lessonProgress.update({
                where: { id: progress.id },
                data: { watchTime: duration },
            });
            updated++;

            if (updated % 500 === 0) {
                console.log(`   Updated ${updated}/${progressRecords.length}...`);
            }
        } else {
            skipped++;
        }
    }

    console.log(`\n${"=".repeat(50)}`);
    console.log(`🎉 BACKFILL COMPLETE`);
    console.log(`   Updated: ${updated} records`);
    console.log(`   Skipped: ${skipped} (no video duration)`);

    // Calculate new totals
    const newStats = await prisma.lessonProgress.aggregate({
        _sum: { watchTime: true },
    });

    const totalHours = Math.round((newStats._sum.watchTime || 0) / 3600);
    console.log(`\n📊 NEW TOTALS:`);
    console.log(`   Total watchTime: ${newStats._sum.watchTime || 0} seconds`);
    console.log(`   Total hours: ${totalHours}`);
}

backfillWatchTime()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
