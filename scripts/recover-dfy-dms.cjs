#!/usr/bin/env node
/**
 * Recover missing Jessica DMs and DFY welcome emails for Jan 31 customers
 *
 * Usage: node scripts/recover-dfy-dms.cjs
 *
 * This script:
 * 1. Finds Jessica's user account
 * 2. Finds all DFYPurchase records (with user + product)
 * 3. Checks which customers are MISSING Jessica's intake DM
 * 4. Creates the missing DM Message records
 * 5. Sends welcome emails via Resend REST API
 * 6. Creates UserTag "dfy_welcome_email_sent" for each emailed user
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ============================================
// 1. Load .env.local manually
// ============================================
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
} else {
  console.error('ERROR: .env.local not found at', envPath);
  process.exit(1);
}

// ============================================
// 2. Resend email helper (raw REST API)
// ============================================
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'AccrediPro Academy <support@accredipro-certificate.com>';
const BASE_URL = process.env.SITE_URL || 'https://learn.accredipro.academy';
const LOGO_URL = 'https://assets.accredipro.academy/fm-certification/Senza-titolo-Logo-1.png';

if (!RESEND_API_KEY) {
  console.error('ERROR: RESEND_API_KEY not found in .env.local');
  process.exit(1);
}

function sendResendEmail({ to, subject, html }) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    });

    const options = {
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`Resend API error ${res.statusCode}: ${data}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse Resend response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function buildWelcomeEmailHtml({ firstName, productName, intakeUrl }) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Your DFY Package</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); padding: 30px; text-align: center;">
        <img src="${LOGO_URL}" alt="AccrediPro Academy" style="height: 50px; margin-bottom: 10px;" />
      </div>

      <!-- Content -->
      <div style="padding: 40px 30px;">
        <h2 style="color: #722F37; margin-top: 0; font-size: 24px;">Your Done-For-You Package is Confirmed! &#127881;</h2>

        <p style="color: #555; font-size: 16px;">Hey ${firstName}!</p>

        <p style="color: #555; font-size: 16px;">I'm <strong>Jessica</strong>, your DFY fulfillment specialist at AccrediPro. I just saw your order come through &mdash; and I'm excited to start working on your website!</p>

        <!-- Product highlight -->
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #22c55e; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #722F37; font-weight: bold;">YOUR PACKAGE</p>
          <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #722F37;">${productName}</p>
        </div>

        <p style="color: #555; font-size: 16px;"><strong>What happens next:</strong></p>
        <ol style="color: #555; font-size: 15px; padding-left: 20px;">
          <li style="margin: 10px 0;">Fill out the quick intake form below (takes ~15 mins)</li>
          <li style="margin: 10px 0;">I'll start working on your website right away</li>
          <li style="margin: 10px 0;">You'll receive your completed website within <strong>7 days</strong></li>
        </ol>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${intakeUrl}" style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(114,47,55,0.3);">
            Fill Out Intake Form &rarr;
          </a>
        </div>

        <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
          <p style="margin: 0; font-size: 14px; color: #666;">Have questions? Just reply to this email or message me directly in your dashboard.</p>
        </div>

        <p style="color: #555; font-size: 16px; margin-top: 30px;">Talk soon,<br/><strong>Jessica Parker</strong><br/><span style="color: #888; font-size: 13px;">DFY Fulfillment Specialist, AccrediPro Academy</span></p>
      </div>

      <!-- Footer -->
      <div style="background: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
        <p style="margin: 0; font-size: 12px; color: #999;">&copy; AccrediPro Academy. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`;
}

// ============================================
// 3. Main script
// ============================================
async function main() {
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

  const summary = {
    dmsSent: 0,
    emailsSent: 0,
    skippedAlreadyHasDM: 0,
    skippedAlreadyHasEmail: 0,
    errors: 0,
  };

  try {
    // ---- Find Jessica ----
    const jessica = await prisma.user.findUnique({
      where: { email: 'jessica@accredipro-certificate.com' },
      select: { id: true, email: true },
    });

    if (!jessica) {
      console.error('ERROR: Jessica user not found (jessica@accredipro-certificate.com). Aborting.');
      process.exit(1);
    }
    console.log(`Found Jessica (ID: ${jessica.id})\n`);

    // ---- Fetch ALL DFY purchases ----
    const purchases = await prisma.dFYPurchase.findMany({
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        product: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`Total DFY purchases found: ${purchases.length}\n`);

    if (purchases.length === 0) {
      console.log('No DFY purchases found. Nothing to recover.');
      return;
    }

    // ---- Batch-check existing Jessica DMs ----
    const dfyUserIds = [...new Set(purchases.map(p => p.userId))];
    const existingDMs = await prisma.message.findMany({
      where: {
        senderId: jessica.id,
        receiverId: { in: dfyUserIds },
        messageType: 'DIRECT',
      },
      select: {
        receiverId: true,
        content: true,
      },
    });

    // Group by receiver - check for intake-related DMs specifically
    const usersWithIntakeDM = new Set();
    for (const dm of existingDMs) {
      if (dm.content.includes('intake form') || dm.content.includes("I'm Jessica")) {
        usersWithIntakeDM.add(dm.receiverId);
      }
    }
    console.log(`Users who already have Jessica's intake DM: ${usersWithIntakeDM.size}`);

    // ---- Batch-check existing welcome email tags ----
    const existingWelcomeTags = await prisma.userTag.findMany({
      where: {
        userId: { in: dfyUserIds },
        tag: 'dfy_welcome_email_sent',
      },
      select: { userId: true },
    });
    const usersWithWelcomeEmail = new Set(existingWelcomeTags.map(t => t.userId));
    console.log(`Users who already have welcome email tag: ${usersWithWelcomeEmail.size}\n`);

    console.log('='.repeat(70));
    console.log('Processing purchases...');
    console.log('='.repeat(70));

    for (const purchase of purchases) {
      const firstName = purchase.user.firstName || 'there';
      const email = purchase.user.email || '(no email)';
      const productName = purchase.product?.title || 'Done-For-You Website';
      const intakeUrl = `${BASE_URL}/dfy-intake?id=${purchase.id}`;

      console.log(`\n--- ${firstName} (${email}) ---`);
      console.log(`    Product: ${productName}`);
      console.log(`    Purchase ID: ${purchase.id}`);

      // ---- Step A: DM ----
      if (usersWithIntakeDM.has(purchase.userId)) {
        console.log('    [DM] SKIPPED - Already has Jessica intake DM');
        summary.skippedAlreadyHasDM++;
      } else {
        try {
          const dmContent = `Hey ${firstName}! \u{1F44B}\n\nI'm Jessica, and I'll be personally handling your Done For You website setup! \u{1F389}\n\nTo get started, I just need you to fill out a quick intake form (about 15 minutes). It helps me understand your coaching, your vibe, and exactly how you want your website to look.\n\n\u{1F449} Start your intake form here:\n${intakeUrl}\n\nI'll have your website ready within 7 days of receiving your form. Can't wait to build something amazing for you!`;

          await prisma.message.create({
            data: {
              senderId: jessica.id,
              receiverId: purchase.userId,
              content: dmContent,
              messageType: 'DIRECT',
            },
          });

          console.log('    [DM] SENT - Jessica intake DM created');
          summary.dmsSent++;
          // Mark so we don't double-send for same user with multiple purchases
          usersWithIntakeDM.add(purchase.userId);
        } catch (dmErr) {
          console.error(`    [DM] ERROR - ${dmErr.message}`);
          summary.errors++;
        }
      }

      // ---- Step B: Welcome Email ----
      if (usersWithWelcomeEmail.has(purchase.userId)) {
        console.log('    [EMAIL] SKIPPED - Already has dfy_welcome_email_sent tag');
        summary.skippedAlreadyHasEmail++;
      } else if (!purchase.user.email) {
        console.log('    [EMAIL] SKIPPED - No email address');
        summary.skippedAlreadyHasEmail++;
      } else {
        try {
          const emailHtml = buildWelcomeEmailHtml({
            firstName,
            productName,
            intakeUrl,
          });

          await sendResendEmail({
            to: purchase.user.email,
            subject: 'Welcome to Your Done-For-You Package! \u{1F389}',
            html: emailHtml,
          });

          // Create the UserTag record
          await prisma.userTag.upsert({
            where: {
              userId_tag: {
                userId: purchase.userId,
                tag: 'dfy_welcome_email_sent',
              },
            },
            update: {},
            create: {
              userId: purchase.userId,
              tag: 'dfy_welcome_email_sent',
            },
          });

          console.log('    [EMAIL] SENT - Welcome email sent + tag created');
          summary.emailsSent++;
          usersWithWelcomeEmail.add(purchase.userId);
        } catch (emailErr) {
          console.error(`    [EMAIL] ERROR - ${emailErr.message}`);
          summary.errors++;
        }
      }
    }

    // ---- Final Summary ----
    console.log('\n' + '='.repeat(70));
    console.log('RECOVERY COMPLETE - SUMMARY');
    console.log('='.repeat(70));
    console.log(`  Total DFY purchases processed:    ${purchases.length}`);
    console.log(`  DMs sent:                         ${summary.dmsSent}`);
    console.log(`  DMs skipped (already existed):    ${summary.skippedAlreadyHasDM}`);
    console.log(`  Emails sent:                      ${summary.emailsSent}`);
    console.log(`  Emails skipped (already tagged):  ${summary.skippedAlreadyHasEmail}`);
    console.log(`  Errors:                           ${summary.errors}`);
    console.log('='.repeat(70));

  } catch (error) {
    console.error('FATAL ERROR:', error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\nDatabase connection closed.');
  }
}

main();
