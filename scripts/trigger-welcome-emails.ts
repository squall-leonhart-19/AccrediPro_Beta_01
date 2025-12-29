
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { sendWelcomeEmail, sendCourseEnrollmentEmail } from "@/lib/email";
import { triggerAutoMessage } from "@/lib/auto-messages";
import path from "path";
import dotenv from "dotenv";

// Load config.env from tools/course-generator
dotenv.config({ path: path.resolve(process.cwd(), "tools/course-generator/config.env") });
// Also try .env in root just in case
dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = "blablarog1234@gmail.com";
    console.log(`Triggering welcome sequence for: ${email}`);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.error("User not found!");
        return;
    }

    /* Emails disabled due to missing local API Key
    // 1. Send Welcome Email
    console.log("Sending Welcome Email...");
    await sendWelcomeEmail(user.email, user.firstName || "Student");
    console.log("✅ Welcome Email Sent");

    // 2. Send Enrollment Email (Verification of Enrollments)
    console.log("Sending Enrollment Email...");
    await sendCourseEnrollmentEmail(
        user.email,
        user.firstName || "Student",
        "Certified Functional Medicine Practitioner",
        "functional-medicine-complete-certification"
    );
    console.log("✅ Enrollment Email Sent");
    */
    console.log("⚠️ Skipped Emails (Missing API Key locally)");

    // 3. Trigger Welcome DM (Simulate First Login)
    console.log("Triggering Welcome DM (First Login)...");
    await triggerAutoMessage({
        userId: user.id,
        trigger: "first_login"
    });
    console.log("✅ Welcome DM Triggered");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
