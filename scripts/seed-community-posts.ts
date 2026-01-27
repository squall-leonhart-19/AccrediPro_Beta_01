import prisma from "../src/lib/prisma";

/**
 * Seed community posts across all categories
 * Distribution: More wins, fewer questions/tips
 * Uses zombie profiles as authors
 */

// Post distribution per category (random-looking numbers)
const POST_DISTRIBUTION: Record<string, { wins: number; graduates: number; questions: number; tips: number }> = {
  fm: { wins: 187, graduates: 89, questions: 73, tips: 41 },
  wh: { wins: 173, graduates: 84, questions: 68, tips: 39 },
  mh: { wins: 168, graduates: 81, questions: 67, tips: 38 },
  mb: { wins: 159, graduates: 77, questions: 63, tips: 36 },
  tr: { wins: 143, graduates: 69, questions: 58, tips: 32 },
  pf: { wins: 136, graduates: 66, questions: 54, tips: 31 },
  gw: { wins: 128, graduates: 62, questions: 51, tips: 29 },
  se: { wins: 124, graduates: 60, questions: 49, tips: 28 },
  hb: { wins: 112, graduates: 54, questions: 44, tips: 26 },
  pw: { wins: 97, graduates: 47, questions: 38, tips: 22 },
};

// Category names for context
const CATEGORY_NAMES: Record<string, string> = {
  fm: "Functional Medicine",
  wh: "Women's Health",
  mh: "Mental Health",
  mb: "Mind & Body",
  tr: "Trauma Recovery",
  pf: "Parenting & Family",
  gw: "General Wellness",
  se: "Spiritual & Energy",
  hb: "Herbalism",
  pw: "Pet Wellness",
};

// Win post templates
const WIN_TEMPLATES = [
  { title: "Just got my first client! 🎉", content: "<p>After months of studying, I finally landed my first paying client! They found me through my Instagram and loved my approach. So grateful for this community!</p>" },
  { title: "Reached $5K/month! 💰", content: "<p>I can't believe it - this month I hit $5,000 in revenue! Started from zero just 8 months ago. The strategies I learned here really work!</p>" },
  { title: "Client transformation story 🌟", content: "<p>One of my clients just messaged me with incredible results. She's been following my protocol for 3 months and has completely changed her life. This is why I do what I do!</p>" },
  { title: "Booked out for next month!", content: "<p>For the first time ever, I'm completely booked out! Had to start a waitlist. Never thought I'd be saying this when I started.</p>" },
  { title: "Left my 9-5 today 🙌", content: "<p>It's official - I resigned from my corporate job! My practice is finally generating enough income to support me full-time. Scared but SO excited!</p>" },
  { title: "First 5-star review!", content: "<p>My first Google review came in and it's 5 stars! Client said working with me was 'life-changing'. I'm literally crying happy tears right now.</p>" },
  { title: "Landed a corporate contract 💼", content: "<p>Just signed a contract with a local company to provide wellness services to their employees! This is a game-changer for my practice.</p>" },
  { title: "Client referral chain working!", content: "<p>3 new clients this week - all referrals from one happy client! Word of mouth is finally kicking in. Proof that doing great work pays off.</p>" },
  { title: "Featured in local news! 📰", content: "<p>A local journalist interviewed me about holistic wellness and the article just came out! Already getting inquiries from people who read it.</p>" },
  { title: "Passive income milestone 🎯", content: "<p>My online course made $2,000 this month while I was on vacation! Finally understanding what passive income feels like.</p>" },
  { title: "Workshop sold out in 2 days!", content: "<p>I launched my first in-person workshop and it sold out in 48 hours! 25 people eager to learn. My heart is so full.</p>" },
  { title: "Client signed 12-month package!", content: "<p>Just closed my biggest sale ever - a 12-month coaching package! Client didn't even flinch at the price. Know your worth, people!</p>" },
  { title: "Insurance reimbursement approved", content: "<p>Finally got my services approved for insurance reimbursement! This opens up so many more clients who couldn't afford out-of-pocket before.</p>" },
  { title: "Podcast interview happened! 🎙️", content: "<p>Was interviewed on a wellness podcast today! The host loved my story and approach. Cannot wait for it to air next month.</p>" },
  { title: "Moved to bigger office space", content: "<p>My practice has grown so much that I needed a bigger space! Just signed the lease on a beautiful new office. Pinch me!</p>" },
];

