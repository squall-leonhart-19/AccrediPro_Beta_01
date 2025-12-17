/**
 * Keep only first 20 coaching tips, delete the rest
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("📋 Keeping first 20 coaching tips, removing others...\n");

    // Get all coaching tips ordered by tip number
    const allTips = await prisma.communityPost.findMany({
        where: {
            categoryId: "coaching-tips"
        },
        select: {
            id: true,
            title: true,
            createdAt: true
        },
        orderBy: { createdAt: 'asc' }
    });

    console.log(`Found ${allTips.length} total coaching tips\n`);

    // Extract tip numbers from titles
    const tipsWithNumbers = allTips.map(tip => {
        const match = tip.title.match(/#(\d+)/);
        const tipNumber = match ? parseInt(match[1]) : 999;
        return { ...tip, tipNumber };
    }).sort((a, b) => a.tipNumber - b.tipNumber);

    // Keep tips 1-20, delete the rest
    const tipsToKeep = tipsWithNumbers.filter(tip => tip.tipNumber >= 1 && tip.tipNumber <= 20);
    const tipsToDelete = tipsWithNumbers.filter(tip => tip.tipNumber > 20 || tip.tipNumber < 1);

    console.log(`Keeping ${tipsToKeep.length} tips (1-20)`);
    console.log(`Deleting ${tipsToDelete.length} tips (21+)\n`);

    if (tipsToDelete.length === 0) {
        console.log("✅ Nothing to delete - already only have 20 or fewer tips");
        await prisma.$disconnect();
        return;
    }

    // Show what will be deleted
    console.log("Tips to delete:");
    tipsToDelete.forEach(tip => {
        console.log(`  - ${tip.title.substring(0, 60)}...`);
    });

    const tipIdsToDelete = tipsToDelete.map(t => t.id);

    // Delete comments first (foreign key constraint)
    const deletedComments = await prisma.postComment.deleteMany({
        where: { postId: { in: tipIdsToDelete } },
    });
    console.log(`\n✅ Deleted ${deletedComments.count} comments`);

    // Delete likes
    const deletedLikes = await prisma.postLike.deleteMany({
        where: { postId: { in: tipIdsToDelete } },
    });
    console.log(`✅ Deleted ${deletedLikes.count} likes`);

    // Delete posts
    const deletedPosts = await prisma.communityPost.deleteMany({
        where: { id: { in: tipIdsToDelete } },
    });
    console.log(`✅ Deleted ${deletedPosts.count} coaching tips (21+)\n`);

    // Verify remaining
    const remaining = await prisma.communityPost.count({
        where: { categoryId: "coaching-tips" }
    });
    console.log(`📊 Remaining coaching tips: ${remaining}`);

    await prisma.$disconnect();
}

main().catch(console.error);
