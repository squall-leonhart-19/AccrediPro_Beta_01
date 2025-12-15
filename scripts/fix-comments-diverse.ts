/**
 * Fix Comments - Make them diverse with storytelling
 * Deletes existing comments and adds new varied ones
 * Run with: npx tsx scripts/fix-comments-diverse.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ==================== DIVERSE COMMENT TEMPLATES ====================

// SHORT comments (1-2 sentences)
const SHORT_COMMENTS = [
  "🎉",
  "YES!!!",
  "Incredible!",
  "So proud!",
  "Goals! 🙌",
  "AMAZING!",
  "This! 👆",
  "Wow! 🔥",
  "Love it!",
  "Yesss! 💪",
  "Beautiful!",
  "Inspiring!",
  "Congrats!",
  "So happy for you!",
  "You're amazing!",
  "This made my day!",
  "Absolutely love this!",
  "Keep crushing it!",
  "You deserve this!",
  "Screaming! 😱",
  "I'm crying 😭",
  "So so proud!",
  "Queen! 👑",
  "Legend!",
  "Go you!",
  "Needed this today",
  "Thank you for sharing",
  "This is everything",
  "So beautiful ❤️",
  "Can't stop smiling reading this!",
];

// MEDIUM comments with personal touch
const MEDIUM_COMMENTS = [
  "This is exactly what I needed to see today. Thank you for being so open about your journey!",
  "I remember when you first started. Look at you NOW! So incredibly proud of your growth.",
  "Your story gives me so much hope. I'm 3 months in and seeing posts like this keeps me going.",
  "I literally just showed this to my husband. THIS is why I joined this program!",
  "Crying in my coffee right now. You're proof that this actually works!",
  "Ok but can we talk about how far you've come?? I've been following your journey and WOW.",
  "This is the motivation I needed. Just submitted my application yesterday and now I'm even more excited!",
  "Saving this post to read whenever I feel like giving up. Thank you! 🙏",
  "My jaw literally dropped. You're doing incredible things!",
  "I've been lurking for months but had to comment. This is AMAZING!",
  "Just sent this to my sister who's thinking about joining. THIS is why!",
  "Remember when we were both newbies asking all the questions? Now look at us! 💕",
  "Your energy is contagious! Always love seeing your posts pop up.",
  "Bookmarking this for my vision board. You're living my dream!",
  "I need whatever coffee you're drinking because this energy is unmatched! 😂",
  "Not me crying at 7am reading this. So so proud of you!",
  "This community never fails to inspire me. Congratulations!",
  "You always show up so authentically. That's why people love working with you!",
  "Taking notes! Your success is a blueprint for all of us.",
  "My favorite posts are always from you. Keep shining! ✨",
];

// LONG storytelling comments
const LONG_STORY_COMMENTS = [
  "Oh my gosh, this brought me to tears! I was literally where you were 8 months ago - burnt out, questioning everything, wondering if I was crazy for wanting more. Now I'm 6 months into my practice and just had my first $5K month. Your post reminded me why I started. Thank you for being so vulnerable and sharing this! 💕",

  "I remember commenting on your very first post when you were just starting out. You were so nervous about whether you could really do this. Look at you NOW! This is such a testament to what happens when you stay consistent and trust the process. You're an inspiration to all of us who are still in the early stages!",

  "Reading this while my kids are napping and I'm literally in tears. I left my nursing job 4 months ago and some days I still wonder if I made the right choice. Then I see posts like this and I remember WHY. You're living proof that there's a better way. Thank you for sharing your wins - it helps more than you know! 🙏",

  "I have to share something - I almost quit last month. Things were slow, I was doubting myself, and I was ready to go back to my old job. Then I saw one of your posts about pushing through the hard times. I decided to give it one more month. This week I signed 3 new clients. Your story literally changed the trajectory of my business. THANK YOU!",

  "Can I just say - I've been in this community for 2 years now and watching transformations like yours never gets old. You came in quiet and unsure, and now you're out here changing lives and building something incredible. This is what this community is all about! So proud to be on this journey with you! 🌟",

  "My husband just walked in and asked why I was crying at my laptop 😂 I showed him your post and even HE got emotional! He's been my biggest supporter through this journey and seeing stories like yours validates everything. You're not just building a business - you're building a LEGACY. Never forget that!",

  "I need to screenshot this for my 'bad days' folder! You know those days when imposter syndrome hits hard and you wonder if you're actually helping anyone? This post is the antidote. The ripple effect of what you're doing extends so far beyond what you can even see. Keep going! 💪",

  "Girl/Guy, I literally just put my coffee down and said 'WOW' out loud. My cat looked at me like I was crazy 😂 But seriously - this is INCREDIBLE. I've been watching your journey since day one and the growth is just... *chef's kiss*. You're showing all of us what's possible!",

  "OK so I have to tell you - I used YOUR story as an example when I was explaining to my skeptical family why I wanted to do this. They didn't get it at first. Now they see posts like this and they're starting to understand. You're not just changing your clients' lives - you're changing the perception of what's possible for ALL of us! 🙌",

  "This hit different today. I'm sitting in my car outside my 9-5 job, reading this before I go in for another soul-crushing shift. But knowing that people like you made it out gives me hope. 6 more months until I can leave. Posts like this are my fuel. Thank you for sharing! 🔥",
];

// QUESTION comments that start conversations
const QUESTION_COMMENTS = [
  "Incredible! What was the biggest mindset shift you had to make to get here?",
  "Love this so much! How long did it take you to sign your first client?",
  "Amazing journey! Did you niche down right away or did that come later?",
  "So inspiring! What's one piece of advice you'd give to someone just starting out?",
  "Wow! Were there moments you wanted to give up? How did you push through?",
  "This is goals! What does your typical client session look like?",
  "Beautiful! How do you balance this with family life? Asking for myself 😅",
  "Incredible story! What marketing strategy has worked best for you?",
  "So proud of you! Are you doing this full-time now or still transitioning?",
  "Amazing! What certifications do you recommend doing first?",
  "Love seeing this! How did you find your niche? I'm still figuring mine out.",
  "This is what I needed to see! What's your biggest tip for staying consistent?",
  "So inspiring! Do you work with clients in person or virtually?",
  "Congrats! How do you handle clients who are resistant to change?",
  "Beautiful journey! What resources helped you the most when starting out?",
];

// RELATABLE empathy comments
const RELATABLE_COMMENTS = [
  "Are you me?? This is literally my story! We should connect! 💕",
  "I felt every word of this. Same background, same struggles, same dreams. We got this!",
  "Goosebumps reading this because I could have written it myself. The nursing burnout is REAL.",
  "This resonates so deeply. The part about feeling stuck really hit home.",
  "I'm at the exact same point in my journey! Let's be accountability partners!",
  "Reading this felt like reading my own diary. Thank you for putting it into words!",
  "OMG yes! The imposter syndrome struggle is so real. Glad I'm not alone in this!",
  "This is why I love this community - I always find someone who GETS it.",
  "Same same same. The 'aha moment' you described? That was me last Tuesday!",
  "I literally said 'that's me!' out loud reading this. We're twins!",
];

// CELEBRATORY hype comments
const CELEBRATORY_HYPE = [
  "🎉🎉🎉 POP THE CHAMPAGNE! You did THAT! 🍾",
  "EXCUSE ME?! This is absolutely INCREDIBLE! Dancing for you right now! 💃",
  "SCREAMING!!! This is EVERYTHING! I'm so here for this! 🙌",
  "Not me over here doing a happy dance at my desk! YOU DID IT! 🎊",
  "THIS IS HUGE! Like, pause-everything-and-celebrate HUGE! So proud! 🌟",
  "OK BUT CAN WE TALK ABOUT THIS?! Absolutely KILLING it! 🔥🔥🔥",
  "I am SHOOK! In the best way possible! You're amazing! 😱",
  "Throwing confetti through my screen! CONGRATULATIONS! 🎊✨",
  "This calls for a celebration! You're officially a LEGEND! 👑",
  "Standing ovation from over here! *applause* 👏👏👏",
];

// SUPPORTIVE encouragement comments
const SUPPORTIVE_ENCOURAGE = [
  "You've got this! The best is yet to come! 💪",
  "Your clients are so lucky to have you. Keep shining!",
  "Never doubt what you're capable of. This is just the beginning!",
  "You're making a difference in so many lives. Don't ever forget that.",
  "The world needs more people like you. Keep doing what you're doing!",
  "Your dedication inspires me. Thank you for showing up every day!",
  "You're proof that dreams do come true when you put in the work.",
  "Keep going! Every small step is leading to something amazing.",
  "Your journey is inspiring so many people, including me! ❤️",
  "You're building something beautiful. Don't give up!",
];

// SPECIFIC to wins
const WIN_SPECIFIC = [
  "Another one! You're on a ROLL! 🏆",
  "Adding this to the wins channel highlight reel! 🌟",
  "This WIN! I love celebrating with you! 🎉",
  "Win after win after WIN! Unstoppable! 💪",
  "This deserves all the celebration! What a win! 🥳",
  "Wins like this is why I check this channel every morning! 🔥",
  "I live for these win posts! Congratulations! 🙌",
  "Chart-topping WIN right here! You're incredible! 📈",
  "The wins just keep coming! So deserved! ⭐",
  "This is a BIG win! Proud of you! 🏅",
];

// SPECIFIC to graduates
const GRADUATE_SPECIFIC = [
  "Welcome to the certified family, graduate! 🎓 The world needs you!",
  "From student to practitioner! What a beautiful journey! 🌟",
  "Congratulations on earning your certification! You worked SO hard for this!",
  "Another amazing practitioner ready to change lives! So proud! 💕",
  "The graduation posts always make me emotional! Congratulations! 😭🎉",
  "You earned this! Every late night, every module - it all led here! 🙌",
  "Welcome to the other side! It's amazing here! Can't wait to see your impact!",
  "Certified and ready to change the world! LET'S GO! 🔥",
  "This is what dreams are made of! Congratulations on your certification! 🎊",
  "From dreamer to certified practitioner! Your journey inspires me! ✨",
];

// SARAH coach comments - warm, personal, mentoring tone
const SARAH_COMMENTS_DIVERSE = [
  // Short Sarah
  "So proud of you! 💕",
  "YES! This is amazing!",
  "Love seeing this! 🌟",
  "You're incredible!",
  "Keep shining! ✨",

  // Medium Sarah
  "I am SO incredibly proud of you, {name}! Watching your transformation has been one of the highlights of my coaching journey! 💕",
  "{name}, you're absolutely crushing it! Remember when you first messaged me wondering if you could really do this? LOOK AT YOU NOW!",
  "This made my whole day, {name}! Your dedication and heart for helping others shines through in everything you do! 🌟",
  "{name}, I knew from day one you had something special. Thank you for proving me right! So honored to be part of your journey!",
  "Can we all just take a moment to celebrate {name}?! This is what happens when talent meets determination! 🙌",

  // Long Sarah - storytelling
  "Oh {name}, I'm literally getting emotional reading this! I remember our first call - you were so nervous, so uncertain if this path was right for you. You asked me 'Do you really think I can do this?' And I said ABSOLUTELY. Look at you now, changing lives and building something incredible. THIS is why I do what I do. Thank you for trusting the process and for being such a light in this community! 💕✨",

  "{name}, I have to share something with you. I was having a tough day yesterday, questioning if I was really making a difference. Then I saw your post this morning and burst into happy tears. YOU are the reason I wake up excited every day. Your growth, your dedication, your heart for your clients - it's everything. Never stop being you! 🙏❤️",

  "I just showed this to my team and we're all celebrating you, {name}! From your very first module to this moment - what a journey! You've overcome so much and helped so many people along the way. You're not just building a business, you're building a legacy. The ripple effect of your work will touch generations. I'm so honored to know you! 💕",
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

function getRandomDate(postDate: Date, maxHoursAfter: number = 168): Date {
  const minTime = postDate.getTime() + 30 * 60 * 1000;
  const maxTime = postDate.getTime() + maxHoursAfter * 60 * 60 * 1000;
  const randomTime = minTime + Math.random() * (maxTime - minTime);
  return new Date(randomTime);
}

// Get a diverse comment based on weighted randomness
function getDiverseComment(category: string | null, usedComments: Set<string>): string {
  const roll = Math.random();
  let pools: string[][] = [];

  // Weight distribution for variety
  if (roll < 0.25) {
    // 25% short comments
    pools = [SHORT_COMMENTS];
  } else if (roll < 0.50) {
    // 25% medium comments
    pools = [MEDIUM_COMMENTS, SUPPORTIVE_ENCOURAGE];
  } else if (roll < 0.65) {
    // 15% long storytelling
    pools = [LONG_STORY_COMMENTS];
  } else if (roll < 0.75) {
    // 10% questions
    pools = [QUESTION_COMMENTS];
  } else if (roll < 0.85) {
    // 10% relatable
    pools = [RELATABLE_COMMENTS];
  } else {
    // 15% celebratory hype
    pools = [CELEBRATORY_HYPE];
  }

  // Add category-specific
  if (category === "wins" && Math.random() < 0.3) {
    pools.push(WIN_SPECIFIC);
  } else if (category === "graduates" && Math.random() < 0.3) {
    pools.push(GRADUATE_SPECIFIC);
  }

  // Pick from pools, avoiding duplicates
  const allOptions = pools.flat();
  const available = allOptions.filter(c => !usedComments.has(c));

  if (available.length === 0) {
    // If all used, pick any
    return getRandomElement(allOptions);
  }

  const comment = getRandomElement(available);
  usedComments.add(comment);
  return comment;
}

function getSarahComment(authorName: string, usedSarahComments: Set<string>): string {
  const available = SARAH_COMMENTS_DIVERSE.filter(c => !usedSarahComments.has(c));
  const comment = available.length > 0 ? getRandomElement(available) : getRandomElement(SARAH_COMMENTS_DIVERSE);
  usedSarahComments.add(comment);
  return comment.replace(/{name}/g, authorName || "friend");
}

// ==================== MAIN SCRIPT ====================

async function main() {
  console.log("🚀 Starting to fix comments with diverse content...\n");

  // Get Sarah's ID
  const sarah = await prisma.user.findFirst({
    where: { email: "sarah@accredipro-certificate.com" },
    select: { id: true, firstName: true },
  });

  if (!sarah) {
    console.error("❌ Sarah profile not found!");
    process.exit(1);
  }
  console.log(`✅ Found Sarah: ${sarah.firstName}`);

  // Get all fake profiles
  const fakeProfiles = await prisma.user.findMany({
    where: { isFakeProfile: true },
    select: { id: true, firstName: true },
  });

  console.log(`✅ Found ${fakeProfiles.length} fake profiles\n`);

  // Delete all existing comments first
  console.log("🗑️ Deleting existing comments...");
  const deleted = await prisma.postComment.deleteMany({});
  console.log(`✅ Deleted ${deleted.count} existing comments\n`);

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
    },
    orderBy: { createdAt: "asc" },
  });

  console.log(`📝 Adding diverse comments to ${posts.length} posts...\n`);

  let totalCommentsAdded = 0;
  let postsProcessed = 0;

  // Track used comments globally to maximize diversity
  const globalUsedComments = new Set<string>();
  const globalUsedSarahComments = new Set<string>();

  for (const post of posts) {
    // Random number of comments: 7-29
    const numComments = getRandomInt(7, 29);

    // Get eligible commenters (exclude post author)
    const eligibleCommenters = fakeProfiles.filter(p => p.id !== post.authorId);
    const shuffledCommenters = shuffleArray(eligibleCommenters);
    const selectedCommenters = shuffledCommenters.slice(0, Math.min(numComments, shuffledCommenters.length));

    const commentsToCreate: Array<{
      content: string;
      postId: string;
      authorId: string;
      createdAt: Date;
    }> = [];

    // Track used comments for this post to avoid duplicates within same post
    const postUsedComments = new Set<string>();

    // Add Sarah's comment (80% chance)
    if (Math.random() < 0.8 && sarah.id !== post.authorId) {
      const sarahComment = getSarahComment(post.author.firstName || "friend", globalUsedSarahComments);
      commentsToCreate.push({
        content: sarahComment,
        postId: post.id,
        authorId: sarah.id,
        createdAt: getRandomDate(post.createdAt, 24),
      });
    }

    // Add diverse comments from fake profiles
    for (const commenter of selectedCommenters) {
      const comment = getDiverseComment(post.categoryId, postUsedComments);
      globalUsedComments.add(comment);

      commentsToCreate.push({
        content: comment,
        postId: post.id,
        authorId: commenter.id,
        createdAt: getRandomDate(post.createdAt, 168),
      });
    }

    // Sort by date
    commentsToCreate.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    // Insert
    if (commentsToCreate.length > 0) {
      await prisma.postComment.createMany({ data: commentsToCreate });
      totalCommentsAdded += commentsToCreate.length;
    }

    postsProcessed++;

    if (postsProcessed % 100 === 0) {
      console.log(`  Processed ${postsProcessed}/${posts.length} posts (${totalCommentsAdded} comments)...`);
      // Reset post-level tracking periodically to allow reuse
      globalUsedComments.clear();
    }
  }

  console.log(`\n✅ Finished processing ${postsProcessed} posts`);
  console.log(`✅ Added ${totalCommentsAdded} diverse comments\n`);

  // Final stats
  const [totalPosts, totalComments] = await Promise.all([
    prisma.communityPost.count(),
    prisma.postComment.count(),
  ]);

  console.log("========================================");
  console.log("🎉 DIVERSE COMMENTS ADDED SUCCESSFULLY!");
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
