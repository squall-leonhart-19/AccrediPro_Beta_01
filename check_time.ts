
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkTimeData() {
    // Check the user mentioned (created 11:26 PM)
    const user = await prisma.user.findFirst({
        where: { email: 'bpbunn1982.bb@gmail.com' },
        select: { id: true, email: true }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    console.log(`Checking time data for: ${user.email}`);

    // Get lesson progress with time data
    const lessonProgress = await prisma.lessonProgress.findMany({
        where: { userId: user.id },
        select: {
            watchTime: true,
            timeSpent: true,
            isCompleted: true,
            lesson: { select: { title: true } }
        }
    });

    console.log('\nLesson Progress:');
    let totalWatch = 0;
    let totalTime = 0;
    for (const lp of lessonProgress) {
        console.log(`- ${lp.lesson.title}: watchTime=${lp.watchTime || 0}s, timeSpent=${lp.timeSpent || 0}s, completed=${lp.isCompleted}`);
        totalWatch += lp.watchTime || 0;
        totalTime += lp.timeSpent || 0;
    }
    console.log(`\nTotal watchTime: ${totalWatch}s (${Math.round(totalWatch / 60)}min)`);
    console.log(`Total timeSpent: ${totalTime}s (${Math.round(totalTime / 60)}min)`);

    // Check messages
    const messageCount = await prisma.message.count({
        where: {
            OR: [
                { senderId: user.id },
                { receiverId: user.id }
            ]
        }
    });
    console.log(`\nPrivate messages: ${messageCount}`);
}

checkTimeData()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
