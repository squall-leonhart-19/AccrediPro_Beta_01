import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Get a lesson with toggleAnswer
    const lessons = await prisma.lesson.findMany({
        where: {
            content: { contains: "toggleAnswer" }
        },
        select: { id: true, title: true, content: true },
        take: 3
    });

    console.log(`Found ${lessons.length} lessons with toggleAnswer\n`);

    for (const lesson of lessons) {
        console.log("=".repeat(60));
        console.log("Title:", lesson.title);
        console.log("ID:", lesson.id);

        if (lesson.content) {
            // Find all script tags
            const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
            let match;
            let scriptCount = 0;

            while ((match = scriptRegex.exec(lesson.content)) !== null) {
                scriptCount++;
                const scriptContent = match[1];
                console.log(`\n--- Script ${scriptCount} (${scriptContent.length} chars) ---`);
                console.log(scriptContent.substring(0, 1000));

                // Check for setTimeout
                if (scriptContent.includes("setTimeout")) {
                    console.log("\n⚠️ FOUND setTimeout IN THIS SCRIPT!");
                }
            }

            if (scriptCount === 0) {
                console.log("\nNo script tags found");
            }
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
