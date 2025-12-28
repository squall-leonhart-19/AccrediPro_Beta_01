
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";
import { Resend } from "resend";
import * as bcrypt from 'bcryptjs';

// --- CONFIG ---
const resend = new Resend(process.env.RESEND_API_KEY);
const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const FROM_EMAIL = process.env.FROM_EMAIL || "AccrediPro Academy <info@accredipro-certificate.com>";
const BASE_URL = process.env.SITE_URL || "https://learn.accredipro.academy";

// --- TEMPLATES ---
function emailWrapper(content: string, preheader?: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>body {font-family: sans-serif;}</style>
        </head>
        <body style="background-color: #f5f5f5; padding: 20px;">
          <div style="background: white; max-width: 600px; margin: 0 auto; border-radius: 16px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: #D4AF37; margin: 0;">AccrediPro Academy</h1>
            </div>
            <div style="padding: 40px 30px;">
                ${content}
            </div>
          </div>
        </body>
      </html>
    `;
}

async function sendWelcomeEmail(to: string, firstName: string) {
    const content = `
      <h2 style="color: #722F37;">Welcome, ${firstName}!</h2>
      <p>You've just taken an important step toward building a meaningful career in Functional Medicine — and we're honored to be part of your journey.</p>
      
      <div style="background: #FFF8DC; border: 1px solid #D4AF37; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 12px 0; color: #722F37; font-weight: bold;">Your Login Credentials:</p>
        <p style="margin: 0;"><strong>Email:</strong> ${to}</p>
        <p style="margin: 8px 0 0 0;"><strong>Password:</strong> Futurecoach2025</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${BASE_URL}/login" style="background: #722F37; color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Login to My Dashboard</a>
      </div>
    `;

    console.log(`Sending email to ${to}...`);
    return resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: `Welcome to AccrediPro, ${firstName}!`,
        html: emailWrapper(content, `Welcome ${firstName}! Your login credentials are inside.`),
    });
}

const NEW_USER = {
    email: "giancarlagureng@gmail.com",
    firstName: "Giancarla",
    lastName: "Gureng",
    tags: [
        "fm_pro_practice_path_purchased",
        "fm_pro_master_depth_purchased",
        "fm_pro_advanced_clinical_purchased",
        "clickfunnels_purchase",
        "functional_medicine_complete_certification_purchased"
    ]
};

async function main() {
    console.log(`Creating user ${NEW_USER.email}...`);

    // Check if exists
    const existing = await prisma.user.findUnique({ where: { email: NEW_USER.email } });
    if (existing) {
        console.log("User already exists! Updating tags...");
        for (const tag of NEW_USER.tags) {
            await prisma.userTag.upsert({
                where: { userId_tag: { userId: existing.id, tag } },
                create: { userId: existing.id, tag },
                update: {}
            });
        }
        console.log("Tags updated.");
        await sendWelcomeEmail(NEW_USER.email, NEW_USER.firstName);
        console.log("Credentials resent.");
        return;
    }

    const hashedPassword = await bcrypt.hash("Futurecoach2025", 12);

    const user = await prisma.user.create({
        data: {
            email: NEW_USER.email,
            firstName: NEW_USER.firstName,
            lastName: NEW_USER.lastName,
            passwordHash: hashedPassword,
            role: "STUDENT",
            isActive: true,
            leadSource: "Manual Entry",
            tags: {
                create: NEW_USER.tags.map(tag => ({ tag }))
            }
        }
    });

    console.log(`✅ User created: ${user.id}`);
    await sendWelcomeEmail(NEW_USER.email, NEW_USER.firstName);
    console.log(`✅ Email sent.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
