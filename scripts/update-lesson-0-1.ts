import { prisma } from "../src/lib/prisma";
import * as fs from "fs";
import * as path from "path";

const LESSON_ID = "cmj6cpy980001vx6vq355bt8a";
const HTML_FILE_PATH = path.join(
    process.cwd(),
    "FM/FM-Update/Module_00/Lesson_0.1_Welcome_To_Your_Certification_Journey.html"
);

async function main() {
    console.log("📚 Updating lesson content in database...\n");

    // Read the FULL HTML file (including styles in head)
    const fullHtmlContent = fs.readFileSync(HTML_FILE_PATH, "utf-8");
    console.log(`Read HTML file: ${HTML_FILE_PATH}`);
    console.log(`Content length: ${fullHtmlContent.length} characters\n`);

    // Update the lesson in the database
    const updatedLesson = await prisma.lesson.update({
        where: { id: LESSON_ID },
        data: {
            content: fullHtmlContent,
        },
        select: {
            id: true,
            title: true,
            content: true,
        },
    });

    console.log(`✅ Updated lesson: ${updatedLesson.title}`);
    console.log(`   ID: ${updatedLesson.id}`);
    console.log(`   Content length: ${updatedLesson.content?.length || 0} characters`);
    console.log(`\n🎉 Done! Refresh the page to see changes.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
