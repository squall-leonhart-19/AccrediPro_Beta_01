/**
 * Backfill: Tag existing mini diploma users with nurture-30-day tag
 * This updates the count in Admin → Marketing
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("📧 Backfilling nurture-30-day tags...\n");

    // Find or create the nurture-30-day tag
    let nurtureTag = await prisma.marketingTag.findFirst({
        where: {
            OR: [
                { slug: "nurture-30-day" },
                { name: "nurture-30-day" },
            ],
        },
    });

    if (!nurtureTag) {
        console.log("Creating nurture-30-day tag...");
        nurtureTag = await prisma.marketingTag.create({
            data: {
                name: "nurture-30-day",
                slug: "nurture-30-day",
                category: "STAGE",
                description: "Users enrolled in 30-day nurture sequence",
                color: "#722F37",
                userCount: 0,
            },
        });
    }

    console.log(`Found/created tag: ${nurtureTag.name} (${nurtureTag.id})\n`);

    // Find all mini diploma signers who aren't tagged yet
    const users = await prisma.user.findMany({
        where: {
            miniDiplomaOptinAt: { not: null },
            isFakeProfile: false,
        },
        select: { id: true, email: true },
    });

    console.log(`Found ${users.length} mini diploma users to check\n`);

    let tagged = 0;
    let skipped = 0;

    for (const user of users) {
        // Check if already tagged
        const existing = await prisma.userMarketingTag.findUnique({
            where: {
                userId_tagId: {
                    userId: user.id,
                    tagId: nurtureTag.id,
                },
            },
        });

        if (existing) {
            skipped++;
            continue;
        }

        // Tag them
        await prisma.userMarketingTag.create({
            data: {
                userId: user.id,
                tagId: nurtureTag.id,
            },
        });

        console.log(`✅ Tagged: ${user.email}`);
        tagged++;
    }

    // Update tag count
    await prisma.marketingTag.update({
        where: { id: nurtureTag.id },
        data: { userCount: { increment: tagged } },
    });

    console.log(`\n📊 Summary:`);
    console.log(`   Tagged: ${tagged}`);
    console.log(`   Skipped (already tagged): ${skipped}`);
    console.log(`\n✅ Admin UI will now show correct enrolled count!`);

    await prisma.$disconnect();
}

main().catch(console.error);
