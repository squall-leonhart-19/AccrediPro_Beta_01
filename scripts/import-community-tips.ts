import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Parse the tips from markdown
function parseTips(content: string): { tipNumber: number; title: string; content: string }[] {
  const tips: { tipNumber: number; title: string; content: string }[] = [];

  // Split by TIP headers
  const tipMatches = content.split(/## TIP (\d+):/);

  for (let i = 1; i < tipMatches.length; i += 2) {
    const tipNumber = parseInt(tipMatches[i]);
    const tipContent = tipMatches[i + 1];

    if (!tipContent) continue;

    // Get title from first line
    const lines = tipContent.trim().split('\n');
    const title = lines[0].trim();

    // Get content (everything until next section or end)
    const contentLines: string[] = [];
    for (let j = 1; j < lines.length; j++) {
      const line = lines[j];
      if (line.startsWith('---') || line.startsWith('# SECTION')) break;
      contentLines.push(line);
    }

    const fullContent = contentLines.join('\n').trim();

    if (title && fullContent) {
      tips.push({ tipNumber, title, content: fullContent });
    }
  }

  return tips;
}

// Parse comments from the comments markdown
function parseComments(content: string): Map<number, { username: string; comment: string }[]> {
  const commentsByTip = new Map<number, { username: string; comment: string }[]>();

  // Split by TIP headers in comments file
  const sections = content.split(/# TIP (\d+):/);

  for (let i = 1; i < sections.length; i += 2) {
    const tipNumber = parseInt(sections[i]);
    const commentSection = sections[i + 1];

    if (!commentSection) continue;

    const comments: { username: string; comment: string }[] = [];

    // Match comment patterns: **@Username**\nComment text
    const commentMatches = commentSection.matchAll(/\d+\.\s+\*\*@([^*]+)\*\*\s*\n([^*]+?)(?=\n\d+\.\s+\*\*@|\n---|\n#|$)/g);

    for (const match of commentMatches) {
      const username = match[1].trim();
      const comment = match[2].trim();
      if (username && comment) {
        comments.push({ username, comment });
      }
    }

    if (comments.length > 0) {
      commentsByTip.set(tipNumber, comments);
    }
  }

  return commentsByTip;
}

async function main() {
  // Read the tips file
  const tipsPath = path.join(__dirname, "../FM/COMMUNITY/60_community_tips_COMPLETE.md");
  const tipsContent = fs.readFileSync(tipsPath, "utf-8");

  // Read the comments file
  const commentsPath = path.join(__dirname, "../FM/COMMUNITY/60_community_tips_comments_COMPLETE.md");
  const commentsContent = fs.readFileSync(commentsPath, "utf-8");

  // Parse tips and comments
  const tips = parseTips(tipsContent);
  const commentsByTip = parseComments(commentsContent);

  console.log(`Parsed ${tips.length} tips`);
  console.log(`Parsed comments for ${commentsByTip.size} tips`);

  // Get admin user (Sarah's posts will come from admin)
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!admin) {
    console.error("Admin user not found!");
    return;
  }

  console.log(`Using admin: ${admin.firstName} ${admin.lastName}`);

  // Get zombie profiles for comments
  const zombies = await prisma.user.findMany({
    where: {
      isFakeProfile: true,
      avatar: { contains: "accredipro.academy" }
    },
    take: 500,
  });

  console.log(`Found ${zombies.length} zombie profiles for comments`);

  // Delete existing coaching tips posts
  const deletedPosts = await prisma.communityPost.deleteMany({
    where: { categoryId: "coaching-tips" }
  });
  console.log(`Deleted ${deletedPosts.count} existing coaching tips posts`);

  // Date range: Aug 17, 2025 to Dec 15, 2025
  const startDate = new Date("2025-08-17T08:00:00");
  const endDate = new Date("2025-12-15T20:00:00");
  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  let createdPosts = 0;
  let createdComments = 0;
  let createdLikes = 0;

  for (const tip of tips) {
    // Calculate date for this tip (spread evenly from newest to oldest)
    const tipIndex = tips.length - tip.tipNumber; // Tip 60 is newest, Tip 1 is oldest
    const daysFromEnd = Math.floor((tipIndex / (tips.length - 1)) * totalDays);
    const postDate = new Date(endDate.getTime() - (daysFromEnd * 24 * 60 * 60 * 1000));
    postDate.setHours(8 + Math.floor(Math.random() * 12)); // 8am to 8pm
    postDate.setMinutes(Math.floor(Math.random() * 60));

    // Create the post
    const post = await prisma.communityPost.create({
      data: {
        title: `Coaching Tip #${tip.tipNumber}: ${tip.title}`,
        content: tip.content,
        authorId: admin.id,
        categoryId: "coaching-tips",
        isPinned: tip.tipNumber <= 3, // Pin first 3 tips
        viewCount: 150 + Math.floor(Math.random() * 500),
        likeCount: 0, // Will update after adding likes
        createdAt: postDate,
        updatedAt: postDate,
      },
    });

    createdPosts++;

    // Add likes from random zombies (15-40 likes per post)
    const likeCount = 15 + Math.floor(Math.random() * 25);
    const shuffledZombies = [...zombies].sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(likeCount, shuffledZombies.length); i++) {
      const likeDate = new Date(postDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000); // Within 7 days of post
      try {
        await prisma.postLike.create({
          data: {
            postId: post.id,
            userId: shuffledZombies[i].id,
            createdAt: likeDate,
          },
        });
        createdLikes++;
      } catch (e) {
        // Skip duplicate likes
      }
    }

    // Update like count
    await prisma.communityPost.update({
      where: { id: post.id },
      data: { likeCount },
    });

    // Add comments for this tip
    const tipComments = commentsByTip.get(tip.tipNumber) || [];
    const shuffledZombiesForComments = [...zombies].sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(tipComments.length, shuffledZombiesForComments.length); i++) {
      const commentData = tipComments[i];
      const zombie = shuffledZombiesForComments[i];

      // Comment date is after post date
      const commentDate = new Date(postDate.getTime() + (i + 1) * 30 * 60 * 1000 + Math.random() * 24 * 60 * 60 * 1000);

      await prisma.postComment.create({
        data: {
          postId: post.id,
          authorId: zombie.id,
          content: commentData.comment,
          likeCount: Math.floor(Math.random() * 10),
          createdAt: commentDate,
          updatedAt: commentDate,
        },
      });

      createdComments++;
    }

    if (createdPosts % 10 === 0) {
      console.log(`Created ${createdPosts} posts, ${createdComments} comments, ${createdLikes} likes...`);
    }
  }

  console.log(`\n✅ Import complete!`);
  console.log(`   - ${createdPosts} coaching tips posts`);
  console.log(`   - ${createdComments} comments`);
  console.log(`   - ${createdLikes} likes`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
