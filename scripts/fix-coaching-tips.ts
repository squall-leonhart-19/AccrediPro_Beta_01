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
  console.log("Fixing Coaching Tips posts...\n");

  // Get Sarah M.'s user ID
  const sarah = await prisma.user.findFirst({
    where: { email: "sarah@accredipro-certificate.com" },
  });

  if (!sarah) {
    console.error("Sarah M. user not found!");
    return;
  }

  console.log(`Found Sarah M.: ${sarah.firstName} ${sarah.lastName} (${sarah.id})`);

  // Get all coaching tips posts
  const coachingTips = await prisma.communityPost.findMany({
    where: { categoryId: "coaching-tips" },
    select: { id: true, title: true },
  });

  console.log(`Found ${coachingTips.length} coaching tips posts`);

  // Delete all comments from coaching tips
  let totalDeleted = 0;
  for (const tip of coachingTips) {
    const deleted = await prisma.postComment.deleteMany({
      where: { postId: tip.id },
    });
    totalDeleted += deleted.count;
  }
  console.log(`Deleted ${totalDeleted} comments from coaching tips`);

  // Update all coaching tips to use Sarah M. as author
  const updated = await prisma.communityPost.updateMany({
    where: { categoryId: "coaching-tips" },
    data: { authorId: sarah.id },
  });
  console.log(`Updated ${updated.count} posts to Sarah M. as author`);

  // Now fix Coaching Tip #3 with improved HTML formatting
  const tip3Content = `<p>Hi there! 💕</p>

<p>Let me introduce you to Diane.</p>

<p>Diane spent 15 years struggling with her weight. Every diet, every program, every "guaranteed" solution. She lost 40 pounds three separate times — and gained it all back plus some.</p>

<p>Then she discovered functional medicine. Learned about insulin resistance. Discovered her thyroid was sluggish. Understood why stress was sabotaging her metabolism. Fixed her gut. Balanced her hormones.</p>

<p>And finally — FINALLY — found food freedom.</p>

<br/>

<p>When Diane came to me about becoming a practitioner, she said: <em>"But Sarah, I only really know about weight loss and metabolism. I can't help anyone with autoimmune issues or anxiety or hormonal problems..."</em></p>

<p>I stopped her right there.</p>

<p><em>"Diane,"</em> I said, <em>"you don't NEED to help everyone with everything. You need to help YOUR person with THEIR problem."</em></p>

<br/>

<p><strong style="font-size: 1.1em;">Here's the secret nobody tells you:</strong></p>

<p>You don't need to be an expert in everything. You need to be an expert in ONE thing — and that one thing is usually connected to YOUR story.</p>

<p>✨ Struggled with weight? Help women struggling with weight.</p>
<p>✨ Overcame gut issues? Help people heal their guts.</p>
<p>✨ Battled anxiety naturally? Guide others through the same.</p>
<p>✨ Navigated perimenopause? Become THE go-to for perimenopausal women.</p>

<br/>

<p><strong style="font-size: 1.1em;">The riches are in the niches. 💎</strong></p>

<p>When you try to help everyone, you help no one. But when you become THE expert for a specific group of people with a specific problem? Magic happens.</p>

<p>🎯 Your messaging gets clearer</p>
<p>🎯 Your marketing gets easier</p>
<p>🎯 Your clients find YOU</p>
<p>🎯 Your confidence skyrockets</p>
<p>🎯 Your results improve</p>

<br/>

<p>Diane now runs a thriving practice helping women over 40 lose weight without dieting. She charges $3,000 for her programs. She has a 6-month waiting list. And she only helps people with the EXACT problem she personally overcame.</p>

<br/>

<p><strong style="font-size: 1.1em;">📝 Your action step:</strong></p>

<p>Complete this sentence:</p>

<p style="background: #f0f7ff; padding: 15px; border-radius: 8px; margin: 10px 0;"><em>"I help _______ overcome _______ so they can _______."</em></p>

<p><em>(Example: "I help stressed-out corporate women overcome exhaustion and brain fog so they can feel energized and sharp again.")</em></p>

<br/>

<p>💬 <strong>YOUR TURN:</strong> Share your "I help" statement below! Let's refine it together as a community.</p>

<br/>

<p>You're more of an expert than you realize,</p>
<p><strong>Sarah M.</strong> 💕</p>`;

  await prisma.communityPost.updateMany({
    where: {
      categoryId: "coaching-tips",
      title: { contains: "#3" }
    },
    data: { content: tip3Content },
  });

  console.log("\n✅ Fixed Coaching Tip #3 with improved HTML formatting");
  console.log("\n✅ All coaching tips now have:");
  console.log("   - Sarah M. as author");
  console.log("   - No comments");
  console.log("   - Tip #3 has improved HTML formatting");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
