import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

import {
    CHRISTMAS_CAMPAIGN_EMAILS,
    NEW_YEAR_CAMPAIGN_EMAILS
} from "../src/lib/holiday-emails";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

interface SequenceConfig {
    name: string;
    slug: string;
    description: string;
    triggerType: "MANUAL";
    emails: Array<{
        order: number;
        subject: string;
        delayDays: number;
        delayHours: number;
        content: string;
    }>;
}

const HOLIDAY_SEQUENCES: SequenceConfig[] = [
    {
        name: "Holiday: Christmas 2024",
        slug: "holiday-christmas-2024",
        description: "Christmas Campaign (Dec 23-26) - $997 certification 'Gift to Yourself' angle. Target all leads/graduates who haven't purchased.",
        triggerType: "MANUAL",
        emails: CHRISTMAS_CAMPAIGN_EMAILS,
    },
    {
        name: "Holiday: New Year 2025",
        slug: "holiday-new-year-2025",
        description: "New Year Campaign (Dec 30 - Jan 2) - $997 certification 'New Year, New Career' angle. Fresh start, career transformation.",
        triggerType: "MANUAL",
        emails: NEW_YEAR_CAMPAIGN_EMAILS,
    },
];

async function seed() {
    console.log("🎄 Seeding Holiday Campaign Sequences...\n");

    for (const seq of HOLIDAY_SEQUENCES) {
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
                    isSystem: false, // Holiday campaigns are not system sequences
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

    console.log("\n\n🎉 Holiday Campaign Sequences seeded successfully!");
    console.log("\n📊 Summary:");
    console.log(`   🎄 Christmas 2024: ${CHRISTMAS_CAMPAIGN_EMAILS.length} emails (Dec 23-26)`);
    console.log(`   🎆 New Year 2025: ${NEW_YEAR_CAMPAIGN_EMAILS.length} emails (Dec 30 - Jan 2)`);
    console.log(`   📧 Total: ${CHRISTMAS_CAMPAIGN_EMAILS.length + NEW_YEAR_CAMPAIGN_EMAILS.length} holiday emails`);
}

seed()
    .catch((e) => {
        console.error("❌ Error seeding holiday campaigns:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
