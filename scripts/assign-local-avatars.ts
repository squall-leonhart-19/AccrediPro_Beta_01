/**
 * Assign local zombie avatars to all zombie users
 * Uses files from /public/zombie-avatars/ - randomly assigned
 */

import prisma from '../src/lib/prisma';
import fs from 'fs';
import path from 'path';

async function main() {
    console.log("Assigning local zombie avatars...\n");

    // Step 1: Get all local avatar files
    const avatarDir = path.join(process.cwd(), 'public/zombie-avatars');
    const files = fs.readdirSync(avatarDir).filter(f => f.endsWith('.webp'));
    console.log(`Found ${files.length} local avatar files\n`);

    // Step 2: Get all zombie users
    const zombies = await prisma.user.findMany({
        where: { isFakeProfile: true },
        select: { id: true, firstName: true }
    });
    console.log(`Found ${zombies.length} zombie users\n`);

    // Step 3: Randomly assign avatars
    console.log("Assigning avatars...");
    let updated = 0;

    for (const zombie of zombies) {
        // Pick a random avatar file
        const randomFile = files[Math.floor(Math.random() * files.length)];
        const avatarUrl = `/zombie-avatars/${randomFile}`;

        await prisma.user.update({
            where: { id: zombie.id },
            data: { avatar: avatarUrl }
        });

        updated++;
        if (updated % 200 === 0) {
            console.log(`Updated ${updated}/${zombies.length}...`);
        }
    }

    console.log(`\nDone! Updated ${updated} zombies with local avatars`);

    // Verify
    const sample = await prisma.user.findFirst({
        where: { isFakeProfile: true },
        select: { firstName: true, lastName: true, avatar: true }
    });
    console.log("\nSample:", sample);
}

main().catch(console.error).finally(() => prisma.$disconnect());
