import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import path from 'path';

// Load env vars explicitly
config({ path: path.resolve(__dirname, '../.env.local') });
config({ path: path.resolve(__dirname, '../.env') });

const url = process.env.DATABASE_URL;
if (url) {
    console.log('Using DATABASE_URL from process.env (len ' + url.length + ')');
    // Ensure it's set for Prisma
    process.env.DATABASE_URL = url;
} else {
    console.error('DATABASE_URL is missing!');
    process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Cleaning orphaned SalesChat records...');
        const result = await prisma.$executeRawUnsafe(`
      DELETE FROM "SalesChat" 
      WHERE "repliedBy" IS NOT NULL 
      AND "repliedBy" NOT IN (SELECT "id" FROM "User");
    `);
        console.log(`Deleted ${result} orphaned records.`);
    } catch (error) {
        console.error('Error cleaning data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
