// Seed script for Jessica Parker - DFY Fulfillment Specialist
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🚀 Seeding Jessica Parker (DFY Fulfillment Specialist)...");

    const password = await bcrypt.hash("coach2026", 10);

    const jessica = await prisma.user.upsert({
        where: { email: "jessica@accredipro-certificate.com" },
        update: {
            firstName: "Jessica",
            lastName: "Parker",
            role: "MENTOR",
            isActive: true,
            bio: "I'm your DFY fulfillment specialist! 🎯 I'll handle all the setup so you can focus on helping clients. Let me know if you have any questions!"
        },
        create: {
            email: "jessica@accredipro-certificate.com",
            firstName: "Jessica",
            lastName: "Parker",
            passwordHash: password,
            role: "MENTOR",
            isActive: true,
            bio: "I'm your DFY fulfillment specialist! 🎯 I'll handle all the setup so you can focus on helping clients. Let me know if you have any questions!"
        }
    });

    console.log(`✅ Created/updated Jessica Parker: ${jessica.id}`);
    console.log(`   Email: jessica@accredipro-certificate.com`);
    console.log(`   Role: MENTOR`);

    // Auto-assign all pending DFY purchases to Jessica
    const pendingOrders = await prisma.dFYPurchase.updateMany({
        where: {
            assignedToId: null,
            fulfillmentStatus: "PENDING"
        },
        data: {
            assignedToId: jessica.id
        }
    });

    console.log(`📦 Assigned ${pendingOrders.count} pending DFY orders to Jessica`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
