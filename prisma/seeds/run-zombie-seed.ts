import prisma from "../../src/lib/prisma";
import { seedZombieChatTemplates } from "./zombie-chat-templates";

async function main() {
    console.log("🚀 Running zombie chat seed...\n");

    const count = await seedZombieChatTemplates(prisma);

    console.log(`\n🎉 Done! ${count} templates ready for zombie chat.`);
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
