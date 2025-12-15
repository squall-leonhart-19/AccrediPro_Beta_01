/**
 * Delete all coaching tips posts
 * Run with: npx tsx scripts/delete-coaching-tips.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🗑️ Deleting all coaching tips posts...\n");

  // Delete comments first (foreign key constraint)
  const deletedComments = await prisma.postComment.deleteMany({
    where: { post: { categoryId: "tips" } },
  });
  console.log(`✅ Deleted ${deletedComments.count} comments`);

  // Delete posts
  const deletedPosts = await prisma.communityPost.deleteMany({
    where: { categoryId: "tips" },
  });
  console.log(`✅ Deleted ${deletedPosts.count} coaching tips posts`);

  console.log("\n✅ Done! All coaching tips removed.");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Error:", e);
  prisma.$disconnect();
  process.exit(1);
});
