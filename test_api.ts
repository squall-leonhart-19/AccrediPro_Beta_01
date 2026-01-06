
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

async function testUserActivityAPI() {
    const userId = 'cmk32ry1q005704jxi13sh46f';
    console.log(`Testing user-activity API logic for: ${userId}`);

    try {
        const [
            user,
            loginHistory,
            firstLoginRecord,
            enrollments,
            lessonProgressCount,
            recentLessonProgress,
            certificates,
            activityLogsCount,
            payments,
            resourceDownloads,
            quizAttempts,
            emailSends,
            supportTickets,
            privateMessageCount,
            communityMessageCount, // Will be 0 (fallback)
            podMembership, // Will be null (fallback)
        ] = await Promise.all([
            prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    createdAt: true,
                    firstLoginAt: true,
                    lastLoginAt: true,
                    loginCount: true,
                    emailVerified: true,
                    registrationIp: true,
                    registrationUserAgent: true,
                    registrationDevice: true,
                    registrationBrowser: true,
                    tosAcceptedAt: true,
                    tosVersion: true,
                    refundPolicyAcceptedAt: true,
                    refundPolicyVersion: true,
                },
            }),

            prisma.loginHistory.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                take: 50,
                select: {
                    id: true,
                    createdAt: true,
                    ipAddress: true,
                    userAgent: true,
                    device: true,
                    browser: true,
                },
            }),

            prisma.loginHistory.findFirst({
                where: { userId },
                orderBy: { createdAt: "asc" },
                select: {
                    ipAddress: true,
                    userAgent: true,
                    device: true,
                    browser: true,
                }
            }),

            prisma.enrollment.findMany({
                where: { userId },
                select: {
                    id: true,
                    status: true,
                    progress: true,
                    enrolledAt: true,
                    completedAt: true,
                    lastAccessedAt: true,
                    course: {
                        select: { id: true, title: true, slug: true },
                    },
                },
                orderBy: { enrolledAt: "desc" },
            }),

            prisma.lessonProgress.count({
                where: { userId, isCompleted: true },
            }),

            prisma.lessonProgress.findMany({
                where: { userId },
                select: {
                    id: true,
                    isCompleted: true,
                    watchTime: true,
                    timeSpent: true,
                    visitCount: true,
                    completedAt: true,
                    updatedAt: true,
                    lesson: {
                        select: {
                            id: true,
                            title: true,
                            module: {
                                select: {
                                    title: true,
                                    course: {
                                        select: { title: true },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: { updatedAt: "desc" },
                take: 30,
            }),

            prisma.certificate.findMany({
                where: { userId },
                select: {
                    id: true,
                    certificateNumber: true,
                    issuedAt: true,
                    type: true,
                    score: true,
                    course: {
                        select: { title: true },
                    },
                    module: {
                        select: { title: true },
                    },
                },
                orderBy: { issuedAt: "desc" },
            }),

            prisma.userActivity.count({
                where: { userId },
            }),

            prisma.payment.findMany({
                where: { userId },
                select: {
                    id: true,
                    amount: true,
                    currency: true,
                    transactionId: true,
                    paymentMethod: true,
                    cardLast4: true,
                    cardBrand: true,
                    billingEmail: true,
                    billingName: true,
                    ipAddress: true,
                    productName: true,
                    productSku: true,
                    status: true,
                    createdAt: true,
                },
                orderBy: { createdAt: "desc" },
            }),

            prisma.resourceDownload.findMany({
                where: { userId },
                select: {
                    id: true,
                    ipAddress: true,
                    userAgent: true,
                    createdAt: true,
                    resource: {
                        select: {
                            title: true,
                            type: true,
                            url: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: 50,
            }),

            prisma.quizAttempt.findMany({
                where: { userId },
                select: {
                    id: true,
                    score: true,
                    passed: true,
                    timeSpent: true,
                    startedAt: true,
                    completedAt: true,
                    quiz: {
                        select: {
                            title: true,
                            module: {
                                select: { title: true },
                            },
                        },
                    },
                },
                orderBy: { completedAt: "desc" },
                take: 20,
            }),

            prisma.emailSend.findMany({
                where: { userId },
                select: {
                    id: true,
                    toEmail: true,
                    subject: true,
                    status: true,
                    sentAt: true,
                    deliveredAt: true,
                    openedAt: true,
                    clickedAt: true,
                    bouncedAt: true,
                },
                orderBy: { sentAt: "desc" },
                take: 50,
            }),

            prisma.supportTicket.findMany({
                where: { userId },
                select: {
                    id: true,
                    ticketNumber: true,
                    subject: true,
                    status: true,
                    category: true,
                    createdAt: true,
                    resolvedAt: true,
                    closedAt: true,
                    messages: {
                        select: {
                            content: true,
                            isFromCustomer: true,
                            createdAt: true,
                        },
                        orderBy: { createdAt: "asc" },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),

            prisma.message.count({
                where: {
                    OR: [
                        { senderId: userId },
                        { receiverId: userId }
                    ]
                }
            }),

            // DISABLED - Tables don't exist
            Promise.resolve(0), // communityMessageCount fallback
            Promise.resolve(null) // podMembership fallback
        ]);

        console.log('\n=== API SIMULATION RESULTS ===\n');
        console.log('User:', user?.email);
        console.log('TOS Accepted:', user?.tosAcceptedAt);
        console.log('Registration IP:', user?.registrationIp);
        console.log('First Login:', user?.firstLoginAt);
        console.log('Last Login:', user?.lastLoginAt);
        console.log('Login Count:', user?.loginCount);
        console.log('\nLogin History Count:', loginHistory.length);
        console.log('Enrollments Count:', enrollments.length);
        console.log('Lesson Progress Count:', lessonProgressCount);
        console.log('Payments Count:', payments.length);
        console.log('\n✅ API SIMULATION SUCCESSFUL - All queries work!');

    } catch (error) {
        console.error('❌ API SIMULATION FAILED:', error);
    }
}

testUserActivityAPI()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
