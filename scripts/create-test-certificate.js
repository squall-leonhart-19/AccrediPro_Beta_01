// Test script to create a certificate
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestCertificate() {
    try {
        // Get the first user
        const user = await prisma.user.findFirst({
            select: { id: true, firstName: true, lastName: true, email: true }
        });

        if (!user) {
            console.log('No users found!');
            return;
        }
        console.log('User found:', user);

        // Get the first published course
        const course = await prisma.course.findFirst({
            where: { isPublished: true },
            select: { id: true, title: true, certificateType: true }
        });

        if (!course) {
            console.log('No published courses found!');
            return;
        }
        console.log('Course found:', course);

        // Generate certificate number
        const certNumber = `FMCC-2025-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // Create the certificate
        const certificate = await prisma.certificate.create({
            data: {
                userId: user.id,
                courseId: course.id,
                certificateNumber: certNumber,
                type: course.certificateType || 'CERTIFICATION',
                isValid: true,
                issuedAt: new Date(),
            }
        });

        console.log('\n✅ Test Certificate Created!');
        console.log('Certificate Number:', certificate.certificateNumber);
        console.log('View at: /certificates/' + certificate.certificateNumber);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestCertificate();
