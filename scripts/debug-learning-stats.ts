import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function debugLearningStats() {
    console.log("🔍 Debugging Learning Time & Badges Stats...\n");

    // Check if lessonProgress has watchTime data
    const watchTimeStats = await prisma.lessonProgress.aggregate({
        _sum: { watchTime: true },
        _avg: { watchTime: true },
        _count: true,
    });

    console.log("📊 LESSON PROGRESS (All users):");
    console.log(`   Total records: ${watchTimeStats._count}`);
    console.log(`   Sum watchTime: ${watchTimeStats._sum.watchTime || 0} seconds`);
    console.log(`   Avg watchTime: ${watchTimeStats._avg.watchTime || 0} seconds`);
    console.log(`   Total hours: ${Math.round((watchTimeStats._sum.watchTime || 0) / 3600)}`);

    // Check sample of lessonProgress records
    const sampleProgress = await prisma.lessonProgress.findMany({
        select: {
            watchTime: true,
            isCompleted: true,
        },
        take: 20,
    });

    console.log("\n📋 Sample lessonProgress records:");
    const withWatchTime = sampleProgress.filter(p => p.watchTime && p.watchTime > 0);
    console.log(`   With watchTime > 0: ${withWatchTime.length}/${sampleProgress.length}`);

    // Check userBadge counts
    const badgeCount = await prisma.userBadge.count();
    console.log(`\n🏆 USER BADGES: ${badgeCount} total`);

    if (badgeCount > 0) {
        const sampleBadges = await prisma.userBadge.findMany({
            take: 10,
            include: { badge: { select: { name: true } } },
        });
        console.log("   Sample badges:");
        for (const b of sampleBadges) {
            console.log(`   - ${b.badge?.name || "Unknown badge"}`);
        }
    }

    // Check if videoProgress is what we should be using instead
    const videoProgressExists = await prisma.$queryRaw`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'LessonProgress' 
        AND column_name IN ('watchTime', 'videoProgress', 'watchedDuration');
    ` as any[];

    console.log("\n🔧 LessonProgress columns related to time:");
    for (const col of videoProgressExists) {
        console.log(`   - ${col.column_name}`);
    }
}

debugLearningStats()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
