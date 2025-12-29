/**
 * Direct Webhook Logic Test
 * 
 * Tests the Sarah DM trigger directly without needing the server running.
 * Simulates what the webhook does: create user, enroll, trigger DM.
 * 
 * Usage: npx tsx scripts/test-webhook-dm-direct.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { triggerAutoMessage } from "../src/lib/auto-messages";
import "dotenv/config";
import path from "path";
import dotenv from "dotenv";

// Load config.env for ElevenLabs/Supabase keys
dotenv.config({ path: path.resolve(process.cwd(), "tools/course-generator/config.env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Test configuration
const TEST_EMAIL = `test-dm-${Date.now()}@example.com`;
const TEST_FIRST_NAME = "DMTest";

async function main() {
    console.log("=".repeat(60));
    console.log("🧪 DIRECT SARAH DM TEST");
    console.log("=".repeat(60));
    console.log(`Test Email: ${TEST_EMAIL}`);
    console.log();

    try {
        // 1. Create test user (simulating webhook behavior)
        console.log("1️⃣ Creating test user...");
        const hashedPassword = await bcrypt.hash("Futurecoach2025", 12);

        const user = await prisma.user.create({
            data: {
                email: TEST_EMAIL.toLowerCase(),
                passwordHash: hashedPassword,
                firstName: TEST_FIRST_NAME,
                lastName: "User",
                role: "STUDENT",
                emailVerified: new Date(),
            },
        });
        console.log(`   ✅ User created: ${user.id}`);

        // 2. Find a course to enroll in
        console.log("2️⃣ Finding course...");
        const course = await prisma.course.findFirst({
            where: { slug: "integrative-health-functional-medicine-mini-diploma" },
        });

        if (!course) {
            console.log("   ⚠️ Mini Diploma not found, trying any course...");
            const anyCourse = await prisma.course.findFirst();
            if (!anyCourse) {
                console.error("   ❌ No courses found!");
                return;
            }
        }

        // 3. Create enrollment
        console.log("3️⃣ Creating enrollment...");
        if (course) {
            await prisma.enrollment.create({
                data: {
                    userId: user.id,
                    courseId: course.id,
                    status: "ACTIVE",
                    progress: 0,
                },
            });
            console.log(`   ✅ Enrolled in: ${course.title}`);
        }

        // 4. Trigger Sarah's welcome DM (THIS IS THE KEY TEST)
        console.log("4️⃣ Triggering Sarah's welcome DM...");
        console.log("   (This includes 2-3 min delay simulation)");

        await triggerAutoMessage({
            userId: user.id,
            trigger: "first_login",
        });
        console.log("   ✅ Sarah DM triggered!");

        // 5. Verify messages were created
        console.log("5️⃣ Checking messages...");

        // Small delay to let async operations complete
        await new Promise(resolve => setTimeout(resolve, 2000));

        const messages = await prisma.message.findMany({
            where: { receiverId: user.id },
            orderBy: { createdAt: "desc" },
            include: {
                sender: { select: { firstName: true, email: true } },
            },
        });

        if (messages.length > 0) {
            console.log(`   ✅ Found ${messages.length} message(s):`);
            for (const msg of messages) {
                console.log(`      From: ${msg.sender?.firstName || "System"}`);
                console.log(`      Type: ${msg.messageType || "text"}`);
                console.log(`      Preview: ${msg.content.substring(0, 100)}...`);
                console.log();
            }
        } else {
            console.log("   ⚠️ No messages found in Message table");
            console.log("      (May be scheduled for later delivery)");
        }

        console.log();
        console.log("=".repeat(60));
        console.log("✅ TEST COMPLETE");
        console.log("=".repeat(60));
        console.log();
        console.log(`You can log in as: ${TEST_EMAIL}`);
        console.log(`Password: Futurecoach2025`);
        console.log();
        console.log("🧹 To clean up, run:");
        console.log(`   DELETE FROM "User" WHERE email = '${TEST_EMAIL.toLowerCase()}';`);

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
