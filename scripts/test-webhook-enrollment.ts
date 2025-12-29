/**
 * Test Webhook Enrollment Script
 * 
 * Simulates a ClickFunnels purchase webhook to test the full enrollment flow:
 * - User creation
 * - Course enrollment
 * - Sarah's welcome DM trigger
 * 
 * Usage: npx tsx scripts/test-webhook-enrollment.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Test configuration
const TEST_EMAIL = `test-webhook-${Date.now()}@example.com`;
const TEST_FIRST_NAME = "WebhookTest";
const TEST_PRODUCT = "FM Mini Diploma";

async function main() {
    console.log("=".repeat(60));
    console.log("🧪 WEBHOOK ENROLLMENT TEST");
    console.log("=".repeat(60));
    console.log(`Test Email: ${TEST_EMAIL}`);
    console.log();

    // Simulate webhook payload (ClickFunnels 2.0 format)
    const webhookPayload = {
        data: {
            contact: {
                email_address: TEST_EMAIL,
                first_name: TEST_FIRST_NAME,
                last_name: "User",
            },
            line_items: [{
                name: TEST_PRODUCT,
                amount: "27.00",
            }],
        },
        event_type: "order.completed",
    };

    console.log("📤 Sending webhook payload...");
    console.log(JSON.stringify(webhookPayload, null, 2));
    console.log();

    // Call the webhook endpoint
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookUrl = `${baseUrl}/api/webhooks/clickfunnels-purchase`;

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(webhookPayload),
        });

        const result = await response.json();

        console.log("📥 Webhook Response:");
        console.log(`Status: ${response.status}`);
        console.log(JSON.stringify(result, null, 2));
        console.log();

        if (!response.ok) {
            console.error("❌ Webhook failed!");
            return;
        }

        // Verify the results in database
        console.log("🔍 Verifying database state...");
        console.log();

        // 1. Check user created
        const user = await prisma.user.findUnique({
            where: { email: TEST_EMAIL.toLowerCase() },
            select: {
                id: true,
                email: true,
                firstName: true,
                createdAt: true,
            },
        });

        if (user) {
            console.log("✅ User created:");
            console.log(`   ID: ${user.id}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Name: ${user.firstName}`);
        } else {
            console.error("❌ User NOT found!");
            return;
        }

        // 2. Check enrollment
        const enrollment = await prisma.enrollment.findFirst({
            where: { userId: user.id },
            include: { course: { select: { title: true, slug: true } } },
        });

        if (enrollment) {
            console.log("✅ Enrollment created:");
            console.log(`   Course: ${enrollment.course.title}`);
            console.log(`   Slug: ${enrollment.course.slug}`);
        } else {
            console.error("❌ Enrollment NOT found!");
        }

        // 3. Check for scheduled/sent messages (Sarah DM)
        const messages = await prisma.message.findMany({
            where: { receiverId: user.id },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                sender: { select: { firstName: true, email: true } },
            },
        });

        if (messages.length > 0) {
            console.log(`✅ Messages found (${messages.length}):`);
            for (const msg of messages) {
                console.log(`   From: ${msg.sender?.firstName || "System"}`);
                console.log(`   Preview: ${msg.content.substring(0, 80)}...`);
            }
        } else {
            // Check scheduled messages
            const scheduled = await (prisma as any).scheduledVoiceMessage?.findMany?.({
                where: { userId: user.id },
            });

            if (scheduled && scheduled.length > 0) {
                console.log(`✅ Scheduled messages found (${scheduled.length})`);
            } else {
                console.log("⚠️ No messages found yet (may be scheduled for later)");
            }
        }

        // 4. Check tags
        const tags = await prisma.userTag.findMany({
            where: { userId: user.id },
            select: { tag: true },
        });

        if (tags.length > 0) {
            console.log(`✅ Tags created (${tags.length}):`);
            for (const t of tags) {
                console.log(`   - ${t.tag}`);
            }
        }

        console.log();
        console.log("=".repeat(60));
        console.log("✅ TEST COMPLETE");
        console.log("=".repeat(60));
        console.log();
        console.log("🧹 To clean up test user, run:");
        console.log(`   DELETE FROM "User" WHERE email = '${TEST_EMAIL.toLowerCase()}';`);

    } catch (error) {
        console.error("❌ Error calling webhook:", error);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
