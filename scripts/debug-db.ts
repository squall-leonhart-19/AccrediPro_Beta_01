
import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("Testing DB connection...");
    try {
        const count = await prisma.user.count();
        console.log(`✅ Connection success. Found ${count} users.`);

        console.log("Testing SalesChat table...");
        try {
            const chat = await prisma.salesChat.findFirst();
            console.log(`✅ Verified SalesChat table (found ${chat ? "records" : "empty table"}).`);
        } catch (e: any) {
            console.error("❌ Schema Mismatch on SalesChat:", e.message);
            if (e.message.includes("does not exist")) {
                console.log("\nThe SalesChat table is missing. You need to run 'npx prisma db push'.");
            }
        }

        console.log("Testing ChatOptin table...");
        try {
            const optin = await prisma.chatOptin.findFirst();
            console.log(`✅ Verified ChatOptin table (found ${optin ? "records" : "empty table"}).`);
        } catch (e: any) {
            console.error("❌ Schema Mismatch on ChatOptin:", e.message);
        }

    } catch (e: any) {
        console.error("❌ DB Connection Failed:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
