/**
 * Seed Script: Add 700 more Community Posts (300 Wins + 400 Graduates)
 * Run with: npx tsx scripts/seed-more-community-posts.ts
 */

import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ==================== DATA POOLS ====================

const FIRST_NAMES_FEMALE = [
  "Jennifer", "Amanda", "Victoria", "Lisa", "Diane", "Tammy", "Karyne", "Nancy", "Brandy", "Donna",
  "Julie", "Kira", "Suzette", "Joanne", "Kelly", "Allison", "Heather", "Priyanka", "Maria", "Rachel",
  "Michelle", "Sarah", "Christine", "Nicole", "Elizabeth", "Jessica", "Ashley", "Brittany", "Stephanie", "Lauren",
  "Megan", "Samantha", "Katherine", "Emily", "Rebecca", "Patricia", "Linda", "Barbara", "Susan", "Margaret",
  "Dorothy", "Karen", "Betty", "Helen", "Sandra", "Carol", "Ruth", "Sharon", "Cynthia", "Kathleen",
  "Amy", "Angela", "Shirley", "Anna", "Brenda", "Pamela", "Emma", "Deborah", "Carolyn", "Janet",
  "Catherine", "Christina", "Joan", "Evelyn", "Judith", "Andrea", "Cheryl", "Hannah", "Jacqueline", "Martha",
  "Gloria", "Teresa", "Ann", "Sara", "Madison", "Frances", "Kathryn", "Janice", "Jean", "Abigail",
  "Priya", "Aisha", "Fatima", "Yuki", "Mei", "Rosa", "Carmen", "Lena", "Sofia", "Ingrid",
  "Olga", "Natasha", "Svetlana", "Elena", "Gabriela", "Lucia", "Isabella", "Fernanda", "Ana", "Keiko",
];

const FIRST_NAMES_MALE = [
  "Steven", "Michael", "David", "James", "Robert", "John", "William", "Richard", "Joseph", "Thomas",
  "Christopher", "Charles", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Paul", "Andrew", "Joshua",
  "Kenneth", "Kevin", "Brian", "George", "Timothy", "Ronald", "Edward", "Jason", "Jeffrey", "Ryan",
  "Jacob", "Gary", "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon",
  "Benjamin", "Samuel", "Raymond", "Gregory", "Frank", "Alexander", "Patrick", "Jack", "Dennis", "Carlos",
  "Miguel", "Jose", "Juan", "Pedro", "Ahmed", "Mohammed", "Ali", "Hassan", "Omar", "Raj",
];

const LAST_NAMES = [
  "Thompson", "Foster", "Hayes", "Martinez", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
  "Davis", "Rodriguez", "Wilson", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson",
  "Lee", "Perez", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green",
  "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Gomez",
  "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart",
  "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "O'Brien", "McCarthy", "Sullivan", "Kennedy",
  "Patel", "Shah", "Kumar", "Singh", "Sharma", "Gupta", "Muller", "Schmidt", "Weber", "Fischer",
];

const AVATAR_URLS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1557862921-37829c790f19?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
];

// ==================== WIN TITLES ====================
const WIN_TITLES = [
  "Just signed my {num} client! 🎉",
  "First ${amount} month EVER! I'm in tears 😭",
  "Quit my {job} job today. No looking back!",
  "Client told me I changed her life 💕",
  "Made back my course investment in {weeks} weeks!",
  "From 0 to {num} clients in {months} months!",
  "${amount}/month - never thought I'd get here!",
  "My client just reversed her {condition}! 🙌",
  "Fully booked for the next {weeks} weeks!",
  "Just hit my first ${amount} week!",
  "Got my first 5-star review! ⭐⭐⭐⭐⭐",
  "Referral from my {num} client - business is growing!",
  "Raised my prices to ${price}/session and still fully booked!",
  "Finally helping people the way I always wanted to",
  "My husband cried when I showed him my income this month",
  "Left corporate after {years} years. Best decision ever!",
  "Client's doctor asked for MY protocol!",
  "Went from skeptic to believer - here's my story",
  "This isn't just a side hustle anymore - it's my CAREER",
  "My {family_member} is finally healthy because of what I learned here",
  "Paid off ${amount} in debt with my FM income!",
  "Working {hours} hours/week and making more than my old job",
  "My client got pregnant after years of trying! 🍼",
  "Just moved to my dream location - working remotely as FM practitioner",
  "Former teacher here - making 3x my old salary now!",
  "Single mom win: finally have financial freedom 💪",
  "Client's inflammation markers dropped by {percent}%!",
  "Booked out {months} months in advance now",
  "Got featured in a local wellness magazine!",
  "My waitlist has {num} people on it! 🤯",
];

