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

// Sarah's welcome responses for variety
const SARAH_RESPONSES = [
  "Welcome to the community! Your journey sounds fascinating. Can't wait to see how functional medicine transforms your practice!",
  "So glad you're here! Your background will bring such valuable perspective to our discussions.",
  "Welcome! Love hearing about your motivation. This community is going to support you every step of the way!",
  "Thrilled to have you join us! Your story resonates with so many practitioners here.",
  "Welcome aboard! The passion in your introduction is contagious. Excited to learn alongside you!",
  "What a wonderful introduction! So happy to have you as part of our growing community.",
  "Your journey is inspiring! Welcome - you're going to love it here.",
  "Thanks for sharing your story! Can't wait to see how you grow with us.",
];

async function main() {
  console.log("Fixing introductions - creating single pinned post with CSV stories as comments...");

  // Step 1: Delete ALL existing introduction posts and their comments
  const existingPosts = await prisma.communityPost.findMany({
    where: { categoryId: "introductions" },
    select: { id: true },
  });

  if (existingPosts.length > 0) {
    // Delete comments first
    await prisma.postComment.deleteMany({
      where: { postId: { in: existingPosts.map((p) => p.id) } },
    });
    // Delete likes
    await prisma.postLike.deleteMany({
      where: { postId: { in: existingPosts.map((p) => p.id) } },
    });
    // Delete posts
    await prisma.communityPost.deleteMany({
      where: { categoryId: "introductions" },
    });
    console.log(`Deleted ${existingPosts.length} existing introduction posts`);
  }

  // Get admin user (Sarah's post)
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
    take: 1500,
  });

  console.log(`Found ${zombies.length} zombie profiles for comments`);

  if (zombies.length === 0) {
    console.error("No zombie profiles found!");
    return;
  }

  // Step 2: Create the single pinned "Introduce Yourself" post from Sarah
  const postDate = new Date("2025-08-01T10:00:00");

  const sarahPost = await prisma.communityPost.create({
    data: {
      title: "Introduce Yourself!",
      content: `Welcome to our amazing community of functional medicine practitioners and enthusiasts!

We'd love to get to know you better. Share a bit about yourself:

- What's your background in health/wellness?
- What drew you to functional medicine?
- What are you hoping to learn or achieve here?
- Fun fact about yourself!

I'll start: I'm Sarah, your community coach here at AccrediPro. I've been passionate about functional medicine for over a decade after it transformed my own health journey. I love connecting practitioners and helping everyone reach their full potential. Fun fact: I'm a huge hiking enthusiast and try to get out on the trails every weekend!

Can't wait to meet you all!`,
      authorId: admin.id,
      categoryId: "introductions",
      isPinned: true,
      viewCount: 8500,
      likeCount: 0,
      reactions: { "❤️": 189, "🔥": 95, "👏": 167, "💯": 53, "🎉": 84, "💪": 78, "⭐": 49, "🙌": 61 },
      createdAt: postDate,
      updatedAt: postDate,
    },
  });

  console.log(`Created pinned introduction post: ${sarahPost.id}`);

  // Step 3: Read the CSV file and add stories as comments
  const csvPath = path.join(__dirname, "../buyerqualification.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.split("\n").filter((line) => line.trim());

  // Skip header (first line is the question)
  const dataLines = lines.slice(1);
  console.log(`Found ${dataLines.length} stories in CSV`);

  let commentCount = 0;
  const baseDate = new Date("2025-08-01T12:00:00"); // Start a few hours after post

  // Shuffle zombies for random assignment
  const shuffledZombies = [...zombies].sort(() => Math.random() - 0.5);

  for (let i = 0; i < dataLines.length; i++) {
    const story = dataLines[i].trim();

    if (!story || story.length < 20) continue; // Skip empty or very short lines

    // Get a zombie for this comment
    const zombie = shuffledZombies[i % shuffledZombies.length];

    // Create comment date (spread over 4 months, each comment ~3 hours apart)
    const commentDate = new Date(baseDate.getTime() + i * 3 * 60 * 60 * 1000);

    // Create the introduction comment
    await prisma.postComment.create({
      data: {
        postId: sarahPost.id,
        authorId: zombie.id,
        content: story,
        likeCount: Math.floor(Math.random() * 15),
        createdAt: commentDate,
        updatedAt: commentDate,
      },
    });

    commentCount++;

    // Add Sarah's reply to some comments (about 25%)
    if (Math.random() < 0.25) {
      const replyDate = new Date(commentDate.getTime() + Math.floor(Math.random() * 12 + 1) * 60 * 60 * 1000);

      await prisma.postComment.create({
        data: {
          postId: sarahPost.id,
          authorId: admin.id,
          content: SARAH_RESPONSES[Math.floor(Math.random() * SARAH_RESPONSES.length)],
          likeCount: Math.floor(Math.random() * 8),
          createdAt: replyDate,
          updatedAt: replyDate,
        },
      });
      commentCount++;
    }

    if ((i + 1) % 100 === 0) {
      console.log(`Created ${commentCount} comments (processed ${i + 1} stories)...`);
    }
  }

  // Update like count based on reactions
  const totalLikes = Object.values(sarahPost.reactions as Record<string, number>).reduce(
    (sum, count) => sum + count, 0
  );

  await prisma.communityPost.update({
    where: { id: sarahPost.id },
    data: { likeCount: totalLikes },
  });

  console.log(`\n✅ Done! Created 1 pinned post with ${commentCount} comments (stories + Sarah replies)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
