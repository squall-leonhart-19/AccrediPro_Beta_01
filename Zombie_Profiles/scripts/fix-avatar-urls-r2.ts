/**
 * Fix zombie profile avatar URLs - Use R2 accredipro-assets/avatars/ folder
 * Run: npx tsx Zombie_Profiles/scripts/fix-avatar-urls-r2.ts
 */

import * as fs from "fs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🔧 Fixing zombie profile avatar URLs with R2 avatars...\n");

    // Read the R2 avatar URLs we extracted earlier
    const avatarsPath = "/Users/pochitino/Desktop/accredipro-lms/Zombie_Profiles/data/r2_avatars.txt";
    const avatarUrls = fs.readFileSync(avatarsPath, "utf-8").trim().split("\n");

    console.log(`📷 Loaded ${avatarUrls.length} R2 avatar URLs\n`);

    // Get all graduate zombie profiles
    const profiles = await prisma.zombieProfile.findMany({
        where: { isGraduate: true, isActive: true }
    });

    console.log(`Found ${profiles.length} graduate profiles to update\n`);

    for (let i = 0; i < profiles.length; i++) {
        const profile = profiles[i];
        const newAvatar = avatarUrls[i % avatarUrls.length];

        await prisma.zombieProfile.update({
            where: { id: profile.id },
            data: { avatar: newAvatar }
        });

        if (i < 10) {
            console.log(`✓ Updated ${profile.name} → ${newAvatar.split('/').pop()}`);
        }
    }

    if (profiles.length > 10) {
        console.log(`... and ${profiles.length - 10} more`);
    }

    console.log(`\n✅ Updated ${profiles.length} profile avatars with R2 URLs`);
    console.log(`\n📍 URL format: https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/avatars/zombie-*.png`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
