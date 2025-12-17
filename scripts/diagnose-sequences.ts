/**
 * Diagnostic: Check nurture sequence enrollments
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("📊 SEQUENCE DIAGNOSTIC\n");

    // 1. Check all sequences
    const sequences = await prisma.sequence.findMany({
        include: {
            triggerTag: true,
            exitTag: true,
            _count: { select: { emails: true, enrollments: true } }
        }
    });

    console.log("=== SEQUENCES ===");
    for (const seq of sequences) {
        console.log(`\n📧 ${seq.name}`);
        console.log(`   Slug: ${seq.slug}`);
        console.log(`   Active: ${seq.isActive}`);
        console.log(`   Trigger: ${seq.triggerType} (Tag: ${seq.triggerTag?.name || 'None'})`);
        console.log(`   Emails: ${seq._count.emails}`);
        console.log(`   Enrollments: ${seq._count.enrollments}`);
        console.log(`   Stats: Enrolled=${seq.totalEnrolled}, Completed=${seq.totalCompleted}, Exited=${seq.totalExited}`);
    }

    // 2. Check active enrollments
    const enrollments = await prisma.sequenceEnrollment.findMany({
        where: { status: "ACTIVE" },
        include: {
            user: { select: { email: true, firstName: true, createdAt: true } },
            sequence: { select: { name: true } }
        },
        orderBy: { enrolledAt: 'desc' },
        take: 10
    });

    console.log("\n\n=== ACTIVE ENROLLMENTS (Latest 10) ===");
    if (enrollments.length === 0) {
        console.log("❌ NO ACTIVE ENROLLMENTS FOUND!");
    } else {
        for (const e of enrollments) {
            console.log(`\n👤 ${e.user.email}`);
            console.log(`   Sequence: ${e.sequence.name}`);
            console.log(`   Current Email Index: ${e.currentEmailIndex}`);
            console.log(`   Emails Received: ${e.emailsReceived}`);
            console.log(`   Next Send At: ${e.nextSendAt}`);
            console.log(`   Enrolled At: ${e.enrolledAt}`);
        }
    }

    // 3. Check recent users who signed up for mini diploma
    const recentUsers = await prisma.user.findMany({
        where: {
            miniDiplomaOptinAt: { not: null },
            isFakeProfile: false
        },
        select: {
            email: true,
            firstName: true,
            miniDiplomaOptinAt: true,
            createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 10
    });

    console.log("\n\n=== RECENT MINI DIPLOMA SIGNUPS (Real Users) ===");
    for (const u of recentUsers) {
        console.log(`👤 ${u.email} - Opted in: ${u.miniDiplomaOptinAt}`);
    }

    // 4. Check email send stats
    const emailStats = await prisma.sequenceEmail.findMany({
        where: { sentCount: { gt: 0 } },
        select: { customSubject: true, sentCount: true, openCount: true, clickCount: true },
        orderBy: { sentCount: 'desc' },
        take: 5
    });

    console.log("\n\n=== TOP SEQUENCE EMAILS BY SENT ===");
    if (emailStats.length === 0) {
        console.log("❌ No emails have been sent yet");
    } else {
        for (const e of emailStats) {
            console.log(`📧 "${e.customSubject?.substring(0, 40)}..." - Sent: ${e.sentCount}, Opens: ${e.openCount}, Clicks: ${e.clickCount}`);
        }
    }

    // 5. Check EmailSend records
    const emailSends = await prisma.emailSend.count();
    console.log(`\n\n=== TOTAL EmailSend RECORDS: ${emailSends} ===`);

    if (emailSends > 0) {
        const recentSends = await prisma.emailSend.findMany({
            take: 5,
            orderBy: { sentAt: 'desc' },
            select: { toEmail: true, subject: true, status: true, sentAt: true }
        });
        console.log("Recent sends:");
        for (const s of recentSends) {
            console.log(`  ${s.toEmail} - "${s.subject?.substring(0, 30)}..." - ${s.status}`);
        }
    }

    await prisma.$disconnect();
}

main().catch(console.error);
