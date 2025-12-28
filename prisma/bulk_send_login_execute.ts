
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

// --- TASKS ---
const tasks = [
    {
        userId: "cmjods9zs001v04l8o9els4l1", // Tricia Jefferson
        targetEmail: "Tricia.jefferson12@gmail.com",
        name: "Tricia Jefferson"
    },
    {
        userId: "cmjodn6ex000i04js5fp4u3m7", // Natalie Hall
        targetEmail: "heartsforpeace@aol.com",
        name: "Natalie Hall"
    },
    {
        userId: "cmjoc2ssd000h04jogttbwmgb", // Donika Bonfadini
        targetEmail: "dbonfadini2442@gmail.com",
        name: "Donika Bonfadini"
    },
    {
        userId: "cmjo9m064000004jonaa04w05", // Marcy Matteson
        targetEmail: "MarcyMatteson@msn.com",
        name: "Marcy Matteson"
    }
];

async function main() {
    console.log("Starting bulk login send...");
    const hashedPassword = await bcrypt.hash("Futurecoach2025", 12);

    for (const task of tasks) {
        console.log(`\nProcessing ${task.name}...`);
        try {
            // Update User
            const updatedUser = await prisma.user.update({
                where: { id: task.userId },
                data: {
                    email: task.targetEmail.toLowerCase(), // Ensure lowercase in DB
                    passwordHash: hashedPassword
                }
            });
            console.log(`✅ User updated: ${updatedUser.email}`);

            // Send Email (use original casing for display if preferred, but usually lowercase for sending is safer)
            await sendWelcomeEmail(task.targetEmail, task.name.split(' ')[0]);
            console.log(`✅ Email sent to ${task.targetEmail}`);

        } catch (error) {
            console.error(`❌ Failed to process ${task.name}:`, error);
        }
    }
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
