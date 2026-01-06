
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

async function checkRecentUsers() {
    console.log('=== CHECKING RECENT USERS TOS & REGISTRATION DATA ===\n');

    // Find users created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const users = await prisma.user.findMany({
        where: {
            createdAt: { gte: today }
        },
        select: {
            id: true,
            email: true,
            createdAt: true,
            firstLoginAt: true,
            lastLoginAt: true,
            loginCount: true,
            tosAcceptedAt: true,
            tosVersion: true,
            registrationIp: true,
            registrationUserAgent: true,
            registrationDevice: true,
            registrationBrowser: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10
    });

    for (const user of users) {
        console.log(`\n📧 ${user.email}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log(`   First Login: ${user.firstLoginAt || 'Never'}`);
        console.log(`   Login Count: ${user.loginCount}`);
        console.log(`   TOS Accepted: ${user.tosAcceptedAt || '❌ MISSING'}`);
        console.log(`   TOS Version: ${user.tosVersion || '❌ MISSING'}`);
        console.log(`   Registration IP: ${user.registrationIp || '❌ MISSING'}`);
        console.log(`   Registration UA: ${user.registrationUserAgent ? '✅ Present' : '❌ MISSING'}`);
        console.log(`   Registration Device: ${user.registrationDevice || '❌ MISSING'}`);
    }
}

checkRecentUsers()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
