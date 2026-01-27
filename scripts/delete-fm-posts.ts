
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🗑️ Deleting ALL FM Community Posts...");

    const fmCategory = await prisma.category.findFirst({
        where: { slug: 'fm' },
        include: { community: true }
    });

    if (!fmCategory?.community) {
        console.log('FM Community not found');
        return;
    }

    // Delete comments first (foreign key constraint)
    const deletedComments = await prisma.postComment.deleteMany({
        where: { post: { communityId: fmCategory.community.id } }
    });
    console.log('Deleted comments:', deletedComments.count);

    // Delete likes
    const deletedLikes = await prisma.postLike.deleteMany({
        where: { post: { communityId: fmCategory.community.id } }
    });
    console.log('Deleted likes:', deletedLikes.count);

    // Delete posts
    const deletedPosts = await prisma.communityPost.deleteMany({
        where: { communityId: fmCategory.community.id }
    });
    console.log('Deleted posts:', deletedPosts.count);

    console.log("\n✅ FM Community is now EMPTY!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