// Graduate post templates
const GRADUATE_TEMPLATES = [
  { title: "Just received my certification! 🎓", content: "<p>I'm officially certified! After months of hard work, late nights, and dedication, I did it. So proud of myself and grateful for this amazing program.</p>" },
  { title: "Officially a certified practitioner! ✨", content: "<p>The certificate is in my hands! This has been such an incredible journey. Can't wait to start helping people with what I've learned.</p>" },
  { title: "Passed my final exam! 📜", content: "<p>100% on my final exam! All those study sessions paid off. Thank you to everyone who supported me along the way.</p>" },
  { title: "Completed the program today 🙌", content: "<p>Just submitted my last assignment and got my completion notification. This program changed my life and I'm so excited for what's next!</p>" },
  { title: "Got my credentials! 🏆", content: "<p>Finally have those letters after my name! It was worth every hour of study. Now it's time to make a difference.</p>" },
  { title: "Certification journey complete 💫", content: "<p>From day 1 to certification - what a ride! This community helped me through the tough times. Forever grateful.</p>" },
  { title: "Passed with distinction!", content: "<p>Not only did I pass, I passed with distinction! Hard work really does pay off. Time to celebrate!</p>" },
  { title: "Certificate finally arrived! 📬", content: "<p>The physical certificate came in the mail today and I'm framing it immediately! This is going right on my office wall.</p>" },
];

// Question post templates
const QUESTION_TEMPLATES = [
  { title: "How do you handle difficult clients?", content: "<p>I have a client who's been really challenging lately. They're not following the protocol but expecting results. How do you handle situations like this?</p>" },
  { title: "Best way to price packages?", content: "<p>Struggling with pricing my service packages. What's worked for you? Hourly vs. package pricing?</p>" },
  { title: "Insurance billing question", content: "<p>Has anyone successfully billed insurance for their services? What codes do you use? Any tips for getting started?</p>" },
  { title: "Marketing on a budget?", content: "<p>I'm just starting out and don't have much for marketing. What free or low-cost strategies have worked for you?</p>" },
  { title: "Virtual vs. in-person sessions", content: "<p>Do you prefer virtual or in-person client sessions? Pros and cons of each? Thinking of going fully virtual.</p>" },
  { title: "Handling no-shows", content: "<p>Had 3 no-shows this week alone! What policies do you have in place to prevent this?</p>" },
  { title: "CRM recommendations?", content: "<p>Looking for a good CRM to manage my clients. What software do you use and recommend?</p>" },
  { title: "How to get more reviews?", content: "<p>I know reviews are important but I feel awkward asking. How do you approach getting testimonials from clients?</p>" },
  { title: "Liability insurance help", content: "<p>New practitioner here - what liability insurance do you recommend? Is it really necessary?</p>" },
  { title: "Burnout prevention tips?", content: "<p>Finding myself exhausted lately. How do you maintain work-life balance while growing your practice?</p>" },
];

// Tip post templates
const TIP_TEMPLATES = [
  { title: "Game-changing intake form tip", content: "<p>Pro tip: Add a section on your intake form asking about past practitioners they've worked with. Tells you so much about what hasn't worked and what they're looking for!</p>" },
  { title: "Best booking software I've found", content: "<p>After trying 5 different booking apps, I finally found THE one. Calendly + Stripe integration = seamless booking and payment. Total game changer.</p>" },
  { title: "How I doubled my prices", content: "<p>Here's exactly how I raised my rates 100% without losing clients: 1) Added more value 2) Got testimonials 3) Rebranded my packages. Happy to share more details!</p>" },
  { title: "Email template that converts", content: "<p>My discovery call confirmation email has a 90% show-up rate. Secret? I include a prep worksheet they fill out before the call. Invested clients show up!</p>" },
  { title: "Social media strategy that works", content: "<p>Stopped trying to be everywhere. Pick ONE platform and dominate it. My Instagram went from 500 to 5,000 followers in 6 months by posting consistently.</p>" },
  { title: "Free resource for client handouts", content: "<p>Just discovered Canva has free health and wellness templates! My client handouts look so professional now and it cost me nothing.</p>" },
  { title: "Boundary-setting script", content: "<p>Here's my script for when clients text outside hours: 'Thanks for reaching out! I'll respond during my business hours (9-5 M-F). For emergencies, please call...'</p>" },
  { title: "Referral program that works", content: "<p>Started offering 20% off next session for referrals. Already got 8 new clients this month from existing ones! Simple but effective.</p>" },
];

