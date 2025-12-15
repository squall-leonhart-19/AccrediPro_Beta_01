/**
 * Add Comments to All Community Posts
 * Adds 7-29 random comments to each post
 * Ensures commenter is never the post author
 * Run with: npx tsx scripts/add-comments-to-posts.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ==================== COMMENT TEMPLATES ====================

// Generic supportive comments
const SUPPORTIVE_COMMENTS = [
  "This is absolutely amazing! So proud of you! 🎉",
  "Incredible journey! You're inspiring all of us!",
  "Wow, this made my day! Congratulations!",
  "So happy for you! Keep crushing it! 💪",
  "This is exactly why I love this community!",
  "You're proof that hard work pays off!",
  "Incredible! Can't wait to see what's next for you!",
  "This brought tears to my eyes! So beautiful!",
  "You deserve every bit of this success!",
  "Thank you for sharing! This gives me so much hope!",
  "Absolutely inspiring! You're a rockstar! ⭐",
  "Goals! This is exactly what I'm working toward!",
  "So motivating! Thank you for being so open!",
  "This is what transformation looks like!",
  "Wow just wow! Congratulations on this milestone!",
  "I'm screenshot-ing this for motivation! 📱",
  "You're living proof that this works!",
  "So proud to be in this community with you!",
  "This is the energy I needed today!",
  "Celebrating with you from afar! 🥳",
];

// Question/engagement comments
const QUESTION_COMMENTS = [
  "This is amazing! How long did it take you to get here?",
  "Love this! What was your biggest challenge along the way?",
  "So inspiring! Any tips for someone just starting out?",
  "Incredible! What would you say was the turning point?",
  "Wow! Did you work with a mentor or go solo?",
  "This is goals! How do you find your clients?",
  "Amazing journey! What kept you going during tough times?",
  "Love hearing this! What's your niche?",
  "So proud of you! What's your best advice for newbies?",
  "This is incredible! How do you manage work-life balance?",
];

// Celebratory comments
const CELEBRATORY_COMMENTS = [
  "🎉🎉🎉 YES! This is HUGE!",
  "Dropping confetti for you right now! 🎊",
  "AMAZING! Pop the champagne! 🍾",
  "This calls for a celebration! 🥳",
  "Dancing in my seat reading this! 💃",
  "YESSSSS! So deserved! 🙌",
  "I literally screamed when I read this! 😱",
  "This is EVERYTHING! Congrats! 🌟",
  "Standing ovation from me! 👏👏👏",
  "You're on FIRE! 🔥🔥🔥",
];

// Relatable/empathetic comments
const RELATABLE_COMMENTS = [
  "I felt this in my soul! Can totally relate!",
  "Are you me? This is my story too!",
  "Needed to hear this today. Thank you!",
  "Going through something similar - this gives me hope!",
  "This resonates so much with my journey!",
  "I was just there last year! It gets even better!",
  "We have such similar paths! Love connecting with you!",
  "This hits different. Thank you for sharing!",
  "Crying because I relate to this so much!",
  "Yes! Finally someone who understands!",
];

// Specific to wins category
const WIN_SPECIFIC_COMMENTS = [
  "Another win for the community! You're amazing!",
  "This is why I love seeing everyone's wins!",
  "Adding this to the wall of fame! 🏆",
  "What a win! You should be SO proud!",
  "Sharing wins like this helps us all! Thank you!",
  "This win is MASSIVE! Celebrate yourself!",
  "Win after win! You're unstoppable!",
  "This community wins together! Congrats!",
  "Your win is my motivation! Thank you!",
  "Every win counts and this one is HUGE!",
];

// Specific to graduates category
const GRADUATE_SPECIFIC_COMMENTS = [
  "Welcome to the certified family! 🎓",
  "So proud of you, graduate! The world needs you!",
  "Another practitioner ready to change lives!",
  "Congratulations on your certification! 🎉",
  "The hard work paid off! Well deserved!",
  "Can't wait to see the impact you'll make!",
  "From student to certified! What a journey!",
  "You earned this! So happy for you!",
  "Another success story! Congratulations!",
  "Welcome to the other side! It's amazing here!",
];

// Coach Sarah specific comments
const SARAH_COMMENTS = [
  "I am SO proud of you, {name}! This is exactly what we love to see! 💕",
  "{name}, you're absolutely crushing it! Your dedication is inspiring!",
  "This brought tears to my eyes, {name}! You've come so far!",
  "WOW {name}! This is what transformation looks like! Keep shining! ✨",
  "{name}, I knew you had it in you from day one! So proud!",
  "YES {name}! This is the energy! You're going to help so many people!",
  "{name}, your journey is going to inspire countless others! Thank you for sharing!",
  "I'm literally doing a happy dance for you, {name}! 💃",
  "{name}, this is just the beginning! Can't wait to see what's next!",
  "So honored to be part of your journey, {name}! You're amazing!",
];

// Reply templates for creating threaded conversations
const REPLY_TEMPLATES = [
  "Thank you so much! 🙏",
  "This means everything to me!",
  "Your support keeps me going!",
  "So grateful for this community!",
  "Thanks for celebrating with me! 💕",
  "You all are the best!",
  "Couldn't have done it without this group!",
  "Sending love right back! ❤️",
  "This community is everything!",
  "Thank you for being here!",
];

// ==================== HELPER FUNCTIONS ====================

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getRandomCommentForCategory(category: string | null): string {
  const pools = [SUPPORTIVE_COMMENTS, CELEBRATORY_COMMENTS, RELATABLE_COMMENTS];

  if (category === "wins") {
    pools.push(WIN_SPECIFIC_COMMENTS);
  } else if (category === "graduates") {
    pools.push(GRADUATE_SPECIFIC_COMMENTS);
  }

  // 20% chance for a question comment
  if (Math.random() < 0.2) {
    return getRandomElement(QUESTION_COMMENTS);
  }

  const pool = getRandomElement(pools);
  return getRandomElement(pool);
}

function getRandomDate(postDate: Date, maxHoursAfter: number = 168): Date {
  // Comments should be after post, within maxHoursAfter (default 7 days)
  const minTime = postDate.getTime() + 30 * 60 * 1000; // At least 30 min after
  const maxTime = postDate.getTime() + maxHoursAfter * 60 * 60 * 1000;
  const randomTime = minTime + Math.random() * (maxTime - minTime);
  return new Date(randomTime);
}

// ==================== MAIN SCRIPT ====================

async function main() {
  console.log("🚀 Starting to add comments to community posts...\n");

  // Get Sarah's ID for coach comments
  const sarah = await prisma.user.findFirst({
    where: { email: "sarah@accredipro-certificate.com" },
    select: { id: true, firstName: true },
  });

  if (!sarah) {
    console.error("❌ Sarah profile not found! Please run seed script first.");
    process.exit(1);
  }
  console.log(`✅ Found Sarah: ${sarah.firstName}`);

  // Get all fake profiles for commenting
  const fakeProfiles = await prisma.user.findMany({
    where: { isFakeProfile: true },
    select: { id: true, firstName: true },
  });

  if (fakeProfiles.length < 30) {
    console.error("❌ Not enough fake profiles! Need at least 30.");
    process.exit(1);
  }
  console.log(`✅ Found ${fakeProfiles.length} fake profiles for commenting\n`);

  // Get all posts
  const posts = await prisma.communityPost.findMany({
    select: {
      id: true,
      authorId: true,
      categoryId: true,
      createdAt: true,
      author: {
        select: { firstName: true },
      },
      _count: {
        select: { comments: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  console.log(`📝 Found ${posts.length} posts to add comments to\n`);

  let totalCommentsAdded = 0;
  let postsProcessed = 0;

  for (const post of posts) {
    // Skip posts that already have many comments (more than 10)
    if (post._count.comments > 10) {
      postsProcessed++;
      continue;
    }

    // Random number of comments: 7-29
    const numComments = getRandomInt(7, 29);

    // Get eligible commenters (exclude post author)
    const eligibleCommenters = fakeProfiles.filter(p => p.id !== post.authorId);
    const shuffledCommenters = shuffleArray(eligibleCommenters);

    // Select unique commenters for this post
    const selectedCommenters = shuffledCommenters.slice(0, Math.min(numComments, shuffledCommenters.length));

    const commentsToCreate: Array<{
      content: string;
      postId: string;
      authorId: string;
      createdAt: Date;
    }> = [];

    // Add Sarah's comment first (80% chance)
    if (Math.random() < 0.8 && sarah.id !== post.authorId) {
      const sarahComment = getRandomElement(SARAH_COMMENTS)
        .replace("{name}", post.author.firstName || "there");

      commentsToCreate.push({
        content: sarahComment,
        postId: post.id,
        authorId: sarah.id,
        createdAt: getRandomDate(post.createdAt, 24), // Sarah responds within 24 hours
      });
    }

    // Add random comments from fake profiles
    for (const commenter of selectedCommenters) {
      const comment = getRandomCommentForCategory(post.categoryId);

      commentsToCreate.push({
        content: comment,
        postId: post.id,
        authorId: commenter.id,
        createdAt: getRandomDate(post.createdAt, 168), // Within 7 days
      });
    }

    // Sort comments by date
    commentsToCreate.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    // Insert comments
    if (commentsToCreate.length > 0) {
      await prisma.postComment.createMany({
        data: commentsToCreate,
      });
      totalCommentsAdded += commentsToCreate.length;
    }

    postsProcessed++;

    // Progress update every 50 posts
    if (postsProcessed % 50 === 0) {
      console.log(`  Processed ${postsProcessed}/${posts.length} posts (${totalCommentsAdded} comments added)...`);
    }
  }

  console.log(`\n✅ Finished processing ${postsProcessed} posts`);
  console.log(`✅ Added ${totalCommentsAdded} new comments\n`);

  // Get final stats
  const [totalPosts, totalComments] = await Promise.all([
    prisma.communityPost.count(),
    prisma.postComment.count(),
  ]);

  console.log("========================================");
  console.log("🎉 COMMENTS ADDED SUCCESSFULLY!");
  console.log("========================================");
  console.log(`Total posts: ${totalPosts}`);
  console.log(`Total comments: ${totalComments}`);
  console.log(`Average comments per post: ${(totalComments / totalPosts).toFixed(1)}`);
  console.log("========================================");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Error:", e);
  prisma.$disconnect();
  process.exit(1);
});
