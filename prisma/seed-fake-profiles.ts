import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Realistic female first names (common for health/wellness professionals)
const firstNames = [
  "Sarah", "Jennifer", "Michelle", "Lisa", "Amanda", "Jessica", "Ashley", "Stephanie",
  "Nicole", "Elizabeth", "Heather", "Lauren", "Megan", "Christina", "Amy", "Melissa",
  "Rebecca", "Rachel", "Kimberly", "Angela", "Samantha", "Brittany", "Katherine", "Emily",
  "Danielle", "Amber", "Tiffany", "Vanessa", "Natalie", "Crystal", "Karen", "Nancy",
  "Susan", "Margaret", "Patricia", "Sandra", "Donna", "Carol", "Ruth", "Sharon",
  "Linda", "Barbara", "Maria", "Teresa", "Helen", "Anna", "Dorothy", "Gloria",
  "Victoria", "Cynthia", "Diana", "Deborah", "Paula", "Julie", "Laura", "Kelly",
  "Brenda", "Catherine", "Cheryl", "Christine", "Denise", "Janet", "Judy", "Martha",
  "Olivia", "Sophia", "Emma", "Ava", "Isabella", "Mia", "Charlotte", "Harper",
  "Evelyn", "Abigail", "Ella", "Scarlett", "Grace", "Lily", "Chloe", "Zoey",
  "Penelope", "Hannah", "Aria", "Aurora", "Savannah", "Audrey", "Brooklyn", "Bella",
  "Claire", "Skylar", "Lucy", "Paisley", "Caroline", "Genesis", "Kennedy", "Kinsley",
  "Allison", "Maya", "Madelyn", "Aubrey", "Addison", "Eleanor", "Stella", "Natalia",
  "Leah", "Hazel", "Violet", "Ellie", "Piper", "Nora", "Willow", "Ruby",
  "Emilia", "Layla", "Serenity", "Ivy", "Naomi", "Luna", "Sadie", "Jade"
];

// Common last names
const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
  "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
  "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
  "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
  "Carter", "Roberts", "Phillips", "Evans", "Turner", "Parker", "Collins", "Edwards",
  "Stewart", "Morris", "Murphy", "Cook", "Rogers", "Morgan", "Peterson", "Cooper",
  "Reed", "Bailey", "Bell", "Gomez", "Kelly", "Howard", "Ward", "Cox",
  "Diaz", "Richardson", "Wood", "Watson", "Brooks", "Bennett", "Gray", "James",
  "Reyes", "Cruz", "Hughes", "Price", "Myers", "Long", "Foster", "Sanders",
  "Ross", "Morales", "Powell", "Sullivan", "Russell", "Ortiz", "Jenkins", "Gutierrez"
];

// US Locations (cities where health/wellness professionals work)
const locations = [
  "Los Angeles, CA", "New York, NY", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
  "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "Austin, TX",
  "San Jose, CA", "Jacksonville, FL", "Fort Worth, TX", "Columbus, OH", "Charlotte, NC",
  "San Francisco, CA", "Indianapolis, IN", "Seattle, WA", "Denver, CO", "Boston, MA",
  "Nashville, TN", "Portland, OR", "Atlanta, GA", "Miami, FL", "Tampa, FL",
  "Scottsdale, AZ", "Boulder, CO", "Santa Monica, CA", "Sedona, AZ", "Austin, TX",
  "Asheville, NC", "Santa Fe, NM", "Sarasota, FL", "Savannah, GA", "Charleston, SC"
];

// Bio templates for health/wellness professionals
const bioTemplates = [
  "Passionate about helping others achieve optimal health through functional medicine.",
  "Former nurse turned holistic health practitioner. I believe in treating the whole person.",
  "Mom of 3, certified health coach. My own health journey inspired me to help others.",
  "After healing myself from chronic illness, I now help others do the same.",
  "Integrative health enthusiast on a mission to transform lives through nutrition.",
  "Certified functional medicine practitioner specializing in women's health.",
  "Helping busy professionals optimize their health without sacrificing their lifestyle.",
  "Former corporate executive who discovered the power of holistic wellness.",
  "Dedicated to empowering women to take control of their health naturally.",
  "Combining traditional wisdom with modern science to create lasting health transformations.",
  "Believer in food as medicine. Helping clients heal from the inside out.",
  "Passionate about gut health and its connection to overall wellbeing.",
  "Helping women balance hormones naturally through nutrition and lifestyle changes.",
  "Certified in functional medicine, specializing in autoimmune conditions.",
  "Former teacher turned wellness advocate. Education is the key to lasting change.",
];

// Community post categories for comments
const postCategories = ["introductions", "share-a-win", "tips-resources", "practice-momentum"];

