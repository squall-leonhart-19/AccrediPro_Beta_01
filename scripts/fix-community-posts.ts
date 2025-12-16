import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Fixing community posts...\n");

  // Get Sarah's user ID
  const sarah = await prisma.user.findFirst({
    where: { email: "coach@accredipro.com" },
  });

  if (!sarah) {
    console.error("Sarah user not found!");
    return;
  }

  console.log(`Found Sarah: ${sarah.firstName} ${sarah.lastName} (${sarah.id})`);

  // 1. Fix the "Introduce Yourself" post - update author to Sarah and improve content
  const introPost = await prisma.communityPost.findFirst({
    where: {
      categoryId: "introductions",
      isPinned: true
    },
  });

  if (introPost) {
    const improvedContent = `<p><strong>Welcome to our incredible community!</strong> 🌟</p>

<p>I'm <strong>Dr. Sarah Mitchell</strong>, your Community Coach here at AccrediPro, and I'm SO thrilled you're here!</p>

<p>This is YOUR space to connect with like-minded practitioners who share your passion for functional medicine. We're not just colleagues here — we're a family of healers on a mission to transform healthcare.</p>

<br/>

<p><strong>I'd absolutely love to get to know you!</strong> Please share:</p>

<p>✨ What's your background in health & wellness?</p>
<p>💫 What drew you to functional medicine?</p>
<p>🎯 What are you hoping to learn or achieve here?</p>
<p>🌈 A fun fact about yourself!</p>

<br/>

<p>I'll go first! I've been passionate about functional medicine for over a decade after it completely transformed my own health journey. What started as personal healing became my life's mission — helping practitioners like YOU unlock your full potential.</p>

<p>Fun fact: I'm a huge hiking enthusiast and try to get out on the trails every weekend. Nature is my reset button! 🏔️</p>

<br/>

<p><em>Can't wait to meet each and every one of you. Your story matters, and I'm here to support you every step of the way!</em></p>

<p>With so much excitement,<br/><strong>Dr. Sarah Mitchell</strong> 💚</p>`;

    await prisma.communityPost.update({
      where: { id: introPost.id },
      data: {
        authorId: sarah.id,
        title: "Welcome! Introduce Yourself Here! 👋",
        content: improvedContent,
      },
    });

    console.log("✅ Updated Introduce Yourself post with Sarah as author and improved content");
  }

  // 2. Find or create pinned posts for each category and set order
  // Order: 1. Introductions, 2. Coaching Tips, 3. Wins + Graduates, 4. Questions + Career

  // Find coaching tips pinned post
  const coachingTipsPost = await prisma.communityPost.findFirst({
    where: {
      categoryId: "coaching-tips",
      isPinned: true
    },
  });

  // Find or create Share Your Wins pinned post
  let winsPost = await prisma.communityPost.findFirst({
    where: {
      categoryId: "wins",
      isPinned: true
    },
  });

  if (!winsPost) {
    winsPost = await prisma.communityPost.create({
      data: {
        title: "🏆 Share Your Wins & Celebrate Together!",
        content: `<p><strong>This is your celebration space!</strong> 🎉</p>

<p>Every win matters — big or small. Whether you just landed your first client, completed a challenging module, received amazing feedback from a patient, or simply showed up today when it was hard...</p>

<p><strong>WE WANT TO CELEBRATE WITH YOU!</strong></p>

<br/>

<p>Create your own post to share:</p>
<p>🌟 Client success stories</p>
<p>💪 Personal breakthroughs</p>
<p>📚 Course milestones</p>
<p>🎯 Goals achieved</p>
<p>✨ Anything that made you proud!</p>

<br/>

<p><em>Remember: Your wins inspire others. When you share your success, you give someone else permission to dream bigger.</em></p>

<p>Go ahead — create a post and let us celebrate YOU! 🥳</p>`,
        authorId: sarah.id,
        categoryId: "wins",
        isPinned: true,
        isLocked: true, // Read only - no comments
        viewCount: 2500,
        likeCount: 445,
        reactions: { "❤️": 120, "🔥": 75, "👏": 95, "💯": 45, "🎉": 60, "💪": 30, "⭐": 12, "🙌": 8 },
        createdAt: new Date("2025-08-02T10:00:00"),
        updatedAt: new Date("2025-08-02T10:00:00"),
      },
    });
    console.log("✅ Created Share Your Wins pinned post");
  } else {
    await prisma.communityPost.update({
      where: { id: winsPost.id },
      data: {
        authorId: sarah.id,
        isLocked: true,
        title: "🏆 Share Your Wins & Celebrate Together!",
        content: `<p><strong>This is your celebration space!</strong> 🎉</p>

<p>Every win matters — big or small. Whether you just landed your first client, completed a challenging module, received amazing feedback from a patient, or simply showed up today when it was hard...</p>

<p><strong>WE WANT TO CELEBRATE WITH YOU!</strong></p>

<br/>

<p>Create your own post to share:</p>
<p>🌟 Client success stories</p>
<p>💪 Personal breakthroughs</p>
<p>📚 Course milestones</p>
<p>🎯 Goals achieved</p>
<p>✨ Anything that made you proud!</p>

<br/>

<p><em>Remember: Your wins inspire others. When you share your success, you give someone else permission to dream bigger.</em></p>

<p>Go ahead — create a post and let us celebrate YOU! 🥳</p>`,
      },
    });
    console.log("✅ Updated Share Your Wins post - locked and improved");
  }

  // Delete comments from wins post
  if (winsPost) {
    const deletedWinsComments = await prisma.postComment.deleteMany({
      where: { postId: winsPost.id },
    });
    console.log(`   Deleted ${deletedWinsComments.count} comments from wins post`);
  }

  // Find or create New Graduates pinned post
  let graduatesPost = await prisma.communityPost.findFirst({
    where: {
      categoryId: "graduates",
      isPinned: true
    },
  });

  if (!graduatesPost) {
    graduatesPost = await prisma.communityPost.create({
      data: {
        title: "🎓 New Graduates - Welcome to the Family!",
        content: `<p><strong>Congratulations, Graduate!</strong> 🎊</p>

<p>You did it! You invested in yourself, pushed through the challenges, and emerged as a certified Functional Medicine practitioner. This is HUGE!</p>

<br/>

<p><strong>This space is dedicated to celebrating our newest graduates.</strong></p>

<p>When you complete your certification, create a post here to:</p>
<p>🎓 Share your graduation moment</p>
<p>📸 Show off your certificate</p>
<p>💭 Reflect on your journey</p>
<p>🙏 Thank those who supported you</p>
<p>🚀 Share your plans for the future</p>

<br/>

<p><em>Every single person who completes this journey is proof that transformation is possible. YOUR story will inspire the next graduate!</em></p>

<p>We can't wait to celebrate with you! 🎉</p>`,
        authorId: sarah.id,
        categoryId: "graduates",
        isPinned: true,
        isLocked: true, // Read only - no comments
        viewCount: 1800,
        likeCount: 389,
        reactions: { "❤️": 95, "🔥": 60, "👏": 88, "💯": 38, "🎉": 55, "💪": 28, "⭐": 15, "🙌": 10 },
        createdAt: new Date("2025-08-02T11:00:00"),
        updatedAt: new Date("2025-08-02T11:00:00"),
      },
    });
    console.log("✅ Created New Graduates pinned post");
  } else {
    await prisma.communityPost.update({
      where: { id: graduatesPost.id },
      data: {
        authorId: sarah.id,
        isLocked: true,
        title: "🎓 New Graduates - Welcome to the Family!",
        content: `<p><strong>Congratulations, Graduate!</strong> 🎊</p>

<p>You did it! You invested in yourself, pushed through the challenges, and emerged as a certified Functional Medicine practitioner. This is HUGE!</p>

<br/>

<p><strong>This space is dedicated to celebrating our newest graduates.</strong></p>

<p>When you complete your certification, create a post here to:</p>
<p>🎓 Share your graduation moment</p>
<p>📸 Show off your certificate</p>
<p>💭 Reflect on your journey</p>
<p>🙏 Thank those who supported you</p>
<p>🚀 Share your plans for the future</p>

<br/>

<p><em>Every single person who completes this journey is proof that transformation is possible. YOUR story will inspire the next graduate!</em></p>

<p>We can't wait to celebrate with you! 🎉</p>`,
      },
    });
    console.log("✅ Updated New Graduates post - locked and improved");
  }

  // Delete comments from graduates post
  if (graduatesPost) {
    const deletedGradComments = await prisma.postComment.deleteMany({
      where: { postId: graduatesPost.id },
    });
    console.log(`   Deleted ${deletedGradComments.count} comments from graduates post`);
  }

  // Find or create Questions Everyone Has pinned post
  let questionsPost = await prisma.communityPost.findFirst({
    where: {
      categoryId: "questions",
      isPinned: true
    },
  });

  if (!questionsPost) {
    questionsPost = await prisma.communityPost.create({
      data: {
        title: "❓ Questions Everyone Has - Ask Anything!",
        content: `<p><strong>No question is too simple or too complex!</strong></p>

<p>We've all been there — staring at something, wondering if we're the only one confused. Spoiler alert: you're NOT alone!</p>

<br/>

<p>This is a <strong>judgment-free zone</strong> where you can ask:</p>
<p>📚 Course-related questions</p>
<p>🔬 Clinical scenarios</p>
<p>💼 Business & practice questions</p>
<p>🤔 "Is it just me, or..." questions</p>
<p>💡 Anything on your mind!</p>

<br/>

<p><em>The only "dumb" question is the one you don't ask. Your question today might be the answer someone else needed tomorrow!</em></p>

<p>Go ahead, create a post and ask away! 🙋‍♀️</p>`,
        authorId: sarah.id,
        categoryId: "questions",
        isPinned: true,
        viewCount: 3200,
        likeCount: 512,
        reactions: { "❤️": 135, "🔥": 85, "👏": 102, "💯": 52, "🎉": 48, "💪": 45, "⭐": 25, "🙌": 20 },
        createdAt: new Date("2025-08-03T09:00:00"),
        updatedAt: new Date("2025-08-03T09:00:00"),
      },
    });
    console.log("✅ Created Questions Everyone Has pinned post");
  }

  // Find or create Career Pathway pinned post
  let careerPost = await prisma.communityPost.findFirst({
    where: {
      categoryId: "career",
      isPinned: true
    },
  });

  if (!careerPost) {
    careerPost = await prisma.communityPost.create({
      data: {
        title: "🚀 Career Pathway - Build Your Dream Practice",
        content: `<p><strong>Your certification is just the beginning!</strong></p>

<p>This space is dedicated to helping you build a thriving career in functional medicine. Whether you're starting from scratch or pivoting from another field, you're in the right place.</p>

<br/>

<p>Share and discuss:</p>
<p>💼 Practice setup & business strategies</p>
<p>📈 Marketing & client acquisition</p>
<p>💰 Pricing & packages</p>
<p>🤝 Networking opportunities</p>
<p>📍 Niche specialization</p>
<p>⚖️ Work-life balance</p>

<br/>

<p><em>Success leaves clues. Learn from those ahead of you, and pay it forward to those coming behind!</em></p>

<p>Ready to build something amazing? Start a conversation! 💪</p>`,
        authorId: sarah.id,
        categoryId: "career",
        isPinned: true,
        viewCount: 2800,
        likeCount: 478,
        reactions: { "❤️": 125, "🔥": 78, "👏": 98, "💯": 48, "🎉": 42, "💪": 52, "⭐": 20, "🙌": 15 },
        createdAt: new Date("2025-08-03T10:00:00"),
        updatedAt: new Date("2025-08-03T10:00:00"),
      },
    });
    console.log("✅ Created Career Pathway pinned post");
  }

  console.log("\n✅ All community posts fixed!");
  console.log("\nPinned post order:");
  console.log("Row 1: Introduce Yourself, Coaching Tips");
  console.log("Row 2: Share Your Wins (locked), New Graduates (locked)");
  console.log("Row 3: Questions Everyone Has, Career Pathway");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
