import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Publish Module 1
  const updated = await prisma.module.update({
    where: { id: 'cmj5zidl30001766vht2r5o9t' },
    data: { isPublished: true }
  });

  console.log('✅ Published module:', updated.title);

  // Verify
  const course = await prisma.course.findFirst({
    where: { title: 'FM Test' },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        select: { id: true, title: true, order: true, isPublished: true, lessons: { select: { id: true, isPublished: true } } }
      }
    }
  });

  console.log('\n📚 FM Test Course:');
  course?.modules.forEach(m => {
    const publishedLessons = m.lessons.filter(l => l.isPublished).length;
    console.log(`  ${m.order}. ${m.title} - Published: ${m.isPublished}, Lessons: ${publishedLessons}/${m.lessons.length}`);
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
