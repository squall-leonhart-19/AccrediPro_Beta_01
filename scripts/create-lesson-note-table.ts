import prisma from "../src/lib/prisma";

async function createLessonNoteTable() {
  console.log("Creating LessonNote table...");

  try {
    // Create the enum type first if it doesn't exist
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "NoteType" AS ENUM ('NOTE', 'HIGHLIGHT');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log("NoteType enum created or already exists");

    // Create the LessonNote table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "LessonNote" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "lessonId" TEXT NOT NULL,
        "type" "NoteType" NOT NULL DEFAULT 'NOTE',
        "content" TEXT NOT NULL,
        "noteText" TEXT,
        "position" INTEGER,
        "color" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "LessonNote_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "LessonNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "LessonNote_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    console.log("LessonNote table created or already exists");

    // Create indexes
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "LessonNote_userId_lessonId_idx" ON "LessonNote"("userId", "lessonId");
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "LessonNote_lessonId_idx" ON "LessonNote"("lessonId");
    `);
    console.log("Indexes created");

    console.log("LessonNote table setup complete!");
  } catch (error) {
    console.error("Error creating table:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createLessonNoteTable();
