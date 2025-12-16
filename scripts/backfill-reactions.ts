import prisma from "../src/lib/prisma";

// Generate unique reactions for each post based on post ID (deterministic)
// Same logic as in community-client.tsx
function generatePostReactions(postId: string, category: string | null, isPinned: boolean): Record<string, number> {
  let hash = 0;
  for (let i = 0; i < postId.length; i++) {
    const char = postId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  hash = Math.abs(hash);

  let baseMultiplier = 1;
  if (isPinned) {
    baseMultiplier = 3;
  } else if (category === "wins") {
    baseMultiplier = 2.5;
  } else if (category === "tips" || category === "coaching-tips") {
    baseMultiplier = 2;
  } else if (category === "introductions") {
    baseMultiplier = 1.8;
  } else if (category === "graduates") {
    baseMultiplier = 2.2;
  } else if (category === "questions" || category === "questions-everyone-has") {
    baseMultiplier = 1.2;
  } else if (category === "career-pathway") {
    baseMultiplier = 1.5;
  }

  const seed1 = (hash % 100) + 50;
  const seed2 = ((hash >> 4) % 80) + 30;
  const seed3 = ((hash >> 8) % 60) + 20;
  const seed4 = ((hash >> 12) % 50) + 15;
  const seed5 = ((hash >> 16) % 40) + 10;
  const seed6 = ((hash >> 20) % 30) + 8;
  const seed7 = ((hash >> 24) % 20) + 5;
  const seed8 = ((hash >> 28) % 15) + 3;

  return {
    "❤️": Math.round(seed1 * baseMultiplier),
    "🔥": Math.round(seed2 * baseMultiplier),
    "👏": Math.round(seed3 * baseMultiplier),
    "💯": Math.round(seed4 * baseMultiplier),
    "🎉": Math.round(seed5 * baseMultiplier),
    "💪": Math.round(seed6 * baseMultiplier),
    "⭐": Math.round(seed7 * baseMultiplier),
    "🙌": Math.round(seed8 * baseMultiplier),
  };
}

async function backfillReactions() {
  console.log("Starting reactions backfill...");

  // First, add the column if it doesn't exist using raw SQL
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "CommunityPost" ADD COLUMN IF NOT EXISTS reactions JSONB;`);
    console.log("Added reactions column");
  } catch (e) {
    console.log("Column may already exist, continuing...");
  }

  // Get all posts that don't have reactions set
  const posts = await prisma.communityPost.findMany({
    select: {
      id: true,
      categoryId: true,
      isPinned: true,
    },
  });

  console.log(`Found ${posts.length} posts to process`);

  let updated = 0;
  for (const post of posts) {
    const reactions = generatePostReactions(post.id, post.categoryId, post.isPinned);

    await prisma.communityPost.update({
      where: { id: post.id },
      data: {
        reactions: reactions,
        // Also set likeCount to total of all reactions for sync
        likeCount: Object.values(reactions).reduce((sum, count) => sum + count, 0),
      },
    });

    updated++;
    if (updated % 10 === 0) {
      console.log(`Updated ${updated}/${posts.length} posts`);
    }
  }

  console.log(`\nBackfill complete! Updated ${updated} posts with reactions.`);
}

backfillReactions()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
