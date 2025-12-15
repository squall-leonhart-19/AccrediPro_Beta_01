
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Fix env loading
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const prisma = new PrismaClient();

async function main() {
    try {
        const targetId = "cmj4zilaz0001ln6vsnlkeoxd"; // User provided ID

        // Find the target user
        const zombie = await prisma.user.findUnique({
            where: { id: targetId },
            select: { id: true, email: true, name: true, firstName: true, lastName: true, avatar: true, createdAt: true, isFakeProfile: true }
        });

        console.log("=== TARGET ZOMBIE USER ===");
        console.log(JSON.stringify(zombie, null, 2));

        // Find users created around the same time or with similar email/avatar patterns
        if (zombie) {
            const similar = await prisma.user.findMany({
                where: {
                    createdAt: {
                        gte: new Date(zombie.createdAt.getTime() - 1000 * 60 * 60 * 24), // 24 hours window
                        lte: new Date(zombie.createdAt.getTime() + 1000 * 60 * 60 * 24)
                    }
                },
                take: 10,
                select: { id: true, email: true, firstName: true, avatar: true }
            });
            console.log("\n=== SIMILAR USERS (Time Window) ===");
            console.log(similar);
        }

        // Count potential cleanup targets
        const total = await prisma.user.count();
        console.log(`\nTotal Users: ${total}`);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
