import prisma from "../src/lib/prisma";

async function main() {
  // Check existing wins posts
  const wins = await prisma.communityPost.findMany({
    where: { categoryId: "wins" },
    include: {
      author: { select: { firstName: true, lastName: true, isFakeProfile: true } },
      _count: { select: { comments: true } }
    },
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  console.log("Existing Wins posts:", wins.length);
  wins.forEach(w => {
    console.log(`\n--- ${w.author.firstName} ${w.author.lastName} (fake: ${w.author.isFakeProfile}) ---`);
    console.log(`Title: ${w.title}`);
    console.log(`Comments: ${w._count.comments}`);
    const snippet = w.content.substring(0, 200);
    console.log(`Content: ${snippet}...`);
  });

  // Check all categories
  const categories = await prisma.communityPost.groupBy({
    by: ['categoryId'],
    _count: true
  });
  console.log("\nPosts by category:");
  categories.forEach(c => console.log(`  ${c.categoryId}: ${c._count}`));

  // Check channels
  const channels = await prisma.communityChannel.findMany();
  console.log("\nChannels:", channels.map(c => `${c.slug} (${c.name})`));
}
main().finally(() => prisma.$disconnect());
