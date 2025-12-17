import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function createTestSequence() {
    console.log("🧪 Creating test sequence with 2 emails...\n");

    // Create or find test tag
    let testTag = await prisma.marketingTag.findFirst({
        where: { slug: "test-sequence-trigger" },
    });

    if (!testTag) {
        testTag = await prisma.marketingTag.create({
            data: {
                name: "Test Sequence Trigger",
                slug: "test-sequence-trigger",
                category: "CUSTOM",
            },
        });
        console.log("✅ Created test tag: test-sequence-trigger");
    } else {
        console.log("✅ Found existing test tag");
    }

    // Delete existing test sequence if exists
    const existing = await prisma.sequence.findFirst({
        where: { slug: "test-2-emails" },
    });
    if (existing) {
        await prisma.sequenceEnrollment.deleteMany({ where: { sequenceId: existing.id } });
        await prisma.sequenceEmail.deleteMany({ where: { sequenceId: existing.id } });
        await prisma.sequence.delete({ where: { id: existing.id } });
        console.log("🗑️  Deleted old test sequence");
    }

    // Create test sequence
    const sequence = await prisma.sequence.create({
        data: {
            name: "TEST - 2 Email Sequence",
            slug: "test-2-emails",
            description: "Testing: Email 1 immediate, Email 2 after 5 minutes",
            triggerType: "TAG_ADDED",
            triggerTagId: testTag.id,
            isActive: true,
        },
    });
    console.log("✅ Created sequence:", sequence.name);

    // Email 1: Immediate (delayDays=0, delayHours=0)
    await prisma.sequenceEmail.create({
        data: {
            sequenceId: sequence.id,
            order: 0,
            customSubject: "🧪 Test Email 1 - Immediate",
            customContent: `Hi {{firstName}},

This is TEST EMAIL 1.

Sent immediately when you were added to the test sequence.

Timestamp: ${new Date().toISOString()}

Expect Email 2 in about 5 minutes!

- Test Bot`,
            delayDays: 0,
            delayHours: 0,
            isActive: true,
        },
    });
    console.log("   📧 Email 1: Immediate (Day 0, Hour 0)");

    // Email 2: 5 minutes after first (we'll handle this via nextSendAt in enrollment)
    // Note: The cron uses delayDays/delayHours, but for 5 min test we need custom logic
    // Setting delayHours=0 but we'll manually set nextSendAt when enrolling
    await prisma.sequenceEmail.create({
        data: {
            sequenceId: sequence.id,
            order: 1,
            customSubject: "🧪 Test Email 2 - 5 min later",
            customContent: `Hi {{firstName}},

This is TEST EMAIL 2.

Sent 5 minutes after Email 1!

If you're seeing this, the sequence is working! 🎉

Timestamp: ${new Date().toISOString()}

- Test Bot`,
            delayDays: 0,
            delayHours: 0, // For testing, we'll set nextSendAt manually
            isActive: true,
        },
    });
    console.log("   📧 Email 2: After 5 minutes");

    console.log("\n✅ Test sequence created!\n");
    console.log("-----------------------------------");
    console.log("To test, run: npx tsx scripts/enroll-test-user.ts YOUR_EMAIL");
    console.log("-----------------------------------");

    await prisma.$disconnect();
}

createTestSequence().catch(console.error);
