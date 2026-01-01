import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import { sendWomensHealthWelcomeEmail } from "../src/lib/email";

const TEST_EMAIL = "at.seed019@gmail.com";
const LEAD_PASSWORD = "coach2026";

async function main() {
  console.log("Testing Women's Health Mini Diploma optin flow...\n");

  // 1. Check if course exists
  const course = await prisma.course.findUnique({
    where: { slug: "womens-health-mini-diploma" },
  });

  if (!course) {
    console.error("❌ Course 'womens-health-mini-diploma' not found!");
    console.log("Available courses:");
    const courses = await prisma.course.findMany({ select: { slug: true, title: true } });
    courses.forEach((c) => console.log(`  - ${c.slug}: ${c.title}`));
    return;
  }
  console.log(`✅ Found course: ${course.title} (${course.slug})`);

  // 2. Find the coach
  const coach = await prisma.user.findUnique({
    where: { email: "sarah_womenhealth@accredipro-certificate.com" },
  });

  if (!coach) {
    console.warn("⚠️ Women's Health coach not found, messages won't be sent");
  } else {
    console.log(`✅ Found coach: ${coach.firstName} ${coach.lastName}`);
  }

  // 3. Delete existing test user if exists
  const existingUser = await prisma.user.findUnique({
    where: { email: TEST_EMAIL },
  });

  if (existingUser) {
    console.log("Cleaning up existing test user...");
    await prisma.userTag.deleteMany({ where: { userId: existingUser.id } });
    await prisma.enrollment.deleteMany({ where: { userId: existingUser.id } });
    await prisma.message.deleteMany({ where: { OR: [{ senderId: existingUser.id }, { receiverId: existingUser.id }] } });
    await prisma.scheduledVoiceMessage.deleteMany({ where: { OR: [{ senderId: existingUser.id }, { receiverId: existingUser.id }] } });
    await prisma.notification.deleteMany({ where: { userId: existingUser.id } });
    await prisma.lessonProgress.deleteMany({ where: { userId: existingUser.id } });
    await prisma.moduleProgress.deleteMany({ where: { userId: existingUser.id } });
    await prisma.user.delete({ where: { id: existingUser.id } });
    console.log("✅ Deleted existing user");
  }

  // 4. Create new user
  const passwordHash = await bcrypt.hash(LEAD_PASSWORD, 10);
  const accessExpiresAt = new Date();
  accessExpiresAt.setDate(accessExpiresAt.getDate() + 7);

  const user = await prisma.user.create({
    data: {
      email: TEST_EMAIL,
      firstName: "Alessio",
      lastName: "Test",
      passwordHash,
      role: "STUDENT",
      userType: "LEAD",
      isActive: true,
      leadSource: "mini-diploma",
      leadSourceDetail: "womens-health",
      miniDiplomaCategory: "womens-health",
      miniDiplomaOptinAt: new Date(),
      accessExpiresAt,
      assignedCoachId: coach?.id || null,
      enrollments: {
        create: {
          courseId: course.id,
          status: "ACTIVE",
        },
      },
    },
  });

  console.log(`✅ Created test user: ${user.email} (ID: ${user.id})`);
  console.log(`   - Access expires: ${accessExpiresAt.toISOString()}`);

  // 5. Send welcome email
  console.log("\nSending welcome email...");
  try {
    const result = await sendWomensHealthWelcomeEmail({
      to: TEST_EMAIL,
      firstName: "Alessio",
      isExistingUser: false,
      password: LEAD_PASSWORD,
    });

    if (result.success) {
      console.log(`✅ Welcome email sent! Resend ID: ${result.data?.id}`);
    } else {
      console.error(`❌ Failed to send email: ${result.error}`);
    }
  } catch (error) {
    console.error("❌ Email error:", error);
  }

  console.log("\n✅ Test complete! Check inbox at:", TEST_EMAIL);
  console.log("   Login credentials: " + TEST_EMAIL + " / " + LEAD_PASSWORD);

  await prisma.$disconnect();
}

main().catch(console.error);
