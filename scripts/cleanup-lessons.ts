import { prisma } from "../src/lib/prisma";

async function cleanupLessons() {
  // Get FM test course
  const course = await prisma.course.findFirst({
    where: { slug: "fm-test" },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!course) {
    console.log("Course not found");
    return;
  }

  console.log("Course:", course.title);
  console.log("Modules:", course.modules.length);

  for (const mod of course.modules) {
    console.log(`\nModule ${mod.order}: ${mod.title} - ${mod.lessons.length} lessons`);

    // Keep only first 2 lessons, delete the rest
    if (mod.lessons.length > 2) {
      const lessonsToDelete = mod.lessons.slice(2);
      console.log(`  Deleting ${lessonsToDelete.length} lessons...`);

      for (const lesson of lessonsToDelete) {
        await prisma.lesson.delete({ where: { id: lesson.id } });
        console.log(`    Deleted: ${lesson.title}`);
      }
    } else {
      console.log("  Already has 2 or fewer lessons");
    }
  }

  console.log("\nDone!");
}

cleanupLessons()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
