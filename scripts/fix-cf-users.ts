import prisma from '../src/lib/prisma';
import { sendWelcomeEmail } from '../src/lib/email';

async function main() {
    console.log('\n=== FIXING ALL CF USERS ===\n');

    // Get all users with CF in their leadSource
    const cfUsers = await prisma.user.findMany({
        where: {
            OR: [
                { leadSource: { contains: 'ClickFunnels' } },
                { leadSourceDetail: { contains: 'ClickFunnels' } }
            ]
        },
        include: {
            enrollments: true,
            tags: true
        }
    });

    console.log(`Found ${cfUsers.length} CF users\n`);

    // Get the main course
    const fmCourse = await prisma.course.findFirst({
        where: { slug: 'functional-medicine-complete-certification' }
    });

    if (!fmCourse) {
        console.error('ERROR: Course functional-medicine-complete-certification not found!');
        return;
    }

    console.log(`Course found: ${fmCourse.title} (${fmCourse.id})\n`);

    let emailsSent = 0;
    let tagsAdded = 0;
    let enrollmentsCreated = 0;
    let errors: string[] = [];

    for (const user of cfUsers) {
        console.log(`Processing: ${user.email}`);

        try {
            // 1. Add clickfunnels_purchase tag
            const hasTag1 = user.tags.some(t => t.tag === 'clickfunnels_purchase');
            if (!hasTag1) {
                await prisma.userTag.upsert({
                    where: { userId_tag: { userId: user.id, tag: 'clickfunnels_purchase' } },
                    update: {},
                    create: { userId: user.id, tag: 'clickfunnels_purchase' }
                });
                tagsAdded++;
            }

            // 2. Add functional_medicine_complete_certification_purchased tag
            const hasTag2 = user.tags.some(t => t.tag === 'functional_medicine_complete_certification_purchased');
            if (!hasTag2) {
                await prisma.userTag.upsert({
                    where: { userId_tag: { userId: user.id, tag: 'functional_medicine_complete_certification_purchased' } },
                    update: {},
                    create: { userId: user.id, tag: 'functional_medicine_complete_certification_purchased' }
                });
                tagsAdded++;
            }

            // 3. Enroll in course if not already enrolled
            const isEnrolled = user.enrollments.some(e => e.courseId === fmCourse.id);
            if (!isEnrolled) {
                await prisma.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: fmCourse.id,
                        status: 'ACTIVE',
                        progress: 0
                    }
                });
                enrollmentsCreated++;
                console.log(`  ✅ Enrolled in ${fmCourse.slug}`);
            }

            // 4. Send welcome email
            if (user.email) {
                const result = await sendWelcomeEmail(user.email, user.firstName || 'Student');
                if (result.success) {
                    emailsSent++;
                    console.log(`  ✅ Welcome email sent`);
                } else {
                    errors.push(`${user.email}: Email failed - ${result.error}`);
                    console.log(`  ❌ Email failed`);
                }
            }

        } catch (err) {
            errors.push(`${user.email}: ${err}`);
            console.log(`  ❌ Error: ${err}`);
        }
    }

    console.log('\n=== SUMMARY ===\n');
    console.log(`Total users processed: ${cfUsers.length}`);
    console.log(`Emails sent: ${emailsSent}`);
    console.log(`Tags added: ${tagsAdded}`);
    console.log(`Enrollments created: ${enrollmentsCreated}`);
    console.log(`Errors: ${errors.length}`);

    if (errors.length > 0) {
        console.log('\n=== ERRORS ===\n');
        errors.forEach(e => console.log(e));
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
