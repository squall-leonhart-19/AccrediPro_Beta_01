import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const testEmail = 'at.seed019@gmail.com';

  console.log('📊 Updating enrollment stats for:', testEmail);

  // Get user
  const user = await prisma.user.findUnique({
    where: { email: testEmail },
  });

  if (!user) {
    console.error('User not found');
    return;
  }

  // Get sequence
  const sequence = await prisma.sequence.findUnique({
    where: { slug: 'welcome-mini-diploma-series' },
    include: {
      emails: { orderBy: { order: 'asc' } },
    },
  });

  if (!sequence) {
    console.error('Sequence not found');
    return;
  }

  // Get enrollment
  const enrollment = await prisma.sequenceEnrollment.findUnique({
    where: {
      userId_sequenceId: {
        userId: user.id,
        sequenceId: sequence.id,
      },
    },
  });

  if (!enrollment) {
    console.error('Enrollment not found');
    return;
  }

  const firstEmail = sequence.emails[0];
  const now = new Date();

  // Update enrollment stats
  await prisma.sequenceEnrollment.update({
    where: { id: enrollment.id },
    data: {
      emailsReceived: 1,
      currentEmailIndex: 1,
      // Next email send time (email #2 has 1 day delay)
      nextSendAt: new Date(now.getTime() + (24 * 60 * 60 * 1000)),
    },
  });

  console.log('✅ Enrollment updated');

  // Check if send log exists
  const existingSend = await prisma.sequenceEmailSend.findFirst({
    where: {
      enrollmentId: enrollment.id,
      sequenceEmailId: firstEmail.id,
    },
  });

  if (!existingSend) {
    // Create send log
    await prisma.sequenceEmailSend.create({
      data: {
        enrollmentId: enrollment.id,
        sequenceEmailId: firstEmail.id,
        sentAt: now,
        status: 'SENT',
      },
    });
    console.log('✅ Send log created');
  } else {
    console.log('ℹ️  Send log already exists');
  }

  // Final status
  const finalEnrollment = await prisma.sequenceEnrollment.findUnique({
    where: { id: enrollment.id },
    include: {
      sequence: { select: { name: true } },
    },
  });

  const sendCount = await prisma.sequenceEmailSend.count({
    where: { enrollmentId: enrollment.id },
  });

  console.log('\n📊 Final Status:');
  console.log('   Sequence:', finalEnrollment?.sequence.name);
  console.log('   Status:', finalEnrollment?.status);
  console.log('   Current Email Index:', finalEnrollment?.currentEmailIndex);
  console.log('   Emails Received:', finalEnrollment?.emailsReceived);
  console.log('   Send Logs:', sendCount);
  console.log('   Next Send At:', finalEnrollment?.nextSendAt);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
