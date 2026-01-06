
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Fix for Prisma 6/7 adapter behavior in scripts
// We need to bypass the adapter if we can't easily polyfill the Pool in this script context,
// BUT since the schema is configured for it, we must match it.
// Simpler: Just rely on DATABASE_URL and the direct connection if possible,
// but src/lib/prisma.ts uses PrismaPg.
// Let's try to mimic src/lib/prisma.ts exactly.

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkUserActivity() {
    const email = 'nurselife19@yahoo.com';
    console.log(`Checking activity for: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            loginHistory: {
                orderBy: { createdAt: 'desc' },
                take: 5
            },
            enrollments: true,
        }
    });

    if (!user) {
        console.log('User not found!');
        return;
    }

    console.log('User Record:');
    console.log(`- ID: ${user.id}`);
    console.log(`- CreatedAt: ${user.createdAt}`);
    console.log(`- LastLoginAt: ${user.lastLoginAt}`);
    console.log(`- RegistrationIP: ${user.registrationIp}`);
    console.log(`- TOS Accepted: ${user.tosAcceptedAt}`);

    console.log('\nLogin History:');
    if (user.loginHistory.length === 0) {
        console.log('- No login history records found.');
    } else {
        user.loginHistory.forEach(log => {
            console.log(`- ${log.createdAt}: IP=${log.ipAddress}, Device=${log.device}`);
        });
    }

    console.log('\nEnrollments:');
    console.log(user.enrollments.length > 0 ? user.enrollments : 'No enrollments found.');
}

checkUserActivity()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
