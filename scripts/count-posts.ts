
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    const totalPosts = await prisma.communityPost.count();
    const linkedPosts = await prisma.communityPost.count({
        where: { communityId: { not: null } }
    });
    const unlinkedPosts = await prisma.communityPost.count({
        where: { communityId: null }
    });

    const fmPosts = await prisma.communityPost.count({
        where: {
            community: {
                category: {
                    slug: 'fm'
                }
            }
        }
    });

    console.log(`Total Posts: ${totalPosts}`);
    console.log(`Linked to Community: ${linkedPosts}`);
    console.log(`Unlinked: ${unlinkedPosts}`);
    console.log(`FM Posts: ${fmPosts}`);

    if (unlinkedPosts > 0) {
        const unlinkedCategories = await prisma.communityPost.findMany({
            where: { communityId: null },
            select: { categoryId: true },
            distinct: ['categoryId']
        });
        console.log('Unlinked Post Categories:', unlinkedCategories.map(c => c.categoryId));
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
