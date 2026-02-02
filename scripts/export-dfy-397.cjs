#!/usr/bin/env node
/**
 * Export all DFY purchases at $397 to CSV
 *
 * Usage: node scripts/export-dfy-397.cjs
 *
 * Connects to the database via Prisma, finds all DFYPurchase records
 * where purchasePrice = 397, includes user + product info, checks
 * if Jessica sent a DM to each customer, and writes a CSV.
 */

const fs = require('fs');
const path = require('path');

// Load .env.local manually since dotenv may not pick it up by default
const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function main() {
  // Prisma 7 with PrismaPg driver adapter
  const { PrismaClient } = require('@prisma/client');
  const { PrismaPg } = require('@prisma/adapter-pg');

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('ERROR: DATABASE_URL not found. Make sure .env.local exists.');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    // 1. Find Jessica's user ID by email
    const jessica = await prisma.user.findUnique({
      where: { email: 'jessica@accredipro-certificate.com' },
      select: { id: true },
    });

    const jessicaId = jessica ? jessica.id : null;
    if (!jessicaId) {
      console.warn('WARNING: Jessica user not found (jessica@accredipro-certificate.com). "Jessica DM Sent" column will all be "No".');
    } else {
      console.log(`Found Jessica's account (ID: ${jessicaId})`);
    }

    // 2. Fetch all DFYPurchase records at $397
    //    purchasePrice is Decimal(10,2) - Prisma returns it as a Decimal object.
    //    We query for the exact decimal value 397.00.
    const purchases = await prisma.dFYPurchase.findMany({
      where: {
        purchasePrice: 397,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        product: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`Found ${purchases.length} purchases at $397`);

    if (purchases.length === 0) {
      console.log('No purchases found. CSV will contain only headers.');
    }

    // 3. For each purchase, check if Jessica sent a DM to the customer
    //    Batch this by collecting all user IDs, then querying messages once
    const userIds = [...new Set(purchases.map(p => p.userId))];

    const jessicaDMs = new Set();
    if (jessicaId && userIds.length > 0) {
      const messages = await prisma.message.findMany({
        where: {
          senderId: jessicaId,
          receiverId: { in: userIds },
        },
        select: {
          receiverId: true,
        },
        distinct: ['receiverId'],
      });
      for (const msg of messages) {
        jessicaDMs.add(msg.receiverId);
      }
      console.log(`Jessica has sent DMs to ${jessicaDMs.size} of ${userIds.length} customers`);
    }

    // 4. Build CSV rows
    const csvHeaders = [
      'Order ID',
      'Purchase Date',
      'Customer Email',
      'First Name',
      'Last Name',
      'Product',
      'Amount',
      'Fulfillment Status',
      'Intake Submitted',
      'Jessica DM Sent',
      'Notes',
    ];

    const csvRows = purchases.map(p => {
      const orderId = p.id;
      const purchaseDate = p.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
      const email = p.user?.email || '';
      const firstName = p.user?.firstName || '';
      const lastName = p.user?.lastName || '';
      const product = p.product?.title || '';
      // purchasePrice is a Prisma Decimal - convert to string/number
      const amount = parseFloat(p.purchasePrice.toString()).toFixed(2);
      const fulfillmentStatus = p.fulfillmentStatus || '';
      const intakeSubmitted = p.intakeData ? 'Yes' : 'No';
      const jessicaDMSent = jessicaDMs.has(p.userId) ? 'Yes' : 'No';
      const notes = p.notes || '';

      return [
        orderId,
        purchaseDate,
        email,
        firstName,
        lastName,
        product,
        amount,
        fulfillmentStatus,
        intakeSubmitted,
        jessicaDMSent,
        notes,
      ];
    });

    // 5. Write CSV file
    const escapeCsvField = (field) => {
      const str = String(field);
      // Escape fields that contain commas, quotes, or newlines
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

    const csvContent = [
      csvHeaders.map(escapeCsvField).join(','),
      ...csvRows.map(row => row.map(escapeCsvField).join(',')),
    ].join('\n');

    const outputPath = path.resolve(__dirname, 'dfy-397-purchases.csv');
    fs.writeFileSync(outputPath, csvContent, 'utf8');

    console.log(`\nCSV exported successfully to: ${outputPath}`);
    console.log(`Total rows: ${purchases.length}`);

    // Print a quick summary
    const statusCounts = {};
    for (const p of purchases) {
      const status = p.fulfillmentStatus || 'UNKNOWN';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    }
    console.log('\nFulfillment Status Breakdown:');
    for (const [status, count] of Object.entries(statusCounts)) {
      console.log(`  ${status}: ${count}`);
    }

    const intakeCount = purchases.filter(p => p.intakeData).length;
    console.log(`\nIntake Submitted: ${intakeCount} / ${purchases.length}`);
    console.log(`Jessica DMs Sent: ${jessicaDMs.size} / ${userIds.length} unique customers`);

  } catch (error) {
    console.error('Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\nDatabase connection closed.');
  }
}

main();
