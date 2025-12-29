
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = "blablarog1234@gmail.com";
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return console.log("User not found");

    console.log("Checking messages for:", user.id);

    const messages = await prisma.message.findMany({
        where: {
            OR: [
                { receiverId: user.id },
                { senderId: user.id }
            ]
        },
        include: { sender: true }
    });

    console.log("Found Messages:", messages.length);
    messages.forEach(m => console.log(`[${m.createdAt.toISOString()}] From: ${m.sender?.firstName}: ${m.content.substring(0, 50)}...`));

    console.log("Checking Scheduled Messages...");
    const scheduled = await prisma.scheduledVoiceMessage.findMany({
        where: { receiverId: user.id }
    });
    console.log("Found Scheduled:", scheduled.length);
    scheduled.forEach(s => console.log(`[${s.status}] Scheduled For: ${s.scheduledFor.toISOString()}`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
