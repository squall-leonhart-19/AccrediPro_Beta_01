import prisma from "../src/lib/prisma";

/**
 * Unpin Coaching Tips 1 and 2
 * The announcement list in community-client.tsx shows coaching-tips category posts as announcements if isPinned=true
 * To make them regular posts (not announcements), we need to unpin them
 */
async function main() {
  console.log("🔄 Fixing Coaching Tips announcements...\n");

  // Find all coaching tip posts
  const allTips = await prisma.communityPost.findMany({
    where: {
      OR: [
        { id: { startsWith: "tips-daily-" } },
        { categoryId: "coaching-tips" },
      ],
    },
    select: {
      id: true,
      title: true,
      isPinned: true,
      categoryId: true,
    },
    orderBy: { createdAt: "asc" },
  });

  console.log(`Found ${allTips.length} coaching tip posts:`);
  for (const post of allTips) {
    console.log(`  - ${post.id}: "${post.title?.substring(0, 50)}..." (pinned: ${post.isPinned})`);
  }

  // Unpin Coaching Tip #1 and #2 (they will show as regular posts, not announcements)
  // Also unpin "💡 Coaching Tips - Daily Wisdom" if that's an announcement
  const result = await prisma.communityPost.updateMany({
    where: {
      OR: [
        { title: { contains: "Coaching Tip #1:" } },
        { title: { contains: "Coaching Tip #2:" } },
      ],
    },
    data: {
      isPinned: false, // Unpin to remove from announcement display
    },
  });

  console.log(`\n✅ Unpinned ${result.count} posts`);
  console.log("Coaching Tips 1 and 2 are now regular posts (not announcements)");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
