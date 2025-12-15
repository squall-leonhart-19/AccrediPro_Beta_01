import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Get first lesson from Module 1
  const lesson = await prisma.lesson.findFirst({
    where: {
      title: "Introduction to Functional Medicine"
    },
    select: {
      id: true,
      title: true,
      content: true
    }
  });

  if (!lesson) {
    console.log("Lesson not found");
    return;
  }

  console.log("Lesson:", lesson.title);
  console.log("Content length:", lesson.content?.length);
  console.log("\nFirst 500 chars of content:");
  console.log(lesson.content?.substring(0, 500));
  console.log("\n...\n");
  console.log("Contains <style>:", lesson.content?.includes("<style>"));
  console.log("Contains </style>:", lesson.content?.includes("</style>"));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
