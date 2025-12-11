// Seed test users: Student and Sarah Coach
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function seedUsers() {
  console.log("🌱 Creating test users...");

  const hashedPassword = await bcrypt.hash("Test123!", 10);

  // Create Sarah Coach (Mentor/Coach)
  const sarahCoach = await prisma.user.upsert({
    where: { email: "sarah@accredipro.academy" },
    update: {
      firstName: "Sarah",
      lastName: "Williams",
      role: "MENTOR",
      bio: "Certified Holistic Health Coach with 10+ years of experience. Passionate about helping women transform their lives through wellness and nutrition.",
      isActive: true,
      hasCompletedOnboarding: true,
      hasCompletedProfile: true,
    },
    create: {
      email: "sarah@accredipro.academy",
      passwordHash: hashedPassword,
      firstName: "Sarah",
      lastName: "Williams",
      role: "MENTOR",
      bio: "Certified Holistic Health Coach with 10+ years of experience. Passionate about helping women transform their lives through wellness and nutrition.",
      isActive: true,
      hasCompletedOnboarding: true,
      hasCompletedProfile: true,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
  });
  console.log(`✅ Created Sarah Coach: ${sarahCoach.email}`);

  // Create Test Student
  const testStudent = await prisma.user.upsert({
    where: { email: "student@test.com" },
    update: {
      firstName: "Emma",
      lastName: "Thompson",
      role: "STUDENT",
      isActive: true,
      hasCompletedOnboarding: true,
      hasCompletedProfile: true,
      assignedCoachId: sarahCoach.id,
      learningGoal: "Build a career",
      experienceLevel: "Beginner",
      focusAreas: ["Holistic Nutrition", "Women's Health"],
    },
    create: {
      email: "student@test.com",
      passwordHash: hashedPassword,
      firstName: "Emma",
      lastName: "Thompson",
      role: "STUDENT",
      isActive: true,
      hasCompletedOnboarding: true,
      hasCompletedProfile: true,
      assignedCoachId: sarahCoach.id,
      learningGoal: "Build a career",
      experienceLevel: "Beginner",
      focusAreas: ["Holistic Nutrition", "Women's Health"],
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
  });
  console.log(`✅ Created Test Student: ${testStudent.email}`);

  // Create a streak for the student
  await prisma.userStreak.upsert({
    where: { userId: testStudent.id },
    update: {
      currentStreak: 5,
      longestStreak: 12,
      totalPoints: 450,
    },
    create: {
      userId: testStudent.id,
      currentStreak: 5,
      longestStreak: 12,
      totalPoints: 450,
    },
  });
  console.log("✅ Created student streak");

  // Create initial welcome message from Sarah to student
  await prisma.message.upsert({
    where: { id: "welcome-message-1" },
    update: {},
    create: {
      id: "welcome-message-1",
      senderId: sarahCoach.id,
      receiverId: testStudent.id,
      content: "Welcome to AccrediPro, Emma! 💛 I'm Sarah, your personal coach. I'm so excited to support you on your wellness journey. Feel free to reach out anytime you have questions or need guidance. You've got this!",
      messageType: "DIRECT",
      isRead: false,
    },
  });
  console.log("✅ Created welcome message from Sarah");

  console.log("\n🎉 Test users created successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Login Credentials:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n📚 Student Account:");
  console.log("   Email: student@test.com");
  console.log("   Password: Test123!");
  console.log("\n👩‍🏫 Sarah Coach Account:");
  console.log("   Email: sarah@accredipro.academy");
  console.log("   Password: Test123!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

seedUsers()
  .catch((e) => {
    console.error("❌ Error seeding users:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
