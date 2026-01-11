import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import path from 'path';

// Load env vars explicitly
config({ path: path.resolve(__dirname, '../.env.local') });
config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

const EMAILS = [
    "sarah@accredipro-certificate.com",
    "olivia@accredipro-certificate.com",
    "marcus@accredipro-certificate.com",
    "luna@accredipro-certificate.com",
    "sage@accredipro-certificate.com",
    "maya@accredipro-certificate.com",
    "bella@accredipro-certificate.com",
    "emma@accredipro-certificate.com",
    "grace@accredipro-certificate.com",
    "david@accredipro-certificate.com",
    "sarah_womenhealth@accredipro-certificate.com"
];

async function main() {
    try {
        console.log('Checking for persona users...');
        const users = await prisma.user.findMany({
            where: { email: { in: EMAILS } },
            select: { email: true, id: true, firstName: true }
        });

        console.log('Found users:', users);

        const missing = EMAILS.filter(e => !users.find(u => u.email === e));
        console.log('Missing users:', missing);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
