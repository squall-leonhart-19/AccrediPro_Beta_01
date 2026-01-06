
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

async function checkModels() {
    const userId = 'cmk32ry1q005704jxi13sh46f';
    console.log(`Checking models for user: ${userId}`);

    const checks = [
        { name: 'User', query: () => prisma.user.findUnique({ where: { id: userId } }) },
        { name: 'LoginHistory', query: () => prisma.loginHistory.findFirst({ where: { userId } }) },
        { name: 'Enrollment', query: () => prisma.enrollment.findFirst({ where: { userId } }) },
        { name: 'LessonProgress', query: () => prisma.lessonProgress.findFirst({ where: { userId } }) },
        { name: 'Certificate', query: () => prisma.certificate.findFirst({ where: { userId } }) },
        { name: 'UserActivity', query: () => prisma.userActivity.findFirst({ where: { userId } }) },
        { name: 'Payment', query: () => prisma.payment.findFirst({ where: { userId } }) },
        { name: 'ResourceDownload', query: () => prisma.resourceDownload.findFirst({ where: { userId } }) },
        { name: 'QuizAttempt', query: () => prisma.quizAttempt.findFirst({ where: { userId } }) },
        { name: 'EmailSend', query: () => prisma.emailSend.findFirst({ where: { userId } }) },
        { name: 'SupportTicket', query: () => prisma.supportTicket.findFirst({ where: { userId } }) },
        { name: 'Message', query: () => prisma.message.findFirst({ where: { senderId: userId } }) },
        { name: 'PodMessage', query: () => prisma.podMessage.findFirst({ where: { senderId: userId } }) },
        { name: 'PodMember', query: () => prisma.podMember.findFirst({ where: { userId } }) }
    ];

    for (const check of checks) {
        try {
            await check.query();
            console.log(`✅ ${check.name}: OK`);
        } catch (error) {
            console.error(`❌ ${check.name}: FAILED`);
            console.error(error.message);
        }
    }
}

checkModels()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