// Helper to get random element
function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to get random date in last 6 months
function randomDate(): Date {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
  return new Date(sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime()));
}

// Helper to generate random view/like counts
function randomViews(): number {
  return Math.floor(Math.random() * 500) + 50;
}

function randomLikes(): number {
  return Math.floor(Math.random() * 50) + 5;
}

async function main() {
  console.log("🚀 Starting community post seeding...\n");

  // Get all zombie profiles
  const zombies = await prisma.user.findMany({
    where: { isFakeProfile: true },
    select: { id: true, firstName: true, lastName: true },
  });

  console.log(`📊 Found ${zombies.length} zombie profiles to use as authors\n`);

  if (zombies.length === 0) {
    console.log("❌ No zombie profiles found! Run zombie creation script first.");
    return;
  }

  let totalCreated = 0;

  for (const [categorySlug, distribution] of Object.entries(POST_DISTRIBUTION)) {
    const categoryName = CATEGORY_NAMES[categorySlug];
    console.log(`\n📁 Seeding ${categoryName} (${categorySlug})...`);

    // Create Wins posts
    for (let i = 0; i < distribution.wins; i++) {
      const template = randomElement(WIN_TEMPLATES);
      const author = randomElement(zombies);

      await prisma.communityPost.create({
        data: {
          title: template.title,
          content: template.content.replace("<p>", `<p>[${categoryName}] `),
          categoryId: "wins",
          authorId: author.id,
          createdAt: randomDate(),
          viewCount: randomViews(),
          likeCount: randomLikes(),
        },
      });
    }
    console.log(`  ✅ Created ${distribution.wins} wins posts`);
    totalCreated += distribution.wins;

    // Create Graduates posts
    for (let i = 0; i < distribution.graduates; i++) {
      const template = randomElement(GRADUATE_TEMPLATES);
      const author = randomElement(zombies);

      await prisma.communityPost.create({
        data: {
          title: template.title,
          content: template.content.replace("<p>", `<p>[${categoryName}] `),
          categoryId: "graduates",
          authorId: author.id,
          createdAt: randomDate(),
          viewCount: randomViews(),
          likeCount: randomLikes(),
        },
      });
    }
    console.log(`  ✅ Created ${distribution.graduates} graduate posts`);
    totalCreated += distribution.graduates;

    // Create Questions posts
    for (let i = 0; i < distribution.questions; i++) {
      const template = randomElement(QUESTION_TEMPLATES);
      const author = randomElement(zombies);

      await prisma.communityPost.create({
        data: {
          title: template.title,
          content: template.content.replace("<p>", `<p>[${categoryName}] `),
          categoryId: "questions",
          authorId: author.id,
          createdAt: randomDate(),
          viewCount: randomViews(),
          likeCount: randomLikes(),
        },
      });
    }
    console.log(`  ✅ Created ${distribution.questions} question posts`);
    totalCreated += distribution.questions;

    // Create Tips posts
    for (let i = 0; i < distribution.tips; i++) {
      const template = randomElement(TIP_TEMPLATES);
      const author = randomElement(zombies);

      await prisma.communityPost.create({
        data: {
          title: template.title,
          content: template.content.replace("<p>", `<p>[${categoryName}] `),
          categoryId: "tips",
          authorId: author.id,
          createdAt: randomDate(),
          viewCount: randomViews(),
          likeCount: randomLikes(),
        },
      });
    }
    console.log(`  ✅ Created ${distribution.tips} tip posts`);
    totalCreated += distribution.tips;
  }

  console.log(`\n🎉 DONE! Created ${totalCreated} total posts across all categories!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
