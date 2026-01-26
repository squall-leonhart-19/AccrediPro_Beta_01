/**
 * Sync zombie avatars from R2
 * Lists all avatars in R2 and updates matching users in the database
 */

import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import prisma from '../src/lib/prisma';

const client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;
const BUCKET = process.env.R2_BUCKET_NAME!;

async function getAllR2AvatarUserIds(): Promise<Set<string>> {
    const userIds = new Set<string>();
    let continuationToken: string | undefined;

    do {
        const cmd = new ListObjectsV2Command({
            Bucket: BUCKET,
            Prefix: 'avatars/zombie-',
            ContinuationToken: continuationToken,
            MaxKeys: 1000,
        });

        const result = await client.send(cmd);

        for (const obj of result.Contents || []) {
            // Extract user ID from filename like "avatars/zombie-cmk8w1ys10002xym9uoo1tzyd.png"
            const match = obj.Key?.match(/avatars\/zombie-([^.]+)\.png$/);
            if (match) {
                userIds.add(match[1]);
            }
        }

        console.log(`Fetched ${userIds.size} avatar IDs so far...`);
        continuationToken = result.NextContinuationToken;
    } while (continuationToken);

    return userIds;
}

async function main() {
    console.log("Syncing zombie avatars from R2...\n");

    // Step 1: Get all avatar user IDs from R2
    console.log("Step 1: Listing R2 avatars...");
    const r2UserIds = await getAllR2AvatarUserIds();
    console.log(`Found ${r2UserIds.size} avatar files on R2\n`);

    // Step 2: Get all zombie users from database
    console.log("Step 2: Fetching zombie users from database...");
    const zombies = await prisma.user.findMany({
        where: { isFakeProfile: true },
        select: { id: true, firstName: true }
    });
    console.log(`Found ${zombies.length} zombie users in database\n`);

    // Step 3: Update users that have matching R2 avatars
    console.log("Step 3: Updating avatar URLs...");
    let updated = 0;
    let noMatch = 0;

    for (const zombie of zombies) {
        if (r2UserIds.has(zombie.id)) {
            const avatarUrl = `${R2_PUBLIC_URL}/avatars/zombie-${zombie.id}.png`;
            await prisma.user.update({
                where: { id: zombie.id },
                data: { avatar: avatarUrl }
            });
            updated++;
        } else {
            // Clear avatar for users without R2 files (will show initials)
            await prisma.user.update({
                where: { id: zombie.id },
                data: { avatar: null }
            });
            noMatch++;
        }

        if ((updated + noMatch) % 200 === 0) {
            console.log(`Processed ${updated + noMatch}/${zombies.length}...`);
        }
    }

    console.log(`\nDone!`);
    console.log(`- Updated ${updated} users with R2 avatar URLs`);
    console.log(`- Cleared ${noMatch} users (no R2 file)`);

    // Verify
    const sample = await prisma.user.findFirst({
        where: { isFakeProfile: true, avatar: { not: null } },
        select: { firstName: true, lastName: true, avatar: true }
    });
    console.log("\nSample:", sample);
}

main().catch(console.error).finally(() => prisma.$disconnect());
