/**
 * Send Sample Emails
 * 
 * Sends all purchase-related emails to test the templates:
 * 1. Welcome Email
 * 2. Course Enrollment Email (Holistic Nutrition)
 * 3. Pro Accelerator VIP Email (HN niche)
 * 
 * Usage: npx tsx scripts/send-sample-emails.ts
 */

import path from "path";
import dotenv from "dotenv";

// Load config.env for Resend API key
dotenv.config({ path: path.resolve(process.cwd(), "tools/course-generator/config.env") });
dotenv.config(); // Also load .env

async function main() {
    const TEST_EMAIL = "blablarog1234@gmail.com";
    const TEST_FIRST_NAME = "Blabla";
    const COURSE_NAME = "Certified Holistic Nutrition Coach™";
    const COURSE_SLUG = "holistic-nutrition-coach-certification";

    console.log("=".repeat(60));
    console.log("📧 SENDING SAMPLE EMAILS (FIXED)");
    console.log("=".repeat(60));
    console.log(`To: ${TEST_EMAIL}`);
    console.log();

    // Import email functions (lazy to avoid init issues)
    const {
        sendWelcomeEmail,
        sendCourseEnrollmentEmail,
        sendProAcceleratorEnrollmentEmail
    } = await import("../src/lib/email");

    // 1. Welcome Email
    console.log("1️⃣  Sending Welcome Email...");
    try {
        const result = await sendWelcomeEmail(TEST_EMAIL, TEST_FIRST_NAME);
        console.log(`   ${result.success ? "✅ Sent!" : "❌ Failed: " + result.error}`);
    } catch (e) {
        console.log(`   ❌ Error: ${e}`);
    }

    // Small delay between emails
    await new Promise(r => setTimeout(r, 1000));

    // 2. Course Enrollment Email
    console.log("2️⃣  Sending Enrollment Email (Holistic Nutrition)...");
    try {
        const result = await sendCourseEnrollmentEmail(TEST_EMAIL, TEST_FIRST_NAME, COURSE_NAME, COURSE_SLUG);
        console.log(`   ${result.success ? "✅ Sent!" : "❌ Failed: " + result.error}`);
    } catch (e) {
        console.log(`   ❌ Error: ${e}`);
    }

    await new Promise(r => setTimeout(r, 1000));

    // 3. Pro Accelerator VIP Email (HN niche)
    console.log("3️⃣  Sending HN Pro Accelerator VIP Email...");
    try {
        const result = await sendProAcceleratorEnrollmentEmail(TEST_EMAIL, TEST_FIRST_NAME, "HN");
        console.log(`   ${result.success ? "✅ Sent!" : "❌ Failed: " + result.error}`);
    } catch (e) {
        console.log(`   ❌ Error: ${e}`);
    }

    console.log();
    console.log("=".repeat(60));
    console.log("📬 CHECK YOUR INBOX!");
    console.log("=".repeat(60));
    console.log();
    console.log("You should receive 3 FIXED emails:");
    console.log("  1. Welcome - Now says 'Professional Certification Excellence'");
    console.log("  2. Enrollment - No more 'video lessons' claim");
    console.log("  3. VIP - Now says 'Holistic Nutrition Pro Accelerator'");
    console.log();
}

main().catch(console.error);