// ==================== GRADUATE TITLES ====================
const GRADUATE_TITLES = [
  "I DID IT! Officially Certified! 🎓",
  "From {job} to FM Practitioner - my journey",
  "After {years} years of searching... I found my purpose",
  "Passed my certification exam! Here's what helped me",
  "Certificate in hand - now the real work begins!",
  "{months} months ago I started... today I'm CERTIFIED!",
  "Never thought I'd be here - certified at {age}! 🙌",
  "Graduated while working full-time and raising {num} kids",
  "From burned out {job} to certified practitioner",
  "My answered prayer - finally certified after {years} years of wanting this",
  "Certification complete! Can't stop smiling! 😊",
  "They said I was too old. Today I proved them wrong! 🎓",
  "Started with zero medical background - now I'm certified!",
  "Single mom of {num} - just graduated! If I can do it, you can too!",
  "Career change at {age} - best decision of my life",
  "From skeptic to certified believer ✨",
  "Finally able to help my family AND others! Certified! 🎉",
  "Graduated top of my cohort! Hard work pays off!",
  "Chronic illness warrior here - now certified to help others heal!",
  "Retired {job} turned FM practitioner! Never too late! 💪",
  "International student here - certified in the USA! 🌎",
  "Dyslexia couldn't stop me - I'M CERTIFIED!",
  "Graduation day! From corporate burnout to practitioner",
  "My certification journey: {months} months of growth",
  "Just got my certificate! Time to change lives! 🌟",
  "Certified and ready to serve my community!",
  "Former {job} - now I help people heal naturally!",
  "Graduation post: Thank you all for the support! 🙏",
  "Made it through! Certificate #Earned 📜",
  "From healthcare burnout to passionate practitioner!",
];

// ==================== CONTENT TEMPLATES ====================
const WIN_CONTENT_TEMPLATES = [
  `<p>I can't believe I'm writing this post right now. {opening}</p><p>{story}</p><p>{result}</p><p>To everyone still on the fence - {encouragement}</p>`,
  `<p>{emotional_opening}</p><p>Here's what happened:</p><ul><li>{point1}</li><li>{point2}</li><li>{point3}</li></ul><p>{closing}</p>`,
  `<p>Quick win to share with you all! 🎉</p><p>{story}</p><p>The best part? {best_part}</p><p>{encouragement}</p>`,
  `<p>{opening}</p><p>Background: {background}</p><p>What changed: {change}</p><p>Results: {result}</p><p>You've got this! 💪</p>`,
  `<p>Posting this with tears in my eyes... {emotional_story}</p><p>{reflection}</p><p>Thank you AccrediPro family! ❤️</p>`,
];

const GRADUATE_CONTENT_TEMPLATES = [
  `<p>I DID IT! 🎓</p><p>{journey_start}</p><p>{challenges}</p><p>{breakthrough}</p><p>To everyone still in the program - {advice}</p>`,
  `<p>Today marks the end of one chapter and the beginning of another.</p><p>{background}</p><p>{transformation}</p><p>What's next: {future_plans}</p><p>Thank you all! 🙏</p>`,
  `<p>{emotional_opening}</p><p>My journey:</p><ul><li>{milestone1}</li><li>{milestone2}</li><li>{milestone3}</li></ul><p>{closing}</p>`,
  `<p>Certificate officially in hand! Here's my story...</p><p>{story}</p><p>Key takeaways: {takeaways}</p><p>{encouragement}</p>`,
  `<p>From {old_identity} to certified FM Practitioner!</p><p>{journey}</p><p>Biggest lesson learned: {lesson}</p><p>Let's GO! 🚀</p>`,
];

// ==================== FILL-IN DATA ====================
const OPENINGS = [
  "Six months ago, I was crying in my car after another soul-crushing shift.",
  "I almost didn't sign up for this program. Imposter syndrome was REAL.",
  "When I first started, I had zero confidence.",
  "I remember feeling so lost and overwhelmed.",
  "A year ago, I was burned out and questioning everything.",
];

const EMOTIONAL_OPENINGS = [
  "I'm literally shaking as I type this...",
  "Not gonna lie, I'm crying happy tears right now.",
  "I have to share this because I'm bursting with joy!",
  "This community needs to hear this win!",
  "I've been waiting to post this for weeks!",
];

const STORIES = [
  "My client came to me with chronic fatigue that had plagued her for 5 years. After 3 months of working together, she just told me she has more energy than she's had in a decade!",
  "Started with one client, word spread, and now I'm fully booked through referrals alone.",
  "Took the leap, quit my job, and within 60 days had replaced my income.",
  "My very first client referred her sister, who referred her friend, who referred HER sister. Four clients from one!",
  "Posted one educational video on Instagram and got 15 DMs asking about my services.",
];

