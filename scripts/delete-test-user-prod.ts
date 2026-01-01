import prisma from "../src/lib/prisma";

async function main() {
  const testEmail = "at.seed019@gmail.com";

  const user = await prisma.user.findUnique({
    where: { email: testEmail },
    select: { id: true, email: true, firstName: true }
  });

  if (user) {
    console.log('Found user:', user);

    // Delete all related data
    await prisma.userTag.deleteMany({ where: { userId: user.id } });
    await prisma.enrollment.deleteMany({ where: { userId: user.id } });
    await prisma.message.deleteMany({ where: { OR: [{ senderId: user.id }, { receiverId: user.id }] } });
    await prisma.scheduledVoiceMessage.deleteMany({ where: { OR: [{ senderId: user.id }, { receiverId: user.id }] } });
    await prisma.notification.deleteMany({ where: { userId: user.id } });
    await prisma.lessonProgress.deleteMany({ where: { userId: user.id } });
    await prisma.moduleProgress.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });

    console.log('✅ Deleted user:', testEmail);
  } else {
    console.log('No user found with email:', testEmail);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
