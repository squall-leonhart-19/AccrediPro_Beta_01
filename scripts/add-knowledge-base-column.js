// scripts/add-knowledge-base-column.js
// Run with: node scripts/add-knowledge-base-column.js

const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function main() {
    // Use the direct URL for schema changes
    const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

    if (!connectionString) {
        console.error('No database connection string found!');
        process.exit(1);
    }

    console.log('Connecting to database...');

    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log('Connected!');

        // Check if column exists
        const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      AND column_name = 'knowledgeBase'
    `);

        if (checkResult.rows.length > 0) {
            console.log('Column "knowledgeBase" already exists.');
        } else {
            console.log('Adding "knowledgeBase" column...');
            await client.query(`
        ALTER TABLE "User" 
        ADD COLUMN "knowledgeBase" TEXT
      `);
            console.log('Column "knowledgeBase" added successfully!');
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await client.end();
        console.log('Done.');
    }
}

main();