const RESULTS = [
  "Now I work from home, set my own hours, and actually ENJOY Mondays.",
  "My bank account looks different. My stress levels look different. My LIFE looks different.",
  "I'm making more money working 20 hours than I did working 50.",
  "Best part? I'm actually helping people heal, not just managing symptoms.",
  "Financial freedom AND purpose? Didn't think both were possible.",
];

const ENCOURAGEMENTS = [
  "JUMP. The net appears.",
  "Trust the process. It really works.",
  "Your future clients are waiting for you!",
  "If this exhausted mom of three can do it, so can you!",
  "Stop overthinking and start doing!",
];

const BACKGROUNDS = [
  "I was a nurse for 20 years, completely burned out.",
  "Former teacher who was tired of being underpaid and undervalued.",
  "Stay-at-home mom looking for purpose beyond the household.",
  "Corporate worker who hated the 9-5 grind.",
  "Healthcare worker who was frustrated with the system.",
];

const JOBS = ["nursing", "teaching", "corporate", "retail", "healthcare", "administrative", "hospitality"];
const CONDITIONS = ["thyroid issues", "autoimmune condition", "chronic fatigue", "gut problems", "hormonal imbalance", "inflammation"];
const FAMILY_MEMBERS = ["daughter", "son", "mother", "sister", "husband", "wife", "father"];

// Sarah's comment templates
const SARAH_COMMENTS = [
  "Amazing progress, {name}! This is exactly what we love to see! Keep up the incredible work! 🌟",
  "{name}, you're absolutely crushing it! Your dedication is inspiring to everyone here! 💪",
  "So proud of you, {name}! This is what transformation looks like! 🙌",
  "This is beautiful, {name}! Your journey is going to inspire so many others!",
  "Wow {name}, look at you go! This is why I love this community! ❤️",
  "{name}, this made my day! You're proof that hard work pays off!",
  "Incredible milestone, {name}! Your commitment is truly showing!",
  "YES {name}! This is what it's all about! So honored to be part of your journey!",
  "{name}, you're an absolute rockstar! Thank you for sharing! 🌟",
  "This is amazing, {name}! Your story is going to help so many people!",
];

const MEMBER_COMMENTS = [
  "This is so inspiring! Congratulations! 🎉",
  "Amazing work! You're such an inspiration!",
  "So happy for you! Keep crushing it!",
  "This made my day! Congratulations!",
  "Wow, incredible! You deserve this success!",
  "Thank you for sharing! So motivating!",
  "Congratulations! Your story is amazing!",
  "Love seeing posts like this! Amazing!",
  "So proud of you! Beautiful journey!",
  "You're an inspiration to us all! 💪",
  "This gives me so much hope! Thank you!",
  "Absolutely incredible! Well done!",
  "Your hard work is paying off! 🙌",
  "So inspiring! Congratulations!",
  "This is why I love this community!",
];

// ==================== HELPER FUNCTIONS ====================
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateWinTitle(): string {
  let title = randomItem(WIN_TITLES);
  title = title.replace("{num}", String(randomNumber(1, 50)));
  title = title.replace("{amount}", String(randomNumber(3, 15) * 1000));
  title = title.replace("{weeks}", String(randomNumber(2, 12)));
  title = title.replace("{months}", String(randomNumber(2, 12)));
  title = title.replace("{years}", String(randomNumber(5, 25)));
  title = title.replace("{hours}", String(randomNumber(15, 30)));
  title = title.replace("{percent}", String(randomNumber(30, 80)));
  title = title.replace("{price}", String(randomNumber(150, 400)));
  title = title.replace("{job}", randomItem(JOBS));
  title = title.replace("{condition}", randomItem(CONDITIONS));
  title = title.replace("{family_member}", randomItem(FAMILY_MEMBERS));
  return title;
}

function generateGraduateTitle(): string {
  let title = randomItem(GRADUATE_TITLES);
  title = title.replace("{num}", String(randomNumber(1, 5)));
  title = title.replace("{months}", String(randomNumber(3, 12)));
  title = title.replace("{years}", String(randomNumber(2, 20)));
  title = title.replace("{age}", String(randomNumber(35, 65)));
  title = title.replace("{job}", randomItem(JOBS));
  return title;
}

