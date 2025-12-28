import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
import { Resend } from 'resend';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL not set');
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "AccrediPro Academy <info@accredipro-certificate.com>";
const BASE_URL = process.env.SITE_URL || "https://learn.accredipro.academy";

async function enrollTaunya() {
    const email = 'googinrn@yahoo.com';
    const firstName = 'Taunya';
    const lastName = 'Hazen';
    const defaultPassword = 'Futurecoach2025';

    // Tags to add
    const tags = [
        'fm_pro_practice_path_purchased',
        'fm_pro_master_depth_purchased',
        'fm_pro_advanced_clinical_purchased',
        'clickfunnels_purchase',
        'functional_medicine_complete_certification_purchased'
    ];

    // Courses to enroll
    const courseSlugs = [
        'functional-medicine-complete-certification',
        'fm-pro-advanced-clinical',
        'fm-pro-master-depth',
        'fm-pro-practice-path'
    ];

    console.log('🔍 Looking for user:', email);

    let user = await prisma.user.findUnique({ where: { email } });
    let isNewUser = false;

    if (!user) {
        console.log('📝 Creating new user...');
        const passwordHash = await bcrypt.hash(defaultPassword, 12);
        user = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                passwordHash,
                role: 'STUDENT',
                isActive: true,
                leadSource: 'ClickFunnels',
                leadSourceDetail: 'Coach Business Toolkit',
                miniDiplomaCategory: 'functional-medicine', // Assuming FM based
                miniDiplomaOptinAt: new Date()
            }
        });
        isNewUser = true;
        console.log('✅ Created user:', user.id);
    } else {
        console.log('✅ Found existing user:', user.id);
        // Ensure name is updated if missing
        if (!user.firstName || !user.lastName) {
            user = await prisma.user.update({
                where: { id: user.id },
                data: { firstName, lastName }
            });
            console.log('✏️  Updated user name details');
        }

        // Force reset password to ensure the email is correct
        console.log('🔐 Resetting password to default...');
        const passwordHash = await bcrypt.hash(defaultPassword, 12);
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash }
        });
    }

    // Add Tags
    console.log('🏷️  Adding tags...');
    for (const tag of tags) {
        await prisma.userTag.upsert({
            where: { userId_tag: { userId: user.id, tag } },
            update: {},
            create: { userId: user.id, tag }
        });
    }

    // Enroll in Courses
    console.log('📚 Enrolling in courses...');
    for (const slug of courseSlugs) {
        const course = await prisma.course.findFirst({ where: { slug } });
        if (!course) {
            console.error('❌ Course not found:', slug);
            continue;
        }

        const existing = await prisma.enrollment.findUnique({
            where: { userId_courseId: { userId: user.id, courseId: course.id } }
        });

        if (existing) {
            console.log(`- Already enrolled in ${course.title} (${slug})`);
        } else {
            await prisma.enrollment.create({
                data: { userId: user.id, courseId: course.id, status: 'ACTIVE', progress: 0 }
            });
            console.log(`✅ Enrolled in ${course.title}`);

            // Auto-complete lesson 1 for main cert if needed (replicating webhook logic)
            if (slug === 'functional-medicine-complete-certification') {
                const lesson1 = await prisma.lesson.findFirst({
                    where: { module: { courseId: course.id }, order: 0 }
                });
                if (lesson1) {
                    await prisma.lessonProgress.upsert({
                        where: { userId_lessonId: { userId: user.id, lessonId: lesson1.id } },
                        update: { isCompleted: true },
                        create: { userId: user.id, lessonId: lesson1.id, isCompleted: true }
                    });
                    console.log('  - Auto-completed Lesson 1');
                }
            }
        }
    }

    // Send Welcome Email (Login Info)
    // We send this regardless if new or old, because user specifically asked to "Send login info"
    console.log('📧 Sending login info email...');

    const emailContent = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #722F37;">Welcome to AccrediPro, ${firstName}!</h2>
            <p>We've set up your access to the Functional Medicine Certification and Pro Accelerator tracks.</p>
            
            <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #722F37;">Your Login Credentials</h3>
                <p style="margin-bottom: 5px;"><strong>URL:</strong> <a href="${BASE_URL}/login">${BASE_URL}/login</a></p>
                <p style="margin-bottom: 5px;"><strong>Email:</strong> ${email}</p>
                <p style="margin-bottom: 0;"><strong>Password:</strong> ${defaultPassword}</p>
            </div>

            <p>You have been enrolled in:</p>
            <ul>
                <li>Functional Medicine Certified Practitioner</li>
                <li>Pro Accelerator: Advanced Clinical Pearls</li>
                <li>Pro Accelerator: Master DEPTH</li>
                <li>Pro Accelerator: Practice Path</li>
            </ul>

            <p>If you have any questions, simply reply to this email.</p>
            
            <p>Warmly,<br>The AccrediPro Team</p>
        </div>
    `;

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'Your Login Details - AccrediPro Academy',
            html: emailContent
        });
        console.log('✅ Email sent successfully!');
    } catch (err) {
        console.error('❌ Failed to send email:', err);
    }

    console.log('\n🎉 Enrollment process finished!');
}

enrollTaunya()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