// Sample comment templates per category
const commentTemplates = {
  introductions: [
    "Welcome to the community! So excited to have you here!",
    "Hi {{name}}! Looking forward to connecting with you!",
    "Welcome! Your background sounds amazing. Can't wait to learn from you!",
    "So happy you're here! This community is incredibly supportive.",
    "Welcome aboard! Feel free to reach out if you have any questions!",
    "Hi! Great to meet you! What area of functional medicine interests you most?",
    "Welcome! Your journey is inspiring. We're glad you're here!",
    "Hello and welcome! This community has been life-changing for me.",
    "So excited to have another passionate practitioner join us!",
    "Welcome! Looking forward to seeing your progress!",
  ],
  "share-a-win": [
    "Congratulations! This is AMAZING! So proud of you!",
    "Wow, what an incredible achievement! You should be so proud!",
    "This is exactly why I love this community. Well done!",
    "So inspiring! Your dedication is paying off!",
    "Incredible work! Stories like yours motivate all of us!",
    "This brought tears to my eyes. So happy for you!",
    "You're an inspiration! Keep up the amazing work!",
    "This is what it's all about! Congratulations!",
    "So happy for you! Your hard work is clearly paying off!",
    "What a beautiful transformation! Thank you for sharing!",
  ],
  "tips-resources": [
    "This is so helpful! Thank you for sharing!",
    "Wow, I never thought about it this way. Great insight!",
    "Bookmarking this! Such valuable information.",
    "Thank you for this! Exactly what I needed today.",
    "This is gold! Going to implement this right away.",
    "Love this tip! Simple but so effective.",
    "Thank you for sharing your knowledge with us!",
    "This is incredibly helpful. Appreciate you!",
    "Such practical advice! Thank you!",
    "I've been looking for something like this. Thanks!",
  ],
  "practice-momentum": [
    "You're making great progress! Keep going!",
    "Love seeing your journey unfold. You've got this!",
    "This is so inspiring! Your clients are lucky to have you.",
    "Amazing progress! The momentum is real!",
    "Keep pushing forward! You're doing amazing!",
    "So proud of how far you've come!",
    "This is exactly the motivation I needed today!",
    "Your dedication is inspiring. Keep it up!",
    "Love following your journey! You're crushing it!",
    "Great work! Can't wait to see what's next for you!",
  ],
};

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomDate(startDays: number, endDays: number): Date {
  const start = new Date();
  start.setDate(start.getDate() - startDays);
  const end = new Date();
  end.setDate(end.getDate() - endDays);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  console.log("Starting fake profiles seed...");

  // Read avatar URLs from CSV
  const csvPath = path.join(__dirname, "../student_avatars/students-profiles-imgs.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const avatarUrls = csvContent
    .split("\n")
    .slice(1) // Skip header
    .map(line => line.trim())
    .filter(line => line.startsWith("http"));

  console.log(`Found ${avatarUrls.length} avatar URLs`);

  // Get existing community posts
  const posts = await prisma.communityPost.findMany({
    select: { id: true, categoryId: true },
  });
  console.log(`Found ${posts.length} community posts to add comments to`);

  // Track used names to avoid duplicates
  const usedNames = new Set<string>();

  // Create fake profiles
  const createdProfiles: string[] = [];

  for (let i = 0; i < avatarUrls.length; i++) {
    let firstName: string;
    let lastName: string;
    let fullName: string;

    // Generate unique name
    do {
      firstName = getRandomItem(firstNames);
      lastName = getRandomItem(lastNames);
      fullName = `${firstName} ${lastName}`;
    } while (usedNames.has(fullName));

    usedNames.add(fullName);

    // Create fake profile (no email)
    const profile = await prisma.user.create({
      data: {
        email: null, // No email for fake profiles
        firstName,
        lastName,
        avatar: avatarUrls[i],
        bio: getRandomItem(bioTemplates),
        location: getRandomItem(locations),
        role: "STUDENT",
        isActive: true,
        isFakeProfile: true, // Mark as fake
        hasCertificateBadge: Math.random() > 0.7, // 30% have badges
        miniDiplomaCompletedAt: Math.random() > 0.5 ? generateRandomDate(180, 7) : null,
        createdAt: generateRandomDate(365, 30), // Created 1 month to 1 year ago
      },
    });

    createdProfiles.push(profile.id);

    if ((i + 1) % 50 === 0) {
      console.log(`Created ${i + 1}/${avatarUrls.length} profiles...`);
    }
  }

  console.log(`Created ${createdProfiles.length} fake profiles`);

  // Now create comments on community posts
  console.log("Creating community comments...");

  let commentCount = 0;

  for (const post of posts) {
    // Each post gets 5-15 random comments
    const numComments = 5 + Math.floor(Math.random() * 11);

    // Get category-specific templates
    const categoryKey = post.categoryId as keyof typeof commentTemplates;
    const templates = commentTemplates[categoryKey] || commentTemplates.introductions;

    // Pick random profiles for comments
    const shuffledProfiles = [...createdProfiles].sort(() => Math.random() - 0.5);
    const commenters = shuffledProfiles.slice(0, numComments);

    for (const authorId of commenters) {
      // Get author name for template
      const author = await prisma.user.findUnique({
        where: { id: authorId },
        select: { firstName: true },
      });

      let content = getRandomItem(templates);
      // Replace {{name}} placeholder if present
      content = content.replace("{{name}}", author?.firstName || "there");

      await prisma.postComment.create({
        data: {
          postId: post.id,
          authorId,
          content,
          createdAt: generateRandomDate(60, 1), // 1-60 days ago
        },
      });

      commentCount++;
    }
  }

  console.log(`Created ${commentCount} comments across ${posts.length} posts`);

  // Update post comment counts
  for (const post of posts) {
    const count = await prisma.postComment.count({
      where: { postId: post.id },
    });

    await prisma.communityPost.update({
      where: { id: post.id },
      data: { commentCount: count },
    });
  }

  console.log("Updated post comment counts");
  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