function generateWinContent(): string {
  const template = randomItem(WIN_CONTENT_TEMPLATES);
  let content = template;
  content = content.replace("{opening}", randomItem(OPENINGS));
  content = content.replace("{emotional_opening}", randomItem(EMOTIONAL_OPENINGS));
  content = content.replace("{story}", randomItem(STORIES));
  content = content.replace("{emotional_story}", randomItem(STORIES));
  content = content.replace("{result}", randomItem(RESULTS));
  content = content.replace("{encouragement}", randomItem(ENCOURAGEMENTS));
  content = content.replace("{background}", randomItem(BACKGROUNDS));
  content = content.replace("{change}", randomItem(STORIES));
  content = content.replace("{best_part}", randomItem(RESULTS));
  content = content.replace("{reflection}", randomItem(ENCOURAGEMENTS));
  content = content.replace("{closing}", randomItem(ENCOURAGEMENTS));
  content = content.replace("{point1}", "Started implementing what I learned immediately");
  content = content.replace("{point2}", "Stayed consistent even when I doubted myself");
  content = content.replace("{point3}", "Leaned on this amazing community for support");
  return content;
}

function generateGraduateContent(): string {
  const template = randomItem(GRADUATE_CONTENT_TEMPLATES);
  let content = template;
  content = content.replace("{journey_start}", randomItem(OPENINGS));
  content = content.replace("{emotional_opening}", randomItem(EMOTIONAL_OPENINGS));
  content = content.replace("{background}", randomItem(BACKGROUNDS));
  content = content.replace("{challenges}", "There were moments I wanted to quit. Late nights, early mornings, balancing life and studies.");
  content = content.replace("{breakthrough}", "But then something clicked. The material started making sense. I started believing in myself.");
  content = content.replace("{transformation}", "This program didn't just give me a certification - it gave me confidence, purpose, and a new identity.");
  content = content.replace("{story}", "Every module taught me something new. Every quiz challenged me. Every live call inspired me.");
  content = content.replace("{journey}", "From total beginner to certified practitioner. It wasn't easy, but it was worth it.");
  content = content.replace("{advice}", "Keep going! The certification is just the beginning!");
  content = content.replace("{future_plans}", "Building my practice, helping my community, and continuing to learn!");
  content = content.replace("{takeaways}", "Stay consistent, ask questions, and trust the process!");
  content = content.replace("{lesson}", "You're never too old/busy/inexperienced to follow your dreams!");
  content = content.replace("{encouragement}", randomItem(ENCOURAGEMENTS));
  content = content.replace("{closing}", "Thank you to everyone who supported me on this journey! 🙏");
  content = content.replace("{old_identity}", randomItem(BACKGROUNDS).toLowerCase());
  content = content.replace("{milestone1}", "Enrolled in the program despite my fears");
  content = content.replace("{milestone2}", "Completed all modules while working full-time");
  content = content.replace("{milestone3}", "Passed the certification exam!");
  return content;
}

function randomDate(startDays: number, endDays: number): Date {
  const now = new Date();
  const daysAgo = randomNumber(startDays, endDays);
  return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
}

