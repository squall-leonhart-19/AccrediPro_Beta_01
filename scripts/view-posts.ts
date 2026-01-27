import prisma from "../src/lib/prisma";

async function main() {
    // Get posts from zombies who have bios (our personalized ones)
    const posts = await prisma.communityPost.findMany({
        where: {
            author: {
                isFakeProfile: true,
                bio: { not: null }  // Has a bio = personalized zombie
            },
            categoryId: "wins"
        },
        include: {
            author: {
                select: {
                    firstName: true,
                    lastName: true,
                    location: true,
                    specialties: true,
                    bio: true,
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    console.log(`Found ${posts.length} posts with bios\n`);

    for (const post of posts) {
        console.log("=".repeat(70));
        console.log(`AUTHOR: ${post.author.firstName} ${post.author.lastName} (${post.author.location})`);
        console.log(`SPECIALTIES: ${(post.author.specialties as string[])?.join(", ")}`);
        console.log(`CATEGORY: ${post.categoryId}`);
        console.log(`TITLE: ${post.title}`);
        console.log(`\nCONTENT:`);
        // Strip HTML for readability
        const content = post.content
            .replace(/<p>/g, "\n")
            .replace(/<\/p>/g, "")
            .replace(/<ul>/g, "")
            .replace(/<\/ul>/g, "")
            .replace(/<li>/g, "• ")
            .replace(/<\/li>/g, "\n")
            .replace(/<strong>/g, "**")
            .replace(/<\/strong>/g, "**")
            .replace(/<em>/g, "_")
            .replace(/<\/em>/g, "_")
            .trim();
        console.log(content);
        console.log("\n");
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
