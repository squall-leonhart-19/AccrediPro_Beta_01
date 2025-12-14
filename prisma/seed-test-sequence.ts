import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Creating test sequence...");

  // Find the mini diploma tag for trigger
  const triggerTag = await prisma.marketingTag.findUnique({
    where: { slug: "stage_mini_started" },
  });

  // Find the training started tag for exit
  const exitTag = await prisma.marketingTag.findUnique({
    where: { slug: "stage_training_started" },
  });

  // Create the Welcome Mini Diploma sequence
  const sequence = await prisma.sequence.upsert({
    where: { slug: "welcome-mini-diploma-series" },
    update: {},
    create: {
      name: "Welcome Mini Diploma Series",
      slug: "welcome-mini-diploma-series",
      description: "7-day nurture sequence for new mini diploma leads. Builds trust and encourages upgrade to full training.",
      triggerType: "TAG_ADDED",
      triggerTagId: triggerTag?.id || null,
      exitTagId: exitTag?.id || null,
      isActive: true,
    },
  });

  console.log(`✅ Created sequence: ${sequence.name}`);

  // Define the email sequence
  const emails = [
    {
      order: 1,
      subject: "Welcome! Your Free Mini Diploma is Ready 🎓",
      delayDays: 0,
      delayHours: 0,
      htmlContent: `<p>Hi {{firstName}},</p>
<p>Welcome to AccrediPro Academy! I'm Dr. Maria, and I'm thrilled you've taken this step toward advancing your healthcare knowledge.</p>
<p><strong>Your free Mini Diploma is now available</strong> in your student dashboard. Log in anytime to start learning.</p>
<p>This mini course gives you a taste of our comprehensive training programs. Take your time, and reach out if you have any questions!</p>
<p>Best,<br/>Dr. Maria</p>`,
    },
    {
      order: 2,
      subject: "Quick tip: How to get the most from your Mini Diploma",
      delayDays: 1,
      delayHours: 0,
      htmlContent: `<p>Hi {{firstName}},</p>
<p>I wanted to share a quick tip that helps our most successful students:</p>
<p><strong>Set aside just 15 minutes a day</strong> for your Mini Diploma. Consistent small steps beat occasional marathon sessions.</p>
<p>Many students complete their Mini Diploma in just 3-5 days using this approach!</p>
<p>Have you started yet? If not, today is a great day to begin.</p>
<p>Cheering you on,<br/>Dr. Maria</p>`,
    },
    {
      order: 3,
      subject: "The #1 question we get asked...",
      delayDays: 2,
      delayHours: 0,
      htmlContent: `<p>Hi {{firstName}},</p>
<p>The most common question from Mini Diploma students is:</p>
<p><em>"Is the full certification worth it?"</em></p>
<p>Here's what I tell them: Our certified practitioners report an average <strong>40% increase in client confidence</strong> and many have opened entirely new revenue streams.</p>
<p>But don't take my word for it - focus on your Mini Diploma first and see how the knowledge transforms your practice.</p>
<p>To your success,<br/>Dr. Maria</p>`,
    },
    {
      order: 4,
      subject: "How's your progress, {{firstName}}?",
      delayDays: 4,
      delayHours: 0,
      htmlContent: `<p>Hi {{firstName}},</p>
<p>Just checking in! How are you finding the Mini Diploma so far?</p>
<p>Whether you're flying through it or taking your time, that's perfectly okay. Everyone learns at their own pace.</p>
<p>If you have any questions or need help with anything, simply reply to this email. I read every response personally.</p>
<p>Keep going - you're doing great!</p>
<p>Dr. Maria</p>`,
    },
    {
      order: 5,
      subject: "Something special for committed learners like you",
      delayDays: 6,
      delayHours: 0,
      htmlContent: `<p>Hi {{firstName}},</p>
<p>You've been with us for almost a week now, and I wanted to let you know about something special.</p>
<p>For students who complete their Mini Diploma, we offer an <strong>exclusive discount on our full certification programs</strong>.</p>
<p>This isn't a pressure tactic - it's our way of rewarding dedicated learners who are serious about their professional development.</p>
<p>Finish your Mini Diploma, and I'll personally send you the details.</p>
<p>To your success,<br/>Dr. Maria</p>`,
    },
    {
      order: 6,
      subject: "Your 7-day deadline is approaching",
      delayDays: 7,
      delayHours: 0,
      htmlContent: `<p>Hi {{firstName}},</p>
<p>A quick reminder: your special upgrade offer expires in 24 hours.</p>
<p>If you've completed your Mini Diploma (or are close), now is the time to consider the full certification.</p>
<p><strong>What you get:</strong></p>
<ul>
<li>Complete professional certification</li>
<li>CPD/CE credits</li>
<li>Lifetime access to materials</li>
<li>Private practitioner community</li>
<li>30-day money-back guarantee</li>
</ul>
<p>Questions? Reply to this email - I'm here to help.</p>
<p>Dr. Maria</p>`,
    },
  ];

  // Delete existing emails for this sequence first
  await prisma.sequenceEmail.deleteMany({
    where: { sequenceId: sequence.id },
  });

  // Create emails
  for (const email of emails) {
    await prisma.sequenceEmail.create({
      data: {
        sequenceId: sequence.id,
        customSubject: email.subject,
        customContent: email.htmlContent,
        delayDays: email.delayDays,
        delayHours: email.delayHours,
        order: email.order,
        isActive: true,
      },
    });
    console.log(`  ✅ Email ${email.order}: ${email.subject}`);
  }

  console.log(`\n🎉 Test sequence created with ${emails.length} emails!`);
  console.log(`   Trigger: ${triggerTag?.name || "None"}`);
  console.log(`   Exit: ${exitTag?.name || "None"}`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