// ==================== MAIN FUNCTION ====================
async function seedMorePosts() {
  console.log("🚀 Starting to seed more community posts...\n");

  // Get Sarah's ID
  const sarah = await prisma.user.findFirst({
    where: { email: "sarah@accredipro-certificate.com" },
  });

  if (!sarah) {
    console.log("❌ Sarah not found! Please create Sarah first.");
    process.exit(1);
  }

  console.log("✅ Found Sarah:", sarah.firstName, sarah.lastName);

  // Get existing fake profiles
  const existingProfiles = await prisma.user.findMany({
    where: { isFakeProfile: true },
    select: { id: true, firstName: true },
  });

  console.log(`✅ Found ${existingProfiles.length} existing fake profiles`);

  // Create more fake profiles if needed
  const neededProfiles = 700 - existingProfiles.length;
  const allProfiles = [...existingProfiles];

  if (neededProfiles > 0) {
    console.log(`📝 Creating ${neededProfiles} more fake profiles...`);

    for (let i = 0; i < neededProfiles; i++) {
      const isMale = Math.random() < 0.15;
      const firstName = isMale ? randomItem(FIRST_NAMES_MALE) : randomItem(FIRST_NAMES_FEMALE);
      const lastName = randomItem(LAST_NAMES);
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${Date.now()}${i}@fake.accredipro.com`;

      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          avatar: randomItem(AVATAR_URLS),
          role: UserRole.STUDENT,
          isFakeProfile: true,
          isActive: true,
        },
      });

      allProfiles.push({ id: user.id, firstName: user.firstName });
    }
    console.log(`✅ Created ${neededProfiles} new fake profiles`);
  }

  // Create 300 more WIN posts
  console.log("\n📝 Creating 300 Share Your Wins posts...");
  let winsCreated = 0;

  for (let i = 0; i < 300; i++) {
    const author = randomItem(allProfiles);
    const createdAt = randomDate(1, 365);

    try {
      const post = await prisma.communityPost.create({
        data: {
          title: generateWinTitle(),
          content: generateWinContent(),
          categoryId: "wins",
          authorId: author.id,
          viewCount: randomNumber(50, 800),
          likeCount: randomNumber(5, 150),
          createdAt,
        },
      });

      // Add Sarah's comment (70% chance)
      if (Math.random() < 0.7) {
        const comment = randomItem(SARAH_COMMENTS).replace("{name}", author.firstName || "there");
        const commentDate = new Date(createdAt.getTime() + randomNumber(1, 48) * 60 * 60 * 1000);

        await prisma.postComment.create({
          data: {
            content: comment,
            postId: post.id,
            authorId: sarah.id,
            createdAt: commentDate,
          },
        });
      }

      // Add member comments (0-3)
      const numComments = randomNumber(0, 3);
      for (let c = 0; c < numComments; c++) {
        const commenter = randomItem(allProfiles.filter((p) => p.id !== author.id));
        const commentDate = new Date(createdAt.getTime() + randomNumber(2, 96) * 60 * 60 * 1000);

        await prisma.postComment.create({
          data: {
            content: randomItem(MEMBER_COMMENTS),
            postId: post.id,
            authorId: commenter.id,
            createdAt: commentDate,
          },
        });
      }

      winsCreated++;
      if (winsCreated % 50 === 0) {
        console.log(`  Created ${winsCreated}/300 wins posts...`);
      }
    } catch (error) {
      console.error(`Error creating win post ${i}:`, error);
    }
  }

  console.log(`✅ Created ${winsCreated} Share Your Wins posts`);

  // Create 400 more GRADUATE posts
  console.log("\n📝 Creating 400 New Graduates posts...");
  let graduatesCreated = 0;

  for (let i = 0; i < 400; i++) {
    const author = randomItem(allProfiles);
    const createdAt = randomDate(1, 365);

    try {
      const post = await prisma.communityPost.create({
        data: {
          title: generateGraduateTitle(),
          content: generateGraduateContent(),
          categoryId: "graduates",
          authorId: author.id,
          viewCount: randomNumber(80, 1200),
          likeCount: randomNumber(15, 200),
          createdAt,
        },
      });

      // Add Sarah's comment (80% chance for graduates)
      if (Math.random() < 0.8) {
        const comment = randomItem(SARAH_COMMENTS).replace("{name}", author.firstName || "there");
        const commentDate = new Date(createdAt.getTime() + randomNumber(1, 24) * 60 * 60 * 1000);

        await prisma.postComment.create({
          data: {
            content: comment,
            postId: post.id,
            authorId: sarah.id,
            createdAt: commentDate,
          },
        });
      }

      // Add member comments (1-4 for graduates - more engagement)
      const numComments = randomNumber(1, 4);
      for (let c = 0; c < numComments; c++) {
        const commenter = randomItem(allProfiles.filter((p) => p.id !== author.id));
        const commentDate = new Date(createdAt.getTime() + randomNumber(2, 72) * 60 * 60 * 1000);

        await prisma.postComment.create({
          data: {
            content: randomItem(MEMBER_COMMENTS),
            postId: post.id,
            authorId: commenter.id,
            createdAt: commentDate,
          },
        });
      }

      graduatesCreated++;
      if (graduatesCreated % 50 === 0) {
        console.log(`  Created ${graduatesCreated}/400 graduate posts...`);
      }
    } catch (error) {
      console.error(`Error creating graduate post ${i}:`, error);
    }
  }

  console.log(`✅ Created ${graduatesCreated} New Graduates posts`);

  // Final stats
  const finalWins = await prisma.communityPost.count({ where: { categoryId: "wins" } });
  const finalGraduates = await prisma.communityPost.count({ where: { categoryId: "graduates" } });
  const totalPosts = await prisma.communityPost.count();
  const totalComments = await prisma.postComment.count();

  console.log("\n========================================");
  console.log("🎉 SEEDING COMPLETE!");
  console.log("========================================");
  console.log(`Total Share Your Wins posts: ${finalWins}`);
  console.log(`Total New Graduates posts: ${finalGraduates}`);
  console.log(`Total posts: ${totalPosts}`);
  console.log(`Total comments: ${totalComments}`);
  console.log("========================================\n");

  await prisma.$disconnect();
  process.exit(0);
}

seedMorePosts().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
