/**
 * Backfill: Enroll existing mini diploma users into nurture sequence
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("📧 Backfilling nurture sequence enrollments...\n");

    // Find the nurture sequence
    const sequence = await prisma.sequence.findFirst({
        where: {
            OR: [
                { slug: "mini-diploma-to-certification-30d" },
                { triggerType: "MINI_DIPLOMA_STARTED" },
            ],
            isActive: true,
        },
    });

    if (!sequence) {
        console.log("❌ Nurture sequence not found!");
        return;
    }

    console.log(`Found sequence: ${sequence.name} (${sequence.id})\n`);

    // Find all mini diploma signers who aren't enrolled yet
    const users = await prisma.user.findMany({
        where: {
            miniDiplomaOptinAt: { not: null },
            isFakeProfile: false,
        },
        select: { id: true, email: true, miniDiplomaOptinAt: true },
    });

    console.log(`Found ${users.length} mini diploma users to check\n`);

    let enrolled = 0;
    let skipped = 0;

    for (const user of users) {
        // Check if already enrolled
        const existing = await prisma.sequenceEnrollment.findUnique({
            where: {
                userId_sequenceId: {
                    userId: user.id,
                    sequenceId: sequence.id,
                },
            },
        });

        if (existing) {
            skipped++;
            continue;
        }

        // Enroll them
        const nextSendAt = new Date();
        nextSendAt.setMinutes(nextSendAt.getMinutes() + 15); // Send in 15 minutes

        await prisma.sequenceEnrollment.create({
            data: {
                userId: user.id,
                sequenceId: sequence.id,
                status: "ACTIVE",
                currentEmailIndex: 0,
                nextSendAt,
            },
        });

        console.log(`✅ Enrolled: ${user.email}`);
        enrolled++;
    }

    // Update sequence stats
    await prisma.sequence.update({
        where: { id: sequence.id },
        data: { totalEnrolled: { increment: enrolled } },
    });

    console.log(`\n📊 Summary:`);
    console.log(`   Enrolled: ${enrolled}`);
    console.log(`   Skipped (already enrolled): ${skipped}`);
    console.log(`\n✅ Next cron run will send first email to all enrolled users!`);

    await prisma.$disconnect();
}

main().catch(console.error);
