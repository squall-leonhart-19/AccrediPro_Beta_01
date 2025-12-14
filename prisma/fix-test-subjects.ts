import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Get all sequence emails and check their subjects
  const emails = await prisma.sequenceEmail.findMany({
    select: { id: true, customSubject: true }
  });

  console.log('Current sequence email subjects:');
  emails.forEach(e => console.log('  -', e.id, ':', e.customSubject));

  // Update any that have [TEST] prefix
  for (const email of emails) {
    if (email.customSubject && email.customSubject.includes('[TEST]')) {
      const newSubject = email.customSubject.replace(/\[TEST\]\s*/gi, '');
      await prisma.sequenceEmail.update({
        where: { id: email.id },
        data: { customSubject: newSubject }
      });
      console.log('Updated:', email.id, '->', newSubject);
    }
  }

  console.log('\nDone!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
