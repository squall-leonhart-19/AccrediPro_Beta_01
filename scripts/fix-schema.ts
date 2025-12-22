import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("Running migration to add ticket rating columns...");

    try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "SupportTicket" ADD COLUMN IF NOT EXISTS "rating" INTEGER`);
        console.log("✅ Added rating column");
    } catch (e: any) {
        if (e.message?.includes("already exists")) {
            console.log("ℹ️ rating column already exists");
        } else {
            console.error("Error adding rating:", e.message);
        }
    }

    try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "SupportTicket" ADD COLUMN IF NOT EXISTS "ratingComment" TEXT`);
        console.log("✅ Added ratingComment column");
    } catch (e: any) {
        if (e.message?.includes("already exists")) {
            console.log("ℹ️ ratingComment column already exists");
        } else {
            console.error("Error adding ratingComment:", e.message);
        }
    }

    try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "SupportTicket" ADD COLUMN IF NOT EXISTS "ratedAt" TIMESTAMP(3)`);
        console.log("✅ Added ratedAt column");
    } catch (e: any) {
        if (e.message?.includes("already exists")) {
            console.log("ℹ️ ratedAt column already exists");
        } else {
            console.error("Error adding ratedAt:", e.message);
        }
    }

    console.log("\n🎉 Migration complete!");
    await prisma.$disconnect();
}

main();
