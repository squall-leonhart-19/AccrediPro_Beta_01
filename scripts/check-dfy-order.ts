import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function checkPayments() {
    // Check all payments for this user
    const payments = await prisma.payment.findMany({
        where: { userId: "cml29ncoq000004lahnwr0rxx" },
        orderBy: { createdAt: "desc" },
    });

    console.log("All payments for jferdinando@yahoo.com:\n");
    for (const p of payments) {
        console.log(`ID: ${p.id}`);
        console.log(`  Product Name: ${p.productName}`);
        console.log(`  Product SKU: ${p.productSku}`);
        console.log(`  Amount: $${p.amount}`);
        console.log(`  Created: ${p.createdAt}`);
        console.log("---");
    }

    // Check tags
    const tags = await prisma.userTag.findMany({
        where: { userId: "cml29ncoq000004lahnwr0rxx" },
    });

    console.log("\nUser Tags:");
    for (const t of tags) {
        console.log(`  - ${t.tag}`);
    }
}

checkPayments()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
