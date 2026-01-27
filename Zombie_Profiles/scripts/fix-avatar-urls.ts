/**
 * Fix zombie profile avatar URLs
 * Run: npx tsx Zombie_Profiles/scripts/fix-avatar-urls.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Working avatar URLs from assets.accredipro.academy
const AVATAR_URLS = [
    "https://assets.accredipro.academy/fm-certification/T1.webp",
    "https://assets.accredipro.academy/fm-certification/T2.webp",
    "https://assets.accredipro.academy/fm-certification/T3.webp",
    "https://assets.accredipro.academy/fm-certification/T4.webp",
    "https://assets.accredipro.academy/fm-certification/T5.webp",
    "https://assets.accredipro.academy/fm-certification/T6.webp",
    "https://assets.accredipro.academy/fm-certification/T7.webp",
    "https://assets.accredipro.academy/fm-certification/T8.webp",
    "https://assets.accredipro.academy/fm-certification/T9.webp",
    "https://assets.accredipro.academy/fm-certification/T10.webp",
    "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_01.jpg",
    "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_02.jpg",
    "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_03.jpg",
    "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_04.jpg",
    "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_05.jpeg",
];

async function main() {
    console.log("🔧 Fixing zombie profile avatar URLs...\n");

    // Get all zombie profiles used in graduate posts
    const profiles = await prisma.zombieProfile.findMany({
        where: { isGraduate: true, isActive: true }
    });

    console.log(`Found ${profiles.length} graduate profiles to update\n`);

    for (let i = 0; i < profiles.length; i++) {
        const profile = profiles[i];
        const newAvatar = AVATAR_URLS[i % AVATAR_URLS.length];

        await prisma.zombieProfile.update({
            where: { id: profile.id },
            data: { avatar: newAvatar }
        });

        console.log(`✓ Updated ${profile.name} → ${newAvatar.split('/').pop()}`);
    }

    console.log(`\n✅ Updated ${profiles.length} profile avatars`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
