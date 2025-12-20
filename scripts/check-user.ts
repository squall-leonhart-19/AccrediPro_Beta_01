import prisma from '../src/lib/prisma';

async function main() {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: 'judysmason@gmail.com' },
    include: {
      enrollments: { include: { course: { select: { title: true, slug: true } } } },
      tags: true,
      marketingTags: true,
      sequenceEnrollments: { include: { sequence: { select: { name: true } } } },
    }
  });

  if (!user) {
    console.log('USER NOT FOUND');
    return;
  }

  console.log('=== USER ===');
  console.log('ID:', user.id);
  console.log('Name:', user.firstName, user.lastName);
  console.log('Email:', user.email);
  console.log('Created:', user.createdAt);

  console.log('\n=== COURSE ENROLLMENTS ===');
  user.enrollments.forEach(e => console.log('-', e.course.title, '(', e.status, ')'));

  console.log('\n=== TAGS ===');
  user.tags.forEach(t => console.log('-', t.tagId));

  console.log('\n=== MARKETING TAGS ===');
  user.marketingTags.forEach(t => console.log('-', t.tag));

  console.log('\n=== SEQUENCE ENROLLMENTS ===');
  user.sequenceEnrollments.forEach(s => console.log('-', s.sequence.name, '(', s.status, ')'));

  // Check available sequences
  console.log('\n=== AVAILABLE SEQUENCES ===');
  const sequences = await prisma.emailSequence.findMany({ select: { id: true, name: true, slug: true } });
  sequences.forEach(s => console.log('-', s.name, '|', s.slug));

  await prisma.$disconnect();
}
main();
