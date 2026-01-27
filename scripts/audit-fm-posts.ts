
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🔍 Auditing FM Community Posts...\n");

    // Get FM category
    const fmCategory = await prisma.category.findFirst({
        where: { slug: "fm" },
        include: { community: true }
    });

    if (!fmCategory || !fmCategory.community) {
        console.log("FM Category or Community not found!");
        return;
    }

    // Get all posts in FM community
    const fmPosts = await prisma.communityPost.findMany({
        where: { communityId: fmCategory.community.id },
        include: {
            author: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    isFakeProfile: true,
                    role: true
                }
            }
        }
    });

    console.log(`Total FM Posts: ${fmPosts.length}\n`);

    // Separate by author type
    const zombiePosts = fmPosts.filter(p => p.author.isFakeProfile);
    const realUserPosts = fmPosts.filter(p => !p.author.isFakeProfile);

    console.log(`📊 BREAKDOWN:`);
    console.log(`   - Zombie Posts: ${zombiePosts.length}`);
    console.log(`   - Real User Posts: ${realUserPosts.length}\n`);

    if (realUserPosts.length > 0) {
        console.log(`👤 REAL USERS WHO POSTED:`);

        // Group by author
        const authorGroups = new Map<string, { name: string; email: string; role: string; count: number }>();

        for (const post of realUserPosts) {
            const key = post.author.id;
            if (!authorGroups.has(key)) {
                authorGroups.set(key, {
                    name: `${post.author.firstName} ${post.author.lastName}`,
                    email: post.author.email || "no-email",
                    role: post.author.role,
                    count: 0
                });
            }
            authorGroups.get(key)!.count++;
        }

        for (const [id, info] of authorGroups) {
            console.log(`   - ${info.name} (${info.role}) - ${info.count} posts - ${info.email}`);
        }
    }

    console.log("\n\n📋 SAMPLE ZOMBIE POST TITLES (first 5):");
    zombiePosts.slice(0, 5).forEach(p => console.log(`   - "${p.title}"`));

    console.log("\n📋 SAMPLE REAL USER POST TITLES (first 5):");
    realUserPosts.slice(0, 5).forEach(p => console.log(`   - "${p.title}" by ${p.author.firstName}`));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
