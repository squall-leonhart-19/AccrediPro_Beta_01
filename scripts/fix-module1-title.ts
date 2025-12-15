import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Update the module title
  const updated = await prisma.module.update({
    where: { id: 'cmj5zidl30001766vht2r5o9t' },
    data: {
      title: 'Module 1: Introduction to Functional Medicine',
      description: 'Explore the foundational concepts of functional medicine, including systems biology, root cause analysis, and the powerful tools used to understand patient health.'
    }
  });
  console.log('Updated module:', updated.title);

  // Get full course with all modules and lessons
  const course = await prisma.course.findFirst({
    where: { title: 'FM Test' },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            select: { id: true, title: true, order: true }
          }
        }
      }
    }
  });

  console.log('\n📚 FM Test Course Structure:');
  course?.modules.forEach(m => {
    console.log(`\n📦 ${m.title} (${m.lessons.length} lessons)`);
    m.lessons.forEach(l => {
      console.log(`   ${l.order}. ${l.title}`);
    });
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
