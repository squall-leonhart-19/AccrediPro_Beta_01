import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const course = await prisma.course.findFirst({
    where: { title: 'FM Test' },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        select: { id: true, title: true, order: true, isPublished: true, lessons: { select: { id: true } } }
      }
    }
  });

  console.log('Course:', course?.title);
  console.log('\nModules:');
  course?.modules.forEach(m => {
    console.log(`  ${m.order}. ${m.title}`);
    console.log(`     Published: ${m.isPublished}, Lessons: ${m.lessons.length}`);
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
