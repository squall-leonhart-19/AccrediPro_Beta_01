/**
 * FULL REAL WEBHOOK TEST
 * 
 * Simulates the complete ClickFunnels purchase flow for a real email:
 * - Creates/resets user with standard password
 * - Enrolls in FM courses (Core + Pro Accelerator bundle)
 * - Applies all product tags
 * - Sends Welcome Email + Enrollment Email (if API key available)
 * - Triggers Sarah's Welcome DM (with voice note)
 * 
 * Usage: npx tsx scripts/test-full-real-purchase.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import path from "path";
import dotenv from "dotenv";

// Load config.env for API keys (Resend, ElevenLabs, Supabase)
dotenv.config({ path: path.resolve(process.cwd(), "tools/course-generator/config.env") });
dotenv.config(); // Also load .env

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ========================================
// TEST CONFIGURATION
// ========================================
const TEST_EMAIL = "blablarog1234@gmail.com";
const TEST_FIRST_NAME = "Blabla";
const TEST_LAST_NAME = "Rog";
const STANDARD_PASSWORD = "Futurecoach2025";

// Tags to apply (Pro Accelerator bundle)
const TAGS_TO_APPLY = [
    "functional_medicine_complete_certification_purchased",
    "fm_pro_advanced_clinical_purchased",
    "fm_pro_master_depth_purchased",
    "fm_pro_practice_path_purchased",
    "clickfunnels_purchase",
];

// Courses to enroll (Pro Accelerator bundle)
const COURSES_TO_ENROLL = [
    "functional-medicine-complete-certification",
    "fm-pro-advanced-clinical",
    "fm-pro-master-depth",
    "fm-pro-practice-path",
];

async function main() {
    console.log("=".repeat(70));
    console.log("🎯 FULL REAL PURCHASE SIMULATION");
    console.log("=".repeat(70));
    console.log(`Email: ${TEST_EMAIL}`);
    console.log(`Product: FM Pro Accelerator Bundle`);
    console.log();

    // Check for API keys
    const hasResendKey = !!process.env.RESEND_API_KEY;
    console.log(`📧 Resend API Key: ${hasResendKey ? "✅ Available" : "❌ Missing (emails will be skipped)"}`);
    console.log();

    try {
        // ========================================
        // 1. DELETE EXISTING USER (FRESH START)
        // ========================================
        console.log("1️⃣  Cleaning up existing user (if any)...");

        const existingUser = await prisma.user.findUnique({
            where: { email: TEST_EMAIL.toLowerCase() },
        });

        if (existingUser) {
            // Delete related records first
            await prisma.message.deleteMany({ where: { OR: [{ senderId: existingUser.id }, { receiverId: existingUser.id }] } });
            await prisma.userTag.deleteMany({ where: { userId: existingUser.id } });
            await prisma.enrollment.deleteMany({ where: { userId: existingUser.id } });
            await prisma.user.delete({ where: { id: existingUser.id } });
            console.log("   ✅ Deleted existing user and related records");
        } else {
            console.log("   ℹ️  No existing user found");
        }

        // ========================================
        // 2. CREATE NEW USER
        // ========================================
        console.log("2️⃣  Creating new user...");
        const hashedPassword = await bcrypt.hash(STANDARD_PASSWORD, 12);

        const user = await prisma.user.create({
            data: {
                email: TEST_EMAIL.toLowerCase(),
                passwordHash: hashedPassword,
                firstName: TEST_FIRST_NAME,
                lastName: TEST_LAST_NAME,
                role: "STUDENT",
                emailVerified: new Date(),
            },
        });
        console.log(`   ✅ User created: ${user.id}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🔑 Password: ${STANDARD_PASSWORD}`);

        // ========================================
        // 3. ENROLL IN COURSES
        // ========================================
        console.log("3️⃣  Enrolling in courses...");

        let primaryCourse = null;
        for (const slug of COURSES_TO_ENROLL) {
            const course = await prisma.course.findFirst({
                where: { slug },
            });

            if (course) {
                await prisma.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: course.id,
                        status: "ACTIVE",
                        progress: 0,
                    },
                });
                console.log(`   ✅ Enrolled: ${course.title}`);
                if (!primaryCourse) primaryCourse = course;
            } else {
                console.log(`   ⚠️  Course not found: ${slug}`);
            }
        }

        // ========================================
        // 4. APPLY TAGS
        // ========================================
        console.log("4️⃣  Applying product tags...");

        for (const tag of TAGS_TO_APPLY) {
            await prisma.userTag.create({
                data: { userId: user.id, tag },
            });
            console.log(`   ✅ Tag: ${tag}`);
        }

        // ========================================
        // 5. SEND EMAILS (if API key available)
        // ========================================
        if (hasResendKey) {
            console.log("5️⃣  Sending Welcome Email...");
            try {
                const { sendWelcomeEmail } = await import("../src/lib/email");
                const emailResult = await sendWelcomeEmail(TEST_EMAIL, TEST_FIRST_NAME);
                if (emailResult.success) {
                    console.log("   ✅ Welcome Email SENT!");
                } else {
                    console.log(`   ❌ Email failed: ${emailResult.error}`);
                }
            } catch (emailError) {
                console.log(`   ⚠️  Email error: ${emailError}`);
            }

            console.log("6️⃣  Sending Enrollment Confirmation Email...");
            if (primaryCourse) {
                try {
                    const { sendCourseEnrollmentEmail } = await import("../src/lib/email");
                    const enrollResult = await sendCourseEnrollmentEmail(
                        TEST_EMAIL,
                        TEST_FIRST_NAME,
                        primaryCourse.title,
                        primaryCourse.slug
                    );
                    if (enrollResult.success) {
                        console.log("   ✅ Enrollment Email SENT!");
                    } else {
                        console.log(`   ❌ Enrollment email failed: ${enrollResult.error}`);
                    }
                } catch (emailError) {
                    console.log(`   ⚠️  Email error: ${emailError}`);
                }
            }
        } else {
            console.log("5️⃣  Skipping emails (no RESEND_API_KEY)");
            console.log("6️⃣  Skipping enrollment email (no RESEND_API_KEY)");
        }

        // ========================================
        // 7. TRIGGER SARAH'S WELCOME DM
        // ========================================
        console.log("7️⃣  Triggering Sarah's Welcome DM (with voice note)...");
        try {
            const { triggerAutoMessage } = await import("../src/lib/auto-messages");
            await triggerAutoMessage({
                userId: user.id,
                trigger: "first_login",
            });
            console.log("   ✅ Sarah's DM scheduled! (2-3 min delay)");
        } catch (dmError) {
            console.log(`   ⚠️  DM error: ${dmError}`);
        }

        // ========================================
        // SUMMARY
        // ========================================
        console.log();
        console.log("=".repeat(70));
        console.log("🎉 TEST COMPLETE!");
        console.log("=".repeat(70));
        console.log();
        console.log("📋 Summary:");
        console.log(`   • User: ${TEST_EMAIL}`);
        console.log(`   • Password: ${STANDARD_PASSWORD}`);
        console.log(`   • Enrollments: ${COURSES_TO_ENROLL.length} courses`);
        console.log(`   • Tags: ${TAGS_TO_APPLY.length} applied`);
        console.log();
        console.log("📬 What to check:");
        if (hasResendKey) {
            console.log("   1. Check your email inbox for Welcome + Enrollment emails");
        }
        console.log("   2. Log into https://sarah.accredipro.academy");
        console.log("   3. Go to /messages to see Sarah's welcome DM (after 2-3 min)");
        console.log();

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
