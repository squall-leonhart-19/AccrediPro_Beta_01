import prisma from "../src/lib/prisma";

async function main() {
  const testEmail = "at.seed019@gmail.com";

  // Check if test user exists
  const user = await prisma.user.findUnique({
    where: { email: testEmail },
    select: { id: true, email: true, firstName: true, userType: true, miniDiplomaCategory: true }
  });

  if (user) {
    console.log('Found existing user:', user);
    // Delete user and related data
    await prisma.userTag.deleteMany({ where: { userId: user.id } });
    await prisma.enrollment.deleteMany({ where: { userId: user.id } });
    await prisma.message.deleteMany({ where: { OR: [{ senderId: user.id }, { receiverId: user.id }] } });
    await prisma.scheduledVoiceMessage.deleteMany({ where: { OR: [{ senderId: user.id }, { receiverId: user.id }] } });
    await prisma.notification.deleteMany({ where: { userId: user.id } });
    await prisma.lessonProgress.deleteMany({ where: { userId: user.id } });
    await prisma.moduleProgress.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
    console.log('Deleted test user and related data');
  } else {
    console.log('No existing test user found - ready to test optin');
  }

  await prisma.$disconnect();
}

main().catch(console.error);
