
import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("Testing DB connection...");
    try {
        // 1. Test basic query
        const count = await prisma.user.count();
        console.log(`✅ Connection success. Found ${count} users.`);

        // 2. Test new columns
        console.log("Testing SupportTicket columns...");
        try {
            // Just try to select the new fields from the first ticket found
            const ticket = await prisma.supportTicket.findFirst({
                select: {
                    id: true,
                    rating: true,
                    ratingComment: true,
                    ratedAt: true
                }
            });
            console.log("✅ Verified SupportTicket schema columns (rating, ratingComment, ratedAt).");
        } catch (e: any) {
            console.error("❌ Schema Mismatch on SupportTicket:", e.message);
            if (e.message.includes("column") || e.message.includes("does not exist")) {
                console.log("\nRECOMMENDATION: The database migration did not complete. Try running the manual SQL script.");
            }
        }

    } catch (e: any) {
        console.error("❌ DB Connection Failed:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
