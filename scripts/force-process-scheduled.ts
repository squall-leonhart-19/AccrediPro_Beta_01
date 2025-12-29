
import { processScheduledMessages } from "@/lib/auto-messages";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import path from "path";
import dotenv from "dotenv";

// Load config.env
dotenv.config({ path: path.resolve(process.cwd(), "tools/course-generator/config.env") });
// Also try .env in root just in case
dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Forcing process of scheduled messages...");
    try {
        await processScheduledMessages();
        console.log("✅ Processed.");
    } catch (e) {
        console.error("Error processing:", e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
