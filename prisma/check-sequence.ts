import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Get the sequence
  const sequence = await prisma.sequence.findFirst({
    where: { slug: 'welcome-mini-diploma-series' },
    include: {
      emails: { orderBy: { order: 'asc' } },
      triggerTag: true,
      exitTag: true,
    },
  });

  if (!sequence) {
    console.log('Sequence not found, need to run seed');
    return;
  }

  console.log('Sequence:', sequence.name);
  console.log('Active:', sequence.isActive);
  console.log('Emails:', sequence.emails.length);
  console.log('Trigger Tag:', sequence.triggerTag?.name || 'None');
  console.log('Exit Tag:', sequence.exitTag?.name || 'None');

  // Get the user
  const user = await prisma.user.findFirst({
    where: { email: 'at.seed019@gmail.com' },
    include: {
      marketingTags: {
        include: { tag: true }
      }
    }
  });

  if (user) {
    console.log('\nUser found:', user.email);
    console.log('User tags:', user.marketingTags.map(t => t.tag.name).join(', ') || 'None');

    // Check if already enrolled
    const enrollment = await prisma.sequenceEnrollment.findFirst({
      where: { userId: user.id, sequenceId: sequence.id },
    });

    if (enrollment) {
      console.log('Enrollment status:', enrollment.status);
      console.log('Current email index:', enrollment.currentEmailIndex);
      console.log('Next send at:', enrollment.nextSendAt);
    } else {
      console.log('Not enrolled in sequence');
    }
  } else {
    console.log('\nUser not found');
  }
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
