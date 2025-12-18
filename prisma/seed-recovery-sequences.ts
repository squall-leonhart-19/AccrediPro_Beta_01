import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

import {
    NEVER_LOGGED_IN_EMAILS,
    NEVER_STARTED_EMAILS,
    ABANDONED_LEARNING_EMAILS
} from "../src/lib/recovery-emails";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

interface SequenceConfig {
    name: string;
    slug: string;
    description: string;
    triggerType: "MANUAL"; // Recovery sequences are triggered manually by cron
    emails: Array<{
        order: number;
        subject: string;
        delayDays: number;
        delayHours: number;
        content: string;
    }>;
}

const RECOVERY_SEQUENCES: SequenceConfig[] = [
    {
        name: "Recovery: Never Logged In",
        slug: "recovery-never-logged-in",
        description: "Re-engagement sequence for users who signed up but never logged in. Triggered by daily cron at days 1, 3, and 7.",
        triggerType: "MANUAL",
        emails: NEVER_LOGGED_IN_EMAILS,
    },
    {
        name: "Recovery: Never Started",
        slug: "recovery-never-started",
        description: "Re-engagement sequence for users who logged in but have 0% Mini Diploma progress. Triggered by daily cron at days 2, 5, and 10.",
        triggerType: "MANUAL",
        emails: NEVER_STARTED_EMAILS,
    },
    {
        name: "Recovery: Abandoned Learning",
        slug: "recovery-abandoned-learning",
        description: "Re-engagement sequence for users who started the Mini Diploma but stopped making progress. Triggered by daily cron at days 7, 14, and 21.",
        triggerType: "MANUAL",
        emails: ABANDONED_LEARNING_EMAILS,
    },
];

async function seed() {
    console.log("🔄 Seeding Recovery Sequences...\n");

    for (const seq of RECOVERY_SEQUENCES) {
        console.log(`\n📧 Processing: ${seq.name}`);

        // Check if sequence exists
        let sequence = await prisma.sequence.findUnique({
            where: { slug: seq.slug },
        });

        if (sequence) {
            console.log(`   ⚠️  Sequence exists, updating...`);

            // Delete existing emails
            await prisma.sequenceEmail.deleteMany({
                where: { sequenceId: sequence.id },
            });

            // Update sequence
            sequence = await prisma.sequence.update({
                where: { slug: seq.slug },
                data: {
                    name: seq.name,
                    description: seq.description,
                    triggerType: seq.triggerType,
                    isActive: true,
                },
            });
        } else {
            console.log(`   ✨ Creating new sequence...`);
            sequence = await prisma.sequence.create({
                data: {
                    name: seq.name,
                    slug: seq.slug,
                    description: seq.description,
                    triggerType: seq.triggerType,
                    isActive: true,
                    isSystem: true,
                },
            });
        }

        // Create emails
        for (const email of seq.emails) {
            await prisma.sequenceEmail.create({
                data: {
                    sequenceId: sequence.id,
                    order: email.order,
                    customSubject: email.subject,
                    customContent: email.content,
                    delayDays: email.delayDays,
                    delayHours: email.delayHours,
                    isActive: true,
                },
            });
            console.log(`   ✓ Email ${email.order + 1}: ${email.subject.substring(0, 40)}...`);
        }

        console.log(`   ✅ ${seq.name} complete with ${seq.emails.length} emails`);
    }

    console.log("\n\n🎉 Recovery Sequences seeded successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Never Logged In: ${NEVER_LOGGED_IN_EMAILS.length} emails`);
    console.log(`   - Never Started: ${NEVER_STARTED_EMAILS.length} emails`);
    console.log(`   - Abandoned Learning: ${ABANDONED_LEARNING_EMAILS.length} emails`);
    console.log(`   - Total: ${NEVER_LOGGED_IN_EMAILS.length + NEVER_STARTED_EMAILS.length + ABANDONED_LEARNING_EMAILS.length} emails`);
}

seed()
    .catch((e) => {
        console.error("❌ Error seeding recovery sequences:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
