import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL not set');
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function enrollSarah() {
    const email = 'sarah@accredipro-certificate.com';
    const courseSlugs = ['fm-pro-advanced-clinical', 'fm-pro-master-depth', 'fm-pro-practice-path'];

    console.log('Looking for user:', email);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.log('❌ User not found:', email);
        return;
    }

    console.log('✅ Found user:', user.firstName, user.lastName);

    for (const slug of courseSlugs) {
        const course = await prisma.course.findFirst({ where: { slug } });
        if (!course) {
            console.log('❌ Course not found:', slug);
            continue;
        }

        const existing = await prisma.enrollment.findUnique({
            where: { userId_courseId: { userId: user.id, courseId: course.id } }
        });

        if (existing) {
            console.log('⏭️  Already enrolled in:', course.title);
        } else {
            await prisma.enrollment.create({
                data: { userId: user.id, courseId: course.id, status: 'ACTIVE', progress: 0 }
            });
            console.log('✅ Enrolled in:', course.title);
        }
    }

    console.log('\n🎉 Done!');
}

enrollSarah()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
