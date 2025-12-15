/**
 * Fix Coaching Tips Posts
 * - Remove "Day X:" from titles
 * - Set dates from Aug 15 to Dec 14
 * - Add 30 more coaching posts
 * Run with: npx tsx scripts/fix-coaching-tips.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// New coaching tips titles (no day numbers)
const COACHING_TIPS_TITLES = [
  "The Power of Morning Routines for Your Clients",
  "Understanding Blood Sugar Balance",
  "Why Sleep is Non-Negotiable for Healing",
  "The Gut-Brain Connection Explained Simply",
  "How to Handle Client Resistance",
  "Building Sustainable Habits with Clients",
  "The Art of Active Listening in Consultations",
  "Inflammation: The Root of Most Issues",
  "Creating Effective Meal Plans",
  "Stress Management Techniques That Actually Work",
  "The Importance of Hydration (Beyond Just Water)",
  "How to Set Boundaries with Difficult Clients",
  "Interpreting Lab Work for Beginners",
  "The Thyroid-Adrenal Connection",
  "Building Client Accountability Systems",
  "Detox Pathways Made Simple",
  "When to Refer Out: Knowing Your Limits",
  "The Power of Food as Medicine",
  "Creating Lasting Behavior Change",
  "Understanding Hormone Imbalances",
  "The Microbiome: Your Client's Second Brain",
  "Pricing Your Services with Confidence",
  "How to Run Effective Discovery Calls",
  "The Connection Between Trauma and Health",
  "Building Your Supplement Protocol",
  "Client Communication Best Practices",
  "The Role of Movement in Healing",
  "Managing Client Expectations",
  "The Importance of Community in Health",
  "Self-Care for Practitioners",
  // 30 more new tips
  "Mastering the Art of Follow-Up",
  "Why Functional Testing Matters",
  "Creating Your Signature Protocol",
  "The Power of Group Programs",
  "Building Trust in the First Session",
  "Understanding Autoimmune Conditions",
  "How to Handle Clients Who Don't Comply",
  "The Business Side of Functional Medicine",
  "Creating Compelling Case Studies",
  "When Healing Isn't Linear: Supporting Clients",
  "The Role of Mindset in Recovery",
  "Building Referral Networks",
  "Understanding Food Sensitivities",
  "The Power of Progress Tracking",
  "Creating Content That Converts",
  "Managing Your Energy as a Practitioner",
  "The Science of Nervous System Regulation",
  "Building Long-Term Client Relationships",
  "Understanding Mitochondrial Health",
  "How to Niche Down Successfully",
  "The Art of Asking Better Questions",
  "Supporting Clients Through Plateaus",
  "Building Your Online Presence",
  "The Connection Between Oral Health and Systemic Disease",
  "Creating Effective Onboarding Processes",
  "Understanding Mold and Mycotoxins",
  "Building Multiple Revenue Streams",
  "The Power of Testimonials",
  "Supporting Clients with Chronic Fatigue",
  "Creating Your Unique Framework",
];

// Coaching tips content templates
const COACHING_CONTENT_TEMPLATES = [
  `One of the most powerful tools we have as practitioners is {topic}.

**Why it matters:**
When we understand {concept}, we can better serve our clients and see faster, more sustainable results.

**Key takeaways:**
• Start with the basics and build from there
• Every client is unique - adapt your approach
• Document what works for future reference

**Action step:** Try implementing this with your next client and notice the difference.

What's been your experience with this? Drop a comment below! 👇`,

  `Let's talk about something that comes up ALL the time in sessions: {topic}.

Here's what I've learned after working with hundreds of clients...

**The truth is:** Most practitioners overcomplicate this. The key is to {concept}.

**My top 3 tips:**
1. Listen more than you talk
2. Meet clients where they are
3. Celebrate small wins

Remember: Progress over perfection! 💪

What strategies have worked for you?`,

  `🌟 **Quick Tip Alert** 🌟

{topic} - a game-changer for your practice!

I used to struggle with this until I realized: {concept}

**The simple framework:**
✅ Assess the situation
✅ Create a personalized plan
✅ Follow up consistently
✅ Adjust as needed

Your clients will thank you for this approach!

Have questions? Ask away! 👇`,

  `Something I wish I knew when I first started: {topic}

It took me years to figure this out, but now I want to share it with you so you don't have to learn the hard way.

**Here's the deal:**
{concept}

**What this looks like in practice:**
• Start every session with clear intentions
• Document your findings meticulously
• Build systems that scale with you

This is the kind of knowledge that transforms practices.

Who else has experienced this? Let me know! 💕`,

  `📚 **Education Corner** 📚

Today we're diving into {topic}!

This is FOUNDATIONAL to everything we do as practitioners. Understanding {concept} will change how you approach cases.

**Breaking it down:**

**Phase 1:** Assessment
**Phase 2:** Protocol Design
**Phase 3:** Implementation
**Phase 4:** Optimization

**Pro tip:** Keep it simple. Complexity is the enemy of compliance.

Save this post for reference! 📌`,

  `Real talk: {topic} is something we ALL need to master.

I've seen so many practitioners struggle with this, and I get it - it's not easy!

But here's the thing: {concept}

**My approach:**
1️⃣ Build the foundation first
2️⃣ Layer in complexity slowly
3️⃣ Always track results
4️⃣ Be willing to pivot

The best practitioners are the ones who never stop learning.

What's YOUR biggest challenge with this? Let's discuss! 💬`,

  `✨ **Practitioner Wisdom** ✨

Can we talk about {topic}?

This came up in a client session yesterday and I realized how important it is to share: {concept}

**Things to remember:**
• You're not just treating symptoms
• The body is interconnected
• Root cause is everything
• Patience is part of the protocol

Your expertise matters. Trust your training! 🙌

Thoughts? Questions? Share below!`,

  `Something that completely changed my practice: understanding {topic}.

Before I grasped {concept}, I was spinning my wheels with clients. Now? Game-changer.

**The breakthrough moment:**
When you realize that everything connects, your entire approach shifts.

**What I do now:**
• Always look upstream
• Consider lifestyle factors
• Address the terrain
• Support the whole person

This is the difference between good and GREAT practitioners.

Who's had a similar "aha" moment? 🎉`,
];

// Helper functions
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDateInRange(startDate: Date, endDate: Date): Date {
  const start = startDate.getTime();
  const end = endDate.getTime();
  return new Date(start + Math.random() * (end - start));
}

// Generate content for a tip
function generateTipContent(title: string): string {
  const template = getRandomElement(COACHING_CONTENT_TEMPLATES);
  const topic = title.toLowerCase();
  const concepts = [
    "simplicity is key",
    "consistency beats intensity",
    "small changes lead to big results",
    "personalization is everything",
    "the body wants to heal",
    "foundations first",
    "education empowers clients",
    "systems create freedom",
  ];

  return template
    .replace(/{topic}/g, topic)
    .replace(/{concept}/g, getRandomElement(concepts));
}

// Comment templates for coaching posts
const COACHING_COMMENTS = [
  "This is so helpful! Thank you for sharing! 🙏",
  "Needed this reminder today! 💕",
  "Saving this for reference!",
  "Such great insights!",
  "This changed how I approach my sessions!",
  "Love the framework you shared!",
  "So true! This is foundational!",
  "Thank you Sarah! Always learning from you! 🌟",
  "This is gold! ✨",
  "Implementing this tomorrow!",
  "YES! Finally someone explained this clearly!",
  "Screenshot taken! 📸",
  "This is exactly what I needed to hear!",
  "Game changer! Thank you!",
  "Can you do more posts like this?",
  "So valuable! Thank you for your generosity!",
  "Bookmarking this one! 📚",
  "Love how you broke this down!",
  "This community is amazing! 💪",
  "Learning so much from these tips!",
  "You always deliver the best content!",
  "Wow, never thought about it this way!",
  "This is why I love being part of this community!",
  "More of this please! 🙌",
  "Taking notes! ✍️",
];

async function main() {
  console.log("🚀 Starting to fix coaching tips posts...\n");

  // Get Sarah's ID (she posts coaching tips)
  const sarah = await prisma.user.findFirst({
    where: { email: "sarah@accredipro-certificate.com" },
    select: { id: true, firstName: true },
  });

  if (!sarah) {
    console.error("❌ Sarah profile not found!");
    process.exit(1);
  }
  console.log(`✅ Found Sarah: ${sarah.firstName}`);

  // Get fake profiles for comments
  const fakeProfiles = await prisma.user.findMany({
    where: { isFakeProfile: true },
    select: { id: true },
    take: 100,
  });
  console.log(`✅ Found ${fakeProfiles.length} fake profiles for comments\n`);

  // Date range: Aug 15, 2024 to Dec 14, 2024
  const startDate = new Date("2024-08-15T08:00:00Z");
  const endDate = new Date("2024-12-14T20:00:00Z");

  // Step 1: Delete existing coaching tips posts
  console.log("🗑️ Deleting existing coaching tips posts...");
  const deletedComments = await prisma.postComment.deleteMany({
    where: { post: { categoryId: "tips" } },
  });
  console.log(`  Deleted ${deletedComments.count} comments from tips posts`);

  const deletedPosts = await prisma.communityPost.deleteMany({
    where: { categoryId: "tips" },
  });
  console.log(`  Deleted ${deletedPosts.count} coaching tips posts\n`);

  // Step 2: Create new coaching tips posts (use all 60 titles)
  console.log("📝 Creating new coaching tips posts...");

  const postsToCreate = COACHING_TIPS_TITLES.slice(0, 60); // 60 posts total
  let postsCreated = 0;
  let commentsCreated = 0;

  for (const title of postsToCreate) {
    // Generate random date within range
    const postDate = getRandomDateInRange(startDate, endDate);

    // Generate content
    const content = generateTipContent(title);

    // Create the post
    const post = await prisma.communityPost.create({
      data: {
        title,
        content,
        categoryId: "tips",
        authorId: sarah.id,
        viewCount: getRandomInt(150, 800),
        likeCount: getRandomInt(40, 200),
        createdAt: postDate,
        isPinned: false,
      },
    });

    // Add comments (7-20 per post)
    const numComments = getRandomInt(7, 20);
    const shuffledProfiles = [...fakeProfiles].sort(() => Math.random() - 0.5);
    const selectedCommenters = shuffledProfiles.slice(0, numComments);

    const commentsToAdd: Array<{
      content: string;
      postId: string;
      authorId: string;
      createdAt: Date;
    }> = [];

    const usedComments = new Set<string>();

    for (const commenter of selectedCommenters) {
      // Get unique comment
      let comment = getRandomElement(COACHING_COMMENTS);
      let attempts = 0;
      while (usedComments.has(comment) && attempts < 10) {
        comment = getRandomElement(COACHING_COMMENTS);
        attempts++;
      }
      usedComments.add(comment);

      // Comment date: 30min to 5 days after post
      const commentDate = new Date(postDate.getTime() + getRandomInt(30, 7200) * 60 * 1000);

      commentsToAdd.push({
        content: comment,
        postId: post.id,
        authorId: commenter.id,
        createdAt: commentDate,
      });
    }

    if (commentsToAdd.length > 0) {
      await prisma.postComment.createMany({ data: commentsToAdd });
      commentsCreated += commentsToAdd.length;
    }

    postsCreated++;
    if (postsCreated % 10 === 0) {
      console.log(`  Created ${postsCreated}/${postsToCreate.length} posts...`);
    }
  }

  console.log(`\n✅ Created ${postsCreated} coaching tips posts`);
  console.log(`✅ Added ${commentsCreated} comments\n`);

  // Final stats
  const tipsPosts = await prisma.communityPost.count({ where: { categoryId: "tips" } });
  const tipsComments = await prisma.postComment.count({
    where: { post: { categoryId: "tips" } },
  });

  console.log("========================================");
  console.log("🎉 COACHING TIPS FIXED SUCCESSFULLY!");
  console.log("========================================");
  console.log(`Total coaching tips posts: ${tipsPosts}`);
  console.log(`Total comments on tips: ${tipsComments}`);
  console.log("Date range: Aug 15 - Dec 14, 2024");
  console.log("========================================");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Error:", e);
  prisma.$disconnect();
  process.exit(1);
});
