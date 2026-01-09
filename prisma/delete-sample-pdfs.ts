/**
 * Delete Sample PDF Resources
 *
 * Run with: npx tsx prisma/delete-sample-pdfs.ts
 */

import prisma from "../src/lib/prisma";

async function main() {
    console.log("Deleting sample PDF resources...\n");

    // Delete the sample PDF resources
    const deleted = await prisma.lessonResource.deleteMany({
        where: {
            title: {
                in: [
                    "Client Assessment Worksheet",
                    "Gut Health Protocol Template",
                    "Elimination Diet Food List"
                ]
            }
        }
    });

    console.log(`Deleted ${deleted.count} sample PDF resources`);
    console.log("\nDone!");
}

main()
    .catch((e) => {
        console.error("Error:", e);
        process.exit(1);
    });
