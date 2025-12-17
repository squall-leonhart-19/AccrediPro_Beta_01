/**
 * Fix lesson order gap: 0, 2, 3, 4 -> 0, 1, 2, 3
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🔧 Fixing lesson order gap...\n");

    const moduleId = "cmj8p65em0001d16v5hkulp2i";

    // Get all lessons in this module
    const lessons = await prisma.lesson.findMany({
        where: { moduleId },
        orderBy: { order: "asc" },
    });

    console.log("Current order:");
    for (const lesson of lessons) {
        console.log(`  Order ${lesson.order}: ${lesson.title}`);
    }

    // Reorder to 0, 1, 2, 3
    console.log("\nReordering...");
    for (let i = 0; i < lessons.length; i++) {
        await prisma.lesson.update({
            where: { id: lessons[i].id },
            data: { order: i },
        });
        console.log(`  ${lessons[i].title} -> order ${i}`);
    }

    console.log("\n✅ Done!");
}

main()
    .catch((e) => {
        console.error("Error:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
