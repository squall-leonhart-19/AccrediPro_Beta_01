/**
 * One-Time Bulk Email Verification Script
 * 
 * Verifies all enrolled user emails with NeverBounce and auto-suppresses invalid ones.
 * 
 * Usage: npx tsx scripts/verify-enrolled-emails.ts
 * 
 * Cost estimate: ~$8-15 for 1,650 emails
 * Time estimate: ~10-15 minutes (rate limited to avoid API throttling)
 */

import { prisma } from "../src/lib/prisma";

// NeverBounce API configuration
const NEVERBOUNCE_API_KEY = process.env.NEVERBOUNCE_API_KEY;
const RATE_LIMIT_MS = 150; // 150ms between requests = ~6-7/second (safe rate)

interface VerificationResult {
    email: string;
    result: string;
    isValid: boolean;
}

async function verifyEmailWithNeverBounce(email: string): Promise<VerificationResult> {
    try {
        const response = await fetch(
            `https://api.neverbounce.com/v4/single/check?key=${NEVERBOUNCE_API_KEY}&email=${encodeURIComponent(email)}`
        );

        const data = await response.json();

        // Result codes: 0=valid, 1=invalid, 2=disposable, 3=catchall, 4=unknown
        const resultMap: Record<number, string> = {
            0: "valid",
            1: "invalid",
            2: "disposable",
            3: "catchall",
            4: "unknown",
        };

        const result = resultMap[data.result] || "unknown";
        const isValid = ["valid", "catchall", "unknown"].includes(result);

        return { email, result, isValid };
    } catch (error) {
        console.error(`Error verifying ${email}:`, error);
        return { email, result: "error", isValid: true }; // Allow on error
    }
}

async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log("🔍 Bulk Email Verification Script");
    console.log("==================================\n");

    if (!NEVERBOUNCE_API_KEY) {
        console.error("❌ NEVERBOUNCE_API_KEY not set in environment");
        process.exit(1);
    }

    // Get all enrolled users
    console.log("📊 Fetching enrolled users...");

    const enrollments = await prisma.enrollment.findMany({
        where: { status: "ACTIVE" },
        select: { userId: true },
        distinct: ["userId"],
    });

    const userIds = enrollments.map(e => e.userId);

    const users = await prisma.user.findMany({
        where: {
            id: { in: userIds },
            isActive: true,
            isFakeProfile: false,
            email: { not: null },
        },
        select: { id: true, email: true, firstName: true },
    });

    console.log(`📧 Found ${users.length} enrolled users with emails\n`);

    // Get suppress_bounced tag
    const suppressTag = await prisma.marketingTag.findUnique({
        where: { slug: "suppress_bounced" },
    });

    if (!suppressTag) {
        console.error("❌ suppress_bounced tag not found in database");
        process.exit(1);
    }

    // Track results
    const results = {
        valid: 0,
        invalid: 0,
        disposable: 0,
        catchall: 0,
        unknown: 0,
        error: 0,
        alreadySuppressed: 0,
    };

    const invalidEmails: string[] = [];
    const disposableEmails: string[] = [];

    console.log("🚀 Starting verification (this will take ~10-15 minutes)...\n");

    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const email = user.email!;

        // Progress indicator
        if ((i + 1) % 50 === 0 || i === 0) {
            console.log(`Progress: ${i + 1}/${users.length} (${Math.round((i + 1) / users.length * 100)}%)`);
        }

        // Verify email
        const verification = await verifyEmailWithNeverBounce(email);

        // Update counts
        results[verification.result as keyof typeof results]++;

        // Handle invalid/disposable
        if (verification.result === "invalid") {
            invalidEmails.push(email);

            // Add suppression tag
            await prisma.userMarketingTag.upsert({
                where: { userId_tagId: { userId: user.id, tagId: suppressTag.id } },
                create: { userId: user.id, tagId: suppressTag.id, source: "neverbounce_bulk_verification" },
                update: { source: "neverbounce_bulk_verification" },
            });

            console.log(`  ❌ INVALID: ${email}`);
        } else if (verification.result === "disposable") {
            disposableEmails.push(email);

            // Add suppression tag
            await prisma.userMarketingTag.upsert({
                where: { userId_tagId: { userId: user.id, tagId: suppressTag.id } },
                create: { userId: user.id, tagId: suppressTag.id, source: "neverbounce_disposable" },
                update: { source: "neverbounce_disposable" },
            });

            console.log(`  🗑️ DISPOSABLE: ${email}`);
        }

        // Rate limit
        await sleep(RATE_LIMIT_MS);
    }

    // Summary
    console.log("\n==================================");
    console.log("📊 VERIFICATION COMPLETE");
    console.log("==================================\n");

    console.log(`✅ Valid:      ${results.valid}`);
    console.log(`⚠️  Catchall:   ${results.catchall}`);
    console.log(`❓ Unknown:    ${results.unknown}`);
    console.log(`❌ Invalid:    ${results.invalid}`);
    console.log(`🗑️  Disposable: ${results.disposable}`);
    console.log(`⚡ Errors:     ${results.error}`);

    console.log("\n----------------------------------");
    console.log(`TOTAL CHECKED: ${users.length}`);
    console.log(`SUPPRESSED:    ${results.invalid + results.disposable}`);
    console.log(`SAFE TO SEND:  ${results.valid + results.catchall + results.unknown}`);

    if (invalidEmails.length > 0) {
        console.log("\n❌ Invalid emails suppressed:");
        invalidEmails.forEach(e => console.log(`   - ${e}`));
    }

    if (disposableEmails.length > 0) {
        console.log("\n🗑️ Disposable emails suppressed:");
        disposableEmails.forEach(e => console.log(`   - ${e}`));
    }

    console.log("\n✅ Done! Invalid emails have been auto-suppressed.");

    await prisma.$disconnect();
}

main().catch(console.error);
